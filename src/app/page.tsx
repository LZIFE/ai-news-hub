import { fetchAllArticles } from '@/lib/fetcher';
import { DEFAULT_REVALIDATE } from '@/lib/rss-sources';
import ArticleList from '@/components/ArticleList';
import CategoryNav from '@/components/CategoryNav';
import NewsletterCTA from '@/components/NewsletterCTA';

export const revalidate = DEFAULT_REVALIDATE;

export default async function HomePage() {
  const articles = await fetchAllArticles();

  return (
    <div className="container-site py-10">
      <section className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
          最新 AI 资讯
        </h1>
        <p className="text-light-muted dark:text-dark-muted text-lg max-w-2xl">
          来自人工智能、机器学习和技术领域最佳来源的精选内容。
        </p>
      </section>

      <section className="mb-8">
        <CategoryNav />
      </section>

      <section className="mb-16">
        <ArticleList articles={articles} />
      </section>

      <NewsletterCTA />
    </div>
  );
}
