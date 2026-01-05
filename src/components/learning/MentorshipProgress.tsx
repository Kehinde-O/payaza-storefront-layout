'use client';

import { StoreConfig, StoreService } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, MessageSquare, Video, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { cn, formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MentorshipProgram {
  id: string;
  name: string;
  mentorName: string;
  mentorAvatar?: string;
  startDate: string;
  expiryDate: string;
  sessionsTotal: number;
  sessionsCompleted: number;
  status: 'active' | 'expired' | 'completed';
  lastSessionDate?: string;
  nextSessionDate?: string;
}

export function MentorshipProgress({ programs }: { programs: MentorshipProgram[] }) {
  if (programs.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <User className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No active mentorships</h3>
        <p className="text-slate-500 max-w-xs mx-auto mt-2">
          Ready to level up? Browse our mentorship programs and connect with an expert.
        </p>
        <Button className="mt-6 rounded-full bg-black text-white px-8">Browse Mentors</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {programs.map((program) => {
        const isExpired = program.status === 'expired' || new Date(program.expiryDate) < new Date();
        const progress = (program.sessionsCompleted / program.sessionsTotal) * 100;
        
        // Calculate days remaining
        const daysRemaining = Math.ceil((new Date(program.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

        return (
          <motion.div 
            key={program.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "bg-white border-2 rounded-3xl overflow-hidden transition-all",
              isExpired ? "border-slate-100 opacity-75" : "border-slate-100 hover:border-blue-200 hover:shadow-xl shadow-sm"
            )}
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Mentor Avatar & Basic Info */}
                <div className="flex flex-row md:flex-col items-center md:items-center gap-4 md:w-48 text-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-sm">
                    <Image 
                      src={program.mentorAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"} 
                      alt={program.mentorName} 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mt-2">{program.mentorName}</h4>
                    <p className="text-xs font-medium text-blue-600 uppercase tracking-widest">Lead Mentor</p>
                  </div>
                </div>

                {/* Program Details */}
                <div className="flex-1 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                          isExpired ? "bg-slate-100 text-slate-500" : "bg-blue-100 text-blue-700"
                        )}>
                          {isExpired ? 'Completed' : 'Active Program'}
                        </span>
                        {!isExpired && daysRemaining <= 7 && (
                          <span className="flex items-center gap-1 text-orange-600 text-[10px] font-bold">
                            <AlertCircle className="w-3 h-3" /> Expiers Soon
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">{program.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Expires On</p>
                      <p className={cn(
                        "font-mono font-bold",
                        isExpired ? "text-slate-400" : "text-slate-900"
                      )}>{new Date(program.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end text-sm">
                      <span className="font-bold text-slate-600">Session Progress</span>
                      <span className="font-mono font-black text-slate-900">
                        {program.sessionsCompleted}/{program.sessionsTotal} <span className="text-slate-400 font-medium text-xs">SESSIONS</span>
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-full transition-all",
                          isExpired ? "bg-slate-300" : "bg-gradient-to-r from-blue-500 to-indigo-600"
                        )}
                      />
                    </div>
                  </div>

                  {/* Program Meta */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Next Session</p>
                        <p className="text-sm font-bold text-slate-700">{program.nextSessionDate || 'TBD'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Messages</p>
                        <p className="text-sm font-bold text-slate-700">12 New</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 hidden md:flex">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enrollment</p>
                        <p className="text-sm font-bold text-slate-700">{daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-slate-50/50 border-t border-slate-100 px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                  <Video className="w-4 h-4" /> Room Link
                </button>
                <div className="w-[1px] h-4 bg-slate-200" />
                <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Resources
                </button>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button variant="outline" className="flex-1 sm:flex-none rounded-full px-6 font-bold h-11 border-slate-200">
                  Manage Schedule
                </Button>
                <Button className="flex-1 sm:flex-none rounded-full px-8 font-bold h-11 bg-black text-white hover:bg-slate-800 shadow-lg shadow-black/10">
                  Enter Session
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

