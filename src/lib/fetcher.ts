import Parser from 'rss-parser';
import { Article } from './types';
import { rssSources, DEFAULT_REVALIDATE } from './rss-sources';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'AI News Hub/1.0',
  },
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

function extractImage(item: Record<string, unknown>): string | undefined {
  const enclosure = item.enclosure as { url?: string } | undefined;
  if (enclosure?.url) return enclosure.url;

  const mediaContent = item['media:content'] as { $?: { url?: string } } | undefined;
  if (mediaContent?.$?.url) return mediaContent.$.url;

  const content = (item['content:encoded'] || item.content || '') as string;
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
  if (imgMatch) return imgMatch[1];

  return undefined;
}

async function fetchSingleSource(source: typeof rssSources[0]): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || []).slice(0, 15).map((item) => {
      const title = item.title || 'Untitled';
      return {
        id: slugify(title + source.name),
        title,
        description: item.contentSnippet
          ? item.contentSnippet.slice(0, 300)
          : item.content
          ? item.content.replace(/<[^>]+>/g, '').slice(0, 300)
          : '',
        content: item['content:encoded'] || item.content || '',
        url: item.link || '',
        imageUrl: extractImage(item as Record<string, unknown>),
        source: source.name,
        sourceIcon: source.icon,
        categories: item.categories || [],
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        author: item.creator || item.author || source.name,
      };
    });
  } catch (error) {
    console.error(`Failed to fetch ${source.name}:`, error);
    return [];
  }
}

export async function fetchAllArticles(): Promise<Article[]> {
  const results = await Promise.allSettled(
    rssSources.map((source) => fetchSingleSource(source))
  );

  const articles = results
    .filter((r): r is PromiseFulfilledResult<Article[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value);

  return articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
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
