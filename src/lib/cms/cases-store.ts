import "server-only";
import { adminDb, isAdminConfigured } from "@/lib/firebase/admin";
import { COLLECTIONS, type CaseDoc } from "./types";
import { deleteImageByUrl } from "./storage";

function sort(cases: CaseDoc[]): CaseDoc[] {
  return [...cases].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** All cases (any publish state), ordered — for the admin screen. */
export async function getAllCases(): Promise<CaseDoc[]> {
  if (!isAdminConfigured()) return [];
  const snap = await adminDb().collection(COLLECTIONS.cases).get();
  const cases = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CaseDoc, "id">) }));
  return sort(cases);
}

/** Published cases only, ordered — for the public site. */
export async function getPublishedCases(): Promise<CaseDoc[]> {
  if (!isAdminConfigured()) return [];
  const all = await getAllCases();
  return all.filter((c) => c.published);
}

/** Create or update a case. Undefined fields are dropped (Firestore rejects them). */
export async function upsertCase(input: CaseDoc): Promise<void> {
  const { id, ...rest } = input;
  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rest)) {
    if (v !== undefined) data[k] = v;
  }
  await adminDb().collection(COLLECTIONS.cases).doc(id).set(data, { merge: true });
}

/** Delete a case and best-effort remove its images from Storage. */
export async function deleteCase(id: string): Promise<void> {
  const ref = adminDb().collection(COLLECTIONS.cases).doc(id);
  const snap = await ref.get();
  if (snap.exists) {
    const data = snap.data() as CaseDoc;
    if (data.beforeImage) await deleteImageByUrl(data.beforeImage);
    if (data.afterImage) await deleteImageByUrl(data.afterImage);
  }
  await ref.delete();
}
