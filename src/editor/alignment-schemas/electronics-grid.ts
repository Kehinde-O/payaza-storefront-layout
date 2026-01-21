import { LayoutAlignmentSchema } from './types';

export const ElectronicsGridSchema: LayoutAlignmentSchema = {
  home: {
    header: {
      type: 'section',
      label: 'Store Header',
      _sourcePath: 'layoutConfig.sections.header',
      fields: {
        subtitle: { type: 'text', label: 'Header Subtitle' }
      }
    },
    marketing: {
      type: 'section',
      label: 'Promotional Banner',
      _sourcePath: 'layoutConfig.sections.marketing',
      fields: {
        show: { type: 'toggle', label: 'Show Banner', defaultValue: false },
        sale_banner: { type: 'image', label: 'Banner Image' },
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'text', label: 'Subtitle' },
        button: {
          type: 'button',
          label: 'Button',
          fields: {
            text: { type: 'text', label: 'Button Text' },
            link: { type: 'text', label: 'Button Link' }
          }
        }
      }
    },
    products: {
      type: 'section',
      label: 'Product Listing',
      _sourcePath: 'layoutConfig.sections.products',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Section Title' }
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
