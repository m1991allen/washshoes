"use client";

import { useState, useTransition } from "react";
import type { AdminUserView, Role } from "@/lib/cms/types";
import { cn } from "@/lib/utils";
import {
  createUserAction,
  setRoleAction,
  setDisabledAction,
  deleteUserAction,
} from "@/app/admin/(protected)/users/actions";

const ROLE_LABELS: Record<Role, string> = { admin: "管理員 (admin)", editor: "編輯 (editor)" };
const fieldCls =
  "w-full rounded-lg border border-line bg-base px-3 py-2.5 text-sm text-ink placeholder:text-faint/70 outline-none transition-colors focus:border-gold/60";
const labelCls = "mb-1.5 block text-xs uppercase tracking-[0.12em] text-faint";

export function UsersManager({
  users,
  currentUid,
}: {
  users: AdminUserView[];
  currentUid: string;
}) {
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<Role>("editor");

  const notify = (res: { ok: boolean; error?: string }, okText: string) =>
    setNotice(res.ok ? { kind: "ok", text: okText } : { kind: "error", text: res.error || "操作失敗" });

  function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);
    startTransition(async () => {
      const res = await createUserAction({ email, password, displayName, role });
      notify(res, `已新增帳號：${email}`);
      if (res.ok) {
        setEmail("");
        setPassword("");
        setDisplayName("");
        setRole("editor");
      }
    });
  }

  const changeRole = (uid: string, next: Role) => {
    setNotice(null);
    startTransition(async () => notify(await setRoleAction(uid, next), "已更新角色"));
  };
  const toggleDisabled = (uid: string, disabled: boolean) => {
    setNotice(null);
    startTransition(async () =>
      notify(await setDisabledAction(uid, disabled), disabled ? "已停用帳號" : "已啟用帳號")
    );
  };
  const remove = (uid: string, label: string) => {
    if (!window.confirm(`確定要刪除帳號「${label}」嗎？此動作無法復原。`)) return;
    setNotice(null);
    startTransition(async () => notify(await deleteUserAction(uid), "已刪除帳號"));
  };

  return (
    <div className="space-y-8">
      {/* Create */}
      <form onSubmit={submitCreate} className="card p-6">
        <h2 className="font-serif text-lg text-ink">新增帳號</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              required
              className={fieldCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@example.com"
            />
          </div>
          <div>
            <label className={labelCls}>初始密碼（至少 6 碼）</label>
            <input
              type="text"
              required
              minLength={6}
              className={fieldCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="設定初始密碼，交給對方後請其自行更改"
            />
          </div>
          <div>
            <label className={labelCls}>顯示名稱</label>
            <input
              className={fieldCls}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="例：店長"
            />
          </div>
          <div>
            <label className={labelCls}>角色</label>
            <select
              className={fieldCls}
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="editor">{ROLE_LABELS.editor}</option>
              <option value="admin">{ROLE_LABELS.admin}</option>
            </select>
          </div>
        </div>
        <div className="mt-5">
          <button
            type="submit"
            disabled={pending}
            className="btn btn-primary !py-2 text-sm disabled:opacity-60"
          >
            {pending ? "處理中…" : "新增帳號"}
          </button>
        </div>
      </form>

      {notice && (
        <p className={cn("text-sm", notice.kind === "ok" ? "text-gold" : "text-red-600")}>
          {notice.text}
        </p>
      )}

      {/* List */}
      <div className="card overflow-x-auto">
        <table className="min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-[0.12em] text-faint">
              <th className="px-5 py-3 font-medium">帳號</th>
              <th className="px-4 py-3 font-medium">角色</th>
              <th className="px-4 py-3 font-medium">狀態</th>
              <th className="px-4 py-3 font-medium">建立日期</th>
              <th className="px-5 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.uid === currentUid;
              return (
                <tr key={u.uid} className="border-b border-line last:border-0">
                  <td className="px-5 py-4">
                    <span className="text-ink">{u.email || "（無 Email）"}</span>
                    {isSelf && <span className="ml-2 text-[11px] text-gold">你</span>}
                    {u.displayName && (
                      <span className="mt-0.5 block text-xs text-muted">{u.displayName}</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      className={cn(fieldCls, "w-40 !py-1.5 text-xs")}
                      value={u.role ?? ""}
                      disabled={pending || isSelf}
                      onChange={(e) => changeRole(u.uid, e.target.value as Role)}
                      title={isSelf ? "不能變更自己的角色" : undefined}
                    >
                      {u.role === null && (
                        <option value="" disabled>
                          未設定
                        </option>
                      )}
                      <option value="editor">{ROLE_LABELS.editor}</option>
                      <option value="admin">{ROLE_LABELS.admin}</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px]",
                        u.disabled ? "bg-red-500/10 text-red-700" : "bg-gold/15 text-gold-deep"
                      )}
                    >
                      {u.disabled ? "已停用" : "啟用中"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-muted">
                    {u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={pending || isSelf}
                        onClick={() => toggleDisabled(u.uid, !u.disabled)}
                        className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold hover:text-gold disabled:opacity-40"
                      >
                        {u.disabled ? "啟用" : "停用"}
                      </button>
                      <button
                        type="button"
                        disabled={pending || isSelf}
                        onClick={() => remove(u.uid, u.email || u.uid)}
                        className="rounded-full border border-line px-3 py-1.5 text-xs text-red-600 transition-colors hover:border-red-400 hover:text-red-700 disabled:opacity-40"
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted">
                  尚無帳號
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
