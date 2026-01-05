'use client';

import { CertificateTemplate, CertificateDesign, CertificateData } from './CertificateTemplates';
import { Button } from '@/components/ui/button';
import { Download, Printer, X, Share2, ArrowLeft, ShieldCheck, QrCode } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CertificateViewerProps {
  certificateId?: string;
  data?: CertificateData;
  design?: CertificateDesign;
  onClose?: () => void;
  isStandalone?: boolean;
}

export function CertificateViewer({ certificateId, data: initialData, design: initialDesign, onClose, isStandalone = false }: CertificateViewerProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Mock data fetching if only ID is provided (for standalone route)
  const [data, setData] = useState<CertificateData | null>(initialData || null);
  const [design, setDesign] = useState<CertificateDesign>(initialDesign || 'modern');

  useEffect(() => {
    if (certificateId && !initialData) {
      // In a real app, fetch from API. For demo, we use mock data.
      // This ensures the standalone page /account/certificates/[id] works.
      const mockCerts: Record<string, any> = {
        'CERT-8821': {
          data: {
            studentName: 'Kehinde Omotoso', // Usually comes from auth session
            courseName: 'The Art of Focus',
            completionDate: 'Dec 15, 2025',
            certificateId: 'CERT-8821',
            instructorName: 'Dr. Sarah Mitchell',
            instructorTitle: 'Lead Mentor',
            institutionName: 'Mindset Mastery Academy'
          },
          design: 'modern'
        },
        'CERT-7732': {
          data: {
            studentName: 'Kehinde Omotoso',
            courseName: 'Strategic Planning Guide',
            completionDate: 'Nov 20, 2025',
            certificateId: 'CERT-7732',
            instructorName: 'Marcus Aurelius',
            instructorTitle: 'Lead Mentor',
            institutionName: 'Global Vision Academy'
          },
          design: 'minimal'
        }
      };

      const cert = mockCerts[certificateId];
      if (cert) {
        setData(cert.data);
        setDesign(cert.design);
      }
    }
  }, [certificateId, initialData]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const handleDownload = () => {
    handlePrint(); // Print to PDF is the primary download method for high-fidelity
  };

  if (!data) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
      <div className="text-center">
        <ShieldCheck className="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Verifying Credential...</p>
      </div>
    </div>
  );

  return (
    <div className={cn(
      "min-h-screen bg-slate-100 flex flex-col print:bg-white print:p-0 font-sans",
      !isStandalone && "fixed inset-0 z-[100] p-4 md:p-8"
    )}>
      {/* Simple Header - Design choice removed per requirement */}
      <div className="container mx-auto max-w-6xl py-6 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          {!isStandalone && (
            <Button variant="ghost" onClick={onClose} className="rounded-full w-10 h-10 p-0 bg-white shadow-sm border border-slate-200">
              <X className="w-5 h-5" />
            </Button>
          )}
          {isStandalone && (
            <Button variant="ghost" onClick={() => window.history.back()} className="gap-3 bg-white shadow-sm rounded-full px-6 border border-slate-200 font-bold text-xs uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Back to Account
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full gap-2 bg-white shadow-sm border-slate-200 font-bold text-xs uppercase tracking-widest px-6" onClick={handlePrint}>
            <Printer className="w-4 h-4" /> Print
          </Button>
          <Button className="rounded-full gap-2 bg-black text-white shadow-lg shadow-black/20 font-bold text-xs uppercase tracking-widest px-8" onClick={handleDownload}>
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Certificate Display - "As Is" */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto print:p-0 print:overflow-visible print:block">
        <motion.div 
          layout
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-5xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] print:shadow-none bg-white print:max-w-none print:w-[297mm] print:h-[210mm] print:mx-auto"
          ref={certificateRef}
          id="certificate-to-print"
        >
          <CertificateTemplate data={data} design={design} />
        </motion.div>
      </div>

      {/* Footer Meta */}
      <div className="container mx-auto max-w-6xl py-12 flex flex-col items-center gap-4 print:hidden">
        <div className="flex items-center gap-3 text-slate-400">
          <ShieldCheck className="w-5 h-5" />
          <p className="text-xs font-black uppercase tracking-[0.3em]">Verified Digital Achievement</p>
        </div>
        <p className="text-[10px] font-mono text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
          Credential ID: {data.certificateId}
        </p>
        <div className="flex gap-4 mt-2">
           <button className="text-slate-400 hover:text-blue-600 transition-colors">
              <Share2 className="w-5 h-5" />
           </button>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          
          /* Hide everything by default */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
          }

          /* Hide all elements except the certificate */
          body > * {
            display: none !important;
          }

          /* Special container for printing */
          #print-root {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          #print-root > div {
            width: 100% !important;
            height: 100% !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
        }

        #print-root {
          display: none;
        }
      `}</style>

      {/* Hidden print-only clone for maximum reliability */}
      <div id="print-root">
        <div>
           <CertificateTemplate data={data} design={design} />
        </div>
      </div>
    </div>
  );
}
