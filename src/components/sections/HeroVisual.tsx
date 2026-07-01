"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HERO_DEFAULT_INTERVAL_MS, HERO_MIN_INTERVAL_MS } from "@/lib/cms/types";

/**
 * Homepage hero media. One image renders statically; two or more cross-fade as
 * an (optionally auto-playing) carousel. Rendered inside <Frame> as its child.
 */
export function HeroVisual({
  images,
  autoplay = true,
  intervalMs = HERO_DEFAULT_INTERVAL_MS,
}: {
  images: string[];
  autoplay?: boolean;
  intervalMs?: number;
}) {
  const [idx, setIdx] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (!autoplay || count <= 1) return;
    const ms = Math.max(HERO_MIN_INTERVAL_MS, intervalMs || HERO_DEFAULT_INTERVAL_MS);
    const timer = setInterval(() => setIdx((i) => (i + 1) % count), ms);
    return () => clearInterval(timer);
  }, [autoplay, intervalMs, count]);

  // Keep the active index valid if the image set shrinks.
  useEffect(() => {
    if (idx >= count) setIdx(0);
  }, [idx, count]);

  return (
    <div className="relative h-full w-full">
      {images.map((src, i) => (
        <Image
          key={`${src}-${i}`}
          src={src}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          priority={i === 0}
          className={cn(
            "object-cover transition-opacity duration-700 ease-out",
            i === idx ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`顯示第 ${i + 1} 張圖片`}
              className={cn(
                "h-1.5 rounded-full bg-white transition-all",
                i === idx ? "w-5 opacity-100" : "w-1.5 opacity-50 hover:opacity-80",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
