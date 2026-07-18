// 完全不使用 @notionhq/client SDK，改用原生 fetch 呼叫 Notion API
// 這樣就完全繞過 Turbopack 把 SDK 打包壞掉的問題

const NOTION_API = 'https://api.notion.com/v1';

function notionHeaders() {
  return {
    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  };
}

export async function getNotionPosts() {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    console.warn("⚠️  NOTION_TOKEN or NOTION_DATABASE_ID is missing.");
    return [];
  }

  const databaseId = process.env.NOTION_DATABASE_ID;
  console.log("🔍 Querying Notion DB:", databaseId);

  try {
    const res = await fetch(`${NOTION_API}/databases/${databaseId}/query`, {
      method: 'POST',
      headers: notionHeaders(),
      body: JSON.stringify({
        sorts: [{ property: 'Date', direction: 'descending' }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ Notion API error:", res.status, errText);
      return [];
    }

    const data = await res.json();
    console.log(`✅ Notion returned ${data.results.length} total pages`);

    if (data.results.length > 0) {
      const firstPage = data.results[0];
      const statusProp = firstPage.properties.Status;
      console.log("📊 Status property raw:", JSON.stringify(statusProp));
    }

    // 篩選出已發佈的文章（支援 status 或 select 兩種屬性格式）
    const published = data.results.filter((page) => {
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
      
      // 嘗試讀取 Type (支援 Select 或 Text 格式)，預設為 'blog'
      const type = page.properties.Type?.select?.name || page.properties.Type?.rich_text?.[0]?.plain_text || 'blog';
      // 嘗試讀取 Link (支援 URL 或 Text 格式)
      const link = page.properties.Link?.url || page.properties.Link?.rich_text?.[0]?.plain_text || null;

      return {
        id: page.id,
        slug,
        title,
        date,
        description,
        type: type.toLowerCase(),
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
  let cursor = null;
  
  try {
    while (true) {
      const url = cursor
        ? `${NOTION_API}/blocks/${blockId}/children?start_cursor=${cursor}`
        : `${NOTION_API}/blocks/${blockId}/children`;

      const res = await fetch(url, {
        method: 'GET',
        headers: notionHeaders(),
        cache: 'no-store',
      });

      if (!res.ok) {
        console.error(`❌ Error fetching blocks: ${res.status}`);
        break;
      }

      const data = await res.json();
      blocks.push(...data.results);
      
      if (!data.next_cursor) break;
      cursor = data.next_cursor;
    }
    return blocks;
  } catch (error) {
    console.error(`❌ Error fetching blocks for blockId ${blockId}:`, error.message);
    return [];
  }
}
