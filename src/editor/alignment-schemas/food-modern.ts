import { LayoutAlignmentSchema } from './types';

export const FoodModernSchema: LayoutAlignmentSchema = {
  home: {
    hero: {
      type: 'section',
      label: 'Hero Section',
      _sourcePath: 'layoutConfig.sections.hero',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        videoUrl: { type: 'text', label: 'Background Video URL' },
        posterImage: { type: 'image', label: 'Video Poster Image' },
        title: { type: 'text', label: 'Main Title' },
        subtitle: { type: 'text', label: 'Subtitle' },
        badge: { type: 'text', label: 'Badge Text' },
        titleHighlight: { type: 'text', label: 'Title Highlight' },
        showCTA: { type: 'toggle', label: 'Show Primary Button' },
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
    about: {
      type: 'section',
      label: 'About / Philosophy',
      _sourcePath: 'layoutConfig.sections.about',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        image: { type: 'image', label: 'About Image' },
        title: { type: 'text', label: 'Section Title' },
        description: { type: 'multiline_text', label: 'Description' },
        badge: { type: 'text', label: 'Section Badge' },
        quote: { type: 'text', label: 'Featured Quote' },
        author: { type: 'text', label: 'Quote Author' },
        showImage: { type: 'toggle', label: 'Show Image' },
        showSignature: { type: 'toggle', label: 'Show Signature' }
      }
    },
    menuGrid: {
      type: 'section',
      label: 'Featured Dishes',
      _sourcePath: 'layoutConfig.sections.menuGrid',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Section Title' },
        showViewAll: { type: 'toggle', label: 'Show View All Button' },
        columns: { type: 'number', label: 'Grid Columns', defaultValue: 3 }
      }
    },
    testimonials: {
      type: 'section',
      label: 'Guest Stories',
      _sourcePath: 'layoutConfig.sections.testimonials',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Section Title' },
        subtitle: { type: 'text', label: 'Subtitle' },
        showRatings: { type: 'toggle', label: 'Show Ratings' },
        limit: { type: 'number', label: 'Testimonial Limit', defaultValue: 3 },
        testimonials: {
          type: 'array',
          label: 'Testimonials',
          itemSchema: {
            image: { type: 'image', label: 'Customer Image' },
            name: { type: 'text', label: 'Customer Name' },
            text: { type: 'multiline_text', label: 'Testimonial Text' },
            rating: { type: 'number', label: 'Rating' },
            location: { type: 'text', label: 'Location' },
            date: { type: 'text', label: 'Date' }
          }
        }
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
        buttonText: { type: 'text', label: 'Button Text', defaultValue: 'Reserve Now' },
        buttonLink: { type: 'text', label: 'Button Link', defaultValue: '/reserve' }
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
        subtitle: { type: 'text', label: 'Subtitle' }
      }
    },
    menuGrid: {
      type: 'section',
      label: 'Menu Grid',
      _sourcePath: 'layoutConfig.pages.menu.menuGrid',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        layout: { 
          type: 'select', 
          label: 'Layout Style',
          options: [
            { label: 'Modern', value: 'modern' },
            { label: 'Classic', value: 'classic' },
            { label: 'Grid', value: 'grid' }
          ]
        },
        showCategories: { type: 'toggle', label: 'Show Categories' }
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
        show: { type: 'toggle', label: 'Show Section', defaultValue: true }
      }
    }
  },
  categories: {
    categoryGrid: {
      type: 'section',
      label: 'Category Grid',
      _sourcePath: 'layoutConfig.pages.categories.categoryGrid',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true }
      }
    }
  },
  categoryDetail: {
    categoryDetail: {
      type: 'section',
      label: 'Category Detail Settings',
      _sourcePath: 'layoutConfig.pages.categoryDetail.categoryDetail',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true }
      }
    }
  },
  about: {
    aboutPageSettings: {
      type: 'section',
      label: 'About Page Settings',
      _sourcePath: 'layoutConfig.pages.about.aboutPageSettings',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Page Title' }
      }
    }
  },
  contact: {
    contactPage: {
      type: 'section',
      label: 'Contact Page Settings',
      _sourcePath: 'layoutConfig.pages.contact.contactPage',
      fields: {
        show: { type: 'toggle', label: 'Show Section', defaultValue: true },
        title: { type: 'text', label: 'Page Title' }
      }
    }
  }
};
