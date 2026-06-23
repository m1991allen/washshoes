"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/zh";
import { localizedPath, cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MenuIcon, CloseIcon, ArrowRight } from "./icons";

export function Header({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { nav } = dict;
  const pathname = usePathname() || "";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const items = [
    { href: localizedPath(locale, "/services"), label: nav.services },
    { href: localizedPath(locale, "/cases"), label: nav.cases },
    { href: localizedPath(locale, "/about"), label: nav.about },
    { href: localizedPath(locale, "/faq"), label: nav.faq },
    { href: localizedPath(locale, "/contact"), label: nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-all duration-500",
          scrolled || open
            ? "border-b border-line bg-base/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="shell flex h-[72px] items-center justify-between md:h-20">
          <Logo locale={locale} />

          <nav className="hidden items-center gap-9 lg:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "link-underline text-sm tracking-wide transition-colors",
                  isActive(item.href) ? "text-gold" : "text-muted hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} className="hidden sm:inline-flex" />
            <Link
              href={localizedPath(locale, "/contact")}
              className="btn btn-primary hidden h-10 !py-0 text-sm sm:inline-flex"
            >
              {nav.book}
              <ArrowRight width={16} height={16} />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-gold hover:text-gold lg:hidden"
            >
              {open ? <CloseIcon width={20} height={20} /> : <MenuIcon width={20} height={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 top-[72px] z-40 origin-top bg-base/98 backdrop-blur-xl transition-all duration-300 lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <nav className="shell flex flex-col gap-1 pt-8">
          {items.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between border-b border-line py-5 font-serif text-2xl transition-colors",
                isActive(item.href) ? "text-gold" : "text-ink hover:text-gold"
              )}
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {item.label}
              <ArrowRight width={20} height={20} className="text-muted" />
            </Link>
          ))}
        </nav>
        <div className="shell mt-8 flex items-center justify-between">
          <LanguageSwitcher locale={locale} />
          <Link href={localizedPath(locale, "/contact")} className="btn btn-primary">
            {nav.book}
            <ArrowRight width={16} height={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
