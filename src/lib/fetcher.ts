import Parser from 'rss-parser';
import { createHash } from 'crypto';
import { Article } from './types';
import { rssSources, DEFAULT_REVALIDATE, normalizeCategories } from './rss-sources';
import { translateArticle } from './translator';
import { scrapeArticleContent, decodeHtmlEntities } from './scraper';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'AI News Hub/1.0',
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

  const mediaThumbnail = item['media:thumbnail'] as { $?: { url?: string } } | undefined;
  if (mediaThumbnail?.$?.url) return mediaThumbnail.$.url;

  const content = (item['content:encoded'] || item.content || '') as string;

  // Try src first
  const srcMatch = content.match(/<img[^>]+src="([^"]+)"/);
  if (srcMatch) return srcMatch[1];

  // Try data-src (lazy loading)
  const dataSrcMatch = content.match(/<img[^>]+data-src="([^"]+)"/);
  if (dataSrcMatch) return dataSrcMatch[1];

  // Try data-original
  const dataOriginalMatch = content.match(/<img[^>]+data-original="([^"]+)"/);
  if (dataOriginalMatch) return dataOriginalMatch[1];

  return undefined;
}

async function fetchSingleSource(source: (typeof rssSources)[0]): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const items = (feed.items || []).slice(0, 15);

    const articles = await Promise.all(
      items.map(async (item) => {
        const title = item.title || 'Untitled';
        const rssDescription = item.contentSnippet
          ? item.contentSnippet.slice(0, 300)
          : item.content
            ? decodeHtmlEntities(item.content.replace(/<[^>]+>/g, '')).slice(0, 300)
            : '';
        const rssContent = item['content:encoded'] || item.content || '';

        const guid = item.guid || item.link || title + source.name;
        const id = makeId(guid);

        let finalDescription = rssDescription;
        let finalContent = rssContent;
        let finalImageUrl = extractImage(item as Record<string, unknown>);

        if (rssDescription.length < 80 && item.link) {
          try {
            const scraped = await scrapeArticleContent(item.link);
            if (scraped.content && scraped.content.replace(/<[^>]+>/g, '').trim().length > 100) {
              finalContent = scraped.content;
              finalDescription = scraped.content.replace(/<[^>]+>/g, '').slice(0, 300);
            }
          } catch {
            // keep RSS content as fallback
          }
        }

        let translation;
        try {
          translation = source.category === 'english'
            ? await translateArticle({ title, description: finalDescription, content: finalContent })
            : { titleZh: title, descriptionZh: finalDescription, contentZh: finalContent };
        } catch (err) {
          console.error(`Translation failed for "${title}" from ${source.name}:`, err);
          translation = { titleZh: title, descriptionZh: finalDescription, contentZh: finalContent };
        }

        return {
          id,
          title,
          titleZh: translation.titleZh,
          description: finalDescription,
          descriptionZh: translation.descriptionZh,
          content: finalContent,
          contentZh: translation.contentZh,
          url: item.link || '',
          imageUrl: finalImageUrl,
          source: source.name,
          sourceIcon: source.icon,
          categories: normalizeCategories(item.categories || []),
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          author: item.creator || item.author || source.name,
        };
      })
    );

    return articles;
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
const CACHE_TTL = 5000; // 5s request-scoped cache

export async function fetchAllArticles(): Promise<Article[]> {
  const now = Date.now();
  if (cachedPromise && now - cacheTimestamp < CACHE_TTL) {
    return cachedPromise;
  }

  cachedPromise = (async () => {
    const results = await Promise.allSettled(
      rssSources.map((source) => fetchSingleSource(source))
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

export async function fetchArticlesByCategory(category: string): Promise<Article[]> {
  const all = await fetchAllArticles();
  return all.filter((a) =>
    a.categories.some(
      (c) => c.toLowerCase() === category.toLowerCase()
    )
  );
}

export { DEFAULT_REVALIDATE };
