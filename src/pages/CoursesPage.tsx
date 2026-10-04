import React, { useState } from 'react';
import { Search, Star, Play, BookOpen, CheckCircle2, Flame, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CoursesPageProps {
  onNavigate: (path: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onNavigate }) => {
  const { courses, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: `All (${courses.length})` },
    { id: 'YOUTUBE_GROWTH', label: '🚀 YouTube Growth' },
    { id: 'MARKETING_BIZ', label: '📈 Digital Marketing & Agency' },
    { id: 'AI_EARNING', label: '🤖 AI Tools & Agents' },
    { id: 'VIDEO_EDITING', label: '🎬 Video Editing' },
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
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300 uppercase">
            Affordable Academy
          </span>
          <span className="text-xs text-slate-500">90% Below Market Price</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Master In-Demand Creator & AI Skills
        </h1>
        <p className="text-xs text-slate-600 mt-1">
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
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 shadow-2xs"
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
                ? 'bg-[#003539] !text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <span className={selectedCategory === cat.id ? '!text-white' : ''}>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* 1. Continue Learning Section (Enrolled Courses) */}
      {enrolledCourses.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Continue Learning</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {enrolledCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigate(`/courses/${c.id}`)}
                className="p-3.5 rounded-2xl bg-white border border-teal-200 hover:border-teal-500 transition cursor-pointer flex items-center gap-3 shadow-xs"
              >
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-teal-800 uppercase">{c.categoryLabel}</span>
                  <h3 className="font-bold text-xs text-slate-900 truncate">{c.title}</h3>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-2/5 h-full bg-teal-600 rounded-full" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">40%</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 fill-teal-700" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. All Courses Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">
            Available Courses ({filteredCourses.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Instant Lifetime Access</span>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="py-12 text-center rounded-3xl bg-white border border-slate-200 p-6 shadow-xs">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="font-bold text-slate-900 text-sm">No Courses Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching for a different keyword or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => {
              const isEnrolled = user.enrolledCourseIds.includes(course.id);
              return (
                <div
                  key={course.id}
                  onClick={() => onNavigate(`/courses/${course.id}`)}
                  className="rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-teal-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-xs"
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
                    
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-teal-600 !text-white shadow-md">
                      {course.categoryLabel}
                    </span>

                    {isEnrolled ? (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-400 text-slate-950 flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-3 h-3 stroke-[2.5]" /> ENROLLED
                      </span>
                    ) : (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-400 text-slate-950 uppercase shadow-md">
                        95% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5 font-medium">
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {course.rating}
                        </span>
                        <span>•</span>
                        <span>{course.lessonsCount} Lessons</span>
                        <span>•</span>
                        <span>{course.durationHours} hrs</span>
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-800 transition line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">{course.subtitle}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        {isEnrolled ? (
                          <span className="text-xs font-black text-emerald-700">Unlocked Lifetime Access</span>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-teal-800">₹{course.price}</span>
                            <span className="text-xs text-slate-400 line-through">₹{course.originalPrice}</span>
                          </div>
                        )}
                      </div>
                      <button className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                        isEnrolled
                          ? 'bg-emerald-600 hover:bg-emerald-700 !text-white'
                          : 'bg-[#003539] hover:bg-[#004f55] !text-white'
                      }`}>
                        <span className="!text-white">{isEnrolled ? 'Continue' : 'View Course'}</span>
                      </button>
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
