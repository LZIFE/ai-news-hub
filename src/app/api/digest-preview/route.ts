import { NextRequest, NextResponse } from 'next/server';
import { fetchAllArticles } from '@/lib/fetcher';

export const dynamic = 'force-dynamic';

/**
 * Preview the digest email HTML in the browser without sending it.
 * Auth-gated the same way as the send endpoints.
 * Pass ?all=1 to skip the 24h filter and preview the full feed.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  // Allow either Bearer token or ?key= for easy browser preview
  const queryKey = request.nextUrl.searchParams.get('key');
  const expected = process.env.CRON_SECRET;
  if (!expected || (authHeader !== `Bearer ${expected}` && queryKey !== expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allArticles = await fetchAllArticles();
    const { buildDigest, filterLast24Hours } = await import('@/lib/digest');

    const useAll = request.nextUrl.searchParams.get('all') === '1';
    const todayArticles = filterLast24Hours(allArticles);
    const articles = useAll || todayArticles.length === 0 ? allArticles : todayArticles;

    if (articles.length === 0) {
      return new NextResponse('<body style="font-family:sans-serif;padding:40px;">No articles found.</body>', {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }

    const { subject, body } = buildDigest(articles);
    return new NextResponse(body, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        // Show the subject as a comment at the top of the preview for reference
        'x-subject': encodeURIComponent(subject),
      },
    });
  } catch (error) {
    console.error('Digest preview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
