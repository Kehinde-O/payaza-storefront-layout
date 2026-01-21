import { LayoutAlignmentSchema } from './types';

export const FoodSchema: LayoutAlignmentSchema = {
  home: {
    hero: {
      type: 'section',
      label: 'Hero Section',
      description: 'The main hero slider section at the top of the home page.',
      _sourcePath: 'layoutConfig.sections.hero',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        autoPlay: { type: 'toggle', label: 'Auto Play Slides', defaultValue: true },
        showBadges: { type: 'toggle', label: 'Show Badges', defaultValue: true },
        showCTA: { type: 'toggle', label: 'Show Primary Button', defaultValue: true },
        showSecondaryCTA: { type: 'toggle', label: 'Show Secondary Button', defaultValue: true },
        sliders: {
          type: 'array',
          label: 'Hero Sliders',
          itemSchema: {
            image: { type: 'image', label: 'Slide Image' },
            title: { type: 'text', label: 'Title' },
            highlight: { type: 'text', label: 'Title Highlight' },
            description: { type: 'text', label: 'Description' },
            badge: { type: 'text', label: 'Badge Text' },
            primaryButton: {
              type: 'button',
              label: 'Primary Button',
              fields: {
                text: { type: 'text', label: 'Button Text' },
                link: { type: 'text', label: 'Button Link' }
              }
            },
            secondaryButton: {
              type: 'button',
              label: 'Secondary Button',
              fields: {
                text: { type: 'text', label: 'Button Text' },
                link: { type: 'text', label: 'Button Link' }
              }
            }
          }
        }
      }
    },
    categories: {
      type: 'section',
      label: 'Menu Categories',
      _sourcePath: 'layoutConfig.sections.categories',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Badge Text (e.g. Menu Categories)' },
        subtitle: { type: 'text', label: 'Main Title (e.g. What are you craving?)' }
      }
    },
    process: {
      type: 'section',
      label: 'How It Works',
      _sourcePath: 'layoutConfig.sections.process',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Main Title' },
        subtitle: { type: 'text', label: 'Badge Text' },
        steps: {
          type: 'array',
          label: 'Process Steps',
          itemSchema: {
            title: { type: 'text', label: 'Step Title' },
            description: { type: 'multiline_text', label: 'Step Description' },
            icon: { type: 'text', label: 'Icon Name (Lucide)' }
          }
        }
      }
    },
    featuredProducts: {
      type: 'section',
      label: 'Chef Recommendation',
      _sourcePath: 'layoutConfig.sections.featuredProducts',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Main Title' },
        subtitle: { type: 'text', label: 'Badge Text' },
        viewAllLabel: { type: 'text', label: 'View All Button Text' }
      }
    },
    about: {
      type: 'section',
      label: 'About / Chef Story',
      _sourcePath: 'layoutConfig.sections.about',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        image: { type: 'image', label: 'Chef/About Image' },
        section_title: { type: 'text', label: 'Badge Text (e.g. Our Story)' },
        chef_name: { type: 'text', label: 'Main Title (e.g. Crafted with Love)' },
        chef_bio: { type: 'multiline_text', label: 'Story/Bio' },
        showStats: { type: 'toggle', label: 'Show Stats (15k+, 100%)', defaultValue: true },
        stat1Label: { type: 'text', label: 'Stat 1 Label' },
        stat1Value: { type: 'text', label: 'Stat 1 Value' },
        stat2Label: { type: 'text', label: 'Stat 2 Label' },
        stat2Value: { type: 'text', label: 'Stat 2 Value' },
        buttonText: { type: 'text', label: 'Button Text' },
        buttonLink: { type: 'text', label: 'Button Link' }
      }
    },
    testimonials: {
      type: 'section',
      label: 'Testimonials',
      _sourcePath: 'layoutConfig.sections.testimonials',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Section Title' },
        subtitle: { type: 'text', label: 'Subtitle' },
        items: {
          type: 'array',
          label: 'Testimonials List',
          itemSchema: {
            image: { type: 'image', label: 'Customer Image' },
            name: { type: 'text', label: 'Customer Name' },
            role: { type: 'text', label: 'Customer Role' },
            quote: { type: 'multiline_text', label: 'Testimonial Quote' },
            rating: { type: 'number', label: 'Rating' }
          }
        }
      }
    },
    promoBanner: {
      type: 'section',
      label: 'Promo Banner',
      _sourcePath: 'layoutConfig.sections.promoBanner',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: false },
        text: { type: 'text', label: 'Banner Text' },
        link: { type: 'text', label: 'Link URL' }
      }
    },
    reservation: {
      type: 'section',
      label: 'Reserve Table Section',
      _sourcePath: 'layoutConfig.sections.reservation',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Section Title' },
        subtitle: { type: 'text', label: 'Section Subtitle' },
        description: { type: 'multiline_text', label: 'Description' },
        phone: { type: 'text', label: 'Reservation Phone' },
        showFeatures: { type: 'toggle', label: 'Show Feature Grid', defaultValue: true },
        features: {
          type: 'array',
          label: 'Features',
          itemSchema: {
            title: { type: 'text', label: 'Feature Title' },
            description: { type: 'text', label: 'Feature Description' },
            icon: { type: 'text', label: 'Icon Name (Lucide)' }
          }
        }
      }
    },
    marketing: {
      type: 'section',
      label: 'Marketing / Newsletter',
      _sourcePath: 'layoutConfig.sections.marketing',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        badge: { type: 'text', label: 'Badge Text' },
        title: { type: 'text', label: 'Section Title' },
        subtitle: { type: 'multiline_text', label: 'Section Subtitle' },
        backgroundImage: { type: 'image', label: 'Background Image' },
        newsletterTitle: { type: 'text', label: 'Newsletter Title' },
        newsletterSubtitle: { type: 'text', label: 'Newsletter Subtitle' },
        newsletterPlaceholder: { type: 'text', label: 'Input Placeholder' },
        newsletterButton: { type: 'text', label: 'Button Text' },
        promoDiscount: { type: 'text', label: 'Discount Amount (e.g. 20%)' }
      }
    }
  },
  menu: {
    menuHeader: {
      type: 'section',
      label: 'Menu Header',
      _sourcePath: 'layoutConfig.pages.menu.menuHeader',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Page Title' },
        subtitle: { type: 'text', label: 'Subtitle' },
        backgroundImage: { type: 'image', label: 'Background Image' }
      }
    },
    menuGrid: {
      type: 'section',
      label: 'Menu Grid',
      _sourcePath: 'layoutConfig.pages.menu.menuGrid',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        showSearch: { type: 'toggle', label: 'Show Search Bar', defaultValue: true },
        showCategories: { type: 'toggle', label: 'Show Category Tabs', defaultValue: true }
      }
    }
  },
  categoryDetail: {
    categoryHeader: {
      type: 'section',
      label: 'Category Header',
      _sourcePath: 'layoutConfig.pages.categoryDetail.categoryHeader',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        showImage: { type: 'toggle', label: 'Show Category Image', defaultValue: true }
      }
    },
    productGrid: {
      type: 'section',
      label: 'Product Grid',
      _sourcePath: 'layoutConfig.pages.categoryDetail.productGrid',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        showFilters: { type: 'toggle', label: 'Show Filters', defaultValue: true },
        itemsPerPage: { type: 'number', label: 'Items Per Page', defaultValue: 12 }
      }
    }
  },
  products: {
    productsHeader: {
      type: 'section',
      label: 'Products Header',
      _sourcePath: 'layoutConfig.pages.products.productsHeader',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Page Title' }
      }
    },
    productsGrid: {
      type: 'section',
      label: 'Products Grid',
      _sourcePath: 'layoutConfig.pages.products.productsGrid',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true }
      }
    }
  },
  productDetail: {
    productDetail: {
      type: 'section',
      label: 'Product Detail Settings',
      _sourcePath: 'layoutConfig.pages.productDetail.productDetail',
      fields: {
        showAddToCart: { type: 'toggle', label: 'Show Add to Cart' },
        showWishlist: { type: 'toggle', label: 'Show Wishlist' },
        showReviews: { type: 'toggle', label: 'Show Reviews' }
      }
    }
  }
};
