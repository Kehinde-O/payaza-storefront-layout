# Payaza Form Editor

A custom form editor that understands the overlay pattern JSON structure (data + _schema) and generates form components dynamically.

## Features

- **Overlay Pattern Support**: Reads `data` + `_schema` structure
- **Custom Widget Registration**: Register custom React components for any `_editor` type
- **All Field Types**: text, multiline_text, image, toggle, number, icon, button, array, section
- **Array Management**: Create, delete, reorder items with drag handles
- **Nested Objects**: Handles nested button objects and complex structures
- **Real-time Preview**: Updates as you type

## Basic Usage

```tsx
import { PayazaFormEditorFullPage } from 'payaza-storefront-layouts/editor';

<PayazaFormEditorFullPage
  layoutId="fashion-hub"
  initialData={layoutData}
  inventory={inventory}
  onChange={handleChange}
  onSave={handleSave}
/>
```

## Custom Widget Registration

You can register custom React components to replace or extend the default field widgets.

### Registering a Single Widget

```tsx
import { registerWidget } from 'payaza-storefront-layouts/editor';
import { WidgetProps } from 'payaza-storefront-layouts/editor';

const MyCustomTextField = ({ label, value, onChange }: WidgetProps) => {
  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="my-custom-input"
      />
    </div>
  );
};

// Register for 'text' editor type
registerWidget('text', MyCustomTextField);
```

### Registering Multiple Widgets

```tsx
import { registerWidgets } from 'payaza-storefront-layouts/editor';

registerWidgets({
  'text': MyCustomTextField,
  'image': MyCustomImageField,
  'custom-widget': MyCustomWidget,
});
```

### Using Custom Widgets in Editor

```tsx
import { PayazaFormEditorFullPage } from 'payaza-storefront-layouts/editor';

<PayazaFormEditorFullPage
  layoutId="fashion-hub"
  initialData={layoutData}
  customWidgets={{
    'text': MyCustomTextField,
    'image': MyCustomImageField,
    'custom-color-picker': MyColorPickerWidget,
  }}
  {...otherProps}
/>
```

### Widget Props Interface

All custom widgets receive the following props:

```tsx
interface WidgetProps {
  label: string;           // Field label from _label
  value: any;              // Current field value
  onChange: (value: any) => void;  // Callback to update value
  path: string[];          // Path to this field in the data structure
  schema?: any;            // Full schema field definition
  [key: string]: any;      // Additional props can be passed
}
```

### Example: Custom Color Picker Widget

```tsx
import { WidgetProps } from 'payaza-storefront-layouts/editor';

const CustomColorPicker = ({ label, value, onChange }: WidgetProps) => {
  return (
    <div className="custom-color-picker">
      <label>{label}</label>
      <div className="color-inputs">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

registerWidget('color', CustomColorPicker);
```

### Example: Custom Rich Text Editor

```tsx
const RichTextEditor = ({ label, value, onChange }: WidgetProps) => {
  return (
    <div>
      <label>{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="rich-text-editor"
        rows={10}
      />
      {/* Add your rich text toolbar here */}
    </div>
  );
};

registerWidget('rich_text', RichTextEditor);
```

### Widget Registry API

```tsx
// Register a widget
registerWidget(editorType: string, component: WidgetComponent): void

// Register multiple widgets
registerWidgets(widgets: Record<string, WidgetComponent>): void

// Get a registered widget
getWidget(editorType: string): WidgetComponent | null

// Check if widget is registered
hasWidget(editorType: string): boolean

// Unregister a widget
unregisterWidget(editorType: string): void

// Clear all widgets
clearWidgets(): void

// Get all registered types
getRegisteredTypes(): string[]
```

## Editor Types

The following editor types have default implementations:

- `text` - Single-line text input
- `multiline_text` - Multi-line textarea
- `toggle` - Boolean switch/toggle
- `image` - Image URL input with preview
- `number` - Number input
- `icon` - Icon name input
- `button` - Button editor (text + link)
- `array` - Array editor with item management
- `section` - Section wrapper
- `object` - Generic object editor

You can override any of these or add new custom types.

## Layout JSON Structure

The editor expects an overlay pattern JSON with this structure:

```json
{
  "layoutId": "fashion-hub",
  "layoutName": "Fashion Hub",
  "pages": [
    {
      "id": "home",
      "label": "Home",
      "path": "/",
      "data": {
        "hero": {
          "show": true,
          "title": "Welcome"
        }
      },
      "_schema": {
        "hero": {
          "_editor": "section",
          "_label": "Hero Section",
          "show": {
            "_editor": "toggle",
            "_label": "Show Section"
          },
          "title": {
            "_editor": "text",
            "_label": "Title"
          }
        }
      }
    }
  ]
}
```

## Accessing the Editor

Access the editor via URL parameter:

```
/editor/fashion-hub?type=payaza-form
```
