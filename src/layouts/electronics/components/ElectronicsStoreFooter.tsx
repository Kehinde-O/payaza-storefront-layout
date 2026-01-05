'use client';

import { StoreConfig } from '@/lib/store-types';
import Link from 'next/link';
import { Zap, Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { getLayoutText, getThemeColor } from '@/lib/utils/asset-helpers';

interface ElectronicsStoreFooterProps {
  storeConfig: StoreConfig;
}

export function ElectronicsStoreFooter({ storeConfig }: ElectronicsStoreFooterProps) {
  const bgDark = getThemeColor(storeConfig, 'background', 'dark', '#0F172A');
  const textSecondary = getThemeColor(storeConfig, 'text', 'secondary', '#CBD5E1');
  
  return (
    <footer className="pt-20 pb-10" style={{ backgroundColor: bgDark, color: textSecondary }}>
       <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
             {/* Brand Column */}
             <div className="space-y-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                        <Zap className="h-5 w-5 text-white" fill="currentColor" />
                    </div>
                    <span className="font-black text-2xl tracking-tight text-white">{storeConfig.name}</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                   {storeConfig.description || "Leading the future of technology with premium electronics and cutting-edge innovation."}
                </p>
                {storeConfig.branding.socialMedia && (
                  <div className="flex gap-4">
                    {storeConfig.branding.socialMedia.facebook && (
                      <Link 
                        href={storeConfig.branding.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-slate-900 text-slate-400 hover:bg-blue-600 hover:text-white transition-all h-10 w-10 flex items-center justify-center"
                      >
                        <Facebook className="h-4 w-4" />
                      </Link>
                    )}
                    {storeConfig.branding.socialMedia.twitter && (
                      <Link 
                        href={storeConfig.branding.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-slate-900 text-slate-400 hover:bg-blue-600 hover:text-white transition-all h-10 w-10 flex items-center justify-center"
                      >
                        <Twitter className="h-4 w-4" />
                      </Link>
                    )}
                    {storeConfig.branding.socialMedia.instagram && (
                      <Link 
                        href={storeConfig.branding.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-slate-900 text-slate-400 hover:bg-blue-600 hover:text-white transition-all h-10 w-10 flex items-center justify-center"
                      >
                        <Instagram className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                )}
             </div>

             {/* Quick Links */}
             <div>
                <h4 className="font-bold text-white mb-6">Shop</h4>
                <ul className="space-y-4 text-sm font-medium">
                   <li><Link href={`/${storeConfig.slug}/products`} className="hover:text-blue-400 transition-colors">All Products</Link></li>
                   <li><Link href={`/${storeConfig.slug}/products?sort=newest`} className="hover:text-blue-400 transition-colors">{getLayoutText(storeConfig, 'electronics.newArrivals', 'New Arrivals')}</Link></li>
                   <li><Link href={`/${storeConfig.slug}/categories`} className="hover:text-blue-400 transition-colors">Collections</Link></li>
                   <li><Link href={`/${storeConfig.slug}/products?sale=true`} className="hover:text-blue-400 transition-colors">Deals & Offers</Link></li>
                </ul>
             </div>

             {/* Support */}
             <div>
                <h4 className="font-bold text-white mb-6">Support</h4>
                <ul className="space-y-4 text-sm font-medium">
                   <li><Link href={`/${storeConfig.slug}/help-center`} className="hover:text-blue-400 transition-colors">Help Center</Link></li>
                   <li><Link href={`/${storeConfig.slug}/track-order`} className="hover:text-blue-400 transition-colors">Track Order</Link></li>
                   <li><Link href={`/${storeConfig.slug}/shipping-returns`} className="hover:text-blue-400 transition-colors">Returns & Exchange</Link></li>
                   <li><Link href={`/${storeConfig.slug}/help-center`} className="hover:text-blue-400 transition-colors">Warranty Info</Link></li>
                   <li><Link href={`/${storeConfig.slug}/style-guide`} className="hover:text-blue-400 transition-colors">Style Guide</Link></li>
                </ul>
             </div>

             {/* Contact */}
             <div>
                <h4 className="font-bold text-white mb-6">Contact</h4>
                <ul className="space-y-4 text-sm font-medium">
                   <li className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-500 shrink-0" />
                      <span>123 Tech Avenue, Silicon Valley, CA 94025</span>
                   </li>
                   <li className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                      <span>+1 (555) 123-4567</span>
                   </li>
                   <li className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                      <span>support@{storeConfig.slug.replace(/-/g, '')}.com</span>
                   </li>
                </ul>
             </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
             <div className="flex gap-6">
                <Link href={`/${storeConfig.slug}/privacy`} className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href={`/${storeConfig.slug}/terms`} className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href={`/${storeConfig.slug}/cookie-policy`} className="hover:text-white transition-colors">Cookie Policy</Link>
             </div>
             <div>
                 {getLayoutText(storeConfig, 'footer.copyright', `© ${new Date().getFullYear()} ${storeConfig.name}. All rights reserved.`)}
             </div>
          </div>
       </div>
    </footer>
  );
}
