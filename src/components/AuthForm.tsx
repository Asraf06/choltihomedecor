"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, AlertCircle } from "lucide-react";
import { useAuth, AuthError } from "@/lib/auth-context";
import { useLang } from "@/lib/lang";

function messageFor(code: string, t: { errAuth: string; errInUse: string; errWeak: string; errPopup: string; errLinkNeeded: string }) {
  if (code === "auth/email-already-in-use") return t.errInUse;
  if (code === "auth/weak-password") return t.errWeak;
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return t.errPopup;
  if (code === "auth/account-exists-with-different-credential") return t.errLinkNeeded;
  return t.errAuth;
}

export default function AuthForm() {
  const { user, signInGoogle, signInEmail, signUpEmail } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [badEmail, setBadEmail] = useState(false);
  const [badPass, setBadPass] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    // Came from inside the shop: go back. Direct visit: go home instead of blank.
    try {
      if (document.referrer.startsWith(window.location.origin)) router.back();
      else router.push("/");
    } catch {
      router.push("/");
    }
  }, [user, router]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(messageFor(e instanceof AuthError ? e.code : "", t));
    } finally {
      setBusy(false);
    }
  };

  const submitEmail = () => {
    if (!email.trim()) {
      setError(t.emailRequired);
      setBadEmail(true);
      setBadPass(false);
      emailRef.current?.focus();
      return;
    }
    if (!password) {
      setError(t.passwordRequired);
      setBadPass(true);
      setBadEmail(false);
      passRef.current?.focus();
      return;
    }
    setBadEmail(false);
    setBadPass(false);
    run(() => (mode === "in" ? signInEmail(email, password) : signUpEmail(name, email, password)));
  };

  return (
    <div className="w-full">
      <b className="font-serif text-2xl md:text-[22px]">{mode === "in" ? t.loginTitle : t.signUp}</b>
      <p className="text-[17px] text-muted mt-1 mb-4 md:mb-2.5">{t.loginSub}</p>
      {error && (
        <p role="alert" className="flex items-center gap-2 rounded-xl border border-clay/40 bg-clay-light px-3.5 py-2.5 text-[17px] font-bold text-clay mb-3">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </p>
      )}
      <button
        disabled={busy}
        onClick={() => run(signInGoogle)}
          className="w-full inline-flex justify-center items-center gap-2 bg-white border border-line rounded-[35px] py-3 md:py-2.5 text-[17px] font-bold hover:border-gold disabled:opacity-50 text-[#2B2320]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.8-5 3.8-8.9z" />
          <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.2 0-5.9-2.1-6.8-5l-.1.1-3.7 2.9v.1C3.3 21.3 7.3 24 12 24z" />
          <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.1-3.6-2.8-.1.1C.5 8.6 0 10.2 0 12s.5 3.4 1.4 4.9l3.8-2.5z" />
          <path fill="#EA4335" d="M12 4.6c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.7 1.4 6.8l3.8 2.9c.9-2.9 3.6-5.1 6.8-5.1z" />
        </svg>
        {t.googleContinue}
      </button>
      <div className="flex items-center gap-3 my-4 md:my-2.5">
        <span className="flex-1 h-px bg-line" />
        <Mail size={14} className="text-muted" />
        <span className="flex-1 h-px bg-line" />
      </div>
      {mode === "up" && (
        <label className="block text-base font-bold mb-2.5">
          {t.yourName}
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className="mt-1.5 w-full h-[42px] border border-line bg-sand rounded-xl px-3.5 text-lg font-normal outline-none" />
        </label>
      )}
      <label className="block text-base font-bold mb-2.5 md:mb-2">
        {t.emailAddress} <span aria-hidden className="text-clay">*</span>
        <input ref={emailRef} value={email} onChange={(e) => { setEmail(e.target.value); setBadEmail(false); }} type="email" autoComplete="email" required maxLength={80} placeholder={t.emailPh} className={`mt-1.5 md:mt-1 w-full h-[42px] md:h-[40px] border rounded-xl px-3.5 text-lg font-normal outline-none placeholder:text-muted/70 ${badEmail ? "border-clay ring-2 ring-clay/30 bg-sand" : "border-line bg-sand"}`} />
      </label>
      <label className="block text-base font-bold mb-4 md:mb-2.5">
        {t.passwordLabel} <span aria-hidden className="text-clay">*</span>
        <input ref={passRef} value={password} onChange={(e) => { setPassword(e.target.value); setBadPass(false); }} type="password" autoComplete={mode === "in" ? "current-password" : "new-password"} required placeholder={t.passwordPh} className={`mt-1.5 md:mt-1 w-full h-[42px] md:h-[40px] border rounded-xl px-3.5 text-lg font-normal outline-none ${badPass ? "border-clay ring-2 ring-clay/30 bg-sand" : "border-line bg-sand"}`} />
      </label>
      <button
        disabled={busy}
        onClick={submitEmail}
        className="w-full inline-flex justify-center items-center bg-clay text-white rounded-[35px] py-3 md:py-2.5 text-[17px] font-bold hover:bg-clay-dark disabled:opacity-50"
      >
        {mode === "in" ? t.signIn : t.signUp}
      </button>
      <button onClick={() => { setMode(mode === "in" ? "up" : "in"); setError(null); }} className="w-full text-center text-[17px] font-bold text-clay mt-3">
        {mode === "in" ? t.needAccount : t.haveAccount}
      </button>
    </div>
  );
}
