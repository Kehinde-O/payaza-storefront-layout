export type EditorInputType = 
  | 'text' | 'multiline_text' | 'number' | 'toggle' 
  | 'image' | 'color' | 'select' | 'array' | 'section';

export interface SchemaNode {
  type: EditorInputType;
  label: string;          // Human-readable label (e.g., "Hero Headline")
  description?: string;   // Helpful tooltip for the admin
  defaultValue?: any;     // Fallback value
  
  // For 'select' inputs
  options?: { label: string; value: string | number }[];

  // For 'array' inputs (Recursive)
  // MUST match the structure of objects inside the existing JSON array
  itemSchema?: Record<string, SchemaNode>; 

  // For 'section' inputs (Recursive)
  // MUST match the keys of the nested object in the existing JSON
  fields?: Record<string, SchemaNode>;     
}

/**
 * Shared Schema Fragments
 */

const ButtonSchema: Record<string, SchemaNode> = {
  text: { type: 'text', label: 'Button Text', defaultValue: 'Shop Now' },
  link: { type: 'text', label: 'Button Link', defaultValue: '/products' },
};

const HeroSliderSchema: Record<string, SchemaNode> = {
  image: { type: 'image', label: 'Slide Image' },
  badge: { type: 'text', label: 'Badge Text' },
  title: { type: 'text', label: 'Title' },
  description: { type: 'multiline_text', label: 'Description' },
  primaryButton: { type: 'section', label: 'Primary Button', fields: ButtonSchema },
  secondaryButton: { type: 'section', label: 'Secondary Button', fields: ButtonSchema },
};

const BenefitItemSchema: Record<string, SchemaNode> = {
  icon: { type: 'text', label: 'Icon Name', defaultValue: 'Truck' },
  title: { type: 'text', label: 'Benefit Title', defaultValue: 'Free Shipping' },
  description: { type: 'text', label: 'Benefit Description', defaultValue: 'On all orders over $99' },
};

const TestimonialItemSchema: Record<string, SchemaNode> = {
  image: { type: 'image', label: 'Client Image' },
  name: { type: 'text', label: 'Client Name' },
  role: { type: 'text', label: 'Client Role' },
  comment: { type: 'multiline_text', label: 'Testimonial Text' },
  rating: { type: 'number', label: 'Rating (1-5)', defaultValue: 5 },
};

/**
 * 1. Clothing Layout Schema (Fashion Hub)
 * Maps to storefront-layouts/src/layouts/clothing
 */
export const ClothingSchema: Record<string, SchemaNode> = {
  hero: {
    type: 'section',
    label: 'Hero Section',
    description: 'Full-width carousel showcasing featured collections',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      autoPlay: { type: 'toggle', label: 'Auto Play', defaultValue: true },
      showBadges: { type: 'toggle', label: 'Show Badges', defaultValue: true },
      showCTA: { type: 'toggle', label: 'Show Primary Button', defaultValue: true },
      showSecondaryCTA: { type: 'toggle', label: 'Show Secondary Button', defaultValue: true },
      sliders: { type: 'array', label: 'Hero Slides', itemSchema: HeroSliderSchema }
    }
  },
  benefitsStrip: {
    type: 'section',
    label: 'Benefits Strip',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      items: { type: 'array', label: 'Benefit Items', itemSchema: BenefitItemSchema }
    }
  },
  categories: {
    type: 'section',
    label: 'Categories Section',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Title', defaultValue: 'Shop by Category' },
      subtitle: { type: 'text', label: 'Subtitle', defaultValue: 'Curated collections for every style' },
      viewAll: { type: 'text', label: 'View All Text', defaultValue: 'View All Categories' },
      showViewAll: { type: 'toggle', label: 'Show View All', defaultValue: true }
    }
  },
  editorial: {
    type: 'section',
    label: 'Editorial / Lookbook',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      label: { type: 'text', label: 'Eyebrow Label', defaultValue: 'Editorial' },
      title: { type: 'multiline_text', label: 'Title', defaultValue: 'Redefining Modern Elegance' },
      description: { type: 'multiline_text', label: 'Description' },
      image: { type: 'image', label: 'Main Image' },
      detailImage: { type: 'image', label: 'Inset Image' },
      primaryButtonText: { type: 'text', label: 'Primary Button Text' },
      primaryButtonLink: { type: 'text', label: 'Primary Button Link' },
      secondaryButtonText: { type: 'text', label: 'Secondary Button Text' },
      secondaryButtonLink: { type: 'text', label: 'Secondary Button Link' }
    }
  },
  featuredProducts: {
    type: 'section',
    label: 'Trending Products',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Title', defaultValue: 'Trending Now' },
      subtitle: { type: 'text', label: 'Subtitle', defaultValue: "Discover the latest trends." },
      viewAll: { type: 'text', label: 'View All Text', defaultValue: 'View All Products' },
      showViewAll: { type: 'toggle', label: 'Show View All', defaultValue: true },
      limit: { type: 'number', label: 'Product Limit', defaultValue: 8 }
    }
  },
  promoBanner: {
    type: 'section',
    label: 'Promotional Banner',
    fields: {
      show: { type: 'toggle', label: 'Show Banner', defaultValue: false },
      image: { type: 'image', label: 'Banner Image' },
      title: { type: 'text', label: 'Banner Title' },
      subtitle: { type: 'multiline_text', label: 'Banner Subtitle' },
      buttonText: { type: 'text', label: 'Button Text', defaultValue: 'Shop Now' },
      buttonLink: { type: 'text', label: 'Button Link', defaultValue: '/products' }
    }
  }
};

/**
 * 2. Clothing Minimal Layout Schema (Urban Minimalist)
 */
export const ClothingMinimalSchema: Record<string, SchemaNode> = {
  hero: {
    type: 'section',
    label: 'Hero Section',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      badge: { type: 'text', label: 'Badge', defaultValue: 'New Collection' },
      title: { type: 'multiline_text', label: 'Title' },
      subtitle: { type: 'multiline_text', label: 'Subtitle' },
      hero_main: { type: 'image', label: 'Hero Image' },
      showCTA: { type: 'toggle', label: 'Show Primary CTA', defaultValue: true },
      primaryButton: { type: 'section', label: 'Primary Button', fields: ButtonSchema }
    }
  },
  categories: {
    type: 'section',
    label: 'Featured Collections',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Title', defaultValue: 'Collections' },
      layout: { type: 'select', label: 'Layout Style', defaultValue: 'minimal', options: [{ label: 'Minimal', value: 'minimal' }] },
      columns: { type: 'number', label: 'Columns', defaultValue: 3 }
    }
  },
  shopTheLook: {
    type: 'section',
    label: 'Shop the Look',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Title', defaultValue: 'Shop the Look' },
      showViewAll: { type: 'toggle', label: 'Show View All', defaultValue: true }
    }
  },
  featuredProducts: {
    type: 'section',
    label: 'Featured Items',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Title', defaultValue: 'Featured' },
      limit: { type: 'number', label: 'Limit', defaultValue: 6 }
    }
  },
  promoBanner: {
    type: 'section',
    label: 'Promo Banner',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: false },
      title: { type: 'text', label: 'Banner Title' },
      subtitle: { type: 'text', label: 'Banner Subtitle' },
      image: { type: 'image', label: 'Banner Image' },
      buttonText: { type: 'text', label: 'Button Text', defaultValue: 'Shop Now' },
      buttonLink: { type: 'text', label: 'Button Link', defaultValue: '/products' }
    }
  }
};

/**
 * 3. Booking Layout Schema (Beauty Studio)
 */
export const BookingSchema: Record<string, SchemaNode> = {
  hero: {
    type: 'section',
    label: 'Hero Section',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      hero_badge: { type: 'text', label: 'Badge Text' },
      title: { type: 'multiline_text', label: 'Main Title' },
      subtitle: { type: 'multiline_text', label: 'Subtitle' },
      hero_bg: { type: 'image', label: 'Background Image' },
      showCTA: { type: 'toggle', label: 'Show CTA', defaultValue: true },
      primaryButton: { type: 'section', label: 'Primary Button', fields: ButtonSchema },
      secondaryButton: { type: 'section', label: 'Secondary Button', fields: ButtonSchema }
    }
  },
  featuredServices: {
    type: 'section',
    label: 'Signature Services',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Section Title', defaultValue: 'Our Services' },
      showViewAll: { type: 'toggle', label: 'Show View All', defaultValue: true },
      limit: { type: 'number', label: 'Service Limit', defaultValue: 6 }
    }
  },
  team: {
    type: 'section',
    label: 'Meet the Specialists',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      specialist_image: { type: 'image', label: 'Specialist Portrait' },
      memberName: { type: 'text', label: 'Member Name' },
      memberRole: { type: 'text', label: 'Member Role' },
      title: { type: 'multiline_text', label: 'Section Title' },
      subtitle: { type: 'multiline_text', label: 'Description' }
    }
  },
  testimonials: {
    type: 'section',
    label: 'Client Reviews',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Section Title', defaultValue: 'What Our Clients Say' },
      showRatings: { type: 'toggle', label: 'Show Ratings', defaultValue: true },
      limit: { type: 'number', label: 'Max Testimonials', defaultValue: 3 },
      testimonials: { type: 'array', label: 'Testimonials', itemSchema: TestimonialItemSchema }
    }
  },
  promoBanner: {
    type: 'section',
    label: 'Call to Action Banner',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: false },
      title: { type: 'text', label: 'Title', defaultValue: 'Ready to glow?' },
      subtitle: { type: 'text', label: 'Description' },
      image: { type: 'image', label: 'Banner Image' },
      buttonText: { type: 'text', label: 'Button Text', defaultValue: 'Book Appointment' },
      buttonLink: { type: 'text', label: 'Button Link', defaultValue: '/book' }
    }
  }
};

/**
 * 4. Booking Agenda Layout Schema (Appointment Manager)
 */
export const BookingAgendaSchema: Record<string, SchemaNode> = {
  header: {
    type: 'section',
    label: 'Header & Date Picker',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Page Title', defaultValue: 'Book an Appointment' },
      subtitle: { type: 'text', label: 'Subtitle' }
    }
  },
  promoBanner: {
    type: 'section',
    label: 'Promo Banner',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: false },
      image: { type: 'image', label: 'Banner Image' },
      title: { type: 'multiline_text', label: 'Title' },
      subtitle: { type: 'multiline_text', label: 'Description' },
      buttonText: { type: 'text', label: 'Button Text', defaultValue: 'Book Now' },
      buttonLink: { type: 'text', label: 'Button Link', defaultValue: '/book' }
    }
  },
  services: {
    type: 'section',
    label: 'Service List',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Section Title', defaultValue: 'Available Services' }
    }
  },
  team: {
    type: 'section',
    label: 'Our Experts',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Section Title', defaultValue: 'Our Experts' },
      viewAllLabel: { type: 'text', label: 'View All Text', defaultValue: 'View All' }
    }
  },
  testimonials: {
    type: 'section',
    label: 'Client Reviews',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Title', defaultValue: 'What Our Clients Say' },
      subtitle: { type: 'text', label: 'Subtitle' }
    }
  }
};

/**
 * 5. Electronics Layout Schema (Tech Prime)
 */
export const ElectronicsSchema: Record<string, SchemaNode> = {
  hero: {
    type: 'section',
    label: 'Hero Section',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      badge: { type: 'text', label: 'Badge' },
      title: { type: 'multiline_text', label: 'Main Title' },
      subtitle: { type: 'multiline_text', label: 'Subtitle' },
      primaryCTA: { type: 'text', label: 'Button Text', defaultValue: 'Shop Now' },
      showBadges: { type: 'toggle', label: 'Show Badges', defaultValue: true },
      showCTA: { type: 'toggle', label: 'Show CTA', defaultValue: true }
    }
  },
  brands: {
    type: 'section',
    label: 'Brands Ticker',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Title', defaultValue: 'Featured Brands' },
      autoScroll: { type: 'toggle', label: 'Auto Scroll', defaultValue: true }
    }
  },
  categories: {
    type: 'section',
    label: 'Ecosystem Grid',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Title', defaultValue: 'Shop by Category' },
      showViewAll: { type: 'toggle', label: 'Show View All', defaultValue: true },
      limit: { type: 'number', label: 'Limit', defaultValue: 5 }
    }
  },
  featuredProducts: {
    type: 'section',
    label: 'Latest Drops',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Section Title', defaultValue: 'Performance Redefined' },
      showAddToCart: { type: 'toggle', label: 'Show Add to Cart', defaultValue: true },
      limit: { type: 'number', label: 'Product Limit', defaultValue: 8 }
    }
  },
  features: {
    type: 'section',
    label: 'Tech Features',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Section Title', defaultValue: 'Why Choose Us' },
      items: { type: 'array', label: 'Feature Items', itemSchema: BenefitItemSchema }
    }
  },
  promoBanner: {
    type: 'section',
    label: 'Promotional Banner',
    fields: {
      show: { type: 'toggle', label: 'Show Banner', defaultValue: false },
      image: { type: 'image', label: 'Banner Image' },
      title: { type: 'text', label: 'Banner Title' },
      subtitle: { type: 'multiline_text', label: 'Banner Subtitle' },
      buttonText: { type: 'text', label: 'Button Text', defaultValue: 'Shop Now' },
      buttonLink: { type: 'text', label: 'Button Link', defaultValue: '/products' }
    }
  }
};

/**
 * 6. Electronics Grid Layout Schema (Tech Hub)
 */
export const ElectronicsGridSchema: Record<string, SchemaNode> = {
  header: {
    type: 'section',
    label: 'Store Header',
    fields: {
      subtitle: { type: 'text', label: 'Header Subtitle', defaultValue: 'Premium Products' }
    }
  },
  promoBanner: {
    type: 'section',
    label: 'Promotional Banner',
    fields: {
      show: { type: 'toggle', label: 'Show Banner', defaultValue: false },
      image: { type: 'image', label: 'Banner Image' },
      title: { type: 'text', label: 'Banner Title', defaultValue: 'New Arrivals' },
      subtitle: { type: 'multiline_text', label: 'Banner Subtitle' },
      buttonText: { type: 'text', label: 'Button Text', defaultValue: 'Shop Now' },
      buttonLink: { type: 'text', label: 'Button Link', defaultValue: '/products' }
    }
  },
  products: {
    type: 'section',
    label: 'Products Grid',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      itemsPerPage: { type: 'number', label: 'Items Per Page', defaultValue: 12 }
    }
  }
};

/**
 * 7. Food Layout Schema (Savory Bites)
 */
export const FoodSchema: Record<string, SchemaNode> = {
  hero: {
    type: 'section',
    label: 'Hero Slider',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      autoPlay: { type: 'toggle', label: 'Auto Play', defaultValue: true },
      showBadges: { type: 'toggle', label: 'Show Badges', defaultValue: true },
      showCTA: { type: 'toggle', label: 'Show Primary CTA', defaultValue: true },
      showSecondaryCTA: { type: 'toggle', label: 'Show Secondary CTA', defaultValue: true },
      sliders: {
        type: 'array',
        label: 'Hero Slides',
        itemSchema: {
          ...HeroSliderSchema,
          highlight: { type: 'text', label: 'Title Highlight' }
        }
      }
    }
  },
  categories: {
    type: 'section',
    label: 'Menu Categories',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Title', defaultValue: 'Our Menu Categories' },
      showViewAll: { type: 'toggle', label: 'Show View All', defaultValue: true }
    }
  },
  processSteps: {
    type: 'section',
    label: 'How It Works',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Section Title', defaultValue: 'How It Works' },
      steps: {
        type: 'array',
        label: 'Steps',
        itemSchema: {
          title: { type: 'text', label: 'Step Title' },
          description: { type: 'text', label: 'Description' },
          icon: { type: 'text', label: 'Icon Name', defaultValue: 'Check' }
        }
      }
    }
  },
  menuGrid: {
    type: 'section',
    label: 'Featured Menu Items',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Section Title', defaultValue: 'Featured Items' },
      showViewAll: { type: 'toggle', label: 'Show View All', defaultValue: true },
      limit: { type: 'number', label: 'Item Limit', defaultValue: 8 }
    }
  },
  about: {
    type: 'section',
    label: 'Chef / About Section',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      image: { type: 'image', label: 'Chef/Restaurant Image' },
      title: { type: 'text', label: 'Section Title', defaultValue: 'Meet Our Chef' },
      description: { type: 'multiline_text', label: 'Description' }
    }
  },
  testimonials: {
    type: 'section',
    label: 'Guest Testimonials',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Section Title', defaultValue: 'What Our Customers Say' },
      subtitle: { type: 'text', label: 'Subtitle' },
      showRatings: { type: 'toggle', label: 'Show Ratings', defaultValue: true },
      limit: { type: 'number', label: 'Limit', defaultValue: 5 },
      testimonials: { type: 'array', label: 'Testimonials', itemSchema: TestimonialItemSchema }
    }
  },
  promoBanner: {
    type: 'section',
    label: 'Reservation Banner',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: false },
      title: { type: 'text', label: 'Title', defaultValue: 'Reserve Your Table' },
      subtitle: { type: 'text', label: 'Subtitle' },
      image: { type: 'image', label: 'Banner Image' },
      buttonText: { type: 'text', label: 'Button Text', defaultValue: 'Book Now' },
      buttonLink: { type: 'text', label: 'Button Link', defaultValue: '/reserve' }
    }
  }
};

/**
 * 8. Food Modern Layout Schema (Culinary Canvas)
 */
export const FoodModernSchema: Record<string, SchemaNode> = {
  hero: {
    type: 'section',
    label: 'Modern Hero',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      videoUrl: { type: 'text', label: 'Background Video URL' },
      posterImage: { type: 'image', label: 'Video Poster Image' },
      badge: { type: 'text', label: 'Badge Text' },
      title: { type: 'text', label: 'Main Title' },
      subtitle: { type: 'text', label: 'Subtitle' },
      titleHighlight: { type: 'text', label: 'Title Highlight' },
      showCTA: { type: 'toggle', label: 'Show Primary Button', defaultValue: true },
      primaryButton: { type: 'section', label: 'Primary Button', fields: ButtonSchema }
    }
  },
  about: {
    type: 'section',
    label: 'Philosophy Section',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      image: { type: 'image', label: 'Philosophy Image' },
      badge: { type: 'text', label: 'Section Badge', defaultValue: 'Our Philosophy' },
      title: { type: 'text', label: 'Section Title', defaultValue: 'Our Story' },
      description: { type: 'multiline_text', label: 'Philosophy Story' },
      quote: { type: 'text', label: 'Featured Quote' },
      author: { type: 'text', label: 'Quote Author' },
      showImage: { type: 'toggle', label: 'Show Image', defaultValue: true },
      showSignature: { type: 'toggle', label: 'Show Chef Signature', defaultValue: true }
    }
  },
  menuGrid: {
    type: 'section',
    label: 'Featured Dishes',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Section Title', defaultValue: 'Featured Dishes' },
      showViewAll: { type: 'toggle', label: 'Show View All Button', defaultValue: true },
      columns: { type: 'number', label: 'Grid Columns', defaultValue: 3 }
    }
  },
  testimonials: {
    type: 'section',
    label: 'Guest Stories',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Section Title', defaultValue: 'Customer Reviews' },
      subtitle: { type: 'text', label: 'Subtitle' },
      showRatings: { type: 'toggle', label: 'Show Ratings', defaultValue: true },
      limit: { type: 'number', label: 'Limit', defaultValue: 3 },
      testimonials: { type: 'array', label: 'Guest Testimonials', itemSchema: TestimonialItemSchema }
    }
  },
  promoBanner: {
    type: 'section',
    label: 'Promotional Banner',
    fields: {
      show: { type: 'toggle', label: 'Show Banner', defaultValue: false },
      image: { type: 'image', label: 'Banner Image' },
      title: { type: 'text', label: 'Banner Title' },
      subtitle: { type: 'multiline_text', label: 'Banner Subtitle' },
      buttonText: { type: 'text', label: 'Button Text', defaultValue: 'Reserve Now' },
      buttonLink: { type: 'text', label: 'Button Link', defaultValue: '/reserve' }
    }
  }
};

/**
 * 9. Motivational Speaker Layout Schema (Inspire)
 */
export const MotivationalSpeakerSchema: Record<string, SchemaNode> = {
  hero: {
    type: 'section',
    label: 'Cinematic Hero',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      hero_image: { type: 'image', label: 'Background Image' },
      hero_video: { type: 'text', label: 'Background Video URL' },
      subtitle: { type: 'text', label: 'Badge / Subtitle', defaultValue: 'Master Your Mindset' },
      title: { type: 'multiline_text', label: 'Main Title' },
      description: { type: 'multiline_text', label: 'Description' },
      primaryCTA: { type: 'text', label: 'Primary Button Text', defaultValue: 'Start Learning' },
      secondaryCTA: { type: 'text', label: 'Secondary Button Text', defaultValue: 'Explore Catalogue' }
    }
  },
  trust: {
    type: 'section',
    label: 'Trusted By Logos',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true }
    }
  },
  about: {
    type: 'section',
    label: 'Speaker Bio',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      bio_image: { type: 'image', label: 'Speaker Portrait' },
      title: { type: 'multiline_text', label: 'Title', defaultValue: "Hi, I'm here to help you grow." },
      description: { type: 'multiline_text', label: 'Bio Text' }
    }
  },
  services: {
    type: 'section',
    label: 'Digital Content Grid',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      title: { type: 'text', label: 'Section Title', defaultValue: 'Latest Materials' },
      viewAllLabel: { type: 'text', label: 'View All Link Text', defaultValue: 'View All Material' }
    }
  },
  subscription: {
    type: 'section',
    label: 'Membership Banner',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true },
      subscription_banner: { type: 'image', label: 'Banner Image' },
      subscriptionBadge: { type: 'text', label: 'Badge', defaultValue: 'Inner Circle Access' },
      subscriptionTitle: { type: 'multiline_text', label: 'Title' },
      subscriptionDescription: { type: 'multiline_text', label: 'Description' },
      subscriptionButton: { type: 'text', label: 'Button Text', defaultValue: 'Become a Member' }
    }
  },
  testimonials: {
    type: 'section',
    label: 'Success Stories',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true }
    }
  },
  marketing: {
    type: 'section',
    label: 'Newsletter Section',
    fields: {
      showNewsletter: { type: 'toggle', label: 'Show Newsletter', defaultValue: true },
      newsletterBadge: { type: 'text', label: 'Badge', defaultValue: 'Stay Connected' },
      newsletterTitle: { type: 'text', label: 'Title' },
      newsletterSubtitle: { type: 'text', label: 'Subtitle' },
      newsletterPlaceholder: { type: 'text', label: 'Email Placeholder' },
      newsletterButton: { type: 'text', label: 'Subscribe Button' }
    }
  },
  faq: {
    type: 'section',
    label: 'Frequently Asked Questions',
    fields: {
      show: { type: 'toggle', label: 'Show Section', defaultValue: true }
    }
  },
  promoBanner: {
    type: 'section',
    label: 'Promotional Banner',
    fields: {
      show: { type: 'toggle', label: 'Show Banner', defaultValue: false },
      image: { type: 'image', label: 'Banner Image' },
      title: { type: 'text', label: 'Banner Title' },
      subtitle: { type: 'multiline_text', label: 'Banner Subtitle' },
      buttonText: { type: 'text', label: 'Button Text', defaultValue: 'Learn More' },
      buttonLink: { type: 'text', label: 'Button Link', defaultValue: '/courses' }
    }
  }
};
