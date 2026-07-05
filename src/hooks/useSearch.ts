'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Article } from '@/lib/types';

export function useSearch(articles: Article[]) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const indexRef = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (articles.length === 0) return;

    const buildIndex = async () => {
      try {
        const { Document } = await import('flexsearch');
        const doc = new (Document as unknown as new () => {
          add: (id: unknown, record: unknown) => void;
          search: (query: string) => unknown;
        })();

        articles.forEach((article) => {
          doc.add(article.id, {
            title: article.title,
            description: article.description,
            source: article.source,
          });
        });

        indexRef.current = doc as unknown as Record<string, unknown>;
      } catch (err) {
        console.error('Failed to build search index:', err);
      }
    };

    buildIndex();
  }, [articles]);

  const search = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);

      if (!searchQuery.trim() || !indexRef.current) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      const doc = indexRef.current as unknown as {
        search: (q: string) => { result: string[] }[];
      };
      const searchResults = doc.search(searchQuery);
      const ids = searchResults.flatMap((r) => r.result);
      const matched = articles.filter((a) => ids.includes(a.id));

      setResults(matched);
      setIsSearching(false);
    },
    [articles]
  );

  return { query, results, isSearching, search };
}
