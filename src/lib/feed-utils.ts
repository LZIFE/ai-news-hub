import { createHash } from 'crypto';

/**
 * Shared utilities for RSS/feed fetchers.
 */

export function makeId(text: string): string {
  return createHash('md5').update(text).digest('hex').slice(0, 16);
}

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\s\-—–·:：,，。.!！?？""''「」【】\(\)（）\[\]]/g, '')
    .trim();
}

export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.pathname}`.toLowerCase().replace(/\/+$/, '');
  } catch {
    return url.toLowerCase();
  }
}

export function extractImageFromContent(content: string): string | undefined {
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

export type Cacheable<T> = {
  data: T;
  timestamp: number;
};

/**
 * Wraps a factory function with a request-scoped TTL cache.
 * If the promise rejects, clears the cache so subsequent calls retry.
 */
export function withTtlCache<T>(
  fn: () => Promise<T>,
  ttl: number = 5000
): () => Promise<T> {
  let cachedPromise: Promise<T> | null = null;
  let cacheTimestamp = 0;

  return async () => {
    const now = Date.now();
    if (cachedPromise && now - cacheTimestamp < ttl) {
      return cachedPromise;
    }

    cachedPromise = fn().catch((err: unknown) => {
      // Clear the cache so subsequent calls retry instead of reusing a rejected promise
      cachedPromise = null;
      throw err;
    });

    cacheTimestamp = now;
    return cachedPromise;
  };
}

export function sortByDate<T extends { publishedAt: string }>(items: T[]): T[] {
  return items.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function dedupeByTitleAndUrl<T extends { title: string; url: string }>(
  items: T[],
  titleAccessor?: (item: T) => string
): T[] {
  const seenTitles = new Set<string>();
  const seenUrls = new Set<string>();
  const deduplicated: T[] = [];

  for (const item of items) {
    const normTitle = normalizeTitle(titleAccessor ? titleAccessor(item) : item.title);
    const normUrl = normalizeUrl(item.url);

    if (seenTitles.has(normTitle) || (item.url && seenUrls.has(normUrl))) {
      continue;
    }

    seenTitles.add(normTitle);
    if (item.url) seenUrls.add(normUrl);
    deduplicated.push(item);
  }

  return deduplicated;
}