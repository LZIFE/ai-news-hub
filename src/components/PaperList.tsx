'use client';

import { useState } from 'react';
import { Paper } from '@/lib/types';
import PaperCard from './PaperCard';
import Pagination from './Pagination';

const PAGE_SIZE = 12;

export default function PaperList({ papers }: { papers: Paper[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(papers.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const visible = papers.slice(start, start + PAGE_SIZE);

  if (papers.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-light-muted dark:text-dark-muted text-lg">
          暂无论文数据。arXiv 周末不更新，工作日会自动获取最新论文。
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map((paper, index) => (
          <PaperCard
            key={paper.id}
            paper={paper}
            style={{ animationDelay: `${index * 60}ms` }}
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => {
          setPage(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
