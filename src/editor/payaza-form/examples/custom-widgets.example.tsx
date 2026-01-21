/**
 * Example: Custom Widget Registration for Payaza Form Editor
 * 
 * This file demonstrates how to register custom React components
 * as widgets for the Payaza Form Editor, similar to Puck's component registry.
 */

import React from 'react';
import { StoreConfig } from '../../../lib/store-types';
import { 
  registerWidget, 
  registerWidgets, 
  WidgetProps,
  PayazaFormEditorFullPage 
} from '../index';

// Example 1: Custom Text Field Widget
const CustomTextField: React.FC<WidgetProps> = ({ label, value, onChange }) => {
  return (
    <div className="custom-text-field">
      <label className="text-sm font-semibold text-gray-700 mb-1 block">
        {label}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>
  );
};

// Example 2: Custom Color Picker Widget
const CustomColorPicker: React.FC<WidgetProps> = ({ label, value, onChange }) => {
  return (
    <div className="custom-color-picker">
      <label className="text-sm font-semibold text-gray-700 mb-2 block">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-16 rounded border-2 border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none uppercase font-mono text-sm"
          placeholder="#000000"
          pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
        />
      </div>
    </div>
  );
};

// Example 3: Custom Rich Text Editor Widget
const CustomRichTextEditor: React.FC<WidgetProps> = ({ label, value, onChange }) => {
  return (
    <div className="custom-rich-text-editor">
      <label className="text-sm font-semibold text-gray-700 mb-2 block">
        {label}
      </label>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 flex gap-2">
          <button
            type="button"
            className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
            title="Underline"
          >
            <u>U</u>
          </button>
        </div>
        {/* Editor */}
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 min-h-[200px] focus:outline-none resize-y"
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
      </div>
    </div>
  );
};

// Example 4: Custom Image Upload Widget
const CustomImageUpload: React.FC<WidgetProps> = ({ label, value, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file and get a URL
      // For this example, we'll use a FileReader to create a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="custom-image-upload">
      <label className="text-sm font-semibold text-gray-700 mb-2 block">
        {label}
      </label>
      <div className="space-y-3">
        {value && (
          <div className="relative">
            <img
              src={value}
              alt={label}
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`image-upload-${label}`}
          />
          <label
            htmlFor={`image-upload-${label}`}
            className="cursor-pointer text-gray-600 hover:text-blue-600"
          >
            {value ? 'Change Image' : 'Click to upload or drag and drop'}
          </label>
        </div>
        {value && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
            placeholder="Or enter image URL"
          />
        )}
      </div>
    </div>
  );
};

// Register widgets individually
registerWidget('custom-text', CustomTextField);
registerWidget('color', CustomColorPicker);
registerWidget('rich_text', CustomRichTextEditor);
registerWidget('image-upload', CustomImageUpload);

// Or register multiple widgets at once
registerWidgets({
  'custom-text': CustomTextField,
  'color': CustomColorPicker,
  'rich_text': CustomRichTextEditor,
  'image-upload': CustomImageUpload,
});

// Example: Using custom widgets in the editor
export const EditorWithCustomWidgets = () => {
  return (
    <PayazaFormEditorFullPage
      layoutId="fashion-hub"
      initialData={{} as StoreConfig}
      customWidgets={{
        'custom-text': CustomTextField,
        'color': CustomColorPicker,
        'rich_text': CustomRichTextEditor,
        'image-upload': CustomImageUpload,
      }}
      onChange={(data) => console.log('Data changed:', data)}
      onSave={(data) => console.log('Save:', data)}
    />
  );
};
