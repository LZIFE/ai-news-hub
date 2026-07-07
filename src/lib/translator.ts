import { createHash } from 'crypto';
import { load } from 'cheerio';
import { translate } from '@vitalets/google-translate-api';

const MAX_CACHE_SIZE = 500;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const translationCache = new Map<string, { zh: string; timestamp: number }>();

function cacheKey(text: string): string {
  return createHash('md5').update(text).digest('hex');
}

function pruneCache() {
  if (translationCache.size > MAX_CACHE_SIZE) {
    // Use Array.from instead of spreading to avoid downlevelIteration issues
    const entries = Array.from(translationCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toDelete = entries.slice(0, entries.length - MAX_CACHE_SIZE);
    for (const [key] of toDelete) {
      translationCache.delete(key);
    }
  }
}

function cleanHtml(html: string): string {
  if (!html) return '';
  const $ = load(html);
  $('style, script, noscript').remove();
  // Replace links with their text content for translation
  $('a').each((_, el) => {
    $(el).replaceWith($(el).text());
  });
  // Remove URLs inline in text nodes as well
  const processed = $.html()
    .replace(/https?:\/\/[^\s<>"']+/g, '')
    .replace(/www\.[^\s<>"']+/g, '')
    .replace(/(\s){2,}/g, '$1')
    .trim();
  return processed;
}

export async function translateToChinese(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return '';

  const key = cacheKey(text);
  const cached = translationCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.zh;
  }

  try {
    const cleanText = cleanHtml(text);
    if (cleanText.length < 5) {
      return text;
    }

    const result = await translate(cleanText, { to: 'zh-CN' });
    const translated = result.text;
    translationCache.set(key, { zh: translated, timestamp: Date.now() });
    pruneCache();
    return translated;
  } catch (error) {
    console.error('Translation failed:', error);
    return text;
  }
}

/**
 * Translate HTML content preserving structure.
 * Translates text nodes within p, h2, h3, li, blockquote elements
 * while keeping HTML tags intact.
 */
export async function translateHtmlContent(html: string): Promise<string> {
  if (!html) return '';
  const $ = load(html);
  $('style, script, noscript').remove();

  const textSelectors = ['p', 'h1', 'h2', 'h3', 'h4', 'li', 'blockquote', 'td', 'th', 'figcaption', 'dt', 'dd'];
  const blocks: { el: cheerio.Element; text: string }[] = [];

  $(textSelectors.join(',')).each((_, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    if (text.length >= 5) {
      blocks.push({ el, text });
    }
  });

  await Promise.all(blocks.map(async (block) => {
    try {
      const translated = await translateToChinese(block.text);
      if (translated !== block.text) {
        $(block.el).text(translated);
      }
    } catch {
      // keep original
    }
  }));

  return $.html();
}

export async function translateArticle(article: {
  title: string;
  description: string;
  content?: string;
}): Promise<{
  titleZh: string;
  descriptionZh: string;
  contentZh?: string;
}> {
  const [titleZh, descriptionZh, contentZh] = await Promise.all([
    translateToChinese(article.title),
    translateToChinese(article.description),
    article.content ? translateHtmlContent(article.content) : Promise.resolve(undefined),
  ]);

  return { titleZh, descriptionZh, contentZh };
}
