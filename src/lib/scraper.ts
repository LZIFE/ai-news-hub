import { load } from 'cheerio';

interface ScrapeResult {
  title?: string;
  content: string;
  imageUrl?: string;
}

const SCRAPER_TIMEOUT = 8000;

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#\d+;/g, (m) => String.fromCharCode(parseInt(m.slice(2, -1), 10)));
}

async function fetchWithTimeout(url: string, timeout = SCRAPER_TIMEOUT): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function scrapeQbitai($: ReturnType<typeof load>): ScrapeResult {
  const article = $('.article');
  if (!article.length) return { content: '' };

  article.find('.article_info, .zhaiyao, .line_font, script, style').remove();
  article.find('h1').first().remove();

  const content = article.html() || '';
  return { content };
}

function scrapeGeneric($: ReturnType<typeof load>): ScrapeResult {
  const selectors = [
    'article',
    '[role="main"]',
    '.article-content',
    '.post-content',
    '.entry-content',
    '.story-body',
    '#article-body',
    '.article-body',
    'main',
  ];

  for (const sel of selectors) {
    const el = $(sel);
    if (el.length && el.text().trim().length > 100) {
      el.find('script, style, nav, header, footer, .sidebar, .ad, .advertisement, .related, .comments').remove();
      return { content: el.html() || '' };
    }
  }

  return { content: '' };
}

export async function scrapeArticleContent(url: string): Promise<ScrapeResult> {
  try {
    const html = await fetchWithTimeout(url);
    const $ = load(html);

    $('script, style, nav, header, footer, .sidebar, .ad, .advertisement, .cookie, .popup, noscript').remove();

    const ogImage = $('meta[property="og:image"]').attr('content');
    const title = $('h1').first().text().trim() || $('title').text().trim();

    let result: ScrapeResult = { content: '' };

    if (url.includes('qbitai.com')) {
      result = scrapeQbitai($);
    }

    if (!result.content || result.content.replace(/<[^>]+>/g, '').trim().length < 100) {
      result = scrapeGeneric($);
    }

    return {
      title,
      content: result.content,
      imageUrl: ogImage,
    };
  } catch (err) {
    console.error(`Failed to scrape ${url}:`, err);
    return { content: '' };
  }
}

export { decodeHtmlEntities };
