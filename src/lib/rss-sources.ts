import { RSSSource } from './types';

export const rssSources: RSSSource[] = [
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    icon: '🔶',
    category: 'english',
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    icon: '🔷',
    category: 'english',
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    icon: '🔴',
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
    url: 'https://openai.com/blog/rss.xml',
    icon: '🤖',
    category: 'english',
  },
  {
    name: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss/',
    icon: '🟢',
    category: 'english',
  },
  {
    name: '机器之心',
    url: 'https://www.jiqizhixin.com/rss',
    icon: '🧠',
    category: 'chinese',
  },
];

export const DEFAULT_REVALIDATE = 3600;
