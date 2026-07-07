'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Article } from '@/lib/types';

export function useSearch(articles: Article[]) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const indexRef = useRef<Record<string, unknown> | null>(null);
  const articlesRef = useRef(articles);
  const buildingRef = useRef(false);

  useEffect(() => {
    if (articles.length === 0) return;

    // Skip rebuild if articles haven't changed
    if (articlesRef.current === articles) return;
    if (buildingRef.current) return;
    articlesRef.current = articles;
    buildingRef.current = true;

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
      } finally {
        buildingRef.current = false;
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
      const idSet = new Set(ids);
      const matched = articles.filter((a) => idSet.has(a.id));

      setResults(matched);
      setIsSearching(false);
    },
    [articles]
  );

  return { query, results, isSearching, search };
}
