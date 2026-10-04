import React, { useState } from 'react';
import { Sparkles, TrendingUp, ArrowRight, Bookmark, Star, Download, Gift, Award, Zap, Package, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RiskDisclaimerBanner } from '../components/common/RiskDisclaimerBanner';
import { AIAssistantModal } from '../components/ai/AIAssistantModal';
import { FlashSaleTimer } from '../components/growth/FlashSaleTimer';
import { VipCommunityBanner } from '../components/growth/VipCommunityBanner';
import { ReferAndEarnModal } from '../components/growth/ReferAndEarnModal';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user, marketIndices, stocks, courses, opportunities, creatorAssets, toggleWatchlist, toggleSaveOpportunity } = useApp();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);

  const topOpportunity = opportunities[0];
  const primaryStock = stocks[0];

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Flash Sale Countdown Timer */}
      <FlashSaleTimer />

      {/* 2. Hero Greeting & Daily AI Brief */}
      <section className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-teal-50 via-white to-blue-50/60 dark:from-primary-container dark:via-dark-850 dark:to-primary/40 border border-teal-200/80 dark:border-primary/40 shadow-sm dark:shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 dark:bg-primary-fixed/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-teal-800 dark:text-primary-fixed uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-primary-fixed" />
              <span>AI OPPORTUNITY RADAR</span>
            </div>
            {/* Refer & Earn Quick Button */}
            <button
              onClick={() => setIsReferModalOpen(true)}
              className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1 hover:bg-amber-200 dark:hover:bg-amber-500/30 transition active:scale-95 shadow-xs"
            >
              <Gift className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Refer & Earn ₹20</span>
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Good Morning, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Your daily market intelligence & high-value student earning dashboard.
          </p>

          {/* Today's AI Brief Card */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/95 dark:bg-dark-950/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" /> 3 Market Trends
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-1 font-bold text-teal-700 dark:text-cyan-400">
                <Zap className="w-3.5 h-3.5" /> 5 New Gigs
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-1 font-bold text-purple-700 dark:text-purple-400">
                <Star className="w-3.5 h-3.5" /> 2 Pro Assets
              </span>
            </div>
            <button
              onClick={() => setIsAiOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#003539] hover:bg-[#004f55] dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>View AI Brief</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Combo Bundle Deal ("All-in-One Creator Pass") */}
      <section className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50/40 to-yellow-50 dark:from-orange-950/40 dark:via-dark-850 dark:to-amber-950/40 border border-amber-300/80 dark:border-amber-500/40 shadow-sm dark:shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-xs">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase shadow-xs">
                SUPER COMBO 96% OFF
              </span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-1">
              All-in-One Creator & AI Mega Pass
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
              Includes CapCut Mastery + YouTube Automation + 500 Viral SFX Pack!
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200 dark:border-slate-800">
          <div className="text-left sm:text-right">
            <div className="text-xl font-black text-amber-800 dark:text-amber-400">₹249</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 line-through">₹6,999</div>
          </div>
          <button
            onClick={() => onNavigate('/courses')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-xs shadow-md active:scale-95 transition"
          >
            Get Combo Pass
          </button>
        </div>
      </section>

      {/* 4. Market Pulse (NIFTY 50, SENSEX, BANK NIFTY, INDIA VIX) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-wide">
              MARKET PULSE
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/market')}
            className="text-xs font-bold text-teal-700 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Full Market</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {marketIndices.map((idx) => (
            <div
              key={idx.symbol}
              onClick={() => onNavigate('/market')}
              className="p-3.5 rounded-2xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{idx.symbol}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    idx.isPositive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-transparent'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-transparent'
                  }`}
                >
                  {idx.isPositive ? '+' : ''}{idx.changePercent}%
                </span>
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {idx.currentValue.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {idx.isPositive ? '+' : ''}{idx.change} pts
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mandatory Risk Disclaimer */}
      <RiskDisclaimerBanner compact />

      {/* 5. Trending Today Stock Analysis Card */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide flex items-center gap-2">
            <span>TRENDING TODAY</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-500/30">
              AI VERIFIED
            </span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Equities</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-dark-850 border border-slate-800 hover:border-slate-700 transition relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {primaryStock.name}
                </h3>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-800/50">
                  {primaryStock.ticker}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{primaryStock.sector}</p>
            </div>

            <div className="text-right">
              <div className="text-lg sm:text-xl font-black text-white">
                ₹{primaryStock.price.toFixed(2)}
              </div>
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{primaryStock.changePercent}% (+₹{primaryStock.change})</span>
              </div>
            </div>
          </div>

          <div className="mt-3.5 p-3 rounded-2xl bg-dark-950/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-cyan-300 text-[11px] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WHY IS IT TRENDING?</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {primaryStock.whyTrending}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Support: ₹{primaryStock.scenarios.supportLevel}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Potential Upside Target: ₹{primaryStock.scenarios.upsideTarget}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Risk Rating: {primaryStock.riskLevel}
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onNavigate('/market')}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Scenario Analysis</span>
            </button>
            <button
              onClick={() => toggleWatchlist(primaryStock.ticker)}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                user.watchlistTickers.includes(primaryStock.ticker)
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-dark-950 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${user.watchlistTickers.includes(primaryStock.ticker) ? 'fill-cyan-400' : ''}`} />
              <span className="hidden sm:inline">Watchlist</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. VIP WhatsApp Channel Banner */}
      <VipCommunityBanner />

      {/* 7. Student Freelance & Earning Opportunity Card */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
            FEATURED STUDENT GIG
          </h2>
          <button
            onClick={() => onNavigate('/opportunities')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>All Gigs ({opportunities.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-dark-850 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                {topOpportunity.categoryLabel}
              </span>
              <h3 className="font-bold text-sm sm:text-base text-white mt-1.5">
                {topOpportunity.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{topOpportunity.companyOrPlatform}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-extrabold text-emerald-400 block">
                {topOpportunity.payoutRange}
              </span>
              <span className="text-[10px] text-slate-400">{topOpportunity.timeRequired}</span>
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800 text-[11px] text-slate-300">
            <span className="text-cyan-400 font-semibold">Why it fits you: </span>
            {topOpportunity.whyMatchesYou}
          </div>

          <div className="mt-3.5 flex gap-2">
            <button
              onClick={() => onNavigate('/opportunities')}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <span>Explore Opportunity</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => toggleSaveOpportunity(topOpportunity.id)}
              className={`p-2.5 rounded-xl border text-xs transition ${
                user.savedOpportunityIds.includes(topOpportunity.id)
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                  : 'bg-dark-950 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${user.savedOpportunityIds.includes(topOpportunity.id) ? 'fill-purple-400' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* 8. Hot Affordable Courses */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-wide">
              HOT AFFORDABLE COURSES
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">High-demand creator skills at 90% lower price</p>
          </div>
          <button
            onClick={() => onNavigate('/courses')}
            className="text-xs font-bold text-teal-700 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>All Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {courses.slice(0, 2).map((course) => (
            <div
              key={course.id}
              onClick={() => onNavigate(`/courses/${course.id}`)}
              className="rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-teal-500/40 transition cursor-pointer flex flex-col justify-between group shadow-xs"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-teal-600 text-white shadow">
                  {course.categoryLabel}
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-400 text-slate-950 uppercase shadow">
                  95% OFF
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {course.rating}
                    </span>
                    <span>•</span>
                    <span>{course.lessonsCount} Video Lessons</span>
                    <span>•</span>
                    <span>{course.durationHours} hrs</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-cyan-300 transition line-clamp-2">
                    {course.title}
                  </h3>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-teal-800 dark:text-cyan-400">₹{course.price}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 line-through">₹{course.originalPrice}</span>
                    </div>
                  </div>
                  <button className="px-3.5 py-1.5 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white text-xs font-bold transition shadow-xs">
                    View Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Creator Asset Vault */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide flex items-center gap-2">
            <span>PRO CREATOR VAULT</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              FREE
            </span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Download Vault</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {creatorAssets.map((asset) => (
            <div
              key={asset.id}
              className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  {asset.categoryLabel}
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-2">{asset.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{asset.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{asset.fileSize}</span>
                <a
                  href={asset.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white text-[11px] font-bold flex items-center gap-1 transition"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Refer & Earn Modal */}
      <ReferAndEarnModal
        isOpen={isReferModalOpen}
        onClose={() => setIsReferModalOpen(false)}
      />

      {/* AI Assistant Drawer Trigger */}
      <AIAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
