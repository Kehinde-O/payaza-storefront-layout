'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: 'default' | 'light'; // 'light' for use on dark/colored backgrounds
}

export function Breadcrumbs({ items, variant = 'default' }: BreadcrumbsProps) {
  const isLight = variant === 'light';
  
  return (
    <nav className={`flex items-center space-x-2 text-sm ${isLight ? 'text-white' : 'text-gray-600'} ${variant === 'default' ? 'mb-6' : ''}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight className={`h-4 w-4 ${isLight ? 'text-white/70' : 'text-gray-400'}`} />}
          {item.href && index < items.length - 1 ? (
            <Link 
              href={item.href}
              className={`transition-colors ${isLight ? 'hover:text-white/90 text-white' : 'hover:text-gray-900'}`}
            >
              {item.label}
            </Link>
          ) : (
            <span className={index === items.length - 1 ? `${isLight ? 'text-white font-medium' : 'text-gray-900 font-medium'}` : ''}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

