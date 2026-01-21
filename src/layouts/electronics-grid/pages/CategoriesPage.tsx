'use client';

import { StoreConfig } from '@/lib/store-types';
import { ElectronicsGridCategoriesPage } from '../../electronics-grid/pages/ElectronicsGridCategoriesPage';

interface CategoriesPageProps {
  storeConfig: StoreConfig;
}

export function CategoriesPage({ storeConfig }: CategoriesPageProps) {
  return <ElectronicsGridCategoriesPage storeConfig={storeConfig} />;
}

