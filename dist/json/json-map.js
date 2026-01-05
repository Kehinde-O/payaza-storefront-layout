/**
 * Layout JSON Static Map
 * Imports all layout JSON files at build time to avoid runtime require() issues
 */
import foodLayout from './food.json';
import foodModernLayout from './food-modern.json';
import electronicsLayout from './electronics.json';
import electronicsGridLayout from './electronics-grid.json';
import clothingLayout from './clothing.json';
import clothingMinimalLayout from './clothing-minimal.json';
import bookingLayout from './booking.json';
import bookingAgendaLayout from './booking-agenda.json';
import motivationalSpeakerLayout from './motivational-speaker.json';
const layoutMap = {
    'food': foodLayout,
    'food-modern': foodModernLayout,
    'layout-food-1': foodLayout,
    'layout-food-2': foodModernLayout,
    'electronics': electronicsLayout,
    'electronics-grid': electronicsGridLayout,
    'layout-electronics-1': electronicsLayout,
    'layout-electronics-2': electronicsGridLayout,
    'clothing': clothingLayout,
    'clothing-minimal': clothingMinimalLayout,
    'layout-clothing-1': clothingLayout,
    'layout-clothing-2': clothingMinimalLayout,
    'booking': bookingLayout,
    'booking-agenda': bookingAgendaLayout,
    'layout-booking-1': bookingLayout,
    'layout-booking-2': bookingAgendaLayout,
    'motivational-speaker': motivationalSpeakerLayout,
};
export function getLayoutJSON(layoutId) {
    return layoutMap[layoutId] || null;
}
export const layoutJSONMap = layoutMap;
