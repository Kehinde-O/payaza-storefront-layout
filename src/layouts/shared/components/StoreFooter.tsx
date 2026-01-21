'use client';

import Link from 'next/link';
import { StoreConfig } from '../../../lib/store-types';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone, Share2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { DotPattern } from '../../../components/ui/background-patterns';
import { cn } from '../../../lib/utils';
import { useState } from 'react';
import { useToast } from '../../../components/ui/toast';
import { getLayoutText, getThemeColor, getLogoUrl } from '../../../lib/utils/asset-helpers';
import { StoreLogo } from '../../../components/ui/store-logos';
import { useStore } from '../../../lib/store-context';

interface StoreFooterProps {
  storeConfig: StoreConfig;
}

export function StoreFooter({ storeConfig: initialConfig }: StoreFooterProps) {
  const { store } = useStore();
  const storeConfig = store || initialConfig;
  
  const currentYear = new Date().getFullYear();
  const primaryColor = storeConfig.branding.primaryColor || '#000000';
  const isDarkTheme = storeConfig.branding.theme === 'dark';
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  // Get theme colors with fallbacks
  const bgPrimary = getThemeColor(storeConfig, 'background', 'primary', isDarkTheme ? '#000000' : '#F8FAFC');
  const bgSecondary = getThemeColor(storeConfig, 'background', 'secondary', isDarkTheme ? '#0a0a0f' : '#FFFFFF');
  const bgDark = getThemeColor(storeConfig, 'background', 'dark', '#000000');
  const textPrimary = getThemeColor(storeConfig, 'text', 'primary', isDarkTheme ? '#FFFFFF' : '#1F2937');
  const textSecondary = getThemeColor(storeConfig, 'text', 'secondary', isDarkTheme ? '#9CA3AF' : '#6B7280');
  const textMuted = getThemeColor(storeConfig, 'text', 'muted', isDarkTheme ? '#6B7280' : '#9CA3AF');
  const borderPrimary = getThemeColor(storeConfig, 'border', 'primary', isDarkTheme ? 'rgba(255,255,255,0.1)' : '#E2E8F0');
  const accentFocus = getThemeColor(storeConfig, 'accent', 'focus', '');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    addToast('Thank you for subscribing!', 'success');
    setEmail('');
  };

  // Build footer background style
  const footerBg = isDarkTheme
    ? `linear-gradient(to bottom, ${bgDark}CC, ${bgSecondary}, ${bgDark})`
    : bgPrimary;

  return (
    <footer
      data-section="footer"
      className={cn(
        "relative border-t overflow-hidden backdrop-blur-xl"
      )}
      style={{
        background: footerBg,
        borderTopColor: borderPrimary,
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none">
        <DotPattern 
          color={isDarkTheme ? "#3b82f6" : "#94a3b8"} 
          cx={1} 
          cy={1} 
          cr={1} 
          width={20} 
          height={20} 
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        
        {/* Newsletter Section - Modern Card Style */}
        <div className="mb-16 relative">
          <div className={cn(
            "rounded-2xl p-8 md:p-12 shadow-sm border flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 overflow-hidden backdrop-blur-xl",
            isDarkTheme
              ? "bg-black/40 border-white/10"
              : "bg-white border-slate-100"
          )}>
            {/* Decorative accent */}
            <div 
              className="absolute top-0 left-0 w-2 h-full" 
              style={{ backgroundColor: primaryColor }}
            />
            
            <div className="w-full md:w-1/2 space-y-2">
              <h3 className={cn(
                "text-2xl md:text-3xl font-bold",
                isDarkTheme ? "text-white" : "text-gray-900"
              )}>
                {getLayoutText(storeConfig, 'footer.newsletter.title', 'Join our newsletter')}
              </h3>
              <p className={cn(
                "text-lg",
                isDarkTheme ? "text-gray-400" : "text-gray-500"
              )}>
                {getLayoutText(storeConfig, 'footer.newsletter.subtitle', 'Get 10% off your first order and stay up to date with our latest offers.')}
              </p>
            </div>
            
            <div className="w-full md:w-1/2">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5",
                    isDarkTheme ? "text-gray-500" : "text-gray-400"
                  )} />
                  <input 
                    type="email" 
                    placeholder={getLayoutText(storeConfig, 'footer.newsletter.placeholder', 'Enter your email address')} 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all",
                      isDarkTheme
                        ? "bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                        : "bg-gray-50 border border-gray-200"
                    )}
                    style={{ 
                      '--tw-ring-color': primaryColor,
                      borderColor: 'transparent'
                    } as React.CSSProperties}
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl py-6 px-8 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  style={{ 
                    backgroundColor: primaryColor,
                    color: '#ffffff'
                  }}
                >
                  {isSubmitting ? getLayoutText(storeConfig, 'common.account', 'Subscribing...') : getLayoutText(storeConfig, 'footer.newsletter.button', 'Subscribe')}
                </Button>
              </form>
              <p className={cn(
                "text-xs mt-3 pl-1",
                isDarkTheme ? "text-gray-500" : "text-gray-400"
              )}>
                {getLayoutText(storeConfig, 'footer.newsletter.disclaimer', 'By subscribing you agree to our')}                   <Link href={`/${storeConfig.slug}/privacy`} className={cn(
                  "underline",
                  isDarkTheme ? "hover:text-gray-300" : "hover:text-gray-600"
                )}>{getLayoutText(storeConfig, 'footer.links.privacy', 'Privacy Policy')}</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href={`/${storeConfig.slug}`} className="inline-block">
            <div className="flex items-center gap-2">
              <StoreLogo
                storeConfig={storeConfig}
                className="h-10 w-10"
                alt={storeConfig.name}
              />
              {/* Only show store name if no custom logo is present */}
              {!getLogoUrl(storeConfig) && (
                <span 
                    className={cn(
                      "text-2xl font-extrabold tracking-tight",
                      isDarkTheme ? "text-white" : ""
                    )}
                  style={{ 
                      color: isDarkTheme ? undefined : primaryColor,
                  }}
                >
                  {storeConfig.name}
                </span>
              )}
            </div>
            </Link>
            
            <p className={cn(
              "text-base leading-relaxed max-w-sm",
              isDarkTheme ? "text-gray-400" : "text-gray-500"
            )}>
              {storeConfig.description || "Experience the best in quality and style. We are dedicated to providing you with an exceptional shopping experience."}
            </p>

            {storeConfig.branding.socialMedia && (
              <div className="flex items-center gap-4 pt-2">
                {storeConfig.branding.socialMedia.facebook && (
                  <a 
                    href={storeConfig.branding.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-110 shadow-sm",
                      isDarkTheme
                        ? "bg-white/10 border border-white/20 text-gray-400 hover:text-white hover:border-white/40"
                        : "bg-white border border-gray-200 text-gray-500 hover:text-white hover:border-transparent"
                    )}
                    style={{
                      '--hover-bg': primaryColor
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = primaryColor;
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = primaryColor;
                    }}
                    onMouseLeave={(e) => {
                      if (isDarkTheme) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.color = '#9ca3af';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      } else {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }
                    }}
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {storeConfig.branding.socialMedia.twitter && (
                  <a 
                    href={storeConfig.branding.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-110 shadow-sm",
                      isDarkTheme
                        ? "bg-white/10 border border-white/20 text-gray-400 hover:text-white hover:border-white/40"
                        : "bg-white border border-gray-200 text-gray-500 hover:text-white hover:border-transparent"
                    )}
                    style={{
                      '--hover-bg': primaryColor
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = primaryColor;
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = primaryColor;
                    }}
                    onMouseLeave={(e) => {
                      if (isDarkTheme) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.color = '#9ca3af';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      } else {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }
                    }}
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {storeConfig.branding.socialMedia.instagram && (
                  <a 
                    href={storeConfig.branding.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-110 shadow-sm",
                      isDarkTheme
                        ? "bg-white/10 border border-white/20 text-gray-400 hover:text-white hover:border-white/40"
                        : "bg-white border border-gray-200 text-gray-500 hover:text-white hover:border-transparent"
                    )}
                    style={{
                      '--hover-bg': primaryColor
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = primaryColor;
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = primaryColor;
                    }}
                    onMouseLeave={(e) => {
                      if (isDarkTheme) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.color = '#9ca3af';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      } else {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }
                    }}
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {storeConfig.branding.socialMedia.pinterest && (
                  <a 
                    href={storeConfig.branding.socialMedia.pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-110 shadow-sm",
                      isDarkTheme
                        ? "bg-white/10 border border-white/20 text-gray-400 hover:text-white hover:border-white/40"
                        : "bg-white border border-gray-200 text-gray-500 hover:text-white hover:border-transparent"
                    )}
                    style={{
                      '--hover-bg': primaryColor
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = primaryColor;
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = primaryColor;
                    }}
                    onMouseLeave={(e) => {
                      if (isDarkTheme) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.color = '#9ca3af';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      } else {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }
                    }}
                  >
                    <Share2 className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">

            {/* Column 1: Shop */}
            <div>
              <h4 className={cn(
                "font-bold text-lg mb-6",
                isDarkTheme ? "text-white" : "text-gray-900"
              )}>Shop</h4>
              <ul className="space-y-4">
                {(storeConfig.navigation.main.length > 0 ? storeConfig.navigation.main.slice(0, 5) : [
                  { label: 'All Products', href: '/products' },
                  { label: 'New Arrivals', href: '/products?sort=newest' },
                  { label: 'Featured', href: '/products?featured=true' },
                ]).map((link, index) => (
                  <li key={`${index}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href.startsWith('/') ? `/${storeConfig.slug}${link.href}` : link.href}
                      className={cn(
                        "transition-colors flex items-center group",
                        isDarkTheme ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                      )}
                    >
                      <span className="relative">
                      {link.label}
                        <span className={cn(
                          "absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full",
                          isDarkTheme ? "bg-white" : "bg-gray-900"
                        )}></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Support */}
            <div>
              <h4 className={cn(
                "font-bold text-lg mb-6",
                isDarkTheme ? "text-white" : "text-gray-900"
              )}>Support</h4>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href={`/${storeConfig.slug}/help-center`} 
                    className={cn(
                      "transition-colors group flex items-center",
                      isDarkTheme ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    <span className="relative">Help Center<span className={cn(
                      "absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full",
                      isDarkTheme ? "bg-white" : "bg-gray-900"
                    )}></span></span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${storeConfig.slug}/shipping-returns`} 
                    className={cn(
                      "transition-colors group flex items-center",
                      isDarkTheme ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    <span className="relative">Shipping & Returns<span className={cn(
                      "absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full",
                      isDarkTheme ? "bg-white" : "bg-gray-900"
                    )}></span></span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${storeConfig.slug}/track-order`} 
                    className={cn(
                      "transition-colors group flex items-center",
                      isDarkTheme ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    <span className="relative">Track Order<span className={cn(
                      "absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full",
                      isDarkTheme ? "bg-white" : "bg-gray-900"
                    )}></span></span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${storeConfig.slug}/style-guide`} 
                    className={cn(
                      "transition-colors group flex items-center",
                      isDarkTheme ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    <span className="relative">Style Guide<span className={cn(
                      "absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full",
                      isDarkTheme ? "bg-white" : "bg-gray-900"
                    )}></span></span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact */}
                <div>
              <h4 className={cn(
                "font-bold text-lg mb-6",
                isDarkTheme ? "text-white" : "text-gray-900"
              )}>Contact</h4>
              <ul className="space-y-4">
                {storeConfig.contactInfo?.address && 
                 (storeConfig.contactInfo.address.street || 
                  storeConfig.contactInfo.address.city || 
                  storeConfig.contactInfo.address.state || 
                  storeConfig.contactInfo.address.zipCode) && (
                  <li className={cn(
                    "flex items-start gap-3",
                    isDarkTheme ? "text-gray-400" : "text-gray-500"
                  )}>
                    <MapPin className="h-5 w-5 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                    <span>
                      {storeConfig.contactInfo.address.street && `${storeConfig.contactInfo.address.street}, `}
                      {storeConfig.contactInfo.address.city && `${storeConfig.contactInfo.address.city}, `}
                      {storeConfig.contactInfo.address.state && `${storeConfig.contactInfo.address.state} `}
                      {storeConfig.contactInfo.address.zipCode && storeConfig.contactInfo.address.zipCode}
                    </span>
                  </li>
                )}
                {storeConfig.contactInfo?.email && (
                  <li className={cn(
                    "flex items-center gap-3",
                    isDarkTheme ? "text-gray-400" : "text-gray-500"
                  )}>
                    <Mail className="h-5 w-5 shrink-0" style={{ color: primaryColor }} />
                    <a href={`mailto:${storeConfig.contactInfo.email}`} className={cn(
                      "transition-colors",
                      isDarkTheme ? "hover:text-white" : "hover:text-gray-900"
                    )}>{storeConfig.contactInfo.email}</a>
                  </li>
                )}
                {storeConfig.contactInfo?.phone && (
                  <li className={cn(
                    "flex items-center gap-3",
                    isDarkTheme ? "text-gray-400" : "text-gray-500"
                  )}>
                    <Phone className="h-5 w-5 shrink-0" style={{ color: primaryColor }} />
                    <a href={`tel:${storeConfig.contactInfo.phone.replace(/\D/g, '')}`} className={cn(
                      "transition-colors",
                      isDarkTheme ? "hover:text-white" : "hover:text-gray-900"
                    )}>{storeConfig.contactInfo.phone}</a>
                  </li>
                )}
                  </ul>
                </div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className={cn(
          "pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4",
          isDarkTheme ? "border-white/10" : "border-slate-200"
        )}>
          <p className={cn(
            "text-sm font-medium",
            isDarkTheme ? "text-gray-500" : "text-gray-500"
          )}>
            &copy; {currentYear} {storeConfig.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-4 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all w-full md:w-auto justify-center md:justify-end">
             {/* Payment Icons Placeholder - Visual only */}
             <div className="flex gap-2 flex-wrap justify-center md:justify-end max-w-full">
                {['Bank Transfer', 'Visa', 'Mastercard', 'Verve', 'Afrigo', 'ApplePay', 'Google Pay', 'Mobile Money', 'Payaza MoneyTag™'].map((method, index) => (
                  <div key={method} className={`h-8 px-2 bg-white border border-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-600 shadow-sm whitespace-nowrap ${index >= 6 ? 'hidden lg:flex' : 'flex'}`}>
                    {method}
                  </div>
                ))}
                {['Bank Transfer', 'Visa', 'Mastercard', 'Verve', 'Afrigo', 'ApplePay', 'Google Pay', 'Mobile Money', 'Payaza MoneyTag™'].length > 6 && (
                  <div 
                    className="h-8 px-2 bg-gray-50 border border-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm cursor-help lg:hidden"
                    title={['Bank Transfer', 'Visa', 'Mastercard', 'Verve', 'Afrigo', 'ApplePay', 'Google Pay', 'Mobile Money', 'Payaza MoneyTag™'].slice(6).join(', ')}
                  >
                    +{['Bank Transfer', 'Visa', 'Mastercard', 'Verve', 'Afrigo', 'ApplePay', 'Google Pay', 'Mobile Money', 'Payaza MoneyTag™'].length - 6} more
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
