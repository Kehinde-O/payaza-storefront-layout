import { OverlayLayoutJSON, parseLayoutJSON } from './engine';
import { getBridgedPayazaFormRequirement } from './schema-bridge';

/**
 * Load layout JSON using alignment-schema via schema-bridge
 * This is the primary and only way to load layouts now.
 */
export async function loadLayoutJSON(
  layoutId: string,
  inventory?: any
): Promise<OverlayLayoutJSON | null> {
  try {
    // Use alignment-schema via schema-bridge (primary method)
    const requirement = getBridgedPayazaFormRequirement(layoutId);
    if (requirement) {
      return parseLayoutJSON(requirement);
    }

    // Fallback to inventory if available (for external/custom layouts)
    if (inventory?.overlayLayouts?.[layoutId]) {
      return parseLayoutJSON(inventory.overlayLayouts[layoutId]);
    }

    console.warn(`[loadLayoutJSON] No layout found for: ${layoutId}`);
    return null;
  } catch (error) {
    console.error(`Error loading layout JSON for ${layoutId}:`, error);
    return null;
  }
}

/**
 * Load layout JSON synchronously (for initial render)
 * Uses alignment-schema via schema-bridge
 */
export function loadLayoutJSONSync(
  layoutId: string,
  inventory?: any
): OverlayLayoutJSON | null {
  try {
    // Use alignment-schema via schema-bridge (primary method)
    const requirement = getBridgedPayazaFormRequirement(layoutId);
    if (requirement) {
      return parseLayoutJSON(requirement);
    }

    // Fallback to inventory if available
    if (inventory?.overlayLayouts?.[layoutId]) {
      return parseLayoutJSON(inventory.overlayLayouts[layoutId]);
    }

    return null;
  } catch (error) {
    console.error(`Error loading layout JSON for ${layoutId}:`, error);
    return null;
  }
}
