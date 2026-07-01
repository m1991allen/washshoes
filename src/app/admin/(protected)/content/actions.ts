"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { saveContentFields } from "@/lib/cms/content-store";
import { saveHomeHero } from "@/lib/cms/home-hero-store";
import { HERO_DEFAULT_INTERVAL_MS, HERO_MIN_INTERVAL_MS, type HomeHeroDoc } from "@/lib/cms/types";
import { pagePaths, type PageKey } from "@/lib/seo";
import { locales, type Locale } from "@/i18n/config";

export type ContentFormResult = { ok: boolean; error?: string };

export async function saveContentAction(
  page: PageKey,
  locale: Locale,
  fields: Record<string, string>,
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

/**
 * Save the homepage hero visual (images / autoplay / interval / captions).
 * Shared across locales; the input is sanitized server-side before writing.
 */
export async function saveHomeHeroAction(input: HomeHeroDoc): Promise<ContentFormResult> {
  await requireUser(["admin", "editor"]);
  try {
    const images = (input.images ?? [])
      .filter((u): u is string => typeof u === "string" && u.trim().length > 0)
      .slice(0, 8);

    const intervalMs = Math.max(
      HERO_MIN_INTERVAL_MS,
      Math.round(Number(input.intervalMs) || HERO_DEFAULT_INTERVAL_MS),
    );

    const caption: Partial<Record<Locale, string>> = {};
    for (const loc of locales as readonly Locale[]) {
      const v = input.caption?.[loc]?.trim();
      if (v) caption[loc] = v;
    }

    await saveHomeHero({ images, autoplay: !!input.autoplay, intervalMs, caption });

    // Hero lives on the home page of every locale.
    for (const loc of locales as readonly Locale[]) revalidatePath(`/${loc}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "儲存失敗" };
  }
}
