export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans animate-pulse">
      <div className="container mx-auto max-w-6xl">
        {/* Header / Breadcrumb */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="w-8 h-0.5 bg-gray-200" />
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Form Section */}
          <div className="flex-1 space-y-8">
            {/* Contact Information Skeleton */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                <div className="h-6 bg-gray-200 rounded w-48" />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="h-4 bg-gray-200 rounded w-32 ml-1" />
                  <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
              </div>
            </section>

            {/* Shipping Address Skeleton */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                <div className="h-6 bg-gray-200 rounded w-40" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <div className="h-4 bg-gray-200 rounded w-24 ml-1" />
                  <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 bg-gray-200 rounded w-24 ml-1" />
                  <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <div className="h-4 bg-gray-200 rounded w-20 ml-1" />
                  <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 bg-gray-200 rounded w-20 ml-1" />
                  <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 bg-gray-200 rounded w-16 ml-1" />
                  <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 bg-gray-200 rounded w-24 ml-1" />
                  <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 bg-gray-200 rounded w-20 ml-1" />
                  <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
              </div>
            </section>

            {/* Shipping Method Skeleton */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                <div className="h-6 bg-gray-200 rounded w-40" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-5 h-5 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32" />
                      <div className="h-3 bg-gray-200 rounded w-48" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
              </div>
            </section>

            {/* Continue Button Skeleton */}
            <div className="h-14 bg-gray-200 rounded-2xl" />
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-8">
              <div className="h-7 bg-gray-200 rounded w-32 mb-6" />
              
              <div className="space-y-6 mb-8">
                {/* Product Item Skeleton */}
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 py-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t-2 border-gray-50">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
                <div className="flex justify-between items-end pt-4 mt-2 border-t border-gray-100">
                  <div className="h-5 bg-gray-200 rounded w-28" />
                  <div className="h-8 bg-gray-200 rounded w-32" />
                </div>
              </div>
            </div>

            {/* Promo Code Skeleton */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mt-6">
              <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-gray-200 rounded-xl" />
                <div className="w-20 h-10 bg-gray-200 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

