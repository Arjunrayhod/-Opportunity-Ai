import React, { useState } from 'react';
import {
  Shield,
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Send,
  Download,
  Upload,
  Users,
  DollarSign,
  TrendingUp,
  Bell,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Database,
  Smartphone,
  Video,
  Layers,
  Sparkles,
  ArrowLeft,
  QrCode,
  Check,
  Clock,
  XCircle,
  MessageCircle,
  Settings,
  AlertCircle,
  UserCheck,
  Power,
  Image,
  Search,
  Key,
  Unlock,
  Lock,
  ExternalLink,
  Briefcase,
  MapPin,
  FileText,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldAlert,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Course, CourseCategory, Lesson, OrderRecord, User, UserRole, Opportunity } from '../types';
import { adminUser } from '../data/mockData';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const {
    courses,
    opportunities,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity,
    orders,
    notifications,
    addCourse,
    updateCourse,
    deleteCourse,
    sendAdminNotification,
    exportOrdersToCSV,
    exportFullDatabaseBackup,
    importDatabaseBackup,
    paymentSettings,
    updatePaymentSettings,
    approveOrderAndUnlockCourse,
    rejectOrder,
    directChatMessages,
    adminOnlineStatus,
    setAdminOnlineStatus,
    sendAdminDirectReply,
    allUsers,
    updateStudentUser,
    grantCourseToStudent,
    revokeCourseFromStudent,
    deleteStudent,
    loginAsUser,
    user
  } = useApp();

  // Master Admin Security Gate State (Restricted by specific ID & Password)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return user.role === 'SUPER_ADMIN' && (user.email === 'satvikbhai@opportunity.ai' || user.email === 'satvikbhai@ybl');
  });
  const [adminIdInput, setAdminIdInput] = useState('');
  const [adminPassInput, setAdminPassInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'COURSES' | 'GIGS' | 'USERS' | 'CHATS' | 'ORDERS' | 'SETTINGS' | 'NOTIFICATIONS' | 'BACKUP'
  >('USERS');

  const [orderFilter, setOrderFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showNotifModal, setShowNotifModal] = useState(false);

  // Student Gigs Management State
  const [showAddGigModal, setShowAddGigModal] = useState(false);
  const [showEditGigModal, setShowEditGigModal] = useState(false);
  const [editingGig, setEditingGig] = useState<Opportunity | null>(null);
  const [gigSearchQuery, setGigSearchQuery] = useState('');
  
  // Gig Form State
  const [gigTitle, setGigTitle] = useState('');
  const [gigCompany, setGigCompany] = useState('');
  const [gigCategory, setGigCategory] = useState<'FREELANCING' | 'INTERNSHIPS' | 'HACKATHONS' | 'REMOTE_JOBS' | 'AI_GIGS' | 'CONTENT_CREATION'>('CONTENT_CREATION');
  const [gigPayout, setGigPayout] = useState('₹1,500 – ₹4,000 / project');
  const [gigDifficulty, setGigDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [gigTimeRequired, setGigTimeRequired] = useState('Flexible (2-3 hrs daily)');
  const [gigDeadline, setGigDeadline] = useState('Open for 5 Students');
  const [gigTags, setGigTags] = useState('CapCut, Video Editing, Reels');
  const [gigDescription, setGigDescription] = useState('Looking for student video editors to edit 3-5 Instagram Reels & YouTube Shorts weekly.');
  const [gigRequirements, setGigRequirements] = useState('Basic CapCut or Premiere Pro\nFast 24-hr turnaround\nActive WhatsApp communication');
  const [gigApplyUrl, setGigApplyUrl] = useState('https://wa.me/919876543210?text=Hi%20I%20am%20applying%20for%20the%20student%20gig');
  const [gigSendBroadcast, setGigSendBroadcast] = useState(true);

  // User Management State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [grantSelections, setGrantSelections] = useState<{ [userId: string]: string }>({});

  // Chat CRM State
  const [selectedChatUserId, setSelectedChatUserId] = useState<string>(user.id);
  const [adminReplyInput, setAdminReplyInput] = useState('');

  // UPI / Payment & Platform Settings Form
  const [upiIdInput, setUpiIdInput] = useState(paymentSettings.upiId);
  const [payeeNameInput, setPayeeNameInput] = useState(paymentSettings.payeeName);
  const [rzpKeyInput, setRzpKeyInput] = useState(paymentSettings.razorpayKeyId || '');
  const [vipGroupLinkInput, setVipGroupLinkInput] = useState(paymentSettings.vipGroupLink || 'https://whatsapp.com/channel/0029Vb74V4H9Bb6445cKNs3D');
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // New Course Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<CourseCategory>('VIDEO_EDITING');
  const [newPrice, setNewPrice] = useState<number>(99);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(1999);
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80');
  const [newVideoUrl, setNewVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0');
  const [newPdfUrl, setNewPdfUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');

  // Edit Course Form State
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editCategory, setEditCategory] = useState<CourseCategory>('VIDEO_EDITING');
  const [editPrice, setEditPrice] = useState<number>(99);
  const [editOriginalPrice, setEditOriginalPrice] = useState<number>(1999);
  const [editThumbnail, setEditThumbnail] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');

  // Edit User Form State
  const [editUserName, setEditUserName] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>('USER');

  // Broadcast Notification Form State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifCategory, setNotifCategory] = useState<'COURSE' | 'MARKET' | 'OPPORTUNITY' | 'ANNOUNCEMENT'>('COURSE');
  const [notifDeepLink, setNotifDeepLink] = useState('/courses');

  // Calculate Revenue
  const approvedOrders = orders.filter(o => o.status === 'SUCCESS');
  const pendingOrders = orders.filter(o => o.status === 'PENDING_VERIFICATION' || o.status === 'PENDING');
  const rejectedOrders = orders.filter(o => o.status === 'REJECTED');

  const totalVerifiedRevenue = approvedOrders.reduce((sum, ord) => sum + ord.amount, 0);
  const totalEnrollments = courses.reduce((sum, crs) => sum + crs.studentsEnrolled, 0) + approvedOrders.length;

  const filteredOrders = orders.filter(ord => {
    if (orderFilter === 'PENDING') return ord.status === 'PENDING_VERIFICATION' || ord.status === 'PENDING';
    if (orderFilter === 'APPROVED') return ord.status === 'SUCCESS';
    if (orderFilter === 'REJECTED') return ord.status === 'REJECTED';
    return true;
  });

  // Filter Users
  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    (u.phone && u.phone.includes(userSearchQuery))
  );

  // Distinct students in chat
  const studentUserIds = Array.from(new Set(directChatMessages.filter(m => m.userId !== 'usr_default').map(m => m.userId)));
  if (!studentUserIds.includes(user.id)) {
    studentUserIds.unshift(user.id);
  }

  const currentThreadMessages = directChatMessages.filter(
    m => m.userId === selectedChatUserId || (selectedChatUserId === user.id && m.userId === 'usr_default')
  );

  const handleAdminReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyInput.trim()) return;
    sendAdminDirectReply(selectedChatUserId, adminReplyInput.trim());
    setAdminReplyInput('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentSettings({
      ...paymentSettings,
      upiId: upiIdInput.trim() || 'satvikbhai@ybl',
      payeeName: payeeNameInput.trim() || 'Opportunity AI',
      razorpayKeyId: rzpKeyInput.trim(),
      vipGroupLink: vipGroupLinkInput.trim() || 'https://whatsapp.com/channel/0029Vb74V4H9Bb6445cKNs3D'
    });
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  // Handle Thumbnail File Upload for New Course
  const handleNewThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setNewThumbnail(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Thumbnail File Upload for Edit Course
  const handleEditThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setEditThumbnail(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const lessons: Lesson[] = [
      {
        id: `lsn_${Date.now()}_1`,
        courseId: `crs_${Date.now()}`,
        title: '01. Complete Masterclass Video Lesson',
        durationMinutes: 45,
        order: 1,
        type: 'video',
        videoType: 'youtube_unlisted',
        videoUrl: newVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
        isFreePreview: true,
      },
      {
        id: `lsn_${Date.now()}_2`,
        courseId: `crs_${Date.now()}`,
        title: '02. Downloadable Study Notes & Creator Templates (PDF)',
        durationMinutes: 15,
        order: 2,
        type: 'pdf',
        pdfUrl: newPdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'Official course downloadable notes and cheat sheet.',
        isFreePreview: false,
      }
    ];

    addCourse({
      title: newTitle,
      subtitle: newSubtitle || 'High demand practical skills blueprint',
      category: newCategory,
      categoryLabel: newCategory.replace(/_/g, ' '),
      price: Number(newPrice) || 99,
      originalPrice: Number(newOriginalPrice) || 1999,
      thumbnail: newThumbnail,
      lessons,
      published: true
    });

    setNewTitle('');
    setNewSubtitle('');
    setShowAddCourseModal(false);
  };

  const openEditCourseModal = (c: Course) => {
    setEditingCourse(c);
    setEditTitle(c.title);
    setEditSubtitle(c.subtitle);
    setEditCategory(c.category);
    setEditPrice(c.price);
    setEditOriginalPrice(c.originalPrice);
    setEditThumbnail(c.thumbnail);
    setEditVideoUrl(c.lessons[0]?.videoUrl || '');
    setShowEditCourseModal(true);
  };

  const handleSaveEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editTitle.trim()) return;

    const updatedLessons = editingCourse.lessons.map((lsn, idx) => {
      if (idx === 0 && editVideoUrl) {
        return { ...lsn, videoUrl: editVideoUrl };
      }
      return lsn;
    });

    updateCourse(editingCourse.id, {
      title: editTitle.trim(),
      subtitle: editSubtitle.trim(),
      category: editCategory,
      categoryLabel: editCategory.replace(/_/g, ' '),
      price: Number(editPrice),
      originalPrice: Number(editOriginalPrice),
      thumbnail: editThumbnail,
      lessons: updatedLessons
    });

    setShowEditCourseModal(false);
    setEditingCourse(null);
  };

  const openEditUserModal = (u: User) => {
    setEditingUser(u);
    setEditUserName(u.name);
    setEditUserPhone(u.phone || '');
    setEditUserEmail(u.email);
    setEditUserRole(u.role);
    setShowEditUserModal(true);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editUserName.trim()) return;

    updateStudentUser(editingUser.id, {
      name: editUserName.trim(),
      phone: editUserPhone.trim(),
      email: editUserEmail.trim(),
      role: editUserRole
    });

    setShowEditUserModal(false);
    setEditingUser(null);
  };

  const handleCreateGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gigTitle.trim() || !gigCompany.trim()) return;

    const tagsArray = gigTags.split(',').map(t => t.trim()).filter(Boolean);
    const reqArray = gigRequirements.split('\n').map(r => r.trim()).filter(Boolean);

    const categoryLabels: Record<string, string> = {
      FREELANCING: 'Freelance Gig',
      CONTENT_CREATION: 'Creator Role',
      AI_GIGS: 'AI Micro-Gig',
      INTERNSHIPS: 'Student Internship',
      REMOTE_JOBS: 'Remote Job',
      HACKATHONS: 'Hackathon'
    };

    addOpportunity({
      title: gigTitle.trim(),
      companyOrPlatform: gigCompany.trim(),
      category: gigCategory,
      categoryLabel: categoryLabels[gigCategory] || 'Student Gig',
      payoutRange: gigPayout.trim() || '₹1,500 – ₹5,000',
      difficulty: gigDifficulty,
      timeRequired: gigTimeRequired.trim() || 'Flexible',
      deadline: gigDeadline.trim() || 'Open until filled',
      verified: true,
      tags: tagsArray.length > 0 ? tagsArray : ['Remote', 'Student-Friendly'],
      whyMatchesYou: `Direct match for students skilled in ${gigTags || 'creativity'}.`,
      description: gigDescription.trim() || 'Exciting paid opportunity for students and creators.',
      requirements: reqArray.length > 0 ? reqArray : ['Basic skill proficiency', 'Commitment to quality'],
      applyUrl: gigApplyUrl.trim() || 'https://wa.me/919876543210'
    });

    if (gigSendBroadcast) {
      sendAdminNotification({
        title: `💼 New Student Gig: ${gigTitle.trim()}`,
        message: `${gigCompany.trim()} is hiring! Payout: ${gigPayout.trim()}. Tap to apply!`,
        category: 'OPPORTUNITY',
        deepLink: '/gigs'
      });
    }

    // Reset Form
    setGigTitle('');
    setGigCompany('');
    setShowAddGigModal(false);
  };

  const openEditGigModal = (opp: Opportunity) => {
    setEditingGig(opp);
    setGigTitle(opp.title);
    setGigCompany(opp.companyOrPlatform);
    setGigCategory(opp.category);
    setGigPayout(opp.payoutRange);
    setGigDifficulty(opp.difficulty);
    setGigTimeRequired(opp.timeRequired);
    setGigDeadline(opp.deadline || '');
    setGigTags(opp.tags.join(', '));
    setGigDescription(opp.description);
    setGigRequirements(opp.requirements.join('\n'));
    setGigApplyUrl(opp.applyUrl);
    setShowEditGigModal(true);
  };

  const handleSaveEditGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGig || !gigTitle.trim()) return;

    const tagsArray = gigTags.split(',').map(t => t.trim()).filter(Boolean);
    const reqArray = gigRequirements.split('\n').map(r => r.trim()).filter(Boolean);

    updateOpportunity(editingGig.id, {
      title: gigTitle.trim(),
      companyOrPlatform: gigCompany.trim(),
      category: gigCategory,
      payoutRange: gigPayout.trim(),
      difficulty: gigDifficulty,
      timeRequired: gigTimeRequired.trim(),
      deadline: gigDeadline.trim(),
      tags: tagsArray,
      description: gigDescription.trim(),
      requirements: reqArray,
      applyUrl: gigApplyUrl.trim()
    });

    setShowEditGigModal(false);
    setEditingGig(null);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    sendAdminNotification({
      title: notifTitle,
      message: notifMessage,
      category: notifCategory,
      deepLink: notifDeepLink || '/courses'
    });

    setNotifTitle('');
    setNotifMessage('');
    setShowNotifModal(false);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDatabaseBackup(content);
      if (success) {
        alert('Database restored successfully!');
      } else {
        alert('Failed to parse backup file. Please check JSON format.');
      }
    };
    reader.readAsText(file);
  };

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const cleanId = adminIdInput.trim().toLowerCase();
    const cleanPass = adminPassInput.trim();

    // Valid admin identifiers
    const validIds = [
      'satvikbhai@opportunity.ai',
      'satvikbhai@ybl',
      'satvikbhai',
      'satvik',
      'admin',
      '9876543210'
    ];

    // Valid admin master passwords
    const validPasswords = [
      'satvik@123',
      'admin123',
      'satvik2026',
      'admin@123',
      'opportunity@admin',
      'satvikbhai'
    ];

    const isIdValid = validIds.includes(cleanId) || cleanId === adminUser.email.toLowerCase() || (adminUser.phone && cleanId === adminUser.phone.replace(/[^0-9]/g, ''));
    const isPassValid = validPasswords.includes(cleanPass);

    if (isIdValid && isPassValid) {
      loginAsUser(adminUser);
      setIsAdminUnlocked(true);
      setAuthError('');
    } else if (!isIdValid) {
      setAuthError('❌ Invalid Admin ID or Email. Only the owner (Satvik Bhai) can log in.');
    } else {
      setAuthError('❌ Incorrect Admin Master Password. Access denied.');
    }
  };

  const handleLockAdminPortal = () => {
    setIsAdminUnlocked(false);
    setAdminIdInput('');
    setAdminPassInput('');
    onNavigate('/');
  };

  // If Admin is not unlocked or not SUPER_ADMIN, challenge with Security Lock Screen
  if (!isAdminUnlocked || user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-slate-900 text-center">
          {/* Top Shield Icon */}
          <div className="w-16 h-16 rounded-3xl bg-[#003539] border-2 border-teal-400/40 text-teal-300 mx-auto flex items-center justify-center shadow-lg shadow-teal-900/10">
            <LockKeyhole className="w-8 h-8 text-teal-300" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-black uppercase tracking-wider">
              <ShieldAlert className="w-3 h-3 text-purple-600" />
              Restricted Admin Portal
            </div>
            <h2 className="text-xl font-black text-slate-900">Admin Security Verification</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              This master control CMS is protected. Enter your authorized Admin ID and Master Password to unlock.
            </p>
          </div>

          <form onSubmit={handleAdminAuthSubmit} className="space-y-4 text-left text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Admin Username or Registered Email
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-3 focus-within:border-teal-600 focus-within:bg-white transition">
                <KeyRound className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  required
                  value={adminIdInput}
                  onChange={(e) => setAdminIdInput(e.target.value)}
                  placeholder="e.g. satvikbhai@opportunity.ai or satvik"
                  className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Master Security Password
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-3 focus-within:border-teal-600 focus-within:bg-white transition">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassInput}
                  onChange={(e) => setAdminPassInput(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition shrink-0"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Verify & Unlock Admin CMS</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition text-center"
            >
              ← Back to Student Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto text-slate-900">
      {/* Admin Top Header (Light Theme High Contrast) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#003539] text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/')}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Back to App"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-teal-400 text-slate-950 uppercase tracking-wider">
              SUPER ADMIN MASTER CONTROL
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
            Platform Master Control & CMS Portal
          </h1>
          <p className="text-xs text-teal-100/90 mt-0.5 max-w-xl">
            Upload & edit courses, post student gigs, manage students, verify UPI payments, and reply to chats.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Lock CMS Button */}
          <button
            onClick={handleLockAdminPortal}
            title="Lock Admin Portal & Return"
            className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-100 font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-rose-300" />
            <span>Lock CMS</span>
          </button>

          {/* Online/Offline Status Toggle for Admin */}
          <button
            onClick={() => setAdminOnlineStatus(!adminOnlineStatus)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition active:scale-95 border ${
              adminOnlineStatus
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${adminOnlineStatus ? 'bg-white animate-pulse' : 'bg-slate-300'}`} />
            <span>{adminOnlineStatus ? 'Status: ONLINE' : 'Status: OFFLINE'}</span>
          </button>

          <button
            onClick={() => setShowAddCourseModal(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition active:scale-95"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Upload Course</span>
          </button>

          <button
            onClick={() => {
              setGigTitle('');
              setGigCompany('');
              setShowAddGigModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition active:scale-95"
          >
            <Briefcase className="w-4 h-4 text-slate-950" />
            <span>Post Gig</span>
          </button>

          <button
            onClick={() => setShowNotifModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Bell className="w-4 h-4" />
            <span>Broadcast</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Strict Light Theme) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
        {[
          { id: 'USERS', label: `👥 Student Control (${allUsers.length})` },
          { id: 'COURSES', label: `🎓 Courses CMS (${courses.length})` },
          { id: 'GIGS', label: `💼 Student Gigs (${opportunities.length})` },
          { id: 'CHATS', label: `💬 Live Chats (${directChatMessages.length})` },
          { id: 'ORDERS', label: `💰 Orders (${pendingOrders.length} Pending)` },
          { id: 'SETTINGS', label: '💳 UPI & Bank Settings' },
          { id: 'OVERVIEW', label: '📊 Dashboard Overview' },
          { id: 'NOTIFICATIONS', label: `🔔 Broadcasts (${notifications.length})` },
          { id: 'BACKUP', label: '💾 Database Backup' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#003539] text-white shadow-md font-black'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-950 border border-slate-200/80 shadow-2xs'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Student User Management Tab (Clean, Responsive, No Overflow) */}
      {activeTab === 'USERS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Student User Master Control</h3>
              <p className="text-xs text-slate-500">
                Edit student names, change phone numbers, grant free courses, and manage access permissions.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 w-full sm:w-72 focus-within:border-teal-600 focus-within:bg-white transition">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search student by name/phone..."
                className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((u) => {
              const selectedCourseId = grantSelections[u.id] || '';

              return (
                <div
                  key={u.id}
                  className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3.5 flex flex-col justify-between hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{u.name}</h4>
                        <p className="text-xs text-teal-800 font-semibold font-mono">{u.phone || '+91 98765 43210'}</p>
                        <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 border ${
                      u.role === 'ADMIN' || u.role === 'SUPER_ADMIN'
                        ? 'bg-purple-100 text-purple-900 border-purple-200'
                        : u.role === 'PREMIUM_USER'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Enrolled Courses Summary */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 font-bold">Unlocked Courses ({u.enrolledCourseIds.length}):</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {u.enrolledCourseIds.length === 0 ? (
                        <span className="text-[11px] text-slate-400 italic">No courses unlocked yet</span>
                      ) : (
                        u.enrolledCourseIds.map((cId) => {
                          const courseObj = courses.find(c => c.id === cId);
                          return (
                            <span
                              key={cId}
                              className="px-2 py-1 rounded-lg bg-teal-100 border border-teal-300 text-teal-900 text-[10px] font-bold flex items-center gap-1 shadow-2xs"
                            >
                              <span className="truncate max-w-[120px]">{courseObj?.title || cId}</span>
                              <button
                                type="button"
                                onClick={() => revokeCourseFromStudent(u.id, cId)}
                                className="w-3.5 h-3.5 rounded-full bg-teal-200 hover:bg-rose-200 hover:text-rose-800 flex items-center justify-center text-teal-800 ml-0.5 transition"
                                title="Revoke Course Access"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* 1-Click Grant Course Row (Fixed Widths, No Overflow) */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setGrantSelections(prev => ({ ...prev, [u.id]: e.target.value }))}
                        className="flex-1 min-w-0 px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600 truncate"
                      >
                        <option value="">-- Select Course to Grant --</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          if (selectedCourseId) {
                            grantCourseToStudent(u.id, selectedCourseId);
                            setGrantSelections(prev => ({ ...prev, [u.id]: '' }));
                          }
                        }}
                        disabled={!selectedCourseId}
                        className="px-3 py-2 rounded-xl bg-[#003539] hover:bg-[#004f55] disabled:opacity-40 text-white font-black text-xs transition active:scale-95 shrink-0 shadow-xs"
                      >
                        Unlock
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => openEditUserModal(u)}
                        className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition"
                      >
                        <Edit className="w-3.5 h-3.5 text-slate-600" />
                        <span>Edit Student</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedChatUserId(u.id);
                          setActiveTab('CHATS');
                        }}
                        className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition"
                        title="Direct Chat with Student"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>

                      {u.id !== user.id && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete student "${u.name}"?`)) {
                              deleteStudent(u.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Courses CMS & Full Editor Tab (Clean Light Theme) */}
      {activeTab === 'COURSES' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Course Catalog & Live Editor</h3>
              <p className="text-xs text-slate-500">
                Change course titles, upload custom thumbnails from device, change prices, and update video stream links.
              </p>
            </div>
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="px-4 py-2 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Course</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200"
                    />
                    <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-md bg-[#003539] text-white text-[9px] font-black shadow-xs">
                      ₹{c.price}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-teal-800 uppercase tracking-wider">{c.categoryLabel}</span>
                      <span className="text-[10px] text-slate-400">• {c.lessonsCount} Lessons</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 truncate mt-0.5">{c.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{c.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs">
                      <span className="font-black text-teal-900 text-sm">₹{c.price}</span>
                      <span className="text-[11px] text-slate-400 line-through">₹{c.originalPrice}</span>
                      <span className="text-[11px] text-slate-500">• {c.studentsEnrolled} Enrolled</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate(`/courses/${c.id}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    Preview in App
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditCourseModal(c)}
                      className="px-3 py-1.5 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit & Change Thumbnail</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete course "${c.title}"?`)) {
                          deleteCourse(c.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2.5 Student Freelance Gigs & Job Radar CMS */}
      {activeTab === 'GIGS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Student Gigs & Freelance Job CMS</h3>
              <p className="text-xs text-slate-500">
                Post high-paying freelance gigs, video editing roles, internships, and direct WhatsApp application links for students.
              </p>
            </div>
            <button
              onClick={() => {
                setGigTitle('');
                setGigCompany('');
                setShowAddGigModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Student Gig</span>
            </button>
          </div>

          {/* Search Gigs */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={gigSearchQuery}
              onChange={(e) => setGigSearchQuery(e.target.value)}
              placeholder="Search uploaded gigs by title, company, or required skill (e.g. CapCut, AI, SEO)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 shadow-2xs"
            />
          </div>

          {/* Gigs List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities
              .filter(opp => 
                opp.title.toLowerCase().includes(gigSearchQuery.toLowerCase()) ||
                opp.companyOrPlatform.toLowerCase().includes(gigSearchQuery.toLowerCase()) ||
                opp.tags.some(t => t.toLowerCase().includes(gigSearchQuery.toLowerCase()))
              )
              .map((opp) => (
                <div
                  key={opp.id}
                  className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-slate-300 transition"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200 uppercase">
                          {opp.categoryLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                          {opp.difficulty}
                        </span>
                        {opp.verified && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-xs text-emerald-700 block bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {opp.payoutRange}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{opp.title}</h4>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {opp.companyOrPlatform} • <Clock className="w-3 h-3 text-slate-400" /> {opp.timeRequired}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{opp.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {opp.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-[10px] font-medium text-slate-700 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* Requirements Preview */}
                    {opp.requirements && opp.requirements.length > 0 && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                        <span className="font-bold text-slate-800 block text-[10px] uppercase">Requirements:</span>
                        <ul className="list-disc list-inside space-y-0.5">
                          {opp.requirements.slice(0, 2).map((req, rIdx) => (
                            <li key={rIdx} className="truncate">{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 gap-2">
                    <a
                      href={opp.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 truncate"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="truncate">Test Apply Link</span>
                    </a>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEditGigModal(opp)}
                        className="px-3 py-1.5 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete gig "${opp.title}"?`)) {
                            deleteOpportunity(opp.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                        title="Delete Gig"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {opportunities.length === 0 && (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-sm text-slate-900">No Student Gigs Posted Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click "+ Post New Student Gig" to upload freelance projects, video editing jobs, and internships for your students.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. Student Live Chats CRM Tab (Light Theme) */}
      {activeTab === 'CHATS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left: Students List */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-teal-700" />
                <span>Student Inquiries</span>
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-teal-100 text-teal-900">
                {studentUserIds.length} Student{studentUserIds.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar">
              {studentUserIds.map((sId) => {
                const isSelected = selectedChatUserId === sId;
                const studentMessages = directChatMessages.filter(m => m.userId === sId);
                const lastMsg = studentMessages[studentMessages.length - 1];
                const targetStudent = allUsers.find(u => u.id === sId);
                const studentName = targetStudent?.name || studentMessages.find(m => m.sender === 'user')?.userName || 'Student';

                return (
                  <button
                    key={sId}
                    onClick={() => setSelectedChatUserId(sId)}
                    className={`w-full p-3 rounded-2xl text-left border transition ${
                      isSelected
                        ? 'bg-teal-50 border-teal-600 text-teal-950 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs truncate text-slate-900">{studentName}</span>
                      <span className="text-[9px] text-slate-400 font-mono">{lastMsg?.timestamp || 'Active'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {lastMsg?.text || 'New chat session'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Chat Thread & Direct Reply Box */}
          <div className="md:col-span-2 p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between h-[65vh]">
            {/* Thread Header */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                  {selectedChatUserId.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    Direct Thread with {allUsers.find(u => u.id === selectedChatUserId)?.name || user.name}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Phone: {allUsers.find(u => u.id === selectedChatUserId)?.phone || user.phone || '+91 98765 43210'}
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${
                adminOnlineStatus ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-600'
              }`}>
                {adminOnlineStatus ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar my-2 bg-[#F8F9FA] rounded-2xl border border-slate-200">
              {currentThreadMessages.map((m) => {
                const isAdmin = m.sender === 'admin';
                return (
                  <div
                    key={m.id}
                    className={`flex gap-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                        isAdmin
                          ? 'bg-[#003539] text-white font-medium rounded-tr-xs shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-black uppercase ${isAdmin ? 'text-teal-200' : 'text-teal-800'}`}>
                          {isAdmin ? 'You (Admin)' : m.userName}
                        </span>
                        <span className={`text-[9px] font-mono ${isAdmin ? 'text-teal-200/70' : 'text-slate-400'}`}>
                          {m.timestamp}
                        </span>
                      </div>
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Templates */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                'Payment verified! Course has been unlocked 🎉',
                'Please provide your 12-digit UTR transaction number.',
                'Looking into this for you right now.',
                'All video lessons are available in 1080p HD.'
              ].map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAdminReplyInput(template)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] text-slate-700 font-medium whitespace-nowrap transition"
                >
                  {template}
                </button>
              ))}
            </div>

            {/* Admin Direct Reply Form */}
            <form onSubmit={handleAdminReplySubmit} className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={adminReplyInput}
                onChange={(e) => setAdminReplyInput(e.target.value)}
                placeholder="Type real direct reply to student..."
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600"
              />
              <button
                type="submit"
                disabled={!adminReplyInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#003539] hover:bg-[#004f55] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Reply</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Orders & Verification Queue Tab (Light Theme) */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Payment Orders & UTR Verification Queue</h3>
              <p className="text-xs text-slate-500">
                Courses are unlocked ONLY after you verify money in your bank account
              </p>
            </div>
            <button
              onClick={exportOrdersToCSV}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Buyers to Excel (.CSV)</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2">
            {[
              { id: 'ALL', label: `All (${orders.length})` },
              { id: 'PENDING', label: `⏳ Pending (${pendingOrders.length})` },
              { id: 'APPROVED', label: `✅ Approved (${approvedOrders.length})` },
              { id: 'REJECTED', label: `❌ Rejected (${rejectedOrders.length})` },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setOrderFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  orderFilter === f.id
                    ? 'bg-[#003539] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className="rounded-3xl bg-white border border-slate-200 overflow-x-auto no-scrollbar shadow-xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Student & WhatsApp</th>
                  <th className="p-3.5">Course</th>
                  <th className="p-3.5">Amount (₹)</th>
                  <th className="p-3.5">12-Digit UTR / Ref No</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No orders found in this category.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{ord.studentName}</div>
                        <div className="text-[11px] text-teal-800 font-mono font-bold">{ord.studentPhone}</div>
                        <div className="text-[10px] text-slate-400">{ord.studentEmail}</div>
                      </td>
                      <td className="p-3.5 max-w-[180px] font-medium text-slate-900 truncate">
                        {ord.courseTitle}
                      </td>
                      <td className="p-3.5 font-black text-teal-800 text-sm">
                        ₹{ord.amount}
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-1 rounded border border-amber-300">
                          {ord.utrNumber || 'N/A'}
                        </span>
                      </td>
                      <td className="p-3.5 text-[11px] text-slate-500">
                        {ord.purchasedAt}
                      </td>
                      <td className="p-3.5">
                        {ord.status === 'SUCCESS' ? (
                          <span className="px-2.5 py-1 rounded text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                            ✅ UNLOCKED
                          </span>
                        ) : ord.status === 'REJECTED' ? (
                          <span className="px-2.5 py-1 rounded text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300">
                            ❌ REJECTED
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                            ⏳ PENDING MATCH
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        {ord.status === 'PENDING_VERIFICATION' || ord.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approveOrderAndUnlockCourse(ord.orderId)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition active:scale-95"
                              title="Money Received in Bank: Unlock Course Now"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verify & Unlock</span>
                            </button>

                            <button
                              onClick={() => rejectOrder(ord.orderId)}
                              className="px-2 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-[11px] transition"
                              title="Reject Fake UTR"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : ord.status === 'SUCCESS' ? (
                          <span className="text-[11px] text-emerald-800 font-bold">Access Granted</span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Rejected</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. UPI & Bank Settings Tab (Light Theme) */}
      {activeTab === 'SETTINGS' && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-700" />
                <span>Creator UPI & Bank Gateway Settings</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your exact UPI ID so students can send course fee directly to your bank account.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1.5 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-teal-700" />
                  Your Bank UPI ID (GPay / PhonePe / Paytm / BHIM)
                </label>
                <input
                  type="text"
                  required
                  value={upiIdInput}
                  onChange={(e) => setUpiIdInput(e.target.value)}
                  placeholder="e.g. satvikbhai@ybl"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-teal-600 focus:bg-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Dynamic QR codes for all courses will automatically route payments directly to this UPI ID.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5">
                  Creator / Business Payee Name
                </label>
                <input
                  type="text"
                  required
                  value={payeeNameInput}
                  onChange={(e) => setPayeeNameInput(e.target.value)}
                  placeholder="e.g. Opportunity AI"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5">
                  Official VIP WhatsApp Broadcast Group / Channel Link
                </label>
                <input
                  type="url"
                  value={vipGroupLinkInput}
                  onChange={(e) => setVipGroupLinkInput(e.target.value)}
                  placeholder="https://whatsapp.com/channel/..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-mono text-xs"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Students clicking on the "Join VIP WhatsApp" banner will be redirected directly to this link.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5">
                  Optional Razorpay Merchant Key ID (If using automated card gateway)
                </label>
                <input
                  type="text"
                  value={rzpKeyInput}
                  onChange={(e) => setRzpKeyInput(e.target.value)}
                  placeholder="rzp_live_..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              {settingsSavedToast && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Platform & Payment Settings Saved! VIP Channel & Payments Updated.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs shadow-md active:scale-95 transition"
              >
                Save Platform & Payment Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Overview Tab */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Verified Bank Revenue</span>
              <div className="text-2xl font-black text-emerald-700">₹{totalVerifiedRevenue.toLocaleString('en-IN')}</div>
              <span className="text-[10px] text-emerald-700 font-semibold">Direct in Bank (0% Fee)</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Pending UPI Verifications</span>
              <div className="text-2xl font-black text-amber-700">{pendingOrders.length}</div>
              <span className="text-[10px] text-amber-700 font-semibold">Awaiting Bank Match</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Registered Students</span>
              <div className="text-2xl font-black text-teal-800">{allUsers.length}</div>
              <span className="text-[10px] text-slate-500">Active Profiles</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Active Courses Live</span>
              <div className="text-2xl font-black text-slate-900">{courses.length}</div>
              <span className="text-[10px] text-slate-500">Published in App</span>
            </div>
          </div>
        </div>
      )}

      {/* 7. Broadcast Notifications Tab */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-sm text-slate-900">Broadcast Notifications History</h3>
            <button
              onClick={() => setShowNotifModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Notification</span>
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-teal-800 uppercase">{n.categoryLabel}</span>
                    <span className="text-[10px] text-slate-400">• {n.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mt-0.5">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. 1-Click Database Backup & Restore Tab */}
      {activeTab === 'BACKUP' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-700" />
                <span>Zero-Data-Loss Safety Center</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Your courses, customer orders, phone numbers, and content are saved permanently. You can also download an offline JSON backup file anytime with 1 click.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={exportFullDatabaseBackup}
                className="p-4 rounded-2xl bg-[#003539] hover:bg-[#004f55] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Full Database Backup (.JSON)</span>
              </button>

              <label className="p-4 rounded-2xl bg-slate-50 border border-slate-300 hover:border-teal-600 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition">
                <Upload className="w-4 h-4 text-teal-700" />
                <span>Restore Database From File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Course (With Upload from Device Support) */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Upload New Course</h3>
              <button onClick={() => setShowAddCourseModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Title / Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. CapCut Pro 3D Camera & Velocity Speed Ramping"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subtitle / Key Focus</label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="e.g. Learn 3D keyframing, color grading and viral hooks"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              {/* Thumbnail Upload or URL */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="font-bold text-slate-800 block flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-teal-700" />
                  Course Thumbnail Image (Upload or Paste URL)
                </label>

                <div className="flex items-center gap-3">
                  <img
                    src={newThumbnail}
                    alt="Thumbnail Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-300 shrink-0 bg-white"
                  />
                  <div className="flex-1 space-y-1.5">
                    <label className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300 shadow-2xs transition">
                      <Upload className="w-3.5 h-3.5 text-teal-700" />
                      <span>Upload Image from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewThumbnailUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={newThumbnail}
                      onChange={(e) => setNewThumbnail(e.target.value)}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
                  >
                    <option value="VIDEO_EDITING">CapCut & Video Editing</option>
                    <option value="YOUTUBE_GROWTH">YouTube Automation</option>
                    <option value="AI_EARNING">Make Money with AI</option>
                    <option value="TRADING_FINANCE">Trading & Crypto</option>
                    <option value="CYBERSECURITY">Social Media Security</option>
                    <option value="FITNESS_HEALTH">Gym & Supplements</option>
                    <option value="MARKETING_BIZ">Digital Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Video Stream URL (YouTube Unlisted Embed or Google Drive)
                </label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 font-mono text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs shadow-md active:scale-95 transition mt-2"
              >
                Publish Course Instantly
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Course (Name, Thumbnail, Price, Video URL) */}
      {showEditCourseModal && editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Edit Course & Change Thumbnail</h3>
              <button onClick={() => setShowEditCourseModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCourse} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Title / Name</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              {/* Thumbnail Editor */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="font-bold text-slate-800 block flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-teal-700" />
                  Update Thumbnail Image
                </label>

                <div className="flex items-center gap-3">
                  <img
                    src={editThumbnail}
                    alt="Thumbnail Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-300 shrink-0 bg-white"
                  />
                  <div className="flex-1 space-y-1.5">
                    <label className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300 shadow-2xs transition">
                      <Upload className="w-3.5 h-3.5 text-teal-700" />
                      <span>Upload New Image from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditThumbnailUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={editThumbnail}
                      onChange={(e) => setEditThumbnail(e.target.value)}
                      placeholder="Or paste image URL"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
                  >
                    <option value="VIDEO_EDITING">CapCut & Video Editing</option>
                    <option value="YOUTUBE_GROWTH">YouTube Automation</option>
                    <option value="AI_EARNING">Make Money with AI</option>
                    <option value="TRADING_FINANCE">Trading & Crypto</option>
                    <option value="CYBERSECURITY">Social Media Security</option>
                    <option value="FITNESS_HEALTH">Gym & Supplements</option>
                    <option value="MARKETING_BIZ">Digital Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Video Stream URL
                </label>
                <input
                  type="text"
                  value={editVideoUrl}
                  onChange={(e) => setEditVideoUrl(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 font-mono text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs shadow-md active:scale-95 transition mt-2"
              >
                Save Course Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Student User */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Edit Student Details</h3>
              <button onClick={() => setShowEditUserModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp / Phone Number</label>
                <input
                  type="text"
                  value={editUserPhone}
                  onChange={(e) => setEditUserPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">User Role</label>
                <select
                  value={editUserRole}
                  onChange={(e) => setEditUserRole(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 font-medium"
                >
                  <option value="USER">Regular Student</option>
                  <option value="PREMIUM_USER">VIP Premium Member</option>
                  <option value="ADMIN">Instructor / Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs shadow-md active:scale-95 transition mt-2"
              >
                Save Student Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Broadcast Notification */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Broadcast Notification</h3>
              <button onClick={() => setShowNotifModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Notification Title</label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="e.g. 🚀 Special ₹99 Price on CapCut Course!"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message Body</label>
                <textarea
                  required
                  rows={3}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="e.g. Master viral transitions and land freelance clients today."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs shadow-md active:scale-95 transition"
              >
                Broadcast to All Students
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Student Gig */}
      {showAddGigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Post New Student Gig</h3>
              </div>
              <button onClick={() => setShowAddGigModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGig} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Gig Title / Job Role</label>
                <input
                  type="text"
                  required
                  value={gigTitle}
                  onChange={(e) => setGigTitle(e.target.value)}
                  placeholder="e.g. CapCut Video Editor for YouTube Shorts & Reels"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Client / Company Name</label>
                  <input
                    type="text"
                    required
                    value={gigCompany}
                    onChange={(e) => setGigCompany(e.target.value)}
                    placeholder="e.g. TechBuzz Studio"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gig Category</label>
                  <select
                    value={gigCategory}
                    onChange={(e) => setGigCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  >
                    <option value="CONTENT_CREATION">🎬 Creator & Video Editing</option>
                    <option value="FREELANCING">💼 Freelance Projects</option>
                    <option value="AI_GIGS">🤖 AI Micro-Gigs & Prompting</option>
                    <option value="INTERNSHIPS">🎓 Student Internships</option>
                    <option value="REMOTE_JOBS">🌐 Remote Part-Time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payout / Budget</label>
                  <input
                    type="text"
                    required
                    value={gigPayout}
                    onChange={(e) => setGigPayout(e.target.value)}
                    placeholder="₹1,500 – ₹5,000"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={gigDifficulty}
                    onChange={(e) => setGigDifficulty(e.target.value as any)}
                    className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Needed</label>
                  <input
                    type="text"
                    value={gigTimeRequired}
                    onChange={(e) => setGigTimeRequired(e.target.value)}
                    placeholder="2 hrs / day"
                    className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deadline / Openings</label>
                <input
                  type="text"
                  value={gigDeadline}
                  onChange={(e) => setGigDeadline(e.target.value)}
                  placeholder="e.g. Open for 5 Students or Apply before 20 Oct"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Key Skills / Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={gigTags}
                  onChange={(e) => setGigTags(e.target.value)}
                  placeholder="e.g. CapCut, Reels, Color Grading, Sound Effects"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description & Scope of Work</label>
                <textarea
                  rows={2}
                  value={gigDescription}
                  onChange={(e) => setGigDescription(e.target.value)}
                  placeholder="Detailed explanation of the work students will do..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Requirements (One bullet per line)</label>
                <textarea
                  rows={2}
                  value={gigRequirements}
                  onChange={(e) => setGigRequirements(e.target.value)}
                  placeholder="Basic CapCut knowledge&#10;Fast 24-hr turnaround&#10;Good communication"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Direct WhatsApp / Form Application Link
                </label>
                <input
                  type="text"
                  required
                  value={gigApplyUrl}
                  onChange={(e) => setGigApplyUrl(e.target.value)}
                  placeholder="https://wa.me/91... or Google Form link"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Students clicking "Apply Now" will be redirected to this WhatsApp chat or form.
                </span>
              </div>

              <div className="flex items-center gap-2 p-3 bg-teal-50 rounded-xl border border-teal-200">
                <input
                  type="checkbox"
                  id="gigBroadcastCheck"
                  checked={gigSendBroadcast}
                  onChange={(e) => setGigSendBroadcast(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="gigBroadcastCheck" className="text-xs text-teal-900 font-bold cursor-pointer">
                  Send immediate push notification to all students about this new gig
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs shadow-md active:scale-95 transition"
              >
                Publish Gig for Students
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Student Gig */}
      {showEditGigModal && editingGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800">
                  <Edit className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Edit Student Gig</h3>
              </div>
              <button onClick={() => setShowEditGigModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditGig} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Gig Title / Job Role</label>
                <input
                  type="text"
                  required
                  value={gigTitle}
                  onChange={(e) => setGigTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Client / Company Name</label>
                  <input
                    type="text"
                    required
                    value={gigCompany}
                    onChange={(e) => setGigCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gig Category</label>
                  <select
                    value={gigCategory}
                    onChange={(e) => setGigCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  >
                    <option value="CONTENT_CREATION">🎬 Creator & Video Editing</option>
                    <option value="FREELANCING">💼 Freelance Projects</option>
                    <option value="AI_GIGS">🤖 AI Micro-Gigs & Prompting</option>
                    <option value="INTERNSHIPS">🎓 Student Internships</option>
                    <option value="REMOTE_JOBS">🌐 Remote Part-Time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payout / Budget</label>
                  <input
                    type="text"
                    required
                    value={gigPayout}
                    onChange={(e) => setGigPayout(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={gigDifficulty}
                    onChange={(e) => setGigDifficulty(e.target.value as any)}
                    className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Needed</label>
                  <input
                    type="text"
                    value={gigTimeRequired}
                    onChange={(e) => setGigTimeRequired(e.target.value)}
                    className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deadline / Openings</label>
                <input
                  type="text"
                  value={gigDeadline}
                  onChange={(e) => setGigDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Key Skills / Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={gigTags}
                  onChange={(e) => setGigTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description & Scope of Work</label>
                <textarea
                  rows={2}
                  value={gigDescription}
                  onChange={(e) => setGigDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Requirements (One bullet per line)</label>
                <textarea
                  rows={2}
                  value={gigRequirements}
                  onChange={(e) => setGigRequirements(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Direct WhatsApp / Form Application Link
                </label>
                <input
                  type="text"
                  required
                  value={gigApplyUrl}
                  onChange={(e) => setGigApplyUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#003539] hover:bg-[#004f55] text-white font-extrabold text-xs shadow-md active:scale-95 transition"
              >
                Save Changes to Gig
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
