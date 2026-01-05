'use client';

import { Address } from '@/lib/services/customer.service';
import { MapPin, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelect: (addressId: string | null) => void;
  isLoading?: boolean;
  isAuthenticated: boolean;
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
  isLoading = false,
  isAuthenticated,
}: AddressSelectorProps) {
  if (!isAuthenticated) {
    return null;
  }

  const formatAddress = (address: Address): string => {
    const parts = [
      address.address1,
      address.address2,
      `${address.city}, ${address.state} ${address.zipCode}`,
      address.country,
    ].filter(Boolean);
    return parts.join(', ');
  };

  if (isLoading) {
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
          <span className="text-sm font-medium text-gray-600">Loading addresses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-3">
      <label className="text-sm font-bold text-gray-700 ml-1 block">Select or Add Address</label>
      <div className="space-y-2">
        {addresses.length > 0 && (
          <select
            value={selectedAddressId || ''}
            onChange={(e) => onSelect(e.target.value || null)}
            className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-0 focus:border-black transition-all font-medium text-gray-900"
          >
            <option value="">Add new address</option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.label ? `${address.label} - ` : ''}
                {formatAddress(address)}
                {address.isDefault ? ' (Default)' : ''}
              </option>
            ))}
          </select>
        )}
        
        {selectedAddressId && (
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-green-900 mb-1">
                  {addresses.find(a => a.id === selectedAddressId)?.label || 'Selected Address'}
                </p>
                <p className="text-sm text-green-700">
                  {formatAddress(addresses.find(a => a.id === selectedAddressId)!)}
                </p>
              </div>
            </div>
          </div>
        )}

        {addresses.length === 0 && (
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">
                No saved addresses. Fill in the form below to add one.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

