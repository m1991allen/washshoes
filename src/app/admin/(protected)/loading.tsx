import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Shared fallback for every protected admin page. The header + nav live in the
 * (protected) layout and persist; this fills the content area while the next
 * page's server data (Firestore) is fetched. The shape is intentionally
 * generic — a title, a description, a stat row and an editor-like panel — so it
 * reads well across 總覽 / SEO / 內容 / 案例 / 使用者.
 */
export default function Loading() {
  return (
    <div>
      <Skeleton className="h-9 w-48 rounded-lg" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-2/3 max-w-md" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      <div className="mt-6 space-y-4 rounded-xl border border-line p-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-32 shrink-0" />
            <Skeleton className="h-9 flex-1 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
