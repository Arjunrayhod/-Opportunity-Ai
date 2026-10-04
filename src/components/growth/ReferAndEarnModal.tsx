import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Copy, CheckCircle2, Share2, Sparkles, Users, Award, ShieldCheck, MessageCircle, Wallet, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ReferAndEarnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferAndEarnModal: React.FC<ReferAndEarnModalProps> = ({ isOpen, onClose }) => {
  const { user, addReferralReward } = useApp();
  const [copied, setCopied] = useState(false);
  const [claimToast, setClaimToast] = useState(false);

  if (!isOpen) return null;

  const referralLink = `https://opportunityai.app/join?ref=${user.referralCode}`;
  const shareText = `🔥 Hey! Download Opportunity AI App & Learn CapCut Video Editing, YouTube Growth & AI Freelancing for just ₹99!\n\nUse my Referral Invite Code: *${user.referralCode}* to get 50 Free Bonus Coins!\n👉 Download Link: ${referralLink}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleSimulateReward = () => {
    addReferralReward(50);
    setClaimToast(true);
    setTimeout(() => setClaimToast(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl my-auto text-slate-900"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-5 text-white flex items-center justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Refer & Earn ₹50 / Friend</h3>
                <p className="text-xs text-amber-100">Unlock Any Course 100% FREE with Wallet</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white relative z-10"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Live Wallet Balance & Stats Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Your Referral Wallet Balance
                  </span>
                  <div className="text-2xl font-black text-emerald-800">₹{user.walletBalance}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Friends Joined
                  </span>
                  <div className="text-2xl font-black text-teal-800">{user.referralsCount}</div>
                </div>
              </div>

              {/* Reward Explanation */}
              <div className="pt-2 border-t border-emerald-200 text-xs text-slate-600 space-y-1">
                <p className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Har 1 friend ke download par aapko ₹50 milte hain!
                </p>
                <p className="text-[11px] text-slate-500">
                  Wallet me ₹99 hote hi aap koi bhi premium course bina paise diye <strong>100% Free</strong> unlock kar sakte hain.
                </p>
              </div>
            </div>

            {/* Unique Invite Code Box */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Your Unique Invite Code:
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-2 pl-3.5">
                <span className="font-mono font-black text-sm text-teal-800 flex-1">
                  {user.referralCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white text-xs font-bold flex items-center gap-1 transition"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Share Invite on WhatsApp & Earn ₹50</span>
            </button>

            {/* Simulate / Test Reward Button */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleSimulateReward}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Gift className="w-4 h-4 text-amber-600" />
                <span>Simulate Friend Download (+₹50 Test Reward)</span>
              </button>

              {claimToast && (
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold text-center mt-2 flex items-center justify-center gap-1 animate-bounce">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>₹50 successfully credited to your wallet!</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
