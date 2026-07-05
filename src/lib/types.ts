export interface Article {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  imageUrl?: string;
  source: string;
  sourceIcon?: string;
  categories: string[];
  publishedAt: string;
  author?: string;
}

export interface RSSSource {
  name: string;
  url: string;
  icon?: string;
  category: 'english' | 'chinese';
}

export interface SearchResult {
  article: Article;
  score: number;
}
