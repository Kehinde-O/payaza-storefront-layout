export type StoreLayoutType = 'food' | 'food-modern' | 'clothing' | 'clothing-minimal' | 'booking' | 'booking-agenda' | 'electronics' | 'electronics-grid' | 'motivational-speaker';
export interface StoreBranding {
    primaryColor: string;
    secondaryColor?: string;
    accentColor?: string;
    logo?: string;
    favicon?: string;
    theme?: 'light' | 'dark' | 'auto';
    fontFamily?: string;
    socialMedia?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        pinterest?: string;
        youtube?: string;
    };
    advanced?: {
        borderRadius: string;
        spacingDensity: 'compact' | 'comfortable' | 'spacious';
        fontScale: number;
    };
}
export interface StoreNavigation {
    main: Array<{
        label: string;
        href: string;
        children?: Array<{
            label: string;
            href: string;
        }>;
    }>;
    footer: Array<{
        title: string;
        links: Array<{
            label: string;
            href: string;
        }>;
    }>;
}
export interface StoreCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: string;
    children?: StoreCategory[];
}
export interface ProductReview {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    title?: string;
    comment: string;
    date: string;
    verified?: boolean;
    helpful?: number;
    images?: string[];
}
export interface StoreProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    categoryId: string;
    category?: string;
    inStock: boolean;
    sku?: string;
    currency?: string;
    variants?: Array<{
        id: string;
        name: string;
        value: string;
        price?: number;
        sku?: string;
    }>;
    specifications?: Record<string, string>;
    rating?: number;
    reviewCount?: number;
    reviews?: ProductReview[];
    isActive?: boolean;
    status?: 'active' | 'inactive' | 'draft';
}
export interface StoreService {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    currency?: string;
    duration: number;
    categoryId: string;
    image?: string;
    provider?: {
        id: string;
        name: string;
        avatar?: string;
        rating?: number;
    };
    availability?: Array<{
        day: string;
        slots: string[];
    }>;
    contentUrl?: string;
    previewUrl?: string;
    contentType?: 'video' | 'audio' | 'pdf' | 'course' | 'other';
    accessLevel?: 'free' | 'paid' | 'subscription';
    isActive?: boolean;
    status?: 'active' | 'inactive' | 'draft';
}
export interface StoreMenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    categoryId: string;
    dietaryInfo?: string[];
    inStock: boolean;
    customizable?: boolean;
}
export interface StoreDomain {
    customDomain?: string;
    verified: boolean;
    dnsSettings?: {
        recordType: 'A' | 'CNAME';
        host: string;
        value: string;
    };
}
export interface StoreNotifications {
    emailOrderConfirmation: boolean;
    emailShipment: boolean;
    emailPromotional: boolean;
    smsUpdates: boolean;
}
export interface StoreLocation {
    id: string;
    name: string;
    address: string;
    currency: string | string[];
    type: 'online' | 'offline';
    contactPhone?: string;
    contactEmail?: string;
    openingHours?: string;
}
export interface TestimonialItem {
    id: string;
    name: string;
    role: string;
    quote: string;
    rating: number;
    image?: string;
    order: number;
}
export interface StorySection {
    show: boolean;
    label?: string;
    title?: string;
    description?: string;
    image?: string;
    signature?: string;
}
export interface PromoBannerSection {
    show: boolean;
    image?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
}
export interface TestimonialsSection {
    show: boolean;
    title?: string;
    subtitle?: string;
    items: TestimonialItem[];
}
export interface StoreConfig {
    id: string;
    slug: string;
    name: string;
    description: string;
    type: StoreLayoutType;
    layout: StoreLayoutType;
    branding: StoreBranding;
    navigation: StoreNavigation;
    categories: StoreCategory[];
    products?: StoreProduct[];
    services?: StoreService[];
    menuItems?: StoreMenuItem[];
    domain?: StoreDomain;
    notifications?: StoreNotifications;
    locations?: StoreLocation[];
    features: {
        cart: boolean;
        wishlist: boolean;
        reviews: boolean;
        search: boolean;
        filters: boolean;
        booking: boolean;
        delivery: boolean;
    };
    pageFeatures?: {
        teamPage?: boolean;
        portfolioPage?: boolean;
        aboutPage?: boolean;
        contactPage?: boolean;
        servicesPage?: boolean;
        helpCenterPage?: boolean;
        shippingReturnsPage?: boolean;
        trackOrderPage?: boolean;
    };
    settings: {
        currency: string;
        taxRate?: number;
        shippingEnabled?: boolean;
        minOrderAmount?: number;
        freeShippingThreshold?: number;
        vat?: {
            type: 'flat' | 'percentage';
            value: number;
            enabled: boolean;
        };
        serviceCharge?: {
            type: 'flat' | 'percentage';
            value: number;
            enabled: boolean;
            applyTo: 'pos' | 'online' | 'both';
        };
    };
    payment?: {
        payazaPublicKey?: string;
        enabled?: boolean;
    };
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        youtube?: string;
        tiktok?: string;
        pinterest?: string;
        whatsapp?: string;
    };
    contactInfo?: {
        email?: string;
        phone?: string;
        address?: {
            street?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            country?: string;
        };
    };
    layoutConfig?: StoreLayoutConfig;
    puckData?: Record<string, any>;
}
export interface HeroSlider {
    id: string;
    image: string;
    badge?: string;
    title: string;
    description?: string;
    highlight?: string;
    primaryButton?: {
        text: string;
        link: string;
    };
    secondaryButton?: {
        text: string;
        link: string;
    };
    order: number;
}
export interface StoreLayoutConfig {
    hero?: {
        show: boolean;
        showCTA?: boolean;
        showSecondaryCTA?: boolean;
        autoPlay?: boolean;
        showBadges?: boolean;
        sliders?: HeroSlider[];
    };
    features?: {
        show: boolean;
        showIcons?: boolean;
    };
    sections?: {
        hero?: {
            show?: boolean;
            autoPlay?: boolean;
            showCTA?: boolean;
            showSecondaryCTA?: boolean;
            showBadges?: boolean;
            sliders?: HeroSlider[];
        };
        categories?: {
            show: boolean;
            showViewAll?: boolean;
            limit?: number;
            title?: string;
            subtitle?: string;
            viewAll?: string;
        };
        featuredProducts?: {
            show: boolean;
            title?: string;
            subtitle?: string;
            showViewAll?: boolean;
            viewAll?: string;
            showAddToCart?: boolean;
            showWishlist?: boolean;
            showRatings?: boolean;
            emptyState?: string;
        };
        marketing?: {
            show: boolean;
            showNewsletter?: boolean;
            showPromoBanner?: boolean;
            editorial?: {
                show?: boolean;
                label?: string;
                title?: string;
                description?: string;
                image?: string;
                detailImage?: string;
                primaryButtonText?: string;
                primaryButtonLink?: string;
                secondaryButtonText?: string;
                secondaryButtonLink?: string;
            };
            promoBanner?: {
                show?: boolean;
                image?: string;
                title?: string;
                subtitle?: string;
                buttonText?: string;
                buttonLink?: string;
            };
            newsletter?: {
                show?: boolean;
                title?: string;
                subtitle?: string;
                button?: string;
                placeholder?: string;
                disclaimer?: string;
            };
            shopTheLook?: {
                show?: boolean;
                image?: string;
                title?: string;
                description?: string;
                products?: string[];
            };
            chefRecommendations?: {
                show?: boolean;
                title?: string;
                description?: string;
                items?: string[];
            };
        };
        testimonials?: {
            show: boolean;
            title?: string;
            subtitle?: string;
            items?: TestimonialItem[];
            quote?: string;
            author?: string;
            role?: string;
        };
        story?: StorySection;
        promoBanner?: PromoBannerSection;
        blog?: {
            show: boolean;
            title?: string;
            subtitle?: string;
        };
        brands?: {
            show: boolean;
            title?: string;
        };
        process?: {
            show: boolean;
            title?: string;
            subtitle?: string;
            steps?: Array<{
                title: string;
                description: string;
                icon?: string;
                order: number;
            }>;
        };
        team?: {
            show: boolean;
            title?: string;
            description?: string;
            showViewAll?: boolean;
            viewAll?: string;
        };
        services?: {
            show: boolean;
            title?: string;
            subtitle?: string;
            showViewAll?: boolean;
            viewAll?: string;
            limit?: number;
        };
        map?: {
            show: boolean;
            title?: string;
        };
    };
    pages?: {
        about?: {
            title?: string;
            heroImage?: string;
            content?: string;
            missionStatement?: string;
            gallerySection?: Array<{
                image: string;
                caption?: string;
            }>;
        };
        team?: {
            title?: string;
            description?: string;
            members?: Array<{
                name: string;
                role: string;
                photo: string;
                bio?: string;
                socialLinks?: {
                    linkedin?: string;
                    twitter?: string;
                    instagram?: string;
                };
            }>;
        };
        portfolio?: {
            title?: string;
            description?: string;
            projects?: Array<{
                title: string;
                description: string;
                image: string;
                category?: string;
                date?: string;
            }>;
        };
        services?: {
            title?: string;
            description?: string;
        };
        faq?: {
            title?: string;
            items?: Array<{
                question: string;
                answer: string;
            }>;
        };
    };
    text?: {
        hero?: {
            badge?: string;
            title?: string;
            subtitle?: string;
            primaryButton?: string;
            secondaryButton?: string;
            slides?: Array<{
                badge?: string;
                title?: string;
                description?: string;
                primaryButton?: string;
                secondaryButton?: string;
            }>;
        };
        sections?: {
            categories?: {
                title?: string;
                subtitle?: string;
                viewAll?: string;
                emptyState?: {
                    products?: string;
                    services?: string;
                };
            };
            featuredProducts?: {
                title?: string;
                subtitle?: string;
                viewAll?: string;
                emptyState?: string;
            };
            marketing?: {
                newsletter?: {
                    title?: string;
                    subtitle?: string;
                    button?: string;
                    placeholder?: string;
                    disclaimer?: string;
                };
                promoBanner?: {
                    title?: string;
                    subtitle?: string;
                    button?: string;
                };
            };
            testimonials?: {
                title?: string;
                subtitle?: string;
            };
            team?: {
                title?: string;
                subtitle?: string;
                viewAll?: string;
            };
            process?: {
                title?: string;
                subtitle?: string;
            };
        };
        common?: {
            shopNow?: string;
            viewAll?: string;
            addToCart?: string;
            buyNow?: string;
            learnMore?: string;
            readMore?: string;
            seeMore?: string;
            discover?: string;
            explore?: string;
            new?: string;
            trending?: string;
            limited?: string;
            sale?: string;
            outOfStock?: string;
            inStock?: string;
            selectSize?: string;
            selectColor?: string;
            quantity?: string;
            reviews?: string;
            writeReview?: string;
            customerReviews?: string;
            noReviews?: string;
            search?: string;
            searchPlaceholder?: string;
            cart?: string;
            wishlist?: string;
            account?: string;
            login?: string;
            logout?: string;
            signup?: string;
            checkout?: string;
            continueShopping?: string;
            proceedToCheckout?: string;
        };
        footer?: {
            newsletter?: {
                title?: string;
                subtitle?: string;
                button?: string;
                placeholder?: string;
                disclaimer?: string;
            };
            copyright?: string;
            links?: {
                about?: string;
                contact?: string;
                privacy?: string;
                terms?: string;
                shipping?: string;
                faq?: string;
            };
        };
        header?: {
            searchPlaceholder?: string;
            cartEmpty?: string;
            wishlistEmpty?: string;
            accountMenu?: {
                profile?: string;
                orders?: string;
                wishlist?: string;
                logout?: string;
            };
        };
        booking?: {
            pageTitle?: string;
            pageSubtitle?: string;
            bookAppointment?: string;
            viewServices?: string;
            selectDate?: string;
            selectService?: string;
            selectTime?: string;
            confirmBooking?: string;
            completePayment?: string;
            bookingConfirmed?: string;
            limitedAvailability?: string;
            availableServices?: string;
            showingResults?: string;
            filters?: string;
            providers?: string;
        };
        food?: {
            reserveTable?: string;
            viewMenu?: string;
            chefRecommendations?: string;
            ourPhilosophy?: string;
            meetChef?: string;
            menuCategories?: string;
        };
        electronics?: {
            newArrivals?: string;
            techSpecs?: string;
            compare?: string;
            addToCompare?: string;
            removeFromCompare?: string;
            brands?: string;
        };
    };
    themeColors?: {
        background?: {
            primary?: string;
            secondary?: string;
            tertiary?: string;
            overlay?: string;
            dark?: string;
        };
        text?: {
            primary?: string;
            secondary?: string;
            muted?: string;
            inverse?: string;
        };
        border?: {
            primary?: string;
            secondary?: string;
            accent?: string;
        };
        gradient?: {
            from?: string;
            via?: string;
            to?: string;
        };
        accent?: {
            hover?: string;
            active?: string;
            focus?: string;
            success?: string;
            warning?: string;
            error?: string;
        };
        layoutSpecific?: Record<string, string>;
    };
    assignedText?: Record<string, string>;
    assignedAssets?: Record<string, string>;
    assetRequirements?: any;
}
//# sourceMappingURL=store-types.d.ts.map