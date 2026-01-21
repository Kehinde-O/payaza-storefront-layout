export type EditorInputType = 
  | 'text' | 'multiline_text' | 'number' | 'toggle' 
  | 'image' | 'color' | 'select' | 'array' | 'section'
  | 'button' | 'icon' | 'object';

export interface SchemaNode {
  type: EditorInputType;
  label: string;          // Human-readable label (e.g., "Hero Headline")
  description?: string;   // Helpful tooltip for the admin
  defaultValue?: any;     // Fallback value
  
  // For 'select' inputs
  options?: { label: string; value: string | number }[];

  // For 'array' inputs (Recursive)
  // MUST match the structure of objects inside the existing JSON array
  itemSchema?: Record<string, SchemaNode>; 

  // For 'section' inputs (Recursive)
  // MUST match the keys of the nested object in the existing JSON
  fields?: Record<string, SchemaNode>;
  
  // Source path mapping for data transformation
  _sourcePath?: string;   // Path in StoreConfig where this field's data lives (e.g., "layoutConfig.pages.products.productsHeader")
  
  // Legacy support for button link fields (deprecated, use label instead)
  link?: string;          // Deprecated: use label instead
}

/**
 * Mapping of section IDs to their schema nodes for a specific page
 */
export type PageAlignmentSchema = Record<string, SchemaNode>;

/**
 * Full alignment schema for a layout, organized by page ID
 */
export type LayoutAlignmentSchema = Record<string, PageAlignmentSchema>;
