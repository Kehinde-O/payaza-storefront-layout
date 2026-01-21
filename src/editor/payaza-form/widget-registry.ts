/**
 * Widget Registry
 * Allows registration of custom React components/widgets for Payaza Form Editor
 * Similar to Puck's component registry but for form field widgets
 */

import React from 'react';

export interface WidgetProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  path: string[];
  schema?: any;
  [key: string]: any;
}

export type WidgetComponent = React.ComponentType<WidgetProps>;

/**
 * Registry of custom widgets by editor type
 */
const widgetRegistry: Map<string, WidgetComponent> = new Map();

/**
 * Register a custom widget for a specific editor type
 * 
 * @param editorType - The `_editor` type (e.g., 'text', 'image', 'custom-widget')
 * @param component - React component that implements WidgetProps
 * 
 * @example
 * ```tsx
 * import { registerWidget } from './widget-registry';
 * 
 * const MyCustomTextField = ({ label, value, onChange }) => (
 *   <div>
 *     <label>{label}</label>
 *     <input value={value} onChange={(e) => onChange(e.target.value)} />
 *   </div>
 * );
 * 
 * registerWidget('text', MyCustomTextField);
 * ```
 */
export function registerWidget(editorType: string, component: WidgetComponent): void {
  widgetRegistry.set(editorType, component);
}

/**
 * Register multiple widgets at once
 * 
 * @param widgets - Object mapping editor types to components
 * 
 * @example
 * ```tsx
 * registerWidgets({
 *   'text': MyCustomTextField,
 *   'image': MyCustomImageField,
 *   'custom-widget': MyCustomWidget,
 * });
 * ```
 */
export function registerWidgets(widgets: Record<string, WidgetComponent>): void {
  Object.entries(widgets).forEach(([editorType, component]) => {
    widgetRegistry.set(editorType, component);
  });
}

/**
 * Get a registered widget for an editor type
 * 
 * @param editorType - The `_editor` type
 * @returns The registered widget component or null if not found
 */
export function getWidget(editorType: string): WidgetComponent | null {
  return widgetRegistry.get(editorType) || null;
}

/**
 * Check if a widget is registered for an editor type
 * 
 * @param editorType - The `_editor` type
 * @returns True if widget is registered
 */
export function hasWidget(editorType: string): boolean {
  return widgetRegistry.has(editorType);
}

/**
 * Unregister a widget
 * 
 * @param editorType - The `_editor` type to unregister
 */
export function unregisterWidget(editorType: string): void {
  widgetRegistry.delete(editorType);
}

/**
 * Clear all registered widgets
 */
export function clearWidgets(): void {
  widgetRegistry.clear();
}

/**
 * Get all registered editor types
 * 
 * @returns Array of registered editor type strings
 */
export function getRegisteredTypes(): string[] {
  return Array.from(widgetRegistry.keys());
}

/**
 * Widget registry configuration interface
 */
export interface WidgetRegistryConfig {
  widgets?: Record<string, WidgetComponent>;
}

/**
 * Initialize widget registry with configuration
 * 
 * @param config - Configuration object with widgets to register
 */
export function initializeWidgetRegistry(config: WidgetRegistryConfig): void {
  if (config.widgets) {
    registerWidgets(config.widgets);
  }
}
