import { getApps, initializeApp, App, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";

let app: App | undefined;
let adminDb: Firestore;
let adminStorage: Storage;

// Only initialize if all required environment variables are present
const hasRequiredEnvVars = 
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

if (hasRequiredEnvVars) {
  if (getApps().length === 0) {
    // Using environment variable for service account
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    app = initializeApp({
      credential: cert(serviceAccount as Parameters<typeof cert>[0]),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } else {
    app = getApps()[0];
  }

  adminDb = getFirestore(app);
  adminStorage = getStorage(app);
} else {
  console.warn(
    "Firebase Admin SDK not initialized. Missing required environment variables:",
    "FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
  );
  // Create placeholder that throws error when accessed
  adminDb = new Proxy({} as Firestore, {
    get: () => {
      throw new Error("Firebase Admin not configured. Please add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to your .env file.");
    },
  });
  adminStorage = new Proxy({} as Storage, {
    get: () => {
      throw new Error("Firebase Admin not configured. Please add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to your .env file.");
    },
  });
}

export { app as adminApp, adminDb, adminStorage };
