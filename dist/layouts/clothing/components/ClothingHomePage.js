'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from '../../../components/ui/button';
import { ProductRating } from '../../../components/ui/product-rating';
import { ShoppingCart, Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ImageWithFallback } from '../../../components/ui/image-with-fallback';
import { useState, useEffect } from 'react';
import { formatCurrency, filterActiveProducts } from '../../../lib/utils';
import { getLayoutText, getBannerImage } from '../../../lib/utils/asset-helpers';
import { shouldUseAPI } from '../../../lib/utils/demo-detection';
import { useStore } from '../../../lib/store-context';
import { DynamicIcon } from '../../../components/ui/dynamic-icon';
export function ClothingHomePage({ storeConfig: initialConfig }) {
    // Use the store from context which is updated in real-time by the editor
    const { store } = useStore();
    const storeConfig = store || initialConfig;
    const layoutConfig = storeConfig.layoutConfig;
    const categories = storeConfig.categories || [];
    // In preview mode, use mock products if none are available
    const isPreview = (typeof window !== 'undefined' && window.__IS_PREVIEW__) || storeConfig.layoutConfig?.isPreview;
    // Randomly select max 2 categories on every page load
    const [displayedCategories, setDisplayedCategories] = useState([]);
    useEffect(() => {
        // Shuffle and select max 2 categories
        if (categories.length > 0) {
            const shuffled = [...categories].sort(() => Math.random() - 0.5);
            setDisplayedCategories(shuffled.slice(0, 2));
        }
        else if (isPreview) {
            // Use mock categories in preview mode if none available
            setDisplayedCategories([
                { id: 'cat1', name: 'Menswear', slug: 'men', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200' },
                { id: 'cat2', name: 'Womenswear', slug: 'women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200' }
            ]);
        }
        else {
            setDisplayedCategories([]);
        }
    }, [categories, isPreview]); // Added categories and isPreview to deps
    // ... rest of the component logic ...
    // Deduplicate products to avoid key warnings and filter out inactive/deleted products
    const rawProducts = storeConfig.products || [];
    const uniqueProducts = rawProducts.filter((product, index, self) => index === self.findIndex((t) => t.id === product.id));
    const activeProducts = filterActiveProducts(uniqueProducts);
    // Use real active products if available, otherwise if in preview, use all products (including drafts), 
    // and if still none, use mock data
    const products = activeProducts.length > 0
        ? activeProducts
        : (isPreview && rawProducts.length > 0
            ? rawProducts
            : (isPreview ? [
                { id: 'p1', name: 'Premium Cotton Tee', price: 45, currency: 'USD', images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'], slug: 'premium-tee', rating: 4.8, reviewCount: 124 },
                { id: 'p2', name: 'Slim Fit Denim', price: 89, currency: 'USD', images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800'], slug: 'slim-denim', rating: 4.6, reviewCount: 89 },
                { id: 'p3', name: 'Classic Trench Coat', price: 199, currency: 'USD', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800'], slug: 'trench-coat', rating: 4.9, reviewCount: 56, compareAtPrice: 249 },
                { id: 'p4', name: 'Leather Chelsea Boots', price: 159, currency: 'USD', images: ['https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800'], slug: 'chelsea-boots', rating: 4.7, reviewCount: 112 }
            ] : []));
    // Hero slides data - use new slider structure with fallback to old format
    // For demo stores, helpers will return fallbacks; for real stores, try layoutConfig first, then helpers
    const isRealStore = shouldUseAPI(storeConfig.slug);
    // Debug logging for slider configuration
    if (process.env.NODE_ENV === 'development') {
        console.log('[ClothingHomePage] LayoutConfig sections.hero:', layoutConfig?.sections?.hero);
        console.log('[ClothingHomePage] LayoutConfig hero (top-level):', layoutConfig?.hero);
        console.log('[ClothingHomePage] Sliders found:', layoutConfig?.sections?.hero?.sliders?.length || 0);
    }
    // Try new structure first (sections.hero.sliders)
    let heroSlides = [];
    if (layoutConfig?.sections?.hero?.sliders && Array.isArray(layoutConfig.sections.hero.sliders) && layoutConfig.sections.hero.sliders.length > 0) {
        if (process.env.NODE_ENV === 'development') {
            console.log('[ClothingHomePage] Using sections.hero.sliders structure');
        }
        heroSlides = layoutConfig.sections.hero.sliders
            .filter((slider) => slider && slider.image) // Filter out invalid sliders
            .map((slider) => {
            // Extract button text - only use if not empty
            const primaryButtonText = slider.primaryButton?.text?.trim() || '';
            const secondaryButtonText = slider.secondaryButton?.text?.trim() || '';
            if (process.env.NODE_ENV === 'development') {
                console.log('[ClothingHomePage] Slider:', {
                    id: slider.id,
                    image: slider.image ? 'present' : 'missing',
                    title: slider.title,
                    primaryButtonText,
                    secondaryButtonText,
                });
            }
            // Check badge visibility - use sections.hero.showBadges first, fallback to top-level hero.showBadges
            const showBadges = layoutConfig?.sections?.hero?.showBadges !== false &&
                (layoutConfig?.hero?.showBadges !== false || layoutConfig?.sections?.hero?.showBadges === undefined);
            return {
                image: slider.image || '',
                badge: (showBadges && slider.badge && slider.badge.trim() !== '') ? slider.badge : undefined,
                title: slider.title || storeConfig.name,
                description: slider.description || storeConfig.description || '',
                // Only set button text if it's not empty - this allows button visibility logic to work
                primaryButtonText: primaryButtonText || getLayoutText(storeConfig, 'common.shopNow', 'Shop Now'),
                primaryButtonLink: slider.primaryButton?.link || `/${storeConfig.slug}/products`,
                secondaryButtonText: secondaryButtonText || undefined, // Don't provide fallback for secondary
                secondaryButtonLink: slider.secondaryButton?.link || `/${storeConfig.slug}/categories`,
            };
        });
    }
    else if (layoutConfig?.hero?.sliders && Array.isArray(layoutConfig.hero.sliders) && layoutConfig.hero.sliders.length > 0) {
        // Fallback to top-level hero.sliders
        if (process.env.NODE_ENV === 'development') {
            console.log('[ClothingHomePage] Using top-level hero.sliders structure');
        }
        heroSlides = layoutConfig.hero.sliders
            .filter((slider) => slider && slider.image) // Filter out invalid sliders
            .map((slider) => {
            const primaryButtonText = slider.primaryButton?.text?.trim() || '';
            const secondaryButtonText = slider.secondaryButton?.text?.trim() || '';
            // Check badge visibility - use sections.hero.showBadges first, fallback to top-level hero.showBadges
            const showBadges = layoutConfig?.sections?.hero?.showBadges !== false &&
                (layoutConfig?.hero?.showBadges !== false || layoutConfig?.sections?.hero?.showBadges === undefined);
            return {
                image: slider.image || '',
                badge: (showBadges && slider.badge && slider.badge.trim() !== '') ? slider.badge : undefined,
                title: slider.title || storeConfig.name,
                description: slider.description || storeConfig.description || '',
                primaryButtonText: primaryButtonText || getLayoutText(storeConfig, 'common.shopNow', 'Shop Now'),
                primaryButtonLink: slider.primaryButton?.link || `/${storeConfig.slug}/products`,
                secondaryButtonText: secondaryButtonText || undefined,
                secondaryButtonLink: slider.secondaryButton?.link || `/${storeConfig.slug}/categories`,
            };
        });
    }
    else {
        // Fallback to old format (backward compatibility)
        heroSlides = [
            {
                image: getBannerImage(storeConfig, 'hero_slide_1', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop'),
                badge: layoutConfig?.hero?.showBadges
                    ? (isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.badge ? layoutConfig.text.hero.slides[0].badge : getLayoutText(storeConfig, 'hero.badge', 'New Season'))
                    : undefined,
                title: isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.title ? layoutConfig.text.hero.slides[0].title : (getLayoutText(storeConfig, 'hero.slide1.title', storeConfig.name) || storeConfig.name),
                description: isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.description ? layoutConfig.text.hero.slides[0].description : (getLayoutText(storeConfig, 'hero.slide1.description', storeConfig.description) || storeConfig.description),
                primaryButtonText: isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.primaryButton ? layoutConfig.text.hero.slides[0].primaryButton : getLayoutText(storeConfig, 'common.shopNow', 'Shop Now'),
                primaryButtonLink: `/${storeConfig.slug}/products`,
                secondaryButtonText: isRealStore && layoutConfig?.text?.hero?.slides?.[0]?.secondaryButton ? layoutConfig.text.hero.slides[0].secondaryButton : getLayoutText(storeConfig, 'common.explore', 'Explore'),
                secondaryButtonLink: `/${storeConfig.slug}/categories`,
            },
            {
                image: getBannerImage(storeConfig, 'hero_slide_2', 'https://images.unsplash.com/photo-1617059063772-34532796ddb5?q=80&w=2000&auto=format&fit=crop'),
                badge: layoutConfig?.hero?.showBadges
                    ? (isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.badge ? layoutConfig.text.hero.slides[1].badge : getLayoutText(storeConfig, 'common.trending', 'Trending Now'))
                    : undefined,
                title: isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.title ? layoutConfig.text.hero.slides[1].title : getLayoutText(storeConfig, 'hero.slide2.title', 'Discover Your Style'),
                description: isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.description ? layoutConfig.text.hero.slides[1].description : getLayoutText(storeConfig, 'hero.slide2.description', 'Explore our curated collection of timeless pieces and contemporary designs.'),
                primaryButtonText: isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.primaryButton ? layoutConfig.text.hero.slides[1].primaryButton : getLayoutText(storeConfig, 'common.viewAll', 'View Collection'),
                primaryButtonLink: `/${storeConfig.slug}/products`,
                secondaryButtonText: isRealStore && layoutConfig?.text?.hero?.slides?.[1]?.secondaryButton ? layoutConfig.text.hero.slides[1].secondaryButton : undefined,
                secondaryButtonLink: `/${storeConfig.slug}/categories/men`,
            },
            {
                image: getBannerImage(storeConfig, 'hero_slide_3', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop'),
                badge: layoutConfig?.hero?.showBadges
                    ? (isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.badge ? layoutConfig.text.hero.slides[2].badge : getLayoutText(storeConfig, 'common.limited', 'Limited Edition'))
                    : undefined,
                title: isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.title ? layoutConfig.text.hero.slides[2].title : getLayoutText(storeConfig, 'hero.slide3.title', 'Premium Quality'),
                description: isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.description ? layoutConfig.text.hero.slides[2].description : getLayoutText(storeConfig, 'hero.slide3.description', 'Crafted with attention to detail and premium materials for lasting elegance.'),
                primaryButtonText: isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.primaryButton ? layoutConfig.text.hero.slides[2].primaryButton : getLayoutText(storeConfig, 'common.shopNow', 'Shop Now'),
                primaryButtonLink: `/${storeConfig.slug}/products`,
                secondaryButtonText: isRealStore && layoutConfig?.text?.hero?.slides?.[2]?.secondaryButton ? layoutConfig.text.hero.slides[2].secondaryButton : undefined,
                secondaryButtonLink: `/${storeConfig.slug}/categories/men`,
            },
        ];
    }
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(layoutConfig?.hero?.autoPlay !== false);
    const [autoPlayResumeTime, setAutoPlayResumeTime] = useState(null);
    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || layoutConfig?.hero?.autoPlay === false || heroSlides.length === 0)
            return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(interval);
    }, [isAutoPlaying, heroSlides.length, layoutConfig?.hero?.autoPlay]);
    // Handle auto-play resumption
    useEffect(() => {
        if (autoPlayResumeTime === null)
            return;
        const timeout = setTimeout(() => {
            setIsAutoPlaying(true);
            setAutoPlayResumeTime(null);
        }, autoPlayResumeTime);
        return () => clearTimeout(timeout);
    }, [autoPlayResumeTime]);
    const goToSlide = (index) => {
        if (heroSlides.length === 0)
            return;
        setCurrentSlide(Math.min(index, heroSlides.length - 1));
        setIsAutoPlaying(false);
        // Resume auto-play after 10 seconds
        if (layoutConfig?.hero?.autoPlay !== false) {
            setAutoPlayResumeTime(10000);
        }
    };
    const nextSlide = () => {
        if (heroSlides.length === 0)
            return;
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsAutoPlaying(false);
        if (layoutConfig?.hero?.autoPlay !== false) {
            setAutoPlayResumeTime(10000);
        }
    };
    const prevSlide = () => {
        if (heroSlides.length === 0)
            return;
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
        setIsAutoPlaying(false);
        if (layoutConfig?.hero?.autoPlay !== false) {
            setAutoPlayResumeTime(10000);
        }
    };
    // Determine grid layout - always use 2-column layout since we limit to 2 categories
    const getCategoryGridClass = () => {
        return 'grid-cols-1 md:grid-cols-2';
    };
    return (_jsxs("div", { className: "min-h-screen bg-white", children: [(layoutConfig?.sections?.hero?.show !== false || layoutConfig?.hero?.show !== false) && heroSlides.length > 0 && (_jsxs("section", { "data-section": "hero", className: "relative h-[85vh] w-full overflow-hidden", onMouseEnter: () => setIsAutoPlaying(false), onMouseLeave: () => layoutConfig?.hero?.autoPlay !== false && setIsAutoPlaying(true), children: [_jsx("div", { className: "relative h-full w-full", children: heroSlides.map((slide, index) => (_jsxs("div", { className: `absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`, children: [_jsxs("div", { className: "absolute inset-0", children: [_jsx(Image, { src: slide.image, alt: slide.title, fill: true, className: "object-cover", unoptimized: true }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" })] }), _jsx("div", { className: "absolute inset-0 flex items-center z-20", children: _jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: `max-w-3xl text-white space-y-8 transition-all duration-1000 ${index === currentSlide
                                                ? 'opacity-100 translate-y-0'
                                                : 'opacity-0 translate-y-8'}`, children: [_jsxs("div", { children: [slide.badge && (_jsx("span", { className: "inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium border border-white/30 uppercase tracking-wider mb-4", children: slide.badge })), _jsx("h1", { className: "text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-4", children: slide.title }), _jsx("div", { className: "h-1 w-24 bg-white/80 rounded-full" })] }), _jsx("p", { className: "text-xl sm:text-2xl text-gray-100 font-light leading-relaxed max-w-lg", children: slide.description }), _jsxs("div", { className: "flex flex-wrap gap-4 pt-4", children: [layoutConfig?.sections?.hero?.showCTA !== false &&
                                                            layoutConfig?.hero?.showCTA !== false &&
                                                            slide.primaryButtonText &&
                                                            slide.primaryButtonText.trim() !== '' && (_jsx(Link, { href: slide.primaryButtonLink, children: _jsx(Button, { size: "lg", className: "h-14 px-10 text-base rounded-full bg-white text-black hover:bg-gray-100 transition-all duration-300 hover:scale-105 font-semibold", children: slide.primaryButtonText }) })), (layoutConfig?.sections?.hero?.showSecondaryCTA !== false || layoutConfig?.hero?.showSecondaryCTA !== false) &&
                                                            slide.secondaryButtonText &&
                                                            slide.secondaryButtonText.trim() !== '' &&
                                                            slide.secondaryButtonLink && (_jsx(Link, { href: slide.secondaryButtonLink, children: _jsx(Button, { size: "lg", variant: "outline", className: "h-14 px-10 text-base rounded-full border-white bg-transparent text-white hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-300", style: { color: 'white' }, children: slide.secondaryButtonText }) }))] })] }) }) })] }, index))) }), _jsx("button", { onClick: prevSlide, className: "absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-300 hover:scale-110 group", "aria-label": "Previous slide", children: _jsx(ChevronLeft, { className: "h-6 w-6 text-white group-hover:text-white" }) }), _jsx("button", { onClick: nextSlide, className: "absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-300 hover:scale-110 group", "aria-label": "Next slide", children: _jsx(ChevronRight, { className: "h-6 w-6 text-white group-hover:text-white" }) }), _jsx("div", { className: "absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2", children: heroSlides.map((_, index) => (_jsx("button", { onClick: () => goToSlide(index), className: `transition-all duration-300 rounded-full ${index === currentSlide
                                ? 'w-12 h-2 bg-white'
                                : 'w-2 h-2 bg-white/50 hover:bg-white/75'}`, "aria-label": `Go to slide ${index + 1}` }, index))) })] })), layoutConfig?.sections?.features?.show !== false && (_jsx("section", { "data-section": "about", className: "py-8 bg-gray-50 border-b border-gray-100", children: _jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200", children: (layoutConfig?.sections?.features?.items || [
                            { icon: 'Truck', title: 'Free Shipping', description: `On all orders over $${storeConfig.settings.freeShippingThreshold}` },
                            { icon: 'RefreshCw', title: 'Free Returns', description: '30-day money back guarantee' },
                            { icon: 'ShieldCheck', title: 'Secure Payment', description: '100% secure checkout process' }
                        ]).map((item, idx) => {
                            return (_jsxs("div", { className: "flex flex-col items-center justify-center gap-2 p-4", children: [_jsx(DynamicIcon, { name: item.icon, className: "h-6 w-6 text-gray-900" }), _jsx("h3", { className: "font-semibold text-gray-900", children: item.title }), _jsx("p", { className: "text-sm text-gray-500", children: item.description })] }, idx));
                        }) }) }) })), layoutConfig?.sections?.categories?.show !== false && (_jsx("section", { "data-section": "categories", className: "py-12 md:py-20 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "container mx-auto max-w-7xl", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-3 tracking-tight", children: getLayoutText(storeConfig, 'sections.categories.title', 'Shop by Category') }), _jsx("p", { className: "text-gray-500 text-lg", children: getLayoutText(storeConfig, 'sections.categories.subtitle', 'Curated collections for every style') })] }), layoutConfig?.sections?.categories?.showViewAll !== false && (_jsxs(Link, { href: `/${storeConfig.slug}/categories`, className: "group flex items-center gap-2 text-sm font-medium hover:text-gray-600 transition-colors pb-1 border-b border-transparent hover:border-gray-300", children: [getLayoutText(storeConfig, 'sections.categories.viewAll', 'View All Categories'), " ", _jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })] }))] }), _jsx("div", { className: `grid ${getCategoryGridClass()} gap-6`, children: displayedCategories.map((category) => {
                                // Validate category image - handle all formats
                                const extractCategoryImage = (image) => {
                                    if (!image)
                                        return undefined;
                                    // If already a string, validate
                                    if (typeof image === 'string') {
                                        const trimmed = image.trim();
                                        return trimmed.length > 0 ? trimmed : undefined;
                                    }
                                    // If object, extract url
                                    if (typeof image === 'object' && image !== null) {
                                        if ('url' in image && image.url) {
                                            const url = typeof image.url === 'string' ? image.url.trim() : String(image.url).trim();
                                            return url.length > 0 ? url : undefined;
                                        }
                                    }
                                    // If array, take first valid item
                                    if (Array.isArray(image) && image.length > 0) {
                                        return extractCategoryImage(image[0]);
                                    }
                                    return undefined;
                                };
                                const categoryImage = extractCategoryImage(category.image);
                                return (_jsxs(Link, { href: `/${storeConfig.slug}/categories/${category.slug}`, className: `group relative overflow-hidden rounded-2xl aspect-[3/4]`, children: [_jsxs("div", { className: "absolute inset-0 bg-gray-200", children: [_jsx(ImageWithFallback, { src: categoryImage, alt: category.name, className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110", skeletonAspectRatio: "auto" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" })] }), _jsxs("div", { className: "absolute inset-0 flex flex-col justify-end p-8", children: [_jsx("h3", { className: "text-2xl font-bold text-white mb-2 transform translate-y-0 transition-transform duration-300", children: category.name }), _jsx("div", { className: "h-0.5 w-12 bg-white/0 group-hover:bg-white/100 transition-all duration-500 mb-4" }), _jsxs("span", { className: "inline-flex items-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300", children: [getLayoutText(storeConfig, 'common.shopNow', 'Shop Now'), " ", _jsx(ArrowRight, { className: "ml-2 h-4 w-4" })] })] })] }, category.id));
                            }) })] }) })), layoutConfig?.sections?.marketing?.editorial?.show !== false && (_jsx("section", { "data-section": "editorial", className: "py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50", children: _jsx("div", { className: "container mx-auto max-w-7xl", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "aspect-[4/5] rounded-lg overflow-hidden relative", children: _jsx(ImageWithFallback, { src: layoutConfig?.sections?.marketing?.editorial?.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop', alt: "Editorial Lookbook", className: "w-full h-full object-cover", skeletonAspectRatio: "4/5" }) }), (layoutConfig?.sections?.marketing?.editorial?.detailImage) && (_jsx("div", { className: "absolute w-48 h-48 bg-white p-4 shadow-xl rounded-lg hidden md:block z-20 animate-fade-in-up", style: { bottom: '-2rem', right: '-2rem', animationDelay: '0.2s' }, children: _jsx("div", { className: "w-full h-full relative", children: _jsx(ImageWithFallback, { src: layoutConfig.sections.marketing.editorial.detailImage, alt: "Detail Shot", className: "w-full h-full object-cover rounded", skeletonAspectRatio: "square" }) }) }))] }), _jsxs("div", { className: "space-y-8", children: [_jsx("div", { className: "flex flex-col gap-2", children: _jsx("span", { className: "text-sm font-bold tracking-widest text-gray-500 uppercase", children: layoutConfig?.sections?.marketing?.editorial?.badgeText || "Lookbook" }) }), _jsx("h2", { className: "text-4xl md:text-5xl font-bold tracking-tight leading-tight text-gray-900", children: layoutConfig?.sections?.marketing?.editorial?.title ? (layoutConfig.sections.marketing.editorial.title.split('\n').map((line, idx, arr) => (_jsxs("span", { children: [line, idx < arr.length - 1 && _jsx("br", {})] }, idx)))) : (_jsxs(_Fragment, { children: ["Redefining Modern ", _jsx("br", {}), _jsx("span", { className: "italic font-serif", children: "Elegance" })] })) }), _jsx("p", { className: "text-lg text-gray-600 leading-relaxed", children: layoutConfig?.sections?.marketing?.editorial?.description || "Explore our latest editorial featuring timeless pieces crafted for the contemporary wardrobe. From essential basics to statement outwear, find your signature look." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 pt-4", children: [layoutConfig?.sections?.marketing?.editorial?.primaryButton?.text && (_jsx(Link, { href: layoutConfig.sections.marketing.editorial.primaryButton.link?.startsWith('/')
                                                    ? `/${storeConfig.slug}${layoutConfig.sections.marketing.editorial.primaryButton.link}`
                                                    : (layoutConfig.sections.marketing.editorial.primaryButton.link || `/${storeConfig.slug}/style-guide`), children: _jsx(Button, { className: "rounded-full px-8 py-6 bg-gray-900 hover:bg-black text-white transition-all", children: layoutConfig.sections.marketing.editorial.primaryButton.text }) })), layoutConfig?.sections?.marketing?.editorial?.secondaryButton?.text && (_jsx(Link, { href: layoutConfig.sections.marketing.editorial.secondaryButton.link?.startsWith('/')
                                                    ? `/${storeConfig.slug}${layoutConfig.sections.marketing.editorial.secondaryButton.link}`
                                                    : (layoutConfig.sections.marketing.editorial.secondaryButton.link || `/${storeConfig.slug}/about`), children: _jsx(Button, { variant: "outline", className: "rounded-full px-8 py-6 border-gray-300 hover:bg-white hover:border-gray-900 transition-all", children: layoutConfig.sections.marketing.editorial.secondaryButton.text }) }))] })] })] }) }) })), layoutConfig?.sections?.featuredProducts?.show !== false && (_jsx("section", { "data-section": "featuredProducts", className: "py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white", children: _jsxs("div", { className: "container mx-auto max-w-7xl", children: [_jsxs("div", { className: "text-center max-w-2xl mx-auto mb-10 md:mb-16", children: [_jsx("span", { className: "text-sm font-bold tracking-widest text-gray-500 uppercase mb-3 block", children: layoutConfig?.sections?.featuredProducts?.eyebrow || "Curated For You" }), _jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4 tracking-tight", children: layoutConfig?.sections?.featuredProducts?.title || getLayoutText(storeConfig, 'sections.featuredProducts.title', 'Trending Now') }), _jsx("div", { className: "h-1 w-20 bg-gray-900 mx-auto mb-6" }), _jsx("p", { className: "text-gray-600 text-lg", children: getLayoutText(storeConfig, 'sections.featuredProducts.subtitle', 'Discover the latest trends and essential pieces that define this season\'s style.') })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8", children: products.slice(0, 4).map((product) => {
                                // Comprehensive image extraction - handles all formats
                                const extractProductImages = (images) => {
                                    if (!images)
                                        return [];
                                    // If already an array of strings, validate and return
                                    if (Array.isArray(images)) {
                                        const firstItem = images[0];
                                        if (typeof firstItem === 'string') {
                                            return images
                                                .filter((img) => typeof img === 'string' && img.trim().length > 0)
                                                .map((img) => img.trim());
                                        }
                                        // If array of objects, extract URLs
                                        if (firstItem && typeof firstItem === 'object' && firstItem !== null) {
                                            const result = [];
                                            for (const item of images) {
                                                if (!item)
                                                    continue;
                                                if (typeof item === 'object' && item !== null) {
                                                    // Check for url property
                                                    if ('url' in item && item.url) {
                                                        const url = typeof item.url === 'string' ? item.url.trim() : String(item.url).trim();
                                                        if (url.length > 0) {
                                                            result.push(url);
                                                        }
                                                    }
                                                    // Check for nested url
                                                    else if (item.url && typeof item.url === 'object' && 'url' in item.url) {
                                                        const url = typeof item.url.url === 'string' ? item.url.url.trim() : String(item.url.url).trim();
                                                        if (url.length > 0) {
                                                            result.push(url);
                                                        }
                                                    }
                                                }
                                                else if (typeof item === 'string') {
                                                    const trimmed = item.trim();
                                                    if (trimmed.length > 0) {
                                                        result.push(trimmed);
                                                    }
                                                }
                                            }
                                            return result;
                                        }
                                    }
                                    // Handle single object
                                    if (typeof images === 'object' && images !== null && !Array.isArray(images)) {
                                        if ('url' in images && images.url) {
                                            const url = typeof images.url === 'string' ? images.url.trim() : String(images.url).trim();
                                            return url.length > 0 ? [url] : [];
                                        }
                                    }
                                    // Handle single string
                                    if (typeof images === 'string') {
                                        const trimmed = images.trim();
                                        return trimmed.length > 0 ? [trimmed] : [];
                                    }
                                    return [];
                                };
                                const validImages = extractProductImages(product.images);
                                const firstImage = validImages.length > 0 ? validImages[0] : undefined;
                                return (_jsx("div", { className: "group", children: _jsxs(Link, { href: `/${storeConfig.slug}/products/${product.slug}`, children: [_jsxs("div", { className: "relative aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden mb-4", children: [_jsx(ImageWithFallback, { src: firstImage, alt: product.name, className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105", skeletonAspectRatio: "3/4" }), validImages[1] && (_jsx(ImageWithFallback, { src: validImages[1], alt: product.name, className: "absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500", skeletonAspectRatio: "3/4" })), _jsxs("div", { className: "hidden lg:flex absolute bottom-4 right-4 flex-col gap-2 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300", children: [storeConfig.features.wishlist && (_jsx(Button, { variant: "secondary", size: "icon", className: "bg-white hover:bg-black hover:text-white shadow-md rounded-full transition-colors", children: _jsx(Heart, { className: "h-4 w-4" }) })), _jsx(Button, { variant: "secondary", size: "icon", className: "bg-white hover:bg-black hover:text-white shadow-md rounded-full transition-colors", children: _jsx(ShoppingCart, { className: "h-4 w-4" }) })] }), _jsx(Button, { variant: "secondary", size: "icon", className: "lg:hidden absolute bottom-3 right-3 bg-white text-black h-10 w-10 rounded-full shadow-lg z-10 active:scale-95 transition-transform", children: _jsx(ShoppingCart, { className: "h-4 w-4" }) }), product.compareAtPrice && (_jsx("span", { className: "absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide", children: getLayoutText(storeConfig, 'common.sale', 'Sale') }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "font-semibold text-gray-900 group-hover:text-gray-600 transition-colors text-lg", children: product.name }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium text-gray-900", children: formatCurrency(product.price, product.currency || 'USD') }), product.compareAtPrice && (_jsx("span", { className: "text-sm text-gray-400 line-through", children: formatCurrency(product.compareAtPrice, product.currency || 'USD') }))] }), _jsx(ProductRating, { rating: product.rating, reviewCount: product.reviewCount, size: "sm", showReviewCount: false, className: "shrink-0" })] })] }) }, product.id));
                            }) }), layoutConfig?.sections?.featuredProducts?.showViewAll !== false && (_jsx("div", { className: "mt-16 text-center", children: _jsx(Link, { href: `/${storeConfig.slug}/products`, children: _jsx(Button, { variant: "outline", className: "rounded-full px-10 py-6 border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all text-base font-medium", children: getLayoutText(storeConfig, 'sections.featuredProducts.viewAll', 'View All Products') }) }) }))] }) }))] }));
}
