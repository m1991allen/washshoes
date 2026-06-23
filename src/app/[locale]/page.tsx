import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { Process } from "@/components/sections/Process";
import { CasesPreview } from "@/components/sections/CasesPreview";
import { Features } from "@/components/sections/Features";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(isLocale(locale) ? locale : "zh", "home");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : "zh";
  const dict = await getDictionary(safeLocale);

  return (
    <>
      <Hero dict={dict} locale={safeLocale} />
      <Intro dict={dict} locale={safeLocale} />
      <ServicesPreview dict={dict} locale={safeLocale} />
      <Process dict={dict} />
      <CasesPreview dict={dict} locale={safeLocale} />
      <Features dict={dict} />
      <Testimonials dict={dict} />
      <CTA dict={dict} locale={safeLocale} />
    </>
  );
}
