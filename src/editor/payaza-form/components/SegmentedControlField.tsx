import React from 'react';
import { Check } from 'lucide-react';

interface SegmentedControlFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}

export const SegmentedControlField: React.FC<SegmentedControlFieldProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <div className="group">
      <div className="flex items-center gap-2 mb-1.5">
        <Check className="w-3.5 h-3.5 text-slate-400" />
        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
          {label}
        </label>
      </div>
      <div className="flex gap-1 bg-slate-50 p-1 rounded-md">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 px-3 py-1.5 rounded text-[11px] font-medium transition-all ${
              value === option.value
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
