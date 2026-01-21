import { LayoutAlignmentSchema } from './types';

export const ClothingSchema: LayoutAlignmentSchema = {
  home: {
    hero: {
      type: 'section',
      label: 'Main Hero Carousel',
      description: 'The primary high-impact carousel at the top of the homepage. Used for major campaigns, seasonal launches, and featured collections.',
      _sourcePath: 'layoutConfig.sections.hero',
      fields: {
        show: { type: 'toggle', label: 'Display Section', description: 'Enable or disable the hero carousel on the homepage.', defaultValue: true },
        autoPlay: { type: 'toggle', label: 'Auto-rotate Slides', description: 'When enabled, slides will automatically cycle every 5 seconds.', defaultValue: true },
        showBadges: { type: 'toggle', label: 'Show Text Badges', description: 'Toggle visibility of the small accent text (e.g., "New Arrival") above slide titles.', defaultValue: true },
        showCTA: { type: 'toggle', label: 'Show Primary Action', description: 'Show or hide the primary call-to-action button on all slides.', defaultValue: true },
        showSecondaryCTA: { type: 'toggle', label: 'Show Secondary Action', description: 'Show or hide the secondary (outline) button on all slides.', defaultValue: true },
        sliders: {
          type: 'array',
          label: 'Campaign Slides',
          description: 'Individual slides within the carousel. Each slide contains a background image and messaging.',
          defaultValue: [
            {
              image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80',
              badge: 'New Arrival',
              title: 'Summer Collection',
              description: 'Trendy clothing for every season. Style meets comfort.',
              primaryButton: { text: 'Shop Now', link: '/products' },
              secondaryButton: { text: 'Explore', link: '/categories' }
            },
            {
              image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
              badge: 'Limited Edition',
              title: 'Urban Streetwear',
              description: 'Exquisite designs for the modern individual.',
              primaryButton: { text: 'Shop Now', link: '/products' },
              secondaryButton: { text: 'View More', link: '/categories' }
            }
          ],
          itemSchema: {
            image: { type: 'image', label: 'Background Image', description: 'High-resolution image (recommended 1600x900px or larger).' },
            badge: { type: 'text', label: 'Accent Badge', description: 'Short text displayed above the title (e.g., "SALE", "HOT").' },
            title: { type: 'text', label: 'Slide Title', description: 'Main headline for this campaign slide.' },
            description: { type: 'multiline_text', label: 'Messaging', description: 'Supporting text describing the offer or collection.' },
            primaryButton: {
              type: 'button',
              label: 'Main Button',
              fields: {
                text: { type: 'text', label: 'Label', description: 'Text displayed inside the primary button.' },
                link: { type: 'text', label: 'URL Path', description: 'The page users go to when clicking this button (e.g., /products).' }
              }
            },
            secondaryButton: {
              type: 'button',
              label: 'Secondary Button',
              fields: {
                text: { type: 'text', label: 'Label', description: 'Text displayed inside the secondary button.' },
                link: { type: 'text', label: 'URL Path', description: 'The page users go to when clicking this button.' }
              }
            }
          }
        }
      }
    },
    benefitsStrip: {
      type: 'section',
      label: 'Trust & Benefits Bar',
      description: 'A thin horizontal strip highlighting key value propositions like free shipping, returns, or security.',
      _sourcePath: 'layoutConfig.sections.features',
      fields: {
        show: { type: 'toggle', label: 'Display Benefits', description: 'Show or hide this trust-building section.', defaultValue: true },
        items: {
          type: 'array',
          label: 'Benefit Items',
          description: 'Icons and text pairs that communicate store benefits to customers.',
          defaultValue: [
            { icon: 'Truck', title: 'Free Shipping', description: 'On all orders over standard threshold' },
            { icon: 'RefreshCw', title: 'Free Returns', description: '30-day money back guarantee' },
            { icon: 'ShieldCheck', title: 'Secure Payment', description: '100% secure checkout process' }
          ],
          itemSchema: {
            icon: { type: 'icon', label: 'Graphic Icon', description: 'Choose a symbolic icon from the library (Truck, Shield, Star, etc.).' },
            title: { type: 'text', label: 'Feature Title', description: 'Brief name of the benefit (e.g., "Global Delivery").' },
            description: { type: 'text', label: 'Short Description', description: 'One-line explanation of this benefit.' }
          }
        }
      }
    },
    categories: {
      type: 'section',
      label: 'Category Showcase',
      description: 'Grid layout featuring main product categories to help users start browsing.',
      _sourcePath: 'layoutConfig.sections.categories',
      fields: {
        show: { type: 'toggle', label: 'Display Section', defaultValue: true },
        title: { type: 'text', label: 'Showcase Title', description: 'Headline displayed above the category grid.', defaultValue: 'Shop by Category' },
        subtitle: { type: 'text', label: 'Supporting Text', description: 'Small sub-text providing more context.', defaultValue: 'Curated collections for every style' },
        showViewAll: { type: 'toggle', label: 'Show "View All"', description: 'Toggle the link that takes users to the full categories page.', defaultValue: true },
        viewAll: { type: 'text', label: 'Link Text', defaultValue: 'View All Categories' },
        columns: { type: 'number', label: 'Grid Columns', description: 'Number of categories to show side-by-side on desktop (recommended: 2 or 4).', defaultValue: 4 }
      }
    },
    lookbook: {
      type: 'section',
      label: 'Editorial Lookbook',
      description: 'A stylish, asymmetrical section for storytelling or deep-dives into specific styles or brands.',
      _sourcePath: 'layoutConfig.sections.marketing.editorial',
      fields: {
        show: { type: 'toggle', label: 'Display Section', defaultValue: true },
        badgeText: { type: 'text', label: 'Category Label', defaultValue: 'Lookbook' },
        title: { type: 'multiline_text', label: 'Editorial Title', description: 'The main stylistic headline for this section.', defaultValue: 'Style & Substance' },
        description: { type: 'multiline_text', label: 'Brand Story', description: 'Detailed text about the brand philosophy or the specific look.', defaultValue: 'Fashion Hub was born from a desire to create clothing that looks good and feels even better. We believe in sustainable fashion and ethical production practices.' },
        primaryButton: {
          type: 'button',
          label: 'Style Guide Button',
          fields: {
            text: { type: 'text', label: 'Button Text', defaultValue: 'View Style Guide' },
            link: { type: 'text', label: 'URL Path', defaultValue: '/style-guide' }
          }
        },
        secondaryButton: {
          type: 'button',
          label: 'About Button',
          fields: {
            text: { type: 'text', label: 'Button Text', defaultValue: 'About Us' },
            link: { type: 'text', label: 'URL Path', defaultValue: '/about' }
          }
        },
        image: { type: 'image', label: 'Main Feature Image', description: 'The large primary image for the lookbook (recommended 1000x1200px vertical).', defaultValue: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop' },
        detailImage: { type: 'image', label: 'Accent Detail Image', description: 'A smaller secondary image that adds depth to the section layout.', defaultValue: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=1000&auto=format&fit=crop' }
      }
    },
    featuredProducts: {
      type: 'section',
      label: 'Trending Grid',
      description: 'A grid showing a selection of products, usually newest arrivals or best sellers.',
      _sourcePath: 'layoutConfig.sections.featuredProducts',
      fields: {
        show: { type: 'toggle', label: 'Display Section', defaultValue: true },
        eyebrow: { type: 'text', label: 'Section Badge', defaultValue: 'Curated For You' },
        title: { type: 'text', label: 'Main Headline', defaultValue: 'New Season Arrivals' },
        subtitle: { type: 'text', label: 'Sub-headline', defaultValue: 'Curated collections for every style' },
        showViewAll: { type: 'toggle', label: 'Show "View All"', defaultValue: true },
        viewAll: { type: 'text', label: 'Button Text', defaultValue: 'View All Products' },
        limit: { type: 'number', label: 'Product Display Limit', description: 'Maximum number of products to show in this grid.', defaultValue: 8 }
      }
    },
    promoBanner: {
      type: 'section',
      label: 'Promotional Banner',
      description: 'A large call-to-action banner for major sales or events.',
      _sourcePath: 'layoutConfig.sections.promoBanner',
      fields: {
        show: { type: 'toggle', label: 'Display Banner', defaultValue: false },
        image: { type: 'image', label: 'Banner Image' },
        title: { type: 'text', label: 'Banner Title' },
        subtitle: { type: 'multiline_text', label: 'Banner Subtitle' },
        buttonText: { type: 'text', label: 'Button Text', defaultValue: 'Shop Now' },
        buttonLink: { type: 'text', label: 'Button Link', defaultValue: '/products' }
      }
    },
  },
  products: {
    productsHeader: {
      type: 'section',
      label: 'Listing Page Header',
      description: 'The banner section at the top of the "All Products" page. Sets the tone for the shopping experience.',
      _sourcePath: 'layoutConfig.pages.products.productsHeader',
      fields: {
        show: { type: 'toggle', label: 'Display Header', defaultValue: true },
        image: { type: 'image', label: 'Background Image', description: 'Large banner image for the products page (recommended 2000x600px).', defaultValue: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop' },
        badge: { type: 'text', label: 'Accent Text', description: 'Small text badge above the main title.', defaultValue: 'New Arrivals 2024' },
        title: { type: 'text', label: 'Page Headline', defaultValue: 'All Products' },
        description: { type: 'multiline_text', label: 'Introductory Text', description: 'Brief description of what customers will find in your catalog.', defaultValue: "Don't miss out on shopping our latest collection! curated for quality and style. Experience the perfect blend of modern aesthetics and premium craftsmanship." },
        primaryButtonText: { type: 'text', label: 'Primary Action Text', defaultValue: 'Start Shopping' },
        secondaryButtonText: { type: 'text', label: 'Secondary Action Text', defaultValue: 'View Categories' },
        showFilters: { type: 'toggle', label: 'Enable Sidebar Filters', description: 'Toggle the visibility of the category, brand, and price filters.', defaultValue: true },
        showSort: { type: 'toggle', label: 'Enable Sorting', description: 'Allow users to sort products by price, date, or rating.', defaultValue: true }
      }
    },
    productsGrid: {
      type: 'section',
      label: 'Product Grid Settings',
      description: 'Configurations for the main product display area.',
      _sourcePath: 'layoutConfig.pages.products.productsGrid',
      fields: {
        show: { type: 'toggle', label: 'Display Section', defaultValue: true },
        showPagination: { type: 'toggle', label: 'Show "Load More"', defaultValue: true },
        showWishlist: { type: 'toggle', label: 'Allow Wishlist', description: 'Show the heart icon for saving favorites.', defaultValue: true }
      }
    }
  },
  categories: {
    categoriesHeader: {
      type: 'section',
      label: 'Categories Header',
      description: 'Header section for the categories listing page with background image and text',
      _sourcePath: 'layoutConfig.pages.categories.categoriesHeader',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Page Title', defaultValue: 'Shop by Category' },
        description: { type: 'multiline_text', label: 'Page Description', defaultValue: 'Explore our comprehensive collection of premium products across various departments. Dive into our curated selections designed to match your style and needs.' },
        backgroundImage: { type: 'image', label: 'Header Background Image' }
      }
    },
    categoryGrid: {
      type: 'section',
      label: 'Category Grid',
      description: 'Grid display settings for categories',
      _sourcePath: 'layoutConfig.pages.categories.categoryGrid',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        showImages: { type: 'toggle', label: 'Show Category Images', defaultValue: true },
        showDescriptions: { type: 'toggle', label: 'Show Category Descriptions', defaultValue: true },
        columns: { type: 'number', label: 'Number of Columns', defaultValue: 3 }
      }
    }
  },
  categoryDetail: {
    banner: {
      type: 'section',
      label: 'Category Banner',
      description: 'Banner displayed at the top of a specific category page',
      _sourcePath: 'layoutConfig.pages.categoryDetail',
      fields: {
        showBanner: { type: 'toggle', label: 'Show Banner', defaultValue: true },
        showDescription: { type: 'toggle', label: 'Show Description', defaultValue: true },
        showFilters: { type: 'toggle', label: 'Show Filters', defaultValue: true },
        showProducts: { type: 'toggle', label: 'Show Products', defaultValue: true }
      }
    }
  },
  about: {
    hero: {
      type: 'section',
      label: 'Mission Banner',
      description: 'The hero section of the about page with your brand mission statement.',
      _sourcePath: 'layoutConfig.pages.about.hero',
      fields: {
        show: { type: 'toggle', label: 'Display Header', defaultValue: true },
        heroImage: { type: 'image', label: 'Mission Image', description: 'Large inspirational image for the about page.', defaultValue: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2074&auto=format&fit=crop' },
        title: { type: 'text', label: 'Mission Headline', defaultValue: 'Crafting Experiences, Delivering Joy.' },
        missionStatement: { type: 'multiline_text', label: 'Core Mission', description: 'Your brand\'s reason for existence.', defaultValue: 'Empowering individuals through style.' }
      }
    },
    story: {
      type: 'section',
      label: 'Brand Journey',
      description: 'A detailed section for telling your brand\'s history and story.',
      _sourcePath: 'layoutConfig.pages.about.story',
      fields: {
        show: { type: 'toggle', label: 'Display Story', defaultValue: true },
        content: { type: 'multiline_text', label: 'The Narrative', description: 'Your brand story text.', defaultValue: 'Fashion Hub was born from a desire to create clothing that looks good and feels even better. We believe in sustainable fashion and ethical production practices.' },
        gallerySection: {
          type: 'array',
          label: 'Brand Gallery',
          description: 'A collection of images that represent your brand heritage or workspace.',
          defaultValue: [],
          itemSchema: {
            image: { type: 'image', label: 'Gallery Image' },
            caption: { type: 'text', label: 'Brief Caption' }
          }
        }
      }
    },
    stats: {
      type: 'section',
      label: 'Milestones & Impact',
      description: 'Numeric highlights of your brand\'s success and reach.',
      _sourcePath: 'layoutConfig.pages.about.stats',
      fields: {
        show: { type: 'toggle', label: 'Display Metrics', defaultValue: true }
      }
    },
    'contact-info': {
      type: 'section',
      label: 'Location & Availability',
      description: 'Quick reference cards for your store\'s physical presence and hours.',
      _sourcePath: 'layoutConfig.pages.about.contact-info',
      fields: {
        show: { type: 'toggle', label: 'Display Section', defaultValue: true },
        title: { type: 'text', label: 'Headline', defaultValue: 'Get in Touch' },
        description: { type: 'multiline_text', label: 'Supporting Text', defaultValue: "Have questions? We'd love to hear from you. Reach out to our team via email, phone, or visit us at our store." },
        address: { type: 'multiline_text', label: 'Store Address', defaultValue: '123 Store Street\nCommerce City, ST 12345' },
        email: { type: 'text', label: 'Primary Email' },
        emailSecondary: { type: 'text', label: 'Support Email' },
        phone: { type: 'text', label: 'Contact Phone' },
        hours: { type: 'multiline_text', label: 'Business Hours', defaultValue: 'Mon - Fri: 9am - 6pm\nSat - Sun: 10am - 4pm' }
      }
    },
    values: {
      type: 'section',
      label: 'Brand Pillars',
      description: 'The core values that drive your business decisions.',
      _sourcePath: 'layoutConfig.pages.about.values',
      fields: {
        show: { type: 'toggle', label: 'Display Values', defaultValue: true },
        items: {
          type: 'array',
          label: 'Value Items',
          defaultValue: [
            { icon: 'Award', title: 'Quality First', description: "We never compromise on the quality of our products and services." },
            { icon: 'Users', title: 'Customer Focused', description: "Your satisfaction is our top priority. We're here to help." }
          ],
          itemSchema: {
            icon: { type: 'icon', label: 'Pillar Icon' },
            title: { type: 'text', label: 'Value Name' },
            description: { type: 'text', label: 'Brief Explanation' }
          }
        }
      }
    }
  },
  contact: {
    contactHeader: {
      type: 'section',
      label: 'Help Center Banner',
      description: 'Top section of the contact page with support imagery.',
      _sourcePath: 'layoutConfig.pages.contact.contactHeader',
      fields: {
        show: { type: 'toggle', label: 'Display Banner', defaultValue: true },
        backgroundImage: { type: 'image', label: 'Support Banner Image', defaultValue: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2070&auto=format&fit=crop' },
        title: { type: 'text', label: 'Page Headline', defaultValue: 'Get in Touch' },
        subtitle: { type: 'text', label: 'Supporting Text', defaultValue: "We'd love to hear from you. Here's how you can reach us." }
      }
    },
    contactForm: {
      type: 'section',
      label: 'Messaging & Details',
      description: 'The main interactive contact form and detailed contact information.',
      _sourcePath: 'layoutConfig.pages.contact.contactForm',
      fields: {
        show: { type: 'toggle', label: 'Display Section', defaultValue: true },
        infoTitle: { type: 'text', label: 'Sidebar Title', defaultValue: 'Contact Information' },
        infoDescription: { type: 'multiline_text', label: 'Sidebar Description', defaultValue: 'Fill out the form and our team will get back to you within 24 hours.' },
        phone: { type: 'text', label: 'Primary Phone' },
        phoneSecondary: { type: 'text', label: 'WhatsApp / Secondary' },
        email: { type: 'text', label: 'Inquiry Email' },
        emailSecondary: { type: 'text', label: 'Technical Support' },
        address: { type: 'multiline_text', label: 'Full Location Address' },
        hours: { type: 'multiline_text', label: 'Store Hours' },
        showHours: { type: 'toggle', label: 'Show Business Hours', defaultValue: true },
        showSocialLinks: { type: 'toggle', label: 'Show Social Presence', defaultValue: true },
        showMap: { type: 'toggle', label: 'Show Interactive Map', defaultValue: true }
      }
    }
  }
};
