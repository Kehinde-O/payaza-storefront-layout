import { LayoutAlignmentSchema } from './types';

export const ElectronicsSchema: LayoutAlignmentSchema = {
  home: {
    hero: {
      type: 'section',
      label: 'Hero Section',
      description: 'High-impact hero with 3D-style product showcase',
      _sourcePath: 'layoutConfig.hero',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        showBadges: { type: 'toggle', label: 'Show Badges', defaultValue: true },
        showCTA: { type: 'toggle', label: 'Show Primary Button', defaultValue: true },
        badge: { type: 'text', label: 'Badge Text' },
        title: { type: 'multiline_text', label: 'Main Title' },
        subtitle: { type: 'multiline_text', label: 'Subtitle' },
        primaryButton: {
          type: 'button',
          label: 'Primary Button',
          fields: {
            text: { type: 'text', label: 'Button Text' },
            link: { type: 'text', label: 'Button Link' }
          }
        }
      }
    },
    brands: {
      type: 'section',
      label: 'Brands Ticker',
      _sourcePath: 'layoutConfig.sections.brands',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true }
      }
    },
    categories: {
      type: 'section',
      label: 'Ecosystems Categories',
      _sourcePath: 'layoutConfig.sections.categories',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        showViewAll: { type: 'toggle', label: 'Show View All Link' },
        limit: { type: 'number', label: 'Number of Categories', defaultValue: 5 }
      }
    },
    featuredProducts: {
      type: 'section',
      label: 'Latest Drops',
      _sourcePath: 'layoutConfig.sections.featuredProducts',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Section Title' },
        showAddToCart: { type: 'toggle', label: 'Show Add to Cart Button' }
      }
    },
    features: {
      type: 'section',
      label: 'Tech Features',
      _sourcePath: 'layoutConfig.sections.features',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        showIcons: { type: 'toggle', label: 'Show Icons' }
      }
    },
    marketing: {
      type: 'section',
      label: 'Newsletter & Promo',
      _sourcePath: 'layoutConfig.sections.marketing',
      fields: {
        showNewsletter: { type: 'toggle', label: 'Show Newsletter', defaultValue: true },
        newsletterTitle: { type: 'text', label: 'Newsletter Title' },
        newsletterSubtitle: { type: 'text', label: 'Newsletter Subtitle' },
        newsletterPlaceholder: { type: 'text', label: 'Input Placeholder' },
        newsletterButton: { type: 'text', label: 'Button Text' }
      }
    },
    promoBanner: {
      type: 'section',
      label: 'Promotional Banner',
      _sourcePath: 'layoutConfig.sections.promoBanner',
      fields: {
        show: { type: 'toggle', label: 'Show Banner', defaultValue: false },
        image: { type: 'image', label: 'Banner Image' },
        title: { type: 'text', label: 'Banner Title' },
        subtitle: { type: 'multiline_text', label: 'Banner Subtitle' },
        buttonText: { type: 'text', label: 'Button Text', defaultValue: 'Shop Now' },
        buttonLink: { type: 'text', label: 'Button Link', defaultValue: '/products' }
      }
    }
  },
  about: {
    hero: {
      type: 'section',
      label: 'About Header',
      _sourcePath: 'layoutConfig.pages.about.hero',
      fields: {
        heroImage: { type: 'image', label: 'Hero Image' },
        title: { type: 'text', label: 'Title' },
        missionStatement: { type: 'text', label: 'Mission Statement' }
      }
    },
    story: {
      type: 'section',
      label: 'Our Story',
      _sourcePath: 'layoutConfig.pages.about.story',
      fields: {
        content: { type: 'multiline_text', label: 'Story Content' }
      }
    },
    stats: {
      type: 'section',
      label: 'Statistics',
      _sourcePath: 'layoutConfig.pages.about.stats',
      fields: {}
    },
    'contact-info': {
      type: 'section',
      label: 'Contact Info',
      _sourcePath: 'layoutConfig.pages.about.contact-info',
      fields: {}
    }
  },
  contact: {
    hero: {
      type: 'section',
      label: 'Contact Header',
      _sourcePath: 'layoutConfig.pages.contact.hero',
      fields: {}
    },
    form: {
      type: 'section',
      label: 'Contact Form',
      _sourcePath: 'layoutConfig.pages.contact.form',
      fields: {}
    },
    map: {
      type: 'section',
      label: 'Location Map',
      _sourcePath: 'layoutConfig.pages.contact.map',
      fields: {}
    }
  }
};
