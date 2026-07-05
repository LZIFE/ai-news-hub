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
          Search
        </h1>
        <SearchBar />
      </section>

      <section>
        {loading ? (
          <div className="text-center py-20">
            <p className="text-light-muted dark:text-dark-muted">Loading articles...</p>
          </div>
        ) : query ? (
          <>
            <p className="text-light-muted dark:text-dark-muted mb-6">
              {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
            <ArticleList articles={results} />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-light-muted dark:text-dark-muted">
              Type to search across all articles.
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
          <p className="text-light-muted dark:text-dark-muted">Loading...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
