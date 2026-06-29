import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Front-end navigation fallback. Header & Footer live in the layout and stay
 * put; this only fills the <main> area while the next page streams in.
 */
export default function Loading() {
  return (
    <div className="shell">
      <div className="section flex flex-col items-center text-center">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="mt-7 h-11 w-[min(90%,640px)] rounded-xl" />
        <Skeleton className="mt-4 h-11 w-[min(68%,500px)] rounded-xl" />
        <Skeleton className="mt-8 h-4 w-[min(82%,540px)]" />
        <Skeleton className="mt-3 h-4 w-[min(60%,420px)]" />
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Skeleton className="h-12 w-40 rounded-full" />
          <Skeleton className="h-12 w-40 rounded-full" />
        </div>
      </div>

      <div className="grid gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
