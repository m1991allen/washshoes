"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { saveContentFields } from "@/lib/cms/content-store";
import { pagePaths, type PageKey } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

export type ContentFormResult = { ok: boolean; error?: string };

export async function saveContentAction(
  page: PageKey,
  locale: Locale,
  fields: Record<string, string>
): Promise<ContentFormResult> {
  // Re-verify on the server — never trust the client.
  await requireUser(["admin", "editor"]);

  try {
    await saveContentFields(page, locale, fields);
    // Regenerate the public page so the new copy shows up.
    revalidatePath(`/${locale}${pagePaths[page]}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "儲存失敗" };
  }
}
