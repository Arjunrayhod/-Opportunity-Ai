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
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Course, CourseCategory, Lesson, OrderRecord, User, UserRole } from '../types';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const {
    courses,
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
    user
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'COURSES' | 'USERS' | 'CHATS' | 'ORDERS' | 'SETTINGS' | 'NOTIFICATIONS' | 'BACKUP'
  >('OVERVIEW');

  const [orderFilter, setOrderFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showNotifModal, setShowNotifModal] = useState(false);

  // User Management State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [grantCourseSelectedId, setGrantCourseSelectedId] = useState<string>('');

  // Chat CRM State
  const [selectedChatUserId, setSelectedChatUserId] = useState<string>(user.id);
  const [adminReplyInput, setAdminReplyInput] = useState('');

  // UPI / Payment Settings Form
  const [upiIdInput, setUpiIdInput] = useState(paymentSettings.upiId);
  const [payeeNameInput, setPayeeNameInput] = useState(paymentSettings.payeeName);
  const [rzpKeyInput, setRzpKeyInput] = useState(paymentSettings.razorpayKeyId || '');
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
      razorpayKeyId: rzpKeyInput.trim()
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

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-purple-950/80 via-dark-850 to-blue-950/80 border border-purple-500/30">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/')}
              className="p-1.5 rounded-lg bg-dark-900 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/30 text-purple-300 border border-purple-500/40">
              SUPER ADMIN MASTER CONTROL
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Platform Master Control & CMS Portal
          </h1>
          <p className="text-xs text-slate-300">
            Upload & edit courses, update thumbnails/names, manage students, verify UPI payments, and reply to chats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Online/Offline Status Toggle for Admin */}
          <button
            onClick={() => setAdminOnlineStatus(!adminOnlineStatus)}
            className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition active:scale-95 border ${
              adminOnlineStatus
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                : 'bg-dark-850 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${adminOnlineStatus ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
            <span>{adminOnlineStatus ? 'Status: ONLINE' : 'Status: OFFLINE'}</span>
          </button>

          <button
            onClick={() => setShowAddCourseModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Course</span>
          </button>

          <button
            onClick={() => setShowNotifModal(true)}
            className="px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-slate-800 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Bell className="w-4 h-4" />
            <span>Broadcast</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar p-1 rounded-2xl bg-dark-900 border border-slate-800">
        {[
          { id: 'OVERVIEW', label: '📊 Dashboard Overview' },
          { id: 'COURSES', label: `🎓 Courses CMS (${courses.length})` },
          { id: 'USERS', label: `👥 Student Control (${allUsers.length})` },
          { id: 'CHATS', label: `💬 Live Chats (${directChatMessages.length})` },
          { id: 'ORDERS', label: `💰 Orders (${pendingOrders.length} Pending)` },
          { id: 'SETTINGS', label: '💳 UPI & Bank Settings' },
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
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Overview Tab */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key Metric Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Verified Bank Revenue</span>
              <div className="text-2xl font-black text-emerald-400">₹{totalVerifiedRevenue.toLocaleString('en-IN')}</div>
              <span className="text-[10px] text-emerald-300 font-semibold">Direct in Bank (0% Fee)</span>
            </div>

            <div className="p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Pending UPI Verifications</span>
              <div className="text-2xl font-black text-amber-400">{pendingOrders.length}</div>
              <span className="text-[10px] text-amber-300 font-semibold">Awaiting Bank Match</span>
            </div>

            <div className="p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Registered Students</span>
              <div className="text-2xl font-black text-cyan-400">{allUsers.length}</div>
              <span className="text-[10px] text-slate-400">Active Profiles</span>
            </div>

            <div className="p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Active Courses Live</span>
              <div className="text-2xl font-black text-purple-400">{courses.length}</div>
              <span className="text-[10px] text-slate-400">Published in App</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="p-4 rounded-3xl bg-gradient-to-br from-blue-950/40 via-dark-850 to-dark-850 border border-blue-500/30 text-left space-y-1.5 hover:border-blue-400 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Plus className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-white">Upload New Course</h4>
              <p className="text-[11px] text-slate-400">Add video lessons, set price & upload thumbnail image</p>
            </button>

            <button
              onClick={() => setActiveTab('USERS')}
              className="p-4 rounded-3xl bg-gradient-to-br from-purple-950/40 via-dark-850 to-dark-850 border border-purple-500/30 text-left space-y-1.5 hover:border-purple-400 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-white">Manage Student Access</h4>
              <p className="text-[11px] text-slate-400">Edit student names, unlock/grant free courses</p>
            </button>

            <button
              onClick={() => setActiveTab('SETTINGS')}
              className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-dark-850 to-dark-850 border border-emerald-500/30 text-left space-y-1.5 hover:border-emerald-400 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <QrCode className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-white">Bank UPI ID: {paymentSettings.upiId}</h4>
              <p className="text-[11px] text-slate-400">Update your payee name & receive direct bank credits</p>
            </button>
          </div>
        </div>
      )}

      {/* 2. Courses CMS & Full Editor Tab (User's Core Request) */}
      {activeTab === 'COURSES' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-white">Course Catalog & Live Editor</h3>
              <p className="text-xs text-slate-400">
                Change course titles, upload custom thumbnails from device, change prices, and update video stream links.
              </p>
            </div>
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Course</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-700"
                    />
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded bg-dark-950 text-cyan-400 text-[9px] font-black border border-slate-800">
                      ₹{c.price}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">{c.categoryLabel}</span>
                      <span className="text-[10px] text-slate-500">• {c.lessonsCount} Lessons</span>
                    </div>
                    <h4 className="font-bold text-sm text-white truncate mt-0.5">{c.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{c.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs">
                      <span className="font-black text-emerald-400">₹{c.price}</span>
                      <span className="text-[10px] text-slate-500 line-through">₹{c.originalPrice}</span>
                      <span className="text-[10px] text-slate-400">• {c.studentsEnrolled} Enrolled</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onNavigate(`/courses/${c.id}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                  >
                    Preview in App
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditCourseModal(c)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95"
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
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
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

      {/* 3. Student User Management Tab (User's Core Request) */}
      {activeTab === 'USERS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-white">Student User Master Control</h3>
              <p className="text-xs text-slate-400">
                Edit student names, change phone numbers, grant free courses, and manage access permissions.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 bg-dark-900 border border-slate-700 rounded-2xl px-3 py-2 w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search student by name/phone..."
                className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-white">{u.name}</h4>
                      <p className="text-[11px] text-cyan-400 font-mono">{u.phone || 'No phone set'}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{u.email}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    u.role === 'ADMIN' || u.role === 'SUPER_ADMIN'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : u.role === 'PREMIUM_USER'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {u.role}
                  </span>
                </div>

                {/* Enrolled Courses Summary */}
                <div className="p-2.5 bg-dark-900 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-bold">Unlocked Courses ({u.enrolledCourseIds.length}):</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {u.enrolledCourseIds.length === 0 ? (
                      <span className="text-[10px] text-slate-500 italic">No courses unlocked yet</span>
                    ) : (
                      u.enrolledCourseIds.map((cId) => {
                        const courseObj = courses.find(c => c.id === cId);
                        return (
                          <span
                            key={cId}
                            className="px-2 py-0.5 rounded-lg bg-teal-950/60 border border-teal-500/30 text-teal-300 text-[9px] font-bold flex items-center gap-1"
                          >
                            <span>{courseObj?.title.slice(0, 16) || cId}...</span>
                            <button
                              type="button"
                              onClick={() => revokeCourseFromStudent(u.id, cId)}
                              className="text-rose-400 hover:text-rose-300 ml-0.5"
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

                {/* 1-Click Grant Course & Actions */}
                <div className="space-y-2 pt-1 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <select
                      value={grantCourseSelectedId}
                      onChange={(e) => setGrantCourseSelectedId(e.target.value)}
                      className="flex-1 px-2 py-1.5 bg-dark-950 border border-slate-700 rounded-xl text-[10px] text-white focus:outline-none"
                    >
                      <option value="">-- Select Course to Grant --</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        if (grantCourseSelectedId) {
                          grantCourseToStudent(u.id, grantCourseSelectedId);
                          setGrantCourseSelectedId('');
                        }
                      }}
                      disabled={!grantCourseSelectedId}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-[10px] transition"
                    >
                      Unlock
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditUserModal(u)}
                      className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center justify-center gap-1 transition"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit Student</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedChatUserId(u.id);
                        setActiveTab('CHATS');
                      }}
                      className="p-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition"
                      title="Direct Chat with Student"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>

                    {u.id !== user.id && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete student "${u.name}"?`)) {
                            deleteStudent(u.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                        title="Delete Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Student Live Chats CRM Tab */}
      {activeTab === 'CHATS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left: Students List */}
          <div className="p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-cyan-400" />
                <span>Student Inquiries</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
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
                        ? 'bg-purple-950/40 border-purple-500 text-white shadow-xs'
                        : 'bg-dark-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs truncate text-white">{studentName}</span>
                      <span className="text-[9px] text-slate-500 font-mono">{lastMsg?.timestamp || 'Active'}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {lastMsg?.text || 'New chat session'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Chat Thread & Direct Reply Box */}
          <div className="md:col-span-2 p-4 rounded-3xl bg-dark-850 border border-slate-800 flex flex-col justify-between h-[65vh]">
            {/* Thread Header */}
            <div className="p-3 bg-dark-900 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-xs">
                  {selectedChatUserId.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">
                    Direct Thread with {allUsers.find(u => u.id === selectedChatUserId)?.name || user.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Phone: {allUsers.find(u => u.id === selectedChatUserId)?.phone || user.phone || '+91 98765 43210'}
                  </p>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                adminOnlineStatus ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {adminOnlineStatus ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar my-2">
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
                          ? 'bg-purple-600 text-white font-medium rounded-tr-xs shadow-md'
                          : 'bg-dark-900 border border-slate-700 text-slate-200 rounded-tl-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold opacity-80 uppercase">
                          {isAdmin ? 'You (Admin)' : m.userName}
                        </span>
                        <span className="text-[9px] opacity-70 font-mono">{m.timestamp}</span>
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
                  className="px-2.5 py-1 rounded-lg bg-dark-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 whitespace-nowrap transition"
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
                className="flex-1 px-4 py-3 bg-dark-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                disabled={!adminReplyInput.trim()}
                className="px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Reply</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Orders & Verification Queue Tab */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-white">Payment Orders & UTR Verification Queue</h3>
              <p className="text-xs text-slate-400">
                Courses are unlocked ONLY after you verify money in your bank account
              </p>
            </div>
            <button
              onClick={exportOrdersToCSV}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition active:scale-95"
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
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className="rounded-3xl bg-dark-850 border border-slate-800 overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-dark-950 text-slate-400 font-semibold border-b border-slate-800">
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
              <tbody className="divide-y divide-slate-800">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No orders found in this category.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-dark-900/50 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-white">{ord.studentName}</div>
                        <div className="text-[11px] text-cyan-400">{ord.studentPhone}</div>
                        <div className="text-[10px] text-slate-500">{ord.studentEmail}</div>
                      </td>
                      <td className="p-3.5 max-w-[180px] font-medium text-white truncate">
                        {ord.courseTitle}
                      </td>
                      <td className="p-3.5 font-black text-emerald-400">
                        ₹{ord.amount}
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                          {ord.utrNumber || 'N/A'}
                        </span>
                      </td>
                      <td className="p-3.5 text-[11px] text-slate-400">
                        {ord.purchasedAt}
                      </td>
                      <td className="p-3.5">
                        {ord.status === 'SUCCESS' ? (
                          <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ✅ UNLOCKED
                          </span>
                        ) : ord.status === 'REJECTED' ? (
                          <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            ❌ REJECTED
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                            ⏳ VERIFICATION PENDING
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        {ord.status === 'PENDING_VERIFICATION' || ord.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approveOrderAndUnlockCourse(ord.orderId)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-md shadow-emerald-500/20 transition active:scale-95"
                              title="Money Received in Bank: Unlock Course Now"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verify & Unlock</span>
                            </button>

                            <button
                              onClick={() => rejectOrder(ord.orderId)}
                              className="px-2 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-[11px] transition"
                              title="Reject Fake UTR"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : ord.status === 'SUCCESS' ? (
                          <span className="text-[11px] text-emerald-400 font-bold">Access Granted</span>
                        ) : (
                          <span className="text-[11px] text-slate-500">Rejected</span>
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

      {/* 6. UPI & Bank Settings Tab */}
      {activeTab === 'SETTINGS' && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-400" />
                <span>Creator UPI & Bank Gateway Settings</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your exact UPI ID so students can send course fee directly to your bank account.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1.5 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  Your Bank UPI ID (GPay / PhonePe / Paytm / BHIM)
                </label>
                <input
                  type="text"
                  required
                  value={upiIdInput}
                  onChange={(e) => setUpiIdInput(e.target.value)}
                  placeholder="e.g. satvikbhai@ybl"
                  className="w-full px-4 py-3 bg-dark-950 border border-slate-700 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Dynamic QR codes for all courses will automatically route payments directly to this UPI ID.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1.5">
                  Creator / Business Payee Name
                </label>
                <input
                  type="text"
                  required
                  value={payeeNameInput}
                  onChange={(e) => setPayeeNameInput(e.target.value)}
                  placeholder="e.g. Opportunity AI"
                  className="w-full px-4 py-3 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1.5">
                  Optional Razorpay Merchant Key ID (If using automated card gateway)
                </label>
                <input
                  type="text"
                  value={rzpKeyInput}
                  onChange={(e) => setRzpKeyInput(e.target.value)}
                  placeholder="rzp_live_..."
                  className="w-full px-4 py-3 bg-dark-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              {settingsSavedToast && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Payment Settings Saved! Students will now pay to <strong>{upiIdInput}</strong>.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition"
              >
                Save Payment Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Broadcast Notifications Tab */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Broadcast Notifications History</h3>
            <button
              onClick={() => setShowNotifModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Notification</span>
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">{n.categoryLabel}</span>
                    <span className="text-[10px] text-slate-500">• {n.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white mt-0.5">{n.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. 1-Click Database Backup & Restore Tab */}
      {activeTab === 'BACKUP' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Zero-Data-Loss Safety Center</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your courses, customer orders, phone numbers, and content are saved permanently. You can also download an offline JSON backup file anytime with 1 click.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={exportFullDatabaseBackup}
                className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Full Database Backup (.JSON)</span>
              </button>

              <label className="p-4 rounded-2xl bg-dark-950 border border-slate-700 hover:border-cyan-400 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition">
                <Upload className="w-4 h-4 text-cyan-400" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-dark-900 border border-slate-700 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Upload New Course</h3>
              <button onClick={() => setShowAddCourseModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Course Title / Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. CapCut Pro 3D Camera & Velocity Speed Ramping"
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Subtitle / Key Focus</label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="e.g. Learn 3D keyframing, color grading and viral hooks"
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Thumbnail Upload or URL */}
              <div className="space-y-2 p-3 bg-dark-950 rounded-2xl border border-slate-800">
                <label className="font-semibold text-slate-300 block flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-cyan-400" />
                  Course Thumbnail Image (Upload or Paste URL)
                </label>

                <div className="flex items-center gap-3">
                  <img
                    src={newThumbnail}
                    alt="Thumbnail Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 transition">
                      <Upload className="w-3.5 h-3.5" />
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
                      className="w-full px-2.5 py-1 bg-dark-900 border border-slate-700 rounded-lg text-[10px] text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
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
                  <label className="font-semibold text-slate-300 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Video Stream URL (YouTube Unlisted Embed or Google Drive)
                </label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Paste any private/unlisted video embed link.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition mt-2"
              >
                Publish Course Instantly
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Course (Name, Thumbnail, Price, Video URL) */}
      {showEditCourseModal && editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-dark-900 border border-slate-700 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Edit Course & Change Thumbnail</h3>
              <button onClick={() => setShowEditCourseModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCourse} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Course Title / Name</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-400 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Thumbnail Editor */}
              <div className="space-y-2 p-3 bg-dark-950 rounded-2xl border border-slate-800">
                <label className="font-semibold text-slate-300 block flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-purple-400" />
                  Update Thumbnail Image
                </label>

                <div className="flex items-center gap-3">
                  <img
                    src={editThumbnail}
                    alt="Thumbnail Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <label className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
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
                      className="w-full px-2.5 py-1 bg-dark-900 border border-slate-700 rounded-lg text-[10px] text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-400"
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
                  <label className="font-semibold text-slate-300 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Video Stream URL
                </label>
                <input
                  type="text"
                  value={editVideoUrl}
                  onChange={(e) => setEditVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition mt-2"
              >
                Save Course Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Student User */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-dark-900 border border-slate-700 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Edit Student Details</h3>
              <button onClick={() => setShowEditUserModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">WhatsApp / Phone Number</label>
                <input
                  type="text"
                  value={editUserPhone}
                  onChange={(e) => setEditUserPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">User Role</label>
                <select
                  value={editUserRole}
                  onChange={(e) => setEditUserRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="USER">Regular Student</option>
                  <option value="PREMIUM_USER">VIP Premium Member</option>
                  <option value="ADMIN">Instructor / Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition mt-2"
              >
                Save Student Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Broadcast Notification */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-dark-900 border border-slate-700 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Broadcast Notification</h3>
              <button onClick={() => setShowNotifModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Notification Title</label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="e.g. 🚀 Special ₹99 Price on CapCut Course!"
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Message Body</label>
                <textarea
                  required
                  rows={3}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="e.g. Master viral transitions and land freelance clients today."
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition"
              >
                Broadcast to All Students
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
