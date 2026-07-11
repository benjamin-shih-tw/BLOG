require("dotenv").config();
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const fs = require("fs");
const path = require("path");

const token = process.env.NOTION_TOKEN;
console.log(`🗝️ Token 狀態檢查: ${token ? token.substring(0, 10) + "... (已讀取)" : "未讀取到"}`);
if (token && token.startsWith("encrypted")) {
  console.error("🚨 警告：你的 Token 是 dotenvx 的加密字串，API 呼叫一定會失敗！請改成純文字。");
}

const notion = new Client({ auth: token });
const n2m = new NotionToMarkdown({ notionClient: notion });

async function syncBlog() {
  console.log("🚀 開始啟動 Notion 同步管線...");
  const databaseId = process.env.NOTION_DATABASE_ID;

  try {
    console.log("📡 正在向 Notion 伺服器請求資料庫內容...");
    const response = await notion.request({
      path: `databases/${databaseId}/query`,
      method: "post",
      body: {
        filter: {
          property: "Status",
          status: { equals: "Published" }
        }
      }
    });

    console.log(`✅ 讀取完畢：共找到 ${response.results.length} 篇準備發布的文章。`);

    const outputDir = path.join(__dirname, "content", "posts");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const page of response.results) {
      const title = page.properties.Title?.title[0]?.plain_text || "未命名文章";
      const slug = page.properties.Slug?.rich_text[0]?.plain_text || page.id;
      const date = page.properties.Date?.date?.start || new Date().toISOString().split('T')[0];

      process.stdout.write(`⏳ 正在處理 [${title}]... `);

      const mdblocks = await n2m.pageToMarkdown(page.id);
      const mdString = n2m.toMarkdownString(mdblocks);

      const frontmatter = `---
title: "${title}"
date: "${date}"
---

`;
      
      const filePath = path.join(outputDir, `${slug}.md`);
      fs.writeFileSync(filePath, frontmatter + mdString.parent);
      
      console.log(`✅ 完成 (${slug}.md)`);
    }
    
    console.log("🎉 所有文章同步作業完成！");

  } catch (error) {
    console.error("❌ 同步管線執行失敗，錯誤訊息：", error.message || error);
  }
}

syncBlog();
