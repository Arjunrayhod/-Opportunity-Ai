import React, { useState } from 'react';
import { Bell, Flame, ShieldAlert, Sparkles, Shield, User, Settings, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { AIAssistantModal } from '../ai/AIAssistantModal';

interface AppHeaderProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onNavigate, currentPath }) => {
  const { user, unreadNotifsCount, switchRole } = useApp();
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-dark-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
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
                className="w-9 h-9 rounded-full object-cover border border-cyan-400/40 group-hover:border-cyan-400 transition"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-dark-950 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition">
                  {user.name.split(' ')[0]}
                </span>
                {user.role === 'SUPER_ADMIN' && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-purple-500/30 text-purple-300 border border-purple-500/40">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">Opportunity Dashboard</p>
            </div>
          </div>

          {/* Center / Right: Streak Badge, AI Button, Admin Mode & Bell */}
          <div className="flex items-center gap-2">
            {/* 7-Day Streak Badge */}
            <div 
              title="7-Day Learning & Opportunity Streak!" 
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold cursor-default"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
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
              className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition ${
                user.role === 'SUPER_ADMIN'
                  ? 'bg-purple-600/30 border border-purple-400/50 text-purple-200'
                  : 'bg-dark-850 hover:bg-slate-800 border border-slate-700 text-slate-300'
              }`}
            >
              <Shield className="w-3 h-3 text-purple-400" />
              <span className="text-[10px] hidden sm:inline">
                {user.role === 'SUPER_ADMIN' ? 'Admin Mode' : 'Admin CMS'}
              </span>
            </button>

            {/* Notification Bell with Badge */}
            <button
              onClick={() => setIsNotifsOpen(true)}
              className="relative w-9 h-9 rounded-full bg-dark-850 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
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
