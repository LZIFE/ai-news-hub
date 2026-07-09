import { NextResponse } from 'next/server';
import { fetchAllPapers } from '@/lib/paper-fetcher';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const papers = await fetchAllPapers();

  if (category) {
    const filtered = papers.filter((p) =>
      p.categories.some((c) => c.toLowerCase() === category.toLowerCase())
    );
    return NextResponse.json(filtered);
  }

  return NextResponse.json(papers);
}
