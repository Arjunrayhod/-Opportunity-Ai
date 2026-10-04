import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Smartphone, Mail, User as UserIcon, Shield, CheckCircle2, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    user,
    allUsers,
    loginAsUser,
    loginWithCredentials,
    registerNewUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your email or WhatsApp number');
      return;
    }

    const success = loginWithCredentials(loginIdentifier);
    if (!success) {
      setLoginError('No matching account found. Select a quick profile below or sign up!');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regName.trim() || !regEmail.trim()) {
      setRegError('Please provide both your name and email address');
      return;
    }

    registerNewUser({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim()
    });

    setRegName('');
    setRegPhone('');
    setRegEmail('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl my-auto text-slate-900"
        >
          {/* Header */}
          <div className="bg-[#003539] px-6 py-5 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center font-black text-sm">
                <KeyRound className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-wide">Account Access</h3>
                <p className="text-[11px] text-teal-100 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-300" /> Secure Student & Creator Authentication
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex p-2 bg-slate-100 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('LOGIN')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'LOGIN'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔑 Log In / Switch Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('REGISTER')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'REGISTER'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>✨ Create Account</span>
            </button>
          </div>

          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
            {activeTab === 'LOGIN' ? (
              <div className="space-y-4">
                {/* 1-Click Fast Profile Switcher */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                    1-Click Fast Login / Switch Profile
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {allUsers.map((u) => {
                      const isActive = user.id === u.id;
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => loginAsUser(u)}
                          className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                            isActive
                              ? 'bg-teal-50 border-teal-600 text-teal-950 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0 truncate">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-xs text-slate-900 truncate">{u.name}</h4>
                                {isActive && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded">
                                    Active
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 truncate">{u.phone || u.email}</p>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase shrink-0 border ${
                            u.role === 'SUPER_ADMIN' || u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-900 border-purple-300'
                              : u.role === 'PREMIUM_USER'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {u.role === 'SUPER_ADMIN' ? 'Super Admin' : u.role}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Manual Credentials Form */}
                <form onSubmit={handleManualLogin} className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                    Or Login with Mobile / Email
                  </span>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">WhatsApp Phone or Email</label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-teal-600 focus-within:bg-white transition">
                      <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="+91 98765 43210 or your email"
                        className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Password (Optional)</label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-teal-600 focus-within:bg-white transition">
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
                  >
                    <span>Log In to Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Register Tab */
              <form onSubmit={handleRegister} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-teal-600 focus-within:bg-white transition">
                    <UserIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Satvik Sharma"
                      className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp / Phone Number</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-teal-600 focus-within:bg-white transition">
                    <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-teal-600 focus-within:bg-white transition">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Create Password</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-teal-600 focus-within:bg-white transition">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full"
                    />
                  </div>
                </div>

                {regError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                    {regError}
                  </div>
                )}

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Get <strong>50 free coins</strong> instantly upon signup to claim creator presets!</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Free Account</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
