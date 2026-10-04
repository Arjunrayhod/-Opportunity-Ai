import React from 'react';
import { MessageCircle, Users, ArrowRight } from 'lucide-react';

export const VipCommunityBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/80 to-emerald-100/60 border border-emerald-200/90 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
            <MessageCircle className="w-6 h-6 fill-emerald-500 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wide">
                VIP Community
              </span>
              <span className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5 text-emerald-600" /> 12,400+ Members
              </span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mt-1">
              Join Official VIP WhatsApp Broadcast Group
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal">
              Get direct daily freelance gig alerts, CapCut project templates, and stock updates before anyone else.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/?text=Hi%20I%20want%20to%20join%20the%20VIP%20Opportunity%20Community"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 !text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition shrink-0"
        >
          <span className="!text-white font-bold">Join VIP WhatsApp</span>
          <ArrowRight className="w-4 h-4 !text-white" />
        </a>
      </div>
    </div>
  );
};
