'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MapPin, Check } from 'lucide-react';
export function AddressSelector({ addresses, selectedAddressId, onSelect, isLoading = false, isAuthenticated, }) {
    if (!isAuthenticated) {
        return null;
    }
    const formatAddress = (address) => {
        const parts = [
            address.address1,
            address.address2,
            `${address.city}, ${address.state} ${address.zipCode}`,
            address.country,
        ].filter(Boolean);
        return parts.join(', ');
    };
    if (isLoading) {
        return (_jsx("div", { className: "mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" }), _jsx("span", { className: "text-sm font-medium text-gray-600", children: "Loading addresses..." })] }) }));
    }
    return (_jsxs("div", { className: "mb-6 space-y-3", children: [_jsx("label", { className: "text-sm font-bold text-gray-700 ml-1 block", children: "Select or Add Address" }), _jsxs("div", { className: "space-y-2", children: [addresses.length > 0 && (_jsxs("select", { value: selectedAddressId || '', onChange: (e) => onSelect(e.target.value || null), className: "w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-0 focus:border-black transition-all font-medium text-gray-900", children: [_jsx("option", { value: "", children: "Add new address" }), addresses.map((address) => (_jsxs("option", { value: address.id, children: [address.label ? `${address.label} - ` : '', formatAddress(address), address.isDefault ? ' (Default)' : ''] }, address.id)))] })), selectedAddressId && (_jsx("div", { className: "p-4 bg-green-50 border-2 border-green-200 rounded-xl", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Check, { className: "w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-bold text-green-900 mb-1", children: addresses.find(a => a.id === selectedAddressId)?.label || 'Selected Address' }), _jsx("p", { className: "text-sm text-green-700", children: formatAddress(addresses.find(a => a.id === selectedAddressId)) })] })] }) })), addresses.length === 0 && (_jsx("div", { className: "p-4 bg-blue-50 border-2 border-blue-200 rounded-xl", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(MapPin, { className: "w-5 h-5 text-blue-600" }), _jsx("p", { className: "text-sm font-medium text-blue-900", children: "No saved addresses. Fill in the form below to add one." })] }) }))] })] }));
}
