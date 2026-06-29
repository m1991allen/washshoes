"use client";

import { useState, useTransition } from "react";
import type { Locale } from "@/i18n/config";
import type { PageKey } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { saveContentAction } from "@/app/admin/(protected)/content/actions";

export interface ContentFieldData {
  key: string; // Firestore-safe field key
  label: string;
  multiline: boolean;
  group?: string;
  default: string;
  override: string;
}
export interface ContentPageData {
  key: PageKey;
  label: string;
  path: string;
  locales: Record<Locale, ContentFieldData[]>;
}

const LOCALE_LABELS: Record<Locale, string> = { zh: "中文", en: "English" };

export function ContentEditor({ pages }: { pages: ContentPageData[] }) {
  const [activeKey, setActiveKey] = useState<PageKey>(pages[0]?.key ?? "home");
  // Editable override values keyed by `${page}:${locale}` → { fieldKey: value }.
  const [values, setValues] = useState<Record<string, Record<string, string>>>(() => {
    const init: Record<string, Record<string, string>> = {};
    for (const p of pages) {
      for (const loc of Object.keys(p.locales) as Locale[]) {
        const map: Record<string, string> = {};
        for (const f of p.locales[loc]) map[f.key] = f.override;
        init[`${p.key}:${loc}`] = map;
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
            fields={active.locales[loc]}
            values={values[`${active.key}:${loc}`]}
            onChange={(key, val) =>
              setValues((v) => ({
                ...v,
                [`${active.key}:${loc}`]: { ...v[`${active.key}:${loc}`], [key]: val },
              }))
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
  fields,
  values,
  onChange,
}: {
  page: PageKey;
  locale: Locale;
  label: string;
  fields: ContentFieldData[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const fieldCls =
    "w-full rounded-lg border border-line bg-base px-3 py-2.5 text-sm text-ink placeholder:text-faint/70 outline-none transition-colors focus:border-gold/60";
  const labelCls = "mb-1.5 block text-xs uppercase tracking-[0.12em] text-faint";

  function save() {
    setStatus("idle");
    startTransition(async () => {
      const res = await saveContentAction(page, locale, values);
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
        {fields.map((f, i) => {
          const showGroup = f.group && f.group !== fields[i - 1]?.group;
          return (
            <div key={f.key}>
              {showGroup && (
                <p className="mb-2 mt-1 border-t border-line pt-3 text-xs font-medium tracking-wide text-gold first:mt-0 first:border-0 first:pt-0">
                  {f.group}
                </p>
              )}
              <label className={labelCls}>{f.label}</label>
              {f.multiline ? (
                <textarea
                  rows={3}
                  className={`${fieldCls} resize-none`}
                  value={values[f.key] ?? ""}
                  placeholder={f.default}
                  onChange={(e) => onChange(f.key, e.target.value)}
                />
              ) : (
                <input
                  className={fieldCls}
                  value={values[f.key] ?? ""}
                  placeholder={f.default}
                  onChange={(e) => onChange(f.key, e.target.value)}
                />
              )}
            </div>
          );
        })}
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
