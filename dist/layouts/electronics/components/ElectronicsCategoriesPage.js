'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { ImageWithFallback } from '../../../components/ui/image-with-fallback';
import { ArrowRight, Zap, Smartphone, Laptop, Headphones, Watch, Camera } from 'lucide-react';
import { Breadcrumbs } from '../../../components/ui/breadcrumbs';
import { ElectronicsStoreHeader } from './ElectronicsStoreHeader';
import { ElectronicsStoreFooter } from './ElectronicsStoreFooter';
import { motion } from 'framer-motion';
export function ElectronicsCategoriesPage({ storeConfig }) {
    const categories = storeConfig.categories || [];
    const breadcrumbItems = [
        { label: storeConfig.name, href: `/${storeConfig.slug}` },
        { label: 'Collections', href: `/${storeConfig.slug}/categories` },
    ];
    // Helper for category icons
    const getCategoryIcon = (slug) => {
        if (slug.includes('phone'))
            return _jsx(Smartphone, { className: "h-6 w-6" });
        if (slug.includes('laptop') || slug.includes('computer'))
            return _jsx(Laptop, { className: "h-6 w-6" });
        if (slug.includes('audio') || slug.includes('headphone'))
            return _jsx(Headphones, { className: "h-6 w-6" });
        if (slug.includes('watch') || slug.includes('wearable'))
            return _jsx(Watch, { className: "h-6 w-6" });
        if (slug.includes('camera'))
            return _jsx(Camera, { className: "h-6 w-6" });
        return _jsx(Zap, { className: "h-6 w-6" });
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white", children: [_jsx(ElectronicsStoreHeader, { storeConfig: storeConfig }), _jsxs("div", { className: "pt-32 pb-20 bg-slate-950 text-white relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-blue-600/10 pointer-events-none" }), _jsx("div", { className: "absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" }), _jsx("div", { className: "container mx-auto px-6 relative z-10", children: _jsxs("div", { className: "max-w-3xl", children: [_jsx("div", { className: "mb-6 opacity-60", children: _jsx(Breadcrumbs, { items: breadcrumbItems }) }), _jsxs(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "text-5xl lg:text-7xl font-black tracking-tight mb-6", children: ["Curated ", _jsx("br", {}), _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400", children: "Ecosystems." })] }), _jsx(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "text-lg text-slate-400 leading-relaxed max-w-2xl font-light", children: "Dive into our specialized collections. Each category is meticulously curated to offer the best performance and value in its class." })] }) })] }), _jsx("div", { className: "container mx-auto px-6 py-24", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: categories.map((category, index) => {
                        const isLarge = index === 0;
                        return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: index * 0.1 }, className: `${isLarge ? 'lg:col-span-2 lg:row-span-2 min-h-[500px]' : 'min-h-[300px]'}`, children: _jsxs(Link, { href: `/${storeConfig.slug}/products?category=${category.slug}`, className: "group relative block w-full h-full overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500", children: [_jsx(ImageWithFallback, { src: category.image, alt: category.name, className: "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105", skeletonAspectRatio: "auto" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" }), _jsxs("div", { className: "absolute inset-0 flex flex-col justify-end p-10 z-10", children: [_jsx("div", { className: "mb-4 text-white/60 group-hover:text-blue-400 transition-colors", children: getCategoryIcon(category.slug) }), _jsxs("div", { className: "transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0", children: [_jsx("h2", { className: `font-black text-white mb-3 tracking-tight ${isLarge ? 'text-4xl md:text-5xl' : 'text-2xl'}`, children: category.name }), _jsx("div", { className: "w-12 h-1 bg-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 mb-4" }), _jsxs("div", { className: "flex items-center gap-2 text-slate-300 font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-4 group-hover:translate-y-0", children: [_jsx("span", { children: "View Products" }), _jsx(ArrowRight, { className: "w-4 h-4" })] })] })] })] }) }, category.id));
                    }) }) }), _jsx(ElectronicsStoreFooter, { storeConfig: storeConfig })] }));
}
