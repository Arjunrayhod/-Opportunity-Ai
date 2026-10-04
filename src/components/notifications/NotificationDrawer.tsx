import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCheck, TrendingUp, BookOpen, Briefcase, Info, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'ALL') return true;
    return n.category === filter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'MARKET':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'COURSE':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'OPPORTUNITY':
        return <Briefcase className="w-4 h-4 text-purple-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-dark-900 border-l border-slate-800 h-full flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-dark-850">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Notifications</h3>
                <p className="text-[11px] text-slate-400">Updates, course alerts & market briefs</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                title="Mark all as read"
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition"
              >
                <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px]">Read All</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="p-3 border-b border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar bg-dark-950/60">
            {['ALL', 'COURSE', 'MARKET', 'OPPORTUNITY'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                  filter === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-dark-850 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat === 'ALL' ? 'All Alerts' : cat}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {filteredNotifs.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No notifications in this category.
              </div>
            ) : (
              filteredNotifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.deepLink) {
                      onNavigate(n.deepLink);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer relative ${
                    n.read
                      ? 'bg-dark-950/60 border-slate-800/80 hover:border-slate-700'
                      : 'bg-dark-850 border-blue-500/30 hover:border-blue-500/60 shadow-lg shadow-blue-500/5'
                  }`}
                >
                  {!n.read && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-dark-900 border border-slate-700/80 flex items-center justify-center shrink-0 mt-0.5">
                      {getCategoryIcon(n.category)}
                    </div>
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                          {n.categoryLabel}
                        </span>
                        <span className="text-[10px] text-slate-500">• {n.timestamp}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white mt-1 leading-snug">{n.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                      
                      {n.deepLink && (
                        <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-blue-400">
                          <span>View Detail</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
