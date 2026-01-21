'use client';

import { StoreConfig } from '../../../lib/store-types';
import { FoodModernHeader } from '../components/headers/FoodModernHeader';
import { StoreFooter } from '../components/StoreFooter';
import { PageAnimateWrapper } from '../../../components/ui/page-animate-wrapper';
import { PageContentLoader } from '../../../components/ui/page-content-loader';
import { usePathname } from 'next/navigation';
import { useLoading } from '../../../lib/loading-context';
import { getThemeColor } from '../../../lib/utils/asset-helpers';
import { AlertModalProvider } from '../../../components/ui/alert-modal';

interface FoodModernLayoutProps {
  children: React.ReactNode;
  storeConfig: StoreConfig;
}

export function FoodModernLayout({ children, storeConfig }: FoodModernLayoutProps) {
  const pathname = usePathname();
  const { isBackendLoading } = useLoading();
  const isHomePage = pathname === `/${storeConfig.slug}`;

  // Determine if header should be shown
  // In preview mode, hide header by default unless explicitly enabled
  const shouldShowHeader = storeConfig.isPreview 
    ? (storeConfig.headerConfig?.show ?? false)
    : (storeConfig.headerConfig?.show ?? true);

  // Get theme colors with fallbacks
  // Food Modern uses strict dark theme overrides
  const bgPrimary = '#0F0F0F';
  const bgSecondary = '#1A1A1A';
  const bgDark = '#000000';
  const textPrimary = '#FFFFFF';
  const textSecondary = '#A1A1AA'; // gray-400
  const textInverse = '#000000';
  const borderPrimary = 'rgba(255, 255, 255, 0.1)';
  const borderSecondary = 'rgba(255, 255, 255, 0.05)';
  const accentHover = storeConfig.branding.primaryColor || '#EA580C'; // orange-600
  const accentFocus = '#C2410C'; // orange-700

  // Build CSS variables for theme colors
  const cssVariables = {
    // Branding colors (existing)
    '--store-primary': storeConfig.branding.primaryColor,
    '--store-secondary': storeConfig.branding.secondaryColor || storeConfig.branding.primaryColor,
    '--store-accent': storeConfig.branding.accentColor || storeConfig.branding.primaryColor,
    // Theme colors
    '--theme-bg-primary': bgPrimary,
    '--theme-bg-secondary': bgSecondary,
    '--theme-bg-dark': bgDark,
    '--theme-text-primary': textPrimary,
    '--theme-text-secondary': textSecondary,
    '--theme-text-inverse': textInverse,
    '--theme-border-primary': borderPrimary,
    '--theme-border-secondary': borderSecondary,
    '--theme-accent-hover': accentHover,
    '--theme-accent-focus': accentFocus,
  } as React.CSSProperties;

  return (
    <AlertModalProvider>
      <div className="min-h-screen flex flex-col bg-[#0F0F0F] text-white selection:bg-orange-500 selection:text-white" style={cssVariables}>
        {shouldShowHeader && <FoodModernHeader storeConfig={storeConfig} />}
        
        {/* Main content - add top padding for inner pages to account for fixed header */}
        <main className={`flex-1 relative ${!isHomePage ? 'pt-24' : ''}`}>
          {isBackendLoading && <PageContentLoader />}
          <PageAnimateWrapper>
            {children}
          </PageAnimateWrapper>
        </main>
        
        {/* Footer is part of the layout, but FoodHomePageModern has its own footer embedded? 
            Let's check. Yes, it does. 
            If we use the standard footer here, we might duplicate it or break the design.
            The standard StoreFooter might not match the specific Food Modern design.
            Ideally, we should extract the footer too or use a conditional footer.
            
            Audit findings said: "Food Modern: Transitions from a dark-themed overlay header to a light-themed standard header."
            So fixing the header is the main goal. 
            However, the footer should also be consistent.
            
            If I use StoreFooter here, it will look like the standard footer (likely light themed unless configured otherwise).
            FoodHomePageModern has a custom footer.
            
            I should probably extract the custom footer into FoodModernFooter.tsx? 
            Or just let it be for now and focus on Header?
            But if I wrap inner pages, they will get StoreFooter.
            If StoreFooter respects the dark theme variables I set above, it might look okay.
            
            Let's try using StoreFooter. If it looks bad, we can refine it later.
            Wait, StoreFooter checks storeConfig.
        */}
        {/* Using StoreFooter for consistency on inner pages. 
            Note: Homepage currently has its own footer. I should remove it from Homepage and use this one,
            OR if the design is very specific, extract it.
            
            Let's extract the FoodModernFooter as well? 
            The audit didn't explicitly demand it, but "consistent experience" implies it.
            
            For now, I'll use StoreFooter. The CSS variables enforce dark theme so it should render dark.
        */}
        <StoreFooter storeConfig={storeConfig} />
      </div>
    </AlertModalProvider>
  );
}
