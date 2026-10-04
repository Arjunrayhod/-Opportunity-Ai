import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Course,
  MarketIndex,
  StockQuote,
  Opportunity,
  CreatorAsset,
  CommunityMessage,
  NotificationItem,
  RiskCalculatorInput,
  RiskCalculatorResult,
  UserRole,
  OrderRecord,
  DirectChatMessage
} from '../types';
import {
  initialUser,
  initialMockUsers,
  initialOrders,
  marketIndices,
  trendingStocks,
  mockCourses,
  mockOpportunities,
  mockCreatorAssets,
  mockCommunityMessages,
  mockNotifications
} from '../data/mockData';
import { 
  checkAndRun24hAiScan, 
  runAiDailyMarketScan, 
  createDailyScanNotification, 
  liveMarketNewsFeed, 
  AiAgentScanResult, 
  MarketNewsItem 
} from '../services/aiMarketAgentService';
import { 
  PaymentSettings, 
  getStoredPaymentSettings, 
  savePaymentSettings, 
  defaultPaymentSettings 
} from '../services/paymentService';

interface AppContextType {
  user: User;
  courses: Course[];
  orders: OrderRecord[];
  marketIndices: MarketIndex[];
  stocks: StockQuote[];
  aiAgentScanResult: AiAgentScanResult;
  marketNewsFeed: MarketNewsItem[];
  runManualAiScan: () => Promise<AiAgentScanResult>;
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (settings: PaymentSettings) => void;
  submitCoursePaymentWithUtr: (course: Course, studentPhone: string, utrNumber: string) => Promise<{ success: boolean; orderId: string }>;
  approveOrderAndUnlockCourse: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  opportunities: Opportunity[];
  creatorAssets: CreatorAsset[];
  communityMessages: CommunityMessage[];
  directChatMessages: DirectChatMessage[];
  adminOnlineStatus: boolean;
  setAdminOnlineStatus: (status: boolean) => void;
  sendDirectMessage: (text: string) => void;
  sendAdminDirectReply: (userId: string, replyText: string) => void;
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  activeChannel: string;
  setActiveChannel: (channel: string) => void;
  // Auth & Account Management
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginAsUser: (targetUser: User) => void;
  loginWithCredentials: (emailOrPhone: string) => boolean;
  registerNewUser: (userData: { name: string; email: string; phone: string }) => User;
  logoutUser: () => void;
  // User Actions
  switchRole: (role: UserRole) => void;
  enrollInCourse: (courseId: string) => void;
  purchaseCourseWithRazorpay: (course: Course, studentPhone?: string) => Promise<{ success: boolean; orderId: string }>;
  toggleSaveOpportunity: (oppId: string) => void;
  toggleWatchlist: (ticker: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendCommunityMessage: (channelId: string, text: string) => void;
  likeCommunityMessage: (messageId: string) => void;
  // Admin CMS & Student Management Actions
  allUsers: User[];
  updateStudentUser: (userId: string, updatedData: Partial<User>) => void;
  grantCourseToStudent: (userId: string, courseId: string) => void;
  revokeCourseFromStudent: (userId: string, courseId: string) => void;
  deleteStudent: (userId: string) => void;
  addCourse: (course: Partial<Course>) => void;
  updateCourse: (id: string, updatedData: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  sendAdminNotification: (notif: { title: string; message: string; category: any; deepLink: string }) => void;
  addOpportunity: (opp: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  exportOrdersToCSV: () => void;
  exportFullDatabaseBackup: () => void;
  importDatabaseBackup: (jsonContent: string) => boolean;
  // Risk Calculator
  calculateRisk: (input: RiskCalculatorInput) => RiskCalculatorResult;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'aiopp_user_v7',
  ALL_USERS: 'aiopp_all_users_v8',
  COURSES: 'aiopp_courses_v7',
  ORDERS: 'aiopp_orders_v7',
  OPPORTUNITIES: 'aiopp_opportunities_v7',
  NOTIFICATIONS: 'aiopp_notifs_v7',
  MESSAGES: 'aiopp_messages_v7',
  DIRECT_CHATS: 'aiopp_direct_chats_v8',
  ADMIN_ONLINE: 'aiopp_admin_online_v8',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');

    // Clean up older stale caches
    ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'].forEach(v => {
      localStorage.removeItem(`aiopp_courses_${v}`);
      localStorage.removeItem(`aiopp_user_${v}`);
      localStorage.removeItem(`aiopp_orders_${v}`);
    });
  }, []);

  // Load from local storage or fallback to initial mocks
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return initialMockUsers;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (saved) {
      try {
        const parsed: Course[] = JSON.parse(saved);
        const hasStaleUrls = parsed.some(c => c.lessons?.some(l => l.videoUrl?.includes('gtv-videos-bucket') || l.videoUrl?.includes('commondatastorage')));
        if (!hasStaleUrls && parsed.length >= mockCourses.length) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return mockCourses;
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
    return saved ? JSON.parse(saved) : mockOpportunities;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [communityMessages, setCommunityMessages] = useState<CommunityMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : mockCommunityMessages;
  });

  // Direct Student-to-Admin Live Chat State
  const [directChatMessages, setDirectChatMessages] = useState<DirectChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DIRECT_CHATS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'msg_welcome_adm',
        userId: 'usr_default',
        userName: 'Satvik (Admin)',
        sender: 'admin',
        text: 'Namaste! Welcome to Opportunity AI. Aap yahan direct mujhse (Admin/Mentor) query pooch sakte hain.',
        timestamp: 'Yesterday',
        read: true
      }
    ];
  });

  const [adminOnlineStatus, setAdminOnlineStatus] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_ONLINE);
    return saved ? JSON.parse(saved) : false; // Default: offline
  });

  const sendDirectMessage = (text: string) => {
    if (!text.trim()) return;
    const cleanText = text.trim();
    const userMsg: DirectChatMessage = {
      id: `msg_usr_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      sender: 'user',
      text: cleanText,
      timestamp: 'Just now',
      read: false
    };

    // User Message
    setDirectChatMessages(prev => [...prev, userMsg]);

    // In-App Notification for Admin
    const adminNotif: NotificationItem = {
      id: `notif_adm_chat_${Date.now()}`,
      title: `💬 New Message from ${user.name}`,
      message: cleanText,
      category: 'ANNOUNCEMENT',
      categoryLabel: 'Student Chat',
      deepLink: '/admin',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [adminNotif, ...prev]);

    // Automated default reply when admin is offline
    setTimeout(() => {
      const autoReply: DirectChatMessage = {
        id: `msg_adm_auto_${Date.now()}`,
        userId: user.id,
        userName: 'Satvik (Admin)',
        sender: 'admin',
        text: 'Admin currently offline',
        timestamp: 'Just now',
        read: false
      };
      setDirectChatMessages(prev => [...prev, autoReply]);
    }, 400);
  };

  const sendAdminDirectReply = (targetUserId: string, replyText: string) => {
    if (!replyText.trim()) return;
    const adminMsg: DirectChatMessage = {
      id: `msg_adm_${Date.now()}`,
      userId: targetUserId,
      userName: 'Satvik (Admin)',
      sender: 'admin',
      text: replyText.trim(),
      timestamp: 'Just now',
      read: false
    };

    setDirectChatMessages(prev => [...prev, adminMsg]);

    // Student notification
    const studentNotif: NotificationItem = {
      id: `notif_std_reply_${Date.now()}`,
      title: `💬 Admin Replied to Your Message`,
      message: replyText.trim(),
      category: 'COURSE',
      categoryLabel: 'Admin Reply',
      deepLink: '/',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [studentNotif, ...prev]);
  };

  // 24h AI Market Agent State
  const initialScan = checkAndRun24hAiScan();
  const [aiAgentScanResult, setAiAgentScanResult] = useState<AiAgentScanResult>(initialScan.result);
  const [stocks, setStocks] = useState<StockQuote[]>(initialScan.result.topRecommendedStocks);

  // Check 24h scan on mount and append notification if fresh
  useEffect(() => {
    const { hasRun, result } = checkAndRun24hAiScan();
    setAiAgentScanResult(result);
    setStocks(result.topRecommendedStocks);
    if (hasRun && result.topRecommendedStocks.length > 0) {
      const dailyNotif = createDailyScanNotification(result.topRecommendedStocks[0]);
      setNotifications(prev => {
        if (!prev.some(n => n.id === dailyNotif.id)) {
          return [dailyNotif, ...prev];
        }
        return prev;
      });
    }
  }, []);

  const runManualAiScan = async (): Promise<AiAgentScanResult> => {
    const freshResult = runAiDailyMarketScan();
    setAiAgentScanResult(freshResult);
    setStocks(freshResult.topRecommendedStocks);
    if (freshResult.topRecommendedStocks.length > 0) {
      const notif = createDailyScanNotification(freshResult.topRecommendedStocks[0]);
      setNotifications(prev => [notif, ...prev]);
    }
    return freshResult;
  };

  const [activeChannel, setActiveChannel] = useState<string>('general');

  // Permanent Storage Synchronization
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(communityMessages));
  }, [communityMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DIRECT_CHATS, JSON.stringify(directChatMessages));
  }, [directChatMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_ONLINE, JSON.stringify(adminOnlineStatus));
  }, [adminOnlineStatus]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loginAsUser = (targetUser: User) => {
    setUser(targetUser);
    setIsAuthModalOpen(false);
    const notif: NotificationItem = {
      id: `notif_login_${Date.now()}`,
      title: `👋 Welcome back, ${targetUser.name.split(' ')[0]}!`,
      message: `You are now logged in as ${targetUser.role === 'SUPER_ADMIN' ? 'Super Admin' : targetUser.name}.`,
      category: 'ANNOUNCEMENT',
      categoryLabel: 'Account Login',
      deepLink: '/profile',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const loginWithCredentials = (emailOrPhone: string): boolean => {
    const clean = emailOrPhone.trim().toLowerCase();
    const matched = allUsers.find(
      u => u.email.toLowerCase() === clean || (u.phone && u.phone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, '')))
    );

    if (matched) {
      loginAsUser(matched);
      return true;
    }
    return false;
  };

  const registerNewUser = (userData: { name: string; email: string; phone: string }): User => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.trim(),
      phone: userData.phone.trim() || '+91 98765 43210',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      role: 'USER',
      level: 1,
      streakDays: 1,
      streakCoins: 50,
      referralCode: userData.name.slice(0, 4).toUpperCase() + '99',
      referralsCount: 0,
      walletBalance: 25,
      interests: ['Video Editing', 'AI Tools', 'YouTube Growth'],
      enrolledCourseIds: [],
      savedOpportunityIds: [],
      watchlistTickers: ['TATAPOWER'],
      isPremium: false
    };

    setAllUsers(prev => [newUser, ...prev]);
    setUser(newUser);
    setIsAuthModalOpen(false);

    const welcomeNotif: NotificationItem = {
      id: `notif_welcome_${Date.now()}`,
      title: `🎉 Welcome to Opportunity AI, ${newUser.name}!`,
      message: `Your account has been created. 50 bonus coins have been added to your profile!`,
      category: 'ANNOUNCEMENT',
      categoryLabel: 'New Account',
      deepLink: '/profile',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [welcomeNotif, ...prev]);

    return newUser;
  };

  const logoutUser = () => {
    // Switch to default user / guest and prompt login modal
    setUser({
      id: 'usr_guest',
      name: 'Guest Learner',
      email: 'guest@opportunity.ai',
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'USER',
      level: 1,
      streakDays: 0,
      streakCoins: 0,
      referralCode: 'GUEST',
      referralsCount: 0,
      walletBalance: 0,
      interests: [],
      enrolledCourseIds: [],
      savedOpportunityIds: [],
      watchlistTickers: [],
      isPremium: false
    });
    setIsAuthModalOpen(true);
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const switchRole = (role: UserRole) => {
    setUser(prev => ({ ...prev, role }));
  };

  const enrollInCourse = (courseId: string) => {
    if (!user.enrolledCourseIds.includes(courseId)) {
      setUser(prev => ({
        ...prev,
        enrolledCourseIds: [...prev.enrolledCourseIds, courseId]
      }));
    }
  };

  // Creator Payment & UPI Settings
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => getStoredPaymentSettings());

  const updatePaymentSettings = (newSettings: PaymentSettings) => {
    setPaymentSettings(newSettings);
    savePaymentSettings(newSettings);
  };

  const submitCoursePaymentWithUtr = async (
    course: Course,
    studentPhone: string,
    utrNumber: string
  ): Promise<{ success: boolean; orderId: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderId = `upi_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substring(2, 6)}`;
        
        const newOrder: OrderRecord = {
          id: `ord_${Date.now()}`,
          orderId,
          courseId: course.id,
          courseTitle: course.title,
          amount: course.price,
          studentId: user.id,
          studentName: user.name,
          studentEmail: user.email,
          studentPhone: studentPhone || user.phone || '+91 98765 43210',
          paymentMethod: 'UPI',
          paymentGateway: 'UPI_QR',
          utrNumber: utrNumber.trim(),
          status: 'PENDING_VERIFICATION',
          purchasedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };

        setOrders(prev => [newOrder, ...prev]);

        // Notification for student
        const studentNotif: NotificationItem = {
          id: `notif_${Date.now()}`,
          title: `⏳ Payment Submitted: ${course.title}`,
          message: `Your payment (UTR: ${utrNumber}) is under verification. Course will unlock as soon as funds arrive in creator account.`,
          category: 'COURSE',
          categoryLabel: 'Payment Submitted',
          deepLink: `/courses/${course.id}`,
          timestamp: 'Just now',
          read: false
        };

        // Notification for Admin
        const adminNotif: NotificationItem = {
          id: `notif_admin_${Date.now()}`,
          title: `💰 New UPI Order: ₹${course.price} for ${course.title}`,
          message: `Student: ${user.name} (${studentPhone}). UTR Number: ${utrNumber}. Verify bank credit and approve in Admin panel.`,
          category: 'ANNOUNCEMENT',
          categoryLabel: 'New Sale',
          deepLink: `/admin`,
          timestamp: 'Just now',
          read: false
        };

        setNotifications(prev => [studentNotif, adminNotif, ...prev]);

        resolve({ success: true, orderId });
      }, 600);
    });
  };

  const purchaseCourseWithRazorpay = async (
    course: Course,
    studentPhone?: string
  ): Promise<{ success: boolean; orderId: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderId = `rzp_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substring(2, 6)}`;
        
        const newOrder: OrderRecord = {
          id: `ord_${Date.now()}`,
          orderId,
          courseId: course.id,
          courseTitle: course.title,
          amount: course.price,
          studentId: user.id,
          studentName: user.name,
          studentEmail: user.email,
          studentPhone: studentPhone || user.phone || '+91 98765 43210',
          paymentMethod: 'UPI',
          paymentGateway: 'Razorpay',
          status: 'PENDING_VERIFICATION',
          purchasedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };

        setOrders(prev => [newOrder, ...prev]);
        resolve({ success: true, orderId });
      }, 500);
    });
  };

  const approveOrderAndUnlockCourse = (orderId: string) => {
    const targetOrder = orders.find(o => o.orderId === orderId || o.id === orderId);
    if (!targetOrder) return;

    // Update order status
    setOrders(prev => prev.map(o => (o.orderId === orderId || o.id === orderId) ? {
      ...o,
      status: 'SUCCESS',
      verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    } : o));

    // Unlock course for student
    enrollInCourse(targetOrder.courseId);

    // Increment course enrolled count
    setCourses(prev => prev.map(c => c.id === targetOrder.courseId ? { ...c, studentsEnrolled: c.studentsEnrolled + 1 } : c));

    // Send congratulatory notification
    const successNotif: NotificationItem = {
      id: `notif_approved_${Date.now()}`,
      title: `🎉 Course Access Unlocked: ${targetOrder.courseTitle}`,
      message: `Your payment has been verified! Full course video lessons, templates and certificates are now active.`,
      category: 'COURSE',
      categoryLabel: 'Access Granted',
      deepLink: `/courses/${targetOrder.courseId}`,
      timestamp: 'Just now',
      read: false
    };

    setNotifications(prev => [successNotif, ...prev]);
  };

  const rejectOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => (o.orderId === orderId || o.id === orderId) ? {
      ...o,
      status: 'REJECTED'
    } : o));
  };

  const toggleSaveOpportunity = (oppId: string) => {
    setUser(prev => {
      const exists = prev.savedOpportunityIds.includes(oppId);
      return {
        ...prev,
        savedOpportunityIds: exists
          ? prev.savedOpportunityIds.filter(id => id !== oppId)
          : [...prev.savedOpportunityIds, oppId]
      };
    });
  };

  const toggleWatchlist = (ticker: string) => {
    setUser(prev => {
      const exists = prev.watchlistTickers.includes(ticker);
      return {
        ...prev,
        watchlistTickers: exists
          ? prev.watchlistTickers.filter(t => t !== ticker)
          : [...prev.watchlistTickers, ticker]
      };
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const sendCommunityMessage = (channelId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: CommunityMessage = {
      id: `msg_${Date.now()}`,
      channelId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userBadge: user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'Instructor 🎓' : 'Learner ⭐',
      text: text.trim(),
      timestamp: 'Just now',
      likes: 0
    };
    setCommunityMessages(prev => [...prev, newMsg]);
  };

  const likeCommunityMessage = (messageId: string) => {
    setCommunityMessages(prev => prev.map(m => m.id === messageId ? { ...m, likes: m.likes + 1 } : m));
  };

  const updateStudentUser = (userId: string, updatedData: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    if (user.id === userId) {
      setUser(prev => ({ ...prev, ...updatedData }));
    }
  };

  const grantCourseToStudent = (userId: string, courseId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId && !u.enrolledCourseIds.includes(courseId)) {
        return { ...u, enrolledCourseIds: [...u.enrolledCourseIds, courseId] };
      }
      return u;
    }));
    if (user.id === userId && !user.enrolledCourseIds.includes(courseId)) {
      setUser(prev => ({ ...prev, enrolledCourseIds: [...prev.enrolledCourseIds, courseId] }));
    }
  };

  const revokeCourseFromStudent = (userId: string, courseId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, enrolledCourseIds: u.enrolledCourseIds.filter(id => id !== courseId) };
      }
      return u;
    }));
    if (user.id === userId) {
      setUser(prev => ({ ...prev, enrolledCourseIds: prev.enrolledCourseIds.filter(id => id !== courseId) }));
    }
  };

  const deleteStudent = (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Admin Actions
  const addCourse = (courseData: Partial<Course>) => {
    const newCourse: Course = {
      id: `crs_${Date.now()}`,
      slug: (courseData.title || 'new-course').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: courseData.title || 'Untitled Course',
      subtitle: courseData.subtitle || 'Learn high-demand creator and tech skills',
      description: courseData.description || 'Comprehensive step by step lessons.',
      category: courseData.category || 'VIDEO_EDITING',
      categoryLabel: courseData.categoryLabel || 'Creator Skills',
      instructor: courseData.instructor || {
        name: user.name,
        avatar: user.avatar,
        role: 'Lead Mentor',
      },
      thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      price: courseData.price ?? 99,
      originalPrice: courseData.originalPrice ?? 1999,
      isFree: courseData.isFree ?? false,
      rating: 5.0,
      reviewCount: 1,
      studentsEnrolled: 0,
      durationHours: courseData.durationHours ?? 3.5,
      lessonsCount: courseData.lessons?.length || 1,
      level: courseData.level || 'Beginner',
      isNew: true,
      learningOutcomes: courseData.learningOutcomes || ['Practical step-by-step guidance'],
      published: courseData.published ?? true,
      createdAt: new Date().toISOString().split('T')[0],
      lessons: courseData.lessons || [
        {
          id: `lsn_${Date.now()}_1`,
          courseId: `crs_${Date.now()}`,
          title: '01. Getting Started & Introduction',
          durationMinutes: 15,
          order: 1,
          type: 'video',
          videoType: 'youtube_unlisted',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
          isFreePreview: true,
        }
      ]
    };

    setCourses(prev => [newCourse, ...prev]);

    // Send instant in-app notification to all students
    sendAdminNotification({
      title: `🎓 New Course Launched: ${newCourse.title}`,
      message: `Enrolled pricing special available at just ₹${newCourse.price}! Start learning today.`,
      category: 'COURSE',
      deepLink: `/courses/${newCourse.id}`
    });
  };

  const updateCourse = (id: string, updatedData: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const sendAdminNotification = (notif: { title: string; message: string; category: any; deepLink: string }) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: notif.title,
      message: notif.message,
      category: notif.category,
      categoryLabel: notif.category === 'COURSE' ? 'New Course' : 'Announcement',
      deepLink: notif.deepLink,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addOpportunity = (opp: Partial<Opportunity>) => {
    const newOpp: Opportunity = {
      id: `opp_${Date.now()}`,
      title: opp.title || 'New Student Opportunity',
      companyOrPlatform: opp.companyOrPlatform || 'Verified Platform',
      category: opp.category || 'FREELANCING',
      categoryLabel: opp.categoryLabel || 'Freelance Gig',
      payoutRange: opp.payoutRange || '₹1,000 – ₹5,000',
      difficulty: opp.difficulty || 'Beginner',
      timeRequired: opp.timeRequired || 'Flexible',
      deadline: opp.deadline || 'Open until filled',
      verified: true,
      tags: opp.tags || ['Remote', 'Student-Friendly'],
      whyMatchesYou: opp.whyMatchesYou || 'Matches your profile interests.',
      description: opp.description || 'Opportunity details.',
      requirements: opp.requirements || ['Enthusiasm to learn'],
      applyUrl: opp.applyUrl || 'https://google.com'
    };
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities(prev => prev.filter(o => o.id !== id));
  };

  // Export Sales & Buyer CRM to Excel CSV
  const exportOrdersToCSV = () => {
    const headers = ['Order ID,Course Title,Student Name,Student Email,Student Phone,Amount (INR),Payment Method,Date,Status'];
    const rows = orders.map(o => 
      `"${o.orderId}","${o.courseTitle.replace(/"/g, '""')}","${o.studentName}","${o.studentEmail}","${o.studentPhone}",${o.amount},"${o.paymentMethod}","${o.purchasedAt}","${o.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Course_Buyers_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1-Click Complete Database Backup to JSON file
  const exportFullDatabaseBackup = () => {
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      courses,
      orders,
      opportunities,
      notifications,
      communityMessages
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `App_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Restore Database from JSON
  const importDatabaseBackup = (jsonContent: string): boolean => {
    try {
      const data = JSON.parse(jsonContent);
      if (data.courses) setCourses(data.courses);
      if (data.orders) setOrders(data.orders);
      if (data.opportunities) setOpportunities(data.opportunities);
      if (data.notifications) setNotifications(data.notifications);
      if (data.communityMessages) setCommunityMessages(data.communityMessages);
      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  };

  // Position & Risk Calculator
  const calculateRisk = (input: RiskCalculatorInput): RiskCalculatorResult => {
    const { budget, entryPrice, stopLossPrice, targetPrice } = input;
    
    const riskPerShare = Math.abs(entryPrice - stopLossPrice);
    const rewardPerShare = Math.abs(targetPrice - entryPrice);
    
    const maxSharesByBudget = entryPrice > 0 ? Math.floor(budget / entryPrice) : 0;
    const suggestedQuantity = Math.max(1, maxSharesByBudget);

    const riskAmount = riskPerShare * suggestedQuantity;
    const riskPercent = budget > 0 ? (riskAmount / budget) * 100 : 0;

    const potentialProfit = rewardPerShare * suggestedQuantity;
    const profitPercent = budget > 0 ? (potentialProfit / budget) * 100 : 0;

    const rewardRiskRatio = riskAmount > 0 ? Number((potentialProfit / riskAmount).toFixed(2)) : 0;

    return {
      riskAmount: Number(riskAmount.toFixed(2)),
      riskPercent: Number(riskPercent.toFixed(1)),
      potentialProfit: Number(potentialProfit.toFixed(2)),
      profitPercent: Number(profitPercent.toFixed(1)),
      rewardRiskRatio,
      suggestedQuantity,
      disclaimer: 'Example scenario based on input parameters. Not financial advice or guaranteed return. Markets involve capital risk.'
    };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        courses,
        orders,
        marketIndices,
        stocks,
        aiAgentScanResult,
        marketNewsFeed: liveMarketNewsFeed,
        runManualAiScan,
        paymentSettings,
        updatePaymentSettings,
        submitCoursePaymentWithUtr,
        approveOrderAndUnlockCourse,
        rejectOrder,
        opportunities,
        creatorAssets: mockCreatorAssets,
        communityMessages,
        directChatMessages,
        adminOnlineStatus,
        setAdminOnlineStatus,
        sendDirectMessage,
        sendAdminDirectReply,
        notifications,
        unreadNotifsCount,
        activeChannel,
        setActiveChannel,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginAsUser,
        loginWithCredentials,
        registerNewUser,
        logoutUser,
        switchRole,
        enrollInCourse,
        purchaseCourseWithRazorpay,
        toggleSaveOpportunity,
        toggleWatchlist,
        markNotificationRead,
        markAllNotificationsRead,
        sendCommunityMessage,
        likeCommunityMessage,
        allUsers,
        updateStudentUser,
        grantCourseToStudent,
        revokeCourseFromStudent,
        deleteStudent,
        addCourse,
        updateCourse,
        deleteCourse,
        sendAdminNotification,
        addOpportunity,
        deleteOpportunity,
        exportOrdersToCSV,
        exportFullDatabaseBackup,
        importDatabaseBackup,
        calculateRisk
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
