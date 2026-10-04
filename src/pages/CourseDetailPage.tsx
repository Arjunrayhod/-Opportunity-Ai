import React, { useState } from 'react';
import { ArrowLeft, Play, Lock, CheckCircle2, Download, HelpCircle, Star, Users, Clock, ShieldCheck, Sparkles, BookOpen, Award, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RazorpayModal } from '../components/payment/RazorpayModal';
import { CertificateModal } from '../components/growth/CertificateModal';
import { FlashSaleTimer } from '../components/growth/FlashSaleTimer';
import { Lesson } from '../types';

interface CourseDetailPageProps {
  courseId: string;
  onNavigate: (path: string) => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ courseId, onNavigate }) => {
  const { courses, user } = useApp();
  const course = courses.find((c) => c.id === courseId) || courses[0];
  const isEnrolled = user.enrolledCourseIds.includes(course.id);

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['lsn_01', 'lsn_02']);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const activeLesson: Lesson = course.lessons[activeLessonIndex] || course.lessons[0];
  const isLessonUnlocked = isEnrolled || activeLesson?.isFreePreview;

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(prev => [...prev, lessonId]);
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('/courses')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-dark-850 px-3 py-1.5 rounded-xl border border-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Courses</span>
        </button>

        <div className="flex items-center gap-2">
          {isEnrolled && (
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 px-3 py-1.5 rounded-xl border border-amber-500/40 transition active:scale-95"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Claim Certificate</span>
            </button>
          )}

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-500/30">
            {course.categoryLabel}
          </span>
        </div>
      </div>

      {/* Flash Sale Banner */}
      {!isEnrolled && <FlashSaleTimer />}

      {/* 1. Main In-App Video & Content Player Screen */}
      <div className="rounded-3xl bg-dark-900 border border-slate-800 overflow-hidden shadow-2xl">
        {isLessonUnlocked ? (
          <div className="aspect-video w-full bg-black relative flex items-center justify-center">
            {activeLesson.type === 'video' ? (
              <iframe
                src={activeLesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                title={activeLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : activeLesson.type === 'pdf' ? (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Download className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-white text-base">{activeLesson.title}</h3>
                <p className="text-xs text-slate-400 max-w-sm">{activeLesson.textContent}</p>
                <a
                  href={activeLesson.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleLessonComplete(activeLesson.id)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-950 font-bold text-xs flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Blueprint PDF</span>
                </a>
              </div>
            ) : activeLesson.type === 'quiz' && activeLesson.quiz ? (
              <div className="p-6 w-full max-w-md mx-auto space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase">
                  <HelpCircle className="w-4 h-4" />
                  <span>Module Knowledge Check</span>
                </div>
                <h3 className="font-bold text-white text-sm sm:text-base">
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
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-rose-500/20 border-rose-400 text-rose-300'
                          : 'bg-dark-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                    </button>
                  ))}
                </div>

                {showQuizResult && (
                  <div className={`p-3 rounded-xl text-xs ${
                    quizSelectedOption === activeLesson.quiz?.correctIndex
                      ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/40 border border-rose-500/40 text-rose-200'
                  }`}>
                    <p className="font-bold">
                      {quizSelectedOption === activeLesson.quiz?.correctIndex ? '✅ Correct Answer!' : '❌ Incorrect'}
                    </p>
                    <p className="mt-1 text-[11px] opacity-90">{activeLesson.quiz?.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-white text-xs">{activeLesson.textContent}</div>
            )}
          </div>
        ) : (
          <div className="aspect-video w-full bg-gradient-to-br from-dark-950 via-slate-900 to-blue-950 p-6 flex flex-col items-center justify-center text-center space-y-3 relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-black text-white text-base sm:text-lg">
              This Premium Lesson is Locked
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Unlock the complete course with all video modules, downloadable PDF checklists, and lifetime updates.
            </p>
            <button
              onClick={() => setIsRazorpayOpen(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-500/30 flex items-center gap-2 transition active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Course for just ₹{course.price}</span>
            </button>
          </div>
        )}

        {/* Lesson Title & Info Banner */}
        <div className="p-4 bg-dark-850 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400">
                Lesson {activeLessonIndex + 1} of {course.lessons.length}
              </span>
              {activeLesson.isFreePreview && !isEnrolled && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  FREE PREVIEW
                </span>
              )}
            </div>
            <h2 className="text-sm sm:text-base font-black text-white mt-0.5">{activeLesson.title}</h2>
          </div>

          {!isEnrolled && (
            <button
              onClick={() => setIsRazorpayOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 shrink-0"
            >
              <span>Enroll at ₹{course.price} (95% Off)</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Downloadable PDF Cheat Sheets Vault (Phase 4.7) */}
      {course.cheatSheetPdf && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-dark-850 to-blue-950/40 border border-cyan-500/30 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">
                Downloadable Cheat Sheet & Templates
              </span>
              <h4 className="text-xs font-bold text-white">{course.cheatSheetPdf.title}</h4>
              <span className="text-[10px] text-slate-400">{course.cheatSheetPdf.fileSize} • High-Res PDF</span>
            </div>
          </div>

          <a
            href={course.cheatSheetPdf.downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-950 font-extrabold text-xs flex items-center gap-1.5 transition shrink-0 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      )}

      {/* 3. Course Overview & Curriculum Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Course Curriculum Accordion */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Course Curriculum ({course.lessons.length} Modules)</span>
            </h3>
            <span className="text-xs text-slate-400">{course.durationHours} hrs total</span>
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
                      ? 'bg-blue-600/20 border-cyan-400 text-cyan-200'
                      : 'bg-dark-850 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isUnlocked
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isUnlocked ? (
                        <Play className="w-4 h-4 fill-blue-400" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate text-white">{lesson.title}</h4>
                      <p className="text-[10px] text-slate-400">{lesson.durationMinutes} mins • {lesson.type.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {lesson.isFreePreview && !isEnrolled && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        FREE
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-400">{lesson.durationMinutes}m</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* What You'll Learn Section */}
          <div className="p-4 sm:p-5 rounded-3xl bg-dark-850 border border-slate-800 space-y-3 mt-4">
            <h3 className="font-extrabold text-sm text-white">What You'll Learn in This Course:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.learningOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Instructor & Pricing Card */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Course Instructor
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">{course.instructor.name}</h4>
                  <p className="text-[11px] text-slate-400">{course.instructor.role}</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-dark-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Student Rating</span>
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {course.rating} ({course.reviewCount})
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Enrolled Students</span>
                <span className="font-bold text-white">{course.studentsEnrolled.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Skill Level</span>
                <span className="font-bold text-cyan-400">{course.level}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Certificate</span>
                <span className="font-bold text-amber-300">Included on Completion</span>
              </div>
            </div>

            {!isEnrolled ? (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Special Student Price:</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-cyan-400">₹{course.price}</span>
                    <span className="text-xs text-slate-500 line-through">₹{course.originalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsRazorpayOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Buy Now via Razorpay (₹{course.price})</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> You own this course
                  </span>
                </div>
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Award className="w-4 h-4" />
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
    </div>
  );
};
