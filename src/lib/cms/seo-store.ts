import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS, type SeoDoc } from "./types";
import type { Locale } from "@/i18n/config";
import type { PageKey, SeoEntry } from "@/lib/seo";

/** Read one page's SEO overrides (all locales). */
export async function getSeoDoc(page: PageKey): Promise<SeoDoc | null> {
  const snap = await adminDb().collection(COLLECTIONS.seo).doc(page).get();
  return snap.exists ? (snap.data() as SeoDoc) : null;
}

/** Read every page's SEO overrides, keyed by page id. */
export async function getAllSeoDocs(): Promise<Record<string, SeoDoc>> {
  const snap = await adminDb().collection(COLLECTIONS.seo).get();
  const out: Record<string, SeoDoc> = {};
  snap.forEach((doc) => {
    out[doc.id] = doc.data() as SeoDoc;
  });
  return out;
}

/**
 * Save one page+locale SEO override. Empty fields are omitted so the page falls
 * back to the static default in `lib/seo.ts`. Uses a deep merge so the other
 * locale on the same document is preserved.
 */
export async function saveSeoEntry(
  page: PageKey,
  locale: Locale,
  entry: Partial<SeoEntry>,
): Promise<void> {
  const clean: Record<string, unknown> = {};
  if (entry.title?.trim()) clean.title = entry.title.trim();
  if (entry.description?.trim()) clean.description = entry.description.trim();
  if (entry.keywords && entry.keywords.length > 0) clean.keywords = entry.keywords;
  if (entry.ogImage?.trim()) clean.ogImage = entry.ogImage.trim();

  await adminDb()
    .collection(COLLECTIONS.seo)
    .doc(page)
    .set({ [locale]: clean }, { merge: true });
}
