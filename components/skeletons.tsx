export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Cargando productos">
      <div className="skeleton h-5 w-24" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="skeleton aspect-[3/2] rounded-none" />
          <div className="space-y-3 p-4">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-6 w-24" />
            <div className="skeleton h-10 w-full" />
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Cargando">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton h-20 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2" aria-busy="true" aria-label="Cargando">
      <div className="skeleton aspect-[3/2] rounded-2xl" />
      <div className="space-y-4">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-9 w-3/4" />
        <div className="skeleton h-8 w-32" />
        <div className="skeleton h-24 w-full" />
        <div className="skeleton h-11 w-full" />
      </div>
    </div>
  );
}
