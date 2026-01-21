import React, { memo } from 'react';

interface ToggleFieldProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const ToggleField: React.FC<ToggleFieldProps> = memo(({
  label,
  value,
  onChange,
}) => {
  return (
    <div 
      className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none group relative overflow-hidden ${
        value 
          ? 'bg-white border-[#2E1065]/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' 
          : 'bg-slate-50/50 border-slate-200 hover:border-[#2E1065]/20 hover:bg-white'
      }`} 
      onClick={() => onChange(!value)}
    >
      <div className="flex flex-col gap-1.5 relative z-10">
        <span className={`text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 ${
          value ? 'text-slate-900' : 'text-slate-600'
        }`}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${value ? 'bg-[#2E1065] shadow-[0_0_8px_rgba(46,16,101,0.2)] scale-110' : 'bg-slate-300'}`} />
          <span className={`text-[9px] font-medium uppercase tracking-widest transition-colors duration-300 ${value ? 'text-slate-700' : 'text-slate-500'}`}>
            {value ? 'Visible' : 'Hidden'}
          </span>
        </div>
      </div>
      <button
        type="button"
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-500 focus:outline-none z-10 ${
          value ? 'bg-[#2E1065]' : 'bg-slate-200'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            value ? 'translate-x-4.5' : 'translate-x-0.5'
          }`}
        />
      </button>

      {/* Decorative gradient for active state */}
      {value && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      )}
    </div>
  );
});
