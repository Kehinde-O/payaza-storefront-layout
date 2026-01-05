'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';
export function Modal({ isOpen, onClose, title, children, className }) {
    const overlayRef = React.useRef(null);
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { ref: overlayRef, className: "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity", onClick: onClose }), _jsxs("div", { className: cn("relative bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200", className), children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b", children: [_jsx("h3", { className: "text-lg font-semibold", children: title }), _jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, className: "rounded-full", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsx("div", { className: "p-4", children: children })] })] }));
}
