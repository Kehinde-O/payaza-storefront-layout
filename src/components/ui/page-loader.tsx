'use client';

import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

function Spinner({ size = 'md', className, color = 'text-gray-900' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const borderClasses = {
    sm: 'border-2',
    md: 'border-[3px]',
    lg: 'border-4',
  };

  return (
    <div
      className={cn(
        'rounded-full border-solid border-t-transparent border-r-transparent',
        'animate-spin',
        sizeClasses[size],
        borderClasses[size],
        color,
        'border-l-current border-b-current',
        className
      )}
      style={{
        animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    />
  );
}

interface PageLoaderProps {
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function PageLoader({ 
  fullPage = false, 
  size = 'md',
  className,
  text 
}: PageLoaderProps) {
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Spinner size={size} color="text-gray-900" />
      {text && (
        <p className="text-sm text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

interface InlineLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export function InlineLoader({ size = 'sm', className, color }: InlineLoaderProps) {
  return (
    <Spinner 
      size={size} 
      className={className}
      color={color || 'text-gray-600'}
    />
  );
}

interface ButtonLoaderProps {
  className?: string;
  color?: string;
}

export function ButtonLoader({ className, color }: ButtonLoaderProps) {
  return (
    <Spinner 
      size="sm" 
      className={className}
      color={color || 'text-current'}
    />
  );
}

