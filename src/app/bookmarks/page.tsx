'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/lib/types';
import { getBookmarks } from '@/lib/bookmarks';
import ArticleList from '@/components/ArticleList';

export default function BookmarksPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookmarkIds = getBookmarks();
    if (bookmarkIds.length === 0) {
      setLoading(false);
      return;
    }

    fetch('/api/articles')
      .then((res) => res.json())
      .then((data: Article[]) => {
        const saved = data.filter((a) => bookmarkIds.includes(a.id));
        setArticles(saved);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="container-site py-10">
      <section className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-3">
          收藏夹
        </h1>
        <p className="text-light-muted dark:text-dark-muted">
          您保存的文章。
        </p>
      </section>

      <section>
        {loading ? (
          <div className="text-center py-20">
            <p className="text-light-muted dark:text-dark-muted">加载中...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-light-muted dark:text-dark-muted text-lg mb-4">
              还没有收藏的文章。
            </p>
            <a href="/" className="btn-primary">
              浏览文章
            </a>
          </div>
        ) : (
          <ArticleList articles={articles} />
        )}
      </section>
    </div>
  );
}
