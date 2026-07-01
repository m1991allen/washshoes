"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IMAGE_ACCEPT, uploadResizedImage } from "@/lib/image/client-upload";

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
      const url = await uploadResizedImage(file, prefix);
      onChange(url);
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
        <span className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-faint">{label}</span>
      )}
      <div
        className={cn(
          "group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-dashed border-line-strong bg-base",
          !busy && "cursor-pointer hover:border-gold/60",
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
        accept={IMAGE_ACCEPT}
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
