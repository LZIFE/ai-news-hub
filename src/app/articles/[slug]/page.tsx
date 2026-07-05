import { fetchAllArticles } from '@/lib/fetcher';
import { DEFAULT_REVALIDATE } from '@/lib/rss-sources';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Article } from '@/lib/types';

export const revalidate = DEFAULT_REVALIDATE;

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const articles = await fetchAllArticles();
  const article = articles.find((a) => a.id === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container-site py-10 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-light-muted dark:text-dark-muted hover:text-accent dark:hover:text-accent-dark transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        返回首页
      </Link>

      <article>
        <div className="flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted mb-4">
          <span>{article.sourceIcon}</span>
          <span className="font-medium">{article.source}</span>
          <span>·</span>
          <time>{new Date(article.publishedAt).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</time>
          {article.author && article.author !== article.source && (
            <>
              <span>·</span>
              <span>{article.author}</span>
            </>
          )}
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-2">
          {article.titleZh || article.title}
        </h1>
        {article.titleZh && article.titleZh !== article.title && (
          <h2 className="font-display text-xl md:text-2xl text-light-muted dark:text-dark-muted mb-6">
            {article.title}
          </h2>
        )}

        {article.imageUrl && (
          <div className="mb-8 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.titleZh || article.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        <div className="flex gap-2 mb-8">
          {article.categories.map((cat) => (
            <Link
              key={cat}
              href={`/categories/${encodeURIComponent(cat)}`}
              className="badge hover:border-accent dark:hover:border-accent-dark transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="p-4 rounded-lg bg-accent/5 dark:bg-accent-dark/10 mb-6">
            <p className="text-lg leading-relaxed text-light-text dark:text-dark-text font-medium">
              {article.descriptionZh || article.description}
            </p>
          </div>

          {article.descriptionZh && article.descriptionZh !== article.description && (
            <p className="text-base leading-relaxed text-light-muted dark:text-dark-muted mb-6 italic">
              {article.description}
            </p>
          )}

          {article.contentZh && (
            <div
              dangerouslySetInnerHTML={{ __html: article.contentZh }}
              className="mt-6 [&>img]:max-w-full [&>p]:leading-relaxed"
            />
          )}

          {article.contentZh && article.content && (
            <div className="mt-10 pt-6 border-t border-light-border dark:border-dark-border">
              <h3 className="text-lg font-semibold mb-4 text-light-muted dark:text-dark-muted">
                原文 / English Original
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="text-sm text-light-muted dark:text-dark-muted [&>img]:max-w-full [&>p]:leading-relaxed opacity-75"
              />
            </div>
          )}

          {!article.contentZh && article.content && (
            <div
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="mt-6 [&>img]:max-w-full [&>p]:leading-relaxed"
            />
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-light-border dark:border-dark-border">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            阅读原文
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </article>
    </div>
  );
}
