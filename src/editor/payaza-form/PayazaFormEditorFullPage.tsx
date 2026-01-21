import React from 'react';
import { FullPageEditorProps } from '../types';
import { PayazaFormEditor, PayazaFormEditorProps } from './PayazaFormEditor';
import { AlertModalProvider } from '../../components/ui/alert-modal';

export interface PayazaFormEditorFullPageProps extends PayazaFormEditorProps {
  // Explicitly include props from FullPageEditorProps to ensure they are available
  onBackToSettings?: () => void;
  onOpenAssets?: () => void;
  onBackToTheme?: () => void;
}

export const PayazaFormEditorFullPage: React.FC<PayazaFormEditorFullPageProps> = (props) => {
  return (
    <AlertModalProvider>
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-50">
        <main className="flex-1 overflow-hidden">
          <PayazaFormEditor {...props} />
        </main>
      </div>
    </AlertModalProvider>
  );
};
