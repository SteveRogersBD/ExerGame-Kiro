'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Toaster } from '@/components/ui/toaster';
import { NotificationProvider } from '@/components/dashboard/NotificationService';
import ErrorBoundary from '@/components/dashboard/ErrorBoundary';
import DashboardErrorBoundary from '@/components/dashboard/DashboardErrorBoundary';
import LoadingState from '@/components/dashboard/LoadingState';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication with a timeout to prevent infinite loading
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/parent/auth');
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/parent/auth');
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure localStorage is available
    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-yellow-50 flex items-center justify-center">
        <LoadingState message="Loading dashboard..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardErrorBoundary>
      <NotificationProvider>
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-yellow-50">
          {/* Decorative corner elements - hidden on mobile for cleaner look */}
          <div className="hidden md:block fixed top-0 left-0 w-32 h-32 bg-gradient-to-br from-sky-200/20 to-purple-200/20 rounded-full -translate-x-16 -translate-y-16 pointer-events-none" />
          <div className="hidden md:block fixed top-0 right-0 w-24 h-24 bg-gradient-to-bl from-yellow-200/20 to-purple-200/20 rounded-full translate-x-12 -translate-y-12 pointer-events-none" />
          <div className="hidden md:block fixed bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-200/20 to-sky-200/20 rounded-full -translate-x-10 translate-y-10 pointer-events-none" />
          <div className="hidden md:block fixed bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-yellow-200/20 to-sky-200/20 rounded-full translate-x-14 translate-y-14 pointer-events-none" />
          
          <div className="flex">
            <ErrorBoundary>
              <DashboardSidebar />
            </ErrorBoundary>
            <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
              <ErrorBoundary>
                <DashboardHeader />
              </ErrorBoundary>
              <main className="flex-1 p-3 sm:p-4 lg:p-6">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>
            </div>
          </div>
          <Toaster />
        </div>
      </NotificationProvider>
    </DashboardErrorBoundary>
  );
}