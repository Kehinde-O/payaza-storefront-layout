'use client';

import { cn } from '@/lib/utils';
import { Award, CheckCircle, ShieldCheck, Star, Shield, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

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

export function CertificateTemplate({ data, design, className }: CertificateTemplateProps) {
  const {
    studentName,
    courseName,
    completionDate,
    certificateId,
    instructorName,
    instructorTitle,
    institutionName = 'Mindset Mastery Academy',
    signatureUrl,
    brandLogo,
    primaryColor = '#0F172A'
  } = data;

  const renderClassic = () => (
    <div className="w-full h-full bg-white border-[20px] border-double p-12 flex flex-col items-center text-center font-serif relative" style={{ borderColor: primaryColor }}>
      {/* Decorative Corners */}
      <div className="absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4" style={{ borderColor: primaryColor }} />
      <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4" style={{ borderColor: primaryColor }} />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4" style={{ borderColor: primaryColor }} />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4" style={{ borderColor: primaryColor }} />

      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 text-slate-400">{institutionName}</p>
        <Award className="w-16 h-16 mb-4 mx-auto" style={{ color: primaryColor }} />
        <h1 className="text-5xl font-black tracking-widest uppercase mb-1">Certificate</h1>
        <h2 className="text-xl italic text-gray-500">of Achievement</h2>
      </div>

      <p className="text-lg mb-4">This is to certify that</p>
      <h3 className="text-5xl font-bold mb-6 underline decoration-1 underline-offset-8 text-slate-900">{studentName}</h3>
      <p className="text-lg mb-4">has successfully demonstrated mastery in</p>
      <h4 className="text-3xl font-bold mb-10 text-slate-800 tracking-tight">{courseName}</h4>

      <div className="mt-auto w-full flex justify-between items-end px-12 pb-4">
        <div className="text-left w-56">
          <div className="border-b border-slate-200 w-full mb-2 h-12 flex items-end justify-center">
             {signatureUrl ? (
               <img src={signatureUrl} alt="Signature" className="h-10 object-contain" />
             ) : (
               <span className="text-3xl opacity-80 italic font-signature">{instructorName}</span>
             )}
          </div>
          <p className="font-bold text-[10px] text-slate-900">{instructorName}</p>
          <p className="text-[8px] text-slate-400 uppercase tracking-widest">{instructorTitle}</p>
        </div>

        <div className="flex flex-col items-center">
           <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center mb-2 shadow-inner" style={{ borderColor: `${primaryColor}20` }}>
              <div className="w-18 h-18 rounded-full border flex items-center justify-center relative bg-white shadow-sm" style={{ borderColor: primaryColor }}>
                 <Shield className="w-8 h-8" style={{ color: primaryColor }} />
                 <span className="absolute text-[6px] font-black uppercase tracking-tighter rotate-[-15deg] bg-white px-1">Verified</span>
              </div>
           </div>
           <p className="text-[8px] font-mono text-slate-400">ID: {certificateId}</p>
        </div>

        <div className="text-right w-56">
          <div className="border-b border-slate-200 w-full mb-2 h-12 flex items-end justify-center">
            <span className="font-bold text-[12px] text-slate-900">{completionDate}</span>
          </div>
          <p className="text-[8px] text-slate-400 uppercase tracking-widest">Date of Graduation</p>
        </div>
      </div>
    </div>
  );

  const renderModern = () => (
    <div className="w-full h-full bg-slate-50 flex font-sans relative">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current" style={{ color: primaryColor }}>
          <path d="M0,0 L100,0 L100,100 Z" />
        </svg>
      </div>
      
      <div className="w-16 h-full flex flex-col items-center justify-center gap-8 text-white relative z-10" style={{ backgroundColor: primaryColor }}>
        <div className="rotate-[-90deg] whitespace-nowrap font-black tracking-[0.4em] text-[10px] uppercase opacity-40">
          ACADEMIC EXCELLENCE
        </div>
        <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
          <Star className="w-4 h-4 fill-white" />
        </div>
      </div>

      <div className="flex-1 p-12 flex flex-col relative z-10 text-left">
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-1">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">{institutionName}</p>
            {brandLogo ? (
              <img src={brandLogo} alt="Logo" className="h-8 object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-black text-xl tracking-tighter text-slate-900">CERTIFIED</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Secure Credential</p>
            <p className="text-[10px] font-mono font-bold text-slate-900">{certificateId}</p>
          </div>
        </div>

        <div className="mb-8">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.2em] mb-4">
            Official Certification
          </span>
          <h1 className="text-6xl font-black text-slate-900 leading-[0.9] mb-3">
            Certificate <br /><span style={{ color: primaryColor }}>Of Completion</span>
          </h1>
          <div className="w-24 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
        </div>

        <div className="mt-2 space-y-6">
          <p className="text-lg text-slate-400 font-medium tracking-wide">This document confirms that</p>
          <h2 className="text-6xl font-black text-slate-900 tracking-tight leading-none">{studentName}</h2>
          <p className="text-base text-slate-500 font-medium max-w-2xl leading-relaxed">
            has successfully completed all requirements for the professional curriculum 
            <span className="font-black text-slate-900 block mt-1 text-xl" style={{ color: primaryColor }}>{courseName}</span>
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between pb-2">
          <div className="flex gap-12">
            <div className="text-left">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2">Lead Instructor</p>
              <div className="mb-1 h-10 flex items-end">
                {signatureUrl ? (
                  <img src={signatureUrl} alt="Signature" className="h-8 object-contain" />
                ) : (
                  <span className="text-2xl opacity-80 italic font-signature text-slate-900">{instructorName}</span>
                )}
              </div>
              <p className="font-black text-slate-900 text-[10px] tracking-tight">{instructorName}</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{instructorTitle}</p>
            </div>
            <div className="text-left">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-10">Issued On</p>
              <p className="font-black text-slate-900 text-[10px] tracking-tight">{completionDate}</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Graduation Date</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Authenticated</p>
              <p className="text-[8px] text-slate-900 font-bold">Scan to verify</p>
            </div>
            <div className="w-16 h-16 bg-white p-1.5 rounded-xl border border-slate-100 flex items-center justify-center shadow-md">
               <QrCode className="w-full h-full opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className="w-full h-full bg-white p-16 flex flex-col font-sans relative">
      <div className="absolute inset-0 border-[1px] border-slate-100 m-8 pointer-events-none" />
      
      <div className="flex justify-between items-center mb-20">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">{institutionName}</span>
        </div>
        <h1 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300">Official Certificate</h1>
      </div>

      <div className="space-y-12 text-left">
        <div>
          <p className="text-slate-400 uppercase tracking-[0.3em] text-[8px] font-black mb-4">Presented to</p>
          <h2 className="text-7xl font-light text-slate-900 tracking-tighter leading-none">{studentName}</h2>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="h-[1px] flex-1 bg-slate-100" />
          <p className="text-slate-400 font-medium italic text-base">for completion of</p>
          <div className="h-[1px] flex-1 bg-slate-100" />
        </div>

        <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{courseName}</h3>
      </div>

      <div className="mt-auto flex justify-between items-end pb-4">
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-slate-50 border border-slate-100 w-fit">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Verified Achievement</span>
          </div>
          <p className="text-[8px] font-mono font-bold text-slate-300 tracking-widest uppercase">ID: {certificateId}</p>
        </div>

        <div className="text-right space-y-8">
          <div className="space-y-1">
            <div className="mb-2 h-10 flex items-end justify-end">
              {signatureUrl ? (
                <img src={signatureUrl} alt="Signature" className="h-8 object-contain ml-auto" />
              ) : (
                <span className="text-2xl opacity-60 italic font-signature text-slate-900">{instructorName}</span>
              )}
            </div>
            <p className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em]">{instructorName}</p>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.3em]">{instructorTitle}</p>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.4em]">{completionDate}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPremium = () => (
    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-16 font-sans relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent opacity-20" />
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent opacity-20" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500 opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="mb-10 flex flex-col items-center gap-4 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Award className="w-8 h-8 text-white" />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-1">{institutionName}</p>
          <h1 className="text-4xl font-black text-white tracking-[0.2em] uppercase">Certificate</h1>
          <p className="text-amber-500/60 text-xs font-bold uppercase tracking-[0.3em]">of Premium Excellence</p>
        </div>
      </div>

      <div className="text-center space-y-8 relative z-10">
        <div>
          <p className="text-slate-400 text-sm font-medium italic mb-4">This highly distinguished award is presented to</p>
          <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight leading-none py-2">{studentName}</h2>
        </div>

        <div className="max-w-xl mx-auto space-y-4">
          <p className="text-slate-500 text-sm font-medium">for the exceptional completion and mastery of the professional curriculum</p>
          <h3 className="text-2xl font-black text-amber-500 tracking-tight">{courseName}</h3>
        </div>
      </div>

      <div className="mt-auto w-full flex justify-between items-end px-4 relative z-10">
        <div className="text-left">
          <div className="mb-2 h-10 flex items-end">
             {signatureUrl ? (
               <img src={signatureUrl} alt="Signature" className="h-8 object-contain" />
             ) : (
               <span className="text-2xl opacity-80 italic font-signature text-white">{instructorName}</span>
             )}
          </div>
          <p className="font-black text-white text-[10px] tracking-widest uppercase">{instructorName}</p>
          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em]">{instructorTitle}</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 shadow-inner">
            <p className="text-[8px] font-mono text-amber-500/80 font-bold tracking-widest">{certificateId}</p>
          </div>
          <p className="text-[7px] text-slate-600 font-black uppercase tracking-[0.3em]">Official Verification ID</p>
        </div>

        <div className="text-right">
          <p className="text-white text-[10px] font-black tracking-widest uppercase mb-1">{completionDate}</p>
          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em]">Distinguished Graduate</p>
        </div>
      </div>
    </div>
  );

  const renderLuxury = () => (
    <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center p-20 font-serif relative overflow-hidden">
      {/* Luxury Gold Border */}
      <div className="absolute inset-4 border border-[#C5A059] opacity-40 pointer-events-none" />
      <div className="absolute inset-8 border-4 border-[#C5A059] opacity-20 pointer-events-none" />
      
      {/* Decorative Ornaments */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-60">
        <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 20C50 20 50 0 100 0C150 0 150 20 200 20" stroke="#C5A059" strokeWidth="1" />
          <circle cx="100" cy="0" r="4" fill="#C5A059" />
        </svg>
      </div>

      <div className="text-center relative z-10">
        <p className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.6em] mb-12">{institutionName}</p>
        
        <div className="space-y-4 mb-16">
          <h1 className="text-6xl font-light text-white tracking-[0.3em] uppercase">Certificate</h1>
          <div className="flex items-center justify-center gap-6">
            <div className="h-[1px] w-12 bg-[#C5A059]/40" />
            <p className="text-[#C5A059] italic text-lg tracking-widest">of Distinction</p>
            <div className="h-[1px] w-12 bg-[#C5A059]/40" />
          </div>
        </div>

        <div className="space-y-12">
          <div className="space-y-2">
            <p className="text-slate-500 uppercase tracking-[0.4em] text-[10px]">This is to certify that</p>
            <h2 className="text-7xl font-bold text-white tracking-tight italic">{studentName}</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-slate-500 uppercase tracking-[0.4em] text-[10px]">has achieved mastery in</p>
            <h3 className="text-3xl font-light text-white tracking-[0.2em] uppercase">{courseName}</h3>
          </div>
        </div>
      </div>

      <div className="mt-auto w-full flex justify-between items-end px-12 relative z-10 pb-4">
        <div className="text-left">
          <div className="mb-4 h-12 flex items-end">
             {signatureUrl ? (
               <img src={signatureUrl} alt="Signature" className="h-10 object-contain" />
             ) : (
               <span className="text-3xl opacity-60 italic font-signature text-[#C5A059]">{instructorName}</span>
             )}
          </div>
          <div className="h-[1px] w-32 bg-[#C5A059]/40 mb-2" />
          <p className="font-bold text-white text-[10px] tracking-widest uppercase">{instructorName}</p>
          <p className="text-[8px] text-[#C5A059] uppercase tracking-[0.3em]">{instructorTitle}</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 border border-[#C5A059]/40 rounded-full flex items-center justify-center rotate-45 mb-4">
            <div className="w-16 h-16 border-4 border-[#C5A059]/20 rounded-full flex items-center justify-center -rotate-45">
              <Star className="w-8 h-8 text-[#C5A059]" />
            </div>
          </div>
          <p className="text-[8px] font-mono text-slate-600 tracking-tighter uppercase">Authentic {certificateId}</p>
        </div>

        <div className="text-right">
          <p className="text-white text-[10px] font-bold tracking-widest uppercase mb-2">{completionDate}</p>
          <div className="h-[1px] w-32 bg-[#C5A059]/40 mb-2 ml-auto" />
          <p className="text-[8px] text-[#C5A059] uppercase tracking-[0.3em]">Conferred Date</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn(
      "aspect-[1.414/1] w-full overflow-hidden shadow-2xl relative", 
      "print:aspect-none print:w-full print:h-full print:shadow-none print:rounded-none",
      className
    )}>
      {design === 'modern' ? renderModern() : 
       design === 'minimal' ? renderMinimal() : 
       design === 'premium' ? renderPremium() :
       design === 'luxury' ? renderLuxury() :
       renderClassic()}
    </div>
  );
}

export function CertificateCard({ certificate, onDownload }: { 
  certificate: any; 
  onDownload: (id: string) => void 
}) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="relative aspect-[1.414/1] rounded-lg overflow-hidden bg-slate-100 border border-slate-100 group-hover:border-slate-200 transition-colors">
        <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
           <CertificateTemplate 
             data={{
               studentName: "Student Name",
               courseName: certificate.courseName,
               completionDate: certificate.date,
               certificateId: certificate.id,
               instructorName: certificate.instructor,
               instructorTitle: "Lead Mentor",
               institutionName: certificate.institutionName || 'Mindset Mastery Academy',
               primaryColor: certificate.color || '#0F172A'
             }} 
             design={certificate.design || 'modern'} 
             className="scale-[0.25] origin-center w-[400%] h-[400%]"
           />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Certificate</span>
        </div>
        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{certificate.courseName}</h3>
        <p className="text-xs text-slate-500">Issued on {certificate.date}</p>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 rounded-xl h-10 text-xs font-bold uppercase tracking-widest"
          onClick={() => window.open(`/demo/mindset-mastery/account/certificates/${certificate.id}`, '_blank')}
        >
          View
        </Button>
        <Button 
          size="sm" 
          className="flex-1 rounded-xl h-10 text-xs font-bold uppercase tracking-widest bg-black text-white"
          onClick={() => onDownload(certificate.id)}
        >
          Download
        </Button>
      </div>
    </motion.div>
  );
}
