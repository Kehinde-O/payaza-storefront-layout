'use client';

import { StoreConfig } from '../../../lib/store-types';
import { StandardLayout } from '../wrappers/StandardLayout';
import { ClothingMinimalLayout } from '../wrappers/ClothingMinimalLayout';
import { FoodModernLayout } from '../wrappers/FoodModernLayout';
import { BookingAgendaLayout } from '../wrappers/BookingAgendaLayout';
import { ElectronicsLayout } from '../wrappers/ElectronicsLayout';
import { MotivationalLayout } from '../wrappers/MotivationalLayout';

import { usePathname, useSearchParams } from 'next/navigation';

interface BaseStoreLayoutProps {
  children: React.ReactNode;
  storeConfig: StoreConfig;
}

export function BaseStoreLayout({ children, storeConfig }: BaseStoreLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine layout wrapper based on config
  // Allow preview override via query param to ensure wrapper matches page content
  const previewLayout = searchParams.get('preview_layout');
  const layout = previewLayout || storeConfig.layout;

  // Check if we're on the homepage for booking-agenda
  // BookingHomePageAgenda is now self-contained, so skip wrapper for homepage
  const isHomePage = !pathname || pathname === '/' || pathname === `/${storeConfig.slug}` || pathname.endsWith(`/${storeConfig.slug}`);

  switch (layout) {
    case 'clothing-minimal':
      return <ClothingMinimalLayout storeConfig={storeConfig}>{children}</ClothingMinimalLayout>;

    case 'food-modern':
      return <FoodModernLayout storeConfig={storeConfig}>{children}</FoodModernLayout>;

    case 'booking-agenda':
      // Homepage is self-contained, other pages need the wrapper for sidebar consistency
      if (isHomePage) {
        return <>{children}</>;
      }
      return <BookingAgendaLayout storeConfig={storeConfig}>{children}</BookingAgendaLayout>;

    case 'electronics':
    case 'electronics-grid':
      return <ElectronicsLayout storeConfig={storeConfig}>{children}</ElectronicsLayout>;

    case 'motivational-speaker':
      return <MotivationalLayout storeConfig={storeConfig}>{children}</MotivationalLayout>;

    default:
      return <StandardLayout storeConfig={storeConfig}>{children}</StandardLayout>;
  }
}
