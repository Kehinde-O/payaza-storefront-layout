'use client';

import { StoreConfig } from '../../../../lib/store-types';
import { Button } from '../../../../components/ui/button';
import { Modal } from '../../../../components/ui/modal';
import { useToast } from '../../../../components/ui/toast';
import { Menu as MenuIcon, Search, X, Calendar, Clock, Users, Mail, Phone, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getLayoutText, getLogoUrl } from '../../../../lib/utils/asset-helpers';
import { StoreLogo } from '../../../../components/ui/store-logos';

interface FoodModernHeaderProps {
  storeConfig: StoreConfig;
}

export function FoodModernHeader({ storeConfig }: FoodModernHeaderProps) {
  const { addToast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reservationStep, setReservationStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setReservationStep(2);
      addToast('Table reserved successfully!', 'success');
    }, 1500);
  };

  const closeReservation = () => {
    setIsReservationOpen(false);
    setTimeout(() => setReservationStep(1), 300);
  };

  const scrollToMenu = () => {
    // If on homepage, scroll to menu section
    if (window.location.pathname === `/${storeConfig.slug}`) {
      const menuSection = document.getElementById('menu-section');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on other pages, navigate to menu page (if exists) or homepage anchor
      window.location.href = `/${storeConfig.slug}#menu-section`;
    }
  };

  return (
    <>
      {/* Navigation Overlay */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-[#0F0F0F]/95 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Show logo if available, otherwise show store name */}
          {getLogoUrl(storeConfig) ? (
            <Link href={`/${storeConfig.slug}`} className="relative z-50">
              <StoreLogo
                storeConfig={storeConfig}
                className="h-10 w-10 transition-all duration-300 hover:opacity-90"
                alt={storeConfig.name}
              />
            </Link>
          ) : (
            <Link href={`/${storeConfig.slug}`} className="text-2xl font-black tracking-tighter uppercase relative z-50 group text-white">
              {storeConfig.name}
              <span className="text-orange-500 group-hover:text-white transition-colors duration-300">.</span>
            </Link>
          )}

          <div className="hidden md:flex items-center gap-10 text-xs font-bold tracking-[0.2em] uppercase text-white">
            <button onClick={scrollToMenu} className="hover:text-orange-500 transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all">Menu</button>
            <button onClick={() => setIsReservationOpen(true)} className="hover:text-orange-500 transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all">Reservations</button>
            <Link href={`/${storeConfig.slug}/about`} className="hover:text-orange-500 transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all">Story</Link>
            <Link href={`/${storeConfig.slug}/contact`} className="hover:text-orange-500 transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all">Contact</Link>
          </div>

          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="text-white hover:text-orange-500 hover:bg-white/5 rounded-full md:hidden" onClick={() => setIsMenuOpen(true)}>
              <MenuIcon className="h-6 w-6" />
            </Button>
            {storeConfig.features.search && (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-white hover:text-orange-500 hover:bg-white/5 rounded-full hidden md:flex">
                <Search className="h-5 w-5" />
              </Button>
            )}
            <Button
              onClick={() => setIsReservationOpen(true)}
              className="bg-white text-black hover:bg-orange-500 hover:text-white rounded-full px-8 font-bold uppercase tracking-wider text-xs h-10 transition-all duration-300 hidden sm:flex"
            >
              Book Table
            </Button>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {isSearchOpen && storeConfig.features.search && (
        <div className="fixed inset-0 z-50 bg-[#0F0F0F]/98 backdrop-blur-xl pt-20">
          <div className="container mx-auto px-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder={getLayoutText(storeConfig, 'header.searchPlaceholder', 'Search menu items...')}
                autoFocus
                className="w-full pl-14 pr-4 py-6 text-xl bg-transparent border-b-2 border-orange-500/50 text-white focus:outline-none focus:border-orange-500"
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-50 bg-[#0F0F0F] transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-8 text-white">
          <div className="flex justify-between items-center mb-12">
            {/* Only show store name if no custom logo is present */}
            {!getLogoUrl(storeConfig) ? (
              <span className="text-2xl font-black uppercase">{storeConfig.name}<span className="text-orange-500">.</span></span>
            ) : (
              <StoreLogo
                storeConfig={storeConfig}
                className="h-10 w-10"
                alt={storeConfig.name}
              />
            )}
            <button onClick={() => setIsMenuOpen(false)} className="text-white hover:text-orange-500">
              <X className="h-8 w-8" />
            </button>
          </div>
          <div className="flex flex-col gap-8 text-2xl font-black uppercase tracking-tight">
            <button onClick={() => { scrollToMenu(); setIsMenuOpen(false); }} className="text-left hover:text-orange-500">Menu</button>
            <button onClick={() => { setIsReservationOpen(true); setIsMenuOpen(false); }} className="text-left hover:text-orange-500">Reservations</button>
            <Link href={`/${storeConfig.slug}/about`} onClick={() => setIsMenuOpen(false)} className="hover:text-orange-500">Story</Link>
            <Link href={`/${storeConfig.slug}/contact`} onClick={() => setIsMenuOpen(false)} className="hover:text-orange-500">Contact</Link>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      <Modal isOpen={isReservationOpen} onClose={closeReservation} title="Table Reservation" className="bg-[#1A1A1A] text-white border border-white/10 rounded-none">
        {reservationStep === 1 ? (
          <form onSubmit={handleReservationSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input type="date" required className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-none focus:outline-none focus:border-orange-500 text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <select required className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-none focus:outline-none focus:border-orange-500 text-sm text-gray-300">
                    <option>18:00</option>
                    <option>18:30</option>
                    <option>19:00</option>
                    <option>19:30</option>
                    <option>20:00</option>
                    <option>20:30</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Guests</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select required className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-none focus:outline-none focus:border-orange-500 text-sm text-gray-300">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} People</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Contact Details</label>
              <div className="space-y-3">
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input type="text" placeholder="Full Name" required className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-none focus:outline-none focus:border-orange-500 text-sm" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input type="email" placeholder="Email Address" required className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-none focus:outline-none focus:border-orange-500 text-sm" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input type="tel" placeholder="Phone Number" required className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-none focus:outline-none focus:border-orange-500 text-sm" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-[0.2em] rounded-none mt-4">
              {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
            </Button>
          </form>
        ) : (
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight">Confirmed</h3>
            <p className="text-gray-400">Your table has been reserved. Check your email for details.</p>
            <Button onClick={closeReservation} className="bg-white text-black hover:bg-gray-200 rounded-none px-10 h-12 uppercase tracking-wider font-bold">
              Close
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
