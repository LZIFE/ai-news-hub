import { NextResponse } from 'next/server';
import { fetchAllArticles } from '@/lib/fetcher';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'BUTTONDOWN_API_KEY not configured' }, { status: 500 });
  }

  try {
    const allArticles = await fetchAllArticles();

    if (allArticles.length === 0) {
      return NextResponse.json({ message: 'No articles to send' });
    }

    // Use top 20 articles
    const articles = allArticles.slice(0, 20);

    // Split into news and papers
    const newsArticles = articles.filter(a => !a.categories.includes('论文'));
    const paperArticles = articles.filter(a => a.categories.includes('论文'));

    const today = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });

    let body = `# AI Daily Digest - ${today}\n\n`;

    if (newsArticles.length > 0) {
      body += `## AI资讯 (${newsArticles.length}篇)\n\n`;
      body += newsArticles.map((article, i) => `### ${i + 1}. ${article.title}

**来源:** ${article.source} · **分类:** ${article.categories.join(', ')}

${article.description ? article.description.slice(0, 200) + '...' : ''}

[阅读原文](${article.url})`).join('\n\n---\n\n');
      body += '\n\n';
    }

    if (paperArticles.length > 0) {
      body += `## 论文 (${paperArticles.length}篇)\n\n`;
      body += paperArticles.map((article, i) => `### ${i + 1}. ${article.title}

**来源:** ${article.source} · **分类:** ${article.categories.join(', ')}

${article.description ? article.description.slice(0, 200) + '...' : ''}

[阅读原文](${article.url})`).join('\n\n---\n\n');
      body += '\n\n';
    }

    body += `---\n\n共 ${articles.length} 篇内容 | 发送时间: ${new Date().toISOString()}\n\nYou received this because you subscribed to AI Daily Digest.`;

    const response = await fetch('https://api.buttondown.com/v1/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Buttondown-Live-Dangerously': 'true',
      },
      body: JSON.stringify({
        subject: `AI Daily Digest - ${today} (${articles.length} articles)`,
        body: body,
        status: 'about_to_send',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, emailId: data.id });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
