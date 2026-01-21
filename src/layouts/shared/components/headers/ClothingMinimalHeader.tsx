'use client';

import { StoreConfig } from '../../../../lib/store-types';
import { Button } from '../../../../components/ui/button';
import { Sheet } from '../../../../components/ui/sheet';
import { CheckoutButton } from '../../../../components/ui/checkout-button';
import { useStore } from '../../../../lib/store-context';
import { ImageWithFallback } from '../../../../components/ui/image-with-fallback';
import { ShoppingBag, Menu, Search, Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { formatCurrency } from '../../../../lib/utils';
import { getLayoutText, getLogoUrl } from '../../../../lib/utils/asset-helpers';
import { StoreLogo } from '../../../../components/ui/store-logos';
import { useAuth } from '../../../../lib/auth-context';
import { AvatarImage } from '../../../../components/ui/avatar-image';
import { User } from 'lucide-react';

interface ClothingMinimalHeaderProps {
  storeConfig: StoreConfig;
}

export function ClothingMinimalHeader({ storeConfig }: ClothingMinimalHeaderProps) {
  const { cart, removeFromCart, updateCartQuantity, isCartOpen, setIsCartOpen, cartTotal, cartCount } = useStore();
  const { isAuthenticated, user } = useAuth();

  const layoutConfig = storeConfig.layoutConfig;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {/* Centered Minimal Header */}
      {layoutConfig?.sections?.header?.show !== false && (
        <header className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-sm transition-all duration-300 border-b border-transparent hover:border-gray-100">
          <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)} className="hover:bg-gray-100 rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
              {storeConfig.features.search && (
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="hidden md:flex hover:bg-gray-100 rounded-full">
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Only show store name if no custom logo is present */}
            {!getLogoUrl(storeConfig) && (
              <Link href={`/${storeConfig.slug}`} className="text-xl md:text-2xl font-bold tracking-tight absolute left-1/2 -translate-x-1/2 uppercase whitespace-nowrap">
                {storeConfig.name}
              </Link>
            )}
            {/* Show logo if available */}
            {getLogoUrl(storeConfig) && (
              <Link href={`/${storeConfig.slug}`} className="absolute left-1/2 -translate-x-1/2">
                <StoreLogo
                  storeConfig={storeConfig}
                  className="h-10 w-10 transition-all duration-300 hover:opacity-90"
                  alt={storeConfig.name}
                />
              </Link>
            )}

            <div className="flex items-center gap-6">
              {isAuthenticated && user ? (
                <Link href={`/${storeConfig.slug}/account`} className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-gray-600">
                  {user.avatar ? (
                    <div className="h-6 w-6 rounded-full overflow-hidden">
                      <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}` || 'User'} />
                    </div>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Link>
              ) : (
                <Link href={`/auth/login?callbackUrl=/${storeConfig.slug}`} className="hidden md:block text-sm font-medium hover:text-gray-600">
                  {storeConfig.headerConfig?.loginButtonText || 'Log In'}
                </Link>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)} className="relative hover:bg-gray-100 rounded-full">
                <ShoppingBag className="h-5 w-5" />
                {isClient && cartCount > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 bg-black rounded-full animate-pulse" />
                )}
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Search Overlay */}
      {isSearchOpen && storeConfig.features.search && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md pt-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={getLayoutText(storeConfig, 'header.searchPlaceholder', 'Search products...')}
                autoFocus
                className="w-full pl-12 pr-4 py-4 text-lg border-b-2 border-black focus:outline-none"
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cart Sheet */}
      <Sheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title={`Shopping Bag (${cartCount})`} side="right">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500">{getLayoutText(storeConfig, 'header.cartEmpty', 'Your bag is empty.')}</p>
            <Button onClick={() => setIsCartOpen(false)} variant="outline" className="mt-4">
              {getLayoutText(storeConfig, 'common.continueShopping', 'Continue Shopping')}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-100 flex-shrink-0 overflow-hidden relative">
                    <ImageWithFallback src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                      <p className="text-gray-500 text-xs mt-1">{item.variantName}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-full">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-100 rounded-full"><Minus className="h-3 w-3" /></button>
                        <span className="text-xs font-medium px-2">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-100 rounded-full"><Plus className="h-3 w-3" /></button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-sm">{formatCurrency(item.price * item.quantity, item.product?.currency || storeConfig.settings?.currency || 'USD')}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between font-medium text-lg">
                <span>Subtotal</span>
                <span>{formatCurrency(cartTotal, storeConfig.settings?.currency || 'USD')}</span>
              </div>
              <p className="text-xs text-gray-500 text-center">Shipping and taxes calculated at checkout.</p>
              <CheckoutButton
                storeConfig={storeConfig}
                className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-full font-bold"
              />
            </div>
          </div>
        )}
      </Sheet>

      {/* Menu Sheet */}
      <Sheet isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} title="Menu" side="left">
        <div className="pt-4 pb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </div>
        <nav className="flex flex-col space-y-6 text-lg font-medium">
          <Link href={`/${storeConfig.slug}/products`} onClick={() => setIsMenuOpen(false)} className="hover:text-gray-500">Shop All</Link>
          <Link href={`/${storeConfig.slug}/categories`} onClick={() => setIsMenuOpen(false)} className="hover:text-gray-500">Categories</Link>
          <div className="h-px bg-gray-100 my-2" />
          <Link href={`/${storeConfig.slug}/about`} onClick={() => setIsMenuOpen(false)} className="hover:text-gray-500 text-base font-normal">Our Story</Link>
          <Link href={`/${storeConfig.slug}/contact`} onClick={() => setIsMenuOpen(false)} className="hover:text-gray-500 text-base font-normal">Contact</Link>
          <div className="mt-auto pt-12 text-sm font-normal text-gray-500 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link href={`/${storeConfig.slug}/account`} className="hover:text-black transition-colors">My Account</Link>
                <Link href={`/auth/logout?callbackUrl=/${storeConfig.slug}`} className="hover:text-black transition-colors">Sign Out</Link>
              </>
            ) : (
              <>
                <Link href={`/auth/login?callbackUrl=/${storeConfig.slug}`} className="hover:text-black transition-colors">Sign In</Link>
                <Link href={`/auth/register?callbackUrl=/${storeConfig.slug}`} className="hover:text-black transition-colors">Create Account</Link>
              </>
            )}
          </div>
        </nav>
      </Sheet>
    </>
  );
}
