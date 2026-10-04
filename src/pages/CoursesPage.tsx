import React, { useState } from 'react';
import { Search, Star, Play, Clock, BookOpen, Filter, CheckCircle2, Flame, Award, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CourseCategory } from '../types';

interface CoursesPageProps {
  onNavigate: (path: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onNavigate }) => {
  const { courses, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Courses' },
    { id: 'VIDEO_EDITING', label: '🎬 CapCut & Video Editing' },
    { id: 'YOUTUBE_GROWTH', label: '🚀 YouTube Automation' },
    { id: 'AI_EARNING', label: '🤖 Make Money with AI' },
    { id: 'TRADING_FINANCE', label: '📈 Trading & Crypto' },
    { id: 'CYBERSECURITY', label: '🛡️ Social Media Security' },
    { id: 'FITNESS_HEALTH', label: '💪 Gym & Supplements' },
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const enrolledCourses = courses.filter((c) => user.enrolledCourseIds.includes(c.id));

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/30 uppercase">
            Affordable Academy
          </span>
          <span className="text-xs text-slate-400">90% Below Market Price</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Master In-Demand Creator & AI Skills
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Learn high-paying freelancing, video editing, and digital growth without expensive institute fees.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search CapCut, YouTube growth, AI freelancing, Trading..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-dark-850 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner"
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
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-dark-850 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 1. Continue Learning Section (Enrolled Courses) */}
      {enrolledCourses.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Continue Learning</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {enrolledCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigate(`/courses/${c.id}`)}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-dark-850 to-blue-950/40 border border-blue-500/30 hover:border-cyan-400 transition cursor-pointer flex items-center gap-3"
              >
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">{c.categoryLabel}</span>
                  <h3 className="font-bold text-xs text-white truncate">{c.title}</h3>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-dark-950 rounded-full overflow-hidden">
                      <div className="w-2/5 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                    </div>
                    <span className="text-[10px] text-slate-400">40%</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 fill-cyan-400" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. All Courses Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-white">
            Available Courses ({filteredCourses.length})
          </h2>
          <span className="text-xs text-slate-400">Instant Lifetime Access</span>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="py-12 text-center rounded-3xl bg-dark-850 border border-slate-800 p-6">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h3 className="font-bold text-white text-sm">No Courses Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try searching for a different keyword or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => {
              const isEnrolled = user.enrolledCourseIds.includes(course.id);
              return (
                <div
                  key={course.id}
                  onClick={() => onNavigate(`/courses/${course.id}`)}
                  className="rounded-3xl bg-dark-850 border border-slate-800 overflow-hidden hover:border-slate-700 transition cursor-pointer flex flex-col justify-between group shadow-lg"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
                    
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-600 text-white shadow">
                      {course.categoryLabel}
                    </span>

                    {isEnrolled ? (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/90 text-dark-950 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ENROLLED
                      </span>
                    ) : (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500 text-dark-950 uppercase">
                        95% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                        <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {course.rating}
                        </span>
                        <span>•</span>
                        <span>{course.lessonsCount} Lessons</span>
                        <span>•</span>
                        <span>{course.durationHours} hrs</span>
                      </div>
                      <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{course.subtitle}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        {isEnrolled ? (
                          <span className="text-xs font-bold text-emerald-400">Unlocked Access</span>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-cyan-400">₹{course.price}</span>
                            <span className="text-xs text-slate-500 line-through">₹{course.originalPrice}</span>
                          </div>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                        isEnrolled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-600/30 border border-blue-500/40 text-blue-300 group-hover:bg-blue-600 group-hover:text-white'
                      }`}>
                        {isEnrolled ? 'Continue' : 'View Course'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
