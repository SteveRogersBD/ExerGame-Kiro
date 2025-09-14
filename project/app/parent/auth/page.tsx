'use client';

import { useState, lazy, Suspense, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  AuthCard, 
  AuthTabs, 
  CreateAccountFormData, 
  SignInFormData
} from '@/components/auth';
import { toast, Toaster } from 'sonner';
import { useKeyboardNavigation, useScreenReaderAnnouncement } from '@/hooks/useKeyboardNavigation';

// Lazy load modal components for better performance
const ForgotPasswordModal = lazy(() => import('@/components/auth/ForgotPasswordModal').then(module => ({ default: module.ForgotPasswordModal })));
const ForgotPINModal = lazy(() => import('@/components/auth/ForgotPINModal').then(module => ({ default: module.ForgotPINModal })));

export default function ParentAuth() {
  const router = useRouter();
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isForgotPINOpen, setIsForgotPINOpen] = useState(false);
  
  // Enhanced accessibility hooks
  useKeyboardNavigation();
  const { announce } = useScreenReaderAnnouncement();

  // Memoize handlers to prevent unnecessary re-renders
  const handleCreateAccount = useCallback(async (data: CreateAccountFormData) => {
    try {
      // Additional client-side validation check
      if (!data.parentName?.trim()) {
        toast.error('Parent name is required');
        return;
      }
      
      if (!data.email?.trim()) {
        toast.error('Email is required');
        return;
      }
      
      if (!data.password) {
        toast.error('Password is required');
        return;
      }
      
      if (data.password !== data.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      
      if (!data.agreeToTerms) {
        toast.error('You must agree to the terms and privacy policy');
        return;
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data in localStorage for demo purposes
      const userData = {
        email: data.email,
        fullName: data.parentName,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('authToken', 'demo-auth-token-' + Date.now());
      localStorage.setItem('userData', JSON.stringify(userData));
      
      toast.success('Account created (demo)', {
        description: 'Welcome to WiggleWorld! Redirecting to your dashboard...',
        duration: 4000,
      });
      
      // Announce to screen readers
      announce('Account created successfully. Redirecting to your dashboard.', 'assertive');
      
      // Redirect to parent dashboard after a short delay
      setTimeout(() => {
        router.push('/parent/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed', {
        description: 'Please check your information and try again.',
        duration: 4000,
      });
    }
  }, [router, announce]);

  const handleSignIn = useCallback(async (data: SignInFormData) => {
    try {
      // Additional client-side validation check
      if (!data.email?.trim()) {
        toast.error('Email is required');
        return;
      }
      
      if (!data.password) {
        toast.error('Password is required');
        return;
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password combination
      if (data.email && data.password) {
        const userData = {
          email: data.email,
          fullName: 'Demo Parent',
          loginAt: new Date().toISOString(),
          rememberMe: data.rememberMe || false
        };
        
        localStorage.setItem('authToken', 'demo-auth-token-' + Date.now());
        localStorage.setItem('userData', JSON.stringify(userData));
        
        toast.success('Signed in (demo)', {
          description: 'Welcome back! Redirecting to your dashboard...',
          duration: 4000,
        });
        
        // Announce to screen readers
        announce('Signed in successfully. Redirecting to your dashboard.', 'assertive');
        
        // Redirect to parent dashboard after a short delay
        setTimeout(() => {
          router.push('/parent/dashboard');
        }, 1500);
      } else {
        toast.error('Invalid credentials', {
          description: 'Please check your email and password.',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: 'Please check your credentials and try again.',
        duration: 4000,
      });
    }
  }, [router, announce]);

  const handleGoogleSignIn = useCallback(() => {
    console.log('Google sign in clicked');
    toast.success('Google Sign In (demo)');
  }, []);

  const handleTermsClick = useCallback(() => {
    console.log('Terms & Conditions clicked');
    toast.info('Terms & Conditions (demo)');
  }, []);

  const handlePrivacyClick = useCallback(() => {
    console.log('Privacy Policy clicked');
    toast.info('Privacy Policy (demo)');
  }, []);

  const handleForgotPassword = useCallback(() => {
    setIsForgotPasswordOpen(true);
  }, []);

  const handleForgotPIN = useCallback(() => {
    setIsForgotPINOpen(true);
  }, []);

  const handleForgotPasswordSubmit = useCallback(async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset requested for:', email);
  }, []);

  // Memoize modal close handlers
  const handleCloseForgotPassword = useCallback(() => setIsForgotPasswordOpen(false), []);
  const handleCloseForgotPIN = useCallback(() => setIsForgotPINOpen(false), []);

  // Memoize auth tabs props to prevent unnecessary re-renders
  const authTabsProps = useMemo(() => ({
    defaultTab: "create-account" as const,
    onCreateAccount: handleCreateAccount,
    onSignIn: handleSignIn,
    onGoogleSignIn: handleGoogleSignIn,
    onTermsClick: handleTermsClick,
    onPrivacyClick: handlePrivacyClick,
    onForgotPassword: handleForgotPassword,
    onForgotPIN: handleForgotPIN,
  }), [
    handleCreateAccount,
    handleSignIn,
    handleGoogleSignIn,
    handleTermsClick,
    handlePrivacyClick,
    handleForgotPassword,
    handleForgotPIN
  ]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Skip link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Skip to main authentication content"
      >
        Skip to main content
      </a>
      
      <AnimatedBackground />
      
      {/* Mobile Layout */}
      <div className="relative z-10 min-h-screen lg:hidden" style={{ contentVisibility: 'auto' }}>
        {/* Mobile Tiger Image - Top Section */}
        <div className="flex justify-center items-center pt-8 pb-4 px-4">
          <div className="relative w-full max-w-xs">
            <Image
              src="/images/signInTiger.png"
              alt="Friendly tiger mascot welcoming parents to WiggleWorld"
              width={400}
              height={400}
              className="w-full h-auto object-contain"
              priority
              sizes="(max-width: 768px) 300px, 400px"
            />
          </div>
        </div>

        {/* Mobile Auth Content */}
        <div className="flex-1 flex flex-col justify-center px-4 pb-8 min-h-0">
          <div className="w-full max-w-sm mx-auto">
            {/* Page Header */}
            <header className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 font-fredoka">Parent Zone</h1>
              <p className="text-gray-600 text-base sm:text-lg auth-text-readable">Manage settings, PIN, and permissions.</p>
            </header>

            {/* Main Content */}
            <main id="main-content" role="main">
              {/* Auth Card with Tabs */}
              <AuthCard>
                <AuthTabs {...authTabsProps} />
              </AuthCard>
            </main>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <motion.a
                href="/"
                className="text-gray-600 hover:text-wiggle-purple font-medium transition-colors inline-flex items-center justify-center gap-2 text-sm touch-target rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back to Home
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="relative z-10 min-h-screen hidden lg:flex items-center justify-center p-6 xl:p-8" style={{ contentVisibility: 'auto' }}>
        <div className="w-full max-w-7xl mx-auto">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Left side - Tiger Image */}
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-2xl">
                <Image
                  src="/images/signInTiger.png"
                  alt="Friendly tiger mascot welcoming parents to WiggleWorld Parent Zone"
                  width={800}
                  height={800}
                  className="w-full h-auto object-contain"
                  style={{ 
                    minHeight: '67vh',
                    maxHeight: '80vh'
                  }}
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            </div>

            {/* Right side - Auth Form */}
            <div className="w-full max-w-lg mx-auto lg:mx-0 flex flex-col justify-center">
              {/* Page Header */}
              <header className="text-center lg:text-left mb-8">
                <h1 className="text-5xl font-bold text-gray-800 mb-3 font-fredoka">Parent Zone</h1>
                <p className="text-gray-600 text-xl auth-text-readable">Manage settings, PIN, and permissions.</p>
              </header>

              {/* Main Content */}
              <main id="main-content" role="main">
                {/* Auth Card with Tabs */}
                <AuthCard>
                  <AuthTabs {...authTabsProps} />
                </AuthCard>
              </main>

              {/* Back to Home */}
              <div className="mt-6 text-center lg:text-left">
                <motion.a
                  href="/"
                  className="text-gray-600 hover:text-wiggle-purple font-medium transition-colors inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  ← Back to Home
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Live region for screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="auth-live-region"
        id="auth-announcements"
      />
      
      {/* Toast notifications */}
      <Toaster 
        position="top-center"
        richColors
        closeButton
      />

      {/* Lazy-loaded Modals with Suspense */}
      <Suspense fallback={null}>
        {isForgotPasswordOpen && (
          <ForgotPasswordModal
            isOpen={isForgotPasswordOpen}
            onClose={handleCloseForgotPassword}
            onSubmit={handleForgotPasswordSubmit}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {isForgotPINOpen && (
          <ForgotPINModal
            isOpen={isForgotPINOpen}
            onClose={handleCloseForgotPIN}
          />
        )}
      </Suspense>
    </div>
  );
}