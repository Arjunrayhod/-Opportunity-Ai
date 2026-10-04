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
  Power
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Course, CourseCategory, Lesson, OrderRecord } from '../types';

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
    user
  } = useApp();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CHATS' | 'ORDERS' | 'SETTINGS' | 'COURSES' | 'NOTIFICATIONS' | 'BACKUP'>('OVERVIEW');
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);

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

  // Extract distinct students who messaged
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
              SUPER ADMIN PORTAL
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Course CMS, Direct Chat & Payment Gateway
          </h1>
          <p className="text-xs text-slate-300">
            Reply to student chats, verify UPI payments, manage catalog, and configure your bank account.
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
            <span>Upload Course</span>
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
          { id: 'OVERVIEW', label: '📊 Overview' },
          { id: 'CHATS', label: `💬 Student Chats (${directChatMessages.length})` },
          { id: 'ORDERS', label: `💰 Orders & Verification (${pendingOrders.length} Pending)` },
          { id: 'SETTINGS', label: '💳 UPI & Bank Settings' },
          { id: 'COURSES', label: `🎓 Course CMS (${courses.length})` },
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
              <span className="text-[10px] text-emerald-300 font-semibold">Direct in Bank</span>
            </div>

            <div className="p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Pending UPI Verifications</span>
              <div className="text-2xl font-black text-amber-400">{pendingOrders.length}</div>
              <span className="text-[10px] text-amber-300 font-semibold">Awaiting Bank Match</span>
            </div>

            <div className="p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Student Chat Inquiries</span>
              <div className="text-2xl font-black text-cyan-400">{directChatMessages.filter(m => m.sender === 'user').length}</div>
              <span className="text-[10px] text-slate-400">Direct Support</span>
            </div>

            <div className="p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Active Courses Live</span>
              <div className="text-2xl font-black text-purple-400">{courses.length}</div>
              <span className="text-[10px] text-slate-400">Published in Store</span>
            </div>
          </div>

          {/* Pending Verification Quick Alert */}
          {pendingOrders.length > 0 && (
            <div className="p-5 rounded-3xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {pendingOrders.length} New Payment{pendingOrders.length > 1 ? 's' : ''} Awaiting Your Verification
                  </h4>
                  <p className="text-xs text-amber-200/80">
                    Students have submitted their 12-digit UTR numbers. Check your bank app/SMS and click "Verify & Unlock".
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('ORDERS');
                  setOrderFilter('PENDING');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition active:scale-95 shrink-0"
              >
                Review Pending ({pendingOrders.length})
              </button>
            </div>
          )}

          {/* Direct Bank Account Status Box */}
          <div className="p-5 rounded-3xl bg-dark-850 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Active Payment Account</h3>
              </div>
              <button
                onClick={() => setActiveTab('SETTINGS')}
                className="text-xs text-cyan-400 font-bold hover:underline"
              >
                Change Bank UPI ID →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-dark-900 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">UPI ID for Student Payments:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{paymentSettings.upiId}</span>
              </div>
              <div className="p-3 bg-dark-900 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Payee / Account Name:</span>
                <span className="font-bold text-white text-sm">{paymentSettings.payeeName}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Direct Student Chats CRM Tab (New Feature) */}
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
                const studentName = studentMessages.find(m => m.sender === 'user')?.userName || user.name;

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
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">
                    Direct Thread with Student ({user.name})
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Phone: {user.phone || '+91 98765 43210'} • ID: {selectedChatUserId}
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

      {/* 3. Orders & Verification Queue Tab */}
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

      {/* 4. UPI & Bank Settings Tab */}
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

      {/* 5. Courses CMS Tab */}
      {activeTab === 'COURSES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Live Course Catalog</h3>
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </button>
          </div>

          <div className="space-y-3">
            {courses.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-3xl bg-dark-850 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">{c.categoryLabel}</span>
                      <span className="text-[10px] text-slate-500">• {c.lessonsCount} Lessons</span>
                    </div>
                    <h4 className="font-bold text-sm text-white">{c.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-black text-cyan-400">₹{c.price}</span>
                      <span className="text-[10px] text-slate-500 line-through">₹{c.originalPrice}</span>
                      <span className="text-[10px] text-slate-400">• {c.studentsEnrolled} Students</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onNavigate(`/courses/${c.id}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => deleteCourse(c.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Broadcast Notifications Tab */}
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

      {/* 7. 1-Click Database Backup & Restore Tab */}
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

      {/* Modal: Add New Course */}
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
                <label className="font-semibold text-slate-300 block mb-1">Course Title</label>
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
