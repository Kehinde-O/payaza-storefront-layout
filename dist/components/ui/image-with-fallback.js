'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { ImageSkeleton } from './image-skeleton';
export function ImageWithFallback({ src, alt, className, fallbackSrc, fallbackText, skeletonAspectRatio = 'square', showSkeletonOnError = true, ...props }) {
    // Initialize loading state based on whether we have a valid src
    const initialSrc = typeof src === 'string' && src.trim() ? src : undefined;
    const [isLoading, setIsLoading] = useState(!!initialSrc); // Only loading if we have a src
    const [error, setError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(initialSrc);
    const prevSrcRef = useRef(src);
    const prevFallbackRef = useRef(fallbackSrc);
    const hasTriedFallback = useRef(false);
    const imageRef = useRef(null);
    const mountedRef = useRef(false);
    // Set mounted flag
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);
    // Reset when src or fallbackSrc changes
    useEffect(() => {
        const currentSrcValue = typeof src === 'string' && src.trim() ? src : undefined;
        const hasChanged = currentSrcValue !== prevSrcRef.current || fallbackSrc !== prevFallbackRef.current;
        if (hasChanged) {
            const newSrc = currentSrcValue || (fallbackSrc && fallbackSrc.trim() ? fallbackSrc : undefined);
            // Only set loading if we have a valid src to load
            setIsLoading(!!newSrc);
            setCurrentSrc(newSrc);
            setError(false);
            hasTriedFallback.current = false;
            prevSrcRef.current = currentSrcValue;
            prevFallbackRef.current = fallbackSrc;
            // Reset image ref to force reload
            if (imageRef.current) {
                imageRef.current.src = '';
            }
            // Debug logging (only in development)
            if (process.env.NODE_ENV === 'development') {
                console.log('[ImageWithFallback] Source changed:', {
                    src: currentSrcValue,
                    fallbackSrc,
                    newSrc,
                    alt,
                    willLoad: !!newSrc
                });
            }
        }
    }, [src, fallbackSrc, alt]);
    // Helper function to check if image is loaded and update state
    const checkAndUpdateImageState = (img, forceCheck = false) => {
        if (!mountedRef.current || !img)
            return;
        // Check if image is already loaded (cached images)
        // naturalHeight > 0 means image has loaded successfully
        if (img.complete && img.naturalHeight !== 0) {
            if (forceCheck || isLoading) {
                setIsLoading(false);
                setError(false);
                return true; // Image is loaded
            }
        }
        return false; // Image not loaded yet
    };
    // Aggressive check after currentSrc changes to handle cached images
    useEffect(() => {
        if (!mountedRef.current || !currentSrc)
            return;
        // Multiple checks at different intervals to catch cached images
        const checkImage = () => {
            if (imageRef.current && isLoading) {
                const isLoaded = checkAndUpdateImageState(imageRef.current, true);
                return isLoaded;
            }
            return false;
        };
        // Immediate check
        if (checkImage())
            return;
        let timeout1 = null;
        let timeout2 = null;
        // Check after DOM update (requestAnimationFrame)
        const rafId = requestAnimationFrame(() => {
            if (checkImage())
                return;
            // If still not loaded, check again after small delays (covers various timing scenarios)
            timeout1 = setTimeout(() => {
                if (checkImage())
                    return;
                // Final check after a bit more time
                timeout2 = setTimeout(() => {
                    checkImage();
                }, 100);
            }, 50);
        });
        return () => {
            cancelAnimationFrame(rafId);
            if (timeout1)
                clearTimeout(timeout1);
            if (timeout2)
                clearTimeout(timeout2);
        };
    }, [currentSrc, isLoading]);
    const handleLoad = () => {
        if (mountedRef.current) {
            setIsLoading(false);
            setError(false);
        }
    };
    const handleError = () => {
        console.warn('[ImageWithFallback] Image failed to load:', {
            currentSrc,
            originalSrc: src,
            fallbackSrc,
            hasTriedFallback: hasTriedFallback.current,
            alt
        });
        // Try fallback first if we haven't already and it's provided
        if (fallbackSrc && fallbackSrc.trim() && !hasTriedFallback.current && currentSrc !== fallbackSrc) {
            hasTriedFallback.current = true;
            setCurrentSrc(fallbackSrc);
            setError(false);
            setIsLoading(true);
            return;
        }
        // All fallbacks failed - stop loading and show error state
        setError(true);
        setIsLoading(false);
    };
    // Determine what to render based on state
    // Priority: 1) No src -> skeleton, 2) Loading -> skeleton, 3) Error -> skeleton or error div, 4) Success -> image
    // Case 1: No src at all
    if (!currentSrc) {
        if (process.env.NODE_ENV === 'development') {
            console.log('[ImageWithFallback] No src - showing skeleton:', { src, fallbackSrc, alt });
        }
        return _jsx(ImageSkeleton, { className: className, aspectRatio: skeletonAspectRatio });
    }
    // Case 2: Currently loading (have src but image hasn't loaded yet)
    // Render the image hidden so it can load, but show skeleton overlay
    if (isLoading && currentSrc) {
        if (process.env.NODE_ENV === 'development') {
            console.log('[ImageWithFallback] Loading - showing skeleton with hidden image:', { currentSrc, alt });
        }
        return (_jsxs("div", { className: cn("relative", className), children: [_jsx("img", { ref: (node) => {
                        imageRef.current = node;
                        // Check if image is already loaded (cached images) - this handles instant loads
                        if (node) {
                            // Immediate check for cached images
                            if (node.complete && node.naturalHeight !== 0) {
                                // Image is already loaded, update state immediately
                                if (mountedRef.current) {
                                    setIsLoading(false);
                                    setError(false);
                                }
                            }
                            else {
                                // Use requestAnimationFrame for images that might load quickly
                                requestAnimationFrame(() => {
                                    checkAndUpdateImageState(node, true);
                                });
                            }
                        }
                    }, src: currentSrc, alt: alt || 'Product image', className: "absolute inset-0 w-full h-full opacity-0", onLoad: handleLoad, onError: handleError, loading: "lazy", ...props }), _jsx(ImageSkeleton, { className: className, aspectRatio: skeletonAspectRatio })] }));
    }
    // Case 3: Error occurred
    if (error) {
        if (showSkeletonOnError && !fallbackText) {
            if (process.env.NODE_ENV === 'development') {
                console.log('[ImageWithFallback] Error - showing skeleton:', { currentSrc, alt });
            }
            return _jsx(ImageSkeleton, { className: className, aspectRatio: skeletonAspectRatio });
        }
        else {
            // Show placeholder div instead of skeleton
            return (_jsxs("div", { className: cn("flex flex-col items-center justify-center bg-gray-100 text-gray-400 border border-gray-200", className), style: { minHeight: '100px' }, children: [_jsx("svg", { className: "w-1/4 h-1/4 max-w-[48px] max-h-[48px] opacity-20", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), fallbackText && _jsx("span", { className: "text-[10px] uppercase tracking-widest font-bold mt-2 opacity-40", children: fallbackText })] }));
        }
    }
    // Case 4: Image loaded successfully - show the image
    return (_jsx("img", { ref: (node) => {
            imageRef.current = node;
            // Check if image is already loaded (cached images) - this handles instant loads
            if (node) {
                // Immediate check for cached images
                if (node.complete && node.naturalHeight !== 0) {
                    // Image is already loaded, update state immediately
                    if (mountedRef.current) {
                        setIsLoading(false);
                        setError(false);
                    }
                }
                else {
                    // Use requestAnimationFrame for images that might load quickly
                    requestAnimationFrame(() => {
                        checkAndUpdateImageState(node, true);
                    });
                }
            }
        }, src: currentSrc, alt: alt || 'Product image', className: className, onLoad: handleLoad, onError: handleError, loading: "lazy", ...props }));
}
