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

/** A managed admin/editor user (mirrors the Auth custom claim). */
export interface CmsUser {
  uid: string;
  email: string;
  displayName?: string;
  role: Role;
  disabled?: boolean;
  createdAt?: number;
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
