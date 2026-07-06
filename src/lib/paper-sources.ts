export interface ArxivCategory {
  id: string;
  name: string;
  icon: string;
}

export const arxivCategories: ArxivCategory[] = [
  { id: 'cs.AI', name: '人工智能', icon: '🧠' },
  { id: 'cs.CL', name: '计算语言学', icon: '📝' },
  { id: 'cs.CV', name: '计算机视觉', icon: '👁️' },
  { id: 'cs.LG', name: '机器学习', icon: '📈' },
  { id: 'cs.RO', name: '机器人', icon: '🤖' },
];

export function getArxivRssUrl(category: string): string {
  return `https://rss.arxiv.org/rss/${category}`;
}

export const PAPER_REVALIDATE = 3600;
