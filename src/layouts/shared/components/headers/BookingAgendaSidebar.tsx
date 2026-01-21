'use client';

import { StoreConfig } from '../../../../lib/store-types';
import { Button } from '../../../../components/ui/button';
import { User, Sparkles, X, MoreHorizontal, Calendar, Search, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { getLayoutText, getThemeColor } from '../../../../lib/utils/asset-helpers';

interface BookingAgendaSidebarProps {
  storeConfig: StoreConfig;
  onBookClick: () => void;
}

export function BookingAgendaSidebar({ storeConfig, onBookClick }: BookingAgendaSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const categories = storeConfig.categories || [];

  // Get theme colors with fallbacks
  const sidebarBg = getThemeColor(storeConfig, 'layoutSpecific', 'sidebar', 'rgba(255,255,255,0.8)');
  const buttonBg = getThemeColor(storeConfig, 'layoutSpecific', 'button', '#1E293B');
  const borderPrimary = getThemeColor(storeConfig, 'border', 'primary', 'rgba(0,0,0,0.05)');

  return (
    <aside className="w-full md:w-72 border-r flex-shrink-0 md:h-screen md:sticky md:top-0 z-30 flex flex-col backdrop-blur-md" style={{ backgroundColor: sidebarBg, borderRightColor: borderPrimary }}>
      <div className="p-8 border-b border-gray-100/50 flex items-center justify-between md:block">
        <Link href={`/${storeConfig.slug}`} className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2 tracking-tight">
          <span className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          {storeConfig.name}
        </Link>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className={`p-6 space-y-8 overflow-y-auto md:flex-1 transition-all duration-300 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
        <Button 
          onClick={onBookClick}
          className="w-full justify-center text-white hover:opacity-90 h-12 rounded-xl font-medium shadow-lg transition-all hover:scale-[1.02]"
          style={{ backgroundColor: buttonBg }}
        >
          <Calendar className="mr-2 h-4 w-4" /> {getLayoutText(storeConfig, 'booking.bookAppointment', 'Book Appointment')}
        </Button>
        
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Menu</h3>
          <Link href={`/${storeConfig.slug}/services`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors">
            <Search className="h-4 w-4" /> Discover
          </Link>
          <Link href={`/${storeConfig.slug}/account`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors">
            <User className="h-4 w-4" /> My Profile
          </Link>
          {storeConfig.features.wishlist ? (
            <Link href={`/${storeConfig.slug}/wishlist`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors">
              <Heart className="h-4 w-4" /> Favorites
            </Link>
          ) : (
            <Link href={`/${storeConfig.slug}/services`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors">
              <Heart className="h-4 w-4" /> Favorites
            </Link>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Categories</h3>
          {categories.map(cat => (
            <Link key={cat.id} href={`/${storeConfig.slug}/categories/${cat.slug}`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors group">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-rose-500 transition-colors" />
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className={`p-6 border-t border-gray-100/50 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
         <Link href={`/${storeConfig.slug}/account`}>
           <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 text-xs font-bold">JD</div>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-bold text-slate-700 truncate">My Account</p>
                 <p className="text-xs text-slate-500 truncate">View Profile</p>
              </div>
           </div>
         </Link>
      </div>
    </aside>
  );
}
