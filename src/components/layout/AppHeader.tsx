import React, { useState } from 'react';
import { Bell, Flame, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { AIAssistantModal } from '../ai/AIAssistantModal';

interface AppHeaderProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onNavigate }) => {
  const { user, unreadNotifsCount, switchRole } = useApp();
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: User Profile & Greeting */}
          <div 
            onClick={() => onNavigate('/profile')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-300 group-hover:border-teal-600 transition"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition">
                  {user.name.split(' ')[0]}
                </span>
                {user.role === 'SUPER_ADMIN' && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-100 text-purple-700 border border-purple-300">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500">Opportunity Dashboard</p>
            </div>
          </div>

          {/* Center / Right: Streak Badge, Admin Mode & Bell */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 7-Day Streak Badge */}
            <div 
              title="7-Day Learning & Opportunity Streak!" 
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-700 text-xs font-bold cursor-default"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{user.streakDays}d</span>
            </div>

            {/* Quick Role Switcher Button (For Instant Admin Testing) */}
            <button
              onClick={() => {
                if (user.role === 'SUPER_ADMIN') {
                  switchRole('USER');
                  onNavigate('/');
                } else {
                  switchRole('SUPER_ADMIN');
                  onNavigate('/admin');
                }
              }}
              title={user.role === 'SUPER_ADMIN' ? 'Switch to Student View' : 'Switch to Super Admin CMS'}
              className={`px-2.5 py-1.5 min-h-[36px] rounded-full text-xs font-bold flex items-center gap-1 transition ${
                user.role === 'SUPER_ADMIN'
                  ? 'bg-purple-100 border border-purple-300 text-purple-800'
                  : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700'
              }`}
            >
              <Shield className="w-3 h-3 text-purple-600" />
              <span className="text-[10px] hidden sm:inline">
                {user.role === 'SUPER_ADMIN' ? 'Admin Mode' : 'Admin CMS'}
              </span>
            </button>

            {/* Notification Bell with Badge */}
            <button
              onClick={() => setIsNotifsOpen(true)}
              className="relative min-w-[40px] min-h-[40px] w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 hover:text-slate-900 transition"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifsOpen}
        onClose={() => setIsNotifsOpen(false)}
        onNavigate={onNavigate}
      />

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};
