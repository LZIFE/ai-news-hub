import { fetchAllArticles } from '@/lib/fetcher';
import { DEFAULT_REVALIDATE } from '@/lib/rss-sources';
import ArticleList from '@/components/ArticleList';
import CategoryNav from '@/components/CategoryNav';

export const revalidate = DEFAULT_REVALIDATE;

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = decodeURIComponent(params.category);
  const allArticles = await fetchAllArticles();
  const articles = allArticles.filter((a) =>
    a.categories.some(
      (c) => c.toLowerCase() === category.toLowerCase()
    )
  );

  return (
    <div className="container-site py-10">
      <section className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-3">
          {category}
        </h1>
        <p className="text-light-muted dark:text-dark-muted">
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </p>
      </section>

      <section className="mb-8">
        <CategoryNav active={category} />
      </section>

      <section>
        <ArticleList articles={articles} />
      </section>
    </div>
  );
}
