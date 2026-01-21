import React from 'react';
import { Link2 } from 'lucide-react';
import { TextField } from './TextField';

interface ButtonFieldProps {
  label: string;
  value: {
    text: string;
    link: string;
  };
  onChange: (value: { text: string; link: string }) => void;
}

export const ButtonField: React.FC<ButtonFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  const handleTextChange = (text: string) => {
    onChange({ ...value, text });
  };

  const handleLinkChange = (link: string) => {
    onChange({ ...value, link });
  };

  return (
    <div className="group/btn-field">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-slate-100 rounded-lg group-focus-within/btn-field:bg-slate-200 transition-colors duration-300">
          <Link2 className="w-3.5 h-3.5 text-slate-500 group-focus-within/btn-field:text-slate-900 transition-colors" />
        </div>
        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.1em]">
          {label}
        </label>
      </div>
      <div className="space-y-6 p-5 rounded-2xl bg-slate-50/50 border border-slate-100 group-focus-within/btn-field:border-slate-300 group-focus-within/btn-field:bg-white transition-all duration-500">
        <TextField
          label="Label"
          value={value?.text || ''}
          onChange={handleTextChange}
          placeholder="e.g. Shop Now"
        />
        <TextField
          label="Action Link"
          value={value?.link || ''}
          onChange={handleLinkChange}
          placeholder="e.g. /products or https://..."
        />
      </div>
    </div>
  );
};
