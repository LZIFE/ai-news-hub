import { NextResponse } from 'next/server';
import { fetchAllArticles } from '@/lib/fetcher';

export const revalidate = 3600;

export async function GET() {
  const articles = await fetchAllArticles();
  return NextResponse.json(articles);
}
