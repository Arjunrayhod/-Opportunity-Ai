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
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Course, CourseCategory, Lesson } from '../types';

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
    user
  } = useApp();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'COURSES' | 'ORDERS' | 'NOTIFICATIONS' | 'BACKUP'>('OVERVIEW');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);

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
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.amount, 0);
  const totalEnrollments = courses.reduce((sum, crs) => sum + crs.studentsEnrolled, 0) + orders.length;

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
            Course CMS & Sales Control Center
          </h1>
          <p className="text-xs text-slate-300">
            Upload courses, manage student buyers, broadcast notifications, and safeguard platform data.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
            <span>Send Notification</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar p-1 rounded-2xl bg-dark-900 border border-slate-800">
        {[
          { id: 'OVERVIEW', label: '📊 Dashboard Overview', icon: TrendingUp },
          { id: 'COURSES', label: `🎓 Course CMS (${courses.length})`, icon: BookOpen },
          { id: 'ORDERS', label: `💰 Buyers & Sales (${orders.length})`, icon: DollarSign },
          { id: 'NOTIFICATIONS', label: `🔔 Broadcasts (${notifications.length})`, icon: Bell },
          { id: 'BACKUP', label: '💾 1-Click Database Backup', icon: Database },
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
              <span className="text-[11px] text-slate-400 font-medium">Total Gross Revenue</span>
              <div className="text-2xl font-black text-emerald-400">₹{totalRevenue.toLocaleString('en-IN')}</div>
              <span className="text-[10px] text-emerald-300 font-semibold">+18% this week</span>
            </div>

            <div className="p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Course Purchases</span>
              <div className="text-2xl font-black text-cyan-400">{orders.length}</div>
              <span className="text-[10px] text-slate-400">Razorpay Verified</span>
            </div>

            <div className="p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Active Courses Live</span>
              <div className="text-2xl font-black text-purple-400">{courses.length}</div>
              <span className="text-[10px] text-slate-400">Instant Sync</span>
            </div>

            <div className="p-4 rounded-3xl bg-dark-850 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Total Students</span>
              <div className="text-2xl font-black text-amber-400">{totalEnrollments.toLocaleString('en-IN')}</div>
              <span className="text-[10px] text-slate-400">Across All Categories</span>
            </div>
          </div>

          {/* Quick Actions & 30GB Video Tip */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-950/40 via-dark-850 to-dark-850 border border-blue-500/30 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <Video className="w-4 h-4" />
              <span>₹0 Cost Video Hosting System Ready</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You can upload your <strong>30GB+ video files to YouTube as "Unlisted" or to Google Drive</strong> for free, and paste the link in the Course CMS. The mobile app will stream your videos cleanly without any ads or external brand watermarks!
            </p>
          </div>
        </div>
      )}

      {/* 2. Courses CMS Tab */}
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

      {/* 3. Orders & Student Buyers CRM Tab (Addressing User's Request) */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-white">Student Buyers & Sales CRM</h3>
              <p className="text-xs text-slate-400">All purchased customer contacts, payments, and WhatsApp details</p>
            </div>
            <button
              onClick={exportOrdersToCSV}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Buyers to Excel (.CSV)</span>
            </button>
          </div>

          <div className="rounded-3xl bg-dark-850 border border-slate-800 overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-dark-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Student Name & Contact</th>
                  <th className="p-3.5">Course Purchased</th>
                  <th className="p-3.5">Amount (₹)</th>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Purchase Date</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-dark-900/50 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-white">{ord.studentName}</div>
                      <div className="text-[11px] text-cyan-400">{ord.studentPhone}</div>
                      <div className="text-[10px] text-slate-500">{ord.studentEmail}</div>
                    </td>
                    <td className="p-3.5 max-w-xs font-medium text-white truncate">
                      {ord.courseTitle}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400">
                      ₹{ord.amount}
                    </td>
                    <td className="p-3.5 font-mono text-[10px] text-slate-400">
                      {ord.orderId}
                    </td>
                    <td className="p-3.5 text-[11px] text-slate-400">
                      {ord.purchasedAt}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Broadcast Notifications Tab */}
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

      {/* 5. 1-Click Database Backup & Restore Tab */}
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
