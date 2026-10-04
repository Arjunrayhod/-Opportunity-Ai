import React, { useState } from 'react';
import { Home, TrendingUp, BookOpen, Briefcase, MessageSquare, Sparkles } from 'lucide-react';
import { AIAssistantModal } from '../ai/AIAssistantModal';

interface BottomNavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPath, onNavigate }) => {
  const [isAiOpen, setIsAiOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'HOME', icon: Home },
    { path: '/market', label: 'MARKET', icon: TrendingUp },
    { path: '/courses', label: 'LEARN', icon: BookOpen },
    { path: '/opportunities', label: 'OPPORTUNITIES', icon: Briefcase },
    { path: '/community', label: 'COMMUNITY', icon: MessageSquare },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-slate-200 px-2 py-1.5 sm:py-2 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));

            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] py-1 px-2 rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? 'text-teal-800 font-bold scale-105'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5] text-teal-800' : 'stroke-2 text-slate-500'}`} />
                <span className="text-[9px] sm:text-[10px] tracking-wider mt-0.5">{item.label}</span>
                {isActive && (
                  <span className="w-1 h-1 bg-teal-800 rounded-full mt-0.5 shadow-xs" />
                )}
              </button>
            );
          })}

          {/* Floating AI Assistant Sparkle Button */}
          <button
            onClick={() => setIsAiOpen(true)}
            title="Ask AI Assistant"
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-purple-600 hover:text-purple-700 transition-all duration-200 group active:scale-95"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-teal-500 flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-110 transition">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[9px] font-bold text-purple-700 mt-0.5">AI</span>
          </button>
        </div>
      </nav>

      {/* AI Assistant Modal Trigger */}
      <AIAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};
