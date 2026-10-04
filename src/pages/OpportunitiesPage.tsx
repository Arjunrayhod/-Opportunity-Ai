import React, { useState } from 'react';
import { Briefcase, Search, Bookmark, ExternalLink, ShieldCheck, Clock, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OpportunitiesPage: React.FC = () => {
  const { opportunities, user, toggleSaveOpportunity } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'ALL', label: 'All Opportunities' },
    { id: 'FREELANCING', label: '💼 Freelance Gigs' },
    { id: 'INTERNSHIPS', label: '🎓 Internships' },
    { id: 'AI_GIGS', label: '🤖 AI Micro-Gigs' },
    { id: 'CONTENT_CREATION', label: '🎬 Creator Roles' },
  ];

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesCategory = selectedCategory === 'ALL' || opp.category === selectedCategory;
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.companyOrPlatform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
            Student Opportunity Radar
          </span>
          <span className="text-xs text-slate-400">Verified Remote & Freelance Roles</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Discover Student Earning Gigs
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Direct gigs and paid internships tailored for college students, video editors, and AI creators.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search gigs by title, skill (CapCut, SEO, Research)..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-dark-850 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-dark-850 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.map((opp) => {
          const isSaved = user.savedOpportunityIds.includes(opp.id);
          return (
            <div
              key={opp.id}
              className="p-4 sm:p-5 rounded-3xl bg-dark-850 border border-slate-800 hover:border-slate-700 transition space-y-3.5 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                      {opp.categoryLabel}
                    </span>
                    {opp.verified && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white mt-1.5 leading-snug">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{opp.companyOrPlatform}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-sm font-black text-emerald-400">
                    {opp.payoutRange}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{opp.timeRequired}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {opp.description}
              </p>

              {/* Match Reason Pill */}
              <div className="p-2.5 rounded-xl bg-dark-950/80 border border-slate-800 text-[11px] text-slate-300">
                <span className="text-cyan-400 font-semibold">Why this matches you: </span>
                {opp.whyMatchesYou}
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5">
                {opp.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg bg-dark-900 border border-slate-700/60 text-[10px] text-slate-300 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="text-[10px] text-slate-400">
                  Difficulty: <span className="text-white font-semibold">{opp.difficulty}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSaveOpportunity(opp.id)}
                    className={`p-2.5 rounded-xl border text-xs transition ${
                      isSaved
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                        : 'bg-dark-950 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-400' : ''}`} />
                  </button>

                  <a
                    href={opp.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition"
                  >
                    <span>Apply / Connect</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
