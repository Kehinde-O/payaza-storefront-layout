import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
}) => {
  const increment = () => {
    const newVal = (value || 0) + 1;
    if (max !== undefined && newVal > max) return;
    onChange(newVal);
  };

  const decrement = () => {
    const newVal = (value || 0) - 1;
    if (min !== undefined && newVal < min) return;
    onChange(newVal);
  };

  return (
    <div className="flex flex-col gap-2.5 group/field">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] px-0.5 group-focus-within/field:text-blue-500 transition-colors duration-300">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 group/container">
          <input
            type="number"
            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/40 transition-all duration-300 shadow-sm group-hover/container:border-slate-300 group-hover/container:shadow-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={value ?? ''}
            placeholder={placeholder || `0`}
            min={min}
            max={max}
            onChange={(e) => {
              const numValue = e.target.value === '' ? 0 : Number(e.target.value);
              onChange(numValue);
            }}
          />
          <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-blue-500 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500 ease-out rounded-full opacity-50" />
        </div>
        <div className="flex items-center p-1 bg-slate-100/50 rounded-xl border border-slate-100 shadow-sm">
          <button
            type="button"
            onClick={decrement}
            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all active:scale-90"
          >
            <Minus size={14} strokeWidth={3} />
          </button>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <button
            type="button"
            onClick={increment}
            className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all active:scale-90"
          >
            <Plus size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};
