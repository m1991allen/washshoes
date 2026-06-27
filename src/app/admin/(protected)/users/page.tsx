import { requireUser } from "@/lib/auth/session";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  // Admin-only.
  await requireUser(["admin"]);
  return <ComingSoon title="使用者管理" desc="新增後台帳號並設定權限角色（admin / editor）。" />;
}
