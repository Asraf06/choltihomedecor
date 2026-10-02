import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Public web config. apiKey in client code is normal Firebase practice.
const config = {
  apiKey: "AIzaSyAz2gNxH5ItL-0Zp0OWoTqCwRrwsJq7-sw",
  authDomain: "choltihomedecor-a2db3.firebaseapp.com",
  projectId: "choltihomedecor-a2db3",
  storageBucket: "choltihomedecor-a2db3.firebasestorage.app",
  messagingSenderId: "656524477508",
  appId: "1:656524477508:web:01cac1dde2733ddb61a811",
};

const app = getApps().length ? getApps()[0] : initializeApp(config);

export const clientAuth = getAuth(app);
export const clientDb = getFirestore(app);
export const clientStorage = getStorage(app);
