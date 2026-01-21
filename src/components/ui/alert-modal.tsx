'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

interface AlertState {
  isOpen: boolean;
  message: string;
  type: AlertType;
  options: AlertOptions;
}

interface AlertModalContextType {
  showAlert: (message: string, type?: AlertType, options?: AlertOptions) => void;
  hideAlert: () => void;
}

export const AlertModalContext = createContext<AlertModalContextType | undefined>(undefined);

export function AlertModalProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    message: '',
    type: 'info',
    options: {}
  });

  const showAlert = useCallback((message: string, type: AlertType = 'info', options: AlertOptions = {}) => {
    setAlert({
      isOpen: true,
      message,
      type,
      options
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirm = () => {
    alert.options.onConfirm?.();
    hideAlert();
  };

  const handleCancel = () => {
    alert.options.onCancel?.();
    hideAlert();
  };

  return (
    <AlertModalContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <AlertModalContainer 
        isOpen={alert.isOpen}
        message={alert.message}
        type={alert.type}
        options={alert.options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onClose={hideAlert}
      />
    </AlertModalContext.Provider>
  );
}

export function useAlertModal() {
  const context = useContext(AlertModalContext);
  if (context === undefined) {
    throw new Error('useAlertModal must be used within an AlertModalProvider');
  }
  return context;
}

interface AlertModalContainerProps {
  isOpen: boolean;
  message: string;
  type: AlertType;
  options: AlertOptions;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

function AlertModalContainer({ 
  isOpen, 
  message, 
  type, 
  options, 
  onConfirm, 
  onCancel,
  onClose 
}: AlertModalContainerProps) {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle2 className="h-10 w-10 text-green-500" />,
    error: <AlertCircle className="h-10 w-10 text-red-500" />,
    warning: <AlertTriangle className="h-10 w-10 text-amber-500" />,
    info: <Info className="h-10 w-10 text-blue-500" />
  };

  const colors = {
    success: "bg-green-50 border-green-100",
    error: "bg-red-50 border-red-100",
    warning: "bg-amber-50 border-amber-100",
    info: "bg-blue-50 border-blue-100"
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop with premium blur */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-100">
        <div className="p-8 flex flex-col items-center text-center">
          {/* Icon Circle */}
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-50 duration-500 delay-150",
            colors[type]
          )}>
            {icons[type]}
          </div>

          {/* Text Content */}
          <h3 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight">
            {options.title || (type.charAt(0).toUpperCase() + type.slice(1))}
          </h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed px-2">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="px-8 pb-8 flex flex-col gap-3">
          <Button 
            onClick={onConfirm}
            className={cn(
              "w-full h-12 rounded-xl font-bold text-sm uppercase tracking-wider transition-all active:scale-[0.98]",
              type === 'success' && "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100",
              type === 'error' && "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100",
              type === 'warning' && "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-100",
              type === 'info' && "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200"
            )}
          >
            {options.confirmText || 'Understand'}
          </Button>

          {options.showCancel && (
            <Button 
              variant="ghost"
              onClick={onCancel}
              className="w-full h-12 rounded-xl font-bold text-sm uppercase tracking-wider text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            >
              {options.cancelText || 'Cancel'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
