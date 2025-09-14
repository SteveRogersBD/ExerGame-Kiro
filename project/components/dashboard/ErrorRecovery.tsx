'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KidsLoadingScreen } from './KidsLoadingScreen';
import { KidsErrorScreen } from './KidsErrorScreen';

interface ErrorRecoveryProps {
  children: ReactNode;
  onError?: (error: Error) => void;
  onRetry?: () => void;
  onSuccess?: () => void;
  maxRetries?: number;
  retryDelay?: number;
  loadingMessage?: string;
  errorMessage?: string;
  errorType?: 'network' | 'video' | 'general';
}

interface ErrorRecoveryState {
  isLoading: boolean;
  hasError: boolean;
  error: Error | null;
  retryCount: number;
  isRetrying: boolean;
}

export default function ErrorRecovery({
  children,
  onError,
  onRetry,
  onSuccess,
  maxRetries = 3,
  retryDelay = 2000,
  loadingMessage,
  errorMessage,
  errorType = 'general'
}: ErrorRecoveryProps) {
  const [state, setState] = useState<ErrorRecoveryState>({
    isLoading: false,
    hasError: false,
    error: null,
    retryCount: 0,
    isRetrying: false
  });

  // Handle error occurrence
  const handleError = useCallback((error: Error) => {
    console.error('ErrorRecovery caught error:', error);
    setState(prev => ({
      ...prev,
      hasError: true,
      error,
      isLoading: false,
      isRetrying: false
    }));
    onError?.(error);
  }, [onError]);

  // Handle retry attempt
  const handleRetry = useCallback(async () => {
    if (state.retryCount >= maxRetries) {
      console.warn('Max retries reached, not retrying');
      return;
    }

    setState(prev => ({
      ...prev,
      isRetrying: true,
      isLoading: true
    }));

    // Wait for retry delay
    await new Promise(resolve => setTimeout(resolve, retryDelay));

    setState(prev => ({
      ...prev,
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
      isRetrying: false,
      isLoading: false
    }));

    onRetry?.();
  }, [state.retryCount, maxRetries, retryDelay, onRetry]);

  // Handle successful recovery
  const handleSuccess = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasError: false,
      error: null,
      isLoading: false,
      isRetrying: false,
      retryCount: 0
    }));
    onSuccess?.();
  }, [onSuccess]);

  // Reset error state
  const resetError = useCallback(() => {
    setState({
      isLoading: false,
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false
    });
  }, []);

  // Set loading state
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading
    }));
  }, []);

  // Get child-friendly error message based on retry count and error type
  const getErrorMessage = useCallback(() => {
    if (errorMessage) return errorMessage;

    const { retryCount } = state;
    
    if (retryCount >= maxRetries) {
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
  }, [errorMessage, state.retryCount, maxRetries, errorType]);

  // Get loading message based on retry state
  const getLoadingMessage = useCallback(() => {
    if (loadingMessage) return loadingMessage;
    
    if (state.isRetrying) {
      return "Trying again! We've got this! 🚀";
    }
    
    return "Getting things ready for you! 🎮";
  }, [loadingMessage, state.isRetrying]);

  // Provide context to children
  const errorRecoveryContext = {
    handleError,
    handleRetry,
    handleSuccess,
    resetError,
    setLoading,
    state
  };

  return (
    <ErrorRecoveryProvider value={errorRecoveryContext}>
      <AnimatePresence mode="wait">
        {state.isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <KidsLoadingScreen
              message={getLoadingMessage()}
              type="general"
            />
          </motion.div>
        )}
        
        {state.hasError && !state.isLoading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <KidsErrorScreen
              type={errorType}
              message={getErrorMessage()}
              onRetry={state.retryCount < maxRetries ? handleRetry : undefined}
              showRetryButton={state.retryCount < maxRetries}
              showHomeButton={true}
            />
          </motion.div>
        )}
        
        {!state.hasError && !state.isLoading && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorRecoveryProvider>
  );
}

// Context for error recovery
import { createContext, useContext } from 'react';

interface ErrorRecoveryContextType {
  handleError: (error: Error) => void;
  handleRetry: () => void;
  handleSuccess: () => void;
  resetError: () => void;
  setLoading: (loading: boolean) => void;
  state: ErrorRecoveryState;
}

const ErrorRecoveryContext = createContext<ErrorRecoveryContextType | null>(null);

function ErrorRecoveryProvider({ 
  children, 
  value 
}: { 
  children: ReactNode; 
  value: ErrorRecoveryContextType;
}) {
  return (
    <ErrorRecoveryContext.Provider value={value}>
      {children}
    </ErrorRecoveryContext.Provider>
  );
}

// Hook to use error recovery context
export function useErrorRecovery() {
  const context = useContext(ErrorRecoveryContext);
  if (!context) {
    throw new Error('useErrorRecovery must be used within an ErrorRecovery component');
  }
  return context;
}

// Higher-order component for easy error recovery wrapping
export function withErrorRecovery<P extends object>(
  Component: React.ComponentType<P>,
  options: Partial<ErrorRecoveryProps> = {}
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorRecovery {...options}>
        <Component {...props} />
      </ErrorRecovery>
    );
  };
}

// Specific error recovery components for common scenarios
export function VideoErrorRecovery({ children, onRetry }: {
  children: ReactNode;
  onRetry?: () => void;
}) {
  return (
    <ErrorRecovery
      errorType="video"
      maxRetries={2}
      retryDelay={3000}
      onRetry={onRetry}
      loadingMessage="Getting your video ready! 🎬"
    >
      {children}
    </ErrorRecovery>
  );
}

export function NetworkErrorRecovery({ children, onRetry }: {
  children: ReactNode;
  onRetry?: () => void;
}) {
  return (
    <ErrorRecovery
      errorType="network"
      maxRetries={3}
      retryDelay={2000}
      onRetry={onRetry}
      loadingMessage="Connecting to the internet! 📡"
    >
      {children}
    </ErrorRecovery>
  );
}