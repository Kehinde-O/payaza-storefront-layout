'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../lib/utils';
function Spinner({ size = 'md', className, color = 'text-gray-900' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };
    const borderClasses = {
        sm: 'border-2',
        md: 'border-[3px]',
        lg: 'border-4',
    };
    return (_jsx("div", { className: cn('rounded-full border-solid border-t-transparent border-r-transparent', 'animate-spin', sizeClasses[size], borderClasses[size], color, 'border-l-current border-b-current', className), style: {
            animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        } }));
}
export function PageLoader({ fullPage = false, size = 'md', className, text }) {
    const spinner = (_jsxs("div", { className: cn('flex flex-col items-center justify-center gap-3', className), children: [_jsx(Spinner, { size: size, color: "text-gray-900" }), text && (_jsx("p", { className: "text-sm text-gray-600 font-medium animate-pulse", children: text }))] }));
    if (fullPage) {
        return (_jsx("div", { className: "fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center", children: spinner }));
    }
    return spinner;
}
export function InlineLoader({ size = 'sm', className, color }) {
    return (_jsx(Spinner, { size: size, className: className, color: color || 'text-gray-600' }));
}
export function ButtonLoader({ className, color }) {
    return (_jsx(Spinner, { size: "sm", className: className, color: color || 'text-current' }));
}
