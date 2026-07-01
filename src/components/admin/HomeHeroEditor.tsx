"use client";

import { useRef, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { ImageUpload } from "./ImageUpload";
import { saveHomeHeroAction } from "@/app/admin/(protected)/content/actions";
import { HERO_DEFAULT_INTERVAL_MS, type HomeHeroDoc } from "@/lib/cms/types";
import { ALLOWED_IMAGE_TYPES, IMAGE_ACCEPT, uploadResizedImage } from "@/lib/image/client-upload";

const MAX_IMAGES = 8;
/** Selectable autoplay intervals: 1–15 seconds. */
const INTERVAL_SECONDS = Array.from({ length: 15 }, (_, i) => i + 1);

const fieldCls =
  "w-full rounded-lg border border-line bg-base px-3 py-2.5 text-sm text-ink placeholder:text-faint/70 outline-none transition-colors focus:border-gold/60";
const labelCls = "mb-1.5 block text-xs uppercase tracking-[0.12em] text-faint";

/**
 * Homepage hero visual editor — shared across locales, so it sits above the
 * per-language content cards. 0 images = icon placeholder, 1 = single image,
 * 2+ = auto-playing carousel. Captions fall back to each locale's brand tagline.
 */
export function HomeHeroEditor({
  initial,
  captionDefaults,
}: {
  initial: HomeHeroDoc;
  captionDefaults: { zh: string; en: string };
}) {
  const [images, setImages] = useState<string[]>(initial.images ?? []);
  const [autoplay, setAutoplay] = useState<boolean>(initial.autoplay ?? true);
  const [intervalMs, setIntervalMs] = useState<number>(() => {
    // Snap any stored value to a whole second within the 1–15s dropdown range.
    const ms = initial.intervalMs ?? HERO_DEFAULT_INTERVAL_MS;
    const sec = Math.min(15, Math.max(1, Math.round(ms / 1000)));
    return sec * 1000;
  });
  const [captionZh, setCaptionZh] = useState(initial.caption?.zh ?? "");
  const [captionEn, setCaptionEn] = useState(initial.caption?.en ?? "");

  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const batchRef = useRef<HTMLInputElement | null>(null);
  const [batchBusy, setBatchBusy] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ done: number; total: number } | null>(null);
  const [batchNote, setBatchNote] = useState<string | null>(null);

  /** Multi-file upload with foolproofing: caps at MAX_IMAGES, filters by type,
   *  tolerates per-file failures, and reports what happened. */
  async function handleBatch(fileList: FileList) {
    setBatchNote(null);
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setBatchNote(`已達 ${MAX_IMAGES} 張上限，無法再新增。`);
      return;
    }

    const all = Array.from(fileList);
    const valid = all.filter((f) => ALLOWED_IMAGE_TYPES.includes(f.type));
    const skippedType = all.length - valid.length;
    const picked = valid.slice(0, remaining);
    const skippedOverLimit = valid.length - picked.length;

    setBatchBusy(true);
    setBatchProgress({ done: 0, total: picked.length });
    let ok = 0;
    let fail = 0;
    for (let i = 0; i < picked.length; i++) {
      try {
        const url = await uploadResizedImage(picked[i], "home");
        // Append as each finishes so tiles fill in progressively.
        setImages((arr) => (arr.length < MAX_IMAGES ? [...arr, url] : arr));
        ok++;
      } catch {
        fail++;
      }
      setBatchProgress({ done: i + 1, total: picked.length });
    }
    setBatchBusy(false);
    setBatchProgress(null);

    const parts = [`成功 ${ok} 張`];
    if (fail) parts.push(`失敗 ${fail} 張`);
    if (skippedOverLimit) parts.push(`超過上限略過 ${skippedOverLimit} 張`);
    if (skippedType) parts.push(`非圖片略過 ${skippedType} 張`);
    setBatchNote(parts.join("，"));
  }

  const replaceAt = (i: number, url: string) =>
    setImages((arr) =>
      url ? arr.map((u, j) => (j === i ? url : u)) : arr.filter((_, j) => j !== i),
    );
  const addImage = (url: string) =>
    url && setImages((arr) => (arr.length < MAX_IMAGES ? [...arr, url] : arr));
  const move = (i: number, dir: -1 | 1) =>
    setImages((arr) => {
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      const next = [...arr];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  function save() {
    setStatus("idle");
    startTransition(async () => {
      const res = await saveHomeHeroAction({
        images,
        autoplay,
        intervalMs,
        caption: { zh: captionZh, en: captionEn },
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

  const isCarousel = images.length > 1;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-ink">首頁主視覺</h3>
        <span className="text-[11px] text-faint">中英文共用</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        不放圖＝顯示預設圖示；放 1 張＝單張顯示；放 2 張以上＝自動輪播。
      </p>

      {/* Images */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-[0.12em] text-faint">
            圖片（最多 {MAX_IMAGES} 張，可調整順序）
          </span>
          <button
            type="button"
            onClick={() => batchRef.current?.click()}
            disabled={batchBusy || images.length >= MAX_IMAGES}
            className="rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:border-gold hover:text-gold disabled:opacity-40"
          >
            {batchBusy
              ? `上傳中 ${batchProgress?.done ?? 0}/${batchProgress?.total ?? 0}…`
              : "＋ 批次上傳"}
          </button>
        </div>
        <input
          ref={batchRef}
          type="file"
          accept={IMAGE_ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleBatch(e.target.files);
            e.target.value = "";
          }}
        />
        {batchNote && <p className="mb-2 text-xs text-muted">{batchNote}</p>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((url, i) => (
            <div key={`${url}-${i}`}>
              <ImageUpload value={url} prefix="home" onChange={(u) => replaceAt(i, u)} />
              <div className="mt-1 flex items-center justify-between text-faint">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="往前移"
                  className="px-1.5 text-sm transition-colors hover:text-gold disabled:opacity-30"
                >
                  ←
                </button>
                <span className="text-[11px]">第 {i + 1} 張</span>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === images.length - 1}
                  aria-label="往後移"
                  className="px-1.5 text-sm transition-colors hover:text-gold disabled:opacity-30"
                >
                  →
                </button>
              </div>
            </div>
          ))}
          {/* Loading skeletons for files still uploading in the current batch. */}
          {batchBusy &&
            Array.from({
              length: Math.max(0, (batchProgress?.total ?? 0) - (batchProgress?.done ?? 0)),
            }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="grid aspect-[4/3] animate-pulse place-items-center rounded-lg border border-dashed border-line-strong bg-base"
              >
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              </div>
            ))}
          {!batchBusy && images.length < MAX_IMAGES && (
            <ImageUpload value="" prefix="home" label="新增圖片" onChange={addImage} />
          )}
        </div>
      </div>

      {/* Carousel settings (only meaningful with 2+ images) */}
      <div
        className={cn(
          "mt-5 grid gap-4 sm:grid-cols-2",
          !isCarousel && "pointer-events-none opacity-40",
        )}
      >
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={autoplay}
            onChange={(e) => setAutoplay(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-gold)]"
          />
          自動輪播
        </label>
        <div>
          <label className={labelCls}>輪播間隔</label>
          <select
            className={fieldCls}
            value={intervalMs}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
          >
            {INTERVAL_SECONDS.map((s) => (
              <option key={s} value={s * 1000} className="bg-base">
                {s} 秒
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Captions (per locale, with fallback placeholders) */}
      <div className="mt-5">
        <label className={labelCls}>浮動卡片標題</label>
        <p className="mb-2 -mt-0.5 text-[11px] text-faint">
          留白＝套用預設；可按 Enter 換行或加空白自行排版。
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>中文</label>
            <textarea
              rows={2}
              className={`${fieldCls} resize-none`}
              value={captionZh}
              placeholder={captionDefaults.zh}
              onChange={(e) => setCaptionZh(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>English</label>
            <textarea
              rows={2}
              className={`${fieldCls} resize-none`}
              value={captionEn}
              placeholder={captionDefaults.en}
              onChange={(e) => setCaptionEn(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending || batchBusy}
          className="btn btn-primary !py-2 text-sm disabled:opacity-60"
        >
          {pending ? "儲存中…" : "儲存主視覺"}
        </button>
        {status === "saved" && <span className="text-xs text-gold">已儲存 ✓</span>}
        {status === "error" && <span className="text-xs text-red-600">{errorMsg}</span>}
      </div>
    </div>
  );
}
