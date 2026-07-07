export default function MediaArticleLoading() {
  return (
    <div className="container-site py-10 max-w-3xl animate-pulse">
      <div className="h-4 w-24 bg-light-border dark:bg-dark-border rounded mb-8" />
      <div className="h-4 w-48 bg-light-border dark:bg-dark-border rounded mb-5" />
      <div className="h-10 w-full bg-light-border dark:bg-dark-border rounded mb-2" />
      <div className="h-10 w-3/4 bg-light-border dark:bg-dark-border rounded mb-6" />
      <div className="aspect-video bg-light-border dark:bg-dark-border rounded-xl mb-8" />
      <div className="h-20 w-full bg-light-border dark:bg-dark-border rounded-xl mb-8" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-light-border dark:bg-dark-border rounded" />
        <div className="h-4 w-full bg-light-border dark:bg-dark-border rounded" />
        <div className="h-4 w-5/6 bg-light-border dark:bg-dark-border rounded" />
        <div className="h-4 w-full bg-light-border dark:bg-dark-border rounded" />
        <div className="h-4 w-4/5 bg-light-border dark:bg-dark-border rounded" />
      </div>
    </div>
  );
}
