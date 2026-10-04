import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CheckCircle2, Lock, Smartphone, CreditCard, Building, Loader2 } from 'lucide-react';
import { Course } from '../../types';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

interface RazorpayModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({ course, isOpen, onClose, onSuccess }) => {
  const { user, purchaseCourseWithRazorpay } = useApp();
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiApp, setUpiApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM'>('GPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState('');

  if (!isOpen || !course) return null;

  const handlePayNow = async () => {
    setIsProcessing(true);
    try {
      const res = await purchaseCourseWithRazorpay(course, phoneNumber);
      if (res.success) {
        setCompletedOrderId(res.orderId);
        setIsSuccess(true);
        setIsProcessing(false);
        
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        setTimeout(() => {
          onSuccess(res.orderId);
          setIsSuccess(false);
          onClose();
        }, 2200);
      }
    } catch (e) {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-dark-900 border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Razorpay Brand Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm tracking-wider">
                ₹
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Razorpay Gateway</h3>
                <p className="text-[10px] text-blue-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-300" /> 256-Bit SSL Encrypted
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isSuccess ? (
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
              <p className="text-xs text-slate-300 mt-2">
                Order ID: <span className="font-mono text-cyan-400">{completedOrderId}</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Lifetime course access has been added to your profile.
              </p>
              <div className="mt-4 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                Redirecting to course lessons...
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* Order Summary */}
              <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-white line-clamp-1">{course.title}</h4>
                    <p className="text-[11px] text-slate-400">{course.lessonsCount} Video Lessons + PDFs</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-extrabold text-cyan-400">₹{course.price}</div>
                  <div className="text-[10px] text-slate-500 line-through">₹{course.originalPrice}</div>
                </div>
              </div>

              {/* Student Phone input for WhatsApp delivery */}
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1.5 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" /> WhatsApp / Mobile Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Course receipt and updates will be sent to this number.
                </span>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition ${
                      paymentMethod === 'UPI'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                        : 'bg-dark-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>UPI / QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition ${
                      paymentMethod === 'CARD'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                        : 'bg-dark-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cards</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition ${
                      paymentMethod === 'NETBANKING'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                        : 'bg-dark-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>NetBanking</span>
                  </button>
                </div>
              </div>

              {/* UPI Sub Options */}
              {paymentMethod === 'UPI' && (
                <div className="p-3 bg-dark-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-[11px] text-slate-400 font-medium">Fast 1-Tap UPI App:</div>
                  <div className="flex gap-2">
                    {[
                      { id: 'GPAY', name: 'Google Pay' },
                      { id: 'PHONEPE', name: 'PhonePe' },
                      { id: 'PAYTM', name: 'Paytm UPI' }
                    ].map(app => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setUpiApp(app.id as any)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs border transition ${
                          upiApp === app.id
                            ? 'bg-blue-500/20 border-blue-400 text-white font-medium'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {app.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handlePayNow}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing ₹{course.price} via Razorpay...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ₹{course.price} & Unlock Course</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
                <ShieldCheck className="w-3 h-3 text-slate-400" />
                <span>Instant Course Activation • 100% Secure Checkout</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
