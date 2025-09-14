'use client';

import React, { Component, ReactNode } from 'react';
import KidsErrorScreen from './KidsErrorScreen';
import { useKidsOfflineDetection } from '../../hooks/useOfflineDetection';

interface KidsErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onRetry?: () => void;
  onGoHome?: () => void;
}

interface KidsErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  retryCount: number;
}

class KidsErrorBoundaryClass extends Component<KidsErrorBoundaryProps, KidsErrorBoundaryState> {
  constructor(props: KidsErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<KidsErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Kids Dashboard Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
    
    // In production, send to error reporting service with child-safe data
    if (process.env.NODE_ENV === 'production') {
      // Example: sendKidsAppError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prev => ({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: prev.retryCount + 1
    }));
    this.props.onRetry?.();
  };

  handleGoHome = () => {
    // Reset error state and navigate home
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: 0
    });
    this.props.onGoHome?.();
  };

  getErrorType = (): 'network' | 'video' | 'general' => {
    const error = this.state.error;
    if (!error) return 'general';
    
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('network') || 
        errorMessage.includes('fetch') || 
        errorMessage.includes('connection')) {
      return 'network';
    }
    
    if (errorMessage.includes('video') || 
        errorMessage.includes('media') || 
        errorMessage.includes('playback')) {
      return 'video';
    }
    
    return 'general';
  };

  getChildFriendlyErrorMessage = (): string => {
    const errorType = this.getErrorType();
    const retryCount = this.state.retryCount;
    
    if (retryCount > 2) {
      return "This is being extra tricky today! Let's try something else or ask a grown-up for help! 🤗";
    }
    
    switch (errorType) {
      case 'network':
        return "The internet is being a little shy right now! Let's try again! 📡";
      case 'video':
        return "This video is taking a really long nap! Let's try waking it up! 😴";
      default:
        return "Oops! Something got a little mixed up! Don't worry, we can fix it together! 🔧";
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <KidsErrorScreen
          type={this.getErrorType()}
          message={this.getChildFriendlyErrorMessage()}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
          showRetryButton={this.state.retryCount < 3} // Limit retries to prevent frustration
          showHomeButton={true}
        />
      );
    }

    return this.props.children;
  }
}

// Wrapper component that includes offline detection
export default function KidsErrorBoundary(props: KidsErrorBoundaryProps) {
  return (
    <OfflineWrapper>
      <KidsErrorBoundaryClass {...props} />
    </OfflineWrapper>
  );
}

// Offline detection wrapper component
function OfflineWrapper({ children }: { children: ReactNode }) {
  const { 
    isOffline, 
    showOfflineMessage, 
    getKidsOfflineMessage,
    getKidsOnlineMessage,
    isReconnecting 
  } = useKidsOfflineDetection();

  // Show offline screen when offline
  if (isOffline && showOfflineMessage) {
    return (
      <KidsErrorScreen
        type="offline"
        message={getKidsOfflineMessage() || undefined}
        showRetryButton={false}
        showHomeButton={false}
      />
    );
  }

  // Show reconnection message briefly
  if (isReconnecting) {
    const onlineMessage = getKidsOnlineMessage();
    if (onlineMessage) {
      return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg text-lg font-bold">
            {onlineMessage}
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

// Specific error boundaries for different dashboard sections
export function VideoErrorBoundary({ children, onRetry, onGoHome }: {
  children: ReactNode;
  onRetry?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <KidsErrorBoundary
      onRetry={onRetry}
      onGoHome={onGoHome}
      fallback={
        <KidsErrorScreen
          type="video"
          message="This video is being extra sleepy today! Let's try another one! 😴"
          onRetry={onRetry}
          onGoHome={onGoHome}
        />
      }
    >
      {children}
    </KidsErrorBoundary>
  );
}

export function HomeworkErrorBoundary({ children, onRetry, onGoHome }: {
  children: ReactNode;
  onRetry?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <KidsErrorBoundary
      onRetry={onRetry}
      onGoHome={onGoHome}
      fallback={
        <KidsErrorScreen
          type="general"
          message="Your homework is playing hide and seek! Let's find it together! 🔍"
          onRetry={onRetry}
          onGoHome={onGoHome}
        />
      }
    >
      {children}
    </KidsErrorBoundary>
  );
}