import { LayoutAlignmentSchema } from './types';

export const BookingSchema: LayoutAlignmentSchema = {
  home: {
    hero: {
      type: 'section',
      label: 'Hero Section',
      _sourcePath: 'layoutConfig.hero',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        showCTA: { type: 'toggle', label: 'Show Primary Button', defaultValue: true },
        hero_bg: { type: 'image', label: 'Background Image' },
        hero_badge: { type: 'text', label: 'Badge Text' },
        title: { type: 'multiline_text', label: 'Main Title' },
        subtitle: { type: 'multiline_text', label: 'Subtitle' },
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
    },
    featuredServices: {
      type: 'section',
      label: 'Signature Services',
      _sourcePath: 'layoutConfig.sections.categories',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Section Title' },
        showViewAll: { type: 'toggle', label: 'Show View All Button' },
        limit: { type: 'number', label: 'Service Limit', defaultValue: 6 }
      }
    },
    team: {
      type: 'section',
      label: 'Meet the Specialists',
      _sourcePath: 'layoutConfig.sections.team',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        specialist_image: { type: 'image', label: 'Specialist Image' },
        memberName: { type: 'text', label: 'Member Name' },
        memberRole: { type: 'text', label: 'Member Role' },
        title: { type: 'multiline_text', label: 'Section Title' },
        subtitle: { type: 'multiline_text', label: 'Description' }
      }
    },
    testimonials: {
      type: 'section',
      label: 'Client Reviews',
      _sourcePath: 'layoutConfig.sections.testimonials',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Section Title' },
        showRatings: { type: 'toggle', label: 'Show Ratings' },
        limit: { type: 'number', label: 'Testimonial Limit', defaultValue: 3 },
        testimonials: {
          type: 'array',
          label: 'Testimonials',
          itemSchema: {
            image: { type: 'image', label: 'Client Image' },
            name: { type: 'text', label: 'Client Name' },
            text: { type: 'multiline_text', label: 'Testimonial Text' },
            rating: { type: 'number', label: 'Rating' },
            location: { type: 'text', label: 'Location' },
            date: { type: 'text', label: 'Date' }
          }
        }
      }
    },
    marketing: {
      type: 'section',
      label: 'Call to Action',
      _sourcePath: 'layoutConfig.sections.marketing',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        ctaTitle: { type: 'text', label: 'Title' },
        ctaDescription: { type: 'text', label: 'Description' },
        ctaButton: { type: 'text', label: 'Button Text' }
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
        buttonText: { type: 'text', label: 'Button Text', defaultValue: 'Book Now' },
        buttonLink: { type: 'text', label: 'Button Link', defaultValue: '/book' }
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
    contactHeader: {
      type: 'section',
      label: 'Contact Header',
      _sourcePath: 'layoutConfig.pages.contact.contactHeader',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Page Title' }
      }
    },
    contactForm: {
      type: 'section',
      label: 'Contact Form Settings',
      _sourcePath: 'layoutConfig.pages.contact.contactForm',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true }
      }
    }
  },
  services: {
    servicesHeader: {
      type: 'section',
      label: 'Services Header',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Page Title' },
        showFilters: { type: 'toggle', label: 'Show Filters' },
        showSearch: { type: 'toggle', label: 'Show Search' }
      }
    },
    servicesGrid: {
      type: 'section',
      label: 'Services Grid',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        showPagination: { type: 'toggle', label: 'Show Pagination' },
        showBookButton: { type: 'toggle', label: 'Show Book Button' }
      }
    }
  },
  serviceDetail: {
    serviceDetail: {
      type: 'section',
      label: 'Service Detail Settings',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        showBookButton: { type: 'toggle', label: 'Show Book Button' },
        showDescription: { type: 'toggle', label: 'Show Description' },
        showDuration: { type: 'toggle', label: 'Show Duration' },
        showPrice: { type: 'toggle', label: 'Show Price' },
        showSpecialists: { type: 'toggle', label: 'Show Specialists' }
      }
    }
  },
  book: {
    bookingHeader: {
      type: 'section',
      label: 'Booking Header',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Page Title' },
        showSteps: { type: 'toggle', label: 'Show Steps' }
      }
    },
    bookingForm: {
      type: 'section',
      label: 'Booking Form Settings',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        showServiceSelection: { type: 'toggle', label: 'Show Service Selection' },
        showDatePicker: { type: 'toggle', label: 'Show Date Picker' },
        showTimeSlot: { type: 'toggle', label: 'Show Time Slots' },
        showSpecialistSelection: { type: 'toggle', label: 'Show Specialist Selection' }
      }
    }
  },
  categories: {
    categoriesHeader: {
      type: 'section',
      label: 'Categories Header',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Page Title' }
      }
    },
    categoryGrid: {
      type: 'section',
      label: 'Category Grid',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        showServices: { type: 'toggle', label: 'Show Services' }
      }
    }
  },
  categoryDetail: {
    categoryDetail: {
      type: 'section',
      label: 'Category Detail Settings',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        showServices: { type: 'toggle', label: 'Show Services' }
      }
    }
  }
};
