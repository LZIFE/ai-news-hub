import { Article } from './types';

export interface DigestBuildResult {
  subject: string;
  body: string;
}

// Brand palette (kept in sync with tailwind.config.ts accent)
const COLOR = {
  accent: '#E85D26',
  accentHover: '#DC4A14',
  accentSoft: '#FDF1EA',
  bg: '#f4f5f7',
  card: '#ffffff',
  text: '#18181b',
  textMuted: '#6b7280',
  textBody: '#4b5563',
  border: '#ececef',
  borderSoft: '#f3f4f6',
};

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatToday(): string {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

/** Format an ISO date string to Beijing time (UTC+8) MM-DD HH:mm. */
function formatBeijingTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const beijing = new Date(d.getTime() + 8 * 3600 * 1000);
  const mm = String(beijing.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(beijing.getUTCDate()).padStart(2, '0');
  const hh = String(beijing.getUTCHours()).padStart(2, '0');
  const mi = String(beijing.getUTCMinutes()).padStart(2, '0');
  return `${mm}-${dd} ${hh}:${mi}`;
}

function buildArticleCard(article: Article, index: number): string {
  const title = escapeHtml(article.titleZh || article.title);
  const source = escapeHtml(article.source || '');
  const categories = escapeHtml((article.categories || []).filter(c => c !== '传媒监控').join(' · '));
  const time = formatBeijingTime(article.publishedAt);
  const snippet = escapeHtml((article.descriptionZh || article.description || '').slice(0, 240));
  const url = escapeHtml(article.url || '');
  const image = article.imageUrl ? escapeHtml(article.imageUrl) : '';

  const metaParts = [source, categories, time].filter(Boolean);
  const meta = metaParts.join(' &nbsp;·&nbsp; ');

  const imageHtml = image
    ? `<img src="${image}" width="120" height="120" alt="" style="width:120px;height:120px;border-radius:10px;object-fit:cover;display:block;flex:0 0 auto;" />`
    : '';

  const snippetHtml = snippet
    ? `<p style="margin:8px 0 0 0;font-size:14px;line-height:1.65;color:${COLOR.textBody};">${snippet}${snippet.length >= 240 ? '…' : ''}</p>`
    : '';

  // Two-column layout: text left, thumbnail right (when image present)
  if (imageHtml) {
    return `
        <tr>
          <td style="padding:8px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${COLOR.borderSoft};border-radius:14px;background:${COLOR.card};">
              <tr>
                <td style="padding:16px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td valign="top" style="padding-right:14px;">
                        <p style="margin:0 0 6px 0;font-size:12px;color:${COLOR.textMuted};letter-spacing:0.02em;">${meta}</p>
                        <a href="${url}" style="text-decoration:none;color:${COLOR.text};font-size:16px;font-weight:700;line-height:1.35;">${title}</a>
                        ${snippetHtml}
                        <a href="${url}" style="display:inline-block;margin-top:12px;padding:7px 14px;font-size:13px;font-weight:600;color:#ffffff;background:${COLOR.accent};border-radius:8px;text-decoration:none;">阅读原文 →</a>
                      </td>
                      <td valign="top" width="120" style="width:120px;">${imageHtml}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
  }

  return `
        <tr>
          <td style="padding:8px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${COLOR.borderSoft};border-radius:14px;background:${COLOR.card};">
              <tr>
                <td style="padding:16px 18px;">
                  <p style="margin:0 0 6px 0;font-size:12px;color:${COLOR.textMuted};letter-spacing:0.02em;">${meta}</p>
                  <a href="${url}" style="text-decoration:none;color:${COLOR.text};font-size:16px;font-weight:700;line-height:1.35;">${title}</a>
                  ${snippetHtml}
                  <a href="${url}" style="display:inline-block;margin-top:12px;padding:7px 14px;font-size:13px;font-weight:600;color:#ffffff;background:${COLOR.accent};border-radius:8px;text-decoration:none;">阅读原文 →</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
}

function buildSection(title: string, count: number, articles: Article[]): string {
  if (articles.length === 0) return '';
  const cards = articles.map((a, i) => buildArticleCard(a, i)).join('\n');
  return `
      <tr>
        <td style="padding:24px 24px 8px 24px;">
          <h2 style="margin:0;font-size:18px;font-weight:700;color:${COLOR.text};border-left:3px solid ${COLOR.accent};padding-left:10px;line-height:1.3;">${escapeHtml(title)} <span style="font-size:13px;font-weight:500;color:${COLOR.textMuted};">· ${count} 篇</span></h2>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${cards}
          </table>
        </td>
      </tr>`;
}

/**
 * Build a fully-styled HTML digest email from articles.
 * Inline styles only — email clients ignore <style> and class-based CSS.
 */
export function buildDigest(articles: Article[]): DigestBuildResult {
  const newsArticles = articles.filter(a => !a.categories.includes('论文'));
  const paperArticles = articles.filter(a => a.categories.includes('论文'));
  const today = formatToday();

  const newsSection = buildSection('AI 资讯', newsArticles.length, newsArticles);
  const paperSection = buildSection('论文精选', paperArticles.length, paperArticles);

  const body = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>AI 新闻日报</title>
</head>
<body style="margin:0;padding:0;background:${COLOR.bg};-webkit-text-size-adjust:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.bg};">
    <tr>
      <td align="center" style="padding:24px 12px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${COLOR.card};border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04);">

          <!-- Header -->
          <tr>
            <td style="background:${COLOR.accent};padding:28px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="background:#ffffff;border-radius:8px;padding:6px 10px;font-size:14px;font-weight:700;color:${COLOR.accent};letter-spacing:0.04em;">AI</td>
                        <td valign="middle" style="padding-left:10px;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.01em;">新闻中心</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:14px;color:#ffffff;">
                    <p style="margin:0;font-size:20px;font-weight:700;line-height:1.3;">AI 新闻日报</p>
                    <p style="margin:4px 0 0 0;font-size:13px;color:rgba(255,255,255,0.85);">${escapeHtml(today)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:20px 24px 4px 24px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:${COLOR.textBody};">今日精选 <strong style="color:${COLOR.text};">${articles.length}</strong> 篇 AI 领域内容，涵盖资讯动态与前沿论文。以下是今日要闻。</p>
            </td>
          </tr>
${newsSection}${paperSection}

          <!-- Footer -->
          <tr>
            <td style="padding:24px;border-top:1px solid ${COLOR.border};background:${COLOR.accentSoft};">
              <p style="margin:0 0 4px 0;font-size:12px;color:${COLOR.textMuted};line-height:1.6;">共 ${articles.length} 篇内容 · 由 AI 新闻中心自动整理发送</p>
              <p style="margin:0;font-size:12px;color:${COLOR.textMuted};line-height:1.6;">你收到这封邮件是因为订阅了 AI 新闻中心日报。如需退订，请回复 stop。</p>
            </td>
          </tr>

        </table>

        <p style="margin:16px 0 0 0;font-size:11px;color:${COLOR.textMuted};text-align:center;">© AI 新闻中心 · <a href="https://ai-news-hub.vercel.app" style="color:${COLOR.textMuted};text-decoration:underline;">访问网站</a></p>

      </td>
    </tr>
  </table>
</body>
</html>`;

  const subject = `AI 新闻日报 · ${today} · 共 ${articles.length} 篇`;

  return { subject, body };
}

/**
 * Filter articles published in the last 24 hours (dynamic window from now).
 */
export function filterLast24Hours(articles: Article[]): Article[] {
  const now = Date.now();
  const cutoff = now - 24 * 60 * 60 * 1000;
  return articles.filter(article => {
    const pubDate = new Date(article.publishedAt).getTime();
    return pubDate >= cutoff && pubDate <= now;
  });
}
