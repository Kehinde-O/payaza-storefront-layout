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
    borderRadius: string; // e.g., '0.5rem', '0px', '2rem'
    spacingDensity: 'compact' | 'comfortable' | 'spacious';
    fontScale: number; // e.g. 1.0 (default), 1.1, etc.
  };
}

export interface StoreNavigation {
  main: Array<{
    label: string;
    href: string;
    children?: Array<{ label: string; href: string }>;
  }>;
  footer: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
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
  duration: number; // in minutes
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
  // Digital Content Fields
  contentUrl?: string; // Link to the digital file (PDF, Video, etc.)
  previewUrl?: string; // Link to a trailer/preview
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

// Layout Section Management Types
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
  label?: string; // "Our Story", "Our Philosophy"
  title?: string;
  description?: string;
  image?: string;
  signature?: string;
  quote?: string; // Testimonial quote
  author?: string; // Testimonial author
  badge?: string; // Badge text
  section_title?: string; // Section title (alternative to title)
  chef_name?: string; // Chef name (for food layouts)
  chef_bio?: string; // Chef bio (for food layouts)
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
  // Deprecated: keeping for compatibility during transition
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
    teamPage?: boolean;        // "Our Team" page - for wellness, spa, medical
    portfolioPage?: boolean;   // "Portfolio" page - for makeup, photography, creative
    aboutPage?: boolean;       // "About Us" page
    contactPage?: boolean;     // "Contact Us" page
    servicesPage?: boolean;    // "Services" page - for booking stores
    helpCenterPage?: boolean;  // "Help Center" page
    shippingReturnsPage?: boolean; // "Shipping & Returns" page
    trackOrderPage?: boolean;  // "Track Order" page
  };
  settings: {
    currency: string;
    taxRate?: number; // Deprecated: use vat instead
    shippingEnabled?: boolean;
    minOrderAmount?: number;
    freeShippingThreshold?: number;
    vat?: {
      type: 'flat' | 'percentage';
      value: number; // flat amount or percentage (0-100)
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
  // Puck editor data - contains page-specific layout data (e.g., { home: Data, about: Data })
  puckData?: Record<string, any>;
  isPreview?: boolean; // Flag to indicate if the store is in preview mode
  headerConfig?: {
    show?: boolean; // Whether to show header in preview mode (default: false in preview, true otherwise)
    loginButtonText?: string; // Custom text for login button (default: "Log In")
    signUpButtonText?: string; // Custom text for sign up button
    accountButtonText?: string; // Custom text for account button
    cartButtonText?: string; // Custom text for cart button
    wishlistButtonText?: string; // Custom text for wishlist button
    searchPlaceholder?: string; // Custom placeholder for search input
  };
}

// Hero slider interface for new structure
export interface HeroSlider {
  id: string;                    // Unique identifier (e.g., 'hero_slide_1')
  image: string;                 // Image URL
  badge?: string;                // Badge text
  title: string;                 // Main heading
  description?: string;           // Subheading/description
  highlight?: string;            // Highlight text (for food layout)
  primaryButton?: {
    text: string;
    link: string;
  };
  secondaryButton?: {
    text: string;
    link: string;
  };
  order: number;                 // Display order
}

export interface BenefitItem {
  title: string;
  description: string;
  icon?: string;
  order: number;
}

export interface StoreLayoutConfig {
  isPreview?: boolean; // Flag to indicate if the store is in preview mode
  hero?: {
    show: boolean;
    showCTA?: boolean;
    showSecondaryCTA?: boolean;
    autoPlay?: boolean;
    showBadges?: boolean;
    sliders?: HeroSlider[];
    // Added for flexible text overrides directly on hero config
    badge?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    primaryCTA?: string;
    secondaryCTA?: string;
  };
  features?: {
    show: boolean; // Benefits strip, tech features, etc.
    showIcons?: boolean;
    title?: string;
    description?: string;
    items?: BenefitItem[];
  };
  sections?: {
    // Catch-all for other sections
    [key: string]: any;

    hero?: {
      show?: boolean;
      autoPlay?: boolean;
      showCTA?: boolean;
      showSecondaryCTA?: boolean;
      showBadges?: boolean;
      sliders?: HeroSlider[];
      // Added for flexible text overrides
      badge?: string;
      title?: string;
      titleHighlight?: string; // Legacy prop
      subtitle?: string;
      description?: string;
      primaryCTA?: string;
      secondaryCTA?: string;
    };
    categories?: {
      show: boolean;
      showViewAll?: boolean;
      limit?: number; // How many to show
      title?: string; // Section title (e.g., "Shop by Category")
      subtitle?: string; // Section subtitle
      viewAll?: string; // "View All Categories" text
      viewAllLabel?: string; // "View All" label text
    };
    featuredProducts?: {
      show: boolean; // "Trending Now", "Chef's Recommendations", etc.
      title?: string; // Optional override
      subtitle?: string; // Section subtitle
      showViewAll?: boolean;
      viewAll?: string; // "View All Products" text
      viewAllLabel?: string; // "View All" label text
      showAddToCart?: boolean;
      showWishlist?: boolean;
      showRatings?: boolean;
      emptyState?: string; // Empty state message
      eyebrow?: string; // Eyebrow text above title
    };
    marketing?: {
      show: boolean; // Lookbook, Promo Banner, Newsletter
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
        label?: string; // e.g., "EDITORIAL"
        title?: string; // e.g., "Redefining Modern Elegance"
        description?: string; // Editorial description text
        image?: string; // Main editorial image URL
        detailImage?: string; // Decorative detail image URL
        primaryButtonText?: string; // e.g., "View Lookbook"
        primaryButtonLink?: string; // e.g., "/style-guide"
        secondaryButtonText?: string; // e.g., "Read Our Story"
        secondaryButtonLink?: string; // e.g., "/about"
        badgeText?: string; // Badge text (e.g., "Lookbook")
        primaryButton?: { text: string; link: string }; // Button object (alternative to Text/Link)
        secondaryButton?: { text: string; link: string }; // Button object (alternative to Text/Link)
      };
      promoBanner?: {
        show?: boolean;
        image?: string; // Promo banner background image
        title?: string; // Promo title (e.g., "Black Friday")
        subtitle?: string; // Promo subtitle (e.g., "50% Off")
        buttonText?: string; // CTA button text
        buttonLink?: string; // CTA button link
      };
      newsletter?: {
        show?: boolean;
        title?: string; // Newsletter section title
        subtitle?: string; // Newsletter section subtitle
        button?: string; // Subscribe button text
        placeholder?: string; // Email input placeholder
        disclaimer?: string; // Privacy disclaimer text
        badge?: string;
      };
      ctaTitle?: string; // CTA section title
      ctaDescription?: string; // CTA section description
      ctaButton?: string; // CTA button text
      shopTheLook?: {
        show?: boolean;
        image?: string; // Shop the look image
        title?: string; // Section title
        description?: string; // Section description
        products?: string[]; // Related product IDs
      };
      chefRecommendations?: {
        show?: boolean;
        title?: string; // Section title
        description?: string; // Section description
        items?: string[]; // Featured menu item IDs
      };
    };
    testimonials?: {
      show: boolean;
      title?: string; // Section title
      subtitle?: string; // Section subtitle
      items?: TestimonialItem[]; // Array of testimonial items
      // Legacy fields (for backward compatibility)
      quote?: string; // Featured testimonial quote
      author?: string; // Testimonial author name
      role?: string; // Author role/position
    };
    story?: StorySection; // Chef story, Our Story, Philosophy
    promoBanner?: PromoBannerSection; // Promotional banner section
    blog?: {
      show: boolean; // "Latest News", etc.
      title?: string; // Section title
      subtitle?: string; // Section subtitle
    };
    brands?: {
      show: boolean; // Brand ticker
      title?: string; // Section title
    };
    process?: {
      show: boolean; // "How it Works"
      title?: string; // Section title
      subtitle?: string; // Section subtitle
      steps?: Array<{
        title: string;
        description: string;
        icon?: string;
        order: number;
      }>;
    };
    team?: {
      show: boolean; // Featured team members on home page
      title?: string; // Section title
      description?: string; // Section description
      subtitle?: string; // Section subtitle
      showViewAll?: boolean;
      viewAll?: string; // "View All Team" text
      viewAllLabel?: string; // "View All" label text
      memberName?: string; // Featured member name
      memberRole?: string; // Featured member role
    };
    services?: {
      show: boolean; // Services section (for booking layouts)
      title?: string; // Section title
      subtitle?: string; // Section subtitle
      showViewAll?: boolean;
      viewAll?: string; // "View All Services" text
      limit?: number; // How many to show
      viewAllLabel?: string;
    };
    map?: {
      show: boolean;
      title?: string; // Section title
    };

    // Newly added sections from recent layouts
    about?: {
      show: boolean;
      title?: string;
      description?: string;
      image?: string;
      // Legacy/Fallback properties for clothing layout compatibility
      detailImage?: string;
      label?: string;
      primaryButtonText?: string;
      primaryButtonLink?: string;
      secondaryButtonText?: string;
      secondaryButtonLink?: string;
      // Added for food and other layouts
      quote?: string;
      author?: string;
      badge?: string;
      section_title?: string;
      chef_name?: string;
      chef_bio?: string;
      // Added for stats and buttons
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
      content?: string; // Markdown supported
      missionStatement?: string;
      gallerySection?: Array<{ image: string; caption?: string }>;
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
  // Comprehensive text configuration
  text?: {
    // Hero section texts
    hero?: {
      badge?: string;
      title?: string;
      subtitle?: string;
      primaryButton?: string;
      secondaryButton?: string;
      // Per-slide configuration for multi-slide heroes
      slides?: Array<{
        badge?: string;
        title?: string;
        description?: string;
        primaryButton?: string;
        secondaryButton?: string;
      }>;
    };

    // Section titles and labels
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

    // Common UI labels
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

    // Footer texts
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

    // Header texts
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

    // Booking-specific texts
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

    // Food-specific texts
    food?: {
      reserveTable?: string;
      viewMenu?: string;
      chefRecommendations?: string;
      ourPhilosophy?: string;
      meetChef?: string;
      menuCategories?: string;
    };

    // Electronics-specific texts
    electronics?: {
      newArrivals?: string;
      techSpecs?: string;
      compare?: string;
      addToCompare?: string;
      removeFromCompare?: string;
      brands?: string;
    };
  };

  // Theme color configuration for layout customization
  themeColors?: {
    // Background colors
    background?: {
      primary?: string; // Main page background (e.g., '#FFFFFF', '#FAFAFA')
      secondary?: string; // Secondary sections background
      tertiary?: string; // Cards, panels background
      overlay?: string; // Overlay backgrounds (e.g., 'rgba(0,0,0,0.5)')
      dark?: string; // Dark theme background (e.g., '#0F0F0F', '#000000')
    };
    // Text colors
    text?: {
      primary?: string; // Main text color (e.g., '#1F2937', '#FFFFFF')
      secondary?: string; // Secondary text color (e.g., '#6B7280', '#9CA3AF')
      muted?: string; // Muted/disabled text (e.g., '#9CA3AF', '#6B7280')
      inverse?: string; // Text on dark backgrounds (e.g., '#FFFFFF')
    };
    // Border colors
    border?: {
      primary?: string; // Main border color (e.g., '#E5E7EB', 'rgba(255,255,255,0.1)')
      secondary?: string; // Subtle borders (e.g., '#F3F4F6', 'rgba(255,255,255,0.05)')
      accent?: string; // Accent borders (e.g., primaryColor)
    };
    // Gradient colors
    gradient?: {
      from?: string; // Gradient start color
      via?: string; // Gradient middle color (optional)
      to?: string; // Gradient end color
    };
    // Accent colors (beyond primary/secondary from branding)
    accent?: {
      hover?: string; // Hover state color
      active?: string; // Active state color
      focus?: string; // Focus ring color (e.g., 'rgba(59, 130, 246, 0.5)')
      success?: string; // Success state (e.g., '#10B981')
      warning?: string; // Warning state (e.g., '#F59E0B')
      error?: string; // Error state (e.g., '#EF4444')
    };
    // Layout-specific colors (e.g., 'blob1', 'blob2', 'sidebar', 'card', etc.)
    layoutSpecific?: Record<string, string>; // Layout-specific color overrides
  };

  // Legacy support - keep for backward compatibility
  assignedText?: Record<string, string>;
  assignedAssets?: Record<string, string>;
  assetRequirements?: any; // Requirements metadata
}
