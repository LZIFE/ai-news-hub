import Link from 'next/link';
import { Article } from '@/lib/types';
import BookmarkButton from './BookmarkButton';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ArticleCard({ article }: { article: Article }) {
  const slug = article.id;

  return (
    <article className="card group relative">
      {article.imageUrl && (
        <Link href={`/articles/${slug}`} className="block mb-4 overflow-hidden">
          <div className="aspect-video bg-light-border dark:bg-dark-border">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </Link>
      )}

      <div className="flex items-center gap-2 text-xs text-light-muted dark:text-dark-muted mb-2">
        <span>{article.sourceIcon}</span>
        <span>{article.source}</span>
        <span>·</span>
        <time>{timeAgo(article.publishedAt)}</time>
      </div>

      <Link href={`/articles/${slug}`} className="block">
        <h2 className="font-semibold text-base leading-snug mb-2 group-hover:text-accent dark:group-hover:text-accent-dark transition-colors line-clamp-2">
          {article.title}
        </h2>
      </Link>

      <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed line-clamp-3 mb-3">
        {article.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {article.categories.slice(0, 2).map((cat) => (
            <Link
              key={cat}
              href={`/categories/${encodeURIComponent(cat)}`}
              className="badge hover:border-accent dark:hover:border-accent-dark transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>

        <BookmarkButton articleId={article.id} />
      </div>
    </article>
  );
}
