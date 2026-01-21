'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from '../../../components/ui/button';
import { Breadcrumbs } from '../../../components/ui/breadcrumbs';
import { Modal } from '../../../components/ui/modal';
import { ShoppingCart, Heart, Star, Truck, CheckCircle, ThumbsUp, User, Minus, Plus, Ruler, Share2, Info, ChevronDown } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../../lib/store-context';
import { useToast } from '../../../components/ui/toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { useAnalytics } from '../../../hooks/use-analytics';
import { customerService } from '../../../lib/services/customer.service';
import { GuestCheckoutModal } from '../../../components/ui/guest-checkout-modal';
import { getGuestUserInfo, saveGuestUserInfo } from '../../../lib/guest-user';
import { ProductCard } from '../../../components/ui/product-card';
import Image from 'next/image';
import { ImageWithFallback } from '../../../components/ui/image-with-fallback';
import { ButtonLoader } from '../../../components/ui/page-loader';
import { extractImageUrls } from '../../../lib/store-config-utils';
import { OutOfStockOverlay } from '../../../components/ui/out-of-stock-overlay';
import { cn, formatCurrency, filterActiveProducts } from '../../../lib/utils';
import { shippingService } from '../../../lib/services/shipping.service';
import { countries, getCountryByName, getCitiesByCountry } from '../../../lib/countries';
// Helper function to format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};
// Star Rating Component with half-star support
function StarRating({ rating, size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'h-3.5 w-3.5',
        md: 'h-4 w-4',
        lg: 'h-6 w-6',
    };
    const starSize = sizeClasses[size];
    return (_jsx("div", { className: `flex items-center gap-0.5 ${className}`, children: [...Array(5)].map((_, i) => {
            const starValue = i + 1;
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5 && fullStars === i;
            const isFull = starValue <= fullStars;
            const isHalf = hasHalfStar;
            return (_jsxs("div", { className: `relative inline-block ${sizeClasses[size]}`, children: [_jsx(Star, { className: `w-full h-full absolute inset-0 text-gray-200 fill-gray-200` }), isHalf && (_jsx("div", { className: "absolute inset-0", style: { clipPath: 'inset(0 50% 0 0)' }, children: _jsx(Star, { className: `w-full h-full text-gray-900 fill-gray-900` }) })), isFull && (_jsx(Star, { className: `w-full h-full absolute inset-0 text-gray-900 fill-gray-900` }))] }, i));
        }) }));
}
function ReviewCard({ review }) {
    return (_jsxs("div", { className: "border-b border-gray-100 pb-8 last:border-b-0 last:pb-0", children: [_jsx("div", { className: "flex items-start justify-between mb-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm overflow-hidden", children: [review.userAvatar ? (_jsx(Image, { src: review.userAvatar, alt: review.userName, fill: true, className: "w-full h-full object-cover", unoptimized: true })) : null, _jsx(User, { className: "h-6 w-6 text-gray-600", style: { display: review.userAvatar ? 'none' : 'flex' } })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "font-semibold text-gray-900", children: review.userName }), review.verified && (_jsx("span", { className: "text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-100", children: "Verified Purchase" }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(StarRating, { rating: review.rating, size: "sm" }), _jsx("span", { className: "text-xs text-gray-500", children: formatDate(review.date) })] })] })] }) }), review.title && (_jsx("h4", { className: "font-semibold text-gray-900 mb-3 text-lg", children: review.title })), _jsx("p", { className: "text-gray-700 leading-relaxed mb-4", children: review.comment }), review.images && review.images.length > 0 && (_jsx("div", { className: "flex gap-2 mb-4", children: review.images.map((img, idx) => (_jsx("div", { className: "relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200", children: _jsx(Image, { src: img, alt: `${review.userName}'s review image ${idx + 1}`, fill: true, className: "object-cover", unoptimized: true }) }, idx))) })), review.helpful !== undefined && (_jsx("div", { className: "flex items-center gap-4", children: _jsxs("button", { className: "flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors font-medium", children: [_jsx(ThumbsUp, { className: "h-4 w-4" }), _jsxs("span", { children: ["Helpful (", review.helpful, ")"] })] }) }))] }));
}
export function ProductDetailPage({ storeConfig, productSlug }) {
    const { addToCart, isCartLoading, toggleWishlist, isInWishlist, isWishlistLoading, setBuyNowItem } = useStore();
    const products = filterActiveProducts(storeConfig.products || []);
    const product = products.find(p => p.slug === productSlug);
    const { addToast } = useToast();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { trackEvent } = useAnalytics();
    // Related products logic
    const relatedProducts = useMemo(() => {
        if (!product)
            return [];
        return products
            .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
            .slice(0, 4);
    }, [product, products]);
    const handleShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: product?.name,
                    text: product?.description,
                    url: window.location.href,
                });
            }
            catch (error) {
                console.log('Error sharing:', error);
            }
        }
        else {
            // Fallback to copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                addToast('Link copied to clipboard!', 'success');
            }
            catch (err) {
                addToast('Failed to copy link', 'error');
            }
        }
    };
    const handleQuickView = (p) => {
        // Navigate to product page for now
        router.push(`/${storeConfig.slug}/products/${p.slug}`);
    };
    const handleWishlistClick = async () => {
        if (!product)
            return;
        if (isWishlistLoading) {
            return; // Prevent multiple clicks
        }
        try {
            const wasInWishlist = isInWishlist(product.id);
            await toggleWishlist(product.id);
            addToast(wasInWishlist
                ? `${product.name} removed from wishlist`
                : `${product.name} added to wishlist`, 'success');
        }
        catch (error) {
            console.error('Failed to toggle wishlist:', error);
            addToast('Failed to update wishlist', 'error');
        }
    };
    // Extract color and size variants
    const colorVariants = product?.variants?.filter(v => v.name === 'Color') || [];
    const sizeVariants = product?.variants?.filter(v => v.name === 'Size') || [];
    // Initialize state with defaults
    const [selectedImage, setSelectedImage] = useState(0);
    // Ensure selectedImage is within bounds when images change
    useEffect(() => {
        if (product && product.images && product.images.length > 0 && selectedImage >= product.images.length) {
            // Use setTimeout to avoid synchronous setState in effect
            const timer = setTimeout(() => setSelectedImage(0), 0);
            return () => clearTimeout(timer);
        }
    }, [product, selectedImage]);
    const [selectedColor, setSelectedColor] = useState(colorVariants.length > 0 ? colorVariants[0].value : null);
    const [selectedSize, setSelectedSize] = useState(sizeVariants.length > 0 ? sizeVariants[0].value : null);
    const [quantity, setQuantity] = useState(1);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
    // Shipping calculation state
    const [shippingAddress, setShippingAddress] = useState({
        country: '',
        city: '',
        zipCode: '',
    });
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    const [shippingMethods, setShippingMethods] = useState([]);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [shippingError, setShippingError] = useState(null);
    const [freeShippingEligible, setFreeShippingEligible] = useState(false);
    const [freeShippingThreshold, setFreeShippingThreshold] = useState(undefined);
    const handleSubmitReview = (e) => {
        e.preventDefault();
        // In a real app, this would submit to API
        addToast('Review submitted successfully!', 'success');
        setIsReviewModalOpen(false);
        setNewReview({ rating: 5, title: '', comment: '' });
    };
    if (!product) {
        return (_jsx("div", { className: "min-h-screen bg-white flex items-center justify-center p-8", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: "Product Not Found" }), _jsx("p", { className: "text-gray-600 mb-4", children: "The product you're looking for doesn't exist." })] }) }));
    }
    // Use SKU for display, fallback to generated SKU from slug if not available
    const displaySKU = product.sku || product.slug?.toUpperCase().replace(/-/g, '').substring(0, 12).padEnd(8, 'X') || 'N/A';
    // Build category breadcrumb path with all parent categories
    const buildCategoryPath = (categoryId) => {
        if (!categoryId)
            return [];
        const path = [];
        let currentCategoryId = categoryId;
        // Traverse up the parent chain
        while (currentCategoryId) {
            const category = storeConfig.categories.find(c => c.id === currentCategoryId);
            if (!category)
                break;
            path.unshift(category); // Add to beginning to maintain root-to-leaf order
            currentCategoryId = category.parentId || null;
        }
        return path;
    };
    // Get category path for breadcrumbs
    const categoryPath = product.categoryId ? buildCategoryPath(product.categoryId) : [];
    const directCategory = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1] : null;
    // Generate breadcrumbs with all parent categories
    const breadcrumbItems = [
        { label: storeConfig.name, href: `/${storeConfig.slug}` },
        // Add all parent categories
        ...categoryPath.map(cat => ({
            label: cat.name,
            href: `/${storeConfig.slug}/categories/${cat.slug || ''}`,
        })),
        // Add product name
        { label: product.name, href: `/${storeConfig.slug}/products/${product.slug}` },
    ];
    // Extract product images - product.images should already be string[] from transformation,
    // but handle edge cases where it might still be in object format
    // Use the comprehensive extraction utility from store-config-utils for consistency
    const productImages = (() => {
        // Debug: Log the raw product.images to understand its format
        if (process.env.NODE_ENV === 'development') {
            console.log('[ProductDetailPage] Raw product.images:', {
                productId: product.id,
                productName: product.name,
                images: product.images,
                imagesType: typeof product.images,
                imagesIsArray: Array.isArray(product.images),
                imagesLength: Array.isArray(product.images) ? product.images.length : 'N/A',
                firstItem: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'N/A',
                firstItemType: Array.isArray(product.images) && product.images.length > 0 ? typeof product.images[0] : 'N/A'
            });
        }
        // If already an array of strings (normal case after transformation)
        if (Array.isArray(product.images) && product.images.length > 0) {
            const firstItem = product.images[0];
            if (typeof firstItem === 'string') {
                const filtered = product.images.filter((img) => typeof img === 'string' && img.trim().length > 0);
                if (process.env.NODE_ENV === 'development') {
                    console.log('[ProductDetailPage] Using string array directly:', { count: filtered.length, firstImage: filtered[0]?.substring(0, 100) });
                }
                return filtered;
            }
            // If array but not strings, extract using utility
            if (process.env.NODE_ENV === 'development') {
                console.log('[ProductDetailPage] Array but not strings, using extractImageUrls');
            }
        }
        // Use the comprehensive extraction utility for any other format (objects, nested structures, etc.)
        const extracted = extractImageUrls(product.images);
        if (process.env.NODE_ENV === 'development') {
            console.log('[ProductDetailPage] Extracted using utility:', { count: extracted.length, firstImage: extracted[0]?.substring(0, 100) });
        }
        return extracted;
    })();
    // For gallery, use actual images only (don't duplicate to fill 5 slots)
    const displayImages = productImages.slice(0, 5);
    const hasMoreImages = productImages.length > 5;
    // Debug logging for images (can be removed in production)
    if (process.env.NODE_ENV === 'development') {
        if (productImages.length === 0) {
            console.warn(`[ProductDetailPage] Product "${product.name}" (${product.id}) has no valid images:`, {
                productId: product.id,
                productName: product.name,
                originalImages: product.images,
                originalType: typeof product.images,
                originalIsArray: Array.isArray(product.images),
                validImagesCount: productImages.length
            });
        }
        else {
            console.log(`[ProductDetailPage] Product "${product.name}" (${product.id}) images:`, {
                productId: product.id,
                validImagesCount: productImages.length,
                displayImagesCount: displayImages.length,
                firstImage: productImages[0]?.substring(0, 100)
            });
        }
    }
    // Color swatch mapping
    const colorSwatches = {
        'White': '#FFFFFF',
        'Black': '#000000',
        'Gray': '#808080',
        'Grey': '#808080',
        'Blue': '#3B82F6',
        'Red': '#EF4444',
        'Green': '#10B981',
        'Yellow': '#FBBF24',
        'Brown': '#92400E',
        'Navy': '#1E3A8A',
        'Beige': '#F5F5DC',
    };
    // Get reviews
    const reviews = product.reviews || [];
    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
    const hasMoreReviews = reviews.length > 3;
    // Out of stock check
    const isOutOfStock = !product.inStock;
    // Calculate rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
        const count = reviews.filter(r => r.rating === rating).length;
        return {
            rating,
            count,
            percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0,
        };
    });
    const handleAddToCart = () => {
        if (isOutOfStock) {
            addToast('This product is currently out of stock', 'error');
            return;
        }
        // Find the matching variation UUID based on selected attributes
        // Note: StoreProduct uses 'variants' not 'variations'
        let variationId;
        if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
            const matchingVariation = product.variants.find((variation) => {
                const attrs = variation.attributes || {};
                const colorMatch = !selectedColor || attrs.color === selectedColor;
                const sizeMatch = !selectedSize || attrs.size === selectedSize;
                return colorMatch && sizeMatch;
            });
            variationId = matchingVariation?.id;
        }
        // Fallback to composite string for backward compatibility if no variation found
        const variantId = variationId || (selectedColor || selectedSize
            ? [selectedColor, selectedSize].filter(Boolean).join(' / ')
            : undefined);
        addToCart(product, quantity, variantId);
        addToast(`${product.name} added to cart`, 'success');
    };
    const handleBuyNow = async () => {
        if (isOutOfStock) {
            addToast('This product is currently out of stock', 'error');
            return;
        }
        if (isBuyNowLoading || isCartLoading) {
            return; // Prevent multiple clicks
        }
        setIsBuyNowLoading(true);
        try {
            // Find the matching variation UUID based on selected attributes
            // Note: StoreProduct uses 'variants' not 'variations'
            let variationId;
            let variantName;
            if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
                const matchingVariation = product.variants.find((variation) => {
                    const attrs = variation.attributes || {};
                    const colorMatch = !selectedColor || attrs.color === selectedColor;
                    const sizeMatch = !selectedSize || attrs.size === selectedSize;
                    return colorMatch && sizeMatch;
                });
                variationId = matchingVariation?.id;
                variantName = matchingVariation?.name || matchingVariation?.value;
            }
            // Fallback to composite string for backward compatibility if no variation found
            const variantId = variationId || (selectedColor || selectedSize
                ? [selectedColor, selectedSize].filter(Boolean).join(' / ')
                : undefined);
            // Create buy now item (don't add to cart)
            const buyNowItemId = variantId ? `${product.id}-${variantId}` : product.id;
            const buyNowItem = {
                id: buyNowItemId,
                productId: product.id,
                quantity,
                variantId,
                variantName: variantName || variantId,
                price: product.price,
                product
            };
            // Set buy now item and navigate directly to checkout
            setBuyNowItem(buyNowItem);
            // Navigate to checkout page for direct checkout
            router.push(`/${storeConfig.slug}/checkout`);
        }
        catch (error) {
            console.error('Buy Now error:', error);
            addToast('Failed to proceed to checkout. Please try again.', 'error');
        }
        finally {
            setIsBuyNowLoading(false);
        }
    };
    const handleGuestInfoSubmit = (userInfo) => {
        // Save guest info to localStorage
        saveGuestUserInfo(userInfo);
        setShowGuestModal(false);
        // Note: This is now only used for other flows, not buy now
        // Buy now now redirects to checkout page
    };
    // Calculate shipping when address is provided
    const calculateShipping = async () => {
        if (!product || !shippingAddress.country || !shippingAddress.city) {
            setShippingError('Please provide country and city to calculate shipping');
            return;
        }
        setIsCalculatingShipping(true);
        setShippingError(null);
        try {
            const currency = product.currency || storeConfig.settings?.currency || 'USD';
            const subtotal = product.price * quantity;
            const result = await shippingService.calculateShipping({
                storeId: storeConfig.id,
                address: {
                    country: shippingAddress.country,
                    city: shippingAddress.city,
                    zipCode: shippingAddress.zipCode,
                },
                items: [{
                        productId: product.id,
                        quantity: quantity,
                    }],
                subtotal: subtotal,
                currency: currency,
            });
            setShippingMethods(result.methods || []);
            setFreeShippingEligible(result.freeShippingEligible || false);
            setFreeShippingThreshold(result.freeShippingThreshold);
        }
        catch (error) {
            console.error('Shipping calculation error:', error);
            setShippingError(error.message || 'Failed to calculate shipping. Please try again.');
            setShippingMethods([]);
        }
        finally {
            setIsCalculatingShipping(false);
        }
    };
    // Load saved addresses for authenticated users and auto-populate shipping address
    useEffect(() => {
        const loadAddresses = async () => {
            if (isAuthenticated) {
                try {
                    const addresses = await customerService.getAddresses();
                    setSavedAddresses(addresses);
                    // Auto-populate with default address or first address if available
                    if (addresses.length > 0) {
                        const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
                        if (defaultAddress) {
                            setShippingAddress({
                                country: defaultAddress.country || '',
                                city: defaultAddress.city || '',
                                zipCode: defaultAddress.zipCode || '',
                            });
                        }
                    }
                }
                catch (error) {
                    console.error('Failed to load addresses:', error);
                    // Don't show error toast - addresses are optional
                    // Users can still manually enter shipping address
                }
            }
        };
        loadAddresses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);
    // Auto-calculate shipping when address fields are filled (debounced)
    useEffect(() => {
        if (!shippingAddress.country || !shippingAddress.city || !product) {
            return;
        }
        const timer = setTimeout(() => {
            calculateShipping();
        }, 500); // Debounce 500ms
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shippingAddress.country, shippingAddress.city, shippingAddress.zipCode, quantity, product?.id, product?.price]);
    // Track product view
    useEffect(() => {
        if (product && storeConfig?.id) {
            trackEvent({
                eventType: 'product_view',
                metadata: {
                    productId: product.id,
                    productName: product.name,
                    categoryId: product.categoryId,
                    price: product.price,
                },
            });
        }
    }, [product?.id, storeConfig?.id, trackEvent]);
    return (_jsxs("div", { className: "min-h-screen bg-white", children: [_jsxs("div", { "data-content-ready": true, className: "container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl", children: [_jsx("div", { className: "mb-6", children: _jsx(Breadcrumbs, { items: breadcrumbItems }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20", children: [_jsxs("div", { className: "relative lg:sticky lg:top-24 self-start z-0", children: [_jsxs("div", { className: "relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 border border-gray-100 shadow-sm group", children: [_jsx(ImageWithFallback, { "data-product-image": true, src: displayImages[selectedImage] || displayImages[0] || productImages[0], alt: product.name, className: cn("w-full h-full object-cover transition-transform duration-300 group-hover:scale-105", isOutOfStock && "grayscale"), skeletonAspectRatio: "square" }), isOutOfStock && (_jsx(OutOfStockOverlay, { badgePosition: "center" }))] }), displayImages.length > 0 && (_jsxs("div", { className: "grid grid-cols-5 gap-2", children: [displayImages.map((image, index) => (_jsx("button", { onClick: () => setSelectedImage(Math.min(index, displayImages.length - 1)), className: `aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                    ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                                                    : 'border-gray-200 hover:border-gray-300'}`, children: _jsx(ImageWithFallback, { src: image, alt: `${product.name} view ${index + 1}`, className: cn("w-full h-full object-cover", isOutOfStock && "grayscale"), skeletonAspectRatio: "square" }) }, index))), hasMoreImages && (_jsxs("div", { className: "aspect-square rounded-lg border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-500 font-medium", children: ["+", productImages.length - 5, " more"] }))] }))] }), _jsxs("div", { className: "flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-semibold text-gray-700 uppercase tracking-wide", children: directCategory?.name || storeConfig.name }), _jsx("button", { onClick: handleShare, className: "text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100", title: "Share this product", children: _jsx(Share2, { className: "h-5 w-5" }) })] }), _jsx("h1", { "data-product-name": true, className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight tracking-tight", children: product.name }), _jsxs("p", { className: "text-sm text-gray-500 mb-6 font-mono", children: ["SKU: ", displaySKU] }), _jsx("div", { className: "mb-4 flex items-center gap-2", children: product.inStock ? (_jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800", children: [_jsx(CheckCircle, { className: "w-3 h-3 mr-1" }), "In Stock"] })) : (_jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800", children: [_jsx(Info, { className: "w-3 h-3 mr-1" }), "Out of Stock"] })) }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-baseline gap-4", children: [_jsx("span", { "data-product-price": true, className: "text-4xl lg:text-5xl font-bold text-gray-900", children: formatCurrency(product.price, product.currency || 'USD') }), product.compareAtPrice && (_jsx("span", { className: "text-2xl text-gray-500 line-through", children: formatCurrency(product.compareAtPrice, product.currency || 'USD') }))] }), product.compareAtPrice && (_jsxs("span", { className: "inline-block mt-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded", children: ["SAVE ", Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100), "%"] }))] }), colorVariants.length > 0 && (_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("span", { className: "text-sm font-semibold text-gray-900", children: "Color:" }), _jsx("span", { className: "text-sm text-gray-600 capitalize", children: selectedColor || colorVariants[0]?.value })] }), _jsx("div", { className: "flex gap-3", children: colorVariants.map((variant) => {
                                                    const colorValue = variant.value;
                                                    const swatchColor = colorSwatches[colorValue] || '#CCCCCC';
                                                    const isSelected = selectedColor === colorValue;
                                                    return (_jsx("button", { onClick: () => setSelectedColor(colorValue), className: `relative w-12 h-12 rounded-full border-2 transition-all ${isSelected
                                                            ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2 scale-105'
                                                            : 'border-gray-200 hover:border-gray-300'}`, style: { backgroundColor: swatchColor }, title: colorValue, children: isSelected && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx(CheckCircle, { className: `h-5 w-5 ${['White', 'Beige', 'Yellow'].includes(colorValue) ? 'text-gray-900' : 'text-white'} drop-shadow-sm` }) })) }, variant.id));
                                                }) })] })), sizeVariants.length > 0 && (_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-semibold text-gray-900", children: "Size:" }), _jsx("span", { className: "text-sm text-gray-600", children: selectedSize || 'Select Size' })] }), _jsxs("a", { href: `/${storeConfig.slug}/size-guide`, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 underline decoration-gray-400 underline-offset-4", children: [_jsx(Ruler, { className: "h-3.5 w-3.5" }), " Size guide"] })] }), _jsx("div", { className: "grid grid-cols-4 sm:grid-cols-5 gap-2.5", children: sizeVariants.map((variant) => {
                                                    const isSelected = selectedSize === variant.value;
                                                    return (_jsx("button", { onClick: () => setSelectedSize(variant.value), className: `px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${isSelected
                                                            ? 'bg-gray-900 text-white border-gray-900 shadow-md transform -translate-y-0.5'
                                                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`, children: variant.value }, variant.id));
                                                }) })] })), _jsxs("div", { className: "flex flex-col gap-4 mb-8", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-sm font-semibold text-gray-900", children: "Quantity" }), _jsxs("div", { className: "flex items-center border border-gray-300 rounded-lg", children: [_jsx("button", { className: "p-3 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50", onClick: () => setQuantity(Math.max(1, quantity - 1)), disabled: quantity <= 1, children: _jsx(Minus, { className: "h-4 w-4" }) }), _jsx("span", { className: "w-12 text-center font-semibold text-gray-900", children: quantity }), _jsx("button", { className: "p-3 text-gray-600 hover:bg-gray-100 rounded-r-lg", onClick: () => setQuantity(quantity + 1), children: _jsx(Plus, { className: "h-4 w-4" }) })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mt-2", children: [_jsx(Button, { "data-add-to-cart": true, size: "lg", onClick: handleAddToCart, disabled: isCartLoading || isOutOfStock, className: "flex-1 bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-full h-14 text-base font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: isCartLoading ? (_jsxs(_Fragment, { children: [_jsx(ButtonLoader, { className: "mr-2" }), "Adding..."] })) : (_jsxs(_Fragment, { children: [_jsx(ShoppingCart, { className: "h-5 w-5 mr-2" }), "Add to Cart"] })) }), _jsx(Button, { size: "lg", onClick: handleBuyNow, disabled: isOutOfStock || isBuyNowLoading || isCartLoading, className: "flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-full h-14 text-base font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: isBuyNowLoading || isCartLoading ? (_jsxs(_Fragment, { children: [_jsx(ButtonLoader, { className: "mr-2" }), "Adding..."] })) : ('Buy Now') }), storeConfig.features.wishlist && (_jsx(Button, { variant: "outline", size: "lg", onClick: handleWishlistClick, disabled: isWishlistLoading || !product, className: cn("h-14 w-14 rounded-full border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed", product && isInWishlist(product.id)
                                                            ? "border-red-500 bg-red-50 text-red-500 hover:bg-red-100"
                                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"), children: isWishlistLoading ? (_jsx(ButtonLoader, { className: "h-5 w-5" })) : (_jsx(Heart, { className: cn("h-5 w-5", product && isInWishlist(product.id) && "fill-current") })) }))] })] }), _jsxs("div", { className: "mb-8 border-t border-b border-gray-100 py-6", children: [_jsxs("h3", { className: "font-bold text-gray-900 flex items-center gap-2 text-sm mb-4 uppercase tracking-wider", children: [_jsx(Truck, { className: "h-4 w-4" }), " Delivery Information"] }), _jsxs("div", { className: "mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200", children: [_jsx("p", { className: "text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider", children: "Calculate Shipping" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-gray-600 mb-1 block", children: "Country" }), _jsxs("div", { className: "relative", children: [_jsxs("button", { type: "button", onClick: () => setIsCountryDropdownOpen(!isCountryDropdownOpen), className: cn("w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-medium flex items-center justify-between text-left"), children: [_jsx("span", { className: "flex items-center gap-2", children: (() => {
                                                                                            const selectedCountry = getCountryByName(shippingAddress.country);
                                                                                            return selectedCountry ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-base", children: selectedCountry.flag }), _jsx("span", { children: selectedCountry.name })] })) : (_jsx("span", { className: "text-gray-400", children: "Select country" }));
                                                                                        })() }), _jsx(ChevronDown, { className: cn("w-4 h-4 text-gray-400 transition-transform", isCountryDropdownOpen && "transform rotate-180") })] }), isCountryDropdownOpen && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-10", onClick: () => setIsCountryDropdownOpen(false) }), _jsx("div", { className: "absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto", children: countries.map((country) => (_jsxs("button", { type: "button", onClick: () => {
                                                                                                setShippingAddress({ ...shippingAddress, country: country.name, city: '' }); // Clear city when country changes
                                                                                                setIsCountryDropdownOpen(false);
                                                                                                setIsCityDropdownOpen(false);
                                                                                            }, className: cn("w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-50 transition-colors", shippingAddress.country === country.name && "bg-gray-50 font-medium"), children: [_jsx("span", { className: "text-base", children: country.flag }), _jsx("span", { children: country.name })] }, country.code))) })] }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-gray-600 mb-1 block", children: "City" }), _jsxs("div", { className: "relative", children: [_jsxs("button", { type: "button", onClick: () => {
                                                                                    if (shippingAddress.country) {
                                                                                        setIsCityDropdownOpen(!isCityDropdownOpen);
                                                                                    }
                                                                                    else {
                                                                                        addToast('Please select a country first', 'error');
                                                                                    }
                                                                                }, disabled: !shippingAddress.country, className: cn("w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-medium flex items-center justify-between text-left", !shippingAddress.country && "opacity-50 cursor-not-allowed"), children: [_jsx("span", { className: shippingAddress.city ? "text-gray-900" : "text-gray-400", children: shippingAddress.city || 'Select city' }), _jsx(ChevronDown, { className: cn("w-4 h-4 text-gray-400 transition-transform", isCityDropdownOpen && "transform rotate-180") })] }), isCityDropdownOpen && shippingAddress.country && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-10", onClick: () => setIsCityDropdownOpen(false) }), _jsx("div", { className: "absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto", children: getCitiesByCountry(shippingAddress.country).length > 0 ? (getCitiesByCountry(shippingAddress.country).map((city) => (_jsx("button", { type: "button", onClick: () => {
                                                                                                setShippingAddress({ ...shippingAddress, city });
                                                                                                setIsCityDropdownOpen(false);
                                                                                            }, className: cn("w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors", shippingAddress.city === city && "bg-gray-50 font-medium"), children: city }, city)))) : (_jsx("div", { className: "px-3 py-2 text-sm text-gray-500", children: "No cities available for this country" })) })] }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-gray-600 mb-1 block", children: "Zip/Postal Code" }), _jsx("input", { type: "text", placeholder: "Optional", value: shippingAddress.zipCode, onChange: (e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" })] })] }), shippingError && (_jsx("p", { className: "text-xs text-red-600 mt-2", children: shippingError }))] }), freeShippingThreshold !== undefined && !freeShippingEligible && (_jsxs("div", { className: "mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg", children: [_jsxs("p", { className: "text-xs font-medium text-blue-900 mb-1", children: ["Spend ", formatCurrency(freeShippingThreshold - (product.price * quantity), product.currency || storeConfig.settings?.currency || 'USD'), " more for free shipping!"] }), _jsx("div", { className: "w-full bg-blue-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all", style: {
                                                                width: `${Math.min(100, ((product.price * quantity) / freeShippingThreshold) * 100)}%`,
                                                            } }) })] })), isCalculatingShipping ? (_jsx("div", { className: "flex items-center justify-center p-8", children: _jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" }), _jsx("span", { className: "text-sm font-medium", children: "Calculating shipping..." })] }) })) : shippingMethods.length > 0 ? (_jsx("div", { className: "space-y-0 divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden", children: shippingMethods.map((method, index) => (_jsxs("div", { className: cn("flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors group", freeShippingEligible && method.cost === 0 && "bg-green-50 border-green-200"), children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: cn("p-2 rounded-full group-hover:bg-white transition-colors border", freeShippingEligible && method.cost === 0
                                                                        ? "bg-green-100 border-green-300"
                                                                        : "bg-gray-50 border-gray-100"), children: freeShippingEligible && method.cost === 0 ? (_jsx(CheckCircle, { className: "h-4 w-4 text-green-700" })) : (_jsx(Truck, { className: "h-4 w-4 text-gray-900" })) }), _jsxs("div", { children: [_jsxs("p", { className: "font-bold text-gray-900 text-sm", children: [method.name, freeShippingEligible && method.cost === 0 && (_jsx("span", { className: "ml-2 text-xs font-normal text-green-700 bg-green-100 px-2 py-0.5 rounded-full", children: "FREE" }))] }), _jsx("p", { className: "text-[11px] text-gray-500 font-medium mt-0.5", children: method.description || method.estimatedDays
                                                                                ? `${method.estimatedDaysMin || method.estimatedDays}-${method.estimatedDaysMax || method.estimatedDays} business days`
                                                                                : 'Delivery estimate available' })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "font-bold text-gray-900 text-sm", children: freeShippingEligible && method.cost === 0
                                                                        ? 'FREE'
                                                                        : formatCurrency(method.cost, product.currency || storeConfig.settings?.currency || 'USD') }), method.estimatedDays && (_jsx("p", { className: "text-[11px] text-gray-500 font-medium mt-0.5", children: method.estimatedDaysMin && method.estimatedDaysMax
                                                                        ? `${method.estimatedDaysMin}-${method.estimatedDaysMax} days`
                                                                        : `${method.estimatedDays} days` }))] })] }, method.code || index))) })) : shippingAddress.country && shippingAddress.city ? (_jsx("div", { className: "p-4 bg-gray-50 border border-gray-200 rounded-lg text-center", children: _jsx("p", { className: "text-sm text-gray-600", children: "No shipping methods available for this location." }) })) : (_jsx("div", { className: "p-4 bg-gray-50 border border-gray-200 rounded-lg text-center", children: _jsx("p", { className: "text-sm text-gray-600", children: "Enter your address above to see shipping options." }) }))] }), product.description && (_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Description" }), _jsxs("div", { className: "prose prose-sm max-w-none text-gray-600 leading-relaxed", children: [_jsx("p", { children: product.description }), _jsxs("ul", { className: "list-disc pl-5 space-y-1 mt-2", children: [_jsx("li", { children: "Premium quality material" }), _jsx("li", { children: "Comfortable fit for all-day wear" }), _jsx("li", { children: "Durable stitching and finish" })] })] })] })), product.specifications && Object.keys(product.specifications).length > 0 && (_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Specifications" }), _jsx("dl", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4", children: Object.entries(product.specifications).map(([key, value]) => (_jsxs("div", { className: "flex flex-col p-3 bg-gray-50 rounded-lg", children: [_jsx("dt", { className: "text-xs text-gray-500 font-medium uppercase tracking-wider mb-1", children: key }), _jsx("dd", { className: "text-sm font-bold text-gray-900", children: value })] }, key))) })] }))] })] }), _jsx("div", { className: "mt-20 pt-16 border-t border-gray-200", children: _jsxs("div", { className: "max-w-4xl", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-2xl lg:text-3xl font-bold text-gray-900 mb-4", children: "Customer Reviews" }), product.reviewCount && product.reviewCount > 0 && product.rating && product.rating > 0 ? (_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(StarRating, { rating: typeof product.rating === 'number' ? product.rating : Number(product.rating) || 0, size: "lg" }), _jsx("span", { className: "text-2xl font-bold text-gray-900", children: Number(product.rating).toFixed(1) }), _jsx("span", { className: "text-lg text-gray-500", children: "out of 5" })] }), _jsx("span", { className: "text-gray-300", children: "|" }), _jsxs("span", { className: "text-lg text-gray-600", children: [product.reviewCount, " ", product.reviewCount === 1 ? 'review' : 'reviews'] })] })) : (_jsx("div", { className: "text-gray-500", children: _jsx("p", { className: "text-base", children: "Be the first to review this product" }) }))] }), _jsx(Button, { onClick: () => setIsReviewModalOpen(true), className: "rounded-full shrink-0 bg-gray-900 hover:bg-gray-800 text-white", children: product.reviewCount && product.reviewCount > 0 ? 'Write a Review' : 'Be the First to Review' })] }), ratingDistribution.some(r => r.count > 0) && (_jsxs("div", { className: "mb-10 p-6 bg-gray-50 rounded-xl border border-gray-100", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-5", children: "Rating Breakdown" }), _jsx("div", { className: "space-y-3", children: ratingDistribution.map(({ rating, count, percentage }) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-1.5 w-20", children: [_jsx("span", { className: "text-sm font-semibold text-gray-900", children: rating }), _jsx(Star, { className: "h-4 w-4 fill-gray-900 text-gray-900" })] }), _jsx("div", { className: "flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-gray-700 to-gray-900 rounded-full transition-all duration-500", style: { width: `${percentage}%` } }) }), _jsx("span", { className: "text-sm font-medium text-gray-700 w-12 text-right", children: count })] }, rating))) })] })), reviews.length > 0 ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "space-y-6", children: displayedReviews.map((review) => (_jsx(ReviewCard, { review: review }, review.id))) }), hasMoreReviews && !showAllReviews && (_jsx("div", { className: "mt-8 text-center", children: _jsxs(Button, { variant: "outline", onClick: () => setShowAllReviews(true), className: "px-8 rounded-full h-12 border-gray-300", children: ["Show All ", reviews.length, " Reviews"] }) }))] })) : (_jsxs("div", { className: "text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300", children: [_jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm mb-4", children: _jsx(Star, { className: "h-6 w-6 text-gray-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No Reviews Yet" }), _jsx("p", { className: "text-gray-500 max-w-sm mx-auto mb-6", children: "Be the first to review this product and help other customers make informed decisions." }), _jsx(Button, { onClick: () => setIsReviewModalOpen(true), className: "bg-gray-900 hover:bg-gray-800 text-white", children: "Write the First Review" })] }))] }) }), relatedProducts.length > 0 && (_jsxs("div", { className: "mt-20 pt-16 border-t border-gray-200", children: [_jsx("h2", { className: "text-2xl lg:text-3xl font-bold text-gray-900 mb-8", children: "You Might Also Like" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: relatedProducts.map((relatedProduct) => (_jsx("div", { className: "h-[400px]", children: _jsx(ProductCard, { product: relatedProduct, storeSlug: storeConfig.slug, onAddToCart: (p) => addToCart(p, 1), onQuickView: handleQuickView, className: "h-full" }) }, relatedProduct.id))) })] }))] }), _jsx(Modal, { isOpen: isReviewModalOpen, onClose: () => setIsReviewModalOpen(false), title: "Write a Review", children: _jsxs("form", { onSubmit: handleSubmitReview, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Rating" }), _jsxs("div", { className: "flex items-center gap-1", children: [[1, 2, 3, 4, 5].map((star) => (_jsxs("div", { className: "relative group", children: [_jsx("button", { type: "button", onClick: () => setNewReview({ ...newReview, rating: star - 0.5 }), className: "absolute top-0 left-0 w-1/2 h-full z-20 focus:outline-none", title: `${star - 0.5} stars` }), _jsx("button", { type: "button", onClick: () => setNewReview({ ...newReview, rating: star }), className: "absolute top-0 right-0 w-1/2 h-full z-20 focus:outline-none", title: `${star} stars` }), _jsxs("div", { className: "relative pointer-events-none transition-transform group-hover:scale-110", children: [_jsx(Star, { className: "h-8 w-8 text-gray-200 fill-gray-200" }), newReview.rating >= star - 0.5 && (_jsx("div", { className: "absolute inset-0 overflow-hidden", style: { width: newReview.rating === star - 0.5 ? '50%' : '100%' }, children: _jsx(Star, { className: "h-8 w-8 text-gray-900 fill-gray-900" }) }))] })] }, star))), _jsx("span", { className: "ml-3 text-lg font-medium text-gray-900 w-12", children: newReview.rating })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700 mb-1", children: "Review Title" }), _jsx("input", { type: "text", id: "title", required: true, className: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black", placeholder: "Summarize your thoughts", value: newReview.title, onChange: (e) => setNewReview({ ...newReview, title: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "comment", className: "block text-sm font-medium text-gray-700 mb-1", children: "Review" }), _jsx("textarea", { id: "comment", required: true, rows: 4, className: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black", placeholder: "What did you like or dislike?", value: newReview.comment, onChange: (e) => setNewReview({ ...newReview, comment: e.target.value }) })] }), _jsxs("div", { className: "pt-4 flex justify-end gap-3", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => setIsReviewModalOpen(false), children: "Cancel" }), _jsx(Button, { type: "submit", className: "bg-black text-white hover:bg-gray-800", children: "Submit Review" })] })] }) }), _jsx(GuestCheckoutModal, { isOpen: showGuestModal, onClose: () => setShowGuestModal(false), onSubmit: handleGuestInfoSubmit, initialData: getGuestUserInfo() || undefined })] }));
}
