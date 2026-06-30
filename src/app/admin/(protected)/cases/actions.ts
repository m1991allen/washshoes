"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { upsertCase, deleteCase } from "@/lib/cms/cases-store";
import { validatePublish } from "@/lib/cms/case-validate";
import type { CaseDoc } from "@/lib/cms/types";

export type CaseFormResult = { ok: boolean; error?: string };

function revalidateCases() {
  // Public cases page + home preview, both locales.
  for (const l of ["zh", "en"]) {
    revalidatePath(`/${l}/cases`);
    revalidatePath(`/${l}`);
  }
}

export async function saveCaseAction(input: CaseDoc): Promise<CaseFormResult> {
  await requireUser(["admin", "editor"]);
  try {
    if (!input.id) return { ok: false, error: "缺少案例 ID" };
    const invalid = validatePublish(input);
    if (invalid) return { ok: false, error: invalid };
    await upsertCase(input);
    revalidateCases();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "儲存失敗" };
  }
}

export async function deleteCaseAction(id: string): Promise<CaseFormResult> {
  await requireUser(["admin", "editor"]);
  try {
    await deleteCase(id);
    revalidateCases();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "刪除失敗" };
  }
}
