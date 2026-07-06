export default function ArticleLoading() {
  return (
    <div className="container-site py-10 max-w-3xl animate-pulse">
      <div className="h-4 w-20 bg-light-border dark:bg-dark-border rounded mb-8" />
      <div className="space-y-4">
        <div className="h-6 w-48 bg-light-border dark:bg-dark-border rounded" />
        <div className="h-6 w-64 bg-light-border dark:bg-dark-border rounded" />
        <div className="h-4 w-32 bg-light-border dark:bg-dark-border rounded mb-8" />
        <div className="aspect-video bg-light-border dark:bg-dark-border rounded-xl mb-8" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-light-border dark:bg-dark-border rounded" />
          <div className="h-4 w-5/6 bg-light-border dark:bg-dark-border rounded" />
          <div className="h-4 w-4/6 bg-light-border dark:bg-dark-border rounded" />
          <div className="h-4 w-full bg-light-border dark:bg-dark-border rounded" />
          <div className="h-4 w-3/4 bg-light-border dark:bg-dark-border rounded" />
        </div>
      </div>
    </div>
  );
}
