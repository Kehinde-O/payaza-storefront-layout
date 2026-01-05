'use client';

import { StoreConfig } from '@/lib/store-types';
import { StoreHeader } from '@/layouts/shared/components/StoreHeader';
import { StoreFooter } from '@/layouts/shared/components/StoreFooter';
import { PageContentLoader } from '@/components/ui/page-content-loader';
import { useLoading } from '@/lib/loading-context';
import { useStore } from '@/lib/store-context';

interface MotivationalPageWrapperProps {
  children: React.ReactNode;
  storeConfig: StoreConfig;
}

export function MotivationalPageWrapper({ children, storeConfig }: MotivationalPageWrapperProps) {
  const { isBackendLoading } = useLoading();
  const { cartCount } = useStore();
  
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900 selection:bg-black selection:text-white">
      <main className="flex-1 relative">
        {isBackendLoading && <PageContentLoader />}
        {children}
      </main>
    </div>
  );
}

