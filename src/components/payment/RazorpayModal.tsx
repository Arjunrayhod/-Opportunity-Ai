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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Razorpay Brand Header */}
          <div className="bg-[#003539] px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center font-bold text-sm tracking-wider">
                ₹
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Razorpay Gateway</h3>
                <p className="text-[10px] text-teal-100 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-300" /> 256-Bit SSL Encrypted
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isSuccess ? (
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-600 mt-2">
                Order ID: <span className="font-mono text-teal-700 font-bold">{completedOrderId}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Lifetime course access has been added to your profile.
              </p>
              <div className="mt-4 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                Redirecting to course lessons...
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* Order Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{course.title}</h4>
                    <p className="text-[11px] text-slate-500">{course.lessonsCount} Video Lessons + PDFs</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-teal-800">₹{course.price}</div>
                  <div className="text-[10px] text-slate-400 line-through">₹{course.originalPrice}</div>
                </div>
              </div>

              {/* Student Phone input for WhatsApp delivery */}
              <div>
                <label className="text-xs text-slate-700 font-bold block mb-1.5 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-teal-700" /> WhatsApp / Mobile Number
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 min-h-[48px] bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Course receipt and updates will be sent to this number.
                </span>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs text-slate-700 font-bold block mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition ${
                      paymentMethod === 'UPI'
                        ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
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
                        ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
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
                        ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>NetBanking</span>
                  </button>
                </div>
              </div>

              {/* UPI App Quick Selection */}
              {paymentMethod === 'UPI' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Instant Fast Pay Apps
                  </span>
                  <div className="flex gap-2">
                    {[
                      { id: 'GPAY', label: 'Google Pay' },
                      { id: 'PHONEPE', label: 'PhonePe' },
                      { id: 'PAYTM', label: 'Paytm UPI' }
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setUpiApp(app.id as any)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition ${
                          upiApp === app.id
                            ? 'bg-white border-teal-600 text-teal-800 shadow-xs'
                            : 'bg-white/60 border-slate-200 text-slate-600'
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                className="w-full py-3.5 min-h-[48px] rounded-2xl bg-[#003539] hover:bg-[#004f55] active:scale-98 disabled:opacity-50 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting Secure Gateway...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ₹{course.price} Securely</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Instant activation & lifetime access guaranteed
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
