import { StoreConfig } from '../lib/store-types';

/**
 * Full inventory of layouts
 * Note: requirements field kept for backward compatibility but is now empty
 * All functionality uses alignment-schemas instead
 */
export interface LayoutInventory {
  /**
   * Map of layout ID to its static configuration/JSON
   */
  data: Record<string, StoreConfig>;
  /**
   * Map of layout ID to its requirements/schema definition
   * @deprecated Use alignment-schemas instead
   */
  requirements: Record<string, any>;
}

/**
 * Common editor props for PayazaFormEditor
 */
export interface BaseEditorProps {
  /**
   * The layout ID being edited (e.g., 'food', 'clothing')
   */
  layoutId: string;
  /**
   * Initial layout data (StoreConfig)
   */
  initialData: StoreConfig;
  /**
   * Full inventory for context awareness
   */
  inventory?: LayoutInventory;
  /**
   * Callback triggered when any data changes
   */
  onChange?: (data: StoreConfig) => void;
  /**
   * Callback triggered when save is explicitly requested
   */
  onSave?: (data: StoreConfig) => void;
  /**
   * Callback triggered when publish is explicitly requested
   */
  onPublish?: (data: StoreConfig) => void;
  /**
   * Additional CSS classes for the editor container
   */
  className?: string;
}

/**
 * Props for embedded editor variants
 */
export interface EmbeddedEditorProps extends BaseEditorProps {
  /**
   * Height of the editor container
   * @default '600px'
   */
  height?: string | number;
}

/**
 * Props for full-page editor variants
 */
export interface FullPageEditorProps extends BaseEditorProps {
  /**
   * Title displayed in the editor header
   */
  title?: string;
  /**
   * Callback triggered when the back button is clicked
   */
  onBack?: () => void;
  /**
   * Callback triggered to go back to store settings step
   */
  onBackToSettings?: () => void;
  /**
   * Callback triggered to open assets library
   */
  onOpenAssets?: () => void;
  /**
   * Callback triggered to go back to theme selector set
   */
  onBackToTheme?: () => void;
  /**
   * Optional store name passed from host app
   */
  storeName?: string;
  /**
   * Optional store description passed from host app
   */
  storeDescription?: string;
  /**
   * Optional array of existing asset URLs passed from host app
   */
  assets?: string[];
  /**
   * Optional custom text for the publish button (e.g., "Update" for published stores)
   */
  publishButtonText?: string;
}

/**
 * Interface representing a page within a layout
 */
export interface LayoutPage {
  id: string;
  name: string;
  content: any[];
}

/**
 * Mapping of page IDs to their content
 */
export type LayoutPagesMap = Record<string, any[]>;
