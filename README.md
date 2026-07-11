# Portfolio Blog - 專屬更新教學 (Notion 架構版)

恭喜！您的個人網站現在已經與 **Notion** 完美整合，成為一個完全原生的「Notion Blog」。

未來不論您要新增「部落格筆記」或是「展示新的 GitHub 專案」，**您再也不需要打開程式碼編輯器了！所有操作都在 Notion 上完成。**

---

## 🛠️ Notion 資料庫必備屬性 (Properties) 設定

為了讓網站順利抓取並套用美美的排版，請確認您的 Notion 資料庫擁有以下 **7 個屬性 (Properties)**，名稱與大小寫需一致：

1. **`Title`** (屬性類型：`Title` / 標題)
   - **功能**：文章的主標題。
2. **`Status`** (屬性類型：`Status` 或 `Select`)
   - **功能**：狀態管理。記得一定要設定為 **`Published`**，網站才會抓取這篇文章。
3. **`Slug`** (屬性類型：`Text` / 文字)
   - **功能**：專屬的網址路徑 (例：`my-new-project`)。請務必使用英文與連字號，確保網址正確。
4. **`Date`** (屬性類型：`Date` / 日期)
   - **功能**：文章發布日期。首頁的卡片會依照這個日期由新到舊自動排序。
5. **`Type`** (屬性類型：`Select` 或 `Text`)
   - **功能**：決定這篇文章要出現在首頁的哪一個分頁。
   - 填寫 **`project`** 👉 會出現在「GitHub Projects」分頁。
   - 填寫 **`blog`**、**`notes`** (或非 project 的字) 👉 會出現在「Blog / Notes」分頁。
6. **`Description`** (屬性類型：`Text` / 文字)
   - **功能**：顯示在首頁卡片上的「簡短介紹」。若不填寫則留白。
7. **`Link`** (屬性類型：`URL` 或 `Text`)
   - **功能**：填寫您的 GitHub 專案連結。
   - 💡 **觸發條件**：只有當 `Type` 為 `project`，且這裡有填網址時，文章最底部才會自動長出 **「Visit Project ↗」** 的按鈕！

---

## 🚀 日常更新流程 (超級簡單)

### 情況 A：我要新增一篇 Blog / Notes
1. 到 Notion 資料庫新增一頁。
2. `Status` 設為 **Published**。
3. `Type` 設為 **blog**。
4. 在下方隨意撰寫您的筆記內容 (支援圖片、程式碼區塊、引言等)。
5. (不用填 `Link`，因為這是一般文章)。

### 情況 B：我要展示一個 GitHub Project
1. 到 Notion 資料庫新增一頁。
2. `Status` 設為 **Published**。
3. `Type` 設為 **project**。
4. 在 `Link` 屬性中貼上您的 GitHub 專案網址。
5. 在下方撰寫專案介紹與截圖。

---

## ☁️ 發布上線 (如何讓新文章出現在網站上？)

因為您的網站是部署在 GitHub Pages 上的靜態網站 (SSG)，目前有兩種方式可以讓 Notion 的新文章更新到網站上：

1. **佛系自動更新 (Cron Schedule)**
   - 我們已經在 GitHub Actions 設定了每日自動更新。您什麼都不用做，寫完文章放著，明天網站就會自動長出新文章了！
2. **我現在馬上就要看 (手動觸發)**
   - 打開您的 GitHub 儲存庫頁面。
   - 點擊上方的 **Actions** 頁籤。
   - 在左側選單點擊 **Deploy Next.js site to Pages**。
   - 點擊右方的 **Run workflow** 下拉選單並執行。
   - 泡杯咖啡等一分鐘，網站就更新完成了！

---

## 備註：保留舊有的 Local Markdown 寫法

### 📖 您的專屬未來更新教學 (超級簡單)

未來不論您要新增「部落格筆記」或是「展示新的 GitHub 專案」，**唯一要做的事情就是：在 `src/data/projects/` 資料夾中新增 `.md` 檔案！**

#### 情況 A：我要新增一篇 Blog / Notes
請建立一個 Markdown 檔案，重點是 `type` 要設定為 `"blog"`。

```markdown
---
title: "我的學習筆記"
date: "2026-06-29"
description: "這是一篇單純的部落格文章。"
type: "blog"
---

# 文章正文
這裡寫筆記內容...
(因為 type 是 blog，所以這篇文章最底下不會出現超連結按鈕！)
```

#### 情況 B：我要展示一個 GitHub Project
請建立一個 Markdown 檔案，重點是 `type` 要設定為 `"project"`，並且加上您專案的 `link`。

```markdown
---
title: "live-photo-generator"
date: "2026-06-29"
description: "一個用 Python 寫的生動相片生成器。"
type: "project"
link: "https://github.com/benjamin-shih-tw/live-photo-generator"
---

# 專案介紹
這是我寫的厲害專案，以下是它的截圖和使用方式說明：
...
(因為 type 是 project，且設定了 link，文章最底部就會自動出現 Visit Project ↗ 按鈕，引導使用者去您的 GitHub！)
```

---

#### 最後一步：發布上線
檔案寫好之後，回到終端機輸入我們最熟悉的那三行：
```bash
cd /Users/benjamin/.gemini/antigravity/scratch/portfolio-blog
git add .
git commit -m "更新文章或專案"
git push
```
只要敲完這三行指令，泡杯咖啡，一分鐘後 GitHub 就會自動幫您的網站更新完成了！

這個新架構給了您 100% 的排版與文字控制權，您可以自由選擇哪些專案要放在個人網頁上，是不是非常乾淨俐落呢！您現在就可以嘗試新增一篇自己的專案文章看看！
