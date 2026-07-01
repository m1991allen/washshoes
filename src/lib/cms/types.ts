/**
 * CMS data contracts — shared between the admin (writes) and the public site
 * (reads). Mirrors the shapes already used by the static dictionaries/SEO config
 * so Firestore data can transparently override the defaults.
 */
import type { Locale } from "@/i18n/config";
import type { PageKey, SeoEntry } from "@/lib/seo";

/** Roles stored as Firebase Auth custom claims. */
export const ROLES = ["admin", "editor"] as const;
export type Role = (typeof ROLES)[number];

/** Firestore collection names. */
export const COLLECTIONS = {
  seo: "seo",
  content: "content",
  cases: "cases",
  settings: "settings",
  users: "users",
} as const;

/** seo/{page} — per-page SEO for every locale. */
export type SeoDoc = Partial<Record<Locale, Partial<SeoEntry>>>;

/**
 * content/{page} — per-page copy overrides for every locale.
 * Inner map is keyed by a Firestore-safe field key (dot-path with `.` → `__`,
 * see `content-fields.ts`); values override the matching field in the static
 * dictionary, empty/absent falls back to the default.
 */
export type ContentDoc = Partial<Record<Locale, Record<string, string>>>;

/** A managed admin/editor user (mirrors the Auth custom claim). */
export interface CmsUser {
  uid: string;
  email: string;
  displayName?: string;
  role: Role;
  disabled?: boolean;
  createdAt?: number;
}

/**
 * A user row as shown in the admin Users screen. Sourced from Firebase Auth
 * (role may be absent for accounts created outside the CMS). Plain-data shape,
 * safe to pass from the server page to the client manager component.
 */
export interface AdminUserView {
  uid: string;
  email: string;
  displayName: string;
  role: Role | null;
  disabled: boolean;
  createdAt: number | null;
}

/** Autoplay carousel interval bounds (ms). */
export const HERO_MIN_INTERVAL_MS = 1000;
export const HERO_DEFAULT_INTERVAL_MS = 4000;

/**
 * settings/homeHero — the homepage hero visual.
 * `images`: 0 = built-in icon placeholder, 1 = single image, 2+ = carousel.
 * `caption`: title shown on the floating card, per locale; falls back to
 * `brand.tagline` of that locale when empty.
 */
export interface HomeHeroDoc {
  images?: string[];
  autoplay?: boolean;
  intervalMs?: number;
  caption?: Partial<Record<Locale, string>>;
}

/** cases/{id} — a before/after case study, localized. */
export interface CaseDoc {
  id: string;
  category: string; // matches a service id
  order?: number;
  published?: boolean;
  beforeImage?: string; // Storage download URL
  afterImage?: string;
  title: Partial<Record<Locale, string>>;
  desc: Partial<Record<Locale, string>>;
}

export type { Locale, PageKey, SeoEntry };
