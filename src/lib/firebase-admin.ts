import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let cached: ReturnType<typeof getFirestore> | null = null;

export function adminDb() {
  if (!cached) {
    if (!getApps().length) {
      const inline = process.env.FIREBASE_SERVICE_ACCOUNT;
      const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (inline) initializeApp({ credential: cert(JSON.parse(inline)) });
      else if (keyFile) initializeApp({ credential: cert(keyFile) });
      else throw new Error("Firebase credentials are not set");
    }
    cached = getFirestore();
  }
  return cached;
}
