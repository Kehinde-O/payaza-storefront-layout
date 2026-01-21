import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';

interface AssetSelectionContextValue {
  onOpenAssetSelect: (callback: (url: string) => void) => void;
  assets?: string[];
  isAssetLibraryAvailable: boolean;
}

const AssetSelectionContext = createContext<AssetSelectionContextValue | null>(null);

interface AssetSelectionProviderProps {
  children: ReactNode;
  onOpenAssets?: () => void;
  assets?: string[];
}

// Global handler that host app can call
let globalAssetSelectionHandler: ((url: string) => void) | null = null;

export const setGlobalAssetSelectionHandler = (handler: ((url: string) => void) | null) => {
  globalAssetSelectionHandler = handler;
};

export const getGlobalAssetSelectionHandler = (): ((url: string) => void) | null => {
  return globalAssetSelectionHandler;
};

export const AssetSelectionProvider: React.FC<AssetSelectionProviderProps> = ({
  children,
  onOpenAssets,
  assets,
}) => {
  const [pendingCallback, setPendingCallback] = useState<((url: string) => void) | null>(null);
  const callbackRef = useRef<((url: string) => void) | null>(null);

  // Update ref when callback changes
  useEffect(() => {
    callbackRef.current = pendingCallback;
    console.log('[AssetSelectionContext] Callback ref updated:', {
      hasCallback: !!pendingCallback,
      hasRef: !!callbackRef.current,
    });
  }, [pendingCallback]);

  // Set up global handler that host app can call
  // The handler always reads from callbackRef.current to get the latest callback
  useEffect(() => {
    const handler = (url: string) => {
      console.log('[AssetSelectionContext] Global handler called with URL:', url, {
        hasCallbackRef: !!callbackRef.current,
      });
      if (callbackRef.current) {
        console.log('[AssetSelectionContext] Invoking callback with URL:', url);
        callbackRef.current(url);
        setPendingCallback(null); // Clear callback after use
        callbackRef.current = null; // Also clear ref
      } else {
        console.warn('[AssetSelectionContext] No callback available when handler was called');
      }
    };
    setGlobalAssetSelectionHandler(handler);
    console.log('[AssetSelectionContext] Global handler registered');
    return () => {
      setGlobalAssetSelectionHandler(null);
      console.log('[AssetSelectionContext] Global handler cleared');
    };
  }, []);

  const onOpenAssetSelect = useCallback(
    (callback: (url: string) => void) => {
      if (onOpenAssets) {
        console.log('[AssetSelectionContext] onOpenAssetSelect called, storing callback');
        // Store the callback so the host app can call it when an asset is selected
        setPendingCallback(() => callback);
        // Also update ref immediately for synchronous access
        callbackRef.current = callback;
        // Open the asset library
        onOpenAssets();
        console.log('[AssetSelectionContext] Asset library opened, callback stored');
      } else {
        console.warn('[AssetSelectionContext] onOpenAssets not available');
      }
    },
    [onOpenAssets]
  );

  const value: AssetSelectionContextValue = {
    onOpenAssetSelect,
    assets,
    isAssetLibraryAvailable: !!onOpenAssets,
  };

  return (
    <AssetSelectionContext.Provider value={value}>
      {children}
    </AssetSelectionContext.Provider>
  );
};

export const useAssetSelection = (): AssetSelectionContextValue => {
  const context = useContext(AssetSelectionContext);
  if (!context) {
    // Return a no-op implementation if context is not available
    return {
      onOpenAssetSelect: () => {
        console.warn('[AssetSelection] Asset library is not available');
      },
      isAssetLibraryAvailable: false,
    };
  }
  return context;
};
