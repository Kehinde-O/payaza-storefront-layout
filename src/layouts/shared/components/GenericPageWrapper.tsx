'use client';

import { StoreConfig } from '@/lib/store-types';
import { StoreHeader } from './StoreHeader';
import { StoreFooter } from './StoreFooter';

interface GenericPageWrapperProps {
  children: React.ReactNode;
  storeConfig: StoreConfig;
}

export function GenericPageWrapper({ children, storeConfig }: GenericPageWrapperProps) {
  // These layouts suppress the header/footer in BaseStoreLayout
  // So we need to re-add them for generic pages like Contact, About, etc.
  // 'electronics' and 'electronics-grid' are handled by ElectronicsPageWrapper usually, 
  // but if we use this wrapper, we should check.
  
  const customLayouts = ['food-modern', 'clothing-minimal', 'booking-agenda'];
  
  // Note: electronics layouts usually use ElectronicsPageWrapper which has its own header.
  // If this wrapper is used for them, we might want to check or just use StoreHeader as fallback.
  // But typically we route those to ElectronicsPageWrapper.

  const needsHeader = customLayouts.includes(storeConfig.layout);

  if (needsHeader) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader storeConfig={storeConfig} />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <StoreFooter storeConfig={storeConfig} />
      </div>
    );
  }

  return <>{children}</>;
}

