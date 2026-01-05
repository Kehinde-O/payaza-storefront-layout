export type CertificateDesign = 'classic' | 'modern' | 'minimal' | 'premium' | 'luxury';
export interface CertificateData {
    studentName: string;
    courseName: string;
    completionDate: string;
    certificateId: string;
    instructorName: string;
    instructorTitle: string;
    institutionName?: string;
    signatureUrl?: string;
    brandLogo?: string;
    primaryColor?: string;
}
interface CertificateTemplateProps {
    data: CertificateData;
    design: CertificateDesign;
    className?: string;
}
export declare function CertificateTemplate({ data, design, className }: CertificateTemplateProps): import("react/jsx-runtime").JSX.Element;
export declare function CertificateCard({ certificate, onDownload }: {
    certificate: any;
    onDownload: (id: string) => void;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CertificateTemplates.d.ts.map