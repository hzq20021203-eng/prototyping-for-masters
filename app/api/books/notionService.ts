import { NotionBook, DEMO_BOOKS } from './demoData';

interface RawNotionProperty {
  type?: string;
  title?: Array<{ plain_text: string }>;
  rich_text?: Array<{ plain_text: string }>;
  select?: { name: string; color?: string } | null;
  multi_select?: Array<{ name: string; color?: string }>;
  people?: Array<{ name: string }>;
  number?: number | null;
  url?: string | null;
  files?: Array<{ file?: { url: string }; external?: { url: string } }>;
}

interface RawNotionPage {
  id: string;
  url?: string;
  created_time?: string;
  last_edited_time?: string;
  cover?: {
    type?: 'external' | 'file';
    external?: { url: string };
    file?: { url: string };
  } | null;
  properties?: Record<string, RawNotionProperty>;
}

// Clean Notion IDs (stripping query params, hyphens or formatting standard UUID)
export function cleanNotionId(raw?: string): string {
  if (!raw) return '';
  let str = raw.trim();
  if (str.includes('notion.so') || str.includes('notion.site')) {
    const urlParts = str.split('?')[0].split('/');
    str = urlParts[urlParts.length - 1];
    const dashIdx = str.lastIndexOf('-');
    if (dashIdx !== -1 && str.length - dashIdx > 20) {
      str = str.slice(dashIdx + 1);
    }
  }
  const hex = str.replace(/[^a-zA-Z0-9]/g, '');
  if (hex.length === 32) {
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return str;
}

export function normalizeNotionPage(page: RawNotionPage): NotionBook {
  const props = page.properties || {};

  function getProp(regex: RegExp): RawNotionProperty | undefined {
    for (const key of Object.keys(props)) {
      if (regex.test(key)) return props[key];
    }
    return undefined;
  }

  // 1. Title
  let title = 'Untitled Book';
  const titleProp = getProp(/^title$/i) || Object.values(props).find(p => p.type === 'title');
  if (titleProp?.title?.length) {
    title = titleProp.title.map(t => t.plain_text).join('').trim();
  }

  // 2. Author
  let author = 'Unknown Author';
  const authorProp = getProp(/^author(s)?$/i) || getProp(/writer/i);
  if (authorProp) {
    if (authorProp.type === 'rich_text' && authorProp.rich_text?.length) {
      author = authorProp.rich_text.map(t => t.plain_text).join('').trim();
    } else if (authorProp.type === 'select' && authorProp.select?.name) {
      author = authorProp.select.name;
    } else if (authorProp.type === 'multi_select' && authorProp.multi_select?.length) {
      author = authorProp.multi_select.map(s => s.name).join(', ');
    } else if (authorProp.type === 'people' && authorProp.people?.length) {
      author = authorProp.people.map(p => p.name).join(', ');
    }
  }

  // 3. Genre: Single select or first multi_select
  let genre = { name: 'Uncategorized', color: 'gray' };
  const genreProp = getProp(/^genre(s)?$/i) || getProp(/^category$/i) || getProp(/^tag(s)?$/i);
  if (genreProp) {
    if (genreProp.type === 'select' && genreProp.select?.name) {
      genre = {
        name: genreProp.select.name,
        color: genreProp.select.color || 'gray'
      };
    } else if (genreProp.type === 'multi_select' && genreProp.multi_select?.[0]?.name) {
      genre = {
        name: genreProp.multi_select[0].name,
        color: genreProp.multi_select[0].color || 'gray'
      };
    }
  }

  // 4. Cover Image
  let coverImage = '';
  if (page.cover) {
    if (page.cover.type === 'external' && page.cover.external?.url) {
      coverImage = page.cover.external.url;
    } else if (page.cover.type === 'file' && page.cover.file?.url) {
      coverImage = page.cover.file.url;
    }
  }
  if (!coverImage) {
    const coverProp = getProp(/^cover(\s+image)?$/i) || getProp(/^image$/i) || getProp(/^book(\s+cover)?$/i);
    if (coverProp) {
      if (coverProp.type === 'files' && coverProp.files?.length) {
        const fileObj = coverProp.files[0];
        coverImage = fileObj.file?.url || fileObj.external?.url || '';
      } else if (coverProp.type === 'url' && coverProp.url) {
        coverImage = coverProp.url;
      }
    }
  }

  // 5. Rating
  let rating: number | null = null;
  const ratingProp = getProp(/^rating$/i) || getProp(/^score$/i) || getProp(/^stars$/i);
  if (ratingProp) {
    if (ratingProp.type === 'number' && typeof ratingProp.number === 'number') {
      rating = ratingProp.number;
    } else if (ratingProp.type === 'select' && ratingProp.select?.name) {
      const parsed = parseFloat(ratingProp.select.name.replace(/[^0-9.]/g, ''));
      if (!isNaN(parsed)) rating = parsed;
    }
  }

  // 6. Review
  let review = '';
  const reviewProp = getProp(/^review$/i) || getProp(/^notes$/i) || getProp(/^thoughts$/i) || getProp(/^summary$/i);
  if (reviewProp) {
    if (reviewProp.type === 'rich_text' && reviewProp.rich_text?.length) {
      review = reviewProp.rich_text.map(t => t.plain_text).join('').trim();
    }
  }

  return {
    id: page.id,
    title,
    author,
    genre,
    coverImage,
    rating,
    review,
    url: page.url,
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time
  };
}

export async function fetchBooksFromNotion(): Promise<{
  source: 'notion' | 'demo';
  count: number;
  books: NotionBook[];
  notionVersion?: string;
  dataSourceId?: string | null;
  warning?: string;
}> {
  const apiKey = process.env.NOTION_API_KEY?.trim();
  const rawDataSourceId = process.env.NOTION_DATA_SOURCE_ID || '';
  const rawDatabaseId = process.env.NOTION_DATABASE_ID || '';
  const notionVersion = process.env.NOTION_VERSION?.trim() || '2026-03-11';

  const dataSourceId = cleanNotionId(rawDataSourceId);
  const databaseId = cleanNotionId(rawDatabaseId);
  const targetId = dataSourceId || databaseId;

  if (!apiKey || !targetId) {
    return {
      source: 'demo',
      count: DEMO_BOOKS.length,
      books: DEMO_BOOKS,
      warning: 'No Notion credentials configured. Displaying demo reading collection.'
    };
  }

  try {
    let allPages: RawNotionPage[] = [];
    let hasMore = true;
    let startCursor: string | undefined = undefined;

    // Step 1: Query Notion Data Source API endpoint (2026-03-11 standard)
    while (hasMore && allPages.length < 200) {
      let endpoint = `https://api.notion.com/v1/data_sources/${targetId}/query`;

      const bodyPayload: Record<string, unknown> = { page_size: 100 };
      if (startCursor) {
        bodyPayload.start_cursor = startCursor;
      }

      let res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': notionVersion,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
      });

      // If data_sources endpoint fails, fallback to legacy databases endpoint
      if (!res.ok && res.status === 404 && databaseId) {
        endpoint = `https://api.notion.com/v1/databases/${databaseId}/query`;
        res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Notion-Version': notionVersion,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyPayload)
        });
      }

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.message || `Notion API responded with status ${res.status}`);
      }

      const data = await res.json();
      allPages.push(...(data.results || []));
      hasMore = Boolean(data.has_more);
      startCursor = data.next_cursor || undefined;
    }

    const normalized = allPages
      .map(normalizeNotionPage)
      .filter(b => b.title !== 'Untitled Book' || b.author !== 'Unknown Author' || b.coverImage || b.review);

    return {
      source: 'notion',
      count: normalized.length,
      books: normalized,
      notionVersion,
      dataSourceId: targetId
    };
  } catch (err: unknown) {
    console.error('Notion fetch error in portfolio:', err);
    return {
      source: 'demo',
      count: DEMO_BOOKS.length,
      books: DEMO_BOOKS,
      warning: err instanceof Error ? err.message : 'Failed to retrieve books from Notion.'
    };
  }
}
