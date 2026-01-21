'use client';
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { StandardLayout } from '../wrappers/StandardLayout';
import { ClothingMinimalLayout } from '../wrappers/ClothingMinimalLayout';
import { FoodModernLayout } from '../wrappers/FoodModernLayout';
import { BookingAgendaLayout } from '../wrappers/BookingAgendaLayout';
import { ElectronicsLayout } from '../wrappers/ElectronicsLayout';
import { MotivationalLayout } from '../wrappers/MotivationalLayout';
import { usePathname, useSearchParams } from 'next/navigation';
export function BaseStoreLayout({ children, storeConfig }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    // Determine layout wrapper based on config
    // Allow preview override via query param to ensure wrapper matches page content
    const previewLayout = searchParams.get('preview_layout');
    const layout = previewLayout || storeConfig.layout;
    // Check if we're on the homepage for booking-agenda
    // BookingHomePageAgenda is now self-contained, so skip wrapper for homepage
    const isHomePage = !pathname || pathname === '/' || pathname === `/${storeConfig.slug}` || pathname.endsWith(`/${storeConfig.slug}`);
    switch (layout) {
        case 'clothing-minimal':
            return _jsx(ClothingMinimalLayout, { storeConfig: storeConfig, children: children });
        case 'food-modern':
            return _jsx(FoodModernLayout, { storeConfig: storeConfig, children: children });
        case 'booking-agenda':
            // Homepage is self-contained, other pages need the wrapper for sidebar consistency
            if (isHomePage) {
                return _jsx(_Fragment, { children: children });
            }
            return _jsx(BookingAgendaLayout, { storeConfig: storeConfig, children: children });
        case 'electronics':
        case 'electronics-grid':
            return _jsx(ElectronicsLayout, { storeConfig: storeConfig, children: children });
        case 'motivational-speaker':
            return _jsx(MotivationalLayout, { storeConfig: storeConfig, children: children });
        default:
            return _jsx(StandardLayout, { storeConfig: storeConfig, children: children });
    }
}
