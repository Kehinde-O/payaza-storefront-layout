import { Address } from '../../lib/services/customer.service';
interface AddressSelectorProps {
    addresses: Address[];
    selectedAddressId: string | null;
    onSelect: (addressId: string | null) => void;
    isLoading?: boolean;
    isAuthenticated: boolean;
}
export declare function AddressSelector({ addresses, selectedAddressId, onSelect, isLoading, isAuthenticated, }: AddressSelectorProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=address-selector.d.ts.map