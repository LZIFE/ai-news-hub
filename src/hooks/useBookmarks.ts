'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBookmarks, addBookmark, removeBookmark } from '@/lib/bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const toggle = useCallback((articleId: string) => {
    setBookmarks((prev) => {
      if (prev.includes(articleId)) {
        removeBookmark(articleId);
        return prev.filter((id) => id !== articleId);
      } else {
        addBookmark(articleId);
        return [...prev, articleId];
      }
    });
  }, []);

  const isSaved = useCallback(
    (articleId: string) => bookmarks.includes(articleId),
    [bookmarks]
  );

  return { bookmarks, toggle, isSaved };
}
