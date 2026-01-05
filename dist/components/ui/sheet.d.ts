import * as React from 'react';
interface SheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    side?: 'left' | 'right';
    className?: string;
}
export declare function Sheet({ isOpen, onClose, title, children, side, className }: SheetProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=sheet.d.ts.map