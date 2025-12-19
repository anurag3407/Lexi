import { getApps , initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDHkfwd5dV-EdO6tidlRI419VyeZwwyCMk",
  authDomain: "lexi-bd3e0.firebaseapp.com",
  projectId: "lexi-bd3e0",
  storageBucket: "lexi-bd3e0.firebasestorage.app",
  messagingSenderId: "68786072580",
  appId: "1:68786072580:web:7f0757f0280d158a769951",
  measurementId: "G-563FBEMCMQ"
};


//to remove duplicate initialization error

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };