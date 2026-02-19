import { cn } from '../utils/classNames';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-700 rounded',
        className
      )}
    />
  );
}

export function MedicationCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-5 w-20 rounded-full mb-3" />
      <div className="flex flex-wrap gap-1.5 mb-4">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-4 w-14 rounded" />
      </div>
      <div className="flex flex-wrap gap-1 mb-4">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50">
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export function MedicationListItemSkeleton() {
  return (
    <div className="card p-4 flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-14 rounded" />
          <Skeleton className="h-4 w-18 rounded" />
        </div>
      </div>
      <div className="hidden sm:block text-right space-y-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="w-10 h-10 rounded-full" />
    </div>
  );
}

export function GuidelinesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Skeleton className="h-10 w-full rounded-lg" />

      {/* Content */}
      <div className="card p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="pt-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
  view?: 'grid' | 'list';
}

export function MedicationSkeletonGrid({ count = 6, view = 'grid' }: SkeletonGridProps) {
  if (view === 'list') {
    return (
      <div className="space-y-3">
        {[...Array(count)].map((_, i) => (
          <MedicationListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <MedicationCardSkeleton key={i} />
      ))}
    </div>
  );
}
