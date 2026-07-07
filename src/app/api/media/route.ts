import { NextResponse } from 'next/server';
import { fetchMediaArticles } from '@/lib/media-fetcher';

export const dynamic = 'force-dynamic';

export async function GET() {
  const articles = await fetchMediaArticles();
  return NextResponse.json(articles);
}
