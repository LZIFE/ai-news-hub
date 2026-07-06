const STORAGE_KEY = 'ai-news-bookmarks';

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addBookmark(articleId: string): void {
  const bookmarks = getBookmarks();
  if (!bookmarks.includes(articleId)) {
    bookmarks.push(articleId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }
}

export function removeBookmark(articleId: string): void {
  const bookmarks = getBookmarks().filter((id) => id !== articleId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function isBookmarked(articleId: string): boolean {
  return getBookmarks().includes(articleId);
}
