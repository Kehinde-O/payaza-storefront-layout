import React, { useState } from 'react';
import { ChevronDown, Monitor, Tablet, Smartphone, Eye, EyeOff } from 'lucide-react';

interface SectionFieldProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const SectionField: React.FC<SectionFieldProps> = ({
  label,
  description,
  children,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [visibility, setVisibility] = useState({
    desktop: true,
    tablet: true,
    mobile: true,
  });

  const toggleVisibility = (device: keyof typeof visibility) => {
    setVisibility(prev => ({ ...prev, [device]: !prev[device] }));
  };

  const isAllVisible = visibility.desktop && visibility.tablet && visibility.mobile;
  const isAllHidden = !visibility.desktop && !visibility.tablet && !visibility.mobile;

  return (
    <div className={`mb-4 overflow-hidden rounded-2xl border transition-all duration-300 ${
      isExpanded 
        ? 'border-[#2E1065]/30 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]' 
        : 'border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-[#2E1065]/20 hover:shadow-sm'
    } ${isAllHidden ? 'opacity-60 grayscale' : 'opacity-100'}`}>
      <div className="flex items-center w-full relative">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 flex items-center justify-between py-5 px-6 text-left transition-colors group"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                isExpanded ? 'text-slate-900' : 'text-slate-900'
              }`}>
                {label}
              </span>
              {!isExpanded && (
                <div className="flex items-center gap-1.5 ml-1">
                  {!isAllVisible && !isAllHidden && (
                    <div className="flex items-center gap-1 p-1 bg-slate-100/50 rounded-md">
                      {visibility.desktop && <Monitor size={10} className="text-slate-400" />}
                      {visibility.tablet && <Tablet size={10} className="text-slate-400" />}
                      {visibility.mobile && <Smartphone size={10} className="text-slate-400" />}
                    </div>
                  )}
                  {isAllHidden && (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-50 rounded-md">
                      <EyeOff size={10} className="text-red-400" />
                      <span className="text-[8px] font-bold text-red-400 uppercase tracking-tighter">Hidden</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {description && !isExpanded && (
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest truncate max-w-[180px]">
                {description}
              </span>
            )}
          </div>
          <div className={`transition-all duration-300 rounded-full p-1.5 ${
            isExpanded ? 'rotate-180 bg-slate-100 text-slate-900' : 'text-slate-300 group-hover:text-slate-500 bg-transparent'
          }`}>
            <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
          </div>
        </button>

        {/* Quick Actions (Shown when NOT expanded on hover) */}
        {!isExpanded && (
          <div className="absolute right-[52px] top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity pr-2 border-r border-slate-100 mr-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const nextHidden = !isAllHidden;
                setVisibility({
                  desktop: !nextHidden,
                  tablet: !nextHidden,
                  mobile: !nextHidden
                });
              }}
              className={`p-2 rounded-lg transition-all ${isAllHidden ? 'text-slate-300 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-900 hover:bg-slate-100'}`}
              title={isAllHidden ? "Show Section" : "Hide Section"}
            >
              {isAllHidden ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        )}

        {/* Quick Visibility Controls (Only shown when expanded) */}
        {isExpanded && (
          <div className="flex items-center gap-1 pr-4 border-l border-slate-100 ml-2 py-2">
            <button
              onClick={() => toggleVisibility('desktop')}
              className={`p-2 rounded-lg transition-all ${visibility.desktop ? 'text-slate-900 bg-slate-100 shadow-sm shadow-slate-200/50' : 'text-slate-300 hover:text-slate-400'}`}
              title="Desktop Visibility"
            >
              <Monitor size={14} strokeWidth={visibility.desktop ? 2.5 : 2} />
            </button>
            <button
              onClick={() => toggleVisibility('tablet')}
              className={`p-2 rounded-lg transition-all ${visibility.tablet ? 'text-slate-900 bg-slate-100 shadow-sm shadow-slate-200/50' : 'text-slate-300 hover:text-slate-400'}`}
              title="Tablet Visibility"
            >
              <Tablet size={14} strokeWidth={visibility.tablet ? 2.5 : 2} />
            </button>
            <button
              onClick={() => toggleVisibility('mobile')}
              className={`p-2 rounded-lg transition-all ${visibility.mobile ? 'text-slate-900 bg-slate-100 shadow-sm shadow-slate-200/50' : 'text-slate-300 hover:text-slate-400'}`}
              title="Mobile Visibility"
            >
              <Smartphone size={14} strokeWidth={visibility.mobile ? 2.5 : 2} />
            </button>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="px-6 pb-8 pt-2 border-t border-slate-100/50 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300 bg-white">
          {description && (
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-1 h-full bg-slate-900 rounded-full" />
              <p className="text-[11px] leading-relaxed text-slate-500 font-semibold tracking-wide uppercase">{description}</p>
            </div>
          )}
          <div className="space-y-10">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
