import { OverlayLayoutJSON } from './engine';
import { SchemaNode } from '../alignment-schemas/types';
import { alignmentSchemasMap } from '../alignment-schemas';
import { getLayoutMetadata, LayoutMetadata } from '../alignment-schemas/metadata';

/**
 * Bridges alignment schemas with metadata to produce a full OverlayLayoutJSON for the PayazaFormEditor.
 * This replaces the old requirements JSON approach with a cleaner alignment-schema only approach.
 */
export function bridgeRequirementToOverlayJSON(
  layoutId: string
): OverlayLayoutJSON | null {
  // Normalization mapping
  const layoutIdMap: Record<string, string> = {
    'fashion-hub': 'clothing',
    'savory-bites': 'food',
    'modern-eats': 'food-modern',
    'minimal-style': 'clothing-minimal',
    'fashion-minimal': 'clothing-minimal',
    'urban-retreat': 'booking',
    'agenda-book': 'booking-agenda',
    'grid-tech': 'electronics-grid',
    'mindset-mastery': 'motivational-speaker'
  };

  const normalizedId = layoutIdMap[layoutId] || layoutId;
  const metadata = getLayoutMetadata(normalizedId);
  const alignmentSchema = alignmentSchemasMap[normalizedId];

  if (!metadata) {
    console.warn(`[schema-bridge] No metadata found for layout: ${layoutId} (normalized: ${normalizedId})`);
    return null;
  }

  if (!alignmentSchema) {
    console.warn(`[schema-bridge] No alignment schema found for layout: ${layoutId} (normalized: ${normalizedId})`);
    return null;
  }

  // Filter out pages that shouldn't be editable (productDetail, categoryDetail, etc.)
  const editablePages = metadata.pages.filter(page => 
    page.id !== 'productDetail' && 
    page.id !== 'categoryDetail' &&
    page.id !== 'menuCategory' &&
    page.id !== 'trackOrder'
  );

  const overlayJSON: OverlayLayoutJSON = {
    layoutId: metadata.layoutId,
    layoutName: metadata.layoutName,
    pages: editablePages.map((page) => {
      // Get page-specific schema from alignment schemas
      const pageSchema = alignmentSchema[page.id] || {};
      
      // Extract default data from alignment schema
      const pageData: Record<string, any> = {};

      // Merge defaults from pageSchema into pageData
      if (pageSchema) {
        Object.entries(pageSchema).forEach(([sectionKey, sectionSchema]: [string, any]) => {
          // Initialize section with show: true by default
          pageData[sectionKey] = { show: true };
          
          if (sectionSchema.fields) {
            Object.entries(sectionSchema.fields).forEach(([fieldKey, fieldSchema]: [string, any]) => {
              if (fieldSchema.defaultValue !== undefined) {
                pageData[sectionKey][fieldKey] = fieldSchema.defaultValue;
              }
            });
          }
        });
      }

      // Convert alignment schema to _schema format (preserving _sourcePath and structure)
      const convertedSchema: Record<string, any> = {};
      if (pageSchema && Object.keys(pageSchema).length > 0) {
        Object.entries(pageSchema).forEach(([sectionKey, sectionSchema]: [string, any]) => {
          // Preserve the section schema with _sourcePath and fields
          convertedSchema[sectionKey] = {
            type: sectionSchema.type || 'section',
            label: sectionSchema.label,
            description: sectionSchema.description,
            _sourcePath: sectionSchema._sourcePath, // Preserve _sourcePath for data loading/saving
            ...(sectionSchema.fields ? { fields: sectionSchema.fields } : {})
          };
        });
      }

      return {
        id: page.id,
        label: page.label,
        path: page.path,
        data: pageData,
        // Use converted alignment schema, fallback to requirement schema
        _schema: Object.keys(convertedSchema).length > 0 ? convertedSchema : (page as any)._schema || {}
      };
    })
  };

  return overlayJSON;
}

/**
 * Gets the bridged requirement for a layout
 */
export function getBridgedPayazaFormRequirement(layoutId: string): OverlayLayoutJSON | null {
  return bridgeRequirementToOverlayJSON(layoutId);
}
