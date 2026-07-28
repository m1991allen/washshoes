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
import { getApps, getApp, initializeApp, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY. See .env.example.");
  }
  // Accepts the service-account JSON verbatim or base64-encoded. JSON.parse
  // turns the key's escaped "\n" back into real newlines for us.
  try {
    const json = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    const { project_id, client_email, private_key } = JSON.parse(json);
    return { projectId: project_id, clientEmail: client_email, privateKey: private_key };
  } catch {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is not valid service-account JSON (or base64 of it).",
    );
  }
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
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
