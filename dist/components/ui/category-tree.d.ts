import { StoreCategory } from '../../lib/store-types';
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
export declare function CategoryTree({ categories, selectedCategoryIds, onCategoryToggle, mode, onCategorySelect, className, showAllOption, onAllSelect, isAllSelected, storeSlug, linkBasePath, }: CategoryTreeProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=category-tree.d.ts.map