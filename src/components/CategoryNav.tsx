import Link from 'next/link';

const categories = [
  '人工智能',
  '机器学习',
  '大语言模型',
  '计算机视觉',
  '机器人技术',
  'AI 创业',
  'AI 政策',
  '开源',
];

export default function CategoryNav({ active }: { active?: string }) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Link
        href="/"
        className={`badge whitespace-nowrap transition-colors ${
          !active
            ? 'bg-accent text-white border-accent'
            : 'hover:border-accent dark:hover:border-accent-dark'
        }`}
      >
        全部
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/categories/${encodeURIComponent(cat)}`}
          className={`badge whitespace-nowrap transition-colors ${
            active === cat
              ? 'bg-accent text-white border-accent'
              : 'hover:border-accent dark:hover:border-accent-dark'
          }`}
        >
          {cat}
        </Link>
      ))}
    </nav>
  );
}
