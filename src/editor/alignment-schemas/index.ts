import { LayoutAlignmentSchema, PageAlignmentSchema } from './types';
import { ClothingSchema } from './clothing';
import { ClothingMinimalSchema } from './clothing-minimal';
import { FoodSchema } from './food';
import { FoodModernSchema } from './food-modern';
import { ElectronicsSchema } from './electronics';
import { ElectronicsGridSchema } from './electronics-grid';
import { BookingSchema } from './booking';
import { BookingAgendaSchema } from './booking-agenda';
import { MotivationalSpeakerSchema } from './motivational-speaker';

export * from './types';
export * from './metadata';
export * from './clothing';
export * from './clothing-minimal';
export * from './food';
export * from './food-modern';
export * from './electronics';
export * from './electronics-grid';
export * from './booking';
export * from './booking-agenda';
export * from './motivational-speaker';

export const alignmentSchemasMap: Record<string, LayoutAlignmentSchema> = {
  'clothing': ClothingSchema,
  'fashion-hub': ClothingSchema,
  'clothing-minimal': ClothingMinimalSchema,
  'food': FoodSchema,
  'food-modern': FoodModernSchema,
  'electronics': ElectronicsSchema,
  'electronics-grid': ElectronicsGridSchema,
  'booking': BookingSchema,
  'booking-agenda': BookingAgendaSchema,
  'motivational-speaker': MotivationalSpeakerSchema,
  // Mapping for older/alternative IDs
  'layout-clothing-1': ClothingSchema,
  'layout-clothing-2': ClothingMinimalSchema,
  'layout-food-1': FoodSchema,
  'layout-food-2': FoodModernSchema,
  'layout-electronics-1': ElectronicsSchema,
  'layout-electronics-2': ElectronicsGridSchema,
  'layout-booking-1': BookingSchema,
  'layout-booking-2': BookingAgendaSchema,
};

export function getAlignmentSchema(layoutId: string, pageId?: string): LayoutAlignmentSchema | PageAlignmentSchema | null {
  const layoutSchema = alignmentSchemasMap[layoutId];
  if (!layoutSchema) return null;
  
  if (pageId) {
    return layoutSchema[pageId] || null;
  }
  
  return layoutSchema;
}
