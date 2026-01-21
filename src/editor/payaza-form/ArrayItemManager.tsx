import React, { useState, memo } from 'react';
import { GripVertical, Plus, X, Copy, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FieldRenderer } from './FieldRenderer';
import { SchemaField } from './engine';

interface ArrayItemManagerProps {
  items: any[];
  itemSchema: Record<string, SchemaField>;
  itemEditor?: string;
  onItemChange: (index: number, itemValue: any) => void;
  onItemAdd: () => void;
  onItemRemove: (index: number) => void;
  onItemReorder: (fromIndex: number, toIndex: number) => void;
  onItemDuplicate: (index: number) => void;
}

export const ArrayItemManager: React.FC<ArrayItemManagerProps> = memo(({
  items,
  itemSchema,
  itemEditor,
  onItemChange,
  onItemAdd,
  onItemRemove,
  onItemReorder,
  onItemDuplicate,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    setExpandedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      onItemReorder(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleItemFieldChange = (index: number, fieldKey: string, fieldValue: any) => {
    const currentItem = items[index] || {};
    const updatedItem = { ...currentItem, [fieldKey]: fieldValue };
    onItemChange(index, updatedItem);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getItemLabel = (item: any, index: number) => {
    if (item.label) return item.label;
    if (item.title) return item.title;
    if (item.text) return item.text;
    if (item.name) return item.name;
    return `Item #${index + 1}`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        {items.map((item, index) => {
          const isExpanded = expandedIndex === index;
          const label = getItemLabel(item, index);
          
          return (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`border-b border-slate-200/50 last:border-b-0 group/row transition-all duration-300 ${
                draggedIndex === index ? 'opacity-20 grayscale scale-[0.98]' : ''
              } ${dragOverIndex === index ? 'bg-[#2E1065]/5 border-[#2E1065]/20' : ''} ${isExpanded ? 'bg-white border-[#2E1065]/20' : 'hover:bg-white hover:border-[#2E1065]/10'}`}
            >
              <div className="flex items-center group/item min-h-[56px] relative">
                {/* Drag Handle */}
                <div
                  className="px-4 py-5 text-slate-300 hover:text-slate-900 cursor-grab active:cursor-grabbing transition-colors"
                  onDragStart={(e) => {
                    e.stopPropagation();
                    handleDragStart(index);
                  }}
                >
                  <GripVertical size={14} strokeWidth={2.5} />
                </div>

                {/* Content Toggle */}
                <div 
                  className="flex-1 flex items-center justify-between cursor-pointer py-5 pr-2"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isExpanded ? 'bg-[#2E1065] shadow-[0_0_8px_rgba(46,16,101,0.2)]' : 'bg-slate-200'}`} />
                    <span className={`text-[12px] font-bold tracking-tight transition-colors duration-300 ${isExpanded ? 'text-slate-900' : 'text-slate-600'}`}>
                      {label}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemDuplicate(index);
                      }}
                      className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 opacity-0 group-hover/item:opacity-100"
                      title="Duplicate"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemRemove(index);
                      }}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-0 group-hover/item:opacity-100"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className={`ml-1 transition-all duration-300 p-1.5 rounded-lg ${isExpanded ? 'rotate-90 bg-[#2E1065] text-white shadow-sm shadow-slate-200' : 'text-slate-300 group-hover/item:text-slate-500'}`}>
                      <ChevronRight size={14} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-10 space-y-10 pt-4 bg-white relative">
                      {/* Subtle side indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900/5" />
                      
                      {Object.entries(itemSchema).map(([fieldKey, fieldSchema]) => (
                        <FieldRenderer
                          key={fieldKey}
                          schemaField={fieldSchema}
                          value={item[fieldKey]}
                          path={[index.toString(), fieldKey]}
                          onChange={(value) => handleItemFieldChange(index, fieldKey, value)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onItemAdd}
        className="w-full h-12 flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] hover:border-slate-900 hover:text-slate-900 hover:bg-slate-50 transition-all duration-300 group shadow-sm active:scale-[0.98]"
      >
        <div className="p-1 bg-slate-100 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-colors">
          <Plus size={14} strokeWidth={3} className="transition-transform group-hover:rotate-90 duration-500" />
        </div>
        Add New Item
      </button>
    </div>
  );
});
