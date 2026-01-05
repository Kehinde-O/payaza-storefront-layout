'use client';

import { StoreConfig } from '@/lib/store-types';
import { ElectronicsStoreHeader } from './ElectronicsStoreHeader';
import { ElectronicsStoreFooter } from './ElectronicsStoreFooter';
import { PageContentLoader } from '@/components/ui/page-content-loader';
import { useLoading } from '@/lib/loading-context';

interface ElectronicsPageWrapperProps {
  children: React.ReactNode;
  storeConfig: StoreConfig;
}

export function ElectronicsPageWrapper({ children, storeConfig }: ElectronicsPageWrapperProps) {
  const { isBackendLoading } = useLoading();
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <ElectronicsStoreHeader storeConfig={storeConfig} />
      <main className="flex-1 pt-24 relative">
        {isBackendLoading && <PageContentLoader />}
        {children}
      </main>
      <ElectronicsStoreFooter storeConfig={storeConfig} />
    </div>
  );
}

