import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FullPageEditorProps } from '../types';
import { EditorHeader } from '../shared/EditorHeader';
import { IframePreview } from '../shared/IframePreview';
import { ResizableSidebar } from '../shared/ResizableSidebar';
import { StoreConfig } from '../../lib/store-types';
import { OverlayLayoutJSON, getPageSchema } from './engine';
import { FieldRenderer } from './FieldRenderer';
import { loadLayoutJSON, loadLayoutJSONSync } from './layout-loader';
import { transformToStoreConfig, updateOverlayData, addArrayItem, removeArrayItem, updateArrayItem } from './data-transformer';
import { generateArrayItem, resolveDataPath, setDataPath } from './engine';
import { initializeWidgetRegistry, WidgetComponent, clearWidgets } from './widget-registry';
import { mergeRequirementWithActualData, mergeAllPagesWithActualData } from './data-merger';
import { Info, Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/use-debounce';
import { AIGenerateModal, AIContext } from '../shared/AIGenerateModal';
import { useAlertModal } from '../../components/ui/alert-modal';
import { AssetSelectionProvider } from './AssetSelectionContext';

export interface PayazaFormEditorProps extends FullPageEditorProps {
  /**
   * Custom widgets to register for specific editor types
   * Maps `_editor` type strings to React components
   */
  customWidgets?: Record<string, WidgetComponent>;
}

export const PayazaFormEditor: React.FC<PayazaFormEditorProps> = ({
  layoutId,
  initialData,
  inventory,
  onChange,
  onSave,
  onPublish,
  onBack,
  onBackToSettings,
  onOpenAssets,
  onBackToTheme,
  title,
  className = '',
  customWidgets,
  storeName,
  storeDescription,
  assets,
  publishButtonText,
}) => {
  const [activePageId, setActivePageId] = useState('home');
  const [data, setData] = useState<StoreConfig>(initialData);
  const dataRef = useRef<StoreConfig>(initialData);
  
  // Undo/Redo State
  const [history, setHistory] = useState<StoreConfig[]>([initialData]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isInternalChange = useRef(false);
  const MAX_HISTORY = 50;

  // Track last published data to disable publish button if no changes
  const [lastPublishedData, setLastPublishedData] = useState<StoreConfig>(initialData);

  // Debounce the data for preview to prevent excessive iframe updates and RAM spikes
  const debouncedData = useDebounce(data, 400);

  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [layoutJson, setLayoutJson] = useState<OverlayLayoutJSON | null>(null);
  const [baseRequirement, setBaseRequirement] = useState<OverlayLayoutJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { showAlert } = useAlertModal();

  // Keep dataRef in sync with data state
  useEffect(() => {
    dataRef.current = data;

    // Add to history if not an internal change (undo/redo)
    if (!isInternalChange.current) {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        // Only add if data is different from the last entry
        if (JSON.stringify(newHistory[newHistory.length - 1]) !== JSON.stringify(data)) {
          const updatedHistory = [...newHistory, data];
          if (updatedHistory.length > MAX_HISTORY) {
            return updatedHistory.slice(1);
          }
          return updatedHistory;
        }
        return prev;
      });
      setHistoryIndex(prev => {
        const newIndex = Math.min(historyIndex + 1, MAX_HISTORY - 1);
        // We need to re-calculate based on what setHistory actually does
        return historyIndex + 1; 
      });
    }
    isInternalChange.current = false;
  }, [data]);

  // Fix the history index after history update
  useEffect(() => {
    if (history.length > 0 && historyIndex >= history.length) {
      setHistoryIndex(history.length - 1);
    }
  }, [history]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      isInternalChange.current = true;
      const prevData = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setData(prevData);
      onChange?.(prevData);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isInternalChange.current = true;
      const nextData = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setData(nextData);
      onChange?.(nextData);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl+Y or Cmd+Shift+Z
      if (((e.ctrlKey || e.metaKey) && e.key === 'y') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        handleRedo();
      }
      // Save: Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, data]); // Dependencies ensure latest state is used

  // Initialize custom widgets if provided
  useEffect(() => {
    if (customWidgets) {
      initializeWidgetRegistry({ widgets: customWidgets });
    }
    // Cleanup registry on unmount to prevent memory leaks and registry bloat
    return () => {
      clearWidgets();
    };
  }, [customWidgets]);

  // Log store config data when editor opens
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[PayazaFormEditor] Store Config Data:', {
        layoutId,
        storeId: initialData?.id,
        storeSlug: initialData?.slug,
        storeName: initialData?.name,
        hasLayoutConfig: !!initialData?.layoutConfig,
      });
    }
  }, [layoutId, initialData]);

  // Load layout JSON and merge with actual data
  useEffect(() => {
    let isMounted = true;
    
    const loadLayout = async () => {
      setLoading(true);
      try {
        // Normalization mapping
        const layoutIdMap: Record<string, string> = {
          'fashion-hub': 'clothing',
          'savory-bites': 'food',
          'modern-eats': 'food-modern',
          'minimal-style': 'clothing-minimal',
          'fashion-minimal': 'clothing-minimal',
          'urban-retreat': 'booking',
          'agenda-book': 'booking-agenda',
          'grid-tech': 'electronics-grid',
          'mindset-mastery': 'motivational-speaker'
        };

        const rawId = String(layoutId || '').trim().toLowerCase();
        const normalizedId = layoutIdMap[rawId] || rawId;
        const layoutRequirement = await loadLayoutJSON(normalizedId, inventory);
        
        if (!isMounted) return;

        if (layoutRequirement) {
          setBaseRequirement(layoutRequirement);
          // Initial merge for the active page
          const mergedLayout = mergeRequirementWithActualData(
            layoutRequirement,
            initialData,
            activePageId
          );
          setLayoutJson(mergedLayout);
          
          // Merge with existing data to preserve all StoreConfig properties
          const storeConfig = transformToStoreConfig(mergedLayout, activePageId, initialData);
          setData(storeConfig);
          // Don't call onChange here to avoid loops on initial load
        } else {
          console.error(`[PayazaFormEditor] Failed to load layout requirement for: ${layoutId} (normalized: ${normalizedId})`);
        }
      } catch (error) {
        console.error('[PayazaFormEditor] Error loading layout:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadLayout();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SECTION_SELECTED') {
        const sectionKey = event.data.section || event.data.sectionKey;
        if (sectionKey) {
          setSelectedSection(sectionKey);
          
          // Find and scroll to the section in the sidebar
          const element = document.querySelector(`[data-section-key="${sectionKey}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      isMounted = false;
      window.removeEventListener('message', handleMessage);
    };
  }, [layoutId, inventory, initialData]);

  // Re-merge data when page changes
  useEffect(() => {
    // Only proceed if we have the base requirement
    // Don't block on loading or initialData - use current data state instead
    if (!baseRequirement) {
      return;
    }

    // Get current data from ref to avoid dependency loop
    const currentData = dataRef.current;

    // Re-merge from base requirement for the new active page using current data state
    const mergedLayout = mergeRequirementWithActualData(
      baseRequirement,
      currentData, // Use current data state from ref instead of initialData
      activePageId
    );
    setLayoutJson(mergedLayout);
    
    // Update data state with merged layoutConfig for the new page
    // This ensures the preview shows the same data that's loaded into the editor
    const mergedStoreConfig = transformToStoreConfig(mergedLayout, activePageId, currentData); // Use current data state
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[PayazaFormEditor] Page changed, setting merged StoreConfig for preview:', {
        pageId: activePageId,
        hasLayoutConfig: !!mergedStoreConfig.layoutConfig,
      });
    }
    
    setData(mergedStoreConfig);
    // Removed layoutJson from dependencies to avoid redundant loops
  }, [activePageId, baseRequirement]);

  // Get pages from layout JSON
  const pages = useMemo(() => {
    if (layoutJson) {
      return layoutJson.pages.map(p => ({ id: p.id, name: p.label }));
    }
    return [{ id: 'home', name: 'Home' }];
  }, [layoutJson]);

  // Get current page schema and data
  const pageSchema = useMemo(() => {
    if (!layoutJson) return null;
    return getPageSchema(activePageId, layoutJson);
  }, [layoutJson, activePageId]);

  // Filtered schema based on search only (tabs removed)
  const filteredSchema = useMemo(() => {
    if (!pageSchema) return [];
    
    return Object.entries(pageSchema.schema).filter(([key, schema]: [string, any]) => {
      // Filter by search only
      if (searchQuery) {
        const label = schema._label || key;
        return label.toLowerCase().includes(searchQuery.toLowerCase());
      }

      return true;
    });
  }, [pageSchema, searchQuery]);

  // Handle field change
  const handleFieldChange = (sectionKey: string, fieldPath: string[] | undefined, value: any) => {
    if (!layoutJson) return;

    // fieldPath is now passed from FieldRenderer, use it if provided
    // If not provided (for backward compatibility), use empty array
    const actualFieldPath = fieldPath || [];

    const updatedLayout = updateOverlayData(
      layoutJson,
      activePageId,
      sectionKey,
      actualFieldPath,
      value
    );
    setLayoutJson(updatedLayout);

    // Merge with existing data to preserve all StoreConfig properties
    const storeConfig = transformToStoreConfig(updatedLayout, activePageId, data);
    setData(storeConfig);
    onChange?.(storeConfig);
  };

  // Handle array item change
  const handleArrayItemChange = (
    sectionKey: string,
    arrayPath: string[],
    index: number,
    itemValue: any
  ) => {
    if (!layoutJson) return;

    const updatedLayout = updateArrayItem(
      layoutJson,
      activePageId,
      sectionKey,
      arrayPath,
      index,
      itemValue
    );
    setLayoutJson(updatedLayout);

    // Merge with existing data to preserve all StoreConfig properties
    const storeConfig = transformToStoreConfig(updatedLayout, activePageId, data);
    setData(storeConfig);
    onChange?.(storeConfig);
  };

  // Handle array item add
  const handleArrayItemAdd = (
    sectionKey: string,
    arrayPath: string[],
    itemSchema: Record<string, any>
  ) => {
    if (!layoutJson) return;

    const newItem = generateArrayItem(itemSchema);
    const updatedLayout = addArrayItem(
      layoutJson,
      activePageId,
      sectionKey,
      arrayPath,
      newItem
    );
    setLayoutJson(updatedLayout);

    // Merge with existing data to preserve all StoreConfig properties
    const storeConfig = transformToStoreConfig(updatedLayout, activePageId, data);
    setData(storeConfig);
    onChange?.(storeConfig);
  };

  // Handle array item remove
  const handleArrayItemRemove = (
    sectionKey: string,
    arrayPath: string[],
    index: number
  ) => {
    if (!layoutJson) return;

    const updatedLayout = removeArrayItem(
      layoutJson,
      activePageId,
      sectionKey,
      arrayPath,
      index
    );
    setLayoutJson(updatedLayout);

    // Merge with existing data to preserve all StoreConfig properties
    const storeConfig = transformToStoreConfig(updatedLayout, activePageId, data);
    setData(storeConfig);
    onChange?.(storeConfig);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(data);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish?.(data);
      setLastPublishedData(data);
    } finally {
      setIsPublishing(false);
    }
  };

  const hasChangesSincePublish = useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(lastPublishedData);
  }, [data, lastPublishedData]);

  const handleAIGenerate = async (context: AIContext) => {
    if (!layoutJson) return;
    
    setIsGeneratingAI(true);
    // Use a local variable to track if this specific request should still update state
    let shouldUpdate = true;
    
    try {
      let response: Response;
      try {
        response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...context,
            layoutId,
            alignmentSchema: layoutJson,
            existingData: data,
            assets: assets || context.assets
          })
        });
      } catch (fetchError: any) {
        // Handle network errors, CORS errors, etc.
        throw new Error(fetchError.message || 'Network request failed. Please check your connection and try again.');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error('The server returned an invalid response. Please ensure the AI endpoint is correctly configured.');
      }

      if (!response.ok) {
        let errorMessage = 'Failed to generate content';
        let errorDetails = '';
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
          errorDetails = error.details || '';
          
          // Check if this is an API key configuration error
          if (errorMessage.includes('AI API key not configured') || errorMessage.includes('GEMINI_API_KEY')) {
            errorMessage = 'AI model configuration missing. The layout editor requires AI credentials to be configured in the host application (storefront-admin).';
            errorDetails = 'Please add GEMINI_API_KEY and GEMINI_MODEL to storefront-admin/.env or storefront-admin/.env.local';
          }
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || `Server returned ${response.status} error`;
        }
        
        const fullErrorMessage = errorDetails 
          ? `${errorMessage}\n\n${errorDetails}`
          : errorMessage;
        throw new Error(fullErrorMessage);
      }

      const generatedData = await response.json();
      
      if (!shouldUpdate) return;

      // Update layoutJson with generated data for each page
      const updatedLayout = { ...layoutJson };
      updatedLayout.pages = updatedLayout.pages.map(page => {
        if (generatedData[page.id]) {
          return {
            ...page,
            data: generatedData[page.id]
          };
        }
        return page;
      });

      setLayoutJson(updatedLayout);
      
      // CRITICAL: Merge ALL pages from the updated AI layout into the StoreConfig
      // to ensure the StoreConfig is fully updated for all pages.
      // We set actualDataPrecedence to false so AI data takes precedence.
      const updatedStoreConfig = mergeAllPagesWithActualData(updatedLayout, data, { actualDataPrecedence: false });

      setData(updatedStoreConfig);
      onChange?.(updatedStoreConfig);

      // Optional: Add a small delay and a "polishing" step for specific layouts like food
      if (layoutId === 'food' || layoutId === 'food-modern') {
        console.log('[PayazaFormEditor] Applying restaurant-specific content polishing...');
        // In the future, we could add a second lighter AI pass here specifically for 
        // appetizing adjectives and culinary context.
      }

      setIsAIModalOpen(false);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[PayazaFormEditor] AI Generation Successful:', updatedStoreConfig);
      }
    } catch (error: any) {
      if (shouldUpdate) {
        console.error('AI Generation Error:', error);
        
        // Determine error type and message
        let errorTitle = 'AI Generation Failed';
        let errorMessage = 'We encountered an issue while generating content.';
        let actionableMessage = 'Please try again. If the problem persists, you can continue editing manually.';
        
        // Extract error message from various error types
        let errorText = '';
        if (error instanceof Error) {
          errorText = error.message.toLowerCase();
        } else if (typeof error === 'string') {
          errorText = error.toLowerCase();
        } else if (error && typeof error === 'object' && 'message' in error) {
          errorText = String(error.message).toLowerCase();
        }
        
        // Handle specific error cases
        if (errorText.includes('network') || errorText.includes('fetch') || errorText.includes('failed to fetch') || 
            errorText.includes('ai generation fetch failed') || errorText.includes('network request failed')) {
          errorTitle = 'Connection Problem';
          errorMessage = 'Unable to connect to the AI service.';
          actionableMessage = 'Please check your internet connection and try again.';
        } else if (errorText.includes('timeout') || errorText.includes('aborted')) {
          errorTitle = 'Request Timed Out';
          errorMessage = 'The AI service is taking longer than expected to respond.';
          actionableMessage = 'Please try again in a moment. The service may be experiencing high demand.';
        } else if (errorText.includes('500') || errorText.includes('server error') || errorText.includes('internal server')) {
          errorTitle = 'Service Temporarily Unavailable';
          errorMessage = 'The AI service is experiencing technical difficulties.';
          actionableMessage = 'Please try again in a few moments. If the issue continues, contact support.';
        } else if (errorText.includes('400') || errorText.includes('bad request')) {
          errorTitle = 'Invalid Request';
          errorMessage = 'There was an issue with the generation request.';
          actionableMessage = 'Please try again with different content or contact support if the issue persists.';
        } else if (errorText.includes('api key') || errorText.includes('ai api key not configured') || errorText.includes('gemini_api_key') || 
                   errorText.includes('ai model configuration missing') || errorText.includes('unauthorized') || errorText.includes('403') || errorText.includes('401')) {
          errorTitle = 'AI Configuration Required';
          errorMessage = 'The AI service requires configuration in the host application.';
          actionableMessage = 'Please add GEMINI_API_KEY and GEMINI_MODEL to storefront-admin/.env or storefront-admin/.env.local. The layout editor uses the host application\'s environment variables for AI model configuration.';
        } else if (errorText.includes('quota') || errorText.includes('429') || errorText.includes('rate limit')) {
          errorTitle = 'Service Limit Reached';
          errorMessage = 'The AI service has reached its usage limit.';
          actionableMessage = 'Please try again later or contact support to increase your service limits.';
        } else if (error instanceof Error) {
          errorMessage = error.message || 'An unexpected error occurred.';
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        showAlert(
          `${errorMessage} ${actionableMessage}`,
          'error',
          {
            title: errorTitle,
            confirmText: 'Try Again',
            cancelText: 'Continue Editing',
            showCancel: true,
            onConfirm: () => {
              setIsAIModalOpen(true);
            },
            onCancel: () => {
              setIsAIModalOpen(false);
            }
          }
        );
      }
    } finally {
      if (shouldUpdate) {
        setIsGeneratingAI(false);
      }
    }

    // This is a bit of a hack since handleAIGenerate is not an effect,
    // but it helps prevent state updates if the user closes the modal or navigates away.
    // In a real scenario, we might want to use AbortController.
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white font-sans overflow-hidden">
        {/* Skeleton Header */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 animate-pulse" />
            <div className="space-y-2">
              <div className="w-24 h-3 bg-slate-50 animate-pulse rounded" />
              <div className="w-16 h-2 bg-slate-50 animate-pulse rounded" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-20 h-9 bg-slate-50 animate-pulse rounded-xl" />
            <div className="w-24 h-9 bg-slate-50 animate-pulse rounded-xl" />
          </div>
        </div>
        
        <div className="flex flex-1">
          {/* Skeleton Preview */}
          <div className="flex-1 bg-[#f8f9fb] p-12 flex items-center justify-center">
            <div className="w-full h-full rounded-3xl border-8 border-white/50 shadow-2xl bg-white/30 animate-pulse" />
          </div>
          
          {/* Skeleton Sidebar */}
          <div className="w-[380px] border-l border-slate-100 p-6 space-y-8">
            <div className="space-y-4">
              <div className="w-32 h-4 bg-slate-50 animate-pulse rounded" />
              <div className="w-full h-12 bg-slate-50 animate-pulse rounded-xl" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-full h-20 bg-slate-50 animate-pulse rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!layoutJson || !pageSchema) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Layout not found</div>
      </div>
    );
  }

  return (
    <AssetSelectionProvider onOpenAssets={onOpenAssets} assets={assets}>
      <div className={`flex flex-col h-full bg-white ${className} font-sans antialiased text-slate-900`}>
        <EditorHeader
        layoutName={layoutJson.layoutName || layoutId}
        storeName={storeName}
        storeLogo={initialData?.branding?.logo}
        activePage={activePageId}
        pages={pages}
        onPageSwitch={setActivePageId}
        onSave={handleSave}
        onPublish={onPublish && hasChangesSincePublish ? handlePublish : undefined}
        onBack={onBack}
        onBackToSettings={onBackToSettings}
        onOpenAssets={onOpenAssets}
        onBackToTheme={onBackToTheme}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        editorType="payaza-form"
        isSaving={isSaving}
        isPublishing={isPublishing}
        onGenerateAI={() => setIsAIModalOpen(true)}
        isGeneratingAI={isGeneratingAI}
        publishButtonText={publishButtonText}
      />
      
      <AIGenerateModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleAIGenerate}
        initialContext={{
          storeName: storeName || data?.name || '',
          storeDescription: storeDescription || data?.description || '',
          assets: assets || [],
        }}
        isGenerating={isGeneratingAI}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Full Preview */}
        <div className="flex-1 overflow-hidden bg-[#f8f9fb] relative">
          <IframePreview
            layoutId={layoutId}
            config={data}
            activePageId={activePageId}
            viewMode={viewMode}
            selectedSection={selectedSection}
          />
        </div>

        {/* Resizable Sidebar */}
        <ResizableSidebar
          initialWidth={380}
          minWidth={340}
          maxWidth={500}
          className="bg-white border-l border-slate-200 shadow-[-12px_0_32px_-4px_rgba(0,0,0,0.03)]"
        >
          <div className="flex flex-col h-full bg-white relative">
            {/* Sidebar Header with Tabs */}
            <div className="bg-white/90 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-100 px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[11px] font-semibold text-slate-900 uppercase tracking-[0.3em]">Editor Panel</h3>
                  <p className="text-[9px] text-slate-500 font-medium uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E1065] shadow-[0_0_8px_rgba(46,16,101,0.2)]" />
                    Customising {activePageId}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-all cursor-help" title="Studio Info">
                    <Info size={14} />
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-[#2E1065]" size={14} strokeWidth={2.5} />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-11 pr-10 bg-slate-50/50 border border-slate-200/80 rounded-xl text-[12px] font-semibold text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#2E1065]/5 focus:border-[#2E1065]/30 focus:bg-white transition-all shadow-sm hover:border-[#2E1065]/20"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700 rounded-full transition-all"
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-1 payaza-form-editor overflow-y-auto custom-scrollbar bg-[#fcfcfd] px-6 py-8">
              <div className="space-y-6">
                {filteredSchema.length > 0 ? (
                  filteredSchema.map(([sectionKey, sectionSchema]: [string, any]) => {
                    const sectionData = pageSchema.data[sectionKey];
                    
                    return (
                      <div 
                        key={sectionKey} 
                        data-section-key={sectionKey}
                        className={selectedSection === sectionKey ? 'ring-2 ring-primary ring-inset rounded-xl bg-primary/5' : ''}
                      >
                        <FieldRenderer
                          schemaField={sectionSchema}
                          value={sectionData}
                          path={[sectionKey]}
                          onChange={(value, fieldPath) => {
                            // fieldPath from FieldRenderer is relative to the section
                            // e.g., ['show'] for hero.show, ['sliders', 0, 'title'] for hero.sliders[0].title
                            handleFieldChange(sectionKey, fieldPath, value);
                          }}
                          onArrayItemChange={(index, itemValue) => {
                            handleArrayItemChange(sectionKey, [], index, itemValue);
                          }}
                          onArrayItemAdd={() => {
                            if (sectionSchema._itemSchema) {
                              handleArrayItemAdd(sectionKey, [], sectionSchema._itemSchema);
                            }
                          }}
                          onArrayItemRemove={(index) => {
                            handleArrayItemRemove(sectionKey, [], index);
                          }}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center px-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl border border-slate-50">
                      <Search size={28} className="text-slate-200" strokeWidth={1.5} />
                    </div>
                    <p className="text-[12px] font-semibold text-slate-700 uppercase tracking-widest mb-2">No results found</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest max-w-[200px] leading-relaxed">Try adjusting your search to find specific properties</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-8 py-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.02)]">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                   <div className="flex flex-col gap-0.5">
                     <p className="text-[10px] font-semibold text-slate-900 uppercase tracking-[0.1em]">Studio Status</p>
                     <p className="text-[8px] font-medium text-slate-500 uppercase tracking-widest">Live Syncing Enabled</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </ResizableSidebar>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
      </div>
    </AssetSelectionProvider>
  );
};
