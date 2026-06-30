import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";

const CARDS = [
  {
    href: "/admin/seo",
    title: "SEO 設定",
    desc: "逐頁、逐語系編輯標題、描述、關鍵字與社群分享圖。",
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/content",
    title: "內容管理",
    desc: "編輯首頁、服務、關於、FAQ 與聯絡資訊文案。",
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/cases",
    title: "案例管理",
    desc: "上傳前後對比圖片、管理案例分類與說明。",
    roles: ["admin", "editor"],
  },
  { href: "/admin/users", title: "使用者", desc: "新增後台帳號並設定權限角色。", roles: ["admin"] },
];

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const { denied } = await searchParams;
  const user = await getCurrentUser();
  const role = user?.role ?? null;

  return (
    <div>
      <p className="text-sm text-muted">歡迎回來，</p>
      <h1 className="mt-1 font-serif text-3xl text-ink">{user?.name || user?.email || "管理員"}</h1>

      {denied && (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
          你沒有存取該頁面的權限。
        </p>
      )}

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.filter((c) => !role || c.roles.includes(role)).map((card) => (
          <Link key={card.href} href={card.href} className="card group p-7">
            <h2 className="font-serif text-xl text-ink transition-colors group-hover:text-gold">
              {card.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{card.desc}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm text-gold">
              前往
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
