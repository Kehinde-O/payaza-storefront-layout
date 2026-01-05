'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { StoreCategory } from '@/lib/store-types';
import { buildCategoryTree, getAllCategoryIds } from '@/lib/utils/category-tree';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CategoryTreeProps {
  categories: StoreCategory[];
  selectedCategoryIds?: string[];
  onCategoryToggle?: (categoryId: string, isSelected: boolean) => void;
  mode?: 'checkbox' | 'button' | 'link';
  onCategorySelect?: (categorySlug: string) => void;
  className?: string;
  showAllOption?: boolean;
  onAllSelect?: () => void;
  isAllSelected?: boolean;
  storeSlug?: string;
  linkBasePath?: string;
}

interface CategoryItemProps {
  category: StoreCategory;
  level: number;
  selectedCategoryIds: string[];
  onCategoryToggle: (categoryId: string, isSelected: boolean) => void;
  mode: 'checkbox' | 'button' | 'link';
  onCategorySelect?: (categorySlug: string) => void;
  expandedCategories: Set<string>;
  onToggleExpand: (categoryId: string) => void;
  storeSlug?: string;
  linkBasePath?: string;
}

function CategoryItem({
  category,
  level,
  selectedCategoryIds,
  onCategoryToggle,
  mode,
  onCategorySelect,
  expandedCategories,
  onToggleExpand,
  storeSlug,
  linkBasePath,
}: CategoryItemProps) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories.has(category.id);
  const isSelected = selectedCategoryIds.includes(category.id);
  
  const handleClick = () => {
    if (mode === 'button' && onCategorySelect) {
      onCategorySelect(category.slug);
    } else if (mode === 'checkbox') {
      onCategoryToggle(category.id, !isSelected);
    }
    // Link mode is handled by Link component, no onClick needed
  };
  
  const href = mode === 'link' && storeSlug 
    ? `${linkBasePath || ''}/${storeSlug}/categories/${category.slug}`
    : undefined;

  const handleExpandToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand(category.id);
    }
  };

  const baseClasses = cn(
    'flex items-center gap-2 w-full text-left transition-colors rounded-lg',
    mode === 'checkbox' 
      ? 'p-2 -ml-2 -mr-2 cursor-pointer group hover:bg-blue-50 hover:text-blue-600'
      : mode === 'link'
      ? 'px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors group'
      : 'px-3 py-2 cursor-pointer group hover:bg-slate-100 hover:text-slate-900',
    isSelected && mode === 'checkbox' && 'bg-blue-50 text-blue-600',
    isSelected && mode === 'button' && 'bg-blue-50 text-blue-600'
  );

  const content = (
    <>
        {/* Expand/Collapse Icon */}
        {mode !== 'link' && (
          <button
            type="button"
            onClick={handleExpandToggle}
            className={cn(
              'flex items-center justify-center w-5 h-5 rounded transition-colors',
              hasChildren ? 'cursor-pointer hover:bg-gray-200' : 'cursor-default opacity-0',
              level > 0 && 'ml-2'
            )}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {hasChildren && (
              isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
              )
            )}
          </button>
        )}
        {/* Expand/Collapse Icon for link mode */}
        {mode === 'link' && hasChildren && (
          <button
            type="button"
            onClick={handleExpandToggle}
            className={cn(
              'flex items-center justify-center w-5 h-5 rounded transition-colors cursor-pointer hover:bg-gray-200',
              level > 0 && 'ml-2'
            )}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
            )}
          </button>
        )}

        {/* Checkbox (for checkbox mode) */}
        {mode === 'checkbox' && (
          <div className={cn(
            'w-4 h-4 rounded border flex items-center justify-center transition-colors',
            isSelected 
              ? 'bg-blue-600 border-blue-600' 
              : 'border-gray-300 group-hover:border-blue-400'
          )}>
            {isSelected && <Check className="h-3 w-3 text-white" />}
          </div>
        )}

        {/* Category Name */}
        <span className={cn(
          'text-sm font-medium flex-1',
          level === 0 ? 'text-gray-900' : 'text-gray-700',
          isSelected && 'text-blue-600'
        )}>
          {category.name}
        </span>

        {/* Selection Indicator (for button mode) */}
        {mode === 'button' && isSelected && (
          <Check className="h-4 w-4 text-blue-600" />
        )}
        {/* Chevron for link mode (only for categories without children) */}
        {mode === 'link' && !hasChildren && (
          <ChevronRight className="h-3 w-3 text-gray-300 group-hover:text-gray-500" />
        )}
    </>
  );

  return (
    <div className="space-y-1">
      {mode === 'link' && href ? (
        hasChildren ? (
          <div className={baseClasses} onClick={(e) => {
            e.preventDefault();
            onToggleExpand(category.id);
          }}>
            {content}
          </div>
        ) : (
          <Link href={href} className={baseClasses}>
            {content}
          </Link>
        )
      ) : (
        <div className={baseClasses} onClick={handleClick}>
          {content}
        </div>
      )}

      {/* Children */}
      {hasChildren && isExpanded && (
        <div 
          className={cn('space-y-1', level === 0 ? 'ml-4' : 'ml-6')}
          style={level > 1 ? { marginLeft: `${(level + 1) * 0.75}rem` } : undefined}
        >
          {category.children!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              selectedCategoryIds={selectedCategoryIds}
              onCategoryToggle={onCategoryToggle}
              mode={mode}
              onCategorySelect={onCategorySelect}
              expandedCategories={expandedCategories}
              onToggleExpand={onToggleExpand}
              storeSlug={storeSlug}
              linkBasePath={linkBasePath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryTree({
  categories,
  selectedCategoryIds = [],
  onCategoryToggle,
  mode = 'checkbox',
  onCategorySelect,
  className,
  showAllOption = false,
  onAllSelect,
  isAllSelected = false,
  storeSlug,
  linkBasePath,
}: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Build category tree from flat array
  const categoryTree = useMemo(() => {
    return buildCategoryTree(categories);
  }, [categories]);

  const handleToggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleCategoryToggle = (categoryId: string, isSelected: boolean) => {
    if (onCategoryToggle) {
      onCategoryToggle(categoryId, isSelected);
    }
  };

  if (categoryTree.length === 0) {
    return (
      <div className={cn('text-sm text-gray-500 italic', className)}>
        No categories available
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      {/* "All" option */}
      {showAllOption && onAllSelect && (
        <button
          type="button"
          onClick={onAllSelect}
          className={cn(
            'flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            mode === 'checkbox' 
              ? 'p-2 -ml-2 -mr-2 cursor-pointer group hover:bg-blue-50 hover:text-blue-600'
              : 'cursor-pointer group hover:bg-slate-100 hover:text-slate-900',
            isAllSelected && 'bg-blue-50 text-blue-600'
          )}
        >
          {mode === 'checkbox' && (
            <div className={cn(
              'w-4 h-4 rounded border flex items-center justify-center transition-colors',
              isAllSelected 
                ? 'bg-blue-600 border-blue-600' 
                : 'border-gray-300 group-hover:border-blue-400'
            )}>
              {isAllSelected && <Check className="h-3 w-3 text-white" />}
            </div>
          )}
          <span className="flex-1">All Products</span>
          {mode === 'button' && isAllSelected && (
            <Check className="h-4 w-4 text-blue-600" />
          )}
        </button>
      )}

      {/* Category Tree */}
      {categoryTree.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          level={0}
          selectedCategoryIds={selectedCategoryIds}
          onCategoryToggle={handleCategoryToggle}
          mode={mode}
          onCategorySelect={onCategorySelect}
          expandedCategories={expandedCategories}
          onToggleExpand={handleToggleExpand}
          storeSlug={storeSlug}
          linkBasePath={linkBasePath}
        />
      ))}
    </div>
  );
}

