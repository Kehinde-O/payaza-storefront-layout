'use client';

import { StoreConfig } from '@/lib/store-types';
import { ElectronicsCategoriesPage } from '../../electronics/components/ElectronicsCategoriesPage';

interface CategoriesPageProps {
  storeConfig: StoreConfig;
}

export function CategoriesPage({ storeConfig }: CategoriesPageProps) {
  return <ElectronicsCategoriesPage storeConfig={storeConfig} />;
}

