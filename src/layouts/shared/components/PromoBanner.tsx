'use client';

import React from 'react';
import Link from 'next/link';
import { PromoBannerSection } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PromoBannerProps {
  config: PromoBannerSection | null | undefined;
  layoutStyle?: 'food' | 'electronics' | 'clothing' | 'default';
  className?: string;
}

export function PromoBanner({ config, layoutStyle = 'default', className }: PromoBannerProps) {
  if (!config?.show) return null;

  const hasContent = config.image || config.title || config.subtitle || config.buttonText;

  if (!hasContent) return null;

  const content = (
    <div className={cn(
      'relative w-full overflow-hidden rounded-lg',
      layoutStyle === 'food' && 'min-h-[400px]',
      layoutStyle === 'electronics' && 'min-h-[300px]',
      layoutStyle === 'clothing' && 'min-h-[350px]',
      'min-h-[300px]',
      className
    )}>
      {config.image && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${config.image})` }}
        />
      )}
      <div className={cn(
        'relative z-10 flex flex-col items-center justify-center p-8 md:p-12 text-center',
        config.image ? 'bg-black/40' : 'bg-gradient-to-r from-primary/90 to-primary',
        'min-h-[300px]'
      )}>
        {config.title && (
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {config.title}
          </h3>
        )}
        {config.subtitle && (
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
            {config.subtitle}
          </p>
        )}
        {config.buttonText && (
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link href={config.buttonLink || '/products'}>
              {config.buttonText}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      {content}
    </section>
  );
}

