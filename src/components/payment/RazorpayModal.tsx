import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  Copy,
  Check,
  Clock,
  QrCode,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { Course } from '../../types';
import { useApp } from '../../context/AppContext';
import { generateUpiPaymentLink, generateUpiQrCodeUrl, isValidUtrNumber } from '../../services/paymentService';

interface RazorpayModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({ course, isOpen, onClose, onSuccess }) => {
  const { user, paymentSettings, submitCoursePaymentWithUtr } = useApp();
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '+91 98765 43210');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !course) return null;

  const upiId = paymentSettings.upiId || 'creator@okaxis';
  const payeeName = paymentSettings.payeeName || 'AI Opportunity Creator';
  const upiDeepLink = generateUpiPaymentLink(upiId, payeeName, course.price, course.title, course.id);
  const qrCodeUrl = generateUpiQrCodeUrl(upiDeepLink);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!utrNumber.trim()) {
      setErrorMessage('Please enter the 12-digit UTR / UPI Transaction Reference Number from your payment app.');
      return;
    }

    if (!isValidUtrNumber(utrNumber)) {
      setErrorMessage('Please enter a valid 12-digit UTR number (e.g. 427819283746).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitCoursePaymentWithUtr(course, phoneNumber, utrNumber);
      if (res.success) {
        setSubmittedOrderId(res.orderId);
        setIsSubmitted(true);
        setIsSubmitting(false);
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Failed to submit order. Please try again or contact support.');
    }
  };

  const handleWhatsAppHelp = () => {
    const text = encodeURIComponent(
      `Hello! I made a payment of ₹${course.price} for "${course.title}".\nMy Phone: ${phoneNumber}\nUTR / Ref No: ${utrNumber || 'Attached screenshot'}\nPlease verify and unlock my course.`
    );
    const waNumber = paymentSettings.upiId.includes('@') ? '919876543210' : paymentSettings.upiId;
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl my-auto"
        >
          {/* Header */}
          <div className="bg-[#003539] px-5 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center font-black text-sm">
                ₹
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Direct UPI Payment</h3>
                <p className="text-[10px] text-teal-100 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-300" /> Direct Bank-to-Bank Transfer (0% Fee)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isSubmitted ? (
            /* Pending Verification Screen */
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-amber-700 mx-auto animate-pulse">
                <Clock className="w-7 h-7" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider">
                  ⏳ Payment Under Verification
                </span>
                <h3 className="text-base font-black text-slate-900 mt-2">
                  Payment Reference Submitted!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  Admin ke bank account me paise credit hone ki verification ho rahi hai. <strong>5-10 minute</strong> me aapka course unlock ho jayega!
                </p>
              </div>

              {/* Order & UTR Summary Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Course:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[180px]">{course.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-black text-teal-800">₹{course.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono text-slate-700 font-bold">{submittedOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Submitted UTR:</span>
                  <span className="font-mono text-teal-700 font-black">{utrNumber}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleWhatsAppHelp}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Screenshot on WhatsApp for 1-Min Unlock</span>
                </button>

                <button
                  onClick={() => {
                    onSuccess(submittedOrderId);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Back to Course Overview
                </button>
              </div>
            </div>
          ) : (
            /* Step-by-Step Payment Form */
            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
              {/* Course & Price Badge */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{course.title}</h4>
                    <p className="text-[11px] text-slate-500">{course.lessonsCount} Lessons • Lifetime Access</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-teal-800">₹{course.price}</div>
                  <div className="text-[10px] text-slate-400 line-through">₹{course.originalPrice}</div>
                </div>
              </div>

              {/* Step 1: Scan QR or 1-Click Pay */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-teal-700" />
                    Step 1: Scan UPI QR Code to Pay ₹{course.price}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Direct Creator Account
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Dynamic QR Code */}
                  <div className="p-2 bg-white rounded-2xl border border-teal-300 shadow-xs shrink-0 flex flex-col items-center">
                    <img
                      src={qrCodeUrl}
                      alt="UPI QR Code"
                      className="w-32 h-32 object-contain rounded-lg"
                    />
                    <span className="text-[9px] font-bold text-slate-500 mt-1">Scan with any UPI App</span>
                  </div>

                  {/* UPI Details & 1-Click copy */}
                  <div className="flex-1 space-y-2 text-xs w-full">
                    <div className="p-2.5 bg-white rounded-xl border border-teal-200 space-y-1">
                      <span className="text-[10px] text-slate-500 block">Creator UPI ID:</span>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono font-bold text-slate-900 truncate text-[11px]">{upiId}</span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2 py-1 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-800 font-bold text-[10px] flex items-center gap-1 shrink-0 transition"
                        >
                          {copiedUpi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* 1-Click Pay on Mobile */}
                    <a
                      href={upiDeepLink}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Tap to Open UPI App (₹{course.price})</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 2: Form to submit 12-digit UTR */}
              <form onSubmit={handleSubmitUtr} className="space-y-3">
                <div className="border-t border-slate-200 pt-3">
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider block mb-2">
                    Step 2: Enter Payment Details for Verification
                  </span>
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label className="text-xs text-slate-700 font-bold block mb-1 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-teal-700" /> Your WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 font-medium"
                  />
                </div>

                {/* 12-Digit UTR */}
                <div>
                  <label className="text-xs text-slate-700 font-bold block mb-1 flex items-center justify-between">
                    <span>12-Digit UTR / UPI Ref Number</span>
                    <span className="text-[10px] text-teal-700 font-normal">Found in payment receipt</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                    placeholder="e.g. 427819283746"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 font-mono font-bold tracking-wider"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    GPay / PhonePe / Paytm transaction receipt me 12 digit UTR number hota hai.
                  </span>
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#003539] hover:bg-[#004f55] active:scale-98 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Verification...' : 'Submit Payment for Verification'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Direct Account Credit
                </span>
                <button
                  type="button"
                  onClick={handleWhatsAppHelp}
                  className="text-teal-700 font-bold hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" /> Need Help? WhatsApp
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
