'use client';

import { useState, useCallback } from 'react';

export interface MascotGuideState {
  message: string;
  mascotImage?: string;
  position?: 'corner' | 'center';
  autoHide?: boolean;
  autoHideDelay?: number;
}

export interface MascotGuideContexts {
  welcome: MascotGuideState;
  videoHover: MascotGuideState;
  videoStart: MascotGuideState;
  homeworkStart: MascotGuideState;
  quizCorrect: MascotGuideState;
  quizIncorrect: MascotGuideState;
  completion: MascotGuideState;
  badgeEarned: MascotGuideState;
  help: MascotGuideState;
  error: MascotGuideState;
  loading: MascotGuideState;
}

const DEFAULT_CONTEXTS: MascotGuideContexts = {
  welcome: {
    message: "Welcome to your playground! Let's have some fun!",
    mascotImage: '/images/mascots/happy_tiger.png',
    position: 'center',
    autoHideDelay: 4000,
  },
  videoHover: {
    message: "This looks exciting! Tap to start watching!",
    mascotImage: '/images/mascots/smilling_mascot.png',
    position: 'corner',
    autoHideDelay: 3000,
  },
  videoStart: {
    message: "Get ready for an awesome adventure!",
    mascotImage: '/images/mascots/happy_tiger.png',
    position: 'corner',
    autoHideDelay: 2000,
  },
  homeworkStart: {
    message: "Time for today's mission! You've got this!",
    mascotImage: '/images/mascots/smilling_mascot.png',
    position: 'corner',
    autoHideDelay: 3000,
  },
  quizCorrect: {
    message: "Great job! That's the right answer!",
    mascotImage: '/images/mascots/happy_tiger.png',
    position: 'corner',
    autoHideDelay: 2000,
  },
  quizIncorrect: {
    message: "Almost! Try again, you can do it!",
    mascotImage: '/images/mascots/confused_tiger.png',
    position: 'corner',
    autoHideDelay: 2500,
  },
  completion: {
    message: "Amazing work! You completed everything!",
    mascotImage: '/images/mascots/happy_tiger.png',
    position: 'center',
    autoHideDelay: 5000,
  },
  badgeEarned: {
    message: "Wow! You earned a new badge! Keep it up!",
    mascotImage: '/images/mascots/happy_tiger.png',
    position: 'center',
    autoHide: false, // Let user dismiss manually for achievements
  },
  help: {
    message: "Need help? I'm here to guide you through everything!",
    mascotImage: '/images/mascots/confused_tiger.png',
    position: 'corner',
    autoHide: false, // Keep help visible until dismissed
  },
  error: {
    message: "Oops! Something went wrong. Let's try again together!",
    mascotImage: '/images/mascots/sad_tiger.png',
    position: 'center',
    autoHide: false, // Keep error visible until user takes action
  },
  loading: {
    message: "Getting everything ready for you! Almost there!",
    mascotImage: '/images/mascots/smilling_mascot.png',
    position: 'corner',
    autoHide: false, // Keep loading message until content loads
  },
};

export const useMascotGuide = () => {
  const [currentGuide, setCurrentGuide] = useState<MascotGuideState | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showGuide = useCallback((context: keyof MascotGuideContexts | MascotGuideState) => {
    if (typeof context === 'string') {
      // Use predefined context
      setCurrentGuide(DEFAULT_CONTEXTS[context]);
    } else {
      // Use custom guide state
      setCurrentGuide(context);
    }
    setIsVisible(true);
  }, []);

  const hideGuide = useCallback(() => {
    setIsVisible(false);
    // Clear the guide after animation completes
    setTimeout(() => setCurrentGuide(null), 500);
  }, []);

  const showWelcome = useCallback(() => showGuide('welcome'), [showGuide]);
  const showVideoHover = useCallback(() => showGuide('videoHover'), [showGuide]);
  const showVideoStart = useCallback(() => showGuide('videoStart'), [showGuide]);
  const showHomeworkStart = useCallback(() => showGuide('homeworkStart'), [showGuide]);
  const showQuizCorrect = useCallback(() => showGuide('quizCorrect'), [showGuide]);
  const showQuizIncorrect = useCallback(() => showGuide('quizIncorrect'), [showGuide]);
  const showCompletion = useCallback(() => showGuide('completion'), [showGuide]);
  const showBadgeEarned = useCallback(() => showGuide('badgeEarned'), [showGuide]);
  const showHelp = useCallback(() => showGuide('help'), [showGuide]);
  const showError = useCallback((customMessage?: string) => {
    if (customMessage) {
      showGuide({
        ...DEFAULT_CONTEXTS.error,
        message: customMessage,
      });
    } else {
      showGuide('error');
    }
  }, [showGuide]);
  const showLoading = useCallback(() => showGuide('loading'), [showGuide]);

  // Custom guide with dynamic message
  const showCustomGuide = useCallback((
    message: string, 
    options?: Partial<Omit<MascotGuideState, 'message'>>
  ) => {
    showGuide({
      message,
      mascotImage: '/images/mascots/happy_tiger.png',
      position: 'corner',
      autoHideDelay: 3000,
      ...options,
    });
  }, [showGuide]);

  return {
    // State
    currentGuide,
    isVisible,
    
    // Actions
    showGuide,
    hideGuide,
    
    // Convenience methods for common contexts
    showWelcome,
    showVideoHover,
    showVideoStart,
    showHomeworkStart,
    showQuizCorrect,
    showQuizIncorrect,
    showCompletion,
    showBadgeEarned,
    showHelp,
    showError,
    showLoading,
    showCustomGuide,
    
    // Available contexts
    contexts: DEFAULT_CONTEXTS,
  };
};