'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from '../../../components/ui/button';
import { Breadcrumbs } from '../../../components/ui/breadcrumbs';
import { Play, FileText, Headphones, Lock, Star, CheckCircle, Clock, Download, Share2, Heart, ArrowRight, BookOpen, Users, Award, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useStore } from '../../../lib/store-context';
import { useToast } from '../../../components/ui/toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import Image from 'next/image';
import { formatCurrency, filterActiveServices } from '../../../lib/utils';
import { getServiceImage } from '../../../lib/utils/asset-helpers';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '../../../lib/utils';
export function ServiceDetailPage({ storeConfig, serviceSlug }) {
    const services = filterActiveServices(storeConfig.services || []);
    const service = services.find(s => s.slug === serviceSlug);
    const { addToCart, isCartLoading, toggleWishlist, isInWishlist, isWishlistLoading, cart } = useStore();
    const { addToast } = useToast();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [selectedTab, setSelectedTab] = useState('overview');
    const [isPlaying, setIsPlaying] = useState(false);
    const hasAccess = useMemo(() => {
        if (service?.accessLevel === 'free' || service?.price === 0)
            return true;
        // In a real app, we'd check if the user has purchased this specific item or has a subscription
        // For this demo, let's assume they have access if they are authenticated
        return isAuthenticated;
    }, [service, isAuthenticated]);
    // Handle playing video/audio
    const handlePlay = () => {
        if (!hasAccess) {
            handleAddToCart();
            return;
        }
        setIsPlaying(true);
    };
    // Related services
    const relatedServices = useMemo(() => {
        if (!service)
            return [];
        return services
            .filter(s => s.categoryId === service.categoryId && s.id !== service.id)
            .slice(0, 4);
    }, [service, services]);
    if (!service) {
        return (_jsx("div", { className: "min-h-screen bg-white flex items-center justify-center p-8", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: "Content Not Found" }), _jsx("p", { className: "text-gray-600 mb-4", children: "The content you're looking for doesn't exist." }), _jsx(Link, { href: `/${storeConfig.slug}/services`, children: _jsx(Button, { children: "Browse All Content" }) })] }) }));
    }
    // Determine content type
    let TypeIcon = Play;
    let typeLabel = "Video Course";
    let contentTypeColor = "bg-blue-500";
    if (service.contentType === 'audio') {
        TypeIcon = Headphones;
        typeLabel = "Audiobook";
        contentTypeColor = "bg-purple-500";
    }
    else if (service.contentType === 'pdf') {
        TypeIcon = FileText;
        typeLabel = "PDF Guide";
        contentTypeColor = "bg-green-500";
    }
    const isLocked = service.accessLevel === 'subscription' || service.accessLevel === 'paid';
    const isFree = service.accessLevel === 'free' || service.price === 0;
    // Breadcrumbs
    const category = storeConfig.categories.find(c => c.id === service.categoryId);
    const baseSlug = storeConfig.slug.startsWith('demo/') ? storeConfig.slug : `/${storeConfig.slug}`;
    const breadcrumbItems = [
        { label: storeConfig.name, href: baseSlug.startsWith('/') ? baseSlug : `/${baseSlug}` },
        { label: 'Services', href: `${baseSlug.startsWith('/') ? baseSlug : '/' + baseSlug}/services` },
        ...(category ? [{ label: category.name, href: `${baseSlug.startsWith('/') ? baseSlug : '/' + baseSlug}/categories/${category.slug}` }] : []),
        { label: service.name, href: `${baseSlug.startsWith('/') ? baseSlug : '/' + baseSlug}/services/${service.slug}` },
    ];
    const handleAddToCart = () => {
        // For services, we add them to cart similar to products
        addToCart(service, 1);
        addToast(`${service.name} added to cart`, 'success');
    };
    const handleWishlistClick = async () => {
        if (isWishlistLoading)
            return;
        try {
            const wasInWishlist = isInWishlist(service.id);
            await toggleWishlist(service.id);
            addToast(wasInWishlist
                ? `${service.name} removed from wishlist`
                : `${service.name} added to wishlist`, 'success');
        }
        catch (error) {
            console.error('Failed to toggle wishlist:', error);
            addToast('Failed to update wishlist', 'error');
        }
    };
    const handleShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: service.name,
                    text: service.description,
                    url: window.location.href,
                });
            }
            catch (error) {
                console.log('Error sharing:', error);
            }
        }
        else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                addToast('Link copied to clipboard!', 'success');
            }
            catch (err) {
                addToast('Failed to copy link', 'error');
            }
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-white", children: _jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl", children: [_jsx("div", { className: "mb-6", children: _jsx(Breadcrumbs, { items: breadcrumbItems }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-20", children: [_jsxs("div", { className: "lg:col-span-2 space-y-8", children: [_jsxs("div", { className: "relative aspect-video bg-black rounded-2xl overflow-hidden group shadow-2xl border border-gray-800", children: [isPlaying && hasAccess ? (_jsxs("div", { className: "absolute inset-0 bg-black flex items-center justify-center", children: [service.contentType === 'video' ? (_jsx("video", { src: service.contentUrl, controls: true, autoPlay: true, className: "w-full h-full object-contain", poster: getServiceImage(service.image, storeConfig, ""), children: "Your browser does not support the video tag." })) : service.contentType === 'audio' ? (_jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-slate-900 text-white", children: [_jsxs("div", { className: "w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-6 backdrop-blur-xl border border-white/10 shadow-2xl relative", children: [_jsx(Headphones, { className: "w-12 h-12 text-white relative z-10" }), _jsx("div", { className: "absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-20" })] }), _jsx("h3", { className: "text-xl font-bold mb-2", children: service.name }), _jsx("p", { className: "text-gray-400 mb-8", children: "Now Playing \u2022 Audiobook" }), _jsx("audio", { src: service.contentUrl, controls: true, autoPlay: true, className: "w-full max-w-md h-12" })] })) : (_jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center p-8 bg-gray-50", children: [_jsx("div", { className: "w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm", children: _jsx(FileText, { className: "w-12 h-12 text-blue-600" }) }), _jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Resource Ready" }), _jsx("p", { className: "text-gray-500 mb-8 text-center max-w-sm", children: "You have access to this premium guide. Download it below to start reading." }), _jsxs("a", { href: service.contentUrl, target: "_blank", rel: "noopener noreferrer", className: "bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all flex items-center gap-3 shadow-xl", children: [_jsx(Download, { className: "w-5 h-5" }), " Download PDF Guide"] })] })), _jsx("button", { onClick: () => setIsPlaying(false), className: "absolute top-6 right-6 bg-black/40 hover:bg-black/60 p-3 rounded-full backdrop-blur-md transition-all border border-white/10 group/close", title: "Close player", children: _jsx(X, { className: "w-5 h-5 text-white group-hover/close:rotate-90 transition-transform" }) })] })) : (_jsxs(_Fragment, { children: [_jsx(Image, { src: getServiceImage(service.image, storeConfig, "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"), alt: service.name, fill: true, className: "object-cover transition-transform duration-700 group-hover:scale-105 opacity-80", unoptimized: true }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: hasAccess ? (_jsxs(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: () => setIsPlaying(true), className: "w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl hover:bg-white/20 transition-colors border border-white/30 relative group/play", children: [_jsx("div", { className: "absolute inset-0 bg-white/20 rounded-full blur-xl group-hover/play:blur-2xl transition-all" }), service.contentType === 'pdf' ? (_jsx(Download, { className: "w-10 h-10 text-white relative z-10" })) : (_jsx(Play, { className: "w-10 h-10 text-white ml-1 relative z-10", fill: "currentColor" }))] })) : (_jsxs("div", { className: "text-center p-6 backdrop-blur-md bg-black/40 rounded-3xl border border-white/10 max-w-sm mx-4", children: [_jsx("div", { className: "w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20", children: _jsx(Lock, { className: "w-8 h-8 text-white" }) }), _jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Premium Content" }), _jsxs("p", { className: "text-gray-300 text-sm mb-6", children: ["This ", typeLabel.toLowerCase(), " is exclusive to members. Unlock it now to start learning."] }), _jsxs(Button, { onClick: handleAddToCart, className: "bg-white text-black hover:bg-gray-200 rounded-full px-8 h-14 font-bold text-base w-full shadow-2xl", children: ["Unlock For ", formatCurrency(service.price, service.currency || 'USD')] })] })) })] })), _jsx("div", { className: "absolute top-6 left-6", children: _jsxs("div", { className: cn("px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 backdrop-blur-md shadow-lg", contentTypeColor), children: [_jsx(TypeIcon, { className: "w-3 h-3" }), " ", typeLabel] }) }), !hasAccess && isLocked && (_jsx("div", { className: "absolute top-6 right-6", children: _jsxs("div", { className: "px-4 py-2 rounded-full bg-black/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg", children: [_jsx(Lock, { className: "w-3 h-3" }), " Premium"] }) }))] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("span", { className: "text-sm font-semibold text-gray-700 uppercase tracking-wide", children: category?.name || 'Course' }), _jsx("span", { className: "text-gray-300", children: "\u2022" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Star, { className: "w-4 h-4 fill-yellow-400 text-yellow-400" }), _jsx("span", { className: "text-sm font-semibold", children: "4.9" }), _jsx("span", { className: "text-sm text-gray-500", children: "(127 reviews)" })] })] }), _jsx("h1", { className: "text-4xl md:text-5xl font-serif text-gray-900 mb-4 leading-tight", children: service.name }), _jsx("p", { className: "text-xl text-gray-600 leading-relaxed", children: service.description })] }), _jsx("div", { className: "border-b border-gray-200", children: _jsx("div", { className: "flex gap-8", children: [
                                            { id: 'overview', label: 'Overview' },
                                            { id: 'curriculum', label: 'Curriculum' },
                                            { id: 'reviews', label: 'Reviews' },
                                        ].map((tab) => (_jsx("button", { onClick: () => setSelectedTab(tab.id), className: cn("pb-4 px-2 text-sm font-semibold transition-colors border-b-2 -mb-px", selectedTab === tab.id
                                                ? "text-gray-900 border-gray-900"
                                                : "text-gray-500 border-transparent hover:text-gray-700"), children: tab.label }, tab.id))) }) }), _jsxs("div", { className: "py-8", children: [selectedTab === 'overview' && (_jsxs("div", { className: "space-y-6 prose prose-lg max-w-none", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-serif text-gray-900 mb-4", children: "What You'll Learn" }), _jsx("ul", { className: "space-y-3", children: [
                                                                "Master the fundamentals of mindset transformation",
                                                                "Develop practical strategies for daily success",
                                                                "Build confidence and overcome limiting beliefs",
                                                                "Create actionable plans for your goals",
                                                            ].map((item, i) => (_jsxs("li", { className: "flex items-start gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-500 shrink-0 mt-0.5" }), _jsx("span", { className: "text-gray-700", children: item })] }, i))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-serif text-gray-900 mb-4", children: "Course Details" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Clock, { className: "w-5 h-5 text-gray-400" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-500", children: "Duration" }), _jsxs("div", { className: "font-semibold", children: [service.duration, " minutes"] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Users, { className: "w-5 h-5 text-gray-400" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-500", children: "Students" }), _jsx("div", { className: "font-semibold", children: "12,345 enrolled" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(BookOpen, { className: "w-5 h-5 text-gray-400" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-500", children: "Level" }), _jsx("div", { className: "font-semibold", children: "All Levels" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Award, { className: "w-5 h-5 text-gray-400" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-500", children: "Certificate" }), _jsx("div", { className: "font-semibold", children: "Included" })] })] })] })] })] })), selectedTab === 'curriculum' && (_jsx("div", { className: "space-y-4", children: [
                                                { title: "Introduction", lessons: 3, duration: "15 min" },
                                                { title: "Core Concepts", lessons: 8, duration: "45 min" },
                                                { title: "Practical Applications", lessons: 5, duration: "30 min" },
                                                { title: "Advanced Techniques", lessons: 4, duration: "20 min" },
                                                { title: "Conclusion & Next Steps", lessons: 2, duration: "10 min" },
                                            ].map((section, i) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-semibold text-gray-900", children: section.title }), _jsx("span", { className: "text-sm text-gray-500", children: section.duration })] }), _jsxs("p", { className: "text-sm text-gray-600", children: [section.lessons, " lessons"] })] }, i))) })), selectedTab === 'reviews' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "text-5xl font-bold", children: "4.9" }), _jsxs("div", { children: [_jsx("div", { className: "flex items-center gap-1 mb-1", children: [...Array(5)].map((_, i) => (_jsx(Star, { className: "w-5 h-5 fill-yellow-400 text-yellow-400" }, i))) }), _jsx("div", { className: "text-sm text-gray-600", children: "Based on 127 reviews" })] })] }), [
                                                    { name: "Sarah Johnson", rating: 5, comment: "This course completely transformed my approach to goal setting. Highly recommend!", date: "2 weeks ago" },
                                                    { name: "Michael Chen", rating: 5, comment: "Excellent content and delivery. Worth every penny!", date: "1 month ago" },
                                                    { name: "David Lee", rating: 4, comment: "Great course overall. Some sections could be more detailed.", date: "2 months ago" },
                                                ].map((review, i) => (_jsxs("div", { className: "border-b border-gray-100 pb-6 last:border-b-0", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center", children: _jsx("span", { className: "text-sm font-semibold", children: review.name[0] }) }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: review.name }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex items-center gap-1", children: [...Array(5)].map((_, j) => (_jsx(Star, { className: cn("w-3 h-3", j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300") }, j))) }), _jsx("span", { className: "text-xs text-gray-500", children: review.date })] })] })] }), _jsx("p", { className: "text-gray-700 mt-2", children: review.comment })] }, i)))] }))] })] }), _jsx("div", { className: "lg:col-span-1", children: _jsx("div", { className: "sticky top-24", children: _jsxs("div", { className: "bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg", children: [_jsxs("div", { className: "mb-6", children: [_jsx("div", { className: "text-4xl font-bold text-gray-900 mb-2", children: isFree ? 'Free' : formatCurrency(service.price, service.currency || 'USD') }), !isFree && (_jsx("div", { className: "text-sm text-gray-500 line-through", children: formatCurrency(service.price * 1.5, service.currency || 'USD') }))] }), _jsxs("div", { className: "space-y-4 mb-6", children: [_jsxs(Button, { size: "lg", onClick: handleAddToCart, disabled: isCartLoading, className: "w-full h-14 rounded-full bg-black text-white hover:bg-gray-800 font-bold text-lg", children: [isCartLoading ? 'Adding...' : isFree ? 'Enroll Now' : 'Add to Cart', _jsx(ArrowRight, { className: "ml-2 h-5 w-5" })] }), storeConfig.features.wishlist && (_jsxs(Button, { variant: "outline", size: "lg", onClick: handleWishlistClick, disabled: isWishlistLoading, className: cn("w-full h-14 rounded-full border-2 transition-all", isInWishlist(service.id)
                                                        ? "border-red-500 bg-red-50 text-red-500 hover:bg-red-100"
                                                        : "border-gray-200 hover:border-gray-300"), children: [_jsx(Heart, { className: cn("w-5 h-5 mr-2", isInWishlist(service.id) && "fill-current") }), isInWishlist(service.id) ? 'In Wishlist' : 'Add to Wishlist'] })), _jsxs(Button, { variant: "outline", size: "lg", onClick: handleShare, className: "w-full h-14 rounded-full border-2 border-gray-200", children: [_jsx(Share2, { className: "w-5 h-5 mr-2" }), "Share"] })] }), _jsxs("div", { className: "border-t border-gray-200 pt-6 space-y-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-500 shrink-0 mt-0.5" }), _jsxs("div", { className: "text-sm text-gray-700", children: [_jsx("div", { className: "font-semibold", children: "Lifetime Access" }), _jsx("div", { className: "text-gray-500", children: "Access this course forever" })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-500 shrink-0 mt-0.5" }), _jsxs("div", { className: "text-sm text-gray-700", children: [_jsx("div", { className: "font-semibold", children: "Certificate of Completion" }), _jsx("div", { className: "text-gray-500", children: "Get certified upon completion" })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-500 shrink-0 mt-0.5" }), _jsxs("div", { className: "text-sm text-gray-700", children: [_jsx("div", { className: "font-semibold", children: "30-Day Money-Back Guarantee" }), _jsx("div", { className: "text-gray-500", children: "Full refund if not satisfied" })] })] })] }), isLocked && !isAuthenticated && (_jsx("div", { className: "mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg", children: _jsxs("p", { className: "text-sm text-yellow-800", children: [_jsx(Lock, { className: "w-4 h-4 inline mr-1" }), "This content requires a membership or purchase."] }) }))] }) }) })] }), relatedServices.length > 0 && (_jsxs("div", { className: "mt-20 pt-16 border-t border-gray-200", children: [_jsx("h2", { className: "text-3xl font-serif text-gray-900 mb-8", children: "You Might Also Like" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: relatedServices.map((relatedService) => (_jsx(Link, { href: `/${storeConfig.slug}/services/${relatedService.slug}`, className: "group", children: _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all", children: [_jsx("div", { className: "relative aspect-video bg-gray-200", children: _jsx(Image, { src: getServiceImage(relatedService.image, storeConfig, "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"), alt: relatedService.name, fill: true, className: "object-cover group-hover:scale-105 transition-transform duration-300", unoptimized: true }) }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:underline", children: relatedService.name }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-bold text-gray-900", children: relatedService.price > 0 ? formatCurrency(relatedService.price, relatedService.currency || 'USD') : 'Free' }), _jsx(ArrowRight, { className: "w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" })] })] })] }) }, relatedService.id))) })] }))] }) }));
}
