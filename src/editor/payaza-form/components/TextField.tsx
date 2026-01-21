import React, { memo } from 'react';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export const TextField: React.FC<TextFieldProps> = memo(({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}) => {
  const charCount = (value || '').length;
  const isColor = type === 'color';

  return (
    <div className="flex flex-col gap-2.5 group/field">
      <div className="flex items-center justify-between px-0.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] group-focus-within/field:text-slate-900 transition-colors duration-300">
          {label}
        </label>
        {charCount > 0 && !isColor && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full">
            <span className="text-[9px] font-black text-slate-400 tabular-nums uppercase tracking-widest">
              {charCount}
            </span>
          </div>
        )}
        {isColor && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full">
            <span className="text-[9px] font-black text-slate-400 tabular-nums uppercase tracking-widest">
              HEX
            </span>
          </div>
        )}
      </div>
      <div className="relative group/container flex items-center">
        {isColor && (
          <div className="absolute left-3 z-10">
            <div className="relative w-6 h-6 rounded-lg border border-white/50 shadow-sm overflow-hidden group-hover/container:scale-110 transition-transform duration-300">
              <input
                type="color"
                className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer border-none p-0"
                value={value || '#000000'}
                onChange={(e) => onChange(e.target.value)}
              />
            </div>
          </div>
        )}
        <input
          type="text"
          className={`w-full h-12 bg-white border border-slate-200/80 rounded-xl text-[13px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-[#2E1065]/5 focus:border-[#2E1065]/40 transition-all duration-300 shadow-sm group-hover/container:border-[#2E1065]/20 group-hover/container:shadow-md ${isColor ? 'pl-12 pr-4' : 'px-4'}`}
          value={value || ''}
          placeholder={placeholder || (isColor ? '#000000' : `Type ${label.toLowerCase()}...`)}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#2E1065] scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500 ease-out rounded-full opacity-50" />
      </div>
    </div>
  );
});
