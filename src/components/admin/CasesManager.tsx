"use client";

import { useState, useTransition } from "react";
import type { CaseDoc } from "@/lib/cms/types";
import { cn } from "@/lib/utils";
import { ImageUpload } from "./ImageUpload";
import { validatePublish } from "@/lib/cms/case-validate";
import { saveCaseAction, deleteCaseAction } from "@/app/admin/(protected)/cases/actions";

type Category = { id: string; label: string };

export function CasesManager({
  initialCases,
  categories,
}: {
  initialCases: CaseDoc[];
  categories: Category[];
}) {
  const [cases, setCases] = useState<CaseDoc[]>(initialCases);

  function addCase() {
    const newCase: CaseDoc = {
      id: crypto.randomUUID(),
      category: categories[0]?.id ?? "shoe-cleaning",
      order: (cases.reduce((m, c) => Math.max(m, c.order ?? 0), 0) || 0) + 1,
      published: false,
      title: { zh: "", en: "" },
      desc: { zh: "", en: "" },
    };
    setCases((cs) => [...cs, newCase]);
  }

  function updateCase(id: string, patch: Partial<CaseDoc>) {
    setCases((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeCaseLocal(id: string) {
    setCases((cs) => cs.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted">
          共 {cases.length} 筆案例。<span className="text-faint">未發佈的案例不會顯示在前台。</span>
        </p>
        <button type="button" onClick={addCase} className="btn btn-primary !py-2 text-sm">
          ＋ 新增案例
        </button>
      </div>

      {cases.length === 0 ? (
        <div className="grid place-items-center rounded-[var(--radius)] border border-dashed border-line-strong bg-surface/40 px-6 py-16 text-center text-sm text-muted">
          尚無案例，點「新增案例」開始。
        </div>
      ) : (
        <div className="space-y-5">
          {cases.map((c) => (
            <CaseCard
              key={c.id}
              value={c}
              categories={categories}
              onChange={(patch) => updateCase(c.id, patch)}
              onRemoved={() => removeCaseLocal(c.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CaseCard({
  value,
  categories,
  onChange,
  onRemoved,
}: {
  value: CaseDoc;
  categories: Category[];
  onChange: (patch: Partial<CaseDoc>) => void;
  onRemoved: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [msg, setMsg] = useState("");

  const field =
    "w-full rounded-lg border border-line bg-base px-3 py-2 text-sm text-ink placeholder:text-faint/70 outline-none transition-colors focus:border-gold/60";
  const labelCls = "mb-1 block text-xs uppercase tracking-[0.12em] text-faint";

  function save() {
    const invalid = validatePublish(value);
    if (invalid) {
      setStatus("error");
      setMsg(invalid);
      return;
    }
    setStatus("idle");
    startTransition(async () => {
      const res = await saveCaseAction(value);
      if (res.ok) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2500);
      } else {
        setStatus("error");
        setMsg(res.error || "儲存失敗");
      }
    });
  }

  function remove() {
    if (!confirm("確定要刪除這筆案例嗎？此動作無法復原。")) return;
    startTransition(async () => {
      const res = await deleteCaseAction(value.id);
      if (res.ok) onRemoved();
      else {
        setStatus("error");
        setMsg(res.error || "刪除失敗");
      }
    });
  }

  return (
    <div className="card p-6">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Images */}
        <div className="grid grid-cols-2 gap-3">
          <ImageUpload
            label="處理前"
            prefix="cases"
            value={value.beforeImage}
            onChange={(url) => onChange({ beforeImage: url })}
          />
          <ImageUpload
            label="處理後"
            prefix="cases"
            value={value.afterImage}
            onChange={(url) => onChange({ afterImage: url })}
          />
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>分類</label>
              <select
                className={field}
                value={value.category}
                onChange={(e) => onChange({ category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-base">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>排序（小在前）</label>
              <input
                type="number"
                className={field}
                value={value.order ?? 0}
                onChange={(e) => onChange({ order: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>標題（中文）</label>
              <input
                className={field}
                value={value.title.zh ?? ""}
                onChange={(e) => onChange({ title: { ...value.title, zh: e.target.value } })}
              />
            </div>
            <div>
              <label className={labelCls}>標題（English）</label>
              <input
                className={field}
                value={value.title.en ?? ""}
                onChange={(e) => onChange({ title: { ...value.title, en: e.target.value } })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>說明（中文）</label>
              <textarea
                rows={2}
                className={`${field} resize-none`}
                value={value.desc.zh ?? ""}
                onChange={(e) => onChange({ desc: { ...value.desc, zh: e.target.value } })}
              />
            </div>
            <div>
              <label className={labelCls}>說明（English）</label>
              <textarea
                rows={2}
                className={`${field} resize-none`}
                value={value.desc.en ?? ""}
                onChange={(e) => onChange({ desc: { ...value.desc, en: e.target.value } })}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={!!value.published}
                onChange={(e) => onChange({ published: e.target.checked })}
                className="h-4 w-4 accent-[var(--color-gold)]"
              />
              發佈到前台
            </label>

            <div className="ml-auto flex items-center gap-3">
              {status === "saved" && <span className="text-xs text-gold">已儲存 ✓</span>}
              {status === "error" && <span className="text-xs text-red-400">{msg}</span>}
              <button
                type="button"
                onClick={remove}
                disabled={pending}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-red-400/50 hover:text-red-400 disabled:opacity-50"
              >
                刪除
              </button>
              <button
                type="button"
                onClick={save}
                disabled={pending}
                className="btn btn-primary !py-2 text-sm disabled:opacity-60"
              >
                {pending ? "處理中…" : "儲存"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
