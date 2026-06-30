"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

function swapLocale(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  // segments[0] === "" because pathname starts with "/"
  if (segments.length > 1 && (locales as readonly string[]).includes(segments[1])) {
    segments[1] = target;
  } else {
    segments.splice(1, 0, target);
  }
  return segments.join("/") || `/${target}`;
}

export function LanguageSwitcher({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  const pathname = usePathname() || `/${locale}`;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-line p-0.5 text-xs",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={swapLocale(pathname, l)}
            hrefLang={l === "zh" ? "zh-Hant" : "en"}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
            }}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-2.5 py-1 font-medium tracking-wide transition-colors",
              active ? "bg-gold text-[#1a1408]" : "text-muted hover:text-ink",
            )}
          >
            {localeNames[l]}
          </Link>
        );
      })}
    </div>
  );
}
