import { StoreConfig } from '@/lib/store-types';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface SizeGuidePageProps {
  storeConfig: StoreConfig;
}

export function SizeGuidePage({ storeConfig }: SizeGuidePageProps) {
  // Breadcrumbs
  const breadcrumbItems = [
    { label: storeConfig.name, href: `/${storeConfig.slug}` },
    { label: 'Size Guide', href: `/${storeConfig.slug}/size-guide` },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Size Guide</h1>

        <div className="space-y-12">
          {/* Clothing Size Chart */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Clothing Size Chart</h2>
            <p className="text-gray-600 mb-6">
              Use this chart to find your perfect fit for tops, bottoms, and dresses. Measurements are in inches.
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm border-collapse text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 border-b border-gray-200 font-semibold text-gray-900">Size</th>
                    <th className="p-4 border-b border-gray-200 font-semibold text-gray-900">Chest (in)</th>
                    <th className="p-4 border-b border-gray-200 font-semibold text-gray-900">Waist (in)</th>
                    <th className="p-4 border-b border-gray-200 font-semibold text-gray-900">Hips (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">XS</td>
                    <td className="p-4 text-gray-600">32-34</td>
                    <td className="p-4 text-gray-600">26-28</td>
                    <td className="p-4 text-gray-600">32-34</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">S</td>
                    <td className="p-4 text-gray-600">34-36</td>
                    <td className="p-4 text-gray-600">28-30</td>
                    <td className="p-4 text-gray-600">34-36</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">M</td>
                    <td className="p-4 text-gray-600">38-40</td>
                    <td className="p-4 text-gray-600">32-34</td>
                    <td className="p-4 text-gray-600">38-40</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">L</td>
                    <td className="p-4 text-gray-600">42-44</td>
                    <td className="p-4 text-gray-600">36-38</td>
                    <td className="p-4 text-gray-600">42-44</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">XL</td>
                    <td className="p-4 text-gray-600">46-48</td>
                    <td className="p-4 text-gray-600">40-42</td>
                    <td className="p-4 text-gray-600">46-48</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">XXL</td>
                    <td className="p-4 text-gray-600">50-52</td>
                    <td className="p-4 text-gray-600">44-46</td>
                    <td className="p-4 text-gray-600">50-52</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footwear Size Chart */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Footwear Size Chart</h2>
            <p className="text-gray-600 mb-6">
              Use this chart to convert between US, UK, EU, and CM sizes.
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm border-collapse text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 border-b border-gray-200 font-semibold text-gray-900">US</th>
                    <th className="p-4 border-b border-gray-200 font-semibold text-gray-900">UK</th>
                    <th className="p-4 border-b border-gray-200 font-semibold text-gray-900">EU</th>
                    <th className="p-4 border-b border-gray-200 font-semibold text-gray-900">CM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">6</td>
                    <td className="p-4 text-gray-600">5</td>
                    <td className="p-4 text-gray-600">39</td>
                    <td className="p-4 text-gray-600">24</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">7</td>
                    <td className="p-4 text-gray-600">6</td>
                    <td className="p-4 text-gray-600">40</td>
                    <td className="p-4 text-gray-600">25</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">8</td>
                    <td className="p-4 text-gray-600">7</td>
                    <td className="p-4 text-gray-600">41</td>
                    <td className="p-4 text-gray-600">26</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">9</td>
                    <td className="p-4 text-gray-600">8</td>
                    <td className="p-4 text-gray-600">42</td>
                    <td className="p-4 text-gray-600">27</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">10</td>
                    <td className="p-4 text-gray-600">9</td>
                    <td className="p-4 text-gray-600">43</td>
                    <td className="p-4 text-gray-600">28</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">11</td>
                    <td className="p-4 text-gray-600">10</td>
                    <td className="p-4 text-gray-600">44</td>
                    <td className="p-4 text-gray-600">29</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">12</td>
                    <td className="p-4 text-gray-600">11</td>
                    <td className="p-4 text-gray-600">45</td>
                    <td className="p-4 text-gray-600">30</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Measuring Guide */}
          <div className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-900">How to Measure</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Chest</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Measure around the fullest part of your chest, keeping the tape measure horizontal.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Waist</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Measure around the narrowest part (typically where your body bends side to side), keeping the tape horizontal.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hips</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Measure around the fullest part of your hips, keeping the tape measure horizontal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

