import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import {
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  LineIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(isLocale(locale) ? locale : "zh", "contact");
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : "zh";
  const dict = await getDictionary(safeLocale);
  const page = dict.pages.contact;

  const info = [
    { Icon: MapPinIcon, label: page.address, value: page.addressValue },
    { Icon: ClockIcon, label: page.hours, value: page.hoursValue },
    { Icon: PhoneIcon, label: page.phone, value: page.phoneValue, href: `tel:${site.phone}` },
  ];

  const socials = [
    { href: site.social.line, label: "LINE", Icon: LineIcon },
    { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
  ];

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`;

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        locale={safeLocale}
        homeLabel={dict.nav.home}
        currentLabel={dict.nav.contact}
      />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          {/* Info */}
          <div>
            <h2 className="font-serif text-2xl text-ink">{page.infoTitle}</h2>
            <ul className="mt-8 space-y-6">
              {info.map(({ Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-gold">
                    <Icon width={20} height={20} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-faint">{label}</p>
                    {href ? (
                      <a href={href} className="mt-1 block text-ink transition-colors hover:text-gold">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-ink">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* LINE highlight */}
            <div className="mt-8 rounded-[var(--radius)] border border-line bg-surface/60 p-6">
              <p className="font-serif text-lg text-ink">{page.lineTitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{page.lineText}</p>
              <a
                href={site.social.line}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline mt-5"
              >
                <LineIcon width={18} height={18} />
                {dict.common.lineConsult}
              </a>
            </div>

            {/* Socials */}
            <div className="mt-8 flex items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon width={20} height={20} />
                </a>
              ))}
            </div>

            {/* Map */}
            <div className="mt-8 overflow-hidden rounded-[var(--radius)] border border-line">
              <iframe
                title="map"
                src={mapSrc}
                className="h-64 w-full grayscale-[0.4]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form */}
          <div className="lg:pl-6">
            <h2 className="font-serif text-2xl text-ink">{page.formTitle}</h2>
            <div className="mt-8">
              <ContactForm
                labels={page.form}
                services={dict.services.map((s) => ({ id: s.id, name: s.name }))}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
