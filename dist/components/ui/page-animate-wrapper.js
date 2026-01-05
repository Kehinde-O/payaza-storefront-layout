'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
export function PageAnimateWrapper({ children, className }) {
    const pathname = usePathname();
    const [shouldAnimate, setShouldAnimate] = useState(false);
    useEffect(() => {
        setShouldAnimate(false);
        // Small timeout to reset animation state and trigger reflow
        const timer = setTimeout(() => setShouldAnimate(true), 10);
        return () => clearTimeout(timer);
    }, [pathname]);
    return (_jsx("div", { className: cn("animate-fade-in", className), children: children }, pathname));
}
