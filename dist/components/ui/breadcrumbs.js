'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
export function Breadcrumbs({ items, variant = 'default' }) {
    const isLight = variant === 'light';
    return (_jsx("nav", { className: `flex items-center space-x-2 text-sm ${isLight ? 'text-white' : 'text-gray-600'} ${variant === 'default' ? 'mb-6' : ''}`, children: items.map((item, index) => (_jsxs("div", { className: "flex items-center space-x-2", children: [index > 0 && _jsx(ChevronRight, { className: `h-4 w-4 ${isLight ? 'text-white/70' : 'text-gray-400'}` }), item.href && index < items.length - 1 ? (_jsx(Link, { href: item.href, className: `transition-colors ${isLight ? 'hover:text-white/90 text-white' : 'hover:text-gray-900'}`, children: item.label })) : (_jsx("span", { className: index === items.length - 1 ? `${isLight ? 'text-white font-medium' : 'text-gray-900 font-medium'}` : '', children: item.label }))] }, index))) }));
}
