'use client';

import { useBookmarks } from '@/hooks/useBookmarks';

export default function BookmarkButton({ articleId }: { articleId: string }) {
  const { isSaved, toggle } = useBookmarks();
  const saved = isSaved(articleId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(articleId);
      }}
      className="p-1.5 text-light-muted dark:text-dark-muted hover:text-accent dark:hover:text-accent-dark transition-colors"
      aria-label={saved ? 'Remove bookmark' : 'Add bookmark'}
    >
      {saved ? (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
        </svg>
      )}
    </button>
  );
}
