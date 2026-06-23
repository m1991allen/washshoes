import type { Locale } from "@/i18n/config";

/** Tiny classNames joiner (falsy values are dropped). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Prefix an in-app path with the active locale, e.g. localizedPath("zh", "/about"). */
export function localizedPath(locale: Locale, path = ""): string {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}
