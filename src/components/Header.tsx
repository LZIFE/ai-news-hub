'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => setMounted(true), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-light-border/60 dark:border-dark-border/60 bg-light-bg/85 dark:bg-dark-bg/85 backdrop-blur-xl">
      <div className="container-site flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <span className="text-white font-display font-bold text-sm">AI</span>
          </div>
          <span className="text-lg font-display font-bold tracking-tight hidden sm:block">
            新闻中心
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
          >
            最新
          </Link>
          <Link
            href="/papers"
            className="px-3 py-1.5 rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
          >
            论文
          </Link>
          <Link
            href="/monitor"
            className="px-3 py-1.5 rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
          >
            传媒
          </Link>
          <Link
            href="/bookmarks"
            className="px-3 py-1.5 rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
          >
            收藏夹
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索文章..."
                className="input-search w-48 md:w-64"
                autoFocus
                onBlur={() => {
                  if (!searchQuery.trim()) setSearchOpen(false);
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="ml-2 p-1.5 rounded-lg text-light-muted dark:text-dark-muted hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-light-muted dark:text-dark-muted hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
              aria-label="搜索"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-light-muted dark:text-dark-muted hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
              aria-label="切换深色模式"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
