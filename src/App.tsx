import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { HomePage } from './pages/HomePage';
import { MarketPage } from './pages/MarketPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>('/');

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (currentPath.startsWith('/courses/')) {
      const courseId = currentPath.replace('/courses/', '');
      return <CourseDetailPage courseId={courseId} onNavigate={handleNavigate} />;
    }

    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={handleNavigate} />;
      case '/market':
        return <MarketPage />;
      case '/courses':
        return <CoursesPage onNavigate={handleNavigate} />;
      case '/opportunities':
        return <OpportunitiesPage />;
      case '/community':
        return <CommunityPage />;
      case '/profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case '/admin':
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-brand-blue selection:text-white">
      {/* Top Header */}
      <AppHeader onNavigate={handleNavigate} currentPath={currentPath} />

      {/* Main Responsive Body Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 pt-4">
        {renderContent()}
      </main>

      {/* Bottom Mobile Navigation (Hidden inside Admin View for clean workspace) */}
      {currentPath !== '/admin' && (
        <BottomNavigation currentPath={currentPath} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
