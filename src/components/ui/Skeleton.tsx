export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-card-strong ${className ?? ""}`} />;
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
