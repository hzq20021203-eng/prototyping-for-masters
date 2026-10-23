import { NextResponse } from 'next/server';
import { fetchBooksFromNotion } from './notionService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await fetchBooksFromNotion();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: 'Failed to fetch books', message },
      { status: 500 }
    );
  }
}
