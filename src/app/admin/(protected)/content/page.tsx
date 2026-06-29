import { requireUser } from "@/lib/auth/session";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const dynamic = "force-dynamic";

export default async function ContentAdminPage() {
  await requireUser(["admin", "editor"]);
  return <ComingSoon title="內容管理" desc="編輯首頁、服務、關於、FAQ 與聯絡資訊文案。" />;
}
