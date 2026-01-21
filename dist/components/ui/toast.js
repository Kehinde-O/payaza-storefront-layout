'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
export const ToastContext = createContext(undefined);
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, message, type, duration };
        setToasts((prev) => [...prev, newToast]);
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);
    return (_jsxs(ToastContext.Provider, { value: { toasts, addToast, removeToast }, children: [children, _jsx(ToastContainer, { toasts: toasts, removeToast: removeToast })] }));
}
export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
function ToastContainer({ toasts, removeToast }) {
    return (_jsx("div", { className: "fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none", children: toasts.map((toast) => (_jsxs("div", { className: cn("pointer-events-auto flex items-center gap-3 min-w-[300px] max-w-md p-4 rounded-lg shadow-lg border animate-in slide-in-from-right-full duration-300", toast.type === 'success' && "bg-white border-green-100 text-slate-800", toast.type === 'error' && "bg-white border-red-100 text-slate-800", toast.type === 'info' && "bg-white border-blue-100 text-slate-800"), children: [_jsxs("div", { className: cn("flex-shrink-0", toast.type === 'success' && "text-green-500", toast.type === 'error' && "text-red-500", toast.type === 'info' && "text-blue-500"), children: [toast.type === 'success' && _jsx(CheckCircle, { className: "h-5 w-5" }), toast.type === 'error' && _jsx(AlertCircle, { className: "h-5 w-5" }), toast.type === 'info' && _jsx(Info, { className: "h-5 w-5" })] }), _jsx("p", { className: "flex-1 text-sm font-medium", children: toast.message }), _jsx("button", { onClick: () => removeToast(toast.id), className: "text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-4 w-4" }) })] }, toast.id))) }));
}
