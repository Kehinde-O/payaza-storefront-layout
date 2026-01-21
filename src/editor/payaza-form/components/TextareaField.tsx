import React, { memo } from 'react';

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const TextareaField: React.FC<TextareaFieldProps> = memo(({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}) => {
  const charCount = (value || '').length;

  return (
    <div className="flex flex-col gap-2.5 group/field">
      <div className="flex items-center justify-between px-0.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] group-focus-within/field:text-slate-900 transition-colors duration-300">
          {label}
        </label>
        {charCount > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full">
            <span className="text-[9px] font-black text-slate-400 tabular-nums uppercase tracking-widest">
              {charCount}
            </span>
          </div>
        )}
      </div>
      <div className="relative group/container">
        <textarea
          rows={rows}
          className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900/40 transition-all duration-300 shadow-sm group-hover/container:border-slate-300 group-hover/container:shadow-md resize-none min-h-[140px] leading-relaxed"
          value={value || ''}
          placeholder={placeholder || `Describe ${label.toLowerCase()}...`}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="absolute left-4 right-4 bottom-0 h-[2px] bg-slate-900 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500 ease-out rounded-full opacity-50" />
      </div>
    </div>
  );
});
