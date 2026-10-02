import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Public web config. apiKey in client code is normal Firebase practice.
const config = {
  apiKey: "AIzaSyA945ovEWbxFlXn-4BVM5fW-MlX1CSMUGM",
  authDomain: "choltihomedecor-8bd24.firebaseapp.com",
  projectId: "choltihomedecor-8bd24",
  storageBucket: "choltihomedecor-8bd24.firebasestorage.app",
  messagingSenderId: "19056523769",
  appId: "1:19056523769:web:6c649e693e65d84856a528",
};

const app = getApps().length ? getApps()[0] : initializeApp(config);

export const clientAuth = getAuth(app);
export const clientDb = getFirestore(app);
export const clientStorage = getStorage(app);
