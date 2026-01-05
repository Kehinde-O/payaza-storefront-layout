'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Lock } from 'lucide-react';
import { StoreConfig } from '@/lib/store-types';

interface FeatureDisabledPageProps {
  storeConfig: StoreConfig;
  featureName: string;
  featureDescription?: string;
}

export function FeatureDisabledPage({ 
  storeConfig, 
  featureName,
  featureDescription = 'This page is not available for this store.'
}: FeatureDisabledPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">
      <div className="text-center max-w-2xl w-full">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Lock className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 mb-4 tracking-tight">
            Page Not Available
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
        </div>

        {/* Main Message */}
        <div className="space-y-4 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {featureName} is not enabled
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            {featureDescription}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href={`/${storeConfig.slug}`}>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white rounded-full px-8 py-6 h-auto font-semibold shadow-lg shadow-black/10 hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Store
            </Button>
          </Link>
          <Link href={`/${storeConfig.slug}`}>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto border-2 border-gray-200 hover:border-gray-300 rounded-full px-8 py-6 h-auto font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Button>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-20"></div>
        </div>
      </div>
    </div>
  );
}

