export function ProductCardSkeleton() {
  return (
    <div className="group relative flex flex-col h-full bg-white rounded-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="relative aspect-[3/4] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-5 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

