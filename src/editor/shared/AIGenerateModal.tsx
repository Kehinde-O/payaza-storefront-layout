import React, { useState } from 'react';
import { X, Sparkles, Store, FileText, PlusCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (context: AIContext) => Promise<void>;
  initialContext: Partial<AIContext>;
  isGenerating: boolean;
}

export interface AIContext {
  storeName: string;
  storeDescription: string;
  additionalContext: string;
  assets?: string[];
}

export const AIGenerateModal: React.FC<AIGenerateModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  initialContext,
  isGenerating
}) => {
  const [context, setContext] = useState<AIContext>({
    storeName: initialContext.storeName || '',
    storeDescription: initialContext.storeDescription || '',
    additionalContext: '',
    assets: initialContext.assets || [],
  });

  // Update context if initialContext changes
  React.useEffect(() => {
    setContext(prev => ({
      ...prev,
      storeName: initialContext.storeName || prev.storeName,
      storeDescription: initialContext.storeDescription || prev.storeDescription,
      assets: initialContext.assets || prev.assets,
    }));
  }, [initialContext.storeName, initialContext.storeDescription, initialContext.assets]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(context);
  };

  const hasDefaultContext = !!(initialContext.storeName && initialContext.storeDescription);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] relative animate-in zoom-in-95 duration-200">
        {/* Magic Loading Overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[210] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="relative">
                {/* Outer magical glow */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-40px] bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 blur-3xl opacity-30 rounded-full"
                />
                
                {/* Floating particles/stars */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -40, 0],
                      x: [0, (i % 2 === 0 ? 30 : -30), 0],
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2 + Math.random(), 
                      repeat: Infinity, 
                      delay: i * 0.4,
                      ease: "easeInOut"
                    }}
                    className="absolute text-purple-400"
                    style={{ 
                      top: '50%', 
                      left: '50%',
                      marginTop: -8,
                      marginLeft: -8
                    }}
                  >
                    <Sparkles size={16} fill="currentColor" />
                  </motion.div>
                ))}

                {/* Main Icon Container */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    y: [0, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-purple-200"
                >
                  <Sparkles className="w-10 h-10 text-white animate-pulse" strokeWidth={2.5} />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-12 space-y-4"
              >
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI is crafting your store...</h3>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Writing copy • Sourcing assets • Designing sections</p>
                
                {/* Progress bar simulation */}
                <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto mt-6">
                  <motion.div 
                    animate={{ 
                      x: [-256, 256] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="w-full h-full                     bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse mt-4">This may take a moment while AI crafts your store</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
              <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">AI Magic Generator</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Powered by Gemini AI</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-[13px] text-blue-800 font-medium leading-relaxed">
                {hasDefaultContext 
                  ? "We've detected your store details. The AI will use these and your assets to populate your layout. You can add more context below."
                  : "Our AI will use your store name, description, and assets to automatically populate your entire layout with high-quality content."}
              </p>
            </div>
          </div>

          <form id="ai-generate-form" onSubmit={handleSubmit} className="space-y-6">
            {!hasDefaultContext && (
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Store size={14} className="text-slate-400" />
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={context.storeName}
                    onChange={(e) => setContext({ ...context, storeName: e.target.value })}
                    placeholder="e.g. Fashion Hub"
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} className="text-slate-400" />
                    Store Description
                  </label>
                  <textarea
                    value={context.storeDescription}
                    onChange={(e) => setContext({ ...context, storeDescription: e.target.value })}
                    placeholder="Briefly describe what your store sells..."
                    rows={3}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900/20 transition-all resize-none"
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <PlusCircle size={14} className="text-slate-400" />
                Additional Context (Optional)
              </label>
              <textarea
                value={context.additionalContext}
                onChange={(e) => setContext({ ...context, additionalContext: e.target.value })}
                placeholder="e.g. Target audience, preferred color scheme, specific sections to highlight..."
                rows={4}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900/20 transition-all resize-none"
              />
            </div>

            {context.assets && context.assets.length > 0 && (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                <ImageIcon className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{context.assets.length} Assets Detected</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">AI will prioritize using your uploaded images</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Sparkles className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Auto-Sourcing Enabled</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI will source high-quality images for missing assets</p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-2xl border border-slate-200 bg-white font-black text-[12px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]"
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="ai-generate-form"
            className="flex-[2] h-12 rounded-2xl bg-slate-900 font-black text-[12px] uppercase tracking-widest text-white hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Magic...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Layout
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
