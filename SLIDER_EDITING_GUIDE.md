# Hero Slider Editing Guide

## Where to Modify Slides

The hero slides are edited in the **RJSF Form Editor** under the **Hero Section**.

### Location in Editor:
1. Open the RJSF Form Editor (Properties Live Editor sidebar)
2. Navigate to the **Home** page
3. Expand the **Hero Section**
4. Find the **Hero Slides** array field
5. The slides will appear as a visual grid with thumbnails

## How Slides Are Populated

### Default Behavior:
- When a store is first created or when the hero section has no slides, **3 default slides are automatically initialized**
- Default slides are created in `schema-generator.ts` in the `transformToRJSFData` function
- Each slide includes:
  - `id`: Unique identifier (e.g., 'hero_slide_1')
  - `image`: Image URL
  - `badge`: Optional badge text
  - `title`: Slide title
  - `description`: Slide description
  - `primaryButton`: Primary CTA button (text + link)
  - `secondaryButton`: Secondary CTA button (text + link)

### Initialization Logic:
```typescript
// In schema-generator.ts, lines 298-351
if (prop.key === 'sliders' && section.id === 'hero') {
  if (!sliders || sliders.length === 0) {
    // Initialize with 3 default slides
  }
}
```

## Custom Slider Widget

The slides use a **custom SliderWidget** (`SliderArrayFieldTemplate`) that provides:
- Visual thumbnail grid of all slides
- Expandable slide editors
- Add/Remove slide functionality
- Reorder controls (move up/down)
- Better UX than default array template

### Widget Detection:
The widget is automatically used when:
- Field name contains "slider" or "slide"
- Field path contains "slider" or "slide"
- Schema title/description contains "slider" or "slide"
- Field is in hero section and key is "sliders"

## Recent Improvements

1. **Enhanced Slider Detection**: Improved the detection logic to ensure the custom widget is always used for slider arrays
2. **Guaranteed Initialization**: Added safety check to ensure sliders are always initialized, even if they weren't before
3. **Better Logging**: Added console logs to help debug slider initialization

## Troubleshooting

### If slides don't appear:
1. Check browser console for `[transformToRJSFData] Hero section data` logs
2. Verify `formData.hero.sliders` exists and is an array
3. Check that the requirements file has the sliders array properly defined

### If you can't edit slides:
1. Ensure you're in the RJSF Form Editor (not Puck editor)
2. Check that the Hero Section is expanded
3. Verify the SliderWidget is being used (should see thumbnail grid, not plain array)

## Code Locations

- **Requirements Definition**: `src/requirements/clothing-requirements.json` (lines 20-86)
- **Schema Generation**: `src/editor/rjsf/schema-generator.ts` (lines 298-351)
- **Widget Template**: `src/editor/rjsf/widgets/SliderWidget.tsx`
- **Array Template**: `src/editor/rjsf/templates/CustomTemplates.tsx` (lines 267-278)
- **Form Editor**: `src/editor/rjsf/RJSFEditor.tsx`
