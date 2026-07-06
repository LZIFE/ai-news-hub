export default function PaperLoading() {
  return (
    <div className="container-site py-10 max-w-3xl animate-pulse">
      <div className="h-4 w-24 bg-light-border dark:bg-dark-border rounded mb-8" />
      <div className="space-y-4">
        <div className="h-6 w-48 bg-light-border dark:bg-dark-border rounded" />
        <div className="h-6 w-80 bg-light-border dark:bg-dark-border rounded" />
        <div className="h-4 w-32 bg-light-border dark:bg-dark-border rounded mb-8" />
        <div className="space-y-2 mb-6">
          <div className="h-4 w-20 bg-light-border dark:bg-dark-border rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-32 bg-light-border dark:bg-dark-border rounded-lg" />
            <div className="h-8 w-40 bg-light-border dark:bg-dark-border rounded-lg" />
            <div className="h-8 w-36 bg-light-border dark:bg-dark-border rounded-lg" />
          </div>
        </div>
        <div className="flex gap-2 mb-8">
          <div className="h-6 w-16 bg-light-border dark:bg-dark-border rounded-full" />
          <div className="h-6 w-20 bg-light-border dark:bg-dark-border rounded-full" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-light-border dark:bg-dark-border rounded" />
          <div className="h-4 w-5/6 bg-light-border dark:bg-dark-border rounded" />
          <div className="h-4 w-4/6 bg-light-border dark:bg-dark-border rounded" />
          <div className="h-4 w-full bg-light-border dark:bg-dark-border rounded" />
          <div className="h-4 w-3/4 bg-light-border dark:bg-dark-border rounded" />
          <div className="h-4 w-5/6 bg-light-border dark:bg-dark-border rounded" />
          <div className="h-4 w-2/3 bg-light-border dark:bg-dark-border rounded" />
        </div>
      </div>
    </div>
  );
}
