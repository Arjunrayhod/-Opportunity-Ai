import React from 'react';
import { User, Flame, BookOpen, Bookmark, Shield, Award, Settings, Bell, Phone, Mail, CheckCircle2, LogOut, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ProfilePageProps {
  onNavigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, courses, switchRole } = useApp();
  const enrolledCourses = courses.filter((c) => user.enrolledCourseIds.includes(c.id));

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Card Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-dark-850 via-slate-900 to-blue-950/40 border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white">{user.name}</h1>
              {user.role === 'SUPER_ADMIN' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/30 text-purple-300 border border-purple-500/40">
                  SUPER ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" /> {user.email}
            </p>
            {user.phone && (
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" /> {user.phone}
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800">
          <div className="p-2.5 rounded-2xl bg-dark-950/80 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 font-extrabold text-sm">
              <Flame className="w-3.5 h-3.5 fill-amber-400" /> {user.streakDays} Days
            </div>
            <span className="text-[10px] text-slate-400">Learning Streak</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-dark-950/80 border border-slate-800 text-center">
            <div className="text-sm font-extrabold text-cyan-400">
              {user.enrolledCourseIds.length}
            </div>
            <span className="text-[10px] text-slate-400">Enrolled Courses</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-dark-950/80 border border-slate-800 text-center">
            <div className="text-sm font-extrabold text-purple-400">
              {user.savedOpportunityIds.length}
            </div>
            <span className="text-[10px] text-slate-400">Saved Gigs</span>
          </div>
        </div>
      </div>

      {/* Admin Panel Quick Access */}
      <div className="p-4 rounded-3xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Admin Management CMS</h3>
            <p className="text-[11px] text-slate-400">Manage courses, upload 30GB+ videos, sales CRM & notifications</p>
          </div>
        </div>
        <button
          onClick={() => {
            switchRole('SUPER_ADMIN');
            onNavigate('/admin');
          }}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition"
        >
          Open CMS
        </button>
      </div>

      {/* My Enrolled Courses */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>My Enrolled Courses ({enrolledCourses.length})</span>
        </h2>

        {enrolledCourses.length === 0 ? (
          <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 text-center text-xs text-slate-400">
            You haven't enrolled in any courses yet.
          </div>
        ) : (
          enrolledCourses.map((c) => (
            <div
              key={c.id}
              onClick={() => onNavigate(`/courses/${c.id}`)}
              className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800 hover:border-cyan-400 transition cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-white truncate">{c.title}</h4>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Lifetime Access Active
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          ))
        )}
      </div>

      {/* User Interests Tags */}
      <div className="p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-2">
        <h3 className="text-xs font-bold text-white">Your Selected Interests</h3>
        <div className="flex flex-wrap gap-1.5">
          {user.interests.map((interest, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl bg-dark-950 border border-slate-700 text-xs text-cyan-300 font-medium"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
