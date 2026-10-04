import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface RiskDisclaimerBannerProps {
  compact?: boolean;
}

export const RiskDisclaimerBanner: React.FC<RiskDisclaimerBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
        <span>Educational risk scenarios only. No guaranteed returns. Market investments are subject to risk.</span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-blue-500/10 border border-amber-500/20 relative overflow-hidden my-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
            Mandatory Risk & Educational Disclaimer
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Market analysis, support/resistance targets, and position calculations are generated for <strong>educational and scenario modeling purposes only</strong>. We never promise guaranteed profits. Always consult a SEBI-registered financial advisor before trading.
          </p>
        </div>
      </div>
    </div>
  );
};
