'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';
export function Sheet({ isOpen, onClose, title, children, side = 'right', className }) {
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
    const sideClasses = {
        left: 'left-0 h-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        right: 'right-0 h-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
    };
    return (_jsxs(_Fragment, { children: [isOpen && (_jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity", onClick: onClose })), _jsxs("div", { className: cn("fixed z-50 w-full max-w-md bg-white p-6 shadow-xl transition ease-in-out duration-300 transform", side === 'left' ? 'top-0 bottom-0 left-0' : 'top-0 bottom-0 right-0', isOpen
                    ? 'translate-x-0 opacity-100'
                    : side === 'left' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0', className), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: title }), _jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, className: "rounded-full", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsx("div", { className: "h-full overflow-y-auto pb-20", children: children })] })] }));
}
