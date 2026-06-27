/**
 * Firebase Admin SDK (server only).
 *
 * Privileged access used by server components, route handlers and middleware to
 * verify session cookies, read/write Firestore and manage users/roles. Reads the
 * secret service-account credentials from env. Initialised lazily so importing
 * this module never throws at build time — it only throws if a function is
 * actually called without the env vars configured.
 */
import "server-only";
import {
  getApps,
  getApp,
  initializeApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET ??
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

function getServiceAccount() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Env files store the key with literal "\n"; convert back to real newlines.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin env vars (FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY). See .env.example."
    );
  }
  return { projectId, clientEmail, privateKey };
}

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}

export function getAdminApp(): App {
  if (getApps().length) return getApp();
  return initializeApp({
    credential: cert(getServiceAccount()),
    storageBucket,
  });
}

export function adminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function adminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function adminStorage(): Storage {
  return getStorage(getAdminApp());
}
