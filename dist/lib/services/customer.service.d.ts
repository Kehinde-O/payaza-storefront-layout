export interface CustomerProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    address?: any;
    createdAt?: string | Date;
}
export interface Address {
    id: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
    isDefault: boolean;
    label?: string;
}
export declare const customerService: {
    /**
     * Get customer profile (requires authentication)
     */
    getProfile(): Promise<CustomerProfile>;
    /**
     * Update customer profile (requires authentication)
     * Note: For file uploads, use FormData directly in the component
     */
    updateProfile(data: Partial<CustomerProfile> | FormData): Promise<CustomerProfile>;
    /**
     * Get customer addresses (requires authentication)
     */
    getAddresses(): Promise<Address[]>;
    /**
     * Add address (requires authentication)
     */
    addAddress(data: Omit<Address, "id" | "createdAt" | "updatedAt">): Promise<Address>;
    /**
     * Update address (requires authentication)
     */
    updateAddress(id: string, data: Partial<Address>): Promise<Address>;
    /**
     * Delete address (requires authentication)
     */
    deleteAddress(id: string): Promise<void>;
};
//# sourceMappingURL=customer.service.d.ts.map