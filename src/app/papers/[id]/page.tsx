import { fetchAllPapers } from '@/lib/paper-fetcher';
import { serialize } from '@/lib/serialize';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const papers = serialize(await fetchAllPapers());
  const paper = papers.find((p) => p.id === params.id);

  if (!paper) return { title: '论文未找到' };

  return {
    title: `${paper.title} — AI 论文中心`,
    description: paper.abstract.slice(0, 160),
    openGraph: {
      title: paper.title,
      description: paper.abstract.slice(0, 160),
      type: 'article',
      url: paper.arxivUrl,
    },
  };
}

export default async function PaperDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const papers = serialize(await fetchAllPapers());
  const paper = papers.find((p) => p.id === params.id);

  if (!paper) {
    notFound();
  }

  return (
    <div className="container-site py-10 max-w-3xl">
      <Link
        href="/papers"
        className="inline-flex items-center gap-1.5 text-sm text-light-muted dark:text-dark-muted hover:text-accent dark:hover:text-accent-dark transition-colors mb-8 group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        返回论文列表
      </Link>

      <article className="animate-fade-in">
        <div className="flex items-center gap-2.5 text-sm text-light-muted dark:text-dark-muted mb-5">
          <span className="text-base">{paper.source === 'openalex' ? '🔬' : '📄'}</span>
          <span className="font-medium">{paper.source === 'openalex' ? 'OpenAlex' : 'arXiv'}</span>
          {paper.citationCount != null && paper.citationCount > 0 && (
            <>
              <span className="text-light-border dark:text-dark-border">·</span>
              <span className="font-mono text-xs text-accent dark:text-accent-dark font-medium">
                {paper.citationCount} 引用
              </span>
            </>
          )}
          {paper.venue && (
            <>
              <span className="text-light-border dark:text-dark-border">·</span>
              <span className="text-xs">{paper.venue}</span>
            </>
          )}
          <span className="text-light-border dark:text-dark-border">·</span>
          <time className="font-mono text-xs">
            {new Date(paper.publishedAt).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>

        <h1 className="font-display text-display-lg font-bold tracking-tight leading-tight mb-6">
          {paper.title}
        </h1>

        <div className="mb-6">
          <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-3">
            作者
          </h3>
          <div className="flex flex-wrap gap-2">
            {paper.authors.map((author, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1.5 text-sm rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
              >
                {author}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          {paper.categories.map((cat) => (
            <Link
              key={cat}
              href={`/papers?category=${encodeURIComponent(cat)}`}
              className="badge"
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="prose dark:prose-invert max-w-none mb-8">
          <h2 className="text-lg font-display font-semibold mb-4">摘要 / Abstract</h2>
          <p className="text-base leading-[1.85] text-light-text dark:text-dark-text whitespace-pre-line">
            {paper.abstract}
          </p>
        </div>

        <div className="flex gap-3 mt-12 pt-8 border-t border-light-border dark:border-dark-border">
          <a
            href={paper.arxivUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            arXiv 页面
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-lg border border-light-border dark:border-dark-border hover:border-accent dark:hover:border-accent-dark transition-colors"
          >
            下载 PDF
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </a>
        </div>
      </article>
    </div>
  );
}
