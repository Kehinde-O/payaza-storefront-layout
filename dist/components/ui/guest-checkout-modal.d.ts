interface GuestCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
    }) => void;
    initialData?: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        email?: string;
    };
}
export declare function GuestCheckoutModal({ isOpen, onClose, onSubmit, initialData, }: GuestCheckoutModalProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=guest-checkout-modal.d.ts.map