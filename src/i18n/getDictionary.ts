import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/zh";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  zh: () => import("./dictionaries/zh").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return (dictionaries[locale] ?? dictionaries.zh)();
}

export type { Dictionary };
