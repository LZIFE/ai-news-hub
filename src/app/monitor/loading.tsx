export default function MonitorLoading() {
  return (
    <div className="container-site py-10 animate-pulse">
      <div className="mb-10">
        <div className="h-4 w-16 bg-light-border dark:bg-dark-border rounded mb-4" />
        <div className="h-10 w-48 bg-light-border dark:bg-dark-border rounded mb-3" />
        <div className="h-5 w-96 bg-light-border dark:bg-dark-border rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card h-72">
            <div className="aspect-video bg-light-border dark:bg-dark-border rounded-lg mb-4" />
            <div className="h-4 w-24 bg-light-border dark:bg-dark-border rounded mb-3" />
            <div className="h-5 w-full bg-light-border dark:bg-dark-border rounded mb-2" />
            <div className="h-5 w-3/4 bg-light-border dark:bg-dark-border rounded mb-2" />
            <div className="h-4 w-full bg-light-border dark:bg-dark-border rounded mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
