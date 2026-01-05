interface CategoryGridSkeletonProps {
  count?: number;
}

export function CategoryGridSkeleton({ count = 6 }: CategoryGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] mb-8">
      {Array.from({ length: count }).map((_, i) => {
        // Vary sizes like the actual category grid
        const getSpanClass = (index: number) => {
          if (index === 0) return 'md:col-span-2 md:row-span-2';
          if (index === 1) return 'md:row-span-2';
          if (index === 4) return 'md:col-span-2';
          return '';
        };

        return (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl bg-gray-200 animate-pulse ${getSpanClass(i)}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-300/80 via-gray-200/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-300 rounded w-1/2" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

