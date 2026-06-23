import type { ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  locale,
  homeLabel,
  currentLabel,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  locale: Locale;
  homeLabel: string;
  currentLabel: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-grain relative overflow-hidden border-b border-line pb-16 pt-32 md:pb-20 md:pt-44">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[680px] -translate-x-1/2 opacity-60 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(200,168,106,0.14), transparent 70%)" }}
      />
      <div className="shell relative">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs text-faint" aria-label="Breadcrumb">
          <Link href={localizedPath(locale, "/")} className="transition-colors hover:text-gold">
            {homeLabel}
          </Link>
          <span>/</span>
          <span className="text-muted">{currentLabel}</span>
        </nav>

        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display mt-5 max-w-4xl font-serif text-ink">{title}</h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
