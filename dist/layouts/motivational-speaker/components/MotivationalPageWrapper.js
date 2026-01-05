'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PageContentLoader } from '../../../components/ui/page-content-loader';
import { useLoading } from '../../../lib/loading-context';
import { useStore } from '../../../lib/store-context';
export function MotivationalPageWrapper({ children, storeConfig }) {
    const { isBackendLoading } = useLoading();
    const { cartCount } = useStore();
    return (_jsx("div", { className: "min-h-screen flex flex-col bg-white font-sans text-gray-900 selection:bg-black selection:text-white", children: _jsxs("main", { className: "flex-1 relative", children: [isBackendLoading && _jsx(PageContentLoader, {}), children] }) }));
}
