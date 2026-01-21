/**
 * Payaza Form Engine
 * Parses overlay pattern JSON (data + _schema) and generates form configurations
 */
import { SchemaNode, EditorInputType } from '../alignment-schemas/types';
import { deepClone } from '../../lib/utils';

export interface OverlayLayoutJSON {
  layoutId: string;
  layoutName: string;
  pages: Array<{
    id: string;
    label: string;
    path: string;
    data: Record<string, any>;
    _schema: Record<string, any> | Record<string, SchemaNode>;
  }>;
}

// Keep for backward compatibility but mark as deprecated where possible
export interface SchemaField extends Partial<SchemaNode> {
  _editor?: string;
  _label?: string;
  _description?: string;
  _itemEditor?: string;
  _itemSchema?: Record<string, SchemaField>;
  [key: string]: any;
}

export interface FieldConfig {
  editor: string;
  label: string;
  description?: string;
  value: any;
  path: string[];
  itemSchema?: Record<string, any>;
  itemEditor?: string;
}

/**
 * Parse overlay pattern JSON structure
 */
export function parseLayoutJSON(json: OverlayLayoutJSON): OverlayLayoutJSON {
  // Validate structure
  if (!json.layoutId || !json.pages || !Array.isArray(json.pages)) {
    throw new Error('Invalid overlay layout JSON structure');
  }

  // Validate each page has data and _schema
  json.pages.forEach(page => {
    if (!page.data || !page._schema) {
      throw new Error(`Page ${page.id} missing data or _schema`);
    }
  });

  return json;
}

/**
 * Get schema for a specific page
 */
export function getPageSchema(
  pageId: string,
  layoutJson: OverlayLayoutJSON
): { data: Record<string, any>; schema: Record<string, any> } | null {
  const page = layoutJson.pages.find(p => p.id === pageId);
  if (!page) return null;

  return {
    data: page.data,
    schema: page._schema,
  };
}

/**
 * Generate field configuration from schema field (supports both legacy and new formats)
 */
export function getFieldConfig(
  schemaField: any,
  dataValue: any,
  path: string[] = []
): FieldConfig {
  const editor = schemaField.type || schemaField._editor || 'text';
  const label = schemaField.label || schemaField._label || '';
  const description = schemaField.description || schemaField._description;
  const itemSchema = schemaField.itemSchema || schemaField._itemSchema;
  const itemEditor = schemaField.itemEditor || schemaField._itemEditor;

  return {
    editor,
    label,
    description,
    value: dataValue,
    path,
    itemSchema,
    itemEditor,
  };
}

/**
 * Resolve data path from schema structure
 */
export function resolveDataPath(
  schemaPath: string[],
  schema: Record<string, any>,
  data: Record<string, any>
): any {
  let currentSchema = schema;
  let currentData = data;

  for (const key of schemaPath) {
    if (currentSchema[key] && currentData[key] !== undefined) {
      currentSchema = currentSchema[key];
      currentData = currentData[key];
    } else {
      return undefined;
    }
  }

  return currentData;
}

/**
 * Set data value at path
 */
export function setDataPath(
  data: Record<string, any>,
  path: string[],
  value: any
): Record<string, any> {
  const result = { ...data };
  let current = result;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = typeof path[i + 1] === 'number' ? [] : {};
    }
    
    if (Array.isArray(current[key])) {
      current[key] = [...current[key]];
    } else {
      current[key] = { ...current[key] };
    }
    current = current[key];
  }

  current[path[path.length - 1]] = value;
  return result;
}

/**
 * Generate default value from schema field (supports both legacy and new formats)
 */
export function generateDefaultValue(schemaField: any): any {
  // Respect explicit defaultValue if provided in schema
  if (schemaField.defaultValue !== undefined) return deepClone(schemaField.defaultValue);
  if (schemaField._defaultValue !== undefined) return deepClone(schemaField._defaultValue);

  const type = schemaField.type || schemaField._editor;

  switch (type) {
    case 'toggle':
      return false;
    case 'number':
      return 0;
    case 'text':
    case 'multiline_text':
    case 'image':
    case 'icon':
    case 'color':
      return '';
    case 'array':
      return [];
    case 'section':
    case 'object':
    case 'button':
      const fields = schemaField.fields || schemaField._itemSchema || schemaField;
      const defaults: Record<string, any> = {};
      Object.entries(fields).forEach(([key, field]: [string, any]) => {
        if (key.startsWith('_')) return;
        defaults[key] = generateDefaultValue(field);
      });
      return defaults;
    default:
      return null;
  }
}

/**
 * Generate default array item from itemSchema
 */
export function generateArrayItem(itemSchema: Record<string, any>): Record<string, any> {
  const item: Record<string, any> = {};
  
  Object.entries(itemSchema).forEach(([key, field]) => {
    item[key] = generateDefaultValue(field);
  });

  return item;
}
