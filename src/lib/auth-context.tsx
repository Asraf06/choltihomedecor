"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  linkWithCredential,
  type User,
  type AuthCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { clientAuth, clientDb } from "./firebase-client";

export class AuthError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function toAuthError(e: unknown): AuthError {
  const code = typeof e === "object" && e && "code" in e ? String((e as { code: unknown }).code) : "auth/unknown";
  return new AuthError(code, code);
}

async function saveUserDoc(user: User, name?: string) {
  await setDoc(
    doc(clientDb, "users", user.uid),
    {
      email: user.email ?? "",
      name: name ?? user.displayName ?? "",
      photo: user.photoURL ?? "",
      updated_at: new Date().toISOString(),
    },
    { merge: true }
  );
}

type AuthState = {
  user: User | null;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingCred, setPendingCred] = useState<AuthCredential | null>(null);

  useEffect(() => onAuthStateChanged(clientAuth, (u) => {
    setUser(u);
    setLoading(false);
  }), []);

  const val = useMemo<AuthState>(
    () => ({
      user,
      loading,
      signInGoogle: async () => {
        try {
          const cred = await signInWithPopup(clientAuth, new GoogleAuthProvider());
          await saveUserDoc(cred.user);
        } catch (e) {
          // Same email already has a password account. Keep the Google
          // credential and ask for the password; it links on sign-in below.
          const code = typeof e === "object" && e && "code" in e ? String((e as { code: unknown }).code) : "";
          if (code === "auth/account-exists-with-different-credential") {
            const pending = GoogleAuthProvider.credentialFromError(e as never);
            if (pending) setPendingCred(pending);
          }
          throw toAuthError(e);
        }
      },
      signInEmail: async (email, password) => {
        try {
          const cred = await signInWithEmailAndPassword(clientAuth, email.trim(), password);
          if (pendingCred) {
            await linkWithCredential(cred.user, pendingCred);
            setPendingCred(null);
          }
        } catch (e) {
          throw toAuthError(e);
        }
      },
      signUpEmail: async (name, email, password) => {
        try {
          const cred = await createUserWithEmailAndPassword(clientAuth, email.trim(), password);
          if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() });
          await saveUserDoc(cred.user, name.trim());
        } catch (e) {
          throw toAuthError(e);
        }
      },
      signOutUser: async () => {
        await signOut(clientAuth);
      },
    }),
    [user, loading]
  );

  return <Ctx.Provider value={val}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
};
