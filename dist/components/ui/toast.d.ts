import React from 'react';
export type ToastType = 'success' | 'error' | 'info';
export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}
interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}
export declare function ToastProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useToast(): ToastContextType;
export {};
//# sourceMappingURL=toast.d.ts.map