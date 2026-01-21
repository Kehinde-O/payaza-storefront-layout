import { LayoutAlignmentSchema } from './types';

export const BookingAgendaSchema: LayoutAlignmentSchema = {
  home: {
    header: {
      type: 'section',
      label: 'Header & Date Picker',
      _sourcePath: 'layoutConfig.sections.header',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Page Title' },
        subtitle: { type: 'text', label: 'Subtitle' }
      }
    },
    promoBanner: {
      type: 'section',
      label: 'Promo Banner',
      _sourcePath: 'layoutConfig.sections.marketing',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: false },
        promo_banner: { type: 'image', label: 'Banner Image' },
        badge: { type: 'text', label: 'Badge Text' },
        title: { type: 'multiline_text', label: 'Title' },
        description: { type: 'multiline_text', label: 'Description' },
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
    services: {
      type: 'section',
      label: 'Service List',
      _sourcePath: 'layoutConfig.sections.services',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Section Title' }
      }
    },
    team: {
      type: 'section',
      label: 'Our Experts',
      _sourcePath: 'layoutConfig.sections.team',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Section Title' },
        viewAllLabel: { type: 'text', label: 'View All Link Text' }
      }
    },
    testimonials: {
      type: 'section',
      label: 'Client Reviews',
      _sourcePath: 'layoutConfig.sections.testimonials',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'text', label: 'Subtitle' }
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
  },
  services: {
    hero: {
      type: 'section',
      label: 'Services Header',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Page Title' },
        description: { type: 'multiline_text', label: 'Description' }
      }
    },
    'services-list': {
      type: 'section',
      label: 'Services List',
      fields: {}
    }
  }
};
