'use client';

import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GracefulTransitionProps {
  children: ReactNode;
  isError?: boolean;
  isLoading?: boolean;
  errorComponent?: ReactNode;
  loadingComponent?: ReactNode;
  transitionDuration?: number;
  onTransitionComplete?: () => void;
}

export default function GracefulTransition({
  children,
  isError = false,
  isLoading = false,
  errorComponent,
  loadingComponent,
  transitionDuration = 0.5,
  onTransitionComplete
}: GracefulTransitionProps) {
  const [currentState, setCurrentState] = useState<'loading' | 'error' | 'content'>('content');
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setCurrentState('loading');
      setShowContent(false);
    } else if (isError) {
      setCurrentState('error');
      setShowContent(false);
    } else {
      setCurrentState('content');
      setShowContent(true);
    }
  }, [isLoading, isError]);

  const handleTransitionComplete = () => {
    onTransitionComplete?.();
  };

  const transitionVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: transitionDuration,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -20,
      transition: {
        duration: transitionDuration * 0.7,
        ease: "easeIn"
      }
    }
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={handleTransitionComplete}>
      {currentState === 'loading' && loadingComponent && (
        <motion.div
          key="loading"
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full h-full"
        >
          {loadingComponent}
        </motion.div>
      )}
      
      {currentState === 'error' && errorComponent && (
        <motion.div
          key="error"
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full h-full"
        >
          {errorComponent}
        </motion.div>
      )}
      
      {currentState === 'content' && showContent && (
        <motion.div
          key="content"
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full h-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Specialized transition components for common use cases
export function VideoTransition({ 
  children, 
  isError, 
  isLoading, 
  onRetry, 
  onGoHome 
}: {
  children: ReactNode;
  isError?: boolean;
  isLoading?: boolean;
  onRetry?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <GracefulTransition
      isError={isError}
      isLoading={isLoading}
      errorComponent={
        <div className="min-h-screen bg-gradient-to-br from-red-200 via-orange-200 to-yellow-200 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">😴</div>
            <h2 className="text-3xl font-bold text-white mb-4">Video is Sleepy!</h2>
            <p className="text-xl text-white/90 mb-8">This video is taking a little nap. Let's try waking it up!</p>
            <div className="flex gap-4 justify-center">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold px-8 py-4 rounded-3xl shadow-lg"
                >
                  Try Again! 🔄
                </button>
              )}
              {onGoHome && (
                <button
                  onClick={onGoHome}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold px-8 py-4 rounded-3xl shadow-lg"
                >
                  Go Home 🏠
                </button>
              )}
            </div>
          </div>
        </div>
      }
      loadingComponent={
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🎬</div>
            <h2 className="text-3xl font-bold text-white mb-4">Getting Your Video Ready!</h2>
            <p className="text-xl text-white/90">Just a moment while we prepare something awesome!</p>
          </div>
        </div>
      }
    >
      {children}
    </GracefulTransition>
  );
}

export function DashboardTransition({ 
  children, 
  isError, 
  isLoading, 
  onRetry 
}: {
  children: ReactNode;
  isError?: boolean;
  isLoading?: boolean;
  onRetry?: () => void;
}) {
  return (
    <GracefulTransition
      isError={isError}
      isLoading={isLoading}
      errorComponent={
        <div className="min-h-screen bg-gradient-to-br from-wiggle-blue via-wiggle-purple to-wiggle-pink flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🤔</div>
            <h2 className="text-3xl font-bold text-white mb-4">Oops! Something Happened!</h2>
            <p className="text-xl text-white/90 mb-8">Don't worry! Sometimes things get a little mixed up. Let's try again!</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold px-8 py-4 rounded-3xl shadow-lg"
              >
                Try Again! 🔄
              </button>
            )}
          </div>
        </div>
      }
      loadingComponent={
        <div className="min-h-screen bg-gradient-to-br from-wiggle-blue via-wiggle-purple to-wiggle-pink flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🎮</div>
            <h2 className="text-3xl font-bold text-white mb-4">Getting Your Playground Ready!</h2>
            <p className="text-xl text-white/90">We're setting up all your fun activities!</p>
          </div>
        </div>
      }
    >
      {children}
    </GracefulTransition>
  );
}