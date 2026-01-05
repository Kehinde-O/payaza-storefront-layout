'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ElectronicsStoreHeader } from './ElectronicsStoreHeader';
import { ElectronicsStoreFooter } from './ElectronicsStoreFooter';
import { PageContentLoader } from '../../../components/ui/page-content-loader';
import { useLoading } from '../../../lib/loading-context';
export function ElectronicsPageWrapper({ children, storeConfig }) {
    const { isBackendLoading } = useLoading();
    return (_jsxs("div", { className: "min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white", children: [_jsx(ElectronicsStoreHeader, { storeConfig: storeConfig }), _jsxs("main", { className: "flex-1 pt-24 relative", children: [isBackendLoading && _jsx(PageContentLoader, {}), children] }), _jsx(ElectronicsStoreFooter, { storeConfig: storeConfig })] }));
}
