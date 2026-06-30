import { requireUser } from "@/lib/auth/session";
import { getAllCases } from "@/lib/cms/cases-store";
import { loadStaticDictionary } from "@/i18n/getDictionary";
import { CasesManager } from "@/components/admin/CasesManager";

export const dynamic = "force-dynamic";

export default async function CasesAdminPage() {
  await requireUser(["admin", "editor"]);

  const [cases, dict] = await Promise.all([getAllCases(), loadStaticDictionary("zh")]);
  const categories = dict.services.map((s) => ({ id: s.id, label: s.name }));

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">案例管理</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        上傳處理前 /
        後對比圖片、設定分類與中英文說明。勾選「發佈到前台」後才會顯示在公開的案例頁與首頁。
      </p>
      <div className="mt-8">
        <CasesManager initialCases={cases} categories={categories} />
      </div>
    </div>
  );
}
