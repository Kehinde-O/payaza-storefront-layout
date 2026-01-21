import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight,
  Layout, 
  Save, 
  Smartphone, 
  Monitor, 
  Tablet,
  Eye, 
  ChevronDown,
  Home,
  ShoppingBag,
  ShoppingCart,
  FileText,
  Settings,
  Undo2,
  Redo2,
  Send,
  Sparkles,
  Image as ImageIcon,
  Palette,
  Check
} from 'lucide-react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(true), 400);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full pt-2 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
          >
            <div className="relative">
              <div className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md shadow-2xl border border-white/10 whitespace-nowrap">
                {text}
              </div>
              <div 
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-l border-t border-white/10" 
                style={{ zIndex: -1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface EditorHeaderProps {
  layoutName: string;
  storeName?: string;
  storeLogo?: string;
  activePage: string;
  isSaving?: boolean;
  isPublishing?: boolean;
  onSave: () => void;
  onPublish?: () => void;
  onBack?: () => void;
  onBackToSettings?: () => void;
  onOpenAssets?: () => void;
  onBackToTheme?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onGenerateAI?: () => void;
  isGeneratingAI?: boolean;
  pages: { id: string; name: string }[];
  onPageSwitch: (pageId: string) => void;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onViewModeChange?: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  editorType?: 'payaza-form'; // Only PayazaFormEditor is supported
  publishButtonText?: string; // Custom text for publish button (e.g., "Update" for published stores)
}

const getPageIcon = (pageId: string) => {
  switch (pageId) {
    case 'home': return <Home className="w-3.5 h-3.5" />;
    case 'products': return <ShoppingBag className="w-3.5 h-3.5" />;
    case 'cart': return <ShoppingCart className="w-3.5 h-3.5" />;
    default: return <FileText className="w-3.5 h-3.5" />;
  }
};

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  layoutName,
  storeName,
  storeLogo,
  activePage,
  isSaving,
  isPublishing,
  onSave,
  onPublish,
  onBack,
  onBackToSettings,
  onOpenAssets,
  onBackToTheme,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onGenerateAI,
  isGeneratingAI,
  pages,
  onPageSwitch,
  viewMode = 'desktop',
  onViewModeChange,
  editorType,
  publishButtonText = 'Publish'
}) => {
  const [isPageSwitcherOpen, setIsPageSwitcherOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.page-switcher-container')) {
        setIsPageSwitcherOpen(false);
      }
    };

    if (isPageSwitcherOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPageSwitcherOpen]);

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [pages]);

  // Reset logo error when storeLogo changes
  useEffect(() => {
    setLogoError(false);
  }, [storeLogo]);

  // Scroll to active page when it changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeButton = container.querySelector(`[data-page-id="${activePage}"]`) as HTMLElement;
    if (activeButton) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      
      const scrollLeft = container.scrollLeft;
      const buttonLeft = buttonRect.left - containerRect.left + scrollLeft;
      const buttonRight = buttonLeft + buttonRect.width;
      const containerWidth = container.clientWidth;

      if (buttonLeft < scrollLeft) {
        container.scrollTo({ left: buttonLeft - 12, behavior: 'smooth' });
      } else if (buttonRight > scrollLeft + containerWidth) {
        container.scrollTo({ left: buttonRight - containerWidth + 12, behavior: 'smooth' });
      }
    }
    
    checkScrollability();
  }, [activePage, pages]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  return (
    <div className="border-b border-slate-200 bg-white sticky top-0 z-[100] h-16 shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-sans">
      <div className="flex items-center justify-between px-6 h-full w-full mx-auto gap-4">
        {/* Left: Back & Layout Info */}
        <div className="flex items-center flex-shrink-0 gap-2">
          {onBack && (
            <Tooltip text="Go Back">
              <button 
                onClick={onBack} 
                className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-50 border border-slate-100 transition-all active:scale-95 shadow-sm"
              >
                <ChevronLeft className="h-4 w-4 text-slate-600" strokeWidth={2.5} />
              </button>
            </Tooltip>
          )}

          <div className="h-8 w-px bg-slate-100 mx-1" />

          <div className="flex items-center gap-3 ml-1">
            <Tooltip text="Layout Info">
              <div className={cn(
                "w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-slate-200 overflow-hidden",
                storeLogo && !logoError && storeLogo.trim() !== '' ? "" : "bg-[#2E1065]"
              )}>
                {storeLogo && !logoError && storeLogo.trim() !== '' ? (
                  <img 
                    src={storeLogo} 
                    alt={storeName || layoutName}
                    className="w-full h-full object-cover"
                    onError={() => {
                      console.warn('[EditorHeader] Failed to load store logo:', storeLogo);
                      setLogoError(true);
                    }}
                    onLoad={() => {
                      // Reset error state if image loads successfully
                      if (logoError) {
                        setLogoError(false);
                      }
                    }}
                  />
                ) : (
                  <Layout className="w-5 h-5 text-white" strokeWidth={2.5} />
                )}
              </div>
            </Tooltip>
            <div className="flex flex-col">
              <h1 className="text-[12px] font-semibold leading-tight tracking-tight uppercase text-slate-900 whitespace-nowrap">
                {storeName || layoutName}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                <span className="text-[9px] uppercase font-medium text-slate-500 tracking-[0.15em]">
                  {layoutName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Page Selector */}
        <div className="flex items-center gap-4 flex-1 min-w-0 justify-center">
          <div className="relative page-switcher-container">
            <button
              onClick={() => setIsPageSwitcherOpen(!isPageSwitcherOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-all group hover:border-[#2E1065]/20"
            >
              <div className="text-slate-900">
                {getPageIcon(activePage)}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-900">
                {pages.find(p => p.id === activePage)?.name || activePage}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isPageSwitcherOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
            </button>

            <AnimatePresence>
              {isPageSwitcherOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[200] p-2"
                >
                  <div className="px-3 py-2 border-b border-slate-50 mb-1">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">Switch Page</span>
                  </div>
                  <div className="space-y-0.5">
                    {pages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => {
                          onPageSwitch(page.id);
                          setIsPageSwitcherOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                          activePage === page.id
                            ? 'bg-[#2E1065] text-white shadow-lg shadow-slate-200'
                            : 'text-slate-700 hover:bg-slate-50 hover:border-[#2E1065]/10 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={activePage === page.id ? 'text-white' : 'text-slate-500'}>
                            {getPageIcon(page.id)}
                          </div>
                          <span className={`text-[10px] font-semibold uppercase tracking-widest`}>
                            {page.name}
                          </span>
                        </div>
                        {activePage === page.id && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Actions & Utilities */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* View Modes (No wrapper) */}
          <div className="flex items-center mr-2">
            <Tooltip text="Desktop View">
              <button
                onClick={() => onViewModeChange?.('desktop')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'desktop' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Monitor size={18} strokeWidth={2.5} />
              </button>
            </Tooltip>
            <Tooltip text="Tablet View">
              <button
                onClick={() => onViewModeChange?.('tablet')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'tablet' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Tablet size={18} strokeWidth={2.5} />
              </button>
            </Tooltip>
            <Tooltip text="Mobile View">
              <button
                onClick={() => onViewModeChange?.('mobile')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'mobile' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Smartphone size={18} strokeWidth={2.5} />
              </button>
            </Tooltip>
          </div>

          <div className="h-8 w-px bg-slate-100 mx-1" />

          {/* Undo/Redo (No wrapper) */}
          <div className="flex items-center mr-2">
            <Tooltip text="Undo (Ctrl+Z)">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className={`p-2 rounded-xl transition-all ${
                  canUndo ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' : 'text-slate-200 cursor-not-allowed'
                }`}
              >
                <Undo2 size={18} strokeWidth={2.5} />
              </button>
            </Tooltip>
            <Tooltip text="Redo (Ctrl+Y)">
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className={`p-2 rounded-xl transition-all ${
                  canRedo ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' : 'text-slate-200 cursor-not-allowed'
                }`}
              >
                <Redo2 size={18} strokeWidth={2.5} />
              </button>
            </Tooltip>
          </div>

          <div className="h-8 w-px bg-slate-100 mx-1" />

          {/* Configuration Buttons (Moved here & icons enlarged) */}
          <div className="flex items-center mr-2">
            {onBackToSettings && (
              <Tooltip text="Store Settings">
                <button 
                  onClick={onBackToSettings}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <Settings size={18} strokeWidth={2.5} />
                </button>
              </Tooltip>
            )}
            {onOpenAssets && (
              <Tooltip text="Assets Library">
                <button 
                  onClick={onOpenAssets}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <ImageIcon size={18} strokeWidth={2.5} />
                </button>
              </Tooltip>
            )}
            {onBackToTheme && (
              <Tooltip text="Theme Selector">
                <button 
                  onClick={onBackToTheme}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <Palette size={18} strokeWidth={2.5} />
                </button>
              </Tooltip>
            )}
          </div>

          <div className="h-8 w-px bg-slate-100 mx-1" />

          {onGenerateAI && (
            <Tooltip text="AI Magic Generator">
              <button 
                onClick={onGenerateAI}
                disabled={isGeneratingAI}
                className="h-9 w-9 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-black flex items-center justify-center hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md shadow-indigo-100 active:scale-[0.98] disabled:opacity-50"
              >
                {isGeneratingAI ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
              </button>
            </Tooltip>
          )}
          
          <Tooltip text="Save Changes">
            <button
              onClick={onSave}
              disabled={isSaving}
              className="h-9 px-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold text-[9px] uppercase tracking-[0.1em] flex items-center gap-2 hover:bg-slate-50 hover:shadow-md hover:shadow-slate-100 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSaving ? (
                <span className="w-3.5 h-3.5 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" strokeWidth={2.5} />
              )}
              Save Draft
            </button>
          </Tooltip>

          <Tooltip text={!onPublish ? "No changes to publish" : publishButtonText === "Update" ? "Update Store" : "Publish to Store"}>
            <button
              onClick={onPublish}
              disabled={isPublishing || !onPublish}
              className="h-9 px-5 bg-[#2E1065] text-white rounded-xl font-semibold text-[9px] uppercase tracking-[0.12em] flex items-center gap-2 hover:bg-[#1a0a3d] transition-all shadow-lg shadow-slate-200 active:scale-[0.98] disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              {isPublishing ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
              )}
              {publishButtonText}
            </button>
          </Tooltip>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};
