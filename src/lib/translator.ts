import { createHash } from 'crypto';
import { translate } from '@vitalets/google-translate-api';

const translationCache = new Map<string, { zh: string; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000;

function cacheKey(text: string): string {
  return createHash('md5').update(text).digest('hex');
}

function cleanHtmlForTranslation(html: string): string {
  if (!html) return '';
  
  let cleaned = html;
  
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  cleaned = cleaned.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '$2');
  
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');
  
  cleaned = cleaned.replace(/https?:\/\/[^\s<>"']+/g, '');
  cleaned = cleaned.replace(/www\.[^\s<>"']+/g, '');
  
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

export async function translateToChinese(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return '';

  const key = cacheKey(text);
  const cached = translationCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.zh;
  }

  try {
    const cleanText = cleanHtmlForTranslation(text);
    if (cleanText.length < 5) {
      return text;
    }
    
    const result = await translate(cleanText, { to: 'zh-CN' });
    const translated = result.text;
    translationCache.set(key, { zh: translated, timestamp: Date.now() });
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
