import { fetchAllPapers } from '@/lib/paper-fetcher';
import { serialize } from '@/lib/serialize';
import PaperList from '@/components/PaperList';
import PaperCategoryNav from '@/components/PaperCategoryNav';

export const dynamic = 'force-dynamic';

export default async function PapersPage() {
  const papers = serialize(await fetchAllPapers());

  return (
    <div className="container-site py-10">
      <section className="mb-10 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="section-label">前沿研究</span>
        </div>
        <h1 className="font-display text-display-xl font-bold tracking-tight mb-3">
          AI 论文
        </h1>
        <p className="text-light-muted dark:text-dark-muted text-lg max-w-2xl leading-relaxed">
          来自 arXiv 的最新人工智能研究论文，覆盖 NLP、CV、ML、Robotics 等领域。
        </p>
      </section>

      <section className="mb-8">
        <PaperCategoryNav papers={papers} />
      </section>

      <section className="mb-16">
        <PaperList papers={papers} />
      </section>
    </div>
  );
}
