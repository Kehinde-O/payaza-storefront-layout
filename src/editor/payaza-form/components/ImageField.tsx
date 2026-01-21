import React from 'react';
import { Image as ImageIcon, Link2, X, Upload } from 'lucide-react';
import { useAssetSelection } from '../AssetSelectionContext';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ImageField: React.FC<ImageFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  const hasImage = value && value.startsWith('http');
  const [isHovered, setIsHovered] = React.useState(false);
  const { onOpenAssetSelect, isAssetLibraryAvailable } = useAssetSelection();

  const handleReplace = React.useCallback(() => {
    if (isAssetLibraryAvailable) {
      console.log('[ImageField] REPLACE clicked, opening asset library');
      // Open asset library with callback to replace image
      onOpenAssetSelect((selectedUrl: string) => {
        console.log('[ImageField] Callback invoked with URL:', selectedUrl);
        onChange(selectedUrl);
        console.log('[ImageField] Image field updated with URL:', selectedUrl);
      });
    } else {
      console.warn('[ImageField] Asset library not available, clearing image');
      // Fallback: just clear the image if asset library is not available
      onChange('');
    }
  }, [isAssetLibraryAvailable, onOpenAssetSelect, onChange]);

  return (
    <div className="flex flex-col gap-3 group/field">
      <div className="flex items-center justify-between px-0.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] group-focus-within/field:text-blue-500 transition-colors">
          {label}
        </label>
        {hasImage && (
          <span className="text-[8px] font-black text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-widest border border-blue-100/50">Active</span>
        )}
      </div>
      
      <div className="space-y-4">
        {hasImage ? (
          <div 
            className="relative group/img rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 aspect-[16/9] flex items-center justify-center shadow-sm hover:border-[#2E1065]/20 transition-colors"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover transition-all duration-700 group-hover/img:scale-110 group-hover/img:blur-[2px]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 backdrop-blur-[1px]">
              <div className="flex items-center gap-2 transform translate-y-2 group-hover/img:translate-y-0 transition-all duration-300">
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-red-500 text-white rounded-xl backdrop-blur-md transition-all duration-200 border border-white/30"
                  title="Remove Image"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={handleReplace}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-200 shadow-xl hover:scale-105 active:scale-95"
                  title={isAssetLibraryAvailable ? "Replace image from asset library" : "Replace image"}
                >
                  <Upload size={14} strokeWidth={3} />
                  Replace
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative group/placeholder">
            <div className="rounded-2xl border-2 border-dashed border-slate-200/80 bg-[#fcfcfd] p-10 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-[#2E1065]/40 hover:bg-[#2E1065]/5 transition-all cursor-pointer overflow-hidden">
              <div className="w-14 h-14 rounded-[20px] bg-white border border-slate-100 flex items-center justify-center shadow-md group-hover/placeholder:scale-110 group-hover/placeholder:rotate-3 transition-all duration-500">
                <Upload size={24} className="text-slate-300 group-hover/placeholder:text-blue-500 transition-colors" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-600 group-hover/placeholder:text-blue-600 transition-colors">Upload Assets</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Supports PNG, JPG, WEBP</span>
              </div>
              
              {/* Subtle background patterns */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
          </div>
        )}

        <div className="relative group/input">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within/input:text-blue-500">
            <Link2 size={14} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            className="w-full h-12 pl-10 pr-4 bg-slate-50/50 border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/40 focus:bg-white transition-all shadow-sm group-hover/input:border-slate-300"
            value={value || ''}
            placeholder={placeholder || `Enter asset URL...`}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
