import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-site py-20 text-center">
      <h1 className="font-display text-6xl font-bold mb-4">404</h1>
      <p className="text-light-muted dark:text-dark-muted text-lg mb-8">
        页面未找到。
      </p>
      <Link href="/" className="btn-primary">
        返回首页
      </Link>
    </div>
  );
}
