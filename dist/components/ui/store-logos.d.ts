import React from 'react';
import { StoreConfig } from '../../lib/store-types';
interface LogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    primaryColor?: string;
    secondaryColor?: string;
}
export declare const FoodLogo: ({ className, primaryColor, secondaryColor, ...props }: LogoProps) => import("react/jsx-runtime").JSX.Element;
export declare const FoodModernLogo: ({ className, primaryColor, secondaryColor, ...props }: LogoProps) => import("react/jsx-runtime").JSX.Element;
export declare const ClothingLogo: ({ className, primaryColor, secondaryColor, ...props }: LogoProps) => import("react/jsx-runtime").JSX.Element;
export declare const ClothingMinimalLogo: ({ className, primaryColor, secondaryColor, ...props }: LogoProps) => import("react/jsx-runtime").JSX.Element;
export declare const BookingLogo: ({ className, primaryColor, secondaryColor, ...props }: LogoProps) => import("react/jsx-runtime").JSX.Element;
export declare const BookingAgendaLogo: ({ className, primaryColor, secondaryColor, ...props }: LogoProps) => import("react/jsx-runtime").JSX.Element;
export declare const ElectronicsLogo: ({ className, primaryColor, secondaryColor, ...props }: LogoProps) => import("react/jsx-runtime").JSX.Element;
export declare const ElectronicsGridLogo: ({ className, primaryColor, secondaryColor, ...props }: LogoProps) => import("react/jsx-runtime").JSX.Element;
export declare const MotivationalLogo: ({ className, primaryColor, secondaryColor, ...props }: LogoProps) => import("react/jsx-runtime").JSX.Element;
export declare const getStoreLogo: (type: string, props: LogoProps) => import("react/jsx-runtime").JSX.Element;
/**
 * StoreLogo component that renders backend logo if available, otherwise falls back to default SVG logo
 */
interface StoreLogoComponentProps extends LogoProps {
    storeConfig: StoreConfig | null | undefined;
    alt?: string;
}
export declare function StoreLogo({ storeConfig, alt, className, ...props }: StoreLogoComponentProps): import("react/jsx-runtime").JSX.Element;
/**
 * StoreLogoSimple component for use with simplified store objects (like StoreSummary)
 */
interface StoreLogoSimpleProps extends LogoProps {
    store: {
        type: string;
        name?: string;
        branding?: {
            primaryColor?: string;
            secondaryColor?: string;
            logo?: string;
        };
    } | null | undefined;
    alt?: string;
}
export declare function StoreLogoSimple({ store, alt, className, ...props }: StoreLogoSimpleProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=store-logos.d.ts.map