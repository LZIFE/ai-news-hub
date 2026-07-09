import { fetchAllArticles } from '@/lib/fetcher';
import { serialize } from '@/lib/serialize';
import ArticleList from '@/components/ArticleList';
import CategoryNav from '@/components/CategoryNav';
import NewsletterCTA from '@/components/NewsletterCTA';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const articles = serialize(await fetchAllArticles());

  return (
    <div className="container-site py-10">
      <section className="mb-10 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="section-label">每日更新</span>
        </div>
        <h1 className="font-display text-display-xl font-bold tracking-tight mb-3">
          最新 AI 资讯
        </h1>
        <p className="text-light-muted dark:text-dark-muted text-lg max-w-2xl leading-relaxed">
          来自人工智能、机器学习和技术领域最佳来源的精选内容。
        </p>
      </section>

      <section className="mb-8">
        <CategoryNav articles={articles} />
      </section>

      <section className="mb-16">
        <ArticleList articles={articles} />
      </section>

      <NewsletterCTA />
    </div>
  );
}
