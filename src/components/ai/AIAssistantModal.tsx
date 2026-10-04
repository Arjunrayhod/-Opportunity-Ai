import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, ShieldCheck, Clock, MessageCircle, AlertCircle, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { user, directChatMessages, sendDirectMessage, adminOnlineStatus, paymentSettings } = useApp();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for current user or general admin broadcast
  const userChatMessages = directChatMessages.filter(
    m => m.userId === user.id || m.userId === 'usr_default'
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [userChatMessages]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;
    sendDirectMessage(text.trim());
    setInput('');
  };

  const handleWhatsAppHelp = () => {
    const text = encodeURIComponent(
      `Hello Admin! I have a question regarding Opportunity AI courses & app.\nMy Name: ${user.name}\nMy Phone: ${user.phone || ''}`
    );
    const waNumber = paymentSettings.upiId.includes('@') ? '919876543210' : paymentSettings.upiId;
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  const quickTopics = [
    'Course access & unlock inquiry',
    'Payment verification status',
    'Trading & Market doubt for Mentor',
    'Need freelance project advice'
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
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Admin Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-teal-600"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    adminOnlineStatus ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-slate-900">Satvik (Admin / Lead Mentor)</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-teal-100 text-teal-800 border border-teal-200 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-teal-700" /> Verified
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[10px] font-bold flex items-center gap-1 ${
                      adminOnlineStatus ? 'text-emerald-600' : 'text-slate-500'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${adminOnlineStatus ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                    {adminOnlineStatus ? 'Admin Online' : 'Admin currently offline'}
                  </span>
                  <span className="text-[10px] text-slate-400">• Direct 1-on-1 Chat</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Offline Notice Banner */}
          {!adminOnlineStatus && (
            <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900">
              <span className="flex items-center gap-1.5 font-medium text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                Admin offline hai. Aap message bhej sakte hain, reply aane par notification milegi.
              </span>
              <button
                onClick={handleWhatsAppHelp}
                className="text-[10px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1 shrink-0 ml-2"
              >
                <MessageCircle className="w-3 h-3 text-emerald-700" />
                <span>WhatsApp</span>
              </button>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar bg-slate-50/50">
            {userChatMessages.map((m) => {
              const isAdmin = m.sender === 'admin';
              const isOfflineNotice = m.text.toLowerCase().includes('offline');

              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  {isAdmin && (
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                      alt="Admin"
                      className="w-7 h-7 rounded-full object-cover border border-teal-300 shrink-0 mt-0.5"
                    />
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isAdmin
                        ? isOfflineNotice
                          ? 'bg-amber-50 border border-amber-300 text-amber-950 font-medium rounded-tl-xs shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                        : 'bg-[#003539] text-white font-medium rounded-tr-xs shadow-xs'
                    }`}
                  >
                    {isAdmin && (
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-black text-teal-800 uppercase tracking-wider">
                          {isOfflineNotice ? 'Automated Status' : 'Admin Reply'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">{m.timestamp}</span>
                      </div>
                    )}

                    <p className="whitespace-pre-line text-xs">{m.text}</p>

                    {!isAdmin && (
                      <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-teal-200 font-mono">
                        <span>{m.timestamp}</span>
                        <CheckCheck className="w-3 h-3 text-teal-300" />
                      </div>
                    )}
                  </div>

                  {!isAdmin && (
                    <div className="w-7 h-7 rounded-lg bg-teal-100 border border-teal-200 flex items-center justify-center shrink-0 text-teal-800 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Topics Bar */}
          <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200 overflow-x-auto no-scrollbar flex gap-2">
            {quickTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(topic)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-[11px] font-medium text-slate-700 whitespace-nowrap transition active:scale-95 flex items-center gap-1 shadow-2xs"
              >
                <span>{topic}</span>
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl px-3 py-2 focus-within:border-teal-600 focus-within:bg-white transition"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Admin directly..."
                className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-8 h-8 rounded-xl bg-[#003539] hover:bg-[#004f55] disabled:opacity-40 text-white flex items-center justify-center transition active:scale-95 shadow-xs shrink-0"
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
