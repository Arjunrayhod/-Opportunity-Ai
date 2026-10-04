import { PaymentSettings } from '../types';
export type { PaymentSettings };

const STORAGE_KEYS = {
  SETTINGS: 'aiopp_payment_settings_v2',
};

export const defaultPaymentSettings: PaymentSettings = {
  upiId: 'opportunityai@upi',
  payeeName: 'Opportunity AI Masterclass',
  razorpayKeyId: '',
  mode: 'DIRECT_UPI_UTR',
  qrNote: 'Course Enrollment'
};

export function getStoredPaymentSettings(): PaymentSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return defaultPaymentSettings;
}

export function savePaymentSettings(settings: PaymentSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save payment settings', e);
  }
}

/**
 * Generates official NPCI UPI Deep Link for Google Pay, PhonePe, Paytm, BHIM
 */
export function generateUpiPaymentLink(
  upiId: string,
  payeeName: string,
  amount: number,
  courseTitle?: string,
  orderId?: string
): string {
  const safeUpiId = (upiId || defaultPaymentSettings.upiId).trim();
  const safePayeeName = encodeURIComponent((payeeName || defaultPaymentSettings.payeeName).trim());
  const ref = orderId ? orderId.slice(-6) : Math.random().toString(36).substring(2, 6);
  const cleanTitle = encodeURIComponent(`Enroll_${ref}`);
  return `upi://pay?pa=${safeUpiId}&pn=${safePayeeName}&am=${amount}&cu=INR&tn=${cleanTitle}`;
}

/**
 * Generates dynamic high-resolution QR code image URL
 */
export function generateUpiQrCodeUrl(upiLink: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(upiLink)}`;
}

/**
 * Validates 12-Digit UPI Transaction ID / UTR Number
 */
export function isValidUtrNumber(utr: string): boolean {
  const clean = utr.trim();
  // Most Indian UPI UTR numbers are 12 numeric digits, or 8-16 alphanumeric bank refs
  return clean.length >= 8 && clean.length <= 18;
}
