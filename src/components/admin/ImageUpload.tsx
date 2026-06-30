"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Downscale + recompress in the browser before upload (saves bandwidth + storage). */
async function resizeImage(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(new Error("讀取檔案失敗"));
    fr.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("圖片載入失敗"));
    i.src = dataUrl;
  });

  let { width, height } = img;
  if (Math.max(width, height) > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("瀏覽器不支援圖片處理");
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality)
  );
  if (!blob) throw new Error("圖片處理失敗");
  return blob;
}

export function ImageUpload({
  value,
  onChange,
  prefix = "uploads",
  label,
  className = "",
}: {
  value?: string;
  onChange: (url: string) => void;
  prefix?: string;
  label?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      const blob = await resizeImage(file);
      const fd = new FormData();
      fd.append("file", blob, "image.jpg");
      fd.append("prefix", prefix);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "上傳失敗");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "上傳失敗");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={className}>
      {label && (
        <span className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-faint">
          {label}
        </span>
      )}
      <div
        className={cn(
          "group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-dashed border-line-strong bg-base",
          !busy && "cursor-pointer hover:border-gold/60"
        )}
        onClick={() => !busy && inputRef.current?.click()}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="text-center text-xs text-faint">
            <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full border border-line text-gold">
              +
            </div>
            點擊上傳圖片
          </div>
        )}

        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-base/70 backdrop-blur-sm">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        )}

        {value && !busy && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-base/80 text-muted backdrop-blur transition-colors hover:text-red-400"
            aria-label="移除圖片"
          >
            ✕
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
