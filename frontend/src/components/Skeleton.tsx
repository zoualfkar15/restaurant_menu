export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-stone-200/80 ${className}`} />;
}

export function MenuPageSkeleton() {
  return (
    <div className="min-h-screen menu-bg">
      <div className="sticky top-0 bg-white border-b border-menu-border p-4 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-menu-border">
            <Skeleton className="w-28 h-28 rounded-xl shrink-0" />
            <div className="flex-1 space-y-3 py-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
