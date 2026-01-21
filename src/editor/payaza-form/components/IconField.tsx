import React, { useState } from 'react';
import { 
  Type, 
  ChevronDown,
  Search
} from 'lucide-react';
import { ICON_MAP, COMMON_ICON_NAMES } from '../../../components/ui/dynamic-icon';

interface IconFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const IconField: React.FC<IconFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const SelectedIconComponent = ICON_MAP[value] || null;

  const filteredIcons = COMMON_ICON_NAMES.filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="group/icon relative">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-slate-100 rounded-lg group-focus-within/icon:bg-slate-200 transition-colors duration-300">
          <Type className="w-3.5 h-3.5 text-slate-500 group-focus-within/icon:text-slate-900 transition-colors" strokeWidth={2.5} />
        </div>
        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.1em]">
          {label}
        </label>
      </div>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-12 flex items-center justify-between px-4 bg-white border rounded-xl text-[12px] font-bold focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm ${
            isOpen ? 'border-slate-900 ring-4 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${SelectedIconComponent ? 'bg-slate-900 text-white shadow-sm shadow-slate-200' : 'bg-slate-50 text-slate-400'}`}>
              {SelectedIconComponent ? (
                <SelectedIconComponent size={18} strokeWidth={2.5} />
              ) : (
                <Type size={16} strokeWidth={2.5} />
              )}
            </div>
            <span className={value ? 'text-slate-700' : 'text-slate-400'}>{value || 'Select library icon...'}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-slate-900' : ''}`} strokeWidth={2.5} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2.5} />
                <input
                  type="text"
                  autoFocus
                  className="w-full pl-10 pr-4 h-10 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                  placeholder="Search icon library..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            
            <div className="max-h-[280px] overflow-y-auto p-2 grid grid-cols-4 gap-2 custom-scrollbar">
              {filteredIcons.map((name) => {
                const IconComp = ICON_MAP[name];
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => {
                      onChange(name);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`flex flex-col items-center justify-center aspect-square rounded-xl transition-all duration-200 border-2 ${
                      value === name 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                        : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-100'
                    }`}
                  >
                    <IconComp size={20} strokeWidth={2.5} />
                  </button>
                );
              })}
              {filteredIcons.length === 0 && (
                <div className="col-span-4 py-10 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                    <Search size={20} className="text-slate-200" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching icons</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 block">Custom ID</label>
              <input
                type="text"
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 focus:outline-none focus:border-slate-900 transition-all"
                value={value || ''}
                placeholder="Enter icon name..."
                onChange={(e) => onChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
