import { NextRequest, NextResponse } from 'next/server';
import { fetchAllArticles } from '@/lib/fetcher';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'BUTTONDOWN_API_KEY not configured' }, { status: 500 });
  }

  try {
    const { articles } = await fetchAllArticles({ page: 1, pageSize: 20 });

    if (articles.length === 0) {
      return NextResponse.json({ message: 'No articles to send' });
    }

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const topArticles = articles.slice(0, 10);

    const body = `# AI Daily Digest - ${today}

${topArticles.map((article, i) => `## ${i + 1}. ${article.title}

**Source:** ${article.source} · **Categories:** ${article.categories.join(', ')}

${article.summary ? article.summary.slice(0, 200) + '...' : ''}

[Read more](${article.url})

---`).join('\n\n')}

---

You received this because you subscribed to AI Daily Digest.`;

    const response = await fetch('https://api.buttondown.com/v1/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Buttondown-Live-Dangerously': 'true',
      },
      body: JSON.stringify({
        subject: `AI Daily Digest - ${today}`,
        body: body,
        status: 'about_to_send',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Buttondown API error:', error);
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, emailId: data.id });
  } catch (error) {
    console.error('Digest cron error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
