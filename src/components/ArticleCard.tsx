import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/types';
import BookmarkButton from './BookmarkButton';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return new Date(dateStr).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

export default function ArticleCard({ article, style, linkPrefix = '/articles/' }: { article: Article; style?: React.CSSProperties; linkPrefix?: string }) {
  const slug = article.id;
  const [imgError, setImgError] = useState(false);

  return (
    <article className="card group relative flex flex-col h-full animate-slide-up" style={{ animationFillMode: 'both', ...style }}>
      {article.imageUrl && !imgError && (
        <Link href={`${linkPrefix}${slug}`} className="block mb-4 overflow-hidden rounded-lg">
          <div className="aspect-video bg-light-border dark:bg-dark-border relative">
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={600}
              height={338}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
      )}

      <div className="flex items-center gap-2 text-xs text-light-muted dark:text-dark-muted mb-3">
        <span className="flex items-center gap-1.5">
          <span className="text-base">{article.sourceIcon}</span>
          <span className="font-medium">{article.source}</span>
        </span>
        <span className="text-light-border dark:text-dark-border">·</span>
        <time className="font-mono text-[11px]">{timeAgo(article.publishedAt)}</time>
      </div>

      <Link href={`${linkPrefix}${slug}`} className="block flex-1">
        <h2 className="font-display font-semibold text-[15px] leading-snug mb-1.5 group-hover:text-accent dark:group-hover:text-accent-dark transition-colors duration-200 line-clamp-2">
          {article.titleZh || article.title}
        </h2>
        {article.titleZh && article.titleZh !== article.title && (
          <p className="text-xs text-light-muted dark:text-dark-muted line-clamp-1 mb-2 italic">
            {article.title}
          </p>
        )}
      </Link>

      <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed line-clamp-2 mb-4">
        {article.descriptionZh || article.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-light-border/50 dark:border-dark-border/50">
        <div className="flex gap-1.5 flex-wrap">
          {article.categories.slice(0, 2).map((cat) => {
            const href = linkPrefix === '/monitor/'
              ? `/monitor?source=${encodeURIComponent(cat)}`
              : `/categories/${encodeURIComponent(cat)}`;
            return (
              <Link
                key={cat}
                href={href}
                className="badge"
              >
                {cat}
              </Link>
            );
          })}
        </div>

        <BookmarkButton articleId={article.id} />
      </div>
    </article>
  );
}
