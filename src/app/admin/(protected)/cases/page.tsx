import { requireUser } from "@/lib/auth/session";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const dynamic = "force-dynamic";

export default async function CasesAdminPage() {
  await requireUser(["admin", "editor"]);
  return <ComingSoon title="案例管理" desc="上傳前後對比圖片、管理案例分類與說明。" />;
}
