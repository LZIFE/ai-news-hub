'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Article } from '@/lib/types';
import ArticleList from '@/components/ArticleList';

interface SourceGroup {
  label: string;
  sources: string[];
}

export default function SourceFilter({ groups, articles }: { groups: SourceGroup[]; articles: Article[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialSource = searchParams.get('source');
  const [selectedSource, setSelectedSource] = useState<string | null>(initialSource);

  useEffect(() => {
    setSelectedSource(searchParams.get('source'));
  }, [searchParams]);

  const filtered = selectedSource
    ? articles.filter(a => a.categories.includes(selectedSource))
    : articles;

  const handleSelect = (source: string | null) => {
    setSelectedSource(source);
    const params = new URLSearchParams(searchParams);
    if (source) {
      params.set('source', source);
    } else {
      params.delete('source');
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div>
      <div className="space-y-3 mb-6">
        <div>
          <button
            onClick={() => handleSelect(null)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              !selectedSource
                ? 'bg-accent text-white border-accent'
                : 'border-light-border dark:border-dark-border hover:border-accent dark:hover:border-accent-dark'
            }`}
          >
            全部 ({articles.length})
          </button>
        </div>
        {groups.map(group => (
          <div key={group.label}>
            <p className="text-xs text-light-muted dark:text-dark-muted mb-2 font-medium tracking-wider uppercase">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.sources.map(source => (
                <button
                  key={source}
                  onClick={() => handleSelect(selectedSource === source ? null : source)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    selectedSource === source
                      ? 'bg-accent text-white border-accent'
                      : 'border-light-border dark:border-dark-border hover:border-accent dark:hover:border-accent-dark'
                  }`}
                >
                  {source} ({articles.filter(a => a.categories.includes(source)).length})
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedSource && (
        <p className="text-sm text-light-muted dark:text-dark-muted mb-4">
          当前筛选: <span className="font-medium text-light-text dark:text-dark-text">{selectedSource}</span>
          {' '}({filtered.length} 篇)
          <button
            onClick={() => handleSelect(null)}
            className="ml-2 text-accent hover:text-accent-dark underline"
          >
            清除
          </button>
        </p>
      )}

      <ArticleList key={selectedSource || 'all'} articles={filtered} linkPrefix="/monitor/" />
    </div>
  );
}
