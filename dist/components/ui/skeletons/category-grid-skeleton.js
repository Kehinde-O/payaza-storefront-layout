import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function CategoryGridSkeleton({ count = 6 }) {
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] mb-8", children: Array.from({ length: count }).map((_, i) => {
            // Vary sizes like the actual category grid
            const getSpanClass = (index) => {
                if (index === 0)
                    return 'md:col-span-2 md:row-span-2';
                if (index === 1)
                    return 'md:row-span-2';
                if (index === 4)
                    return 'md:col-span-2';
                return '';
            };
            return (_jsxs("div", { className: `relative overflow-hidden rounded-2xl bg-gray-200 animate-pulse ${getSpanClass(i)}`, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-gray-300/80 via-gray-200/20 to-transparent" }), _jsxs("div", { className: "absolute inset-0 flex flex-col justify-end p-6 lg:p-8", children: [_jsx("div", { className: "h-8 bg-gray-300 rounded w-3/4 mb-2" }), _jsx("div", { className: "h-4 bg-gray-300 rounded w-1/2" })] })] }, i));
        }) }));
}
