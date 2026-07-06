import { RSSSource } from './types';

export const rssSources: RSSSource[] = [
  // Chinese sources - WeChat via wechat2rss
  {
    name: '量子位',
    url: 'https://wechat2rss.xlab.app/feed/7131b577c61365cb47e81000738c10d872685908.xml',
    icon: '⚛️',
    category: 'chinese',
  },
  {
    name: '36氪 AI',
    url: 'https://rsshub.rssforever.com/36kr/motif/327686782977',
    icon: '🔶',
    category: 'chinese',
  },
  {
    name: '机器之心',
    url: 'https://wechat2rss.xlab.app/feed/51e92aad2728acdd1fda7314be32b16639353001.xml',
    icon: '🧠',
    category: 'chinese',
  },
  {
    name: '新智元',
    url: 'https://wechat2rss.xlab.app/feed/ede30346413ea70dbef5d485ea5cbb95cca446e7.xml',
    icon: '🤖',
    category: 'chinese',
  },
  {
    name: 'AI前线',
    url: 'https://wechat2rss.xlab.app/feed/25185b01482da0f485418ecb92e208b4416712fb.xml',
    icon: '🔥',
    category: 'chinese',
  },
  {
    name: '腾讯技术工程',
    url: 'https://wechat2rss.xlab.app/feed/9685937b45fe9c7a526dbc32e4f24ba879a65b9a.xml',
    icon: '🐧',
    category: 'chinese',
  },
  {
    name: '极客公园',
    url: 'https://mainssl.geekpark.net/rss.rss',
    icon: '🔧',
    category: 'chinese',
  },
  // English sources
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    icon: '📰',
    category: 'english',
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    icon: '🔷',
    category: 'english',
  },
  {
    name: 'MIT Tech Review',
    url: 'https://www.technologyreview.com/feed/',
    icon: '🎓',
    category: 'english',
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    icon: '📊',
    category: 'english',
  },
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/news/rss.xml',
    icon: '🤖',
    category: 'english',
  },
  {
    name: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss/',
    icon: '🟢',
    category: 'english',
  },
];

export const CATEGORY_MAP: Record<string, string> = {
  'artificial-intelligence': 'AI',
  'ai': 'AI',
  'machine-learning': '机器学习',
  'deep-learning': '深度学习',
  'nlp': '自然语言处理',
  'natural-language-processing': '自然语言处理',
  'computer-vision': '计算机视觉',
  'robotics': '机器人',
  'technology': '科技',
  'tech': '科技',
  'startups': '创业',
  'openai': 'OpenAI',
  'google': 'Google',
  'microsoft': 'Microsoft',
  'meta': 'Meta',
  'anthropic': 'Anthropic',
};

export function normalizeCategories(rawCategories: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const cat of rawCategories) {
    const normalized = CATEGORY_MAP[cat.toLowerCase()] || cat;
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }

  return result;
}

export const DEFAULT_REVALIDATE = 3600;
