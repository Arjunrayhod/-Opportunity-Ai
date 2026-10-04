import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Download, Share2, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { Course, User } from '../../types';

interface CertificateModalProps {
  course: Course;
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ course, user, isOpen, onClose }) => {
  if (!isOpen) return null;

  const certificateId = `CERT-OPP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleDownload = () => {
    alert(`Certificate ${certificateId} downloaded successfully! You can post this on LinkedIn & Instagram stories.`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-dark-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl space-y-4"
        >
          {/* Header */}
          <div className="p-4 bg-dark-850 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>Official Certificate of Completion</span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {/* Visual Certificate Frame */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-dark-950 to-blue-950 border-2 border-amber-500/40 text-center space-y-3 relative overflow-hidden shadow-xl">
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/60" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/60" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/60" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/60" />

              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 mx-auto flex items-center justify-center text-dark-950 shadow-lg shadow-amber-500/30">
                <Award className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[9px] font-bold text-amber-300 uppercase tracking-widest block">
                  Certificate of Mastery
                </span>
                <h3 className="text-xs text-slate-400 mt-0.5">This is proudly presented to</h3>
                <div className="text-xl sm:text-2xl font-black text-white mt-1 underline decoration-amber-400/40">
                  {user.name}
                </div>
              </div>

              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                for successfully completing the comprehensive practical curriculum in
              </p>

              <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/30 font-bold text-xs sm:text-sm text-cyan-300">
                {course.title}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <div>
                  <span className="block font-semibold text-white">{course.instructor.name}</span>
                  <span>Lead Instructor</span>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-cyan-400 font-bold">{certificateId}</span>
                  <span>Issued: {today}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res PDF</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
