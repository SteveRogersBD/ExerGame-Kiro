'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import FloatingMascots from '@/components/FloatingMascots';
import KidsDashboardHeader from '@/components/dashboard/KidsDashboardHeader';
import PresetVideosSection from '@/components/dashboard/PresetVideosSection';
import HomeworkSection from '@/components/dashboard/HomeworkSection';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import BadgesPage from '@/components/dashboard/BadgesPage';
import HelpPage from '@/components/dashboard/HelpPage';
import VideoTransition from '@/components/dashboard/VideoTransition';
import VideoPlayer from '@/components/dashboard/VideoPlayer';
import CompletionScreen from '@/components/dashboard/CompletionScreen';
import MissionIntro from '@/components/dashboard/MissionIntro';
import LoadingScreen from '@/components/dashboard/LoadingScreen';
import KidsErrorScreen from '@/components/dashboard/KidsErrorScreen';
import KidsErrorBoundary from '@/components/dashboard/KidsErrorBoundary';
import MascotGuide from '@/components/dashboard/MascotGuide';
import PageTransition from '@/components/ui/PageTransition';
import VisualFeedback, { useVisualFeedback } from '@/components/ui/VisualFeedback';
import { useInteractiveAnimations } from '@/hooks/useInteractiveAnimations';
import { useMascotGuide } from '@/hooks/useMascotGuide';
import { useOfflineDetection } from '@/hooks/useOfflineDetection';
import { useKidsDashboard } from '@/hooks/useKidsDashboard';
import { useKidsDashboardRouter } from '@/hooks/useKidsDashboardRouter';
import { Video, HomeworkItem, Badge } from '@/types/dashboard';

export default function PlayPage() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interactive animations and feedback
  const { playSound, triggerHaptic } = useInteractiveAnimations();
  const { feedback, addFeedback, removeFeedback } = useVisualFeedback();
  const { currentGuide, isVisible: showMascot, showCustomGuide, hideGuide } = useMascotGuide();
  const { isOffline } = useOfflineDetection();

  // Dashboard state management
  const {
    state: dashboardState,
    isInitialized,
    addBadge,
    updateHomeworkStatus,
    incrementStreak,
    navigateToSection,
  } = useKidsDashboard({
    onError: (errorMsg) => setError(errorMsg),
    onSuccess: (message) => addFeedback({
      type: 'success',
      message,
      emoji: '✨',
      duration: 2000
    })
  });

  // Dashboard routing
  const {
    selectedVideo,
    selectedHomework,
    completionScore,
    startVideo,
    startHomework,
    completeTransition,
    completeMissionIntro,
    completeVideo,
    quitVideo,
    goHome,
    showBadges,
    showHelp,
    registerCleanup,
    isCurrentRoute,
  } = useKidsDashboardRouter({
    onRouteChange: (route, previousRoute) => {
      console.log(`Route changed from ${previousRoute} to ${route}`);
    },
    onVideoStart: (video) => {
      showCustomGuide(`Get ready! ${video.title} is starting soon!`);
      playSound('whoosh');
      triggerHaptic('medium');
    },
    onVideoComplete: () => {
      showCustomGuide('Fantastic job! You earned a new badge!');
      playSound('success');
      triggerHaptic('heavy');
    },
    onHomeworkStart: (homework) => {
      showCustomGuide(`Time for your mission: ${homework.title}! Let's do this!`);
      playSound('whoosh');
      triggerHaptic('medium');
    }
  });

  // Refs for cleanup and stable callbacks
  const cleanupTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Refs to stabilize callback functions (initialize with current values)
  const addFeedbackRef = useRef(addFeedback);
  const showCustomGuideRef = useRef(showCustomGuide);
  const handleErrorRef = useRef<(error: Error) => void>();
  const registerCleanupRef = useRef(registerCleanup);

  // Ref to prevent multiple verifications
  const didVerifyRef = useRef(false);

  // Keep callback refs in sync
  useEffect(() => {
    addFeedbackRef.current = addFeedback;
  }, [addFeedback]);

  useEffect(() => {
    showCustomGuideRef.current = showCustomGuide;
  }, [showCustomGuide]);

  useEffect(() => {
    registerCleanupRef.current = registerCleanup;
  }, [registerCleanup]);

  // Handle video selection
  const handleVideoSelect = useCallback((video: Video) => {
    console.log('Selected video:', video.title);
    setError(null);

    // Add visual feedback
    addFeedbackRef.current({
      type: 'info',
      message: `Starting ${video.title}!`,
      emoji: '🎬',
      duration: 2000
    });

    // Start video through router
    startVideo(video);
  }, [startVideo]);

  // Handle homework selection
  const handleHomeworkSelect = useCallback((homework: HomeworkItem) => {
    console.log('Selected homework:', homework.title);
    setError(null);

    // Add visual feedback
    addFeedbackRef.current({
      type: 'info',
      message: `Starting mission: ${homework.title}!`,
      emoji: '🎯',
      duration: 2000
    });

    // Start homework through router
    startHomework(homework);
  }, [startHomework]);

  // Handle video transition completion
  const handleTransitionComplete = useCallback(() => {
    completeTransition();
    showCustomGuideRef.current('Enjoy your video! Remember to answer the quiz questions!');
  }, [completeTransition]);

  // Handle mission intro completion
  const handleMissionStart = useCallback(() => {
    completeMissionIntro();
    showCustomGuideRef.current('Mission starting! Good luck!');
  }, [completeMissionIntro]);

  // Handle video completion
  const handleVideoComplete = useCallback((score: number) => {
    // Award badge for completion
    const newBadge: Badge = {
      id: `completion-${Date.now()}`,
      name: selectedHomework ? 'Mission Complete!' : 'Video Master!',
      icon: selectedHomework ? '🎯' : '🎬',
      earnedAt: new Date(),
      category: selectedHomework ? 'homework' : 'video'
    };

    // Update dashboard state
    addBadge(newBadge);
    incrementStreak();

    // Update homework status if applicable
    if (selectedHomework) {
      updateHomeworkStatus(selectedHomework.id, 'completed');
    }

    // Celebration feedback
    addFeedbackRef.current({
      type: 'success',
      message: `Amazing! You scored ${score} points!`,
      emoji: '🎉',
      duration: 3000
    });

    // Complete video through router
    completeVideo(score);
  }, [selectedHomework, addBadge, incrementStreak, updateHomeworkStatus, completeVideo]);

  // Handle video quit
  const handleVideoQuit = useCallback(() => {
    showCustomGuideRef.current('No worries! You can try again anytime!');

    addFeedbackRef.current({
      type: 'info',
      message: 'Video stopped. Back to dashboard!',
      emoji: '🏠',
      duration: 2000
    });

    // Quit through router
    quitVideo();
  }, [quitVideo]);

  // Handle completion screen finish
  const handleCompletionFinish = useCallback(() => {
    showCustomGuideRef.current('Ready for your next adventure?');
    goHome();
  }, [goHome]);

  // Handle navigation between dashboard sections
  const handleNavigate = useCallback((view: 'dashboard' | 'badges' | 'help') => {
    // Clean up any active video players when navigating
    if (isCurrentRoute('video-player')) {
      handleVideoQuit();
      return;
    }

    // Navigate through router and dashboard state
    if (view === 'dashboard') {
      goHome();
      navigateToSection('dashboard');
    } else if (view === 'badges') {
      showBadges();
      navigateToSection('badges');
    } else if (view === 'help') {
      showHelp();
      navigateToSection('help');
    }

    // Add visual feedback for navigation
    const messages = {
      dashboard: 'Welcome back to your playground!',
      badges: 'Check out your amazing badges!',
      help: 'Need help? We\'re here for you!'
    };

    const emojis = {
      dashboard: '🏠',
      badges: '🏆',
      help: '❓'
    };

    const mascotMessages = {
      dashboard: 'What would you like to do next?',
      badges: 'Look at all your amazing achievements!',
      help: 'I\'m here to help you with anything!'
    };

    addFeedbackRef.current({
      type: 'info',
      message: messages[view],
      emoji: emojis[view],
      duration: 2000
    });

    showCustomGuideRef.current(mascotMessages[view]);
    playSound('success');
  }, [isCurrentRoute, handleVideoQuit, goHome, showBadges, showHelp, navigateToSection, playSound]);

  // Handle errors with child-friendly messaging
  const handleError = useCallback((error: Error) => {
    setError(error.message);

    // Navigate back to dashboard on error
    goHome();

    showCustomGuideRef.current('Oops! Something went wrong. Let\'s try again!');

    addFeedbackRef.current({
      type: 'error',
      message: 'Something went wrong, but we can fix it!',
      emoji: '😅',
      duration: 3000
    });
  }, [goHome]);

  // Update handleError ref
  useEffect(() => {
    handleErrorRef.current = handleError;
  }, [handleError]);

  // Retry function for error recovery
  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);

    // Simulate retry delay
    setTimeout(() => {
      setIsLoading(false);
      showCustomGuideRef.current('All better! Ready to play?');

      addFeedbackRef.current({
        type: 'success',
        message: 'Everything is working again!',
        emoji: '✨',
        duration: 2000
      });
    }, 1500);
  }, []);

  // Cleanup function for timeouts
  const cleanup = useCallback(() => {
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }
  }, []);

  // Register cleanup with router (only once when initialized)
  useEffect(() => {
    if (isInitialized) {
      registerCleanupRef.current(cleanup);
    }
  }, [isInitialized, cleanup]);

  // Initialize dashboard and check verification (runs once after initialization)
  useEffect(() => {
    if (!isInitialized || didVerifyRef.current) return;

    const checkVerification = async () => {
      try {
        didVerifyRef.current = true;

        // Simulate verification check - in production this would be more robust
        const hasVerification = sessionStorage.getItem('parentalGateVerified') === 'true' || process.env.NODE_ENV === 'development';

        if (!hasVerification) {
          // Redirect back to home if not verified
          router.push('/');
          return;
        }

        setIsVerified(true);
        setIsLoading(false);

        // Welcome message
        showCustomGuideRef.current('Welcome back! Ready for some fun learning?');

        addFeedbackRef.current({
          type: 'success',
          message: 'Welcome to your playground!',
          emoji: '🎮',
          duration: 3000
        });

      } catch (error) {
        handleErrorRef.current?.(new Error('Failed to load your dashboard'));
      }
    };

    checkVerification();
  }, [isInitialized, router]);

  // Handle offline state
  useEffect(() => {
    if (isOffline) {
      showCustomGuideRef.current('No internet? No problem! Some features might not work, but you can still play!');

      addFeedbackRef.current({
        type: 'info',
        message: 'You\'re offline, but you can still play!',
        emoji: '📶',
        duration: 4000
      });
    }
  }, [isOffline]);

  // Auto-hide mascot after periods of inactivity
  useEffect(() => {
    if (showMascot) {
      const timer = setTimeout(() => {
        hideGuide();
      }, 10000); // Hide after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [showMascot, hideGuide]);

  // Show loading screen
  if (isLoading) {
    return (
      <LoadingScreen
        message="Getting your playground ready!"
        mascotImage="/images/animals/smiling_mascot.png"
      />
    );
  }

  // Show error screen if there's an error
  if (error) {
    return (
      <KidsErrorScreen
        message={error}
        onRetry={handleRetry}
        onGoHome={() => router.push('/')}
      />
    );
  }

  // Redirect if not verified
  if (!isVerified) {
    return null; // Will redirect to home
  }

  return (
    <KidsErrorBoundary onError={handleError}>
      <main className="min-h-screen w-full overflow-hidden relative">
        {/* Animated Background Component */}
        <AnimatedBackground />

        {/* Floating Mascots - Random animal animations */}
        <FloatingMascots />

        {/* Mission Intro Screen */}
        {isCurrentRoute('mission-intro') && selectedHomework && (
          <MissionIntro
            homework={selectedHomework}
            onStartMission={handleMissionStart}
            onBack={goHome}
          />
        )}

        {/* Video Player */}
        {isCurrentRoute('video-player') && selectedVideo && (
          <VideoPlayer
            video={selectedVideo}
            onComplete={handleVideoComplete}
            onQuit={handleVideoQuit}
          />
        )}

        {/* Completion Screen */}
        {isCurrentRoute('completion') && selectedVideo && (
          <CompletionScreen
            score={completionScore}
            totalQuestions={selectedVideo.quizQuestions.length}
            earnedBadge={selectedVideo.completionReward}
            onBackToDashboard={handleCompletionFinish}
            isVisible={true}
          />
        )}

        {/* Video Transition Screen */}
        <VideoTransition
          isVisible={isCurrentRoute('video-transition')}
          videoTitle={selectedVideo?.title || ''}
          onTransitionComplete={handleTransitionComplete}
        />

        {/* Main Dashboard Interface */}
        {(isCurrentRoute('dashboard') || isCurrentRoute('badges') || isCurrentRoute('help')) && (
          <div className="absolute inset-0 flex flex-col z-20">
            {/* Dashboard Header - Child's avatar and name area */}
            <KidsDashboardHeader
              childName={dashboardState.user.name}
              childAvatar={dashboardState.user.avatar}
              streak={dashboardState.user.streak}
              badges={dashboardState.user.badges}
              totalBadges={dashboardState.user.badges.length}
            />

            {/* Main Content Area with Page Transitions */}
            <div className="flex-1 flex flex-col items-center overflow-y-auto">
              <PageTransition
                pageKey={dashboardState.ui.currentView}
                direction="up"
                className="w-full h-full"
              >
                {dashboardState.ui.currentView === 'dashboard' && (
                  <div className="w-full flex flex-col items-center p-6 space-y-8">
                    {/* Welcome Message */}
                    <motion.div
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                      className="text-center"
                    >
                      <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">
                        🎮 Welcome to Your Playground! 🎮
                      </h2>
                      <p className="text-xl text-white/90 drop-shadow">
                        Choose your adventure below!
                      </p>
                    </motion.div>

                    {/* Preset Videos Section */}
                    <PresetVideosSection
                      videos={dashboardState.content.presetVideos}
                      onVideoSelect={handleVideoSelect}
                    />

                    {/* Homework Section */}
                    <div className="w-full max-w-6xl mx-auto px-4">
                      <HomeworkSection
                        homework={dashboardState.content.homework}
                        onHomeworkSelect={handleHomeworkSelect}
                      />
                    </div>
                  </div>
                )}

                {dashboardState.ui.currentView === 'badges' && (
                  <BadgesPage
                    badges={dashboardState.user.badges}
                    totalEarned={dashboardState.user.badges.length}
                    onBackToDashboard={() => handleNavigate('dashboard')}
                  />
                )}

                {dashboardState.ui.currentView === 'help' && (
                  <HelpPage onBackToDashboard={() => handleNavigate('dashboard')} />
                )}
              </PageTransition>
            </div>

            {/* Bottom Navigation */}
            <BottomNavigation
              currentView={dashboardState.ui.currentView}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {/* Mascot Guide - Contextual helper */}
        <MascotGuide
          message={currentGuide?.message || ''}
          isVisible={showMascot}
          mascotImage={currentGuide?.mascotImage || "/images/animals/smiling_mascot.png"}
          position={currentGuide?.position || "corner"}
          onDismiss={hideGuide}
        />

        {/* Visual Feedback System */}
        <VisualFeedback
          feedback={feedback}
          onRemove={removeFeedback}
          position="top"
        />

        {/* Offline Indicator */}
        {isOffline && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">📶</span>
              <span className="font-bold">Playing Offline</span>
            </div>
          </motion.div>
        )}
      </main>
    </KidsErrorBoundary>
  );
}