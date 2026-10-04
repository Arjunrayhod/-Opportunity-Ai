import React from 'react';
import { MessageCircle, Users, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const VipCommunityBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/60 via-dark-850 to-teal-950/50 border border-emerald-500/30 p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <MessageCircle className="w-6 h-6 fill-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                VIP Community
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-400" /> 12,400+ Members
              </span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-white mt-1">
              Join Official VIP WhatsApp Broadcast Group
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Get direct daily freelance gig alerts, CapCut project templates, and stock updates before anyone else.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/?text=Hi%20I%20want%20to%20join%20the%20VIP%20Opportunity%20Community"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition shrink-0"
        >
          <span>Join VIP WhatsApp</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
