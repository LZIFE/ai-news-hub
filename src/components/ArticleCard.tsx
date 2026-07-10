'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/types';
import BookmarkButton from './BookmarkButton';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  // Guard against future dates
  if (diff < 0) {
    return new Date(dateStr).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return new Date(dateStr).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

function isFresh(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() < 60 * 60 * 1000; // < 1 hour
}

// Rough estimate: Chinese text ~400 characters/min, Latin text ~200 words/min.
function readingTime(text: string): number {
  const cjkChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const latinWords = text.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).filter(Boolean).length;
  const minutes = cjkChars / 400 + latinWords / 200;
  return Math.max(1, Math.round(minutes));
}

export default function ArticleCard({ article, style, linkPrefix = '/articles/' }: { article: Article; style?: React.CSSProperties; linkPrefix?: string }) {
  const slug = article.id;
  const [imgError, setImgError] = useState(false);
  const fresh = isFresh(article.publishedAt);
  const mins = readingTime(article.contentZh || article.content || article.descriptionZh || article.description);

  return (
    <article className="card group relative flex flex-col h-full animate-slide-up overflow-hidden" style={{ animationFillMode: 'both', ...style }}>
      {/* accent bar draws in from the left on hover — echoes a text cursor / reading progress */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent dark:bg-accent-dark scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

      {article.imageUrl && !imgError && (
        <Link href={`${linkPrefix}${slug}`} className="block mb-4 overflow-hidden rounded-lg">
          <div className="aspect-video bg-light-border dark:bg-dark-border relative">
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={600}
              height={338}
              className="w-full h-full object-cover grayscale-[35%] transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-[1.04]"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          </div>
        </Link>
      )}

      <div className="flex items-center gap-2 text-xs text-light-muted dark:text-dark-muted mb-3 flex-wrap">
        {fresh && (
          <span className="inline-flex items-center gap-1.5 text-accent dark:text-accent-dark font-medium">
            <span className="cursor-mark" aria-hidden="true" />
            最新
          </span>
        )}
        <span className="flex items-center gap-1.5"><span className="text-base">{article.sourceIcon}</span><span className="font-medium">{article.source}</span></span>
        <span className="text-light-border dark:text-dark-border">·</span>
        <time className="font-mono text-[11px]">{timeAgo(article.publishedAt)}</time>
        <span className="text-light-border dark:text-dark-border">·</span>
        <span className="font-mono text-[11px]">{mins} 分钟阅读</span>
      </div>

      <Link href={`${linkPrefix}${slug}`} className="block flex-1">
        <h2 className="font-display font-semibold text-[16px] leading-snug mb-1.5 group-hover:text-accent dark:group-hover:text-accent-dark transition-colors duration-200 line-clamp-2">{article.titleZh || article.title}</h2>
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
            const isMonitor = linkPrefix === '/monitor/';
            // In monitor mode, skip the generic '传媒监控' category badge
            if (isMonitor && cat === '传媒监控') return null;
            const href = isMonitor
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