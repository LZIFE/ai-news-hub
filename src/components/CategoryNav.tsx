import Link from 'next/link';

const categories = [
  'Artificial Intelligence',
  'Machine Learning',
  'Large Language Models',
  'Computer Vision',
  'Robotics',
  'AI Startups',
  'AI Policy',
  'Open Source',
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
        All
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
