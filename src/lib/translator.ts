import { translate } from '@vitalets/google-translate-api';

const translationCache = new Map<string, { zh: string; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export async function translateToChinese(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return '';

  const cacheKey = text.slice(0, 100);
  const cached = translationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.zh;
  }

  try {
    const result = await translate(text, { to: 'zh-CN' });
    const translated = result.text;
    translationCache.set(cacheKey, { zh: translated, timestamp: Date.now() });
    return translated;
  } catch (error) {
    console.error('Translation failed:', error);
    return text;
  }
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
    article.content ? translateToChinese(article.content) : Promise.resolve(undefined),
  ]);

  return { titleZh, descriptionZh, contentZh };
}
