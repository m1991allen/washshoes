import "server-only";
import { adminDb, isAdminConfigured } from "@/lib/firebase/admin";
import { COLLECTIONS, type HomeHeroDoc } from "./types";

/** Single settings doc that holds the homepage hero visual config. */
const DOC_ID = "homeHero";

/**
 * Read the homepage hero config. Returns {} when Firebase isn't configured so
 * the public site never breaks (falls back to the icon placeholder).
 */
export async function getHomeHero(): Promise<HomeHeroDoc> {
  if (!isAdminConfigured()) return {};
  const snap = await adminDb().collection(COLLECTIONS.settings).doc(DOC_ID).get();
  return snap.exists ? (snap.data() as HomeHeroDoc) : {};
}

/** Replace the homepage hero config. The editor always submits the full doc. */
export async function saveHomeHero(doc: HomeHeroDoc): Promise<void> {
  await adminDb().collection(COLLECTIONS.settings).doc(DOC_ID).set(doc);
}
