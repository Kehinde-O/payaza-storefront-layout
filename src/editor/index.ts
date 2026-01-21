import { layoutJSONMap } from '../json/json-map';
import { LayoutInventory } from './types';

export * from './types';
export * from './shared';

// Export PayazaForm editor
export * as PayazaForm from './payaza-form';

// Also export asset selection handler directly for easier access
export { getGlobalAssetSelectionHandler } from './payaza-form/AssetSelectionContext';

/**
 * Helper to get the full inventory of all layouts
 * Now uses alignment-schemas instead of requirements JSON
 */
export const getFullInventory = (): LayoutInventory => {
  return {
    data: layoutJSONMap,
    // For backward compatibility, provide empty requirements
    // All functionality now uses alignment-schemas
    requirements: {},
  };
};
