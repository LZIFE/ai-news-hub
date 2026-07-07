import Parser from 'rss-parser';
import { createHash } from 'crypto';
import { Article } from './types';
import { mediaSources } from './media-rss-sources';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Media Monitor/1.0',
  },
});

function makeId(text: string): string {
  return createHash('md5').update(text).digest('hex').slice(0, 16);
}

function extractImage(item: Record<string, unknown>): string | undefined {
  const enclosure = item.enclosure as { url?: string } | undefined;
  if (enclosure?.url) return enclosure.url;

  const mediaContent = item['media:content'] as { $?: { url?: string } } | undefined;
  if (mediaContent?.$?.url) return mediaContent.$.url;

  const content = (item['content:encoded'] || item.content || '') as string;
  const srcMatch = content.match(/<img[^>]+src="([^"]+)"/);
  if (srcMatch) return srcMatch[1];

  return undefined;
}

async function fetchSingleSource(source: typeof mediaSources[0]): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const items = (feed.items || []).slice(0, 20);

    return items.map((item) => {
      const title = item.title || 'Untitled';
      const rssDescription = item.contentSnippet
        ? item.contentSnippet.slice(0, 300)
        : item.content
          ? item.content.replace(/<[^>]+>/g, '').slice(0, 300)
          : '';

      const guid = item.guid || item.link || title + source.name;
      const id = makeId(guid);

      return {
        id,
        title,
        titleZh: title,
        description: rssDescription,
        descriptionZh: rssDescription,
        content: item['content:encoded'] || item.content || '',
        contentZh: item['content:encoded'] || item.content || '',
        url: item.link || '',
        imageUrl: extractImage(item as Record<string, unknown>),
        source: source.name,
        sourceIcon: source.icon,
        categories: ['传媒监控', source.name],
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        author: source.name,
      };
    });
  } catch (error) {
    console.error(`Failed to fetch ${source.name}:`, error);
    return [];
  }
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\s\-—–·:：,，。.!！?？""''「」【】\(\)（）\[\]]/g, '')
    .trim();
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.pathname}`.toLowerCase().replace(/\/+$/, '');
  } catch {
    return url.toLowerCase();
  }
}

let cachedPromise: Promise<Article[]> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5000;

export async function fetchMediaArticles(): Promise<Article[]> {
  const now = Date.now();
  if (cachedPromise && now - cacheTimestamp < CACHE_TTL) {
    return cachedPromise;
  }

  cachedPromise = (async () => {
    const results = await Promise.allSettled(
      mediaSources.map((source) => fetchSingleSource(source))
    );

    const articles = results
      .filter((r): r is PromiseFulfilledResult<Article[]> => r.status === 'fulfilled')
      .flatMap((r) => r.value);

    const seenTitles = new Set<string>();
    const seenUrls = new Set<string>();
    const deduplicated: Article[] = [];

    for (const article of articles) {
      const normTitle = normalizeTitle(article.titleZh || article.title);
      const normUrl = normalizeUrl(article.url);

      if (seenTitles.has(normTitle) || (article.url && seenUrls.has(normUrl))) {
        continue;
      }

      seenTitles.add(normTitle);
      if (article.url) seenUrls.add(normUrl);
      deduplicated.push(article);
    }

    return deduplicated.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  })();

  cacheTimestamp = now;
  return cachedPromise;
}

export function getSourceGroups(): { label: string; sources: string[] }[] {
  const stockSources = mediaSources.filter(s => s.url.includes('disclosure'));
  const newsSources = mediaSources.filter(s => !s.url.includes('disclosure'));

  return [
    { label: '新闻媒体', sources: newsSources.map(s => s.name) },
    { label: '上市公司公告', sources: stockSources.map(s => s.name) },
  ];
}
