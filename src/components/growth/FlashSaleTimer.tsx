import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

export const FlashSaleTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 30, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-orange-50 dark:from-red-950/60 dark:via-dark-850 dark:to-orange-950/60 border border-rose-200 dark:border-red-500/30 flex items-center justify-between gap-2 shadow-sm dark:shadow-lg">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-red-500/20 border border-rose-300 dark:border-red-500/40 flex items-center justify-center text-rose-600 dark:text-red-400 shrink-0">
          <Flame className="w-4 h-4 fill-rose-500 dark:fill-red-400 text-rose-500 dark:text-red-400 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-rose-700 dark:text-red-400 uppercase tracking-wider">
              FLASH SALE • 95% OFF
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-red-400 animate-ping" />
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Special Student Pricing Ends In:</p>
        </div>
      </div>

      <div className="flex items-center gap-1 font-mono text-xs font-extrabold shrink-0">
        <span className="px-2 py-1 rounded-lg bg-white dark:bg-dark-950 border border-rose-300 dark:border-red-500/40 text-rose-700 dark:text-red-300 shadow-xs">
          {formatNum(timeLeft.hours)}h
        </span>
        <span className="text-rose-500 dark:text-red-400 font-bold">:</span>
        <span className="px-2 py-1 rounded-lg bg-white dark:bg-dark-950 border border-rose-300 dark:border-red-500/40 text-rose-700 dark:text-red-300 shadow-xs">
          {formatNum(timeLeft.minutes)}m
        </span>
        <span className="text-rose-500 dark:text-red-400 font-bold">:</span>
        <span className="px-2 py-1 rounded-lg bg-white dark:bg-dark-950 border border-rose-300 dark:border-red-500/40 text-rose-700 dark:text-red-300 shadow-xs">
          {formatNum(timeLeft.seconds)}s
        </span>
      </div>
    </div>
  );
};
