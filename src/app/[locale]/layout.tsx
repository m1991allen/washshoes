import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter, Cormorant_Garamond, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "../globals.css";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const notoSans = Noto_Sans_TC({
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
  preload: false,
});
const notoSerif = Noto_Serif_TC({
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#0b0b0d",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(site.url),
    title: { default: site.fullName, template: `%s | ${site.name}` },
    applicationName: site.fullName,
    robots: { index: true, follow: true },
    icons: { icon: "/favicon.svg" },
    alternates: { canonical: `/${isLocale(locale) ? locale : "zh"}` },
  };
}

const htmlLang: Record<Locale, string> = {
  zh: "zh-Hant-TW",
  en: "en",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.fullName,
    description: dict.brand.tagline,
    url: `${site.url}/${locale}`,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}/${locale}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address[locale],
      addressLocality: locale === "zh" ? "桃園市" : "Taoyuan City",
      addressCountry: "TW",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHours: "Mo-Su 11:30-20:30",
    sameAs: [site.social.facebook, site.social.instagram, site.social.line],
  };

  return (
    <html
      lang={htmlLang[locale]}
      className={`${inter.variable} ${cormorant.variable} ${notoSans.variable} ${notoSerif.variable}`}
    >
      <body>
        <Header dict={dict} locale={locale} />
        <main id="main">{children}</main>
        <Footer dict={dict} locale={locale} />
        <BackToTop label={dict.common.backToTop} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
