import { fetchAllArticles } from '@/lib/fetcher';
import { DEFAULT_REVALIDATE } from '@/lib/rss-sources';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
        Back to feed
      </Link>

      <article>
        <div className="flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted mb-4">
          <span>{article.sourceIcon}</span>
          <span className="font-medium">{article.source}</span>
          <span>·</span>
          <time>{new Date(article.publishedAt).toLocaleDateString('en-US', {
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

        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6">
          {article.title}
        </h1>

        {article.imageUrl && (
          <div className="mb-8 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
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
          <p className="text-lg leading-relaxed text-light-muted dark:text-dark-muted">
            {article.description}
          </p>

          {article.content && (
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
            Read original article
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </article>
    </div>
  );
}
