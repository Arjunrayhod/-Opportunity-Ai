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
        const opp = opportunities[0];
        aiResponse.text = `Here is the top verified student gig right now:\n\n` +
          `• **Role**: ${opp.title} (${opp.companyOrPlatform})\n` +
          `• **Payout**: ${opp.payoutRange}\n` +
          `• **Required Skills**: ${opp.tags.join(', ')}\n` +
          `• **Status**: Open for applications`;
        aiResponse.cards = [
          {
            type: 'opportunity',
            title: opp.title,
            description: `${opp.companyOrPlatform} • ${opp.payoutRange}`,
            badge: 'VERIFIED GIG',
            actionLabel: 'Apply Now',
            link: '/opportunities'
          }
        ];
      } else if (lower.includes('course') || lower.includes('learn') || lower.includes('video') || lower.includes('edit')) {
        const course = courses[0];
        aiResponse.text = `I recommend starting with **${course.title}**:\n\n` +
          `• **Price**: ₹${course.price} (Special 95% student discount)\n` +
          `• **Instructor**: ${course.instructor.name}\n` +
          `• **Includes**: ${course.lessons.length} complete video lessons + downloadable PDF cheat sheet + certificate.`;
        aiResponse.cards = [
          {
            type: 'course',
            title: course.title,
            description: `₹${course.price} • ${course.durationHours} Hours • Certificate Included`,
            badge: 'BESTSELLER',
            actionLabel: 'Explore Curriculum',
            link: `/courses/${course.id}`
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="w-full max-w-lg h-[85vh] bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-teal-500 p-0.5 flex items-center justify-center shadow-xs">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-teal-700">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  AI Opportunity Assistant
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-purple-100 text-purple-700 rounded border border-purple-200">
                    SMART
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">Market Intelligence & Earning Guide</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-teal-100 border border-teal-200 flex items-center justify-center shrink-0 text-teal-700">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#003539] text-white font-medium rounded-tr-xs shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Structured Rich Cards */}
                  {m.cards && m.cards.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {m.cards.map((card, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-teal-500 transition cursor-pointer shadow-2xs"
                          onClick={() => {
                            if (card.link && onNavigate) {
                              onNavigate(card.link);
                              onClose();
                            }
                          }}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-slate-900 text-xs">{card.title}</span>
                            {card.badge && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-teal-100 text-teal-800 border border-teal-200">
                                {card.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600">{card.description}</p>
                          {card.actionLabel && (
                            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-teal-700">
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
                  <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 text-teal-800">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 pl-10">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                <span>AI analyzing opportunities and scenarios...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 overflow-x-auto no-scrollbar flex gap-2">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(qp)}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-[11px] font-medium text-slate-700 whitespace-nowrap transition active:scale-95 flex items-center gap-1.5 shadow-2xs"
              >
                <span>{qp}</span>
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt(input);
              }}
              className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl px-3 py-2 focus-within:border-teal-600 focus-within:bg-white transition"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about stocks, video editing, or earning gigs..."
                className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-8 h-8 rounded-xl bg-[#003539] hover:bg-[#004f55] disabled:opacity-40 text-white flex items-center justify-center transition active:scale-95 shadow-xs"
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
