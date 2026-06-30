import { requireUser } from "@/lib/auth/session";
import { listAdminUsers } from "@/lib/cms/users-store";
import { UsersManager } from "@/components/admin/UsersManager";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  // Admin-only.
  const me = await requireUser(["admin"]);
  const users = await listAdminUsers();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">使用者管理</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        新增後台帳號並設定權限角色。<span className="text-ink">管理員 (admin)</span>{" "}
        擁有完整權限（含管理使用者）；
        <span className="text-ink">編輯 (editor)</span> 可編輯內容與 SEO，但不能管理使用者。
      </p>
      <div className="mt-8">
        <UsersManager users={users} currentUid={me.uid} />
      </div>
    </div>
  );
}
