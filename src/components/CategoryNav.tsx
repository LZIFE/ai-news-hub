import Link from 'next/link';

interface CategoryNavProps {
  active?: string;
  articles?: { categories: string[] }[];
}

export default function CategoryNav({ active, articles }: CategoryNavProps) {
  if (articles) {
    const seen = new Set<string>();
    for (const a of articles) {
      for (const c of a.categories) {
        if (!seen.has(c)) seen.add(c);
      }
    }
    const dynamicCategories = Array.from(seen).sort();
    if (dynamicCategories.length > 0) {
      return (
        <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Link
            href="/"
            className={`badge whitespace-nowrap transition-all duration-200 ${
              !active
                ? 'bg-accent text-white border-accent shadow-sm'
                : 'hover:border-accent/40 dark:hover:border-accent-dark/40'
            }`}
          >
            全部
          </Link>
          {dynamicCategories.map((cat) => (
            <Link
              key={cat}
              href={`/categories/${encodeURIComponent(cat)}`}
              className={`badge whitespace-nowrap transition-all duration-200 ${
                active === cat
                  ? 'bg-accent text-white border-accent shadow-sm'
                  : 'hover:border-accent/40 dark:hover:border-accent-dark/40'
              }`}
            >
              {cat}
            </Link>
          ))}
        </nav>
      );
    }
  }

  // Fallback static categories
  const categories = [
    'AI', '机器学习', '大语言模型', '计算机视觉',
    '机器人', '创业', '科技', '开源',
  ];

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Link
        href="/"
        className={`badge whitespace-nowrap transition-all duration-200 ${
          !active
            ? 'bg-accent text-white border-accent shadow-sm'
            : 'hover:border-accent/40 dark:hover:border-accent-dark/40'
        }`}
      >
        全部
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/categories/${encodeURIComponent(cat)}`}
          className={`badge whitespace-nowrap transition-all duration-200 ${
            active === cat
              ? 'bg-accent text-white border-accent shadow-sm'
              : 'hover:border-accent/40 dark:hover:border-accent-dark/40'
          }`}
        >
          {cat}
        </Link>
      ))}
    </nav>
  );
}
