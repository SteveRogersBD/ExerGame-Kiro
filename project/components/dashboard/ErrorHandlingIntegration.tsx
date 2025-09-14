'use client';

import { ReactNode, useState, useCallback } from 'react';
import { KidsLoadingScreen } from './KidsLoadingScreen';
import { KidsErrorScreen } from './KidsErrorScreen';
import { useKidsOfflineDetection } from '../../hooks/useOfflineDetection';
import GracefulTransition from './GracefulTransition';
import KidsErrorBoundary from './KidsErrorBoundary';

interface ErrorHandlingIntegrationProps {
  children: ReactNode;
  type?: 'dashboard' | 'video' | 'homework' | 'general';
  onRetry?: () => void;
  onGoHome?: () => void;
  loadingMessage?: string;
  errorMessage?: string;
}

interface ErrorState {
  hasError: boolean;
  errorType: 'network' | 'video' | 'general' | null;
  isLoading: boolean;
  retryCount: number;
}

export default function ErrorHandlingIntegration({
  children,
  type = 'general',
  onRetry,
  onGoHome,
  loadingMessage,
  errorMessage
}: ErrorHandlingIntegrationProps) {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    errorType: null,
    isLoading: false,
    retryCount: 0
  });

  const { 
    isOffline, 
    showOfflineMessage, 
    getKidsOfflineMessage,
    getKidsOnlineMessage,
    isReconnecting 
  } = useKidsOfflineDetection();

  // Handle loading state
  const setLoading = useCallback((loading: boolean, message?: string) => {
    setErrorState(prev => ({
      ...prev,
      isLoading: loading,
      hasError: loading ? false : prev.hasError
    }));
  }, []);

  // Handle error state
  const setError = useCallback((errorType: 'network' | 'video' | 'general', message?: string) => {
    setErrorState(prev => ({
      ...prev,
      hasError: true,
      errorType,
      isLoading: false,
      retryCount: prev.retryCount + 1
    }));
  }, []);

  // Handle retry
  const handleRetry = useCallback(() => {
    setErrorState(prev => ({
      ...prev,
      hasError: false,
      errorType: null,
      isLoading: true
    }));
    
    // Call external retry handler after a brief delay
    setTimeout(() => {
      onRetry?.();
      setErrorState(prev => ({ ...prev, isLoading: false }));
    }, 1000);
  }, [onRetry]);

  // Handle successful recovery
  const handleSuccess = useCallback(() => {
    setErrorState({
      hasError: false,
      errorType: null,
      isLoading: false,
      retryCount: 0
    });
  }, []);

  // Get child-friendly error message based on error type and retry count
  const getErrorMessage = useCallback(() => {
    if (errorMessage) return errorMessage;

    const { errorType, retryCount } = errorState;
    
    if (retryCount >= 3) {
      return "This is being extra tricky today! Let's try something else or ask a grown-up for help! 🤗";
    }

    switch (errorType) {
      case 'network':
        if (retryCount === 0) return "The internet is taking a little break! Let's try again! 📡";
        if (retryCount === 1) return "The internet is still sleepy! One more try! 😴";
        return "The internet is being really shy today! Let's keep trying! 🌐";
      
      case 'video':
        if (retryCount === 0) return "This video is taking a nap! Let's wake it up! 😴";
        if (retryCount === 1) return "The video is still dreaming! Let's try again! 💤";
        return "This video is having a really long sleep! Let's be patient! 🛌";
      
      default:
        if (retryCount === 0) return "Oops! Something got mixed up! Let's fix it together! 🔧";
        if (retryCount === 1) return "Still a little mixed up! We're getting closer! 🎯";
        return "This is being tricky! But we don't give up! 💪";
    }
  }, [errorMessage, errorState]);

  // Get loading message based on type
  const getLoadingMessage = useCallback(() => {
    if (loadingMessage) return loadingMessage;
    
    switch (type) {
      case 'dashboard':
        return "Getting your playground ready! 🎮";
      case 'video':
        return "Starting your video adventure! 🎬";
      case 'homework':
        return "Preparing your learning mission! 📚";
      default:
        return "Getting things ready for you! ✨";
    }
  }, [loadingMessage, type]);

  // Show offline screen if offline
  if (isOffline && showOfflineMessage) {
    return (
      <KidsErrorScreen
        type="offline"
        message={getKidsOfflineMessage() || undefined}
        showRetryButton={false}
        showHomeButton={true}
        onGoHome={onGoHome}
      />
    );
  }

  // Show reconnection message briefly
  if (isReconnecting) {
    const onlineMessage = getKidsOnlineMessage();
    if (onlineMessage) {
      return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg text-lg font-bold animate-bounce">
            {onlineMessage}
          </div>
        </div>
      );
    }
  }

  return (
    <KidsErrorBoundary
      onRetry={handleRetry}
      onGoHome={onGoHome}
    >
      <GracefulTransition
        isLoading={errorState.isLoading}
        isError={errorState.hasError}
        loadingComponent={
          <KidsLoadingScreen
            type={type}
            message={getLoadingMessage()}
          />
        }
        errorComponent={
          <KidsErrorScreen
            type={errorState.errorType || 'general'}
            message={getErrorMessage()}
            onRetry={errorState.retryCount < 3 ? handleRetry : undefined}
            onGoHome={onGoHome}
            showRetryButton={errorState.retryCount < 3}
            showHomeButton={true}
          />
        }
        onTransitionComplete={handleSuccess}
      >
        {children}
      </GracefulTransition>
    </KidsErrorBoundary>
  );
}

// Specialized error handling components for different dashboard sections
export function VideoErrorHandling({ 
  children, 
  onRetry, 
  onGoHome 
}: {
  children: ReactNode;
  onRetry?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <ErrorHandlingIntegration
      type="video"
      onRetry={onRetry}
      onGoHome={onGoHome}
      loadingMessage="Getting your video ready! 🎬"
      errorMessage="This video is being sleepy! Let's try waking it up! 😴"
    >
      {children}
    </ErrorHandlingIntegration>
  );
}

export function HomeworkErrorHandling({ 
  children, 
  onRetry, 
  onGoHome 
}: {
  children: ReactNode;
  onRetry?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <ErrorHandlingIntegration
      type="homework"
      onRetry={onRetry}
      onGoHome={onGoHome}
      loadingMessage="Preparing your learning mission! 📚"
      errorMessage="Your homework is playing hide and seek! Let's find it! 🔍"
    >
      {children}
    </ErrorHandlingIntegration>
  );
}

export function DashboardErrorHandling({ 
  children, 
  onRetry, 
  onGoHome 
}: {
  children: ReactNode;
  onRetry?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <ErrorHandlingIntegration
      type="dashboard"
      onRetry={onRetry}
      onGoHome={onGoHome}
      loadingMessage="Getting your playground ready! 🎮"
      errorMessage="Something got mixed up in the playground! Let's fix it! 🔧"
    >
      {children}
    </ErrorHandlingIntegration>
  );
}