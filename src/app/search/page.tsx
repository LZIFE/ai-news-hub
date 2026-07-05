'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Article } from '@/lib/types';
import { useSearch } from '@/hooks/useSearch';
import ArticleList from '@/components/ArticleList';
import SearchBar from '@/components/SearchBar';
import { Suspense } from 'react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { query, results, search } = useSearch(articles);

  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (initialQuery && articles.length > 0) {
      search(initialQuery);
    }
  }, [initialQuery, articles, search]);

  return (
    <div className="container-site py-10">
      <section className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-4">
          搜索
        </h1>
        <SearchBar />
      </section>

      <section>
        {loading ? (
          <div className="text-center py-20">
            <p className="text-light-muted dark:text-dark-muted">加载文章中...</p>
          </div>
        ) : query ? (
          <>
            <p className="text-light-muted dark:text-dark-muted mb-6">
              找到 {results.length} 个关于 &ldquo;{query}&rdquo; 的结果
            </p>
            <ArticleList articles={results} />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-light-muted dark:text-dark-muted">
              输入关键词搜索所有文章。
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container-site py-10 text-center">
          <p className="text-light-muted dark:text-dark-muted">加载中...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
