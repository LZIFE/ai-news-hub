'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: '最新', icon: 'M4 6h16M4 12h10M4 18h7' },
  { href: '/papers', label: '论文', icon: 'M9 12h6m-6 4h6m1 5H8a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { href: '/monitor', label: '传媒', icon: 'M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M13.5 4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' },
  { href: '/bookmarks', label: '收藏夹', icon: 'M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z' },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-light-border/70 dark:border-dark-border/70 bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-xl shadow-[0_1px_0_rgba(31,28,24,0.03)]'
          : 'border-transparent bg-light-bg/70 dark:bg-dark-bg/70 backdrop-blur-md'
      }`}
    >
      <div className={`container-site flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <span className="text-white font-display font-bold text-sm">AI</span>
          </div>
          <span className="text-lg font-display font-bold tracking-tight hidden sm:block">
            新闻中心
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-3 py-1.5 rounded-lg text-light-text dark:text-dark-text hover:bg-light-border/40 dark:hover:bg-dark-border/40 transition-colors group/link"
            >
              {link.label}
              <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-accent dark:bg-accent-dark scale-x-0 group-hover/link:scale-x-100 origin-left transition-transform duration-200" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Mobile nav toggle */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 rounded-lg text-light-muted dark:text-dark-muted hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
            aria-label="导航菜单"
            aria-expanded={mobileNavOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

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

      {/* Mobile navigation */}
      {mobileNavOpen && (
        <nav className="md:hidden border-t border-light-border/60 dark:border-dark-border/60 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-xl animate-slide-up" style={{ animationDuration: '0.25s' }}>
          <div className="container-site flex flex-col py-2 divide-y divide-light-border/50 dark:divide-dark-border/50 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-3 px-2 py-3.5 text-light-text dark:text-dark-text hover:text-accent dark:hover:text-accent-dark transition-colors"
              >
                <svg className="w-[18px] h-[18px] text-light-muted dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} /></svg>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}