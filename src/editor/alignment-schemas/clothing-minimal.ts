import { LayoutAlignmentSchema } from './types';

export const ClothingMinimalSchema: LayoutAlignmentSchema = {
  home: {
    header: {
      type: 'section',
      label: 'Minimalist Navbar',
      description: 'Control the visibility of the clean, floating header navigation.',
      _sourcePath: 'layoutConfig.sections.header',
      fields: {
        show: { type: 'toggle', label: 'Display Header', description: 'Show or hide the main navigation bar.', defaultValue: true }
      }
    },
    hero: {
      type: 'section',
      label: 'Split-Screen Hero',
      description: 'A modern split-screen design with text content on one side and a large high-fashion image on the other.',
      _sourcePath: 'layoutConfig.sections.hero',
      fields: {
        show: { type: 'toggle', label: 'Display Section', defaultValue: true },
        badge: { type: 'text', label: 'Season Badge', description: 'Short uppercase text (e.g., "COLLECTION 2024").' },
        title: { type: 'text', label: 'Main Headline', description: 'The primary message for your visitors.' },
        subtitle: { type: 'text', label: 'Supporting Text', description: 'Brief sub-text explaining your brand or the featured look.' },
        primaryCTA: { type: 'text', label: 'Button Label', description: 'Text for the main shop button.' }
      }
    },
    features: {
      type: 'section',
      label: 'Service Highlights',
      description: 'Clean row of icons and text summarizing your store\'s key services.',
      _sourcePath: 'layoutConfig.sections.features',
      fields: {
        show: { type: 'toggle', label: 'Display Section', defaultValue: true },
        items: {
          type: 'array',
          label: 'Service Items',
          itemSchema: {
            icon: { type: 'text', label: 'Icon Name', description: 'Name of the icon from the Lucide library.' },
            title: { type: 'text', label: 'Headline' },
            description: { type: 'text', label: 'Supporting Text' }
          }
        }
      }
    },
    categories: {
      type: 'section',
      label: 'Clean Category Grid',
      description: 'A structured grid display for your main product categories.',
      _sourcePath: 'layoutConfig.sections.categories',
      fields: {
        show: { type: 'toggle', label: 'Display Section', defaultValue: true },
        title: { type: 'text', label: 'Section Title', defaultValue: 'Categories' },
        viewAllLabel: { type: 'text', label: 'Link Label', defaultValue: 'View All' }
      }
    },
    featuredProducts: {
      type: 'section',
      label: 'The Essentials',
      description: 'A minimal product grid highlighting your core or trending pieces.',
      _sourcePath: 'layoutConfig.sections.featuredProducts',
      fields: {
        show: { type: 'toggle', label: 'Display Section', defaultValue: true },
        title: { type: 'text', label: 'Grid Title', defaultValue: 'The Essentials' },
        subtitle: { type: 'text', label: 'Grid Sub-title', defaultValue: 'Timeless pieces designed to build the foundation of your wardrobe.' }
      }
    },
    about: {
      type: 'section',
      label: 'Visual Storytelling',
      description: 'An interactive "Shop the Look" section with hotspots or stylized brand messaging.',
      _sourcePath: 'layoutConfig.sections.about',
      fields: {
        show: { type: 'toggle', label: 'Display Section', defaultValue: true },
        title: { type: 'text', label: 'Editorial Title' },
        description: { type: 'multiline_text', label: 'Brand Story' }
      }
    },
    promoBanner: {
      type: 'section',
      label: 'Urgency Banner',
      description: 'A simple, narrow banner for announcements, sales, or free shipping info.',
      _sourcePath: 'layoutConfig.sections.promoBanner',
      fields: {
        show: { type: 'toggle', label: 'Display Banner', defaultValue: false },
        text: { 
          type: 'text', 
          label: 'Banner Messaging',
          defaultValue: 'Free shipping on orders over $200'
        },
        link: { 
          type: 'text', 
          label: 'Action URL',
          defaultValue: '/products'
        }
      }
    }
  },
  products: {
    productsHeader: {
      type: 'section',
      label: 'Minimalist Header',
      description: 'The simple, typography-focused header for the product listing page.',
      _sourcePath: 'layoutConfig.pages.products.productsHeader',
      fields: {
        show: { type: 'toggle', label: 'Display Header', defaultValue: true },
        title: { type: 'text', label: 'Page Headline' }
      }
    },
    productsGrid: {
      type: 'section',
      label: 'Collection Display',
      description: 'Main product grid settings for the minimalist layout.',
      _sourcePath: 'layoutConfig.pages.products.productsGrid',
      fields: {
        show: { type: 'toggle', label: 'Display Grid', defaultValue: true }
      }
    }
  },
  categories: {
    categoriesHeader: {
      type: 'section',
      label: 'Categories Intro',
      description: 'The clean header for the category overview page.',
      _sourcePath: 'layoutConfig.pages.categories.categoriesHeader',
      fields: {
        show: { type: 'toggle', label: 'Display Header', defaultValue: true },
        title: { type: 'text', label: 'Headline' },
        description: { type: 'multiline_text', label: 'Intro Text' }
      }
    },
    categoryGrid: {
      type: 'section',
      label: 'Organized Collections',
      description: 'Grid layout settings for browsing categories.',
      _sourcePath: 'layoutConfig.pages.categories.categoryGrid',
      fields: {
        show: { type: 'toggle', label: 'Display Grid', defaultValue: true },
        showImages: { type: 'toggle', label: 'Show Preview Images', defaultValue: true },
        showDescriptions: { type: 'toggle', label: 'Show Brief Summaries', defaultValue: true }
      }
    }
  },
  categoryDetail: {
    banner: {
      type: 'section',
      label: 'Category Detail View',
      description: 'Minimal settings for specific category pages.',
      _sourcePath: 'layoutConfig.pages.categoryDetail',
      fields: {
        showBanner: { type: 'toggle', label: 'Display Banner Image', defaultValue: true },
        showDescription: { type: 'toggle', label: 'Show Description Text', defaultValue: true },
        showFilters: { type: 'toggle', label: 'Enable Filters', defaultValue: true },
        showProducts: { type: 'toggle', label: 'Show Product List', defaultValue: true }
      }
    }
  },
  about: {
    aboutHeader: {
      type: 'section',
      label: 'Identity Banner',
      description: 'The minimalist hero section for the brand story page.',
      _sourcePath: 'layoutConfig.pages.about.aboutHeader',
      fields: {
        show: { type: 'toggle', label: 'Display Header', defaultValue: true },
        title: { type: 'text', label: 'Brand Headline' },
        missionStatement: { type: 'multiline_text', label: 'Mission Focus' },
        heroImage: { type: 'image', label: 'Brand Image' }
      }
    },
    aboutContent: {
      type: 'section',
      label: 'Heritage Text',
      description: 'A focused area for your detailed brand narrative.',
      _sourcePath: 'layoutConfig.pages.about.aboutContent',
      fields: {
        show: { type: 'toggle', label: 'Display Content', defaultValue: true },
        content: { type: 'multiline_text', label: 'The Story' }
      }
    },
    statsSection: {
      type: 'section',
      label: 'By The Numbers',
      description: 'Numeric proof points of your brand\'s growth and success.',
      _sourcePath: 'layoutConfig.pages.about.statsSection',
      fields: {
        show: { type: 'toggle', label: 'Display Section', defaultValue: true }
      }
    },
    contactSection: {
      type: 'section',
      label: 'Quick Contact',
      description: 'A brief section for fast access to your contact details.',
      _sourcePath: 'layoutConfig.pages.about.contactSection',
      fields: {
        show: { type: 'toggle', label: 'Display Section', defaultValue: true }
      }
    }
  },
  contact: {
    contactHeader: {
      type: 'section',
      label: 'Simple Support Header',
      description: 'A clean title section for the contact page.',
      _sourcePath: 'layoutConfig.pages.contact.contactHeader',
      fields: {
        show: { type: 'toggle', label: 'Display Header', defaultValue: true },
        title: { type: 'text', label: 'Headline' },
        subtitle: { type: 'multiline_text', label: 'Supporting Text' },
        backgroundImage: { type: 'image', label: 'Subtle Background' }
      }
    },
    contactForm: {
      type: 'section',
      label: 'Visual Detail Control',
      description: 'Toggle the auxiliary information sections on the contact page.',
      _sourcePath: 'layoutConfig.pages.contact.contactForm',
      fields: {
        showForm: { type: 'toggle', label: 'Show Contact Form', defaultValue: true },
        showMap: { type: 'toggle', label: 'Show Location Map', defaultValue: true },
        showHours: { type: 'toggle', label: 'Show Business Hours', defaultValue: true },
        showSocialLinks: { type: 'toggle', label: 'Show Social Media', defaultValue: true }
      }
    }
  }
};
