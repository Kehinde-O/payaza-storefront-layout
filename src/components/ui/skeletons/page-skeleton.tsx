export function PageSkeleton() {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-white animate-pulse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center space-x-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>

        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <div className="h-12 bg-gray-200 rounded-full w-32" />
          <div className="h-12 bg-gray-200 rounded-full w-32" />
        </div>
      </div>
    </div>
  );
}

