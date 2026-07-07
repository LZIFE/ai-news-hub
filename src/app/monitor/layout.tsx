import { Suspense } from 'react';

export default function MonitorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div className="container-site py-10 animate-pulse"><div className="h-10 w-48 bg-light-border dark:bg-dark-border rounded mb-4" /></div>}>{children}</Suspense>;
}
