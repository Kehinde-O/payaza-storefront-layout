'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
export function PromoBanner({ config, layoutStyle = 'default', className }) {
    if (!config?.show)
        return null;
    const hasContent = config.image || config.title || config.subtitle || config.buttonText;
    if (!hasContent)
        return null;
    const content = (_jsxs("div", { className: cn('relative w-full overflow-hidden rounded-lg', layoutStyle === 'food' && 'min-h-[400px]', layoutStyle === 'electronics' && 'min-h-[300px]', layoutStyle === 'clothing' && 'min-h-[350px]', 'min-h-[300px]', className), children: [config.image && (_jsx("div", { className: "absolute inset-0 bg-cover bg-center", style: { backgroundImage: `url(${config.image})` } })), _jsxs("div", { className: cn('relative z-10 flex flex-col items-center justify-center p-8 md:p-12 text-center', config.image ? 'bg-black/40' : 'bg-gradient-to-r from-primary/90 to-primary', 'min-h-[300px]'), children: [config.title && (_jsx("h3", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: config.title })), config.subtitle && (_jsx("p", { className: "text-lg md:text-xl text-white/90 mb-6 max-w-2xl", children: config.subtitle })), config.buttonText && (_jsx(Button, { asChild: true, size: "lg", className: "bg-white text-primary hover:bg-white/90", children: _jsx(Link, { href: config.buttonLink || '/products', children: config.buttonText }) }))] })] }));
    return (_jsx("section", { className: "py-8 md:py-12 px-4 sm:px-6 lg:px-8", children: content }));
}
