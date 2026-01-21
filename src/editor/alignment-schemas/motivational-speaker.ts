import { LayoutAlignmentSchema } from './types';

export const MotivationalSpeakerSchema: LayoutAlignmentSchema = {
  home: {
    hero: {
      type: 'section',
      label: 'Hero Section',
      _sourcePath: 'layoutConfig.hero',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        hero_image: { type: 'image', label: 'Background Image' },
        hero_video: { type: 'text', label: 'Background Video URL' },
        subtitle: { type: 'text', label: 'Subtitle / Badge' },
        title: { type: 'multiline_text', label: 'Main Title' },
        description: { type: 'multiline_text', label: 'Description' },
        primaryCTA: { type: 'button', label: 'Primary Button', fields: { text: { type: 'text', label: 'Button Text' }, link: { type: 'text', label: 'Button Link' } } },
        secondaryCTA: { type: 'button', label: 'Secondary Button', fields: { text: { type: 'text', label: 'Button Text' }, link: { type: 'text', label: 'Button Link' } } }
      }
    },
    trust: {
      type: 'section',
      label: 'Trusted By Logos',
      _sourcePath: 'layoutConfig.sections.brands',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true }
      }
    },
    about: {
      type: 'section',
      label: 'Speaker Bio',
      _sourcePath: 'layoutConfig.sections.about',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        bio_image: { type: 'image', label: 'Speaker Portrait' },
        title: { type: 'multiline_text', label: 'Title' },
        description: { type: 'multiline_text', label: 'Bio Text' }
      }
    },
    services: {
      type: 'section',
      label: 'Digital Content',
      _sourcePath: 'layoutConfig.sections.categories',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Section Title' },
        viewAllLabel: { type: 'text', label: 'View All Link Text' }
      }
    },
    subscription: {
      type: 'section',
      label: 'Membership Banner',
      _sourcePath: 'layoutConfig.sections.subscription',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        subscription_banner: { type: 'image', label: 'Background Image' },
        subscriptionBadge: { type: 'text', label: 'Badge Text' },
        subscriptionTitle: { type: 'multiline_text', label: 'Title' },
        subscriptionDescription: { type: 'multiline_text', label: 'Description' },
        subscriptionButton: { type: 'text', label: 'Button Text' }
      }
    },
    testimonials: {
      type: 'section',
      label: 'Success Stories',
      _sourcePath: 'layoutConfig.sections.testimonials',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true }
      }
    },
    marketing: {
      type: 'section',
      label: 'Newsletter',
      _sourcePath: 'layoutConfig.sections.marketing',
      fields: {
        showNewsletter: { type: 'toggle', label: 'Show Newsletter', defaultValue: true },
        newsletterBadge: { type: 'text', label: 'Badge Text' },
        newsletterTitle: { type: 'text', label: 'Title' },
        newsletterSubtitle: { type: 'text', label: 'Subtitle' },
        newsletterPlaceholder: { type: 'text', label: 'Placeholder Text' },
        newsletterButton: { type: 'text', label: 'Button Text' }
      }
    },
    faq: {
      type: 'section',
      label: 'FAQ',
      _sourcePath: 'layoutConfig.sections.faq',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true }
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
        buttonText: { type: 'text', label: 'Button Text', defaultValue: 'Get Started' },
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
      fields: {}
    },
    'services-list': {
      type: 'section',
      label: 'Services List',
      fields: {}
    }
  }
};
