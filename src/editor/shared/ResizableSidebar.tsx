import React, { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { GripVertical } from 'lucide-react';

interface ResizableSidebarProps {
  children: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  onWidthChange?: (width: number) => void;
}

export const ResizableSidebar: React.FC<ResizableSidebarProps> = ({
  children,
  initialWidth = 400,
  minWidth = 300,
  maxWidth = 600,
  className = '',
  onWidthChange,
}) => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (sidebarRef.current) {
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        const newWidth = sidebarRect.right - e.clientX;
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          setWidth(newWidth);
          onWidthChange?.(newWidth);
        }
      }
    },
    [minWidth, maxWidth, onWidthChange]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    }
    
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div
      ref={sidebarRef}
      style={{ width: `${width}px` }}
      className={cn(
        "relative flex flex-col bg-white shadow-xl z-20 transition-shadow",
        isResizing && "shadow-2xl select-none",
        className
      )}
    >
      <div className="flex-1 overflow-hidden flex flex-col">
        {children}
      </div>

      {/* Resize Handle / Gutter Divider */}
      <div
        onMouseDown={startResizing}
        className={cn(
          "absolute top-0 left-0 w-4 -translate-x-full h-full cursor-col-resize group z-30 flex justify-end"
        )}
      >
            {/* Subtle Gutter Line */}
            <div className={cn(
              "w-[1px] h-full transition-all duration-300 bg-slate-200/80 group-hover:bg-slate-400 group-hover:w-[2px]",
              isResizing && "bg-slate-900 w-[2px] shadow-[0_0_10px_rgba(0,0,0,0.1)]"
            )} />

            {/* Handle Knob */}
            <div className={cn(
              "absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-4 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-lg transition-all duration-300",
              "group-hover:scale-110 group-hover:border-slate-300 group-hover:shadow-slate-500/10",
              isResizing ? "opacity-100 scale-110 border-slate-900 shadow-slate-900/10" : "opacity-0 group-hover:opacity-100"
            )}>
              <GripVertical className={cn("w-3 h-3 text-slate-400 transition-colors", isResizing && "text-slate-900")} />
            </div>
      </div>
    </div>
  );
};
