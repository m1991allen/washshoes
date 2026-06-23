# RENU 鞋包精緻護理 — 形象網站

> 🌐 **線上 Demo：** https://washshoes.vercel.app　·　每次推送到 `main` 會自動部署到 Vercel。

質感深色奢華風的鞋包護理品牌形象網站，以 **Next.js 15（App Router）+ TypeScript + Tailwind CSS v4** 打造，支援 **中／英雙語**，並內建完整的 SEO 基礎建設。

---

## 快速開始

```bash
npm install        # 安裝相依套件
npm run dev        # 開發模式 → http://localhost:3000
npm run build      # 產出正式版
npm run start      # 啟動正式版伺服器
```

開啟後會依瀏覽器語系自動導向 `/zh` 或 `/en`。

---

## 設計與技術

| 項目 | 說明 |
| --- | --- |
| 風格 | 深色底（`#0b0b0d`）＋ 香檳金點綴（`#c8a86a`），襯線標題 + 無襯線內文 |
| 字體 | Cormorant Garamond／Noto Serif TC（標題）、Inter／Noto Sans TC（內文），由 `next/font` 載入 |
| 動效 | 捲動淡入（`Reveal`）、數字累加（`Counter`）、Before/After 拖曳比較滑桿，皆尊重 `prefers-reduced-motion` |
| 雙語 | 路徑式 i18n（`/zh`、`/en`），對 SEO 最友善；語系由 `middleware.ts` 偵測並導向 |

> 圖片目前以「編輯風格的漸層占位框（`Frame`）」呈現，確保無真實照片時也維持質感。
> 之後只要把真實照片以 `next/image` 傳入 `Frame` 或 `BeforeAfter` 的對應位置即可。

---

## 專案結構

```
src/
├─ middleware.ts              # 語系偵測與導向（/ → /zh 或 /en）
├─ i18n/
│  ├─ config.ts               # 支援語系、預設語系
│  ├─ getDictionary.ts        # 字典載入器
│  └─ dictionaries/
│     ├─ zh.ts                # 中文文案（內容的單一真實來源）
│     └─ en.ts                # 英文文案（型別比對 zh）
├─ lib/
│  ├─ site.ts                 # 品牌／聯絡／社群／地圖設定（單一來源）
│  ├─ seo.ts                  # ★ SEO 設定來源 + buildMetadata()
│  └─ utils.ts                # cn()、localizedPath()
├─ components/                # Header / Footer / 卡片 / 表單 / 動效…
│  └─ sections/               # 首頁各區塊（Hero、Process、CTA…）
└─ app/
   ├─ sitemap.ts              # 自動產生 sitemap.xml（含 hreflang）
   ├─ robots.ts               # 自動產生 robots.txt
   └─ [locale]/
      ├─ layout.tsx           # 字體、Header/Footer、LocalBusiness 結構化資料
      ├─ opengraph-image.tsx  # 動態產生社群分享圖（OG/Twitter）
      ├─ not-found.tsx        # 雙語 404
      ├─ page.tsx             # 首頁
      ├─ services/            # 服務項目
      ├─ cases/              # 案例分享（含分類篩選）
      ├─ about/              # 關於我們
      ├─ faq/                # 常見問題（含 FAQPage 結構化資料）
      └─ contact/            # 聯絡我們（地圖 + 預約表單）
```

---

## 頁面

- **首頁** — Hero、品牌理念、服務預覽、五道服務流程、案例 Before/After、特色、客戶見證、CTA
- **服務項目** — 六大服務（洗鞋／洗包／鞋修復／包修復／改色翻新／五金保養）完整說明
- **案例分享** — 可依服務分類篩選的前後對比
- **關於我們** — 品牌故事、堅持、數據
- **常見問題** — 手風琴式 Q&A
- **聯絡我們** — 聯絡資訊、Google 地圖、社群、預約／諮詢表單

---

## SEO 基礎建設（已完成，並為第二階段預留接口）

每頁 metadata 都由 [`src/lib/seo.ts`](src/lib/seo.ts) 的 `buildMetadata()` 產生，內容包含：

- `<title>`／`description`／`keywords`（**逐頁、逐語系**）
- Canonical URL 與 **hreflang** 替代連結（zh-TW／en／x-default）
- Open Graph 與 Twitter Card
- 動態 OG 分享圖（`opengraph-image.tsx`）
- 結構化資料：首頁 `LocalBusiness`、FAQ 頁 `FAQPage`
- `sitemap.xml`（含 hreflang）與 `robots.txt`

> **這就是第二階段後台要接的點。** `seo.ts` 目前以靜態物件作為 SEO 設定來源；
> 第二階段只需把 `getSeoEntry()` 改為「從資料庫／CMS 讀取」，後台即可逐頁、逐語系
> 編輯標題、描述、關鍵字與 OG 圖 —— **頁面程式碼完全不用動**。
> 同理，品牌與聯絡資訊集中在 `site.ts`，也可由後台管理。

---

## 上線前待辦

- [ ] 將 `src/lib/site.ts` 的 `url`、電話、地址、社群連結改為正式資料
- [ ] 把 `Frame` / `BeforeAfter` 占位框換成真實照片（`next/image`）
- [ ] 將聯絡表單（`ContactForm.tsx` 內有標註）接上實際的後端 API

---

## 階段規劃

1. **第一階段（本專案）** — 雙語形象網站 + SEO 基礎建設 ✅
2. **第二階段** — 後台登入 + SEO 後台管理（接上 `seo.ts` / `site.ts` 的資料來源）
3. **第三階段** — 待定
