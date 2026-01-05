'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { cn } from '../../lib/utils';
export function AvatarImage({ src, alt = 'Profile', size = 40, className, fallbackIcon, fill = false, }) {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imageRef = useRef(null);
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
        return (_jsx("div", { className: cn('flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 rounded-full', className), style: fill ? undefined : { width: size, height: size }, children: fallbackIcon || _jsx(User, { className: "text-gray-400", style: { width: `${size / 2}px`, height: `${size / 2}px` } }) }));
    }
    return (_jsxs("div", { className: cn('relative overflow-hidden rounded-full', className), style: fill ? undefined : { width: size, height: size }, children: [!imageLoaded && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 z-10", children: _jsx(User, { className: "text-gray-400 animate-pulse", style: { width: `${size / 2}px`, height: `${size / 2}px` } }) })), _jsx("img", { ref: imageRef, src: src, alt: alt, className: cn('object-cover transition-opacity duration-200 rounded-full', imageLoaded ? 'opacity-100' : 'opacity-0', fill ? 'w-full h-full' : ''), style: fill ? undefined : { width: size, height: size }, onLoad: handleLoad, onError: handleError, loading: "lazy" })] }));
}
