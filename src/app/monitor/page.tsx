import { fetchMediaArticles, getSourceGroups } from '@/lib/media-fetcher';
import { serialize } from '@/lib/serialize';
import SourceFilter from './SourceFilter';

export const dynamic = 'force-dynamic';

export default async function MonitorPage() {
  const articles = serialize(await fetchMediaArticles());
  const groups = getSourceGroups();

  return (
    <div className="container-site py-10">
      <section className="mb-10 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="section-label">产业监控</span>
        </div>
        <h1 className="font-display text-display-xl font-bold tracking-tight mb-3">
          传媒监控
        </h1>
        <p className="text-light-muted dark:text-dark-muted text-lg max-w-2xl leading-relaxed">
          追踪主流媒体动态与上市公司公告，覆盖人民网、新华网、央视、证券时报及沪深交易所公告。
        </p>
      </section>

      <section className="mb-8">
        <SourceFilter groups={groups} articles={articles} />
      </section>
    </div>
  );
}
