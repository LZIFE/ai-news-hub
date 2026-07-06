import Link from 'next/link';
import { Paper } from '@/lib/types';

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

function sourceBadge(source: Paper['source']) {
  const map = {
    arxiv: { label: 'arXiv', icon: '📄' },
    openalex: { label: 'OpenAlex', icon: '🔬' },
    'semantic-scholar': { label: 'S2', icon: '🎓' },
  };
  return map[source] || map.arxiv;
}

export default function PaperCard({ paper, style }: { paper: Paper; style?: React.CSSProperties }) {
  const displayAuthors = paper.authors.slice(0, 3);
  const hasMore = paper.authors.length > 3;
  const badge = sourceBadge(paper.source);

  return (
    <article className="card group relative flex flex-col h-full animate-slide-up" style={{ animationFillMode: 'both', ...style }}>
      <div className="flex items-center gap-2 text-xs text-light-muted dark:text-dark-muted mb-3">
        <span className="flex items-center gap-1.5">
          <span className="text-base">{badge.icon}</span>
          <span className="font-medium">{badge.label}</span>
        </span>
        {paper.citationCount != null && paper.citationCount > 0 && (
          <>
            <span className="text-light-border dark:text-dark-border">·</span>
            <span className="font-mono text-[11px] text-accent dark:text-accent-dark">
              {paper.citationCount} 引用
            </span>
          </>
        )}
        <span className="text-light-border dark:text-dark-border">·</span>
        <time className="font-mono text-[11px]">{timeAgo(paper.publishedAt)}</time>
      </div>

      <Link href={`/papers/${paper.id}`} className="block flex-1">
        <h2 className="font-display font-semibold text-[15px] leading-snug mb-2 group-hover:text-accent dark:group-hover:text-accent-dark transition-colors duration-200 line-clamp-3">
          {paper.title}
        </h2>
      </Link>

      <p className="text-xs text-light-muted dark:text-dark-muted mb-3 line-clamp-1">
        {displayAuthors.join(', ')}
        {hasMore && ` et al.`}
      </p>

      <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed line-clamp-3 mb-4">
        {paper.abstract}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-light-border/50 dark:border-dark-border/50">
        <div className="flex gap-1.5 flex-wrap">
          {paper.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono rounded bg-light-bg dark:bg-dark-bg text-light-muted dark:text-dark-muted border border-light-border dark:border-dark-border"
            >
              {cat}
            </span>
          ))}
        </div>

        <a
          href={paper.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-accent dark:text-accent-dark hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          PDF
        </a>
      </div>
    </article>
  );
}
