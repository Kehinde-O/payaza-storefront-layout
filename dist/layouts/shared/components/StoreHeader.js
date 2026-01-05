'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { ShoppingCart, Heart, Search, Menu, X, ChevronRight, ChevronDown, Instagram, Twitter, Youtube, Home, Info, Phone, Package, Calendar, BookOpen, GraduationCap, Sparkles, Tag, LayoutGrid } from 'lucide-react';
// Navigation icon helper
const getNavIcon = (label) => {
    const l = label.toLowerCase();
    if (l.includes('home'))
        return Home;
    if (l.includes('about'))
        return Info;
    if (l.includes('contact'))
        return Phone;
    if (l.includes('product') || l.includes('shop') || l.includes('arrival'))
        return Package;
    if (l.includes('service') || l.includes('book'))
        return Calendar;
    if (l.includes('course') || l.includes('learn'))
        return BookOpen;
    if (l.includes('mentorship'))
        return GraduationCap;
    if (l.includes('collection'))
        return Sparkles;
    if (l.includes('sale'))
        return Tag;
    if (l.includes('catalogue'))
        return LayoutGrid;
    return null;
};
import { useState, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../lib/auth-context';
import { StoreLogo } from '../../../components/ui/store-logos';
import { useStore } from '../../../lib/store-context';
import { getLogoUrl } from '../../../lib/utils/asset-helpers';
import { AvatarImage } from '../../../components/ui/avatar-image';
import { motion, AnimatePresence } from 'framer-motion';
export function StoreHeader({ storeConfig, cartItemCount = 0 }) {
    const { wishlist } = useStore();
    const wishlistCount = wishlist.length;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const [mounted, setMounted] = useState(false);
    const searchInputRef = useRef(null);
    // Filter to show only parent categories (no parentId)
    const allCategories = storeConfig.categories || [];
    const parentCategories = allCategories.filter(cat => !cat.parentId);
    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);
    const primaryColor = storeConfig.branding.primaryColor;
    const isDarkTheme = storeConfig.branding.theme === 'dark' || storeConfig.type === 'electronics';
    if (!mounted) {
        return null;
    }
    const headerBg = isDarkTheme
        ? scrolled ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)'
        : scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.9)';
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: cn("sticky top-0 z-[60] w-full transition-all duration-500 backdrop-blur-xl border-b", scrolled ? "shadow-lg border-gray-100 dark:border-white/5 py-1" : "border-transparent py-2.5"), style: { backgroundColor: headerBg }, children: _jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "relative flex h-16 items-center justify-between", children: [_jsx("div", { className: "flex items-center flex-shrink-0 z-20", children: _jsxs(Link, { href: `/${storeConfig.slug}`, className: "flex items-center gap-3 group", children: [_jsx(StoreLogo, { storeConfig: storeConfig, className: "h-10 w-10 transition-transform duration-500 group-hover:scale-105", alt: storeConfig.name }), !getLogoUrl(storeConfig) && (_jsx("span", { className: cn("text-xl font-bold tracking-tight transition-colors hidden sm:block", isDarkTheme ? "text-white" : "text-gray-900"), children: storeConfig.name }))] }) }), _jsxs("nav", { className: "hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2", children: [storeConfig.navigation.main.map((item, index) => {
                                        const Icon = item.icon ? (item.icon === 'BookOpen' ? BookOpen : item.icon === 'GraduationCap' ? GraduationCap : item.icon === 'Info' ? Info : getNavIcon(item.label)) : getNavIcon(item.label);
                                        return (_jsxs(Link, { href: `/${storeConfig.slug}${item.href}`, className: cn("px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all rounded-full flex items-center gap-2.5 group/nav", isDarkTheme
                                                ? "text-gray-400 hover:text-white hover:bg-white/10"
                                                : "text-gray-600 hover:text-black hover:bg-gray-100"), children: [Icon && _jsx(Icon, { className: "w-4 h-4 transition-transform group-hover/nav:scale-110" }), item.label] }, `${index}-${item.href}`));
                                    }), parentCategories.length > 0 && (_jsxs("div", { className: "relative group", onMouseEnter: () => setIsCatalogueOpen(true), onMouseLeave: () => setIsCatalogueOpen(false), children: [_jsxs("button", { className: cn("px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all rounded-full flex items-center gap-2 group/nav", isDarkTheme
                                                    ? "text-gray-400 hover:text-white hover:bg-white/10"
                                                    : "text-gray-600 hover:text-black hover:bg-gray-100"), children: [_jsx(LayoutGrid, { className: "w-4 h-4 transition-transform group-hover/nav:scale-110" }), "Catalogue", _jsx(ChevronDown, { className: cn("w-3.5 h-3.5 transition-transform duration-300", isCatalogueOpen && "rotate-180") })] }), _jsx(AnimatePresence, { children: isCatalogueOpen && (_jsx(motion.div, { initial: { opacity: 0, y: 10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 10, scale: 0.95 }, transition: { duration: 0.2 }, className: cn("absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 rounded-2xl shadow-2xl border backdrop-blur-2xl z-50", isDarkTheme ? "bg-black/90 border-white/10" : "bg-white/95 border-gray-100"), children: _jsx("div", { className: "grid gap-1", children: parentCategories.map((cat) => (_jsxs(Link, { href: `/${storeConfig.slug}/categories/${cat.slug}`, className: cn("flex items-center justify-between px-4 py-3 rounded-xl transition-all group/item", isDarkTheme ? "hover:bg-white/5" : "hover:bg-gray-50"), onClick: () => setIsCatalogueOpen(false), children: [_jsx("span", { className: cn("text-sm font-medium", isDarkTheme ? "text-gray-300 group-hover/item:text-white" : "text-gray-600 group-hover/item:text-black"), children: cat.name }), _jsx(ChevronRight, { className: "w-4 h-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-gray-400" })] }, cat.id))) }) })) })] }))] }), _jsxs("div", { className: "flex items-center gap-1 sm:gap-2 z-20", children: [_jsx(Button, { variant: "ghost", size: "icon", className: cn("h-10 w-10 rounded-full transition-all relative", isDarkTheme ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-100 text-gray-600", searchOpen && "bg-transparent shadow-none"), onClick: () => setSearchOpen(true), children: _jsx(Search, { className: "h-5 w-5" }) }), storeConfig.features.wishlist && (_jsx(Link, { href: `/${storeConfig.slug}/wishlist`, children: _jsxs(Button, { variant: "ghost", size: "icon", className: "h-10 w-10 relative rounded-full group hover:bg-red-50 dark:hover:bg-red-900/10", children: [_jsx(Heart, { className: cn("h-5 w-5 transition-all group-hover:scale-110", wishlistCount > 0 && "fill-red-500 text-red-500") }), wishlistCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 h-4 w-4 text-[9px] font-bold text-white rounded-full flex items-center justify-center shadow-lg", style: { backgroundColor: primaryColor }, children: wishlistCount }))] }) })), storeConfig.layout === 'motivational-speaker' && isAuthenticated && (_jsx(Link, { href: `/${storeConfig.slug}/account?tab=learning`, children: _jsxs(Button, { variant: "ghost", size: "icon", className: cn("h-10 w-10 relative rounded-full group transition-all", isDarkTheme ? "hover:bg-blue-900/20 text-blue-400" : "hover:bg-blue-50 text-blue-600"), children: [_jsx(BookOpen, { className: "h-5 w-5 transition-all group-hover:scale-110" }), _jsx("span", { className: "sr-only", children: "My Learning" })] }) })), storeConfig.features.cart && (_jsx(Link, { href: `/${storeConfig.slug}/cart`, children: _jsxs(Button, { variant: "ghost", size: "icon", className: "h-10 w-10 relative rounded-full group hover:bg-gray-100 dark:hover:bg-white/10", children: [_jsx(ShoppingCart, { className: "h-5 w-5 group-hover:scale-110 transition-all" }), cartItemCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 h-4 w-4 text-[9px] font-bold text-white rounded-full flex items-center justify-center shadow-lg", style: { backgroundColor: primaryColor }, children: cartItemCount }))] }) })), isAuthenticated ? (_jsx(Link, { href: `/${storeConfig.slug}/account`, children: _jsx(Button, { variant: "ghost", size: "icon", className: "h-10 w-10 rounded-full overflow-hidden border-2 border-transparent hover:border-gray-200 transition-all", children: _jsx(AvatarImage, { src: user?.avatar, alt: "User", size: 32 }) }) })) : (_jsx(Link, { href: `/auth/login?callbackUrl=/${storeConfig.slug}`, className: "ml-1 hidden sm:block", children: _jsx(Button, { className: "h-10 px-6 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg active:scale-95", style: { backgroundColor: primaryColor, color: 'white' }, children: "Log In" }) })), _jsx(Button, { variant: "ghost", size: "icon", className: "lg:hidden h-10 w-10 rounded-full ml-1", onClick: () => setMobileMenuOpen(true), children: _jsx(Menu, { className: "h-6 w-6" }) })] })] }) }) }), _jsx(AnimatePresence, { children: searchOpen && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-[100] flex flex-col items-center justify-start pt-24 px-4 bg-white/80 dark:bg-black/80 backdrop-blur-2xl", children: _jsxs(motion.div, { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -20, opacity: 0 }, className: "w-full max-w-3xl relative", children: [_jsxs("div", { className: "relative flex items-center group", children: [_jsx(Search, { className: "absolute left-6 h-6 w-6 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" }), _jsx("input", { ref: searchInputRef, type: "text", placeholder: "Search products, categories, guides...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: cn("w-full pl-16 pr-24 py-6 text-2xl md:text-3xl font-light bg-transparent border-b-2 border-gray-200 dark:border-white/10 focus:outline-none focus:border-black dark:focus:border-white transition-all", isDarkTheme ? "text-white placeholder-gray-600" : "text-black placeholder-gray-300"), onKeyDown: (e) => e.key === 'Escape' && setSearchOpen(false) }), _jsxs("div", { className: "absolute right-0 flex items-center gap-2", children: [searchQuery && (_jsx(Button, { variant: "ghost", size: "icon", onClick: () => setSearchQuery(''), className: "h-10 w-10 rounded-full", children: _jsx(X, { className: "h-5 w-5 text-gray-400" }) })), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSearchOpen(false), className: "text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white", children: "Esc" })] })] }), _jsxs("div", { className: "mt-12 grid grid-cols-1 md:grid-cols-2 gap-12", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("h4", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-gray-400", children: "Quick Links" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ['Courses', 'Mentorship', 'Free Guides', 'Memberships', 'Contact'].map((tag) => (_jsx("button", { className: cn("px-4 py-2 rounded-full text-sm border transition-all", isDarkTheme
                                                        ? "border-white/10 hover:border-white text-gray-400 hover:text-white"
                                                        : "border-gray-200 hover:border-black text-gray-600 hover:text-black"), children: tag }, tag))) })] }), _jsxs("div", { className: "space-y-6", children: [_jsx("h4", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-gray-400", children: "Popular Categories" }), _jsx("div", { className: "grid gap-3", children: parentCategories.map((cat) => (_jsxs(Link, { href: `/${storeConfig.slug}/categories/${cat.slug}`, className: "flex items-center gap-3 group", onClick: () => setSearchOpen(false), children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform", children: _jsx(ChevronRight, { className: "w-4 h-4 text-gray-400" }) }), _jsx("span", { className: "text-lg font-medium text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors", children: cat.name })] }, cat.id))) })] })] })] }) })) }), _jsx(AnimatePresence, { children: mobileMenuOpen && (_jsxs("div", { className: "fixed inset-0 z-[100] lg:hidden", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 bg-black/60 backdrop-blur-md", onClick: () => setMobileMenuOpen(false) }), _jsxs(motion.nav, { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' }, transition: { type: "spring", damping: 25, stiffness: 200 }, className: cn("absolute right-0 top-0 bottom-0 w-[300px] shadow-2xl p-8 flex flex-col", isDarkTheme ? "bg-black text-white" : "bg-white text-black"), children: [_jsxs("div", { className: "flex items-center justify-between mb-12", children: [_jsx(StoreLogo, { storeConfig: storeConfig, className: "h-8 w-8" }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setMobileMenuOpen(false), children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "flex flex-col gap-8", children: [storeConfig.navigation.main.map((item, i) => {
                                            const Icon = item.icon ? (item.icon === 'BookOpen' ? BookOpen : item.icon === 'GraduationCap' ? GraduationCap : item.icon === 'Info' ? Info : getNavIcon(item.label)) : getNavIcon(item.label);
                                            return (_jsxs(Link, { href: `/${storeConfig.slug}${item.href}`, className: "text-3xl font-bold tracking-tight hover:opacity-50 transition-opacity flex items-center gap-4", onClick: () => setMobileMenuOpen(false), children: [Icon && _jsx(Icon, { className: "w-8 h-8 text-gray-400" }), item.label] }, i));
                                        }), _jsxs("div", { className: "pt-8 space-y-4 border-t border-gray-100 dark:border-white/10", children: [_jsx("h4", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-gray-400", children: "Catalogue" }), _jsx("div", { className: "grid gap-4", children: parentCategories.map((cat) => (_jsx(Link, { href: `/${storeConfig.slug}/categories/${cat.slug}`, className: "text-lg font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors", onClick: () => setMobileMenuOpen(false), children: cat.name }, cat.id))) })] })] }), _jsxs("div", { className: "mt-auto pt-8 border-t border-gray-100 dark:border-white/10 flex flex-col gap-6", children: [!isAuthenticated ? (_jsx(Link, { href: `/auth/login?callbackUrl=/${storeConfig.slug}`, children: _jsx(Button, { className: "w-full h-14 rounded-full font-bold text-sm uppercase tracking-widest shadow-xl", style: { backgroundColor: primaryColor, color: 'white' }, children: "Sign In" }) })) : (_jsx(Link, { href: `/${storeConfig.slug}/account`, children: _jsx(Button, { variant: "outline", className: "w-full h-14 rounded-full font-bold text-sm uppercase tracking-widest", children: "My Account" }) })), _jsxs("div", { className: "flex justify-center gap-6 text-gray-400", children: [_jsx(Instagram, { className: "w-5 h-5" }), _jsx(Twitter, { className: "w-5 h-5" }), _jsx(Youtube, { className: "w-5 h-5" })] })] })] })] })) })] }));
}
