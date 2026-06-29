import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/zh";
import { site } from "@/lib/site";
import { localizedPath } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, LineIcon } from "@/components/icons";

export function CTA({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { cta } = dict;

  return (
    <section className="section">
      <div className="shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-[calc(var(--radius)+6px)] border border-line bg-gradient-to-br from-(--panel-cta-from) via-surface to-base px-8 py-16 text-center md:px-16 md:py-24">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, rgba(200,168,106,0.22), transparent 60%)",
              }}
            />
            <div className="relative mx-auto max-w-2xl">
              <span className="gold-divider mx-auto" />
              <h2 className="heading mt-7 font-serif text-ink">{cta.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-muted">{cta.subtitle}</p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link href={localizedPath(locale, "/contact")} className="btn btn-primary">
                  {cta.primary}
                  <ArrowRight width={18} height={18} />
                </Link>
                <a
                  href={site.social.line}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <LineIcon width={18} height={18} />
                  {cta.secondary}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
