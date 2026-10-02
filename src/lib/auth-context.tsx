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
import { doc, setDoc, getDoc } from "firebase/firestore";
import { clientAuth, clientDb } from "./firebase-client";

export class AuthError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export function publicUserId(uid: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < uid.length; i++) {
    h ^= uid.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `CHT-${(h >>> 0).toString(36).toUpperCase().padStart(7, "0").slice(-6)}`;
}

function toAuthError(e: unknown): AuthError {
  const code = typeof e === "object" && e && "code" in e ? String((e as { code: unknown }).code) : "auth/unknown";
  return new AuthError(code, code);
}

async function saveUserDoc(user: User, name?: string) {
  const ref = doc(clientDb, "users", user.uid);
  let prev: Record<string, unknown> = {};
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) prev = snap.data();
  } catch {}
  await setDoc(
    ref,
    {
      email: user.email ?? "",
      name: name ?? user.displayName ?? (typeof prev.name === "string" ? prev.name : ""),
      photo: user.photoURL ?? (typeof prev.photo === "string" ? prev.photo : ""),
      user_id: typeof prev.user_id === "string" && prev.user_id ? prev.user_id : publicUserId(user.uid),
      created_at: typeof prev.created_at === "string" && prev.created_at ? prev.created_at : new Date().toISOString(),
      disabled: prev.disabled === true,
      updated_at: new Date().toISOString(),
    },
    { merge: true }
  );
}

type AuthState = {
  user: User | null;
  loading: boolean;
  notice: string | null;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingCred, setPendingCred] = useState<AuthCredential | null>(null);

  useEffect(() => onAuthStateChanged(clientAuth, (u) => {
    (async () => {
      if (u) {
        try {
          const snap = await getDoc(doc(clientDb, "users", u.uid));
          if (snap.data()?.disabled === true) {
            await signOut(clientAuth);
            setNotice("disabled");
            setUser(null);
            setLoading(false);
            return;
          }
          if (!snap.exists() || !snap.data()?.user_id) await saveUserDoc(u);
        } catch {}
      }
      setUser(u);
      setLoading(false);
    })();
  }), []);

  const val = useMemo<AuthState>(
    () => ({
      user,
      loading,
      notice,
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
    [user, loading, notice]
  );

  return <Ctx.Provider value={val}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
};
