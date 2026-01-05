'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../../lib/utils';
import { PageLoader } from './page-loader';
/**
 * PageContentLoader component that displays a spinner loader
 * with minimum height for proper user feedback during backend operations.
 * Uses fixed positioning to center spinner on viewport regardless of scroll position.
 */
export function PageContentLoader({ className, minHeight = 500, text }) {
    return (_jsx("div", { className: cn('fixed inset-0 flex items-center justify-center w-full h-full bg-white/95 backdrop-blur-sm z-40', className), style: { minHeight: `${minHeight}px` }, children: _jsx(PageLoader, { size: "lg", text: text }) }));
}
