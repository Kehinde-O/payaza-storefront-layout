'use client';

import { StoreConfig } from '@/lib/store-types';
import { ElectronicsCategoriesPage } from '@/layouts/electronics/components/ElectronicsCategoriesPage';

interface CategoriesPageProps {
  storeConfig: StoreConfig;
}

export function CategoriesPage({ storeConfig }: CategoriesPageProps) {
  return <ElectronicsCategoriesPage storeConfig={storeConfig} />;
}

