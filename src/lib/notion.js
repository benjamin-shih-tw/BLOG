import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getNotionPosts() {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    console.warn("NOTION_TOKEN or NOTION_DATABASE_ID is missing.");
    return [];
  }

  const databaseId = process.env.NOTION_DATABASE_ID;

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Status',
        status: { equals: 'Published' },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page) => {
      const title = page.properties.Title?.title[0]?.plain_text || '未命名文章';
      const slug = page.properties.Slug?.rich_text[0]?.plain_text || page.id;
      const date = page.properties.Date?.date?.start || new Date().toISOString().split('T')[0];
      const description = page.properties.Description?.rich_text[0]?.plain_text || '';

      return {
        id: page.id,
        slug,
        title,
        date,
        description,
        type: 'blog', // Default to blog for Notion posts
        isNotion: true,
      };
    });
  } catch (error) {
    console.error("Error fetching Notion posts:", error);
    return [];
  }
}

export async function getNotionPostBlocks(blockId) {
  if (!process.env.NOTION_TOKEN) return [];
  
  const blocks = [];
  let cursor;
  
  try {
    while (true) {
      const { results, next_cursor } = await notion.blocks.children.list({
        start_cursor: cursor,
        block_id: blockId,
      });
      
      blocks.push(...results);
      if (!next_cursor) {
        break;
      }
      cursor = next_cursor;
    }
    return blocks;
  } catch (error) {
    console.error(`Error fetching blocks for blockId ${blockId}:`, error);
    return [];
  }
}
