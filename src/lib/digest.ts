import { Article } from './types';

export interface DigestBuildResult {
  subject: string;
  body: string;
}

/**
 * Build a digest email body from articles.
 * Uses deterministic snippet extraction for reproducibility.
 */
export function buildDigest(
  articles: Article[],
  options: { scope?: '24h' | 'top20' } = {}
): DigestBuildResult {
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
    body += newsArticles.map((article, i) => {
      const desc = article.description || '';
      const snippet = desc.slice(0, 200);
      return `### ${i + 1}. ${article.title}

**来源:** ${article.source} · **分类:** ${article.categories.join(', ')}

${snippet}${snippet.length >= 200 ? '...' : ''}

[阅读原文](${article.url})`;
    }).join('\n\n---\n\n');
    body += '\n\n';
  }

  if (paperArticles.length > 0) {
    body += `## 论文 (${paperArticles.length}篇)\n\n`;
    body += paperArticles.map((article, i) => {
      const desc = article.description || '';
      const snippet = desc.slice(0, 200);
      return `### ${i + 1}. ${article.title}

**来源:** ${article.source} · **分类:** ${article.categories.join(', ')}

${snippet}${snippet.length >= 200 ? '...' : ''}

[阅读原文](${article.url})`;
    }).join('\n\n---\n\n');
    body += '\n\n';
  }

  body += `---\n\n共 ${articles.length} 篇内容 | 发送时间: ${new Date().toISOString()}\n\nYou received this because you subscribed to AI Daily Digest.`;

  const subject = `AI Daily Digest - ${today} (${articles.length} articles)`;

  return { subject, body };
}

/**
 * Filter articles from the last 24 hours using a configurable Asia/Shanghai 8am window.
 */
export function filterLast24Hours(articles: Article[]): Article[] {
  const now = new Date();
  // Use Asia/Shanghai timezone offset for accurate daily window
  const shanghaiOffset = 8 * 60; // +8 hours in minutes
  const localOffset = now.getTimezoneOffset();

  const shanghaiNow = new Date(now.getTime() + (shanghaiOffset + localOffset) * 60000);
  const today8amShanghai = new Date(Date.UTC(
    shanghaiNow.getUTCFullYear(),
    shanghaiNow.getUTCMonth(),
    shanghaiNow.getUTCDate(),
    8, 0, 0
  ));
  const yesterday8amShanghai = new Date(today8amShanghai);
  yesterday8amShanghai.setUTCDate(yesterday8amShanghai.getUTCDate() - 1);

  return articles.filter(article => {
    const pubDate = new Date(article.publishedAt);
    return pubDate >= yesterday8amShanghai && pubDate < today8amShanghai;
  });
}