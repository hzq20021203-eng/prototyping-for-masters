import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.NOTION_API_KEY?.trim() || '';
  const databaseId = process.env.NOTION_DATABASE_ID?.trim() || '';
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID?.trim() || '';
  const notionVersion = process.env.NOTION_VERSION?.trim() || '2026-03-11';

  return NextResponse.json({
    configured: Boolean(apiKey && (databaseId || dataSourceId)),
    hasApiKey: Boolean(apiKey),
    apiKeyMasked: apiKey ? `${apiKey.slice(0, 7)}...${apiKey.slice(-4)}` : '',
    hasDatabaseId: Boolean(databaseId),
    hasDataSourceId: Boolean(dataSourceId),
    dataSourceId: dataSourceId || databaseId,
    notionVersion
  });
}
