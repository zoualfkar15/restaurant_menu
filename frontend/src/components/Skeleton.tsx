export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-stone-200/80 ${className}`} />;
}

function CardSkeleton() {
  return (
    <div className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-menu-border sm:p-4">
      <Skeleton className="h-[88px] w-[88px] shrink-0 rounded-xl sm:h-24 sm:w-24" />
      <div className="flex-1 space-y-2.5 py-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Mirrors the restaurant about page (hero → white container → CTA/actions → info cards). */
export function AboutPageSkeleton() {
  return (
    <div className="menu-bg min-h-screen pb-12" aria-busy="true" aria-live="polite">
      <div className="hero-fallback h-[250px] animate-pulse rounded-b-[32px] sm:h-[280px] lg:h-[320px] lg:rounded-b-[40px]" />
      <div className="relative z-10 mx-3 -mt-7 sm:mx-4 lg:mx-auto lg:-mt-10 lg:max-w-[1100px] lg:px-8">
        <div className="rounded-[28px] bg-white px-4 pb-6 pt-5 shadow-menu-lg ring-1 ring-menu-border/80 sm:px-6 lg:rounded-[32px] lg:px-8 lg:pb-10 lg:pt-8">
          <div className="flex flex-col gap-3 md:flex-row">
            <Skeleton className="h-16 w-full rounded-2xl md:flex-1" />
            <div className="grid grid-cols-3 gap-2 md:flex">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[78px] rounded-2xl md:h-16 md:w-28" />
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-[22px] p-4 ring-1 ring-menu-border sm:p-5">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2.5 h-4 w-5/6" />
                <Skeleton className="mt-2.5 h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mirrors the public menu layout (hero → white container → search/pills → cards). */
export function MenuPageSkeleton() {
  return (
    <div className="menu-bg min-h-screen pb-12" aria-busy="true" aria-live="polite">
      <div className="hero-fallback h-[250px] animate-pulse rounded-b-[32px] sm:h-[280px] lg:h-[320px] lg:rounded-b-[40px]" />
      <div className="relative z-10 mx-3 -mt-7 sm:mx-4 lg:mx-auto lg:-mt-10 lg:max-w-[1400px] lg:px-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-8">
          <div className="rounded-[28px] bg-white px-4 pb-6 pt-6 shadow-menu-lg ring-1 ring-menu-border/80 sm:px-6 lg:rounded-[32px] lg:px-8">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <div className="mt-3 flex gap-3 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex w-[4.65rem] shrink-0 flex-col items-center gap-1.5">
                  <Skeleton className="h-[3.85rem] w-[3.85rem] rounded-[1.35rem]" />
                  <Skeleton className="h-2.5 w-10 rounded-full" />
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
          <div className="hidden rounded-[24px] bg-white p-5 shadow-menu-md ring-1 ring-menu-border lg:block">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="mt-6 h-16 w-full" />
            <Skeleton className="mt-3 h-16 w-full" />
            <Skeleton className="mt-6 h-14 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
