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
    quote?: string;
    author?: string;
    badge?: string;
    section_title?: string;
    chef_name?: string;
    chef_bio?: string;
}
export interface PromoBannerSection {
    show: boolean;
    image?: string;
    title?: string;
    subtitle?: string;
    button?: {
        text: string;
        link: string;
    };
    buttonText?: string;
    buttonLink?: string;
    badge?: string;
    description?: string;
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
    isPreview?: boolean;
    headerConfig?: {
        show?: boolean;
        loginButtonText?: string;
        signUpButtonText?: string;
        accountButtonText?: string;
        cartButtonText?: string;
        wishlistButtonText?: string;
        searchPlaceholder?: string;
    };
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
export interface BenefitItem {
    title: string;
    description: string;
    icon?: string;
    order: number;
}
export interface StoreLayoutConfig {
    isPreview?: boolean;
    hero?: {
        show: boolean;
        showCTA?: boolean;
        showSecondaryCTA?: boolean;
        autoPlay?: boolean;
        showBadges?: boolean;
        sliders?: HeroSlider[];
        badge?: string;
        title?: string;
        subtitle?: string;
        description?: string;
        primaryCTA?: string;
        secondaryCTA?: string;
    };
    features?: {
        show: boolean;
        showIcons?: boolean;
        title?: string;
        description?: string;
        items?: BenefitItem[];
    };
    sections?: {
        [key: string]: any;
        hero?: {
            show?: boolean;
            autoPlay?: boolean;
            showCTA?: boolean;
            showSecondaryCTA?: boolean;
            showBadges?: boolean;
            sliders?: HeroSlider[];
            badge?: string;
            title?: string;
            titleHighlight?: string;
            subtitle?: string;
            description?: string;
            primaryCTA?: string;
            secondaryCTA?: string;
        };
        categories?: {
            show: boolean;
            showViewAll?: boolean;
            limit?: number;
            title?: string;
            subtitle?: string;
            viewAll?: string;
            viewAllLabel?: string;
        };
        featuredProducts?: {
            show: boolean;
            title?: string;
            subtitle?: string;
            showViewAll?: boolean;
            viewAll?: string;
            viewAllLabel?: string;
            showAddToCart?: boolean;
            showWishlist?: boolean;
            showRatings?: boolean;
            emptyState?: string;
            eyebrow?: string;
        };
        marketing?: {
            show: boolean;
            showNewsletter?: boolean;
            showPromoBanner?: boolean;
            newsletterTitle?: string;
            newsletterSubtitle?: string;
            newsletterButton?: string;
            newsletterPlaceholder?: string;
            newsletterBadge?: string;
            subscriptionTitle?: string;
            subscriptionSubtitle?: string;
            subscriptionButton?: string;
            subscriptionBadge?: string;
            subscriptionDescription?: string;
            backgroundImage?: string;
            badge?: string;
            title?: string;
            subtitle?: string;
            promoDiscount?: string;
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
                badgeText?: string;
                primaryButton?: {
                    text: string;
                    link: string;
                };
                secondaryButton?: {
                    text: string;
                    link: string;
                };
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
                badge?: string;
            };
            ctaTitle?: string;
            ctaDescription?: string;
            ctaButton?: string;
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
            subtitle?: string;
            showViewAll?: boolean;
            viewAll?: string;
            viewAllLabel?: string;
            memberName?: string;
            memberRole?: string;
        };
        services?: {
            show: boolean;
            title?: string;
            subtitle?: string;
            showViewAll?: boolean;
            viewAll?: string;
            limit?: number;
            viewAllLabel?: string;
        };
        map?: {
            show: boolean;
            title?: string;
        };
        about?: {
            show: boolean;
            title?: string;
            description?: string;
            image?: string;
            detailImage?: string;
            label?: string;
            primaryButtonText?: string;
            primaryButtonLink?: string;
            secondaryButtonText?: string;
            secondaryButtonLink?: string;
            quote?: string;
            author?: string;
            badge?: string;
            section_title?: string;
            chef_name?: string;
            chef_bio?: string;
            showStats?: boolean;
            stat1Label?: string;
            stat1Value?: string;
            stat2Label?: string;
            stat2Value?: string;
            buttonText?: string;
            buttonLink?: string;
        };
        trust?: {
            show: boolean;
            title?: string;
        };
        faq?: {
            show: boolean;
            title?: string;
            items?: any[];
        };
        subscription?: {
            show: boolean;
            title?: string;
            subtitle?: string;
            description?: string;
            buttonText?: string;
            badge?: string;
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
            hero?: any;
            story?: any;
            stats?: any;
            'contact-info'?: any;
            values?: any;
            aboutHeader?: any;
            aboutContent?: any;
            statsSection?: any;
            contactSection?: any;
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
        products?: {
            productsHeader?: any;
            productsGrid?: any;
        };
        categories?: {
            categoriesHeader?: any;
            categoryGrid?: any;
        };
        categoryDetail?: {
            categoryDetail?: any;
            showServices?: boolean;
            showProducts?: boolean;
            showBanner?: boolean;
            showDescription?: boolean;
            showFilters?: boolean;
        };
        productDetail?: {
            productDetail?: any;
            showSizeGuide?: boolean;
            showAddToCart?: boolean;
            showWishlist?: boolean;
            showReviews?: boolean;
            showRelatedProducts?: boolean;
        };
        contact?: {
            contact?: any;
            contactHeader?: any;
            contactForm?: any;
            hero?: any;
            form?: any;
            backgroundImage?: string;
            title?: string;
            subtitle?: string;
            infoTitle?: string;
            infoDescription?: string;
        };
        menu?: {
            menuHeader?: any;
            menuGrid?: any;
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