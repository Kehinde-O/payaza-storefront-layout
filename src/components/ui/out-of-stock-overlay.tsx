'use client';

import { cn } from '@/lib/utils';

interface OutOfStockOverlayProps {
  className?: string;
  showBadge?: boolean;
  badgePosition?: 'top-left' | 'top-right' | 'center' | 'bottom-center';
}

export function OutOfStockOverlay({ 
  className, 
  showBadge = true,
  badgePosition = 'center'
}: OutOfStockOverlayProps) {
  const badgePositions = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div 
      className={cn(
        "absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10 flex items-center justify-center",
        className
      )}
      aria-label="Out of stock"
    >
      {showBadge && (
        <div 
          className={cn(
            "absolute z-20",
            badgePositions[badgePosition]
          )}
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-600 text-white shadow-lg border-2 border-white/50">
            Out of Stock
          </span>
        </div>
      )}
    </div>
  );
}

