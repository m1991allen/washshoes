/**
 * Central business / brand configuration.
 *
 * Phase 2 (admin panel) will let the client edit these values and SEO settings
 * from a dashboard. For now they live here as the single source of truth so the
 * whole site reads from one place — swapping this for a DB/CMS later only touches
 * this file and `lib/seo.ts`.
 */
export const site = {
  name: "RENU",
  fullName: "RENU 鞋包精緻護理",
  // Canonical origin for sitemap/robots/metadata. Set NEXT_PUBLIC_SITE_URL per
  // environment (Vercel + .env.local). The fallback is the Vercel domain — the
  // client's own domain isn't registered yet, and pointing canonicals at a
  // domain that doesn't resolve is worse than not setting them at all.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://washshoes.vercel.app",
  email: "service@renu-care.com.tw",
  phone: "+886-3-000-0000",
  phoneDisplay: "03-000-0000",
  address: {
    zh: "桃園市八德區義勇街 48 號",
    en: "No. 48, Yiyong St., Bade Dist., Taoyuan City, Taiwan",
  },
  hours: {
    zh: "每日 11:30 – 20:30",
    en: "Daily 11:30 – 20:30",
  },
  geo: {
    latitude: 24.9276,
    longitude: 121.2845,
  },
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    line: "https://line.me/",
  },
  // Embedded map query (used for the Google Maps iframe on the contact page).
  mapQuery: "桃園市八德區義勇街48號",
} as const;

export type Site = typeof site;
