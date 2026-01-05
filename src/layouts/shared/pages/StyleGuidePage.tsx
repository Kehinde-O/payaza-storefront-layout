'use client';

import { useState } from 'react';
import { StoreConfig } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Ruler, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StyleGuidePageProps {
  storeConfig: StoreConfig;
}

type Unit = 'cm' | 'in';
type Category = 'women' | 'men' | 'kids';
type SubCategory = 'clothing' | 'shoes';

const MEASUREMENT_GUIDE = [
  {
    title: 'Bust / Chest',
    description: 'Measure around the fullest part of your chest, keeping the tape horizontal.',
  },
  {
    title: 'Waist',
    description: 'Measure around the narrowest part of your waist (typically the small of your back and where your body bends side to side).',
  },
  {
    title: 'Hips',
    description: 'Measure around the fullest part of your hips, keeping the tape horizontal.',
  },
  {
    title: 'Inseam',
    description: 'Measure from the top of your inner thigh along the inside seam to the bottom of your leg.',
  },
];

const SIZE_DATA = {
  women: {
    clothing: {
      columns: ['Size', 'US', 'UK', 'EU', 'Bust', 'Waist', 'Hips'],
      rows: [
        { size: 'XS', us: '0-2', uk: '4-6', eu: '32-34', bust: { in: '31-33', cm: '79-84' }, waist: { in: '24-26', cm: '61-66' }, hips: { in: '34-36', cm: '86-91' } },
        { size: 'S', us: '4-6', uk: '8-10', eu: '36-38', bust: { in: '33-35', cm: '84-89' }, waist: { in: '26-28', cm: '66-71' }, hips: { in: '36-38', cm: '91-97' } },
        { size: 'M', us: '8-10', uk: '12-14', eu: '40-42', bust: { in: '35-37', cm: '89-94' }, waist: { in: '28-30', cm: '71-76' }, hips: { in: '38-40', cm: '97-102' } },
        { size: 'L', us: '12-14', uk: '16-18', eu: '44-46', bust: { in: '38-40', cm: '97-102' }, waist: { in: '30-33', cm: '76-84' }, hips: { in: '40-43', cm: '102-109' } },
        { size: 'XL', us: '16-18', uk: '20-22', eu: '48-50', bust: { in: '41-43', cm: '104-109' }, waist: { in: '33-36', cm: '84-91' }, hips: { in: '43-46', cm: '109-117' } },
      ]
    },
    shoes: {
      columns: ['US', 'UK', 'EU', 'CM', 'Inches'],
      rows: [
        { us: '5', uk: '3', eu: '36', cm: '22', in: '8.6' },
        { us: '6', uk: '4', eu: '37', cm: '23', in: '9' },
        { us: '7', uk: '5', eu: '38', cm: '24', in: '9.4' },
        { us: '8', uk: '6', eu: '39', cm: '25', in: '9.8' },
        { us: '9', uk: '7', eu: '40', cm: '26', in: '10.2' },
        { us: '10', uk: '8', eu: '41', cm: '27', in: '10.6' },
      ]
    }
  },
  men: {
    clothing: {
      columns: ['Size', 'US', 'UK', 'EU', 'Chest', 'Waist', 'Neck'],
      rows: [
        { size: 'S', us: '34-36', uk: '34-36', eu: '44-46', chest: { in: '34-36', cm: '86-91' }, waist: { in: '28-30', cm: '71-76' }, neck: { in: '14-14.5', cm: '36-37' } },
        { size: 'M', us: '38-40', uk: '38-40', eu: '48-50', chest: { in: '38-40', cm: '97-102' }, waist: { in: '32-34', cm: '81-86' }, neck: { in: '15-15.5', cm: '38-39' } },
        { size: 'L', us: '42-44', uk: '42-44', eu: '52-54', chest: { in: '42-44', cm: '107-112' }, waist: { in: '36-38', cm: '91-97' }, neck: { in: '16-16.5', cm: '41-42' } },
        { size: 'XL', us: '46-48', uk: '46-48', eu: '56-58', chest: { in: '46-48', cm: '117-122' }, waist: { in: '40-42', cm: '102-107' }, neck: { in: '17-17.5', cm: '43-44' } },
        { size: 'XXL', us: '50-52', uk: '50-52', eu: '60-62', chest: { in: '50-52', cm: '127-132' }, waist: { in: '44-46', cm: '112-117' }, neck: { in: '18-18.5', cm: '46-47' } },
      ]
    },
    shoes: {
      columns: ['US', 'UK', 'EU', 'CM', 'Inches'],
      rows: [
        { us: '7', uk: '6', eu: '40', cm: '25', in: '9.8' },
        { us: '8', uk: '7', eu: '41', cm: '26', in: '10.2' },
        { us: '9', uk: '8', eu: '42', cm: '27', in: '10.6' },
        { us: '10', uk: '9', eu: '43', cm: '28', in: '11' },
        { us: '11', uk: '10', eu: '44', cm: '29', in: '11.4' },
        { us: '12', uk: '11', eu: '45', cm: '30', in: '11.8' },
      ]
    }
  },
  kids: {
    clothing: {
      columns: ['Size', 'Age (Approx)', 'Height', 'Weight'],
      rows: [
        { size: 'XS', age: '4-5', height: { in: '40-45', cm: '102-114' }, weight: { in: '35-45 lbs', cm: '16-20 kg' } },
        { size: 'S', age: '6-7', height: { in: '45-50', cm: '114-127' }, weight: { in: '45-60 lbs', cm: '20-27 kg' } },
        { size: 'M', age: '8-9', height: { in: '50-55', cm: '127-140' }, weight: { in: '60-80 lbs', cm: '27-36 kg' } },
        { size: 'L', age: '10-11', height: { in: '55-60', cm: '140-152' }, weight: { in: '80-100 lbs', cm: '36-45 kg' } },
        { size: 'XL', age: '12-13', height: { in: '60-64', cm: '152-163' }, weight: { in: '100-120 lbs', cm: '45-54 kg' } },
      ]
    },
    shoes: {
      columns: ['US Kids', 'UK', 'EU', 'CM', 'Inches'],
      rows: [
        { us: '10', uk: '9', eu: '27', cm: '17', in: '6.7' },
        { us: '11', uk: '10', eu: '28', cm: '18', in: '7' },
        { us: '12', uk: '11', eu: '30', cm: '19', in: '7.4' },
        { us: '13', uk: '12', eu: '31', cm: '20', in: '7.8' },
        { us: '1', uk: '13', eu: '32', cm: '21', in: '8.1' },
        { us: '2', uk: '1', eu: '33', cm: '22', in: '8.5' },
      ]
    }
  }
};

export function StyleGuidePage({ storeConfig }: StyleGuidePageProps) {
  const [unit, setUnit] = useState<Unit>('in');
  const [activeCategory, setActiveCategory] = useState<Category>('women');
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>('clothing');

  const primaryColor = storeConfig.branding.primaryColor;

  // Type safe data access
  const currentData = SIZE_DATA[activeCategory]?.[activeSubCategory];

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Size & Style Guide</h1>
        <p className="text-lg text-gray-600">
          Find your perfect fit with our comprehensive size charts and measurement guides. 
          Compare international sizes and convert measurements instantly.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-8">
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-xl">
            {/* Category Tabs */}
            <div className="flex bg-white rounded-lg p-1 shadow-sm border">
              {(['women', 'men', 'kids'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all capitalize",
                    activeCategory === cat 
                      ? "bg-gray-900 text-white shadow-sm" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                  style={activeCategory === cat ? { backgroundColor: primaryColor } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
               {/* Sub Category */}
               <div className="flex gap-2">
                 {(['clothing', 'shoes'] as SubCategory[]).map((sub) => (
                    <Button
                      key={sub}
                      variant={activeSubCategory === sub ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveSubCategory(sub)}
                      className="capitalize"
                    >
                      {sub}
                    </Button>
                 ))}
               </div>
            </div>
          </div>

          {/* Unit Toggle & Table Header */}
           <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold capitalize">
                {activeCategory}s {activeSubCategory === 'clothing' ? 'Clothing' : 'Shoes'} Chart
              </h2>
               {/* Unit Toggle */}
               <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setUnit('in')}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm font-medium transition-all",
                    unit === 'in' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  IN
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm font-medium transition-all",
                    unit === 'cm' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  CM
                </button>
              </div>
           </div>

          {/* Table */}
          <Card className="overflow-hidden border-0 shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      {currentData?.columns.map((col) => (
                        <th key={col} className="px-6 py-4 font-bold tracking-wider">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentData?.rows.map((row, idx) => (
                      <tr key={idx} className="bg-white hover:bg-gray-50 transition-colors">
                        {currentData.columns.map((col) => {
                          const key = col.toLowerCase().split(' ')[0]; // simple matching strategy
                          let value = (row as any)[key];

                          // Check if value is an object with units
                          if (typeof value === 'object' && value !== null && 'in' in value) {
                            value = value[unit];
                          }
                          
                          // Fallback for direct mapping (like US, UK)
                          if (!value) {
                             // Attempt to find by column name if key mapping failed (e.g. "US Kids" -> "us")
                             const altKey = col.toLowerCase().includes('us') ? 'us' : 
                                            col.toLowerCase().includes('age') ? 'age' : 
                                            key;
                             value = (row as any)[altKey];
                             if (typeof value === 'object' && value !== null && 'in' in value) {
                                value = value[unit];
                             }
                          }

                          return (
                            <td key={col} className="px-6 py-4 font-medium text-gray-900">
                              {value || '-'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 items-start">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Size charts are a general guide. Fit may vary depending on the manufacturer, style, and materials. When in doubt, we recommend sizing up for a more comfortable fit.
            </p>
          </div>
        </div>

        {/* Sidebar / Measuring Guide */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
             <div className="flex items-center gap-2 mb-4">
               <Ruler className="w-5 h-5 text-gray-700" />
               <h3 className="font-semibold text-lg">How to Measure</h3>
             </div>
             <div className="space-y-6">
                {MEASUREMENT_GUIDE.map((guide, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="font-medium text-gray-900 text-sm flex items-center gap-2">
                       <span className="bg-gray-200 text-gray-700 w-5 h-5 rounded-full inline-flex items-center justify-center text-xs">
                         {idx + 1}
                       </span>
                       {guide.title}
                    </p>
                    <p className="text-xs text-gray-500 pl-7 leading-relaxed">
                      {guide.description}
                    </p>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Fit Tips</h3>
            <ul className="space-y-3">
              <li className="text-sm text-gray-600 flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Measure yourself in your underwear for accuracy.</span>
              </li>
              <li className="text-sm text-gray-600 flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Keep the tape measure level and snug, but not tight.</span>
              </li>
              <li className="text-sm text-gray-600 flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>If you fall between sizes, order the larger size.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
