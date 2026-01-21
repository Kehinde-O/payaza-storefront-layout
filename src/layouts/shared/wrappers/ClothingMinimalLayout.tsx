'use client';

import { StoreConfig } from '../../../lib/store-types';
import { ClothingMinimalHeader } from '../components/headers/ClothingMinimalHeader';
import { StoreFooter } from '../components/StoreFooter';
import { PageAnimateWrapper } from '../../../components/ui/page-animate-wrapper';
import { PageContentLoader } from '../../../components/ui/page-content-loader';
import { usePathname } from 'next/navigation';
import { useLoading } from '../../../lib/loading-context';
import { getThemeColor } from '../../../lib/utils/asset-helpers';
import { AlertModalProvider } from '../../../components/ui/alert-modal';

interface ClothingMinimalLayoutProps {
  children: React.ReactNode;
  storeConfig: StoreConfig;
}

export function ClothingMinimalLayout({ children, storeConfig }: ClothingMinimalLayoutProps) {
  const pathname = usePathname();
  const { isBackendLoading } = useLoading();
  const isHomePage = pathname === `/${storeConfig.slug}`;

  // Determine if header should be shown
  // In preview mode, hide header by default unless explicitly enabled
  const shouldShowHeader = storeConfig.isPreview 
    ? (storeConfig.headerConfig?.show ?? false)
    : (storeConfig.headerConfig?.show ?? true);

  // Get theme colors with fallbacks
  const bgPrimary = getThemeColor(storeConfig, 'background', 'primary', '#FFFFFF');
  const bgSecondary = getThemeColor(storeConfig, 'background', 'secondary', '#FAFAFA');
  const bgDark = getThemeColor(storeConfig, 'background', 'dark', '#0F0F0F');
  const textPrimary = getThemeColor(storeConfig, 'text', 'primary', '#1F2937');
  const textSecondary = getThemeColor(storeConfig, 'text', 'secondary', '#6B7280');
  const textInverse = getThemeColor(storeConfig, 'text', 'inverse', '#FFFFFF');
  const borderPrimary = getThemeColor(storeConfig, 'border', 'primary', '#E5E7EB');
  const borderSecondary = getThemeColor(storeConfig, 'border', 'secondary', '#F3F4F6');
  const accentHover = getThemeColor(storeConfig, 'accent', 'hover', storeConfig.branding.primaryColor);
  const accentFocus = getThemeColor(storeConfig, 'accent', 'focus', '');

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
    ...(accentFocus ? { '--theme-accent-focus': accentFocus } : {}),
  } as React.CSSProperties;

  return (
    <AlertModalProvider>
      <div className="min-h-screen flex flex-col" style={cssVariables}>
        {shouldShowHeader && <ClothingMinimalHeader storeConfig={storeConfig} />}
        
        {/* Main content - add top padding for inner pages to account for fixed header */}
        <main className={`flex-1 relative ${!isHomePage ? 'pt-20' : ''}`}>
          {isBackendLoading && <PageContentLoader />}
          <PageAnimateWrapper>
            {children}
          </PageAnimateWrapper>
        </main>
        
        <StoreFooter storeConfig={storeConfig} />
      </div>
    </AlertModalProvider>
  );
}
