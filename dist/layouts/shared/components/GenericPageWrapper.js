'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { StoreHeader } from '../../shared/components/StoreHeader';
import { StoreFooter } from '../../shared/components/StoreFooter';
import { useStore } from '../../../lib/store-context';
export function GenericPageWrapper({ children, storeConfig: initialConfig }) {
    const { store } = useStore();
    const storeConfig = store || initialConfig;
    // These layouts suppress the header/footer in BaseStoreLayout
    // So we need to re-add them for generic pages like Contact, About, etc.
    // 'electronics' and 'electronics-grid' are handled by ElectronicsPageWrapper usually, 
    // but if we use this wrapper, we should check.
    // BaseStoreLayout now handles headers for these layouts on inner pages, 
    // so we don't need to add them here anymore to avoid duplication.
    const customLayouts = [];
    // Note: electronics layouts usually use ElectronicsPageWrapper which has its own header.
    // If this wrapper is used for them, we might want to check or just use StoreHeader as fallback.
    // But typically we route those to ElectronicsPageWrapper.
    const needsHeader = customLayouts.includes(storeConfig.layout);
    if (needsHeader) {
        return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx(StoreHeader, { storeConfig: storeConfig }), _jsx("main", { className: "flex-1", children: children }), _jsx(StoreFooter, { storeConfig: storeConfig })] }));
    }
    return _jsx(_Fragment, { children: children });
}
