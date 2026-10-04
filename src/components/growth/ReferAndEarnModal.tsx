import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Copy, CheckCircle2, Share2, Sparkles, Users, Award, ShieldCheck, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ReferAndEarnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferAndEarnModal: React.FC<ReferAndEarnModalProps> = ({ isOpen, onClose }) => {
  const { user } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const referralLink = `https://opportunityai.app/join?ref=${user.referralCode}`;
  const shareText = `🔥 Hey! Join Opportunity AI and get CapCut Video Editing, YouTube Growth & AI Freelancing Courses for just ₹99! Use my invite code: *${user.referralCode}*\n👉 ${referralLink}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-dark-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl space-y-4"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-5 text-white flex items-center justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Refer & Earn ₹20 / Friend</h3>
                <p className="text-xs text-amber-100">Or Unlock Any Course 100% FREE</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white relative z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Wallet & Progress Card */}
            <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Referral Wallet</span>
                  <div className="text-2xl font-black text-emerald-400">₹{user.walletBalance}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Friends Joined</span>
                  <div className="text-2xl font-black text-cyan-400">{user.referralsCount}</div>
                </div>
              </div>

              {/* Free Course Milestone Progress Bar */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Free Course Milestone</span>
                  <span className="text-amber-400 font-bold">{user.referralsCount}/3 Friends</span>
                </div>
                <div className="w-full h-2 bg-dark-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (user.referralsCount / 3) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  3 successful invites = 1 Full Course Free!
                </span>
              </div>
            </div>

            {/* Referral Code Box */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Your Unique Invite Code:
              </label>
              <div className="flex items-center gap-2 bg-dark-950 border border-slate-700 rounded-2xl p-2 pl-3.5">
                <span className="font-mono font-black text-sm text-cyan-400 flex-1">
                  {user.referralCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Share on WhatsApp & Earn ₹20</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
