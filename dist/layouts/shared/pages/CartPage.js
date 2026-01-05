'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../../../components/ui/button';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useStore } from '../../../lib/store-context';
import { formatCurrency } from '../../../lib/utils';
import { calculateVAT, calculateServiceCharge, getVATLabel } from '../../../lib/utils/fee-calculations';
export function CartPage({ storeConfig }) {
    const primaryColor = storeConfig.branding.primaryColor;
    const { cart, updateCartQuantity, removeFromCart, cartTotal, isCartLoading } = useStore();
    const [updatingItemId, setUpdatingItemId] = useState(null);
    const [removingItemId, setRemovingItemId] = useState(null);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    // Helper function to determine cart currency consistently
    const getCartCurrency = () => {
        if (cart.length === 0) {
            return storeConfig.settings?.currency || 'USD';
        }
        // Get currencies from cart items
        const currencies = cart
            .map(item => item.product?.currency)
            .filter(Boolean);
        if (currencies.length === 0) {
            return storeConfig.settings?.currency || 'USD';
        }
        // If all items have the same currency, use it
        const uniqueCurrencies = [...new Set(currencies)];
        if (uniqueCurrencies.length === 1) {
            return uniqueCurrencies[0];
        }
        // If mixed currencies, use the most common one
        const currencyCounts = {};
        currencies.forEach(currency => {
            currencyCounts[currency] = (currencyCounts[currency] || 0) + 1;
        });
        const mostCommonCurrency = Object.entries(currencyCounts).reduce((a, b) => currencyCounts[a[0]] > currencyCounts[b[0]] ? a : b)[0];
        return mostCommonCurrency;
    };
    const cartCurrency = getCartCurrency();
    const subtotal = cartTotal;
    // Calculate VAT and service charge using store configuration
    const vatAmount = calculateVAT(subtotal, storeConfig.settings?.vat, storeConfig.settings?.taxRate);
    const serviceChargeAmount = calculateServiceCharge(subtotal, storeConfig.settings?.serviceCharge, 'online');
    const vatLabel = getVATLabel(storeConfig.settings?.vat, storeConfig.settings?.taxRate);
    // Calculate total (shipping will be calculated at checkout)
    const total = subtotal + vatAmount + serviceChargeAmount;
    if (!isClient)
        return null; // Avoid hydration mismatch
    if (cart.length === 0) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4", children: [_jsx("div", { className: "w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 animate-fade-in-up", children: _jsx(ShoppingBag, { className: "w-10 h-10 text-gray-300" }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-3 animate-fade-in-up", style: { animationDelay: '100ms' }, children: "Your cart is empty" }), _jsx("p", { className: "text-gray-500 mb-8 max-w-md text-center animate-fade-in-up", style: { animationDelay: '200ms' }, children: "Looks like you haven't added anything to your cart yet. Browse our products to find something you love." }), _jsx(Link, { href: `/${storeConfig.slug}`, className: "animate-fade-in-up", style: { animationDelay: '300ms' }, children: _jsx(Button, { size: "lg", className: "rounded-full px-8 h-12 text-base font-bold shadow-lg transition-transform hover:scale-105", style: { backgroundColor: primaryColor }, children: "Start Shopping" }) })] }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "container mx-auto max-w-6xl", children: [_jsxs("div", { className: "mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Link, { href: `/${storeConfig.slug}`, className: "p-2 -ml-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-black", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-black text-gray-900 tracking-tight", children: "Shopping Cart" }), _jsxs("p", { className: "text-gray-500 text-sm mt-1", children: [cart.length, " items in your cart"] })] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100", children: [_jsx("span", { className: "text-black", children: "Cart" }), _jsx("span", { className: "text-gray-300 mx-1", children: "/" }), _jsx("span", { className: "text-gray-400", children: "Checkout" }), _jsx("span", { className: "text-gray-300 mx-1", children: "/" }), _jsx("span", { className: "text-gray-400", children: "Payment" })] })] }), _jsxs("div", { className: "flex flex-col lg:flex-row gap-8 lg:gap-12", children: [_jsx("div", { className: "flex-1 space-y-6", children: cart.map((item) => (_jsxs("div", { className: "bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm flex flex-row gap-4 sm:gap-6 group transition-all hover:shadow-md hover:border-gray-200", children: [_jsx("div", { className: "w-24 h-24 sm:w-32 sm:h-32 aspect-square bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 relative", children: _jsx(Image, { src: item.product.images[0], alt: item.product.name, fill: true, className: "object-cover group-hover:scale-105 transition-transform duration-500", unoptimized: true }) }), _jsxs("div", { className: "flex-1 flex flex-col justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsx("h3", { className: "font-bold text-gray-900 text-lg leading-tight", children: item.product.name }), _jsx("p", { className: "font-black text-lg text-gray-900", children: formatCurrency(item.price * item.quantity, cartCurrency) })] }), _jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: item.variantName && (_jsx("span", { className: "text-xs font-bold px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-gray-600", children: item.variantName })) })] }), _jsxs("div", { className: "flex justify-between items-end mt-6", children: [item.product.categoryId === 'subscriptions' || item.product.contentType ? (_jsx("div", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100", children: "Digital Content" })) : (_jsxs("div", { className: "flex items-center gap-1 bg-gray-50 rounded-full p-1 border border-gray-200", children: [_jsx("button", { onClick: async () => {
                                                                    setUpdatingItemId(item.id);
                                                                    try {
                                                                        await updateCartQuantity(item.id, item.quantity - 1);
                                                                    }
                                                                    finally {
                                                                        setUpdatingItemId(null);
                                                                    }
                                                                }, className: "w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 text-gray-600", disabled: item.quantity <= 1 || updatingItemId === item.id || isCartLoading, children: updatingItemId === item.id ? (_jsx("div", { className: "w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" })) : (_jsx(Minus, { className: "w-3.5 h-3.5" })) }), _jsx("span", { className: "text-sm font-bold w-8 text-center text-gray-900", children: updatingItemId === item.id ? (_jsx("div", { className: "w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto" })) : (item.quantity) }), _jsx("button", { onClick: async () => {
                                                                    setUpdatingItemId(item.id);
                                                                    try {
                                                                        await updateCartQuantity(item.id, item.quantity + 1);
                                                                    }
                                                                    finally {
                                                                        setUpdatingItemId(null);
                                                                    }
                                                                }, className: "w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 text-gray-900", disabled: updatingItemId === item.id || isCartLoading, children: updatingItemId === item.id ? (_jsx("div", { className: "w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" })) : (_jsx(Plus, { className: "w-3.5 h-3.5" })) })] })), _jsx("button", { onClick: async () => {
                                                            setRemovingItemId(item.id);
                                                            try {
                                                                await removeFromCart(item.id);
                                                            }
                                                            finally {
                                                                setRemovingItemId(null);
                                                            }
                                                        }, className: "text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full disabled:opacity-50", "aria-label": "Remove item", disabled: removingItemId === item.id || isCartLoading, children: removingItemId === item.id ? (_jsx("div", { className: "w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" })) : (_jsx(Trash2, { className: "w-5 h-5" })) })] })] })] }, item.id))) }), _jsx("div", { className: "w-full lg:w-96 flex-shrink-0", children: _jsxs("div", { className: "bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/50 p-8 sticky top-24", children: [_jsx("h2", { className: "text-2xl font-black text-gray-900 mb-8", children: "Summary" }), _jsxs("div", { className: "space-y-4 mb-8", children: [_jsxs("div", { className: "flex justify-between text-gray-600 font-medium", children: [_jsx("span", { children: "Subtotal" }), _jsx("span", { className: "text-gray-900", children: formatCurrency(subtotal, cartCurrency) })] }), vatAmount > 0 && (_jsxs("div", { className: "flex justify-between text-gray-600 font-medium", children: [_jsx("span", { children: vatLabel }), _jsx("span", { className: "text-gray-900", children: formatCurrency(vatAmount, cartCurrency) })] })), serviceChargeAmount > 0 && (_jsxs("div", { className: "flex justify-between text-gray-600 font-medium", children: [_jsx("span", { children: "Service Charge" }), _jsx("span", { className: "text-gray-900", children: formatCurrency(serviceChargeAmount, cartCurrency) })] })), _jsxs("div", { className: "pt-6 border-t-2 border-gray-100 flex justify-between items-end mt-4", children: [_jsx("span", { className: "text-lg font-bold text-gray-900", children: "Total" }), _jsx("span", { className: "text-4xl font-black text-gray-900 tracking-tight", children: formatCurrency(total, cartCurrency) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx(Link, { href: `/${storeConfig.slug}/checkout`, children: _jsxs(Button, { className: "w-full h-14 rounded-2xl text-lg font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl", style: { backgroundColor: primaryColor, color: 'white' }, children: ["Checkout ", _jsx(ArrowRight, { className: "ml-2 w-5 h-5" })] }) }), _jsxs("div", { className: "flex items-center justify-center gap-2 text-xs font-medium text-gray-400", children: [_jsx(Lock, { className: "w-3 h-3" }), "Secure Encrypted Checkout"] })] })] }) })] })] }) }));
}
