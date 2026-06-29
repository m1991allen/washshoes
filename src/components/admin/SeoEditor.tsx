"use client";

import { useState, useTransition } from "react";
import type { Locale } from "@/i18n/config";
import type { PageKey } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { saveSeoAction } from "@/app/admin/(protected)/seo/actions";

export interface SeoFields {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
}
export interface SeoLocaleData {
  default: SeoFields;
  override: SeoFields;
}
export interface SeoPageData {
  key: PageKey;
  label: string;
  path: string;
  locales: Record<Locale, SeoLocaleData>;
}

const LOCALE_LABELS: Record<Locale, string> = { zh: "中文", en: "English" };

export function SeoEditor({ pages }: { pages: SeoPageData[] }) {
  const [activeKey, setActiveKey] = useState<PageKey>(pages[0]?.key ?? "home");
  // Editable values keyed by `${page}:${locale}`.
  const [values, setValues] = useState<Record<string, SeoFields>>(() => {
    const init: Record<string, SeoFields> = {};
    for (const p of pages) {
      for (const loc of Object.keys(p.locales) as Locale[]) {
        init[`${p.key}:${loc}`] = { ...p.locales[loc].override };
      }
    }
    return init;
  });

  const active = pages.find((p) => p.key === activeKey)!;
  const locales = Object.keys(active.locales) as Locale[];

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
      {/* Page list */}
      <aside className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {pages.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setActiveKey(p.key)}
            className={cn(
              "whitespace-nowrap rounded-lg border px-4 py-2.5 text-left text-sm transition-colors",
              p.key === activeKey
                ? "border-gold/40 bg-gold/10 text-gold"
                : "border-line text-muted hover:border-line-strong hover:text-ink"
            )}
          >
            <span className="block">{p.label}</span>
            <span className="block text-[11px] text-faint">/{p.key === "home" ? "" : p.key}</span>
          </button>
        ))}
      </aside>

      {/* Editors per locale */}
      <div className="grid gap-5 md:grid-cols-2">
        {locales.map((loc) => (
          <LocaleCard
            key={loc}
            page={active.key}
            locale={loc}
            label={LOCALE_LABELS[loc]}
            defaults={active.locales[loc].default}
            value={values[`${active.key}:${loc}`]}
            onChange={(next) =>
              setValues((v) => ({ ...v, [`${active.key}:${loc}`]: next }))
            }
          />
        ))}
      </div>
    </div>
  );
}

function LocaleCard({
  page,
  locale,
  label,
  defaults,
  value,
  onChange,
}: {
  page: PageKey;
  locale: Locale;
  label: string;
  defaults: SeoFields;
  value: SeoFields;
  onChange: (v: SeoFields) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const field =
    "w-full rounded-lg border border-line bg-base px-3 py-2.5 text-sm text-ink placeholder:text-faint/70 outline-none transition-colors focus:border-gold/60";
  const labelCls = "mb-1.5 block text-xs uppercase tracking-[0.12em] text-faint";

  function save() {
    setStatus("idle");
    startTransition(async () => {
      const res = await saveSeoAction(page, locale, {
        title: value.title,
        description: value.description,
        keywords: value.keywords.join(", "),
        ogImage: value.ogImage,
      });
      if (res.ok) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2500);
      } else {
        setStatus("error");
        setErrorMsg(res.error || "儲存失敗");
      }
    });
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-ink">{label}</h3>
        <span className="text-[11px] text-faint">空白＝套用預設值</span>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className={labelCls}>標題 Title</label>
          <input
            className={field}
            value={value.title}
            placeholder={defaults.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>描述 Description</label>
          <textarea
            rows={3}
            className={`${field} resize-none`}
            value={value.description}
            placeholder={defaults.description}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>關鍵字 Keywords（逗號分隔）</label>
          <input
            className={field}
            value={value.keywords.join(", ")}
            placeholder={defaults.keywords.join(", ")}
            onChange={(e) =>
              onChange({
                ...value,
                keywords: e.target.value.split(/[,，]/).map((s) => s.trim()),
              })
            }
          />
        </div>
        <div>
          <label className={labelCls}>分享圖網址 OG Image（選填）</label>
          <input
            className={field}
            value={value.ogImage}
            placeholder="留空＝使用自動產生的分享圖"
            onChange={(e) => onChange({ ...value, ogImage: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="btn btn-primary !py-2 text-sm disabled:opacity-60"
        >
          {pending ? "儲存中…" : "儲存"}
        </button>
        {status === "saved" && <span className="text-xs text-gold">已儲存 ✓</span>}
        {status === "error" && <span className="text-xs text-red-600">{errorMsg}</span>}
      </div>
    </div>
  );
}
