import { NextResponse } from 'next/server';
import { fetchAllArticles } from '@/lib/fetcher';

export const dynamic = 'force-dynamic';

export async function GET() {
  const articles = await fetchAllArticles();
  return NextResponse.json(articles);
}
