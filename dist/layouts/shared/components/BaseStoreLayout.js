'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StoreHeader } from './StoreHeader';
import { StoreFooter } from './StoreFooter';
import { PageAnimateWrapper } from '../../../components/ui/page-animate-wrapper';
import { PageContentLoader } from '../../../components/ui/page-content-loader';
import { usePathname } from 'next/navigation';
import { useStore } from '../../../lib/store-context';
import { useLoading } from '../../../lib/loading-context';
import { getThemeColor } from '../../../lib/utils/asset-helpers';
export function BaseStoreLayout({ children, storeConfig }) {
    const pathname = usePathname();
    const { cartCount } = useStore();
    const { isBackendLoading } = useLoading();
    const isHomePage = pathname === `/${storeConfig.slug}`;
    // New layouts handle their own headers/footers for maximum customization
    // BUT we want to ensure headers/footers show on inner pages for most layouts
    const customLayouts = ['food-modern', 'clothing-minimal', 'booking-agenda', 'electronics-grid', 'electronics'];
    const isCustomLayout = customLayouts.includes(storeConfig.layout);
    // Electronics layouts use wrappers (ElectronicsPageWrapper) that handle headers on inner pages
    // So we always suppress the standard header for them to avoid duplication
    const isElectronics = storeConfig.layout === 'electronics' || storeConfig.layout === 'electronics-grid';
    // For other custom layouts (clothing-minimal, etc.), they only have custom headers on the HOME page
    // So we should show the standard header on inner pages
    const shouldHideStandardHeader = isCustomLayout && (isHomePage || isElectronics);
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
    };
    if (shouldHideStandardHeader) {
        return (_jsx("div", { className: "min-h-screen flex flex-col", style: cssVariables, children: _jsxs("main", { className: "flex-1 relative", children: [isBackendLoading && _jsx(PageContentLoader, {}), _jsx(PageAnimateWrapper, { children: children })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen flex flex-col", style: cssVariables, children: [_jsx(StoreHeader, { storeConfig: storeConfig, cartItemCount: cartCount }), _jsxs("main", { className: "flex-1 relative", children: [isBackendLoading && _jsx(PageContentLoader, {}), _jsx(PageAnimateWrapper, { children: children })] }), _jsx(StoreFooter, { storeConfig: storeConfig })] }));
}
