import { fetchAllArticles } from '@/lib/fetcher';
import { serialize } from '@/lib/serialize';
import { DEFAULT_REVALIDATE } from '@/lib/rss-sources';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import SanitizedHTML from '@/components/SanitizedHTML';

export const revalidate = DEFAULT_REVALIDATE;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const articles = serialize(await fetchAllArticles());
  const article = articles.find((a) => a.id === params.slug);

  if (!article) return { title: '文章未找到' };

  const title = article.titleZh || article.title;
  const description = article.descriptionZh || article.description;

  return {
    title: `${title} — AI 新闻中心`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: article.url,
      images: article.imageUrl ? [{ url: article.imageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const articles = serialize(await fetchAllArticles());
  const article = articles.find((a) => a.id === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container-site py-10 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-light-muted dark:text-dark-muted hover:text-accent dark:hover:text-accent-dark transition-colors mb-8 group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        返回首页
      </Link>

      <article className="animate-fade-in">
        <div className="flex items-center gap-2.5 text-sm text-light-muted dark:text-dark-muted mb-5">
          <span className="text-base">{article.sourceIcon}</span>
          <span className="font-medium">{article.source}</span>
          <span className="text-light-border dark:text-dark-border">·</span>
          <time className="font-mono text-xs">
            {new Date(article.publishedAt).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {article.author && article.author !== article.source && (
            <>
              <span className="text-light-border dark:text-dark-border">·</span>
              <span>{article.author}</span>
            </>
          )}
        </div>

        <h1 className="font-display text-display-lg font-bold tracking-tight leading-tight mb-2">
          {article.titleZh || article.title}
        </h1>
        {article.titleZh && article.titleZh !== article.title && (
          <h2 className="font-display text-xl text-light-muted dark:text-dark-muted mb-6">
            {article.title}
          </h2>
        )}

        {article.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <Image
              src={article.imageUrl}
              alt={article.titleZh || article.title}
              width={1200}
              height={675}
              className="w-full aspect-video object-cover"
              priority
            />
          </div>
        )}

        <div className="flex gap-2 mb-8">
          {article.categories.map((cat) => (
            <Link
              key={cat}
              href={`/categories/${encodeURIComponent(cat)}`}
              className="badge"
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <div className="p-5 rounded-xl bg-accent/5 dark:bg-accent-dark/10 border border-accent/10 dark:border-accent-dark/10 mb-8">
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
            <SanitizedHTML
              html={article.contentZh}
              className="[&>img]:max-w-full [&>img]:rounded-lg [&>img]:my-6 [&>p]:mb-5 [&>p]:leading-[1.85] [&>h2]:mt-10 [&>h2]:mb-5 [&>h2]:font-display [&>h2]:font-semibold [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:font-display [&>h3]:font-semibold [&>ul]:my-5 [&>ul]:pl-6 [&>ul]:space-y-2.5 [&>li]:leading-relaxed [&>blockquote]:my-6 [&>blockquote]:border-l-4 [&>blockquote]:border-accent/40 [&>blockquote]:pl-5 [&>blockquote]:italic [&>blockquote]:text-light-muted dark:[&>blockquote]:text-dark-muted [&>strong]:text-light-text dark:[&>strong]:text-dark-text"
            />
          )}

          {article.contentZh && article.content && article.contentZh !== article.content && (
            <div className="mt-12 pt-8 border-t border-light-border dark:border-dark-border">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-accent rounded-full" />
                <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted">
                  原文 / English Original
                </h3>
              </div>
              <SanitizedHTML
                html={article.content}
                className="text-sm text-light-muted dark:text-dark-muted [&>img]:max-w-full [&>img]:rounded-lg [&>img]:my-6 [&>p]:mb-4 [&>p]:leading-relaxed [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:mt-6 [&>h3]:mb-3 [&>ul]:my-4 [&>ul]:pl-6 [&>ul]:space-y-2 [&>li]:leading-relaxed opacity-75"
              />
            </div>
          )}

          {!article.contentZh && article.content && (
            <SanitizedHTML
              html={article.content}
              className="[&>img]:max-w-full [&>img]:rounded-lg [&>img]:my-6 [&>p]:mb-5 [&>p]:leading-[1.85] [&>h2]:mt-10 [&>h2]:mb-5 [&>h2]:font-display [&>h2]:font-semibold [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:font-display [&>h3]:font-semibold [&>ul]:my-5 [&>ul]:pl-6 [&>ul]:space-y-2.5 [&>li]:leading-relaxed [&>blockquote]:my-6 [&>blockquote]:border-l-4 [&>blockquote]:border-accent/40 [&>blockquote]:pl-5 [&>blockquote]:italic [&>blockquote]:text-light-muted dark:[&>blockquote]:text-dark-muted [&>strong]:text-light-text dark:[&>strong]:text-dark-text"
            />
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-light-border dark:border-dark-border">
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
