import React from 'react';

interface PageTabsProps {
  pages: { id: string; name: string }[];
  activePageId: string;
  onPageChange: (pageId: string) => void;
  className?: string;
}

export const PageTabs: React.FC<PageTabsProps> = ({
  pages,
  activePageId,
  onPageChange,
  className = '',
}) => {
  return (
    <div className={`flex border-b border-gray-200 bg-white sticky top-0 z-10 ${className}`}>
      {pages.map((page) => (
        <button
          key={page.id}
          onClick={() => onPageChange(page.id)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activePageId === page.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {page.name}
        </button>
      ))}
    </div>
  );
};
