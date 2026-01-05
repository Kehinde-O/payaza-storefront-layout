import { CertificateDesign, CertificateData } from './CertificateTemplates';
interface CertificateViewerProps {
    certificateId?: string;
    data?: CertificateData;
    design?: CertificateDesign;
    onClose?: () => void;
    isStandalone?: boolean;
}
export declare function CertificateViewer({ certificateId, data: initialData, design: initialDesign, onClose, isStandalone }: CertificateViewerProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CertificateViewer.d.ts.map