import React, { useState } from 'react';
import { MessageSquare, Send, Heart, Users, Sparkles, Flame, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CommunityPage: React.FC = () => {
  const { communityMessages, sendCommunityMessage, likeCommunityMessage, activeChannel, setActiveChannel, user } = useApp();
  const [inputText, setInputText] = useState('');

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendCommunityMessage(activeChannel, inputText);
    setInputText('');
  };

  return (
    <div className="space-y-4 pb-24 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
            Community Hub
          </span>
          <span className="text-xs text-slate-400">12,000+ Enrolled Students</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          All Members Discussion Lounge
        </h1>
      </div>

      {/* Channel Switcher */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setActiveChannel(ch.id)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
              activeChannel === ch.id
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow'
                : 'bg-dark-850 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {ch.name}
          </button>
        ))}
      </div>

      {/* Messages Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-4 no-scrollbar">
        {currentChannelMessages.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No messages in this group yet. Be the first to start the conversation!
          </div>
        ) : (
          currentChannelMessages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 group">
              <img
                src={msg.userAvatar}
                alt={msg.userName}
                className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0 mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{msg.userName}</span>
                  {msg.userBadge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {msg.userBadge}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed bg-dark-950/70 p-3 rounded-2xl border border-slate-800/80">
                  {msg.text}
                </p>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                  <button
                    onClick={() => likeCommunityMessage(msg.id)}
                    className="flex items-center gap-1 hover:text-rose-400 transition"
                  >
                    <Heart className={`w-3.5 h-3.5 ${msg.likes > 0 ? 'text-rose-400 fill-rose-400' : ''}`} />
                    <span>{msg.likes || ''}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Share in ${channels.find(c => c.id === activeChannel)?.name}...`}
          className="flex-1 px-4 py-3 bg-dark-850 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 disabled:opacity-40 text-white rounded-2xl font-bold text-xs flex items-center gap-1 shadow-md shadow-blue-500/20 active:scale-95 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
