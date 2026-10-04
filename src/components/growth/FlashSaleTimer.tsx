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
    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-orange-50 border border-rose-200 flex items-center justify-between gap-2 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
          <Flame className="w-4 h-4 fill-rose-500 text-rose-600 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider">
              FLASH SALE • 95% OFF
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <p className="text-xs font-bold text-slate-900 leading-tight">Special Student Pricing Ends In:</p>
        </div>
      </div>

      <div className="flex items-center gap-1 font-sans text-xs font-bold shrink-0">
        <span className="px-2 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 shadow-2xs">
          {formatNum(timeLeft.hours)}h
        </span>
        <span className="text-rose-400 font-bold">:</span>
        <span className="px-2 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 shadow-2xs">
          {formatNum(timeLeft.minutes)}m
        </span>
        <span className="text-rose-400 font-bold">:</span>
        <span className="px-2 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 shadow-2xs">
          {formatNum(timeLeft.seconds)}s
        </span>
      </div>
    </div>
  );
};
