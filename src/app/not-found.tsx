import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-site py-20 text-center">
      <h1 className="font-display text-6xl font-bold mb-4">404</h1>
      <p className="text-light-muted dark:text-dark-muted text-lg mb-8">
        Page not found.
      </p>
      <Link href="/" className="btn-primary">
        Back to feed
      </Link>
    </div>
  );
}
