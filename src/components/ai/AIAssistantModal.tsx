import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Bot, User, ArrowRight, TrendingUp, ShieldAlert, BookOpen, Briefcase } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  cards?: {
    type: 'market' | 'course' | 'opportunity' | 'risk';
    title: string;
    description: string;
    badge?: string;
    actionLabel?: string;
    link?: string;
  }[];
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { stocks, courses, opportunities, user } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hi ${user.name.split(' ')[0]} 👋\nI'm your Opportunity & Market Intelligence AI. What would you like to explore today?`
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: promptText
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI intelligent answer engine with grounded real platform context
    setTimeout(() => {
      const lower = promptText.toLowerCase();
      let aiResponse: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: ''
      };

      if (lower.includes('stock') || lower.includes('tata') || lower.includes('trending') || lower.includes('market')) {
        const stock = stocks[0];
        aiResponse.text = `Here is today's verified market intelligence for **${stock.name} (${stock.ticker})**:\n\n` +
          `• **Current Price**: ₹${stock.price} (+${stock.changePercent}%)\n` +
          `• **Why it's trending**: ${stock.whyTrending}\n` +
          `• **Potential Upside Scenario**: Target ₹${stock.scenarios.upsideTarget} (${stock.scenarios.upsidePercentage})\n` +
          `• **Downside Risk Level**: Invalidation at ₹${stock.scenarios.invalidationLevel}\n\n` +
          `*Note: Scenario modeling only, not financial advice.*`;
        aiResponse.cards = [
          {
            type: 'market',
            title: `${stock.name} Deep Dive`,
            description: `Support at ₹${stock.scenarios.supportLevel} | Resistance at ₹${stock.scenarios.resistanceLevel}`,
            badge: stock.riskLevel + ' RISK',
            actionLabel: 'View Stock Chart',
            link: '/market'
          }
        ];
      } else if (lower.includes('risk') || lower.includes('calculator') || lower.includes('1000') || lower.includes('budget')) {
        aiResponse.text = `For a **₹1,000 budget** in disciplined trading:\n\n` +
          `• **Max Safe Risk per Trade (2-3%)**: ₹20 – ₹30 maximum capital loss\n` +
          `• **Calculated Position**: Always set your stop-loss before entry\n` +
          `• **Recommended Risk/Reward**: At least 1:2 ratio for sustainable growth.`;
        aiResponse.cards = [
          {
            type: 'risk',
            title: 'Interactive Position Calculator',
            description: 'Calculate your exact quantity and risk limits before taking any trade.',
            badge: 'RISK MANAGEMENT',
            actionLabel: 'Open Calculator',
            link: '/market'
          }
        ];
      } else if (lower.includes('opportunity') || lower.includes('earn') || lower.includes('freelance') || lower.includes('student')) {
        aiResponse.text = `Here are the top active freelance and student earning opportunities matching your skills:\n\n` +
          `1. **Short-form Video Editor for Tech Creators** (₹1,500 – ₹2,500 / Reel)\n` +
          `2. **AI Prompt & SEO Content Assistant** (₹12,000 – ₹18,000 / month)\n\n` +
          `Both gigs require only 3-5 hours/week and are beginner-friendly!`;
        aiResponse.cards = [
          {
            type: 'opportunity',
            title: 'Video Editor Gig (150K Subs Channel)',
            description: 'Payout: ₹1,500 - ₹2,500/Reel • CapCut / Premiere',
            badge: 'VERIFIED GIG',
            actionLabel: 'Apply Now',
            link: '/opportunities'
          }
        ];
      } else if (lower.includes('course') || lower.includes('capcut') || lower.includes('learn') || lower.includes('youtube')) {
        const crs = courses[0];
        aiResponse.text = `Recommended Course: **${crs.title}** (Special Student Price: ₹${crs.price})\n\n` +
          `• **What you will learn**: ${crs.learningOutcomes.slice(0, 2).join(', ')}\n` +
          `• **Includes**: ${crs.lessonsCount} video lessons + downloadable PDF viral templates!`;
        aiResponse.cards = [
          {
            type: 'course',
            title: crs.title,
            description: `Only ₹${crs.price} • ${crs.rating} ⭐ (${crs.studentsEnrolled} students)`,
            badge: 'BESTSELLER',
            actionLabel: 'View Course Curriculum',
            link: `/courses/${crs.id}`
          }
        ];
      } else {
        aiResponse.text = `I can help you with:\n` +
          `1. **Market Intelligence & Risk Scenarios** for trending equities\n` +
          `2. **High-Value Affordable Courses** (CapCut, YouTube, AI Freelancing, Gym & Security)\n` +
          `3. **Student Earning Gigs & Internships**\n` +
          `4. **Position Sizing Calculations**\n\n` +
          `What would you like to explore first?`;
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 700);
  };

  const quickPrompts = [
    'Why is Tata Power trending today?',
    'Show risk scenarios for ₹1,000 budget',
    'Find student video editing gigs',
    'Recommend top course for beginners'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="w-full max-w-lg h-[85vh] bg-dark-900 border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900/60 via-dark-850 to-blue-900/60 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  AI Opportunity Assistant
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                    SMART
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Market Intelligence & Earning Guide</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-tr-sm'
                      : 'bg-dark-850 border border-slate-800 text-slate-200 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Structured Rich Cards */}
                  {m.cards && m.cards.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {m.cards.map((card, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-dark-950 border border-slate-700/80 text-left hover:border-cyan-500/50 transition cursor-pointer"
                          onClick={() => {
                            if (card.link && onNavigate) {
                              onNavigate(card.link);
                              onClose();
                            }
                          }}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-semibold text-white text-xs">{card.title}</span>
                            {card.badge && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                {card.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">{card.description}</p>
                          {card.actionLabel && (
                            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-cyan-400">
                              <span>{card.actionLabel}</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0 text-cyan-300">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-10">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>AI analyzing opportunities and scenarios...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-dark-950/80 border-t border-slate-800/80 overflow-x-auto no-scrollbar flex gap-2">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(qp)}
                className="px-3 py-1.5 rounded-full bg-dark-850 hover:bg-slate-800 border border-slate-700/60 text-[11px] text-slate-300 whitespace-nowrap transition active:scale-95 flex items-center gap-1.5"
              >
                <span>{qp}</span>
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-dark-900 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt(input);
              }}
              className="flex items-center gap-2 bg-dark-950 border border-slate-700/80 rounded-2xl px-3 py-2 focus-within:border-cyan-400 transition"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about stocks, video editing, or earning gigs..."
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 disabled:opacity-40 text-white flex items-center justify-center transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
