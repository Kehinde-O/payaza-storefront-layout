'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageAnimateWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageAnimateWrapper({ children, className }: PageAnimateWrapperProps) {
  const pathname = usePathname();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    setShouldAnimate(false);
    // Small timeout to reset animation state and trigger reflow
    const timer = setTimeout(() => setShouldAnimate(true), 10);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      key={pathname}
      className={cn(
        "animate-fade-in",
        className
      )}
    >
      {children}
    </div>
  );
}

