/**
 * Layout Metadata
 * Provides routing and display information for layouts
 * This replaces the need for requirements JSON files
 */

export interface PageMetadata {
  id: string; // e.g., "home", "products", "contact"
  label: string; // e.g., "Home", "Products", "Contact Us"
  path: string; // e.g., "/", "/products", "/contact"
  editable?: boolean; // Whether the page is editable (default: true)
}

export interface LayoutMetadata {
  layoutId: string;
  layoutName: string;
  pages: PageMetadata[];
}

/**
 * Metadata for all layouts
 * Extracted from requirements JSON files
 */
export const layoutMetadataMap: Record<string, LayoutMetadata> = {
  'clothing': {
    layoutId: 'clothing',
    layoutName: 'Fashion Hub',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'products', label: 'Products', path: '/products' },
      { id: 'categories', label: 'Categories', path: '/categories' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
      { id: 'categoryDetail', label: 'Category Detail', path: '/categories/:slug', editable: true },
    ]
  },
  'clothing-minimal': {
    layoutId: 'clothing-minimal',
    layoutName: 'Clothing Minimal',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'products', label: 'Products', path: '/products' },
      { id: 'categories', label: 'Categories', path: '/categories' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
      { id: 'categoryDetail', label: 'Category Detail', path: '/categories/:slug', editable: true },
    ]
  },
  'food': {
    layoutId: 'food',
    layoutName: 'Savory Bites',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'products', label: 'Menu', path: '/menu' },
      { id: 'categories', label: 'Categories', path: '/categories' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
    ]
  },
  'food-modern': {
    layoutId: 'food-modern',
    layoutName: 'Culinary Canvas',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'products', label: 'Menu', path: '/menu' },
      { id: 'categories', label: 'Categories', path: '/categories' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
    ]
  },
  'electronics': {
    layoutId: 'electronics',
    layoutName: 'Electronics Tech',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'products', label: 'Products', path: '/products' },
      { id: 'categories', label: 'Categories', path: '/categories' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
    ]
  },
  'electronics-grid': {
    layoutId: 'electronics-grid',
    layoutName: 'Electronics Grid',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'products', label: 'Products', path: '/products' },
      { id: 'categories', label: 'Categories', path: '/categories' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
    ]
  },
  'booking': {
    layoutId: 'booking',
    layoutName: 'Booking Standard',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'book', label: 'Book Appointment', path: '/book' },
      { id: 'services', label: 'Services', path: '/services' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
    ]
  },
  'booking-agenda': {
    layoutId: 'booking-agenda',
    layoutName: 'Appointment Manager',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'book', label: 'Book Appointment', path: '/book' },
      { id: 'services', label: 'Services', path: '/services' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
    ]
  },
  'motivational-speaker': {
    layoutId: 'motivational-speaker',
    layoutName: 'Motivational Speaker',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'products', label: 'Services', path: '/services' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
    ]
  },
  // Legacy/alternative IDs
  'fashion-hub': {
    layoutId: 'clothing',
    layoutName: 'Fashion Hub',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'products', label: 'Products', path: '/products' },
      { id: 'categories', label: 'Categories', path: '/categories' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
      { id: 'categoryDetail', label: 'Category Detail', path: '/categories/:slug', editable: true },
    ]
  },
  'layout-clothing-1': {
    layoutId: 'clothing',
    layoutName: 'Fashion Hub',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'products', label: 'Products', path: '/products' },
      { id: 'categories', label: 'Categories', path: '/categories' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
      { id: 'categoryDetail', label: 'Category Detail', path: '/categories/:slug', editable: true },
    ]
  },
  'layout-clothing-2': {
    layoutId: 'clothing-minimal',
    layoutName: 'Clothing Minimal',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'products', label: 'Products', path: '/products' },
      { id: 'categories', label: 'Categories', path: '/categories' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
      { id: 'categoryDetail', label: 'Category Detail', path: '/categories/:slug', editable: true },
    ]
  },
  'layout-food-1': {
    layoutId: 'food',
    layoutName: 'Savory Bites',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'products', label: 'Menu', path: '/menu' },
      { id: 'categories', label: 'Categories', path: '/categories' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
    ]
  },
  'layout-food-2': {
    layoutId: 'food-modern',
    layoutName: 'Culinary Canvas',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'products', label: 'Menu', path: '/menu' },
      { id: 'categories', label: 'Categories', path: '/categories' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
    ]
  },
  'layout-electronics-1': {
    layoutId: 'electronics',
    layoutName: 'Electronics Tech',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'products', label: 'Products', path: '/products' },
      { id: 'categories', label: 'Categories', path: '/categories' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
    ]
  },
  'layout-electronics-2': {
    layoutId: 'electronics-grid',
    layoutName: 'Electronics Grid',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'products', label: 'Products', path: '/products' },
      { id: 'categories', label: 'Categories', path: '/categories' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
    ]
  },
  'layout-booking-1': {
    layoutId: 'booking',
    layoutName: 'Booking Standard',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'book', label: 'Book Appointment', path: '/book' },
      { id: 'services', label: 'Services', path: '/services' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
    ]
  },
  'layout-booking-2': {
    layoutId: 'booking-agenda',
    layoutName: 'Appointment Manager',
    pages: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'book', label: 'Book Appointment', path: '/book' },
      { id: 'services', label: 'Services', path: '/services' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' },
    ]
  },
};

export function getLayoutMetadata(layoutId: string): LayoutMetadata | null {
  return layoutMetadataMap[layoutId] || null;
}
