export function ProductDetailSkeleton() {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-white animate-pulse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center space-x-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-40" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded" />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
            
            <div className="h-6 bg-gray-200 rounded w-24" />
            
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>

            {/* Variants */}
            <div className="space-y-4">
              <div className="h-5 bg-gray-200 rounded w-32" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 w-10 bg-gray-200 rounded-full" />
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="h-5 bg-gray-200 rounded w-24" />
              <div className="flex gap-4">
                <div className="h-14 bg-gray-200 rounded-full flex-1" />
                <div className="h-14 bg-gray-200 rounded-full w-14" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

