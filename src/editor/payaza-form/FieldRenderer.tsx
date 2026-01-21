import React, { memo } from 'react';
import { SchemaField, generateArrayItem } from './engine';
import { SchemaNode } from '../alignment-schemas/types';
import { TextField } from './components/TextField';
import { TextareaField } from './components/TextareaField';
import { ToggleField } from './components/ToggleField';
import { ImageField } from './components/ImageField';
import { NumberField } from './components/NumberField';
import { IconField } from './components/IconField';
import { ButtonField } from './components/ButtonField';
import { ArrayField } from './components/ArrayField';
import { ObjectField } from './components/ObjectField';
import { SectionField } from './components/SectionField';
import { getWidget, WidgetProps } from './widget-registry';

interface FieldRendererProps {
  schemaField: any; // Can be SchemaField (legacy) or SchemaNode (new)
  value: any;
  path: string[];
  onChange: (value: any, fieldPath?: string[]) => void;
  onArrayItemChange?: (index: number, itemValue: any) => void;
  onArrayItemAdd?: () => void;
  onArrayItemRemove?: (index: number) => void;
  onArrayItemReorder?: (fromIndex: number, toIndex: number) => void;
}

export const FieldRenderer: React.FC<FieldRendererProps> = memo(({
  schemaField,
  value,
  path,
  onChange,
  onArrayItemChange,
  onArrayItemAdd,
  onArrayItemRemove,
  onArrayItemReorder,
}) => {
  // Support both new 'type' and legacy '_editor'
  const type = schemaField.type || schemaField._editor;
  const label = schemaField.label || schemaField._label || '';
  const description = schemaField.description || schemaField._description;

  // Handle array type
  if (type === 'array') {
    const arrayValue = Array.isArray(value) ? value : [];
    const itemSchema = schemaField.itemSchema || schemaField._itemSchema || {};
    
    const handleItemChange = (index: number, itemValue: any) => {
      const newArray = [...arrayValue];
      newArray[index] = itemValue;
      onChange(newArray, path);
    };

    const handleItemAdd = () => {
      const newItem = generateArrayItem(itemSchema);
      onChange([...arrayValue, newItem], path);
    };

    const handleItemRemove = (index: number) => {
      const newArray = arrayValue.filter((_, i) => i !== index);
      onChange(newArray, path);
    };

    const handleItemReorder = (fromIndex: number, toIndex: number) => {
      const newArray = [...arrayValue];
      const [removed] = newArray.splice(fromIndex, 1);
      newArray.splice(toIndex, 0, removed);
      onChange(newArray, path);
    };

    return (
      <ArrayField
        label={label}
        value={arrayValue}
        onChange={onChange}
        itemSchema={itemSchema}
        itemEditor={schemaField.itemEditor || schemaField._itemEditor}
        onItemChange={handleItemChange}
        onItemAdd={handleItemAdd}
        onItemRemove={handleItemRemove}
        onItemReorder={handleItemReorder}
      />
    );
  }

  // Handle section type
  if (type === 'section') {
    const sectionValue = value || {};
    const children: React.ReactNode[] = [];

    // Get fields from either 'fields' property (new) or direct properties (legacy)
    const fields = schemaField.fields || schemaField;

    Object.entries(fields).forEach(([key, field]: [string, any]) => {
      // In legacy mode (fields === schemaField), metadata keys (type, label, etc) 
      // are at the same level as fields. We must skip them.
      // In new mode (schemaField.fields exists), 'fields' contains only children.
      if (fields === schemaField && (key.startsWith('_') || key === 'type' || key === 'label' || key === 'description' || key === 'fields')) return;
      
      // Check if it's a valid field (has type/_editor)
      const fieldType = field && typeof field === 'object' ? (field.type || field._editor) : null;
      
      if (fieldType) {
        children.push(
          <FieldRenderer
            key={key}
            schemaField={field}
            value={sectionValue[key]}
            path={[...path, key]}
            onChange={(newValue, fieldPath) => {
              if (fieldPath && fieldPath.length > path.length) {
                const pathMatches = path.every((p, i) => fieldPath[i] === p);
                if (pathMatches) {
                  const relativePath = fieldPath.slice(path.length);
                  onChange(newValue, relativePath);
                } else {
                  onChange(newValue, [key]);
                }
              } else {
                onChange(newValue, [key]);
              }
            }}
            onArrayItemChange={onArrayItemChange}
            onArrayItemAdd={onArrayItemAdd}
            onArrayItemRemove={onArrayItemRemove}
            onArrayItemReorder={onArrayItemReorder}
          />
        );
      }
    });

    return (
      <SectionField
        label={label}
        description={description}
        defaultExpanded={false}
      >
        <div className="space-y-10">
          {children}
        </div>
      </SectionField>
    );
  }

  // Handle button/object type (nested objects)
  if (type === 'button' || type === 'object') {
    const objectValue = value || {};
    const children: React.ReactNode[] = [];
    const fields = schemaField.fields || schemaField;

    Object.entries(fields).forEach(([key, field]: [string, any]) => {
      // Skip metadata only in legacy mode
      if (fields === schemaField && (key.startsWith('_') || key === 'type' || key === 'label' || key === 'fields')) return;
      
      const fieldType = field && typeof field === 'object' ? (field.type || field._editor) : null;
      if (fieldType) {
        children.push(
          <FieldRenderer
            key={key}
            schemaField={field}
            value={objectValue[key]}
            path={[...path, key]}
            onChange={(newValue, fieldPath) => {
              if (fieldPath && fieldPath.length > 0) {
                onChange(newValue, [key, ...fieldPath]);
              } else {
                onChange(newValue, [key]);
              }
            }}
          />
        );
      }
    });

    if (type === 'button') {
      return (
        <ButtonField
          label={label}
          value={objectValue}
          onChange={onChange}
        />
      );
    }

    return (
      <ObjectField label={label}>
        {children}
      </ObjectField>
    );
  }

  // Check for custom registered widget first
  const CustomWidget = getWidget(type);
  if (CustomWidget) {
    const widgetProps: WidgetProps = {
      label,
      value,
      onChange,
      path,
      schema: schemaField,
    };
    return <CustomWidget {...widgetProps} />;
  }

  // Handle primitive field types (default widgets)
  switch (type) {
    case 'text':
      return (
        <TextField
          label={label}
          value={value || ''}
          onChange={(newValue) => onChange(newValue, path)}
        />
      );

    case 'multiline_text':
      return (
        <TextareaField
          label={label}
          value={value || ''}
          onChange={(newValue) => onChange(newValue, path)}
        />
      );

    case 'toggle':
      return (
        <ToggleField
          label={label}
          value={value || false}
          onChange={(newValue) => onChange(newValue, path)}
        />
      );

    case 'image':
      return (
        <ImageField
          label={label}
          value={value || ''}
          onChange={(newValue) => onChange(newValue, path)}
        />
      );

    case 'number':
      return (
        <NumberField
          label={label}
          value={value ?? 0}
          onChange={(newValue) => onChange(newValue, path)}
        />
      );

    case 'icon':
      return (
        <IconField
          label={label}
          value={value || ''}
          onChange={(newValue) => onChange(newValue, path)}
        />
      );

    case 'color':
      return (
        <TextField
          label={label}
          value={value || ''}
          type="color"
          onChange={(newValue) => onChange(newValue, path)}
        />
      );

    default:
      return (
        <div className="text-[10px] text-slate-400">
          Unknown editor type: {type}
        </div>
      );
  }
});
