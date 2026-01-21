import React, { memo } from 'react';
import { List, Plus } from 'lucide-react';
import { ArrayItemManager } from '../ArrayItemManager';
import { FieldRenderer } from '../FieldRenderer';
import { SchemaField } from '../engine';

interface ArrayFieldProps {
  label: string;
  value: any[];
  onChange: (value: any[]) => void;
  itemSchema: Record<string, SchemaField>;
  itemEditor?: string;
  onItemChange: (index: number, itemValue: any) => void;
  onItemAdd: () => void;
  onItemRemove: (index: number) => void;
  onItemReorder: (fromIndex: number, toIndex: number) => void;
  onItemDuplicate?: (index: number) => void;
}

export const ArrayField: React.FC<ArrayFieldProps> = memo(({
  label,
  value,
  onChange,
  itemSchema,
  itemEditor,
  onItemChange,
  onItemAdd,
  onItemRemove,
  onItemReorder,
  onItemDuplicate,
}) => {
  const handleItemDuplicate = (index: number) => {
    if (onItemDuplicate) {
      onItemDuplicate(index);
    } else {
      const itemToDuplicate = value[index];
      const newArray = [...(value || [])];
      // Create a deep-ish copy by spreading the object
      newArray.splice(index + 1, 0, typeof itemToDuplicate === 'object' ? { ...itemToDuplicate } : itemToDuplicate);
      onChange(newArray);
    }
  };

  return (
    <div className="group">
      <div className="flex items-center gap-2 mb-2">
        <List className="w-3.5 h-3.5 text-slate-400" />
        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
          {label}
        </label>
      </div>
      <ArrayItemManager
        items={value || []}
        itemSchema={itemSchema}
        itemEditor={itemEditor}
        onItemChange={onItemChange}
        onItemAdd={onItemAdd}
        onItemRemove={onItemRemove}
        onItemReorder={onItemReorder}
        onItemDuplicate={handleItemDuplicate}
      />
    </div>
  );
});
