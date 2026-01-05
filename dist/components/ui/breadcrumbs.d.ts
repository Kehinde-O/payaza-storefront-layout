interface BreadcrumbItem {
    label: string;
    href?: string;
}
interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    variant?: 'default' | 'light';
}
export declare function Breadcrumbs({ items, variant }: BreadcrumbsProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=breadcrumbs.d.ts.map