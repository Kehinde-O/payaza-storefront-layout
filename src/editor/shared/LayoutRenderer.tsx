import React from 'react';
import { LayoutPreview } from '../../preview/LayoutPreview';
import { StoreConfig } from '../../lib/store-types';

interface LayoutRendererProps {
  layoutId: string;
  config: StoreConfig;
  activePageId: string;
  className?: string;
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  layoutId,
  config,
  activePageId,
  className = '',
}) => {
  // Map the pageId to a route for LayoutPreview
  const route = activePageId === 'home' ? '/' : `/${activePageId}`;

  return (
    <div className={`relative h-full overflow-auto bg-transparent ${className}`}>
      <LayoutPreview
        layout={layoutId}
        config={config}
        initialRoute={route}
      />
    </div>
  );
};
