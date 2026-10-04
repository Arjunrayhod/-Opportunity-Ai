import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Smartphone, Mail, User as UserIcon, CheckCircle2, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
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
      setLoginError('Please enter your WhatsApp phone number or email address.');
      return;
    }

    const success = loginWithCredentials(loginIdentifier);
    if (!success) {
      setLoginError('Unable to sign in with this number/email. Please switch to Create Account tab to register.');
    } else {
      setLoginIdentifier('');
      setLoginPassword('');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regName.trim() || !regEmail.trim()) {
      setRegError('Please enter your full name and email address.');
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
    setRegPassword('');
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
                <h3 className="font-extrabold text-base tracking-wide">
                  {activeTab === 'LOGIN' ? 'Sign In to Account' : 'Create Free Account'}
                </h3>
                <p className="text-[11px] text-teal-100 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-300" /> Secure Student & Creator Authentication
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              aria-label="Close authentication modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex p-2 bg-slate-100 border-b border-slate-200">
            <button
              onClick={() => {
                setActiveTab('LOGIN');
                setLoginError('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'LOGIN'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔑 Log In</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('REGISTER');
                setRegError('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'REGISTER'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>✨ Create Account</span>
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
            {activeTab === 'LOGIN' ? (
              /* Real Clean Login Form (No Demo Profiles) */
              <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    WhatsApp Mobile Number or Email
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-3 focus-within:border-teal-600 focus-within:bg-white transition">
                    <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="+91 98765 43210 or your email"
                      className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full font-medium"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Use your registered mobile number or email address.
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-700 block">Password</label>
                    <span className="text-[10px] text-slate-400 font-medium">Optional for instant access</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-3 focus-within:border-teal-600 focus-within:bg-white transition">
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
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <span>Log In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2 text-center">
                  <p className="text-xs text-slate-600">
                    New student?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('REGISTER');
                        setRegError('');
                      }}
                      className="font-bold text-teal-700 hover:underline"
                    >
                      Create free account
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* Real Clean Register Form */
              <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 focus-within:border-teal-600 focus-within:bg-white transition">
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
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp / Mobile Number</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 focus-within:border-teal-600 focus-within:bg-white transition">
                    <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 focus-within:border-teal-600 focus-within:bg-white transition">
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
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 focus-within:border-teal-600 focus-within:bg-white transition">
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
                  <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                    {regError}
                  </div>
                )}

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Get <strong>50 free bonus coins</strong> immediately upon account creation!</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Account & Start Learning</span>
                </button>

                <div className="pt-2 text-center">
                  <p className="text-xs text-slate-600">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('LOGIN');
                        setLoginError('');
                      }}
                      className="font-bold text-teal-700 hover:underline"
                    >
                      Log in here
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
