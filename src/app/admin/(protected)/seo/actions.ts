"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { saveSeoEntry } from "@/lib/cms/seo-store";
import { pagePaths, type PageKey } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

export type SeoFormResult = { ok: boolean; error?: string };

export async function saveSeoAction(
  page: PageKey,
  locale: Locale,
  data: { title: string; description: string; keywords: string; ogImage: string }
): Promise<SeoFormResult> {
  // Re-verify on the server — never trust the client.
  await requireUser(["admin", "editor"]);

  try {
    const keywords = data.keywords
      .split(/[,，\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    await saveSeoEntry(page, locale, {
      title: data.title,
      description: data.description,
      keywords,
      ogImage: data.ogImage,
    });

    // Refresh the public page (effective once it reads from Firestore).
    revalidatePath(`/${locale}${pagePaths[page]}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "儲存失敗" };
  }
}
