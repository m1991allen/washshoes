# 第二階段 — Firebase 後台設定指南

本專案第二階段的後台採 **Firebase（GCP）**：

- **Firebase Authentication** — 後台登入，多人 + 權限角色（custom claims）
- **Cloud Firestore** — SEO 設定與頁面內容
- **Vercel Blob** — 案例圖片 / 首頁 hero 圖（見下方「圖片儲存」）

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
- 第 6 步下載的整包 JSON → `FIREBASE_SERVICE_ACCOUNT_KEY`
  - 建議轉成 base64 再貼，省掉換行與引號的麻煩：
    `base64 -w0 serviceAccount.json`（Windows 用 `certutil -encode`）
  - 直接貼 JSON 也可以，但要壓成一行並用單引號包住

- 圖片上傳用的 `BLOB_READ_WRITE_TOKEN` → 見第 5 節

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

## 5. 圖片儲存（Vercel Blob）

圖片**不放 Firebase Storage**，改用 Vercel Blob（免費額度內、不需開 Blaze 方案）。

### store 設定

| 項目 | 值 | 備註 |
| --- | --- | --- |
| 名稱 | `washshoes-blob` | |
| 存取模式 | **Public** | **建立後不可修改**。前台要能直接用 URL 讀圖，一定要 public |
| 環境 | All Environments | |
| 環境變數 | `BLOB_READ_WRITE_TOKEN` | 連到專案後 Vercel 自動注入；本機需手動填 `.env.local` |

> 一個專案只接**一個** Blob store —— 接第二個時 `BLOB_READ_WRITE_TOKEN` 會撞名。

### 上傳流程

1. 瀏覽器先壓縮（最長邊 1600px、JPEG q=0.82）— `src/lib/image/client-upload.ts`
2. POST 到 `/api/admin/upload`（admin/editor 才可，限 JPG/PNG/WebP、8MB）
3. 伺服器以 `put()` 寫入 Blob，路徑 `<prefix>/<uuid>.<ext>`，快取 1 年 — `src/lib/cms/storage.ts`
4. 回傳公開 CDN URL，存進 Firestore

`next.config.mjs` 的 `images.remotePatterns` 已允許 `*.public.blob.vercel-storage.com`。

### 換 store 的注意事項

Blob URL 的網域含 store id（`<storeId>.public.blob.vercel-storage.com`），
**換 store 等於所有舊 URL 失效**。若必須更換，先把 `BLOB_READ_WRITE_TOKEN`
換成新 store 的 token，再跑一次性遷移腳本 —— 它會找出 Firestore 內還指向舊 store
的圖，抓下來寫進新 store，並同步改寫 URL：

```bash
node --env-file=.env.local scripts/migrate-blob-store.mjs           # 預演
node --env-file=.env.local scripts/migrate-blob-store.mjs --apply   # 執行
```

> 腳本只搬 Firestore 真正引用到的圖。沒被引用的孤兒檔（後台換圖時沒清掉的舊圖）
> 不會搬過去，會隨舊 store 一起消失。
