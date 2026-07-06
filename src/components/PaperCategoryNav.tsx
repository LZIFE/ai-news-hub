import Link from 'next/link';
import { Paper } from '@/lib/types';
import { arxivCategories } from '@/lib/paper-sources';

interface PaperCategoryNavProps {
  active?: string;
  papers: Paper[];
}

export default function PaperCategoryNav({ active, papers }: PaperCategoryNavProps) {
  const categoryCount = new Map<string, number>();
  for (const paper of papers) {
    for (const cat of paper.categories) {
      categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1);
    }
  }

  const topCategories = arxivCategories
    .filter((c) => categoryCount.has(c.id))
    .sort((a, b) => (categoryCount.get(b.id) || 0) - (categoryCount.get(a.id) || 0));

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Link
        href="/papers"
        className={`badge whitespace-nowrap transition-all duration-200 ${
          !active
            ? 'bg-accent text-white border-accent shadow-sm'
            : 'hover:border-accent/40 dark:hover:border-accent-dark/40'
        }`}
      >
        全部
      </Link>
      {topCategories.map((cat) => {
        const href = '/papers?category=' + encodeURIComponent(cat.id);
        const isActive = active === cat.id;
        const className = 'badge whitespace-nowrap transition-all duration-200 ' + (isActive ? 'bg-accent text-white border-accent shadow-sm' : 'hover:border-accent/40 dark:hover:border-accent-dark/40');
        return (
          <Link key={cat.id} href={href} className={className}>
            {cat.icon} {cat.name}
            <span className="ml-1 text-[10px] opacity-60">{categoryCount.get(cat.id)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
