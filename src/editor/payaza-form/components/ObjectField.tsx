import React from 'react';

interface ObjectFieldProps {
  label: string;
  children: React.ReactNode;
}

export const ObjectField: React.FC<ObjectFieldProps> = ({
  label,
  children,
}) => {
  return (
    <div className="group/obj-field">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-3 bg-[#2E1065]/10 rounded-full group-focus-within/obj-field:bg-[#2E1065] transition-colors duration-300" />
        <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-[0.1em]">
          {label}
        </label>
      </div>
      <div className="space-y-8 p-5 rounded-2xl bg-slate-50/50 border border-slate-200/60 group-focus-within/obj-field:border-[#2E1065]/30 group-focus-within/obj-field:bg-white transition-all duration-500">
        {children}
      </div>
    </div>
  );
};
