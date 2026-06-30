"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { ROLES, type Role } from "@/lib/cms/types";
import {
  createAdminUser,
  setUserRole,
  setUserDisabled,
  deleteAdminUser,
} from "@/lib/cms/users-store";

export type UserActionResult = { ok: boolean; error?: string };

const isRole = (v: string): v is Role => (ROLES as readonly string[]).includes(v);
const msg = (e: unknown) => (e instanceof Error ? e.message : "操作失敗");

export async function createUserAction(form: {
  email: string;
  password: string;
  displayName: string;
  role: string;
}): Promise<UserActionResult> {
  await requireUser(["admin"]);
  try {
    const email = form.email.trim();
    if (!email) return { ok: false, error: "請輸入 Email" };
    if (!form.password || form.password.length < 6)
      return { ok: false, error: "密碼至少需 6 碼" };
    if (!isRole(form.role)) return { ok: false, error: "角色無效" };

    await createAdminUser({
      email,
      password: form.password,
      displayName: form.displayName.trim(),
      role: form.role,
    });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: msg(e) };
  }
}

export async function setRoleAction(uid: string, role: string): Promise<UserActionResult> {
  const me = await requireUser(["admin"]);
  try {
    if (!isRole(role)) return { ok: false, error: "角色無效" };
    if (uid === me.uid && role !== "admin")
      return { ok: false, error: "不能調降自己的角色（會失去管理權限）" };
    await setUserRole(uid, role);
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: msg(e) };
  }
}

export async function setDisabledAction(
  uid: string,
  disabled: boolean
): Promise<UserActionResult> {
  const me = await requireUser(["admin"]);
  try {
    if (uid === me.uid && disabled) return { ok: false, error: "不能停用自己的帳號" };
    await setUserDisabled(uid, disabled);
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: msg(e) };
  }
}

export async function deleteUserAction(uid: string): Promise<UserActionResult> {
  const me = await requireUser(["admin"]);
  try {
    if (uid === me.uid) return { ok: false, error: "不能刪除自己的帳號" };
    await deleteAdminUser(uid);
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: msg(e) };
  }
}
