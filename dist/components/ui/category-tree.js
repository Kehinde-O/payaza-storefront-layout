'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { buildCategoryTree } from '../../lib/utils/category-tree';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
function CategoryItem({ category, level, selectedCategoryIds, onCategoryToggle, mode, onCategorySelect, expandedCategories, onToggleExpand, storeSlug, linkBasePath, }) {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategoryIds.includes(category.id);
    const handleClick = () => {
        if (mode === 'button' && onCategorySelect) {
            onCategorySelect(category.slug);
        }
        else if (mode === 'checkbox') {
            onCategoryToggle(category.id, !isSelected);
        }
        // Link mode is handled by Link component, no onClick needed
    };
    const href = mode === 'link' && storeSlug
        ? `${linkBasePath || ''}/${storeSlug}/categories/${category.slug}`
        : undefined;
    const handleExpandToggle = (e) => {
        e.stopPropagation();
        if (hasChildren) {
            onToggleExpand(category.id);
        }
    };
    const baseClasses = cn('flex items-center gap-2 w-full text-left transition-colors rounded-lg', mode === 'checkbox'
        ? 'p-2 -ml-2 -mr-2 cursor-pointer group hover:bg-blue-50 hover:text-blue-600'
        : mode === 'link'
            ? 'px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors group'
            : 'px-3 py-2 cursor-pointer group hover:bg-slate-100 hover:text-slate-900', isSelected && mode === 'checkbox' && 'bg-blue-50 text-blue-600', isSelected && mode === 'button' && 'bg-blue-50 text-blue-600');
    const content = (_jsxs(_Fragment, { children: [mode !== 'link' && (_jsx("button", { type: "button", onClick: handleExpandToggle, className: cn('flex items-center justify-center w-5 h-5 rounded transition-colors', hasChildren ? 'cursor-pointer hover:bg-gray-200' : 'cursor-default opacity-0', level > 0 && 'ml-2'), "aria-label": isExpanded ? 'Collapse' : 'Expand', children: hasChildren && (isExpanded ? (_jsx(ChevronDown, { className: "h-3.5 w-3.5 text-gray-500" })) : (_jsx(ChevronRight, { className: "h-3.5 w-3.5 text-gray-500" }))) })), mode === 'link' && hasChildren && (_jsx("button", { type: "button", onClick: handleExpandToggle, className: cn('flex items-center justify-center w-5 h-5 rounded transition-colors cursor-pointer hover:bg-gray-200', level > 0 && 'ml-2'), "aria-label": isExpanded ? 'Collapse' : 'Expand', children: isExpanded ? (_jsx(ChevronDown, { className: "h-3.5 w-3.5 text-gray-500" })) : (_jsx(ChevronRight, { className: "h-3.5 w-3.5 text-gray-500" })) })), mode === 'checkbox' && (_jsx("div", { className: cn('w-4 h-4 rounded border flex items-center justify-center transition-colors', isSelected
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300 group-hover:border-blue-400'), children: isSelected && _jsx(Check, { className: "h-3 w-3 text-white" }) })), _jsx("span", { className: cn('text-sm font-medium flex-1', level === 0 ? 'text-gray-900' : 'text-gray-700', isSelected && 'text-blue-600'), children: category.name }), mode === 'button' && isSelected && (_jsx(Check, { className: "h-4 w-4 text-blue-600" })), mode === 'link' && !hasChildren && (_jsx(ChevronRight, { className: "h-3 w-3 text-gray-300 group-hover:text-gray-500" }))] }));
    return (_jsxs("div", { className: "space-y-1", children: [mode === 'link' && href ? (hasChildren ? (_jsx("div", { className: baseClasses, onClick: (e) => {
                    e.preventDefault();
                    onToggleExpand(category.id);
                }, children: content })) : (_jsx(Link, { href: href, className: baseClasses, children: content }))) : (_jsx("div", { className: baseClasses, onClick: handleClick, children: content })), hasChildren && isExpanded && (_jsx("div", { className: cn('space-y-1', level === 0 ? 'ml-4' : 'ml-6'), style: level > 1 ? { marginLeft: `${(level + 1) * 0.75}rem` } : undefined, children: category.children.map((child) => (_jsx(CategoryItem, { category: child, level: level + 1, selectedCategoryIds: selectedCategoryIds, onCategoryToggle: onCategoryToggle, mode: mode, onCategorySelect: onCategorySelect, expandedCategories: expandedCategories, onToggleExpand: onToggleExpand, storeSlug: storeSlug, linkBasePath: linkBasePath }, child.id))) }))] }));
}
export function CategoryTree({ categories, selectedCategoryIds = [], onCategoryToggle, mode = 'checkbox', onCategorySelect, className, showAllOption = false, onAllSelect, isAllSelected = false, storeSlug, linkBasePath, }) {
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    // Build category tree from flat array
    const categoryTree = useMemo(() => {
        return buildCategoryTree(categories);
    }, [categories]);
    const handleToggleExpand = (categoryId) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            }
            else {
                next.add(categoryId);
            }
            return next;
        });
    };
    const handleCategoryToggle = (categoryId, isSelected) => {
        if (onCategoryToggle) {
            onCategoryToggle(categoryId, isSelected);
        }
    };
    if (categoryTree.length === 0) {
        return (_jsx("div", { className: cn('text-sm text-gray-500 italic', className), children: "No categories available" }));
    }
    return (_jsxs("div", { className: cn('space-y-1', className), children: [showAllOption && onAllSelect && (_jsxs("button", { type: "button", onClick: onAllSelect, className: cn('flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors', mode === 'checkbox'
                    ? 'p-2 -ml-2 -mr-2 cursor-pointer group hover:bg-blue-50 hover:text-blue-600'
                    : 'cursor-pointer group hover:bg-slate-100 hover:text-slate-900', isAllSelected && 'bg-blue-50 text-blue-600'), children: [mode === 'checkbox' && (_jsx("div", { className: cn('w-4 h-4 rounded border flex items-center justify-center transition-colors', isAllSelected
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300 group-hover:border-blue-400'), children: isAllSelected && _jsx(Check, { className: "h-3 w-3 text-white" }) })), _jsx("span", { className: "flex-1", children: "All Products" }), mode === 'button' && isAllSelected && (_jsx(Check, { className: "h-4 w-4 text-blue-600" }))] })), categoryTree.map((category) => (_jsx(CategoryItem, { category: category, level: 0, selectedCategoryIds: selectedCategoryIds, onCategoryToggle: handleCategoryToggle, mode: mode, onCategorySelect: onCategorySelect, expandedCategories: expandedCategories, onToggleExpand: handleToggleExpand, storeSlug: storeSlug, linkBasePath: linkBasePath }, category.id)))] }));
}
