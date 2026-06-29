# 第二階段 — Firebase 後台設定指南

本專案第二階段的後台採 **Firebase（GCP）**：

- **Firebase Authentication** — 後台登入，多人 + 權限角色（custom claims）
- **Cloud Firestore** — SEO 設定與頁面內容
- **Firebase Storage** — 案例圖片 / OG 圖

---

## 1. 建立 Firebase 專案

1. 前往 <https://console.firebase.google.com> → **新增專案**（例：`renu-cms`）。
2. **Authentication** → 開始使用 → 啟用 **電子郵件/密碼**（要 Google 登入也一起啟用）。
3. **Firestore Database** → 建立資料庫 → **Production mode** → 地區建議 `asia-east1`（台灣）或 `asia-northeast1`（東京）。
4. **Storage** → 開始使用（同地區）。
5. **專案設定（齒輪）→ 一般 → 你的應用程式 → 新增 Web 應用程式 `</>`**，複製 `firebaseConfig` 6 個值。
6. **專案設定 → 服務帳戶 → 產生新的私密金鑰** → 下載 JSON（**機密**）。

## 2. 設定環境變數

把專案根目錄的 `.env.example` 複製成 `.env.local`，填入：

- 第 5 步的 6 個公開值 → `NEXT_PUBLIC_FIREBASE_*`
- 第 6 步 JSON 內的 `project_id` / `client_email` / `private_key` → `FIREBASE_*`
  - `FIREBASE_PRIVATE_KEY` 整段用雙引號包住、保留 `\n`

`.env.local` 已被 gitignore，**不會上傳**。正式環境（Vercel）另外在
Settings → Environment Variables 加同樣的變數。

## 3. 角色（custom claims）

使用者角色存在 Firebase Auth 的 custom claims：

- `admin` — 完整權限（含管理使用者）
- `editor` — 可編輯 SEO 與內容，不能管理使用者

第一位 admin 由種子腳本建立（待 credentials 就緒後提供）。

## 4. Firestore 資料結構（規劃）

```
seo/{page}            # 逐頁 SEO；欄位含 zh / en 兩組 title, description, keywords, ogImage
content/{page}        # 頁面內容文案（zh / en）
cases/{caseId}        # 案例：分類、標題、說明、before/after 圖片 URL（zh / en）
settings/site         # 品牌 / 聯絡 / 社群 / 營業時間
users/{uid}           # 後台使用者顯示資料與角色（角色同時寫入 custom claims）
```

> 字典檔（`src/i18n/dictionaries`）仍是**預設值**；Firestore 有資料時覆寫，沒有時 fallback。
