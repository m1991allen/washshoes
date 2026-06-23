import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/utils";

export function Logo({
  locale,
  className = "",
  onNavigate,
}: {
  locale: Locale;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={localizedPath(locale, "/")}
      onClick={onNavigate}
      aria-label="RENU — home"
      className={`group inline-flex items-baseline gap-[0.18em] ${className}`}
    >
      <span
        className="font-serif text-[1.6rem] leading-none tracking-[0.14em] text-ink transition-colors group-hover:text-gold"
        style={{ fontWeight: 500 }}
      >
        RENU
      </span>
      <span className="h-[5px] w-[5px] translate-y-[-1px] rounded-full bg-gold transition-transform duration-300 group-hover:scale-125" />
    </Link>
  );
}
