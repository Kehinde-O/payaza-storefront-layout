'use client';

import { StoreConfig } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Zap, Menu, X, Search, User } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getLayoutText, getThemeColor, getLogoUrl } from '@/lib/utils/asset-helpers';
import { useStore } from '@/lib/store-context';
import { StoreLogo } from '@/components/ui/store-logos';

interface ElectronicsStoreHeaderProps {
  storeConfig: StoreConfig;
}

export function ElectronicsStoreHeader({ storeConfig }: ElectronicsStoreHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled
        ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 shadow-sm"
        : "bg-transparent py-5"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href={`/${storeConfig.slug}`} className="group flex items-center gap-2.5 z-50">
          {/* Show custom logo if available, otherwise show default icon */}
          {getLogoUrl(storeConfig) ? (
            <StoreLogo
              storeConfig={storeConfig}
              className="h-10 w-10 transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
              alt={storeConfig.name}
            />
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-300 shadow-lg shadow-blue-600/20">
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
          )}
          {/* Only show store name if no custom logo is present */}
          {!getLogoUrl(storeConfig) && (
            <span className="text-xl font-black tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
              {storeConfig.name}
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-gray-100/50 backdrop-blur-md p-1.5 rounded-full border border-gray-200/50">
          {[
            { label: 'Products', href: `/${storeConfig.slug}/products` },
            { label: 'Collections', href: `/${storeConfig.slug}/categories` },
            { label: 'About', href: `/${storeConfig.slug}/about` }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-5 py-2 rounded-full text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-300 hover:shadow-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden sm:flex text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all">
            <Search className="h-5 w-5" />
          </Button>

          <Link href={`/${storeConfig.slug}/account`}>
            <Button variant="ghost" size="icon" className="hidden md:flex text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          <Link href={`/${storeConfig.slug}/cart`}>
            <Button variant="ghost" size="icon" className="relative text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all h-10 w-10 sm:h-9 sm:w-9">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-900 hover:bg-gray-100 rounded-full h-10 w-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 bg-white z-40 pt-28 px-6 md:hidden transition-all duration-300 ease-in-out transform",
        isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      )}>
        {/* Mobile Search */}
        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-100 border-none text-gray-900 focus:ring-2 focus:ring-blue-500/20"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex flex-col gap-6 text-3xl font-bold text-gray-900 tracking-tight">
          <Link href={`/${storeConfig.slug}/products`} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors">Products</Link>
          <Link href={`/${storeConfig.slug}/categories`} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors">Collections</Link>
          <Link href={`/${storeConfig.slug}/about`} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors">About</Link>
          <Link href={`/${storeConfig.slug}/account`} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors">Account</Link>
        </div>

        <div className="mt-12 pt-12 border-t border-gray-100 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h4 className="font-bold text-gray-900 mb-2">Support</h4>
            <p className="text-sm text-gray-500">24/7 Customer Care</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl">
            <h4 className="font-bold text-blue-900 mb-2">{getLayoutText(storeConfig, 'electronics.newArrivals', 'New Arrivals')}</h4>
            <p className="text-sm text-blue-600">Check out latest tech</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
