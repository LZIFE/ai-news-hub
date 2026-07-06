'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-12" aria-label="分页">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm border border-light-border dark:border-dark-border disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent dark:hover:border-accent-dark transition-colors"
        aria-label="上一页"
      >
        ←
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-2 py-2 text-sm text-light-muted dark:text-dark-muted">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 text-sm border transition-colors ${
              page === currentPage
                ? 'bg-accent text-white border-accent'
                : 'border-light-border dark:border-dark-border hover:border-accent dark:hover:border-accent-dark'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm border border-light-border dark:border-dark-border disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent dark:hover:border-accent-dark transition-colors"
        aria-label="下一页"
      >
        →
      </button>
    </nav>
  );
}
