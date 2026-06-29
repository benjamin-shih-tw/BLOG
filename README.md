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
