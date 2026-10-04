export type UserRole = 'USER' | 'PREMIUM_USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: UserRole;
  level: number;
  streakDays: number;
  streakCoins: number;
  referralCode: string;
  referralsCount: number;
  walletBalance: number;
  interests: string[];
  enrolledCourseIds: string[];
  savedOpportunityIds: string[];
  watchlistTickers: string[];
  isPremium: boolean;
}

export type CourseCategory = 
  | 'VIDEO_EDITING'
  | 'YOUTUBE_GROWTH'
  | 'AI_EARNING'
  | 'TRADING_FINANCE'
  | 'CYBERSECURITY'
  | 'FITNESS_HEALTH'
  | 'MARKETING_BIZ';

export interface LessonQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  order: number;
  type: 'video' | 'pdf' | 'text' | 'quiz';
  videoType?: 'youtube_unlisted' | 'gdrive' | 'direct_mp4';
  videoUrl?: string;
  pdfUrl?: string;
  textContent?: string;
  quiz?: LessonQuiz;
  isFreePreview?: boolean;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: CourseCategory;
  categoryLabel: string;
  instructor: {
    name: string;
    avatar: string;
    role: string;
  };
  thumbnail: string;
  price: number;
  originalPrice: number;
  isFree: boolean;
  rating: number;
  reviewCount: number;
  studentsEnrolled: number;
  durationHours: number;
  lessonsCount: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  isNew?: boolean;
  isBestseller?: boolean;
  learningOutcomes: string[];
  lessons: Lesson[];
  published: boolean;
  createdAt: string;
  cheatSheetPdf?: {
    title: string;
    fileSize: string;
    downloadUrl: string;
  };
  driveUrl?: string;
}

export interface ComboBundle {
  id: string;
  title: string;
  tagline: string;
  includedCourseIds: string[];
  price: number;
  originalPrice: number;
  badge: string;
  thumbnail: string;
}

export interface OrderRecord {
  id: string;
  orderId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet';
  paymentGateway: 'Razorpay' | 'Direct';
  status: 'SUCCESS' | 'PENDING' | 'REFUNDED';
  purchasedAt: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  currentValue: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  high: number;
  low: number;
  sparkline: number[];
}

export interface ScenarioBreakdown {
  upsideTarget: number;
  upsidePercentage: string;
  upsideRationale: string;
  downsideRisk: number;
  downsidePercentage: string;
  downsideRationale: string;
  invalidationLevel: number;
  supportLevel: number;
  resistanceLevel: number;
}

export interface StockQuote {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  whyTrending: string;
  keyFactors: string[];
  sentimentScore: number;
  scenarios: ScenarioBreakdown;
  chartData: {
    '1D': { time: string; price: number }[];
    '1W': { time: string; price: number }[];
    '1M': { time: string; price: number }[];
    '3M': { time: string; price: number }[];
    '1Y': { time: string; price: number }[];
  };
}

export interface Opportunity {
  id: string;
  title: string;
  companyOrPlatform: string;
  category: 'FREELANCING' | 'INTERNSHIPS' | 'HACKATHONS' | 'REMOTE_JOBS' | 'AI_GIGS' | 'CONTENT_CREATION';
  categoryLabel: string;
  payoutRange: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeRequired: string;
  deadline?: string;
  verified: boolean;
  tags: string[];
  whyMatchesYou: string;
  description: string;
  requirements: string[];
  applyUrl: string;
}

export interface CreatorAsset {
  id: string;
  title: string;
  category: 'SOUND_FX' | 'LUTS_PRESETS' | 'CAPCUT_TEMPLATES' | 'FREE_AI_TOOLS' | 'FONTS_GRAPHICS';
  categoryLabel: string;
  description: string;
  downloadUrl: string;
  fileSize: string;
  downloadsCount: number;
  isPro: boolean;
  tags: string[];
  thumbnail?: string;
}

export interface CommunityMessage {
  id: string;
  channelId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userBadge?: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'MARKET' | 'COURSE' | 'OPPORTUNITY' | 'LEARNING' | 'ANNOUNCEMENT';
  categoryLabel: string;
  deepLink: string;
  timestamp: string;
  read: boolean;
  imageUrl?: string;
}

export interface RiskCalculatorInput {
  budget: number;
  entryPrice: number;
  stopLossPrice: number;
  targetPrice: number;
}

export interface RiskCalculatorResult {
  riskAmount: number;
  riskPercent: number;
  potentialProfit: number;
  profitPercent: number;
  rewardRiskRatio: number;
  suggestedQuantity: number;
  disclaimer: string;
}
