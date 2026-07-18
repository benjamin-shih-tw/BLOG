import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getNotionPosts() {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    console.warn("⚠️  NOTION_TOKEN or NOTION_DATABASE_ID is missing.");
    return [];
  }

  const databaseId = process.env.NOTION_DATABASE_ID;
  console.log("🔍 Querying Notion DB:", databaseId);

  try {
    // 先不加 filter，抓取全部頁面來測試連線
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    console.log(`✅ Notion returned ${response.results.length} total pages`);

    if (response.results.length > 0) {
      // 印出第一筆的 properties，幫助排查格式問題
      const firstPage = response.results[0];
      console.log("📄 First page properties:", JSON.stringify(
        Object.fromEntries(
          Object.entries(firstPage.properties).map(([k, v]) => [k, { type: v.type }])
        )
      ));
      const statusProp = firstPage.properties.Status;
      console.log("📊 Status property raw:", JSON.stringify(statusProp));
    }

    // 篩選出已發佈的文章（支援 status 或 select 兩種屬性格式）
    const published = response.results.filter((page) => {
      const statusProp = page.properties.Status;
      if (!statusProp) return false;
      if (statusProp.type === 'status') {
        return statusProp.status?.name === 'Published';
      }
      if (statusProp.type === 'select') {
        return statusProp.select?.name === 'Published';
      }
      return false;
    });

    console.log(`📝 Published pages: ${published.length}`);

    return published.map((page) => {
      const title = page.properties.Title?.title[0]?.plain_text || '未命名文章';
      const slug = page.properties.Slug?.rich_text[0]?.plain_text || page.id;
      const date = page.properties.Date?.date?.start || new Date().toISOString().split('T')[0];
      const description = page.properties.Description?.rich_text[0]?.plain_text || '';
      
      // 嘗試讀取 Notion 裡的 Type (支援 Select 或 Text 格式)，預設為 'blog'
      const type = page.properties.Type?.select?.name || page.properties.Type?.rich_text?.[0]?.plain_text || 'blog';
      // 嘗試讀取 Notion 裡的 Link (支援 URL 或 Text 格式)
      const link = page.properties.Link?.url || page.properties.Link?.rich_text?.[0]?.plain_text || null;

      return {
        id: page.id,
        slug,
        title,
        date,
        description,
        type: type.toLowerCase(), // 轉小寫以利比對
        link,
        isNotion: true,
      };
    });
  } catch (error) {
    console.error("❌ Error fetching Notion posts:", error.message);
    return [];
  }
}

export async function getNotionPostBlocks(blockId) {
  if (!process.env.NOTION_TOKEN) return [];
  
  const blocks = [];
  let cursor;
  
  try {
    while (true) {
      // 使用官方高階 API
      const response = await notion.blocks.children.list({
        block_id: blockId,
        ...(cursor ? { start_cursor: cursor } : {}),
      });
      
      blocks.push(...response.results);
      if (!response.next_cursor) {
        break;
      }
      cursor = response.next_cursor;
    }
    return blocks;
  } catch (error) {
    console.error(`❌ Error fetching blocks for blockId ${blockId}:`, error.message);
    return [];
  }
}
