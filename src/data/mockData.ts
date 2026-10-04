import { Course, MarketIndex, StockQuote, Opportunity, CreatorAsset, CommunityMessage, NotificationItem, User, OrderRecord, ComboBundle } from '../types';

export const initialUser: User = {
  id: 'usr_001',
  name: 'Aakash Verma',
  email: 'aakash.creator@gmail.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  role: 'USER',
  level: 4,
  streakDays: 7,
  streakCoins: 120,
  referralCode: 'AAKASH99',
  referralsCount: 3,
  walletBalance: 60,
  interests: ['YouTube Growth', 'CapCut Video Editing', 'AI Tools', 'Stock Market', 'Freelancing'],
  enrolledCourseIds: ['crs_capcut_01'],
  savedOpportunityIds: ['opp_01', 'opp_03'],
  watchlistTickers: ['TATAPOWER', 'IREDA', 'ZOMATO'],
  isPremium: false,
};

export const initialComboBundles: ComboBundle[] = [
  {
    id: 'bndl_creator_all_in_one',
    title: '🔥 All-in-One Creator & AI Mega Pass',
    tagline: 'Get CapCut Mastery + YouTube AI Automation + 500 Viral SFX Pack in 1 bundle!',
    includedCourseIds: ['crs_capcut_01', 'crs_yt_02'],
    price: 249,
    originalPrice: 6999,
    badge: 'SUPER COMBO 96% OFF',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'
  }
];

export const initialOrders: OrderRecord[] = [
  {
    id: 'ord_101',
    orderId: 'pay_rzp_9941a8b',
    courseId: 'crs_capcut_01',
    courseTitle: 'CapCut Pro Video Editing & Viral Reels Mastery',
    amount: 99,
    studentId: 'usr_001',
    studentName: 'Aakash Verma',
    studentEmail: 'aakash.creator@gmail.com',
    studentPhone: '+91 98765 43210',
    paymentMethod: 'UPI',
    paymentGateway: 'Razorpay',
    status: 'SUCCESS',
    purchasedAt: '2026-10-02 14:32'
  },
  {
    id: 'ord_102',
    orderId: 'pay_rzp_8812c7d',
    courseId: 'crs_yt_02',
    courseTitle: 'YouTube Channel Growth & AI Automation Blueprint',
    amount: 199,
    studentId: 'usr_002',
    studentName: 'Rahul Deshmukh',
    studentEmail: 'rahul.d99@gmail.com',
    studentPhone: '+91 91234 56789',
    paymentMethod: 'UPI',
    paymentGateway: 'Razorpay',
    status: 'SUCCESS',
    purchasedAt: '2026-10-03 09:15'
  },
  {
    id: 'ord_103',
    orderId: 'pay_rzp_7734f2e',
    courseId: 'crs_ai_03',
    courseTitle: 'How to Earn ₹50,000+/Month with AI Freelancing',
    amount: 149,
    studentId: 'usr_003',
    studentName: 'Sneha Kapoor',
    studentEmail: 'sneha.kapoor@outlook.com',
    studentPhone: '+91 98111 22334',
    paymentMethod: 'Card',
    paymentGateway: 'Razorpay',
    status: 'SUCCESS',
    purchasedAt: '2026-10-03 18:40'
  }
];

export const marketIndices: MarketIndex[] = [
  {
    symbol: 'NIFTY 50',
    name: 'NSE Nifty 50',
    currentValue: 25145.80,
    change: 142.30,
    changePercent: 0.57,
    isPositive: true,
    high: 25189.40,
    low: 24980.10,
    sparkline: [24980, 25010, 25045, 25090, 25120, 25145.80]
  },
  {
    symbol: 'SENSEX',
    name: 'BSE S&P Sensex',
    currentValue: 82365.10,
    change: 412.80,
    changePercent: 0.50,
    isPositive: true,
    high: 82450.00,
    low: 81920.50,
    sparkline: [81920, 82050, 82180, 82290, 82365.10]
  },
  {
    symbol: 'BANK NIFTY',
    name: 'Nifty Bank Index',
    currentValue: 51870.40,
    change: -115.20,
    changePercent: -0.22,
    isPositive: false,
    high: 52100.00,
    low: 51750.30,
    sparkline: [52050, 51980, 51920, 51850, 51870.40]
  },
  {
    symbol: 'INDIA VIX',
    name: 'Volatility Index',
    currentValue: 12.85,
    change: -0.45,
    changePercent: -3.38,
    isPositive: false,
    high: 13.40,
    low: 12.70,
    sparkline: [13.4, 13.2, 13.0, 12.9, 12.85]
  }
];

export const trendingStocks: StockQuote[] = [
  {
    ticker: 'TATAPOWER',
    name: 'Tata Power Co. Ltd.',
    sector: 'Renewable Energy & Utilities',
    price: 442.80,
    change: 14.35,
    changePercent: 3.35,
    volume: '18.4M',
    trend: 'BULLISH',
    riskLevel: 'MODERATE',
    whyTrending: 'Strong institutional buying following new 1.2GW solar EPC contract announcement and robust Q2 transmission capacity expansion.',
    keyFactors: [
      'Surge in renewable energy tenders across Maharashtra and Gujarat',
      'EV charging station network expansion exceeding 5,000 public points',
      'RSI at 64 showing healthy bullish momentum without overbought stress'
    ],
    sentimentScore: 82,
    scenarios: {
      upsideTarget: 468.00,
      upsidePercentage: '+5.7%',
      upsideRationale: 'Breakout above the key resistance zone of ₹448 with sustained daily volume expansion.',
      downsideRisk: 424.00,
      downsidePercentage: '-4.2%',
      downsideRationale: 'Pullback towards the 20-day Exponential Moving Average if broader market consolidates.',
      invalidationLevel: 418.00,
      supportLevel: 428.50,
      resistanceLevel: 448.00,
    },
    chartData: {
      '1D': [
        { time: '09:15', price: 429.0 },
        { time: '10:30', price: 434.5 },
        { time: '11:45', price: 432.0 },
        { time: '13:00', price: 438.2 },
        { time: '14:15', price: 440.5 },
        { time: '15:30', price: 442.8 },
      ],
      '1W': [
        { time: 'Mon', price: 418.0 },
        { time: 'Tue', price: 422.5 },
        { time: 'Wed', price: 426.0 },
        { time: 'Thu', price: 435.2 },
        { time: 'Fri', price: 442.8 },
      ],
      '1M': [
        { time: 'W1', price: 395.0 },
        { time: 'W2', price: 408.5 },
        { time: 'W3', price: 420.0 },
        { time: 'W4', price: 442.8 },
      ],
      '3M': [
        { time: 'Month 1', price: 370.0 },
        { time: 'Month 2', price: 398.0 },
        { time: 'Month 3', price: 442.8 },
      ],
      '1Y': [
        { time: 'Q1', price: 295.0 },
        { time: 'Q2', price: 345.0 },
        { time: 'Q3', price: 390.0 },
        { time: 'Q4', price: 442.8 },
      ]
    }
  },
  {
    ticker: 'IREDA',
    name: 'Indian Renewable Energy Dev Agency',
    sector: 'Financial Services & Green Energy',
    price: 232.50,
    change: 9.80,
    changePercent: 4.40,
    volume: '24.1M',
    trend: 'BULLISH',
    riskLevel: 'HIGH',
    whyTrending: 'Cabinet approval for green bond fundraising initiative alongside continuous high retail loan book growth.',
    keyFactors: [
      'Loan disbursements grew 38% YoY in recent operational disclosure',
      'High retail and DII participation maintaining strong liquidity'
    ],
    sentimentScore: 78,
    scenarios: {
      upsideTarget: 248.00,
      upsidePercentage: '+6.6%',
      upsideRationale: 'Continuation of higher-highs swing pattern on daily timeframe.',
      downsideRisk: 218.00,
      downsidePercentage: '-6.2%',
      downsideRationale: 'High beta volatility can cause sharp intra-week profit booking.',
      invalidationLevel: 212.00,
      supportLevel: 222.00,
      resistanceLevel: 238.00,
    },
    chartData: {
      '1D': [
        { time: '09:15', price: 223.0 },
        { time: '11:00', price: 228.4 },
        { time: '13:00', price: 229.0 },
        { time: '15:30', price: 232.5 },
      ],
      '1W': [
        { time: 'Mon', price: 215.0 },
        { time: 'Wed', price: 224.0 },
        { time: 'Fri', price: 232.5 },
      ],
      '1M': [
        { time: 'W1', price: 198.0 },
        { time: 'W2', price: 210.0 },
        { time: 'W4', price: 232.5 },
      ],
      '3M': [
        { time: 'M1', price: 175.0 },
        { time: 'M2', price: 205.0 },
        { time: 'M3', price: 232.5 },
      ],
      '1Y': [
        { time: 'Q1', price: 110.0 },
        { time: 'Q2', price: 160.0 },
        { time: 'Q3', price: 200.0 },
        { time: 'Q4', price: 232.5 },
      ]
    }
  },
  {
    ticker: 'ZOMATO',
    name: 'Zomato Ltd. (Eternal)',
    sector: 'Consumer Internet & Quick Commerce',
    price: 278.20,
    change: 5.60,
    changePercent: 2.05,
    volume: '31.2M',
    trend: 'BULLISH',
    riskLevel: 'MODERATE',
    whyTrending: 'Blinkit dark store network acceleration reaching 1,000+ hubs ahead of festive season demands.',
    keyFactors: [
      'Quick commerce segment operating margins improving towards breakeven',
      'Brokerage upgrades targeting higher average order frequency'
    ],
    sentimentScore: 75,
    scenarios: {
      upsideTarget: 295.00,
      upsidePercentage: '+6.0%',
      upsideRationale: 'Sustained festive gross order value surge surpassing street expectations.',
      downsideRisk: 262.00,
      downsidePercentage: '-5.8%',
      downsideRationale: 'Platform fee sensitivity testing customer retention metrics.',
      invalidationLevel: 255.00,
      supportLevel: 268.00,
      resistanceLevel: 284.00,
    },
    chartData: {
      '1D': [
        { time: '09:15', price: 272.5 },
        { time: '11:30', price: 275.0 },
        { time: '15:30', price: 278.2 },
      ],
      '1W': [
        { time: 'Mon', price: 265.0 },
        { time: 'Fri', price: 278.2 },
      ],
      '1M': [
        { time: 'W1', price: 245.0 },
        { time: 'W4', price: 278.2 },
      ],
      '3M': [
        { time: 'M1', price: 215.0 },
        { time: 'M3', price: 278.2 },
      ],
      '1Y': [
        { time: 'Q1', price: 130.0 },
        { time: 'Q4', price: 278.2 },
      ]
    }
  }
];

export const mockCourses: Course[] = [
  {
    id: 'crs_capcut_01',
    slug: 'capcut-mobile-desktop-viral-editing-mastery',
    title: 'CapCut Pro Video Editing & Viral Reels Mastery',
    subtitle: 'Learn 3D camera tracker, keyframing, speed ramping, sound design & viral reel hooks',
    description: 'Master mobile & desktop video editing like top creators. Create cinematic reels, YouTube shorts, and client portfolio projects without needing expensive software.',
    category: 'VIDEO_EDITING',
    categoryLabel: 'Video Editing',
    instructor: {
      name: 'Rohan Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Top Creator & Video Director (1.2M+ Views)',
    },
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    price: 99,
    originalPrice: 1999,
    isFree: false,
    rating: 4.9,
    reviewCount: 1420,
    studentsEnrolled: 4850,
    durationHours: 6.5,
    lessonsCount: 5,
    level: 'Beginner',
    isBestseller: true,
    cheatSheetPdf: {
      title: '50+ High-Retention Viral Reel Hooks & CapCut Shortcuts (PDF)',
      fileSize: '4.2 MB',
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    learningOutcomes: [
      'Master keyframing, smooth velocity curves and beat syncing',
      'Add cinematic color grading and 4K export presets for Instagram',
      'Create 3D motion typography and sound effects layers',
      'Land your first 3 international video editing clients'
    ],
    published: true,
    createdAt: '2026-09-15',
    lessons: [
      {
        id: 'lsn_01',
        courseId: 'crs_capcut_01',
        title: '01. Interface Setup, Project Dimensions & 4K Canvas Rules',
        durationMinutes: 18,
        order: 1,
        type: 'video',
        videoType: 'youtube_unlisted',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
        isFreePreview: true,
      },
      {
        id: 'lsn_02',
        courseId: 'crs_capcut_01',
        title: '02. Smooth Speed Ramping & Optical Flow Motion Blur',
        durationMinutes: 24,
        order: 2,
        type: 'video',
        videoType: 'youtube_unlisted',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
        isFreePreview: true,
      },
      {
        id: 'lsn_03',
        courseId: 'crs_capcut_01',
        title: '03. Sound Design: Whooshes, Risers & Dialogue Clean-up',
        durationMinutes: 22,
        order: 3,
        type: 'video',
        videoType: 'youtube_unlisted',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
        isFreePreview: false,
      },
      {
        id: 'lsn_04',
        courseId: 'crs_capcut_01',
        title: '04. Downloadable Cheat Sheet: Viral Reel Pacing Blueprint (PDF)',
        durationMinutes: 10,
        order: 4,
        type: 'pdf',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'Complete 10-point checklist for hooking viewers in the first 2 seconds.',
        isFreePreview: false,
      },
      {
        id: 'lsn_05',
        courseId: 'crs_capcut_01',
        title: '05. Module Quiz: Testing Your Video Editing Fundamentals',
        durationMinutes: 15,
        order: 5,
        type: 'quiz',
        quiz: {
          question: 'What frame rate is recommended for smooth 50% slow-motion on standard 30fps timelines?',
          options: ['24 fps', '30 fps', '60 fps or higher', '15 fps'],
          correctIndex: 2,
          explanation: '60 fps gives double the frames, allowing 50% slow down without dropping frames or stuttering.'
        },
        isFreePreview: false,
      }
    ]
  },
  {
    id: 'crs_yt_02',
    slug: 'youtube-channel-growth-and-ai-automation',
    title: 'YouTube Channel Growth & AI Automation Blueprint',
    subtitle: 'From 0 to 100K Subscribers: CTR optimization, AI scriptwriting, viral thumbnails & revenue streams',
    description: 'Step-by-step system for launching and scaling high-retention YouTube channels using cutting-edge AI tools to research, write, and produce video content 5x faster.',
    category: 'YOUTUBE_GROWTH',
    categoryLabel: 'YouTube Growth',
    instructor: {
      name: 'Vikram Mehta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: 'Full-time Creator & YouTube Strategist',
    },
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    price: 199,
    originalPrice: 4999,
    isFree: false,
    rating: 4.8,
    reviewCount: 980,
    studentsEnrolled: 3200,
    durationHours: 8.0,
    lessonsCount: 3,
    level: 'All Levels',
    isNew: true,
    cheatSheetPdf: {
      title: 'YouTube CTR & Title Formulas Cheat Sheet (PDF)',
      fileSize: '3.8 MB',
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    learningOutcomes: [
      'Master YouTube algorithm metrics: CTR, AVD, and Session Duration',
      'Use ChatGPT & Claude to generate viral hooks and retention-packed scripts',
      'Create high-contrast, clickable thumbnails using free design tools',
      'Unlock 4 monetization methods beyond Google AdSense'
    ],
    published: true,
    createdAt: '2026-09-20',
    lessons: [
      {
        id: 'lsn_yt_01',
        courseId: 'crs_yt_02',
        title: '01. Decoding The YouTube Recommendation Engine in 2026',
        durationMinutes: 25,
        order: 1,
        type: 'video',
        videoType: 'youtube_unlisted',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
        isFreePreview: true,
      },
      {
        id: 'lsn_yt_02',
        courseId: 'crs_yt_02',
        title: '02. Generating High-CTR Title & Thumbnail Concepts with AI',
        durationMinutes: 30,
        order: 2,
        type: 'video',
        videoType: 'youtube_unlisted',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
        isFreePreview: false,
      }
    ]
  },
  {
    id: 'crs_ai_03',
    slug: 'how-to-earn-money-with-ai-freelancing',
    title: 'How to Earn ₹50,000+/Month with AI Freelancing',
    subtitle: 'Learn in-demand AI skills: Prompt engineering, AI copywriting, automated workflow services & gig templates',
    description: 'A complete practical roadmap for students and beginners to build a steady monthly income offering AI-powered services to global clients on Upwork, Fiverr, and LinkedIn.',
    category: 'AI_EARNING',
    categoryLabel: 'AI Earning',
    instructor: {
      name: 'Priya Nair',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      role: 'Top-Rated AI Freelancer & Consultant',
    },
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    price: 149,
    originalPrice: 3499,
    isFree: false,
    rating: 4.9,
    reviewCount: 2100,
    studentsEnrolled: 6400,
    durationHours: 7.2,
    lessonsCount: 2,
    level: 'Beginner',
    isBestseller: true,
    cheatSheetPdf: {
      title: 'Top 100 Copy-Paste AI Prompts for Freelance Client Work (PDF)',
      fileSize: '5.1 MB',
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    learningOutcomes: [
      'Build 5 sellable AI services: SEO content, AI voiceovers, thumbnail packs, data cleanup',
      'Create an irresistible Upwork and Fiverr profile with ready-to-use proposal templates',
      'Automate client deliverables with Zapier and Make.com',
      'Receive client payments directly via Bank/PayPal/Stripe'
    ],
    published: true,
    createdAt: '2026-09-10',
    lessons: [
      {
        id: 'lsn_ai_01',
        courseId: 'crs_ai_03',
        title: '01. The Highest Paying AI Micro-Services in 2026',
        durationMinutes: 20,
        order: 1,
        type: 'video',
        videoType: 'youtube_unlisted',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
        isFreePreview: true,
      }
    ]
  },
  {
    id: 'crs_trade_04',
    slug: 'stock-market-crypto-forex-price-action-foundations',
    title: 'Stock Market, Crypto & Forex: Disciplined Price Action',
    subtitle: 'Support & Resistance, Candlestick psychology, Risk sizing and Scenario planning without gambling',
    description: 'Learn institutional price action fundamentals across Indian equities, Crypto, and Forex markets. Focus strictly on risk management, capital protection, and high-probability setups.',
    category: 'TRADING_FINANCE',
    categoryLabel: 'Trading & Finance',
    instructor: {
      name: 'Aditya Singhania',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      role: 'Certified Market Analyst (10+ Yrs Exp)',
    },
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    price: 299,
    originalPrice: 7999,
    isFree: false,
    rating: 4.8,
    reviewCount: 1750,
    studentsEnrolled: 5120,
    durationHours: 9.5,
    lessonsCount: 3,
    level: 'Intermediate',
    cheatSheetPdf: {
      title: 'Top 16 Candlestick Patterns & S/R Breakout Cheatsheet (PDF)',
      fileSize: '6.4 MB',
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    learningOutcomes: [
      'Read pure price action charts without cluttering 20 indicators',
      'Calculate position size and risk-per-trade on every single execution',
      'Understand support/resistance flips, liquidity grabs and false breakouts',
      'Follow a structured trading journal and emotional discipline rules'
    ],
    published: true,
    createdAt: '2026-09-01',
    lessons: [
      {
        id: 'lsn_tr_01',
        courseId: 'crs_trade_04',
        title: '01. Capital Protection Rules: The 1% Risk Philosophy',
        durationMinutes: 30,
        order: 1,
        type: 'video',
        videoType: 'youtube_unlisted',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
        isFreePreview: true,
      }
    ]
  },
  {
    id: 'crs_sec_05',
    slug: 'instagram-social-media-security-account-defense',
    title: 'Social Media & Instagram Security: Account Defense Blueprint',
    subtitle: 'Protect your accounts against phishing, session hijacking, 2FA bypass and recovery methods',
    description: 'Comprehensive cybersecurity guide for creators, influencers, and businesses to lock down Instagram, Google, and WhatsApp accounts against modern social engineering threats.',
    category: 'CYBERSECURITY',
    categoryLabel: 'Security & Defense',
    instructor: {
      name: 'Karan Joshi',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      role: 'Certified Ethical Hacker (CEH) & Cyber Defense Specialist',
    },
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    price: 99,
    originalPrice: 2499,
    isFree: false,
    rating: 4.9,
    reviewCount: 840,
    studentsEnrolled: 2900,
    durationHours: 4.5,
    lessonsCount: 2,
    level: 'Beginner',
    isNew: true,
    learningOutcomes: [
      'Harden Instagram and email with hardware/app-based 2FA security keys',
      'Identify fake copyright DM scams and malicious login phishing portals',
      'Recover compromised social media handles with official escalation procedures',
      'Audit connected third-party apps and revoke dangerous permissions'
    ],
    published: true,
    createdAt: '2026-09-25',
    lessons: [
      {
        id: 'lsn_sec_01',
        courseId: 'crs_sec_05',
        title: '01. Anatomy of Social Engineering: How Accounts Actually Get Hijacked',
        durationMinutes: 20,
        order: 1,
        type: 'video',
        videoType: 'youtube_unlisted',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
        isFreePreview: true,
      }
    ]
  },
  {
    id: 'crs_fit_06',
    slug: 'gym-workout-and-supplement-science-guide',
    title: 'Gym Workout, Muscle Building & Supplement Science',
    subtitle: 'Evidence-based training splits, nutrition macros, protein intake & honest supplement breakdown',
    description: 'Cut through marketing hype. Learn the scientific principles of progressive overload, hyper-trophy nutrition, calorie management, and which supplements actually work vs waste money.',
    category: 'FITNESS_HEALTH',
    categoryLabel: 'Gym & Fitness',
    instructor: {
      name: 'Dr. Sameer Khan',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      role: 'Sports Nutritionist & Strength Coach',
    },
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    price: 99,
    originalPrice: 1999,
    isFree: false,
    rating: 4.8,
    reviewCount: 1120,
    studentsEnrolled: 3800,
    durationHours: 5.0,
    lessonsCount: 2,
    level: 'Beginner',
    cheatSheetPdf: {
      title: 'Full Body Push-Pull-Legs Workout & Macro Diet Chart (PDF)',
      fileSize: '4.9 MB',
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    learningOutcomes: [
      'Design your personalized Push-Pull-Legs or Upper-Lower workout split',
      'Calculate exact daily protein, carbohydrate and healthy fat requirements',
      'Unbiased analysis: Creatine, Whey Protein, Pre-workouts, Multivitamins',
      'Avoid common joint injuries through proper squat and bench press biomechanics'
    ],
    published: true,
    createdAt: '2026-09-18',
    lessons: [
      {
        id: 'lsn_fit_01',
        courseId: 'crs_fit_06',
        title: '01. Progressive Overload: The Only Rule That Builds Muscle',
        durationMinutes: 22,
        order: 1,
        type: 'video',
        videoType: 'youtube_unlisted',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
        isFreePreview: true,
      }
    ]
  }
];

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp_01',
    title: 'Short-Form Video Editor for Tech YouTube Channel (150K Subs)',
    companyOrPlatform: 'TechBytes Media',
    category: 'FREELANCING',
    categoryLabel: 'Freelance Gig',
    payoutRange: '₹1,500 – ₹2,500 per Reel',
    difficulty: 'Beginner',
    timeRequired: '3-4 hrs / week',
    deadline: 'Rolling Applications',
    verified: true,
    tags: ['CapCut', 'Premiere Pro', 'Subtitles', 'Remote'],
    whyMatchesYou: 'Matches your CapCut video editing skillset and high demand for Hindi tech reels.',
    description: 'Looking for a skilled short-form video editor to convert 10-minute long YouTube videos into high-energy 60-second Instagram Reels & YouTube Shorts with dynamic captions and sound effects.',
    requirements: ['Experience with CapCut/Premiere', 'Fast turnaround (24h)', 'Portfolio of 3 sample reels'],
    applyUrl: 'https://wa.me/?text=Hi%20I%20am%20applying%20for%20the%20Video%20Editor%20Role'
  },
  {
    id: 'opp_02',
    title: 'AI Content Prompt Engineer & SEO Writer Intern',
    companyOrPlatform: 'ScaleFast Digital Agency',
    category: 'INTERNSHIPS',
    categoryLabel: 'Paid Internship',
    payoutRange: '₹12,000 – ₹18,000 / month',
    difficulty: 'Beginner',
    timeRequired: 'Part-time Remote (20h/week)',
    deadline: 'Oct 30, 2026',
    verified: true,
    tags: ['ChatGPT', 'SEO Writing', 'AI Workflows', 'Stipend'],
    whyMatchesYou: 'Ideal for students learning prompt engineering and content optimization.',
    description: 'Assist our marketing team in crafting structured prompt chains, writing in-depth tech comparison articles, and verifying factual data using generative AI tools.',
    requirements: ['Good written English', 'Basic familiarity with ChatGPT / Claude', 'College student in any year'],
    applyUrl: 'https://google.com'
  },
  {
    id: 'opp_03',
    title: 'Stock Market Research & Equity Data Analyst Intern',
    companyOrPlatform: 'FinSight Research Labs',
    category: 'INTERNSHIPS',
    categoryLabel: 'Research Internship',
    payoutRange: '₹15,000 / month + Certificate',
    difficulty: 'Intermediate',
    timeRequired: 'Flexible (15h/week)',
    deadline: 'Nov 15, 2026',
    verified: true,
    tags: ['NIFTY', 'Financial Modeling', 'Excel', 'Trading'],
    whyMatchesYou: 'Matches your interest in Indian equities and risk scenario analysis.',
    description: 'Track daily corporate announcements, quarterly earnings results, and build weekly sector intelligence reports for renewable energy and tech equities.',
    requirements: ['Understanding of P/E, EPS, balance sheet basics', 'Attention to detail', 'Excel/Sheets proficiency'],
    applyUrl: 'https://google.com'
  }
];

export const mockCreatorAssets: CreatorAsset[] = [
  {
    id: 'ast_01',
    title: '500+ Viral Sound FX Mega Pack (Whooshes, Pops, Risers, Bass Drops)',
    category: 'SOUND_FX',
    categoryLabel: 'Sound Effects Pack',
    description: 'High quality 24-bit WAV & MP3 sound effects used by top Instagram & YouTube creators to make videos 10x more engaging.',
    downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    fileSize: '84 MB (ZIP)',
    downloadsCount: 14290,
    isPro: false,
    tags: ['WAV/MP3', 'Royalty-Free', 'CapCut & Premiere Ready']
  },
  {
    id: 'ast_02',
    title: 'Top 25 Cinematic 4K LUTs (Teal & Orange, Moody Dark, Film Grain)',
    category: 'LUTS_PRESETS',
    categoryLabel: 'Color Grading LUTs',
    description: 'One-click professional color grading presets (.cube files) compatible with CapCut PC, VN Editor, Premiere Pro, and DaVinci Resolve.',
    downloadUrl: 'https://example.com/assets/cinematic-luts.zip',
    fileSize: '18 MB (ZIP)',
    downloadsCount: 9820,
    isPro: false,
    tags: ['.CUBE', 'CapCut/Premiere', '4K Verified']
  },
  {
    id: 'ast_03',
    title: 'Curated Free & Open-Source Creator Toolkit (100% Legal & Free)',
    category: 'FREE_AI_TOOLS',
    categoryLabel: 'Free Pro Tools Directory',
    description: 'Directory of the best 100% free open-source alternatives: CapCut desktop plugins, Audacity AI noise removal, HandBrake 4K compressor, and OBS studio presets.',
    downloadUrl: 'https://github.com',
    fileSize: 'Web Hub',
    downloadsCount: 24500,
    isPro: false,
    tags: ['Open-Source', 'Zero Cost', 'Free Forever']
  }
];

export const mockCommunityMessages: CommunityMessage[] = [
  {
    id: 'msg_01',
    channelId: 'general',
    userId: 'usr_002',
    userName: 'Rahul Deshmukh',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    userBadge: 'Top Student 🏆',
    text: 'Guys I just closed my first video editing client on Instagram for ₹2,000 per reel using the CapCut hooks taught in Module 2! 🎉',
    timestamp: '10 mins ago',
    likes: 24
  },
  {
    id: 'msg_02',
    channelId: 'general',
    userId: 'usr_003',
    userName: 'Sneha Kapoor',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    userBadge: 'Creator',
    text: 'Congratulations Rahul! Make sure to deliver on time and ask for a video testimonial for your portfolio.',
    timestamp: '7 mins ago',
    likes: 12
  },
  {
    id: 'msg_03',
    channelId: 'trading',
    userId: 'usr_004',
    userName: 'Amit Patel',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    userBadge: 'Trader',
    text: 'Tata Power hit the resistance scenario ₹448 today exactly as outlined in the morning AI analysis! Discipline pays off 📊',
    timestamp: '15 mins ago',
    likes: 19
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif_01',
    title: '🚀 New CapCut Course Update Published',
    message: 'Module 4 & Downloadable Viral Reel Checklist PDF is now live for all enrolled students.',
    category: 'COURSE',
    categoryLabel: 'Course Update',
    deepLink: '/courses/crs_capcut_01',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'notif_02',
    title: '📈 Morning Market Intelligence Ready',
    message: 'NIFTY 50 opens +142 pts higher. Check scenario risk breakdown for Tata Power & IREDA.',
    category: 'MARKET',
    categoryLabel: 'Market Alert',
    deepLink: '/market',
    timestamp: '4 hours ago',
    read: false
  },
  {
    id: 'notif_03',
    title: '💼 New Video Editor Freelance Gig Added',
    message: 'TechBytes Media is hiring short-form reel editors (₹1,500 - ₹2,500/reel). Apply before spots fill.',
    category: 'OPPORTUNITY',
    categoryLabel: 'Earning Opportunity',
    deepLink: '/opportunities',
    timestamp: '1 day ago',
    read: true
  }
];
