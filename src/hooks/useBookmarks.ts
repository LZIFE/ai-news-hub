'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { getBookmarks, addBookmark, removeBookmark } from '@/lib/bookmarks';

/**
 * Subscribe to bookmark changes from any tab/instance.
 */
function subscribe(cb: () => void) {
  window.addEventListener('storage', cb);
  window.addEventListener('bookmarks-changed', cb);
  return () => {
    window.removeEventListener('storage', cb);
    window.removeEventListener('bookmarks-changed', cb);
  };
}

function getSnapshot(): string[] {
  return getBookmarks();
}

export function useBookmarks() {
  const bookmarks = useSyncExternalStore(subscribe, getSnapshot, () => [] as string[]);

  const toggle = useCallback((articleId: string) => {
    const current = getBookmarks();
    if (current.includes(articleId)) {
      removeBookmark(articleId);
    } else {
      addBookmark(articleId);
    }
    // Notify other instances
    window.dispatchEvent(new Event('bookmarks-changed'));
  }, []);

  const isSaved = useCallback(
    (articleId: string) => bookmarks.includes(articleId),
    [bookmarks]
  );

  return { bookmarks, toggle, isSaved };
}