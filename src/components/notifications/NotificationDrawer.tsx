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
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'COURSE':
        return <BookOpen className="w-4 h-4 text-teal-600" />;
      case 'OPPORTUNITY':
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                <p className="text-[11px] text-slate-500">Updates, course alerts & market briefs</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                title="Mark all as read"
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 transition"
              >
                <CheckCheck className="w-3.5 h-3.5 text-teal-700" />
                <span className="text-[10px] font-bold">Read All</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="p-3 border-b border-slate-200 flex gap-1.5 overflow-x-auto no-scrollbar bg-slate-50">
            {['ALL', 'COURSE', 'MARKET', 'OPPORTUNITY'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                  filter === cat
                    ? 'bg-[#003539] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Alerts' : cat}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-slate-50">
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
                      ? 'bg-white border-slate-200 hover:border-slate-300'
                      : 'bg-white border-teal-400 shadow-sm'
                  }`}
                >
                  {!n.read && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                      {getCategoryIcon(n.category)}
                    </div>
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                          {n.categoryLabel}
                        </span>
                        <span className="text-[10px] text-slate-400">• {n.timestamp}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">{n.title}</h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      
                      {n.deepLink && (
                        <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-teal-700">
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
