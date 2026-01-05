'use client';

import { StoreConfig } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store-context';
import { formatCurrency } from '@/lib/utils';
import { calculateVAT, calculateServiceCharge, getVATLabel } from '@/lib/utils/fee-calculations';

interface CartPageProps {
  storeConfig: StoreConfig;
}

export function CartPage({ storeConfig }: CartPageProps) {
  const primaryColor = storeConfig.branding.primaryColor;
  const { cart, updateCartQuantity, removeFromCart, cartTotal, isCartLoading } = useStore();
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Helper function to determine cart currency consistently
  const getCartCurrency = (): string => {
    if (cart.length === 0) {
      return storeConfig.settings?.currency || 'USD';
    }

    // Get currencies from cart items
    const currencies = cart
      .map(item => item.product?.currency)
      .filter(Boolean) as string[];

    if (currencies.length === 0) {
      return storeConfig.settings?.currency || 'USD';
    }

    // If all items have the same currency, use it
    const uniqueCurrencies = [...new Set(currencies)];
    if (uniqueCurrencies.length === 1) {
      return uniqueCurrencies[0];
    }

    // If mixed currencies, use the most common one
    const currencyCounts: Record<string, number> = {};
    currencies.forEach(currency => {
      currencyCounts[currency] = (currencyCounts[currency] || 0) + 1;
    });

    const mostCommonCurrency = Object.entries(currencyCounts).reduce((a, b) =>
      currencyCounts[a[0]] > currencyCounts[b[0]] ? a : b
    )[0];

    return mostCommonCurrency;
  };

  const cartCurrency = getCartCurrency();
  const subtotal = cartTotal;

  // Calculate VAT and service charge using store configuration
  const vatAmount = calculateVAT(
    subtotal,
    storeConfig.settings?.vat,
    storeConfig.settings?.taxRate
  );
  const serviceChargeAmount = calculateServiceCharge(
    subtotal,
    storeConfig.settings?.serviceCharge,
    'online'
  );
  const vatLabel = getVATLabel(storeConfig.settings?.vat, storeConfig.settings?.taxRate);
  // Calculate total (shipping will be calculated at checkout)
  const total = subtotal + vatAmount + serviceChargeAmount;

  if (!isClient) return null; // Avoid hydration mismatch

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 animate-fade-in-up">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Looks like you haven&apos;t added anything to your cart yet. Browse our products to find something you love.
        </p>
        <Link href={`/${storeConfig.slug}`} className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Button
            size="lg"
            className="rounded-full px-8 h-12 text-base font-bold shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: primaryColor }}
          >
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb / Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/${storeConfig.slug}`} className="p-2 -ml-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
              <p className="text-gray-500 text-sm mt-1">{cart.length} items in your cart</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <span className="text-black">Cart</span>
            <span className="text-gray-300 mx-1">/</span>
            <span className="text-gray-400">Checkout</span>
            <span className="text-gray-300 mx-1">/</span>
            <span className="text-gray-400">Payment</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm flex flex-row gap-4 sm:gap-6 group transition-all hover:shadow-md hover:border-gray-200">
                <div className="w-24 h-24 sm:w-32 sm:h-32 aspect-square bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.product.name}</h3>
                      <p className="font-black text-lg text-gray-900">{formatCurrency(item.price * item.quantity, cartCurrency)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* Note: Variant display logic needs to be adapted based on actual variant data structure */}
                      {item.variantName && (
                        <span className="text-xs font-bold px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-gray-600">
                          {item.variantName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-6">
                    {/* Hide quantity selector for subscriptions and digital content */}
                    {item.product.categoryId === 'subscriptions' || (item.product as any).contentType ? (
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        Digital Content
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1 border border-gray-200">
                        <button
                          onClick={async () => {
                            setUpdatingItemId(item.id);
                            try {
                              await updateCartQuantity(item.id, item.quantity - 1);
                            } finally {
                              setUpdatingItemId(null);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 text-gray-600"
                          disabled={item.quantity <= 1 || updatingItemId === item.id || isCartLoading}
                        >
                          {updatingItemId === item.id ? (
                            <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Minus className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="text-sm font-bold w-8 text-center text-gray-900">
                          {updatingItemId === item.id ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={async () => {
                            setUpdatingItemId(item.id);
                            try {
                              await updateCartQuantity(item.id, item.quantity + 1);
                            } finally {
                              setUpdatingItemId(null);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 text-gray-900"
                          disabled={updatingItemId === item.id || isCartLoading}
                        >
                          {updatingItemId === item.id ? (
                            <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    <button
                      onClick={async () => {
                        setRemovingItemId(item.id);
                        try {
                          await removeFromCart(item.id);
                        } finally {
                          setRemovingItemId(null);
                        }
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full disabled:opacity-50"
                      aria-label="Remove item"
                      disabled={removingItemId === item.id || isCartLoading}
                    >
                      {removingItemId === item.id ? (
                        <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/50 p-8 sticky top-24">
              <h2 className="text-2xl font-black text-gray-900 mb-8">Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(subtotal, cartCurrency)}</span>
                </div>
                {vatAmount > 0 && (
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>{vatLabel}</span>
                    <span className="text-gray-900">{formatCurrency(vatAmount, cartCurrency)}</span>
                  </div>
                )}
                {serviceChargeAmount > 0 && (
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Service Charge</span>
                    <span className="text-gray-900">{formatCurrency(serviceChargeAmount, cartCurrency)}</span>
                  </div>
                )}

                <div className="pt-6 border-t-2 border-gray-100 flex justify-between items-end mt-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-4xl font-black text-gray-900 tracking-tight">{formatCurrency(total, cartCurrency)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link href={`/${storeConfig.slug}/checkout`}>
                  <Button
                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl"
                    style={{ backgroundColor: primaryColor, color: 'white' }}
                  >
                    Checkout <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>

                <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
                  <Lock className="w-3 h-3" />
                  Secure Encrypted Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
