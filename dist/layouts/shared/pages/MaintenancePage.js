'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Wrench, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
export function MaintenancePage({ storeConfig }) {
    const primaryColor = storeConfig.branding.primaryColor || '#000000';
    const secondaryColor = storeConfig.branding.secondaryColor || primaryColor;
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center px-4 relative overflow-hidden", style: {
            background: `linear-gradient(135deg, ${primaryColor}08 0%, ${secondaryColor}05 50%, ${primaryColor}08 100%)`,
        }, children: [_jsxs("div", { className: "absolute inset-0 -z-10 overflow-hidden pointer-events-none", children: [_jsx(motion.div, { className: "absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20", style: { backgroundColor: primaryColor }, animate: {
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.3, 0.2],
                        }, transition: {
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        } }), _jsx(motion.div, { className: "absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20", style: { backgroundColor: secondaryColor }, animate: {
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.3, 0.2],
                        }, transition: {
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        } })] }), _jsxs("div", { className: "text-center max-w-3xl w-full relative z-10", children: [storeConfig.branding?.logo && (_jsx(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "mb-8", children: _jsx("img", { src: storeConfig.branding.logo, alt: storeConfig.name, className: "h-16 w-auto mx-auto object-contain" }) })), _jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.6, delay: 0.2 }, className: "mb-8", children: _jsx("div", { className: "w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-2xl", style: {
                                backgroundColor: `${primaryColor}15`,
                                border: `2px solid ${primaryColor}30`,
                            }, children: _jsx(motion.div, { animate: { rotate: [0, 10, -10, 0] }, transition: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }, children: _jsx(Wrench, { className: "w-12 h-12", style: { color: primaryColor } }) }) }) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.3 }, className: "mb-6", children: [_jsx("h1", { className: "text-5xl md:text-6xl font-black mb-4 tracking-tight", style: {
                                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }, children: "Under Maintenance" }), _jsx("div", { className: "w-32 h-1 mx-auto rounded-full", style: {
                                    background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
                                } })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.4 }, className: "space-y-4 mb-12", children: [_jsxs("h2", { className: "text-2xl md:text-3xl font-bold text-gray-900", children: [storeConfig.name, " is Currently Being Updated"] }), _jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed", children: "This store is currently under maintenance. If you are the owner of this store, you need to launch it to make it visible to customers." })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.5 }, className: "mb-12", children: _jsxs("div", { className: "inline-flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-sm border-2", style: {
                                backgroundColor: `${primaryColor}08`,
                                borderColor: `${primaryColor}20`,
                            }, children: [_jsx(Sparkles, { className: "w-5 h-5", style: { color: primaryColor } }), _jsx("span", { className: "text-sm font-semibold text-gray-700", children: "We're working hard to bring you an amazing experience" })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.6 }, className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: _jsxs("a", { href: "/", className: "group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105", style: {
                                backgroundColor: primaryColor,
                            }, children: [_jsx("span", { children: "Browse Other Stores" }), _jsx(ArrowRight, { className: "w-5 h-5 transform group-hover:translate-x-1 transition-transform" })] }) }), _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1, delay: 0.8 }, className: "mt-16 pt-8 border-t border-gray-200", children: _jsx("p", { className: "text-sm text-gray-500", children: "Check back soon for updates" }) })] })] }));
}
