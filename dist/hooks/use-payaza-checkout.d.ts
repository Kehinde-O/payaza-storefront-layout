import { PayazaCheckoutConfig, PayazaCheckoutResponse } from '../lib/payaza-checkout';
interface UsePayazaCheckoutOptions {
    publicKey: string;
    onSuccess?: (response: PayazaCheckoutResponse) => void;
    onError?: (error: string) => void;
    onClose?: () => void;
}
export declare function usePayazaCheckout({ publicKey, onSuccess, onError, onClose }: UsePayazaCheckoutOptions): {
    checkout: (config: Omit<PayazaCheckoutConfig, "publicKey" | "onSuccess" | "onError" | "onClose">) => Promise<void>;
    isLoading: boolean;
    error: string;
};
export {};
//# sourceMappingURL=use-payaza-checkout.d.ts.map