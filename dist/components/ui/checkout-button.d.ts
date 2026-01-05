import { StoreConfig } from '../../lib/store-types';
interface CheckoutButtonProps {
    storeConfig: StoreConfig;
    className?: string;
    children?: React.ReactNode;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
}
export declare function CheckoutButton({ storeConfig, className, children, variant, size, }: CheckoutButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=checkout-button.d.ts.map