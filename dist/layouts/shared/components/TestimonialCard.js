'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '../../../lib/utils';
export function TestimonialCard({ testimonial, className }) {
    return (_jsxs("div", { "data-section": "testimonials", className: cn('bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100', 'hover:shadow-lg transition-all duration-300', className), children: [_jsx("div", { className: "flex items-center gap-1 mb-4", children: [...Array(5)].map((_, i) => (_jsx(Star, { className: cn('h-4 w-4 md:h-5 md:w-5', i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300') }, i))) }), _jsxs("div", { className: "mb-6 relative", children: [_jsx("div", { className: "absolute -top-2 -left-2 text-4xl md:text-6xl text-gray-100 font-serif leading-none", children: "\"" }), _jsxs("p", { className: "text-gray-600 italic leading-relaxed relative z-10 text-sm md:text-base font-medium pl-4", children: ["\"", testimonial.quote, "\""] })] }), _jsxs("div", { className: "flex items-center gap-4 pt-6 border-t border-gray-50", children: [testimonial.image ? (_jsx("div", { className: "relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-4 ring-gray-50 flex-shrink-0", children: _jsx(Image, { src: testimonial.image, alt: testimonial.name, fill: true, className: "object-cover", unoptimized: true }) })) : (_jsx("div", { className: "w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "text-gray-500 font-semibold text-lg", children: testimonial.name.charAt(0).toUpperCase() }) })), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-gray-900 text-sm md:text-base mb-1", children: testimonial.name }), testimonial.role && (_jsx("p", { className: "text-gray-500 text-xs md:text-sm", children: testimonial.role }))] })] })] }));
}
