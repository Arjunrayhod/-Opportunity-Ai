import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, Lock, CheckCircle2, Download, HelpCircle, Star, ShieldCheck, BookOpen, Award, FileText, Maximize2, Minimize2, Smartphone, Sparkles, X, ExternalLink, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RazorpayModal } from '../components/payment/RazorpayModal';
import { CertificateModal } from '../components/growth/CertificateModal';
import { FlashSaleTimer } from '../components/growth/FlashSaleTimer';
import { Lesson } from '../types';

interface CourseDetailPageProps {
  courseId: string;
  onNavigate: (path: string) => void;
}

const getDriveFolderId = (url?: string) => {
  if (!url) return '';
  const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];
  return url;
};

const getVideoEmbedUrl = (lesson: Lesson, course: { category: string; title: string; driveUrl?: string }) => {
  // 1. If lesson has a direct Google Drive file preview URL
  if (lesson.videoUrl && lesson.videoUrl.includes('drive.google.com/file/d/')) {
    return lesson.videoUrl;
  }
  
  // 2. If lesson has embeddedfolderview
  if (lesson.videoUrl && lesson.videoUrl.includes('embeddedfolderview')) {
    return lesson.videoUrl;
  }

  // 3. Fallback to Google Drive embedded folder view
  if (course.driveUrl) {
    const folderId = getDriveFolderId(course.driveUrl);
    return `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
  }

  return '';
};

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ courseId, onNavigate }) => {
  const { courses, user } = useApp();
  const course = courses.find((c) => c.id === courseId) || courses[0];
  const isEnrolled = user.enrolledCourseIds.includes(course.id);

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Permanent Storage Key for Completed Lessons per Course & User
  const storageKey = `opportunity_completed_lessons_${user.id}_${course.id}`;

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return ['lsn_01', 'lsn_02'];
  });

  // Save to permanent storage whenever lessons are marked
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedLessonIds));
    } catch (e) {
      console.error('Failed to save completed lessons', e);
    }
  }, [completedLessonIds, storageKey]);

  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const activeLesson: Lesson = course.lessons[activeLessonIndex] || course.lessons[0];
  const isLessonUnlocked = isEnrolled || activeLesson?.isFreePreview;
  const embedUrl = getVideoEmbedUrl(activeLesson, course);

  const handleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds(prev => {
      const updated = prev.includes(lessonId) ? prev : [...prev, lessonId];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleReloadVideo = () => {
    setReloadKey(prev => prev + 1);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('/courses')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 transition shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Courses</span>
        </button>

        <div className="flex items-center gap-2">
          {isEnrolled && (
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 transition active:scale-95 shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Claim Certificate</span>
            </button>
          )}

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
            {course.categoryLabel}
          </span>
        </div>
      </div>

      {/* Flash Sale Banner */}
      {!isEnrolled && <FlashSaleTimer />}

      {/* 1. Main In-App Video Studio Player Screen (YouTube-Style 16:9 Auto-Responsive Ratio) */}
      <div className="rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
        {isLessonUnlocked ? (
          <div
            className="relative w-full aspect-video max-h-[75vh] bg-black flex flex-col justify-between overflow-hidden group select-none"
          >
            {/* DRM Anti-Piracy Floating Watermark (Non-intrusive) */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 pointer-events-none px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/80 backdrop-blur-md text-[9px] sm:text-[10px] font-mono text-emerald-400 z-30 select-none border border-emerald-500/30 flex items-center gap-1.5 shadow-md">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              <span>Opportunity Stream • {user.id.toUpperCase()}</span>
            </div>

            {/* Video Player & Streaming Container */}
            {activeLesson.type === 'video' ? (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
                <iframe
                  key={`player_${course.id}_${activeLesson.id}_${reloadKey}`}
                  src={embedUrl}
                  title={activeLesson.title}
                  className="w-full h-full border-0 absolute inset-0 z-10"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  loading="eager"
                />
              </div>
            ) : activeLesson.type === 'pdf' ? (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-3 bg-white w-full h-full z-10">
                <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Download className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">{activeLesson.title}</h3>
                <p className="text-xs text-slate-600 max-w-sm">{activeLesson.textContent}</p>
                <button
                  onClick={() => handleLessonComplete(activeLesson.id)}
                  className="px-4 py-2 rounded-xl bg-[#003539] hover:bg-[#004f55] !text-white font-bold text-xs flex items-center gap-2 transition shadow-xs"
                >
                  <Download className="w-4 h-4 !text-white" />
                  <span className="!text-white">Download Practice Worksheet</span>
                </button>
              </div>
            ) : activeLesson.type === 'quiz' && activeLesson.quiz ? (
              <div className="p-6 w-full max-w-md mx-auto space-y-4 bg-white z-10 my-auto rounded-2xl">
                <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase">
                  <HelpCircle className="w-4 h-4 text-teal-700" />
                  <span>Module Knowledge Check</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {activeLesson.quiz.question}
                </h3>
                <div className="space-y-2">
                  {activeLesson.quiz.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuizSelectedOption(idx);
                        setShowQuizResult(true);
                        if (idx === activeLesson.quiz?.correctIndex) {
                          handleLessonComplete(activeLesson.id);
                        }
                      }}
                      className={`w-full p-3 rounded-xl text-left text-xs font-semibold border transition ${
                        quizSelectedOption === idx
                          ? idx === activeLesson.quiz?.correctIndex
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                            : 'bg-rose-50 border-rose-500 text-rose-800'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                    </button>
                  ))}
                </div>

                {showQuizResult && (
                  <div className={`p-3 rounded-xl text-xs ${
                    quizSelectedOption === activeLesson.quiz?.correctIndex
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border border-rose-300 text-rose-900'
                  }`}>
                    <p className="font-bold">
                      {quizSelectedOption === activeLesson.quiz?.correctIndex ? '✅ Correct Answer!' : '❌ Incorrect'}
                    </p>
                    <p className="mt-1 text-[11px] opacity-90">{activeLesson.quiz?.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-slate-900 text-xs bg-white z-10 m-auto rounded-2xl">{activeLesson.textContent}</div>
            )}
          </div>
        ) : (
          <div className="w-full aspect-video max-h-[75vh] bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-6 flex flex-col items-center justify-center text-center space-y-3 relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-black text-white text-base sm:text-lg">
              This Premium Course is Locked
            </h3>
            <p className="text-xs text-slate-300 max-w-sm">
              Unlock the complete in-app video series with all video modules, downloadable checklists, and lifetime access.
            </p>
            <button
              onClick={() => setIsRazorpayOpen(true)}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Unlock Course for just ₹{course.price}</span>
            </button>
          </div>
        )}

        {/* In-App Player Navigation & Action Controls */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 space-y-3">
          {/* Action Helper Bar */}
          {isLessonUnlocked && activeLesson.type === 'video' && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-teal-50/80 border border-teal-200 text-xs">
              <div className="flex items-center gap-2 text-teal-900 font-bold">
                <Smartphone className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="text-[11px] sm:text-xs">Click on the center Play button inside the video to start streaming</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleReloadVideo}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 flex items-center gap-1 transition active:scale-95 shadow-2xs"
                  title="Reload Video Stream"
                >
                  <RotateCcw className="w-3 h-3 text-slate-600" />
                  <span>Reload Video</span>
                </button>
                <button
                  onClick={() => setIsTheaterOpen(true)}
                  className="px-3 py-1 rounded-lg bg-[#003539] hover:bg-[#004f55] !text-white text-[11px] font-extrabold flex items-center gap-1.5 transition active:scale-95 shadow-xs shrink-0"
                >
                  <Maximize2 className="w-3 h-3 !text-white" />
                  <span className="!text-white">Fullscreen Theater</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-800">
                  Module {activeLessonIndex + 1} of {course.lessons.length}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  1080p HD Studio
                </span>
                {activeLesson.isFreePreview && !isEnrolled && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    FREE PREVIEW
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">{activeLesson.title}</h2>
            </div>

            {isLessonUnlocked ? (
              <div className="flex items-center flex-wrap gap-2 shrink-0">
                {activeLesson.videoUrl && (
                  <button
                    onClick={() => setIsTheaterOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#003539] hover:bg-[#004f55] !text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs active:scale-95"
                    title="Play 1080p Video Inside App"
                  >
                    <Maximize2 className="w-3.5 h-3.5 !text-white" />
                    <span className="!text-white">▶ In-App 1080p Studio</span>
                  </button>
                )}
                <button
                  disabled={activeLessonIndex === 0}
                  onClick={() => setActiveLessonIndex(prev => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition shadow-2xs"
                >
                  Previous
                </button>
                <button
                  onClick={() => handleLessonComplete(activeLesson.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5 ${
                    completedLessonIds.includes(activeLesson.id)
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{completedLessonIds.includes(activeLesson.id) ? 'Completed' : 'Mark Done'}</span>
                </button>
                <button
                  disabled={activeLessonIndex === course.lessons.length - 1}
                  onClick={() => {
                    handleLessonComplete(activeLesson.id);
                    setActiveLessonIndex(prev => Math.min(course.lessons.length - 1, prev + 1));
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#003539] hover:bg-[#004f55] !text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="!text-white">Next Module</span>
                  <ArrowRight className="w-3.5 h-3.5 !text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsRazorpayOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#003539] hover:bg-[#004f55] !text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs shrink-0"
              >
                <span className="!text-white">Enroll at ₹{course.price} (95% Off)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Downloadable In-App Resource & Blueprint Vault */}
      {course.cheatSheetPdf && (
        <div className="p-4 rounded-3xl bg-teal-50/70 border border-teal-200 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-700 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-teal-800 uppercase tracking-wider">
                In-App Action Plan & Practical Cheat Sheet
              </span>
              <h4 className="text-xs font-bold text-slate-900">{course.cheatSheetPdf.title}</h4>
              <span className="text-[10px] text-slate-500">{course.cheatSheetPdf.fileSize} • High-Res PDF</span>
            </div>
          </div>

          <a
            href={course.cheatSheetPdf.downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#003539] hover:bg-[#004f55] !text-white font-extrabold text-xs flex items-center gap-1.5 transition shrink-0 active:scale-95 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 !text-white" />
            <span className="!text-white">Download PDF</span>
          </a>
        </div>
      )}

      {/* 3. Course Overview & Curriculum Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Course Curriculum Accordion */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-700" />
              <span>Course Curriculum ({course.lessons.length} Modules)</span>
            </h3>
            <span className="text-xs text-slate-500">{course.durationHours} hrs total</span>
          </div>

          <div className="space-y-2">
            {course.lessons.map((lesson, idx) => {
              const isSelected = activeLessonIndex === idx;
              const isUnlocked = isEnrolled || lesson.isFreePreview;
              const isCompleted = completedLessonIds.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLessonIndex(idx)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : isUnlocked
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isUnlocked ? (
                        <Play className="w-4 h-4 fill-teal-700" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate text-slate-900">{lesson.title}</h4>
                      <p className="text-[10px] text-slate-500">{lesson.durationMinutes} mins • {lesson.type.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {lesson.isFreePreview && !isEnrolled && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        FREE
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-500">{lesson.durationMinutes}m</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* What You'll Learn Section */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 space-y-3 mt-4 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900">What You'll Learn in This Course:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.learningOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Instructor & Pricing Card */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Course Instructor
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{course.instructor.name}</h4>
                  <p className="text-[11px] text-slate-500">{course.instructor.role}</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Student Rating</span>
                <span className="font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {course.rating} ({course.reviewCount})
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Enrolled Students</span>
                <span className="font-bold text-slate-900">{course.studentsEnrolled.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Skill Level</span>
                <span className="font-bold text-teal-800">{course.level}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Certificate</span>
                <span className="font-bold text-amber-700">Included on Completion</span>
              </div>
            </div>

            {!isEnrolled ? (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Special Student Price:</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-teal-800">₹{course.price}</span>
                    <span className="text-xs text-slate-400 line-through">₹{course.originalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsRazorpayOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-[#003539] hover:bg-[#004f55] !text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 !text-white" />
                  <span className="!text-white">Buy Now via Razorpay (₹{course.price})</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-center">
                  <span className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> You own this course
                  </span>
                </div>
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-800 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Claim Completion Certificate</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Razorpay Checkout Modal */}
      <RazorpayModal
        course={course}
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        onSuccess={() => setIsRazorpayOpen(false)}
      />

      {/* Certificate Modal */}
      <CertificateModal
        course={course}
        user={user}
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />

      {/* 4. Fullscreen In-App Mobile Theater Studio Modal (Strict Light Theme) */}
      {isTheaterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col justify-between select-none animate-in fade-in duration-200">
          {/* Theater Header (Light Theme) */}
          <div className="flex items-center justify-between p-3 sm:p-3.5 bg-white border-b border-slate-200 shadow-2xs shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 border border-teal-200">
                <Play className="w-4 h-4 fill-teal-800 text-teal-800 ml-0.5" />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-black text-teal-800 uppercase tracking-wider block">
                  Module {activeLessonIndex + 1} of {course.lessons.length} • HD Studio
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{activeLesson.title}</h4>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleReloadVideo}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition active:scale-95 flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-2xs"
                title="Reload Video Stream"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                <span>Reload</span>
              </button>
              <button
                onClick={() => setIsTheaterOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition active:scale-95 flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-2xs"
              >
                <X className="w-4 h-4" />
                <span>Exit Fullscreen</span>
              </button>
            </div>
          </div>

          {/* YouTube-Style Video Player (Top-Anchored on Mobile, Centered on Desktop) */}
          <div className="w-full bg-black shrink-0 relative aspect-video max-h-[55vh] sm:max-h-[65vh] flex items-center justify-center overflow-hidden shadow-md">
            {/* DRM Anti-Piracy Watermark */}
            <div className="absolute top-3 right-3 pointer-events-none px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[9px] sm:text-[10px] font-mono text-emerald-400 z-30 select-none border border-emerald-500/30 flex items-center gap-1.5 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Opportunity Stream • {user.id.toUpperCase()}</span>
            </div>

            <iframe
              key={`theater_${course.id}_${activeLesson.id}_${reloadKey}`}
              src={embedUrl}
              title={activeLesson.title}
              className="w-full h-full border-0 absolute inset-0 z-10"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              loading="eager"
            />
          </div>

          {/* Theater Bottom Bar Controls (Light Theme) */}
          <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-white border-y border-slate-200 shadow-2xs shrink-0">
            <button
              disabled={activeLessonIndex === 0}
              onClick={() => setActiveLessonIndex(prev => Math.max(0, prev - 1))}
              className="px-3 sm:px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition shadow-2xs"
            >
              Previous
            </button>

            <button
              onClick={() => handleLessonComplete(activeLesson.id)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
                completedLessonIds.includes(activeLesson.id)
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{completedLessonIds.includes(activeLesson.id) ? 'Completed' : 'Mark Done'}</span>
            </button>

            <button
              disabled={activeLessonIndex === course.lessons.length - 1}
              onClick={() => {
                handleLessonComplete(activeLesson.id);
                setActiveLessonIndex(prev => Math.min(course.lessons.length - 1, prev + 1));
              }}
              className="px-3.5 sm:px-5 py-2 rounded-xl bg-[#003539] hover:bg-[#004f55] !text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1.5 shadow-xs"
            >
              <span className="!text-white">Next</span>
              <ArrowRight className="w-3.5 h-3.5 !text-white" />
            </button>
          </div>

          {/* YouTube-Style Scrollable Module Playlist Below Video in Theater (Light Theme) */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#F8F9FA] space-y-2.5">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Up Next In This Course ({course.lessons.length} Modules)
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {course.durationHours} hrs total
              </span>
            </div>

            {course.lessons.map((lesson, idx) => {
              const isCurrent = idx === activeLessonIndex;
              const isDone = completedLessonIds.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonIndex(idx)}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between gap-3 text-left transition ${
                    isCurrent
                      ? 'bg-teal-50 border-2 border-[#003539] text-teal-950 shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 hover:border-teal-300 hover:bg-teal-50/30 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black ${
                      isCurrent
                        ? 'bg-[#003539] text-white shadow-xs'
                        : isDone
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : idx + 1}
                    </div>
                    <div className="truncate">
                      <p className={`text-xs font-bold truncate ${isCurrent ? 'text-teal-950 font-extrabold' : 'text-slate-800'}`}>
                        {lesson.title}
                      </p>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {lesson.durationMinutes} mins • {lesson.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-md bg-[#003539] text-white text-[9px] font-black uppercase tracking-wider shrink-0 shadow-2xs">
                      Now Playing
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
