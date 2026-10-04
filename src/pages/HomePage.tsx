import React, { useState } from 'react';
import { Sparkles, TrendingUp, ArrowRight, Bookmark, Star, Download, Gift, Zap, Package, ShieldCheck } from 'lucide-react';
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
      <section className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-teal-50 via-white to-blue-50/60 border border-teal-200/80 shadow-xs">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-teal-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>AI OPPORTUNITY RADAR</span>
            </div>
            {/* Refer & Earn Quick Button */}
            <button
              onClick={() => setIsReferModalOpen(true)}
              className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[11px] font-bold flex items-center gap-1 hover:bg-amber-200 transition active:scale-95 shadow-2xs"
            >
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>Refer & Earn ₹20</span>
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Good Morning, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Your daily market intelligence & high-value student earning dashboard.
          </p>

          {/* Today's AI Brief Card */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white border border-slate-200 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 text-xs text-slate-700">
              <span className="flex items-center gap-1 font-bold text-emerald-700">
                <TrendingUp className="w-3.5 h-3.5" /> 3 Market Trends
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 font-bold text-teal-800">
                <Zap className="w-3.5 h-3.5" /> 5 New Gigs
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 font-bold text-purple-800">
                <Star className="w-3.5 h-3.5" /> 2 Pro Assets
              </span>
            </div>
            <button
              onClick={() => setIsAiOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#003539] hover:bg-[#004f55] !text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <Sparkles className="w-3.5 h-3.5 !text-white" />
              <span className="!text-white">View AI Brief</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Combo Bundle Deal ("All-in-One Creator Pass") */}
      <section className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50/40 to-yellow-50 border border-amber-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase shadow-2xs">
                SUPER COMBO 96% OFF
              </span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mt-1">
              All-in-One Creator & AI Mega Pass
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Includes CapCut Mastery + YouTube Automation + 500 Viral SFX Pack!
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200">
          <div className="text-left sm:text-right">
            <div className="text-xl font-black text-amber-800">₹249</div>
            <div className="text-[10px] text-slate-400 line-through">₹6,999</div>
          </div>
          <button
            onClick={() => onNavigate('/courses')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 !text-white font-black text-xs shadow-sm active:scale-95 transition"
          >
            <span className="!text-white">Get Combo Pass</span>
          </button>
        </div>
      </section>

      {/* 4. Market Pulse (NIFTY 50, SENSEX, BANK NIFTY, INDIA VIX) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-wide">
              MARKET PULSE
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/market')}
            className="text-xs font-bold text-teal-800 hover:underline flex items-center gap-1"
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
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-600">{idx.symbol}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    idx.isPositive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {idx.isPositive ? '+' : ''}{idx.changePercent}%
                </span>
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900">
                {idx.currentValue.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
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
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-wide flex items-center gap-2">
            <span>TRENDING TODAY</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
              AI VERIFIED
            </span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Equities</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition relative overflow-hidden shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  {primaryStock.name}
                </h3>
                <span className="text-xs font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200 font-bold">
                  {primaryStock.ticker}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{primaryStock.sector}</p>
            </div>

            <div className="text-right">
              <div className="text-lg sm:text-xl font-black text-slate-900">
                ₹{primaryStock.price.toFixed(2)}
              </div>
              <div className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{primaryStock.changePercent}% (+₹{primaryStock.change})</span>
              </div>
            </div>
          </div>

          <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-teal-800 text-[11px] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WHY IS IT TRENDING?</span>
            </div>
            <p className="text-slate-700 text-xs leading-relaxed">
              {primaryStock.whyTrending}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                Support: ₹{primaryStock.scenarios.supportLevel}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                Upside Target: ₹{primaryStock.scenarios.upsideTarget}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                Risk Rating: {primaryStock.riskLevel}
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onNavigate('/market')}
              className="flex-1 py-2.5 rounded-xl bg-[#003539] hover:bg-[#004f55] !text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 !text-white" />
              <span className="!text-white">AI Scenario Analysis</span>
            </button>
            <button
              onClick={() => toggleWatchlist(primaryStock.ticker)}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                user.watchlistTickers.includes(primaryStock.ticker)
                  ? 'bg-teal-50 border-teal-500 text-teal-800'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${user.watchlistTickers.includes(primaryStock.ticker) ? 'fill-teal-700 text-teal-700' : ''}`} />
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
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-wide">
            FEATURED STUDENT GIG
          </h2>
          <button
            onClick={() => onNavigate('/opportunities')}
            className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1"
          >
            <span>All Gigs ({opportunities.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-xs">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 border border-purple-200 uppercase">
                {topOpportunity.categoryLabel}
              </span>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1.5">
                {topOpportunity.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{topOpportunity.companyOrPlatform}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-extrabold text-emerald-700 block">
                {topOpportunity.payoutRange}
              </span>
              <span className="text-[10px] text-slate-500">{topOpportunity.timeRequired}</span>
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
            <span className="text-teal-800 font-bold">Why it fits you: </span>
            {topOpportunity.whyMatchesYou}
          </div>

          <div className="mt-3.5 flex gap-2">
            <button
              onClick={() => onNavigate('/opportunities')}
              className="flex-1 py-2.5 rounded-xl bg-[#003539] hover:bg-[#004f55] !text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <span className="!text-white">Explore Opportunity</span>
              <ArrowRight className="w-3.5 h-3.5 !text-white" />
            </button>
            <button
              onClick={() => toggleSaveOpportunity(topOpportunity.id)}
              className={`p-2.5 rounded-xl border text-xs transition ${
                user.savedOpportunityIds.includes(topOpportunity.id)
                  ? 'bg-purple-100 border-purple-400 text-purple-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${user.savedOpportunityIds.includes(topOpportunity.id) ? 'fill-purple-600 text-purple-600' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* 8. Hot Affordable Courses */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-wide">
              HOT AFFORDABLE COURSES
            </h2>
            <p className="text-[11px] text-slate-500">High-demand creator skills at 90% lower price</p>
          </div>
          <button
            onClick={() => onNavigate('/courses')}
            className="text-xs font-bold text-teal-800 hover:underline flex items-center gap-1"
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
              className="rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-teal-500/40 transition cursor-pointer flex flex-col justify-between group shadow-xs"
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
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-teal-600 !text-white shadow">
                  {course.categoryLabel}
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-400 text-slate-950 uppercase shadow">
                  95% OFF
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5 font-medium">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {course.rating}
                    </span>
                    <span>•</span>
                    <span>{course.lessonsCount} Video Lessons</span>
                    <span>•</span>
                    <span>{course.durationHours} hrs</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-800 transition line-clamp-2">
                    {course.title}
                  </h3>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-teal-800">₹{course.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{course.originalPrice}</span>
                    </div>
                  </div>
                  <button className="px-3.5 py-1.5 rounded-xl bg-[#003539] hover:bg-[#004f55] !text-white text-xs font-bold transition shadow-xs">
                    View Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Creator Asset Vault (Image 3 fix) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-wide flex items-center gap-2">
            <span>PRO CREATOR VAULT</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              FREE
            </span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Download Vault</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {creatorAssets.map((asset) => (
            <div
              key={asset.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500/40 transition flex flex-col justify-between shadow-xs"
            >
              <div>
                <span className="text-[9px] font-bold text-teal-700 uppercase tracking-wider block mb-1">
                  {asset.categoryLabel}
                </span>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{asset.title}</h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">{asset.description}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium">{asset.fileSize}</span>
                <a
                  href={asset.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-700 text-teal-800 hover:!text-white border border-teal-200 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs group"
                >
                  <Download className="w-3.5 h-3.5 text-teal-700 group-hover:!text-white" />
                  <span className="font-bold">Download</span>
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
