'use client';

import { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarImageProps {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
  fallbackIcon?: React.ReactNode;
  fill?: boolean;
}

export function AvatarImage({
  src,
  alt = 'Profile',
  size = 40,
  className,
  fallbackIcon,
  fill = false,
}: AvatarImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const prevSrcRef = useRef(src);

  // Reset error and loading state when src changes
  useEffect(() => {
    const currentSrcValue = typeof src === 'string' && src.trim() ? src : undefined;
    const hasChanged = currentSrcValue !== prevSrcRef.current;
    
    if (hasChanged) {
      setImageError(false);
      setImageLoaded(false);
      prevSrcRef.current = currentSrcValue;
      
      // Reset image ref to force reload
      if (imageRef.current) {
        imageRef.current.src = '';
      }
    }
  }, [src]);

  const handleLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleError = () => {
    console.warn('[AvatarImage] Image failed to load:', { src, alt });
    setImageError(true);
    setImageLoaded(false);
  };

  // If no src or error occurred, show fallback
  if (!src || imageError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 rounded-full',
          className
        )}
        style={fill ? undefined : { width: size, height: size }}
      >
        {fallbackIcon || <User className="text-gray-400" style={{ width: `${size / 2}px`, height: `${size / 2}px` }} />}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden rounded-full', className)} style={fill ? undefined : { width: size, height: size }}>
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 z-10">
          <User className="text-gray-400 animate-pulse" style={{ width: `${size / 2}px`, height: `${size / 2}px` }} />
        </div>
      )}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={cn(
          'object-cover transition-opacity duration-200 rounded-full',
          imageLoaded ? 'opacity-100' : 'opacity-0',
          fill ? 'w-full h-full' : ''
        )}
        style={fill ? undefined : { width: size, height: size }}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}

