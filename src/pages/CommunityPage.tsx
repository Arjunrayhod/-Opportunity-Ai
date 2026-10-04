import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Heart, Users, Sparkles, Flame, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CommunityPage: React.FC = () => {
  const { communityMessages, sendCommunityMessage, likeCommunityMessage, activeChannel, setActiveChannel, user } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels = [
    { id: 'general', name: '💬 General Student Lounge', members: 4850 },
    { id: 'video', name: '🎬 Video Creators & CapCut Club', members: 3200 },
    { id: 'trading', name: '📈 Trading & Market Insights', members: 2900 },
    { id: 'ai', name: '🤖 AI Freelance Hustlers', members: 3750 },
    { id: 'fitness', name: '💪 Fitness & Gym Circle', members: 1800 },
  ];

  const currentChannelMessages = communityMessages.filter(
    (m) => m.channelId === activeChannel || (!m.channelId && activeChannel === 'general')
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChannelMessages.length, activeChannel]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendCommunityMessage(activeChannel, inputText);
    setInputText('');
  };

  return (
    <div className="h-[calc(100dvh-135px)] sm:h-[calc(100vh-140px)] flex flex-col space-y-3 pb-2">
      {/* Header */}
      <div className="shrink-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300 uppercase">
            Community Hub
          </span>
          <span className="text-xs text-slate-500">12,000+ Enrolled Students</span>
        </div>
        <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
          All Members Discussion Lounge
        </h1>
      </div>

      {/* Channel Switcher */}
      <div className="shrink-0 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setActiveChannel(ch.id)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
              activeChannel === ch.id
                ? 'bg-[#003539] !text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <span className={activeChannel === ch.id ? '!text-white' : ''}>{ch.name}</span>
          </button>
        ))}
      </div>

      {/* Messages Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
        {currentChannelMessages.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No messages in this group yet. Be the first to start the conversation!
          </div>
        ) : (
          currentChannelMessages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 group">
              <img
                src={msg.userAvatar}
                alt={msg.userName}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{msg.userName}</span>
                  {msg.userBadge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200">
                      {msg.userBadge}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">• {msg.timestamp}</span>
                </div>
                <div className="text-xs text-slate-800 mt-1 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {msg.text}
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                  <button
                    onClick={() => likeCommunityMessage(msg.id)}
                    className="flex items-center gap-1 hover:text-rose-600 transition"
                  >
                    <Heart className={`w-3.5 h-3.5 ${msg.likes > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                    <span className="font-semibold">{msg.likes || ''}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form (Fixed firmly right above bottom nav) */}
      <form onSubmit={handleSendMessage} className="shrink-0 flex items-center gap-2 pt-1">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Share in ${channels.find(c => c.id === activeChannel)?.name.split(' ')[1] || 'Community'}...`}
          className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 shadow-2xs"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-11 h-11 bg-[#003539] hover:bg-[#004f55] disabled:opacity-40 !text-white rounded-2xl font-bold text-xs flex items-center justify-center shadow-sm active:scale-95 transition shrink-0"
        >
          <Send className="w-4 h-4 !text-white" />
        </button>
      </form>
    </div>
  );
};
