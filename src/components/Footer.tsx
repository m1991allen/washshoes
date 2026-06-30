import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/zh";
import { site } from "@/lib/site";
import { localizedPath } from "@/lib/utils";
import { Logo } from "./Logo";
import { FacebookIcon, InstagramIcon, LineIcon, MapPinIcon, ClockIcon, PhoneIcon } from "./icons";

export function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { nav, footer } = dict;

  const navItems = [
    { href: localizedPath(locale, "/services"), label: nav.services },
    { href: localizedPath(locale, "/cases"), label: nav.cases },
    { href: localizedPath(locale, "/about"), label: nav.about },
    { href: localizedPath(locale, "/faq"), label: nav.faq },
    { href: localizedPath(locale, "/contact"), label: nav.contact },
  ];

  const socials = [
    { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: site.social.line, label: "LINE", Icon: LineIcon },
  ];

  const year = 2026;

  return (
    <footer className="relative border-t border-line bg-surface">
      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
        {/* Brand */}
        <div className="md:col-span-5">
          <Logo locale={locale} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{footer.tagline}</p>
          <div className="mt-6 flex items-center gap-3">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-gold hover:text-gold"
              >
                <Icon width={18} height={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div className="md:col-span-3">
          <h3 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-faint">
            {footer.nav}
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-4">
          <h3 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-faint">
            {footer.contact}
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-muted">
            <li className="flex gap-3">
              <MapPinIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold" />
              <span>{site.address[locale]}</span>
            </li>
            <li className="flex gap-3">
              <ClockIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold" />
              <span>{footer.hoursValue}</span>
            </li>
            <li className="flex gap-3">
              <PhoneIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold" />
              <a href={`tel:${site.phone}`} className="transition-colors hover:text-gold">
                {site.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-faint md:flex-row">
          <p>
            © {year} {site.fullName}. {footer.rights}.
          </p>
          <p>{footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
