import React from 'react';
import { User, Flame, BookOpen, Bookmark, Shield, Award, Settings, Bell, Phone, Mail, CheckCircle2, LogOut, ChevronRight, SunMedium, KeyRound, UserCheck, Wallet, Gift, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ProfilePageProps {
  onNavigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, courses, setIsAuthModalOpen, logoutUser, setIsReferModalOpen, addReferralReward } = useApp();
  const enrolledCourses = courses.filter((c) => user.enrolledCourseIds.includes(c.id));

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Card Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-teal-500/50 shadow-xs"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 truncate">{user.name}</h1>
              {user.role === 'SUPER_ADMIN' ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-700 border border-purple-300">
                  SUPER ADMIN
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  {user.role}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {user.email}
            </p>
            {user.phone && (
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {user.phone}
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
          <div className="p-2.5 rounded-2xl bg-amber-50/50 border border-amber-200 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-600 font-extrabold text-sm">
              <Flame className="w-3.5 h-3.5 fill-amber-500" /> {user.streakDays} Days
            </div>
            <span className="text-[10px] text-slate-600 font-medium">Learning Streak</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-teal-50/50 border border-teal-200 text-center">
            <div className="text-sm font-extrabold text-teal-700">
              {user.enrolledCourseIds.length}
            </div>
            <span className="text-[10px] text-slate-600 font-medium">Enrolled Courses</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-purple-50/50 border border-purple-200 text-center">
            <div className="text-sm font-extrabold text-purple-700">
              {user.savedOpportunityIds.length}
            </div>
            <span className="text-[10px] text-slate-600 font-medium">Saved Gigs</span>
          </div>
        </div>
      </div>

      {/* Referral Wallet Balance & Free Course Unlock Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-100/50 border border-emerald-200 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  Referral Wallet
                </span>
                <span className="text-xs text-slate-500 font-medium">• {user.referralsCount} Friends Joined</span>
              </div>
              <div className="text-2xl font-black text-emerald-900 mt-0.5">
                ₹{user.walletBalance || 0}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsReferModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition active:scale-95 shrink-0 flex items-center gap-1.5"
          >
            <Gift className="w-4 h-4 text-amber-200" />
            <span>Refer & Earn (+₹50)</span>
          </button>
        </div>

        <div className="p-3 bg-white/80 rounded-2xl border border-emerald-200/80 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Apne wallet ke paise se 100% Free Course Buy karein!
          </p>
          <p className="text-[11px] text-slate-500">
            Jaise hi aapke wallet me course price (₹99) ke barabar paise honge, aap <strong>1-Click me Course Unlock</strong> kar sakte hain.
          </p>
        </div>
      </div>

      {/* Admin Panel Quick Access */}
      <div className="p-4 rounded-3xl bg-purple-50 border border-purple-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Admin Management CMS</h3>
            <p className="text-[11px] text-slate-500">Manage courses, upload 30GB+ videos, sales CRM & notifications</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('/admin')}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition shrink-0"
        >
          Open CMS
        </button>
      </div>

      {/* My Enrolled Courses */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span>My Enrolled Courses ({enrolledCourses.length})</span>
        </h2>

        {enrolledCourses.length === 0 ? (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            You haven't enrolled in any courses yet.
          </div>
        ) : (
          enrolledCourses.map((c) => (
            <div
              key={c.id}
              onClick={() => onNavigate(`/courses/${c.id}`)}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 transition cursor-pointer flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{c.title}</h4>
                  <p className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Lifetime Access Active
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))
        )}
      </div>

      {/* App Display Mode Banner */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <SunMedium className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">App Display Mode</h3>
            <p className="text-[11px] text-slate-500">100% Crisp Light Mode (Fine-tuned for readability and focus)</p>
          </div>
        </div>
      </div>

      {/* User Interests Tags */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-2">
        <h3 className="text-xs font-bold text-slate-900">Your Selected Interests</h3>
        <div className="flex flex-wrap gap-1.5">
          {user.interests.map((interest, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs text-teal-800 font-medium"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Account Authentication & Logout Actions */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-teal-600" />
          Account & Authentication
        </h3>
        <p className="text-xs text-slate-500">
          Manage your account access, sign in with your phone or email, or log out safely.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 font-bold text-xs transition active:scale-98"
          >
            <KeyRound className="w-4 h-4 text-teal-600" />
            Sign In / Register Account
          </button>

          <button
            onClick={() => logoutUser()}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs transition active:scale-98"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            Log Out of Account
          </button>
        </div>
      </div>
    </div>
  );
};
