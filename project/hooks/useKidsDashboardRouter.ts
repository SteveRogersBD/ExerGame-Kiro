'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Video, HomeworkItem } from '@/types/dashboard';

export type DashboardRoute = 
  | 'dashboard'
  | 'video-transition'
  | 'video-player'
  | 'mission-intro'
  | 'completion'
  | 'badges'
  | 'help';

export interface DashboardRouterState {
  currentRoute: DashboardRoute;
  previousRoute: DashboardRoute | null;
  selectedVideo: Video | null;
  selectedHomework: HomeworkItem | null;
  completionScore: number;
  routeHistory: DashboardRoute[];
}

export interface UseKidsDashboardRouterOptions {
  onRouteChange?: (route: DashboardRoute, previousRoute: DashboardRoute | null) => void;
  onVideoStart?: (video: Video) => void;
  onVideoComplete?: (score: number) => void;
  onHomeworkStart?: (homework: HomeworkItem) => void;
}

const INITIAL_ROUTER_STATE: DashboardRouterState = {
  currentRoute: 'dashboard',
  previousRoute: null,
  selectedVideo: null,
  selectedHomework: null,
  completionScore: 0,
  routeHistory: ['dashboard'],
};

export function useKidsDashboardRouter(options: UseKidsDashboardRouterOptions = {}) {
  const [routerState, setRouterState] = useState<DashboardRouterState>(INITIAL_ROUTER_STATE);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Navigate to a specific route
  const navigateTo = useCallback((route: DashboardRoute, data?: Partial<DashboardRouterState>) => {
    setRouterState(prev => {
      const newState = {
        ...prev,
        previousRoute: prev.currentRoute,
        currentRoute: route,
        routeHistory: [...prev.routeHistory, route],
        ...data,
      };

      // Call route change callback
      options.onRouteChange?.(route, prev.currentRoute);

      return newState;
    });
  }, [options]);

  // Go back to previous route
  const goBack = useCallback(() => {
    if (routerState.previousRoute) {
      navigateTo(routerState.previousRoute);
    } else {
      navigateTo('dashboard');
    }
  }, [routerState.previousRoute, navigateTo]);

  // Navigate to dashboard home
  const goHome = useCallback(() => {
    // Clean up any active video players
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    navigateTo('dashboard', {
      selectedVideo: null,
      selectedHomework: null,
      completionScore: 0,
    });
  }, [navigateTo]);

  // Start a preset video
  const startVideo = useCallback((video: Video) => {
    options.onVideoStart?.(video);
    
    navigateTo('video-transition', {
      selectedVideo: video,
      selectedHomework: null,
    });
  }, [navigateTo, options]);

  // Start homework (mission)
  const startHomework = useCallback((homework: HomeworkItem) => {
    options.onHomeworkStart?.(homework);
    
    navigateTo('mission-intro', {
      selectedVideo: homework.video,
      selectedHomework: homework,
    });
  }, [navigateTo, options]);

  // Complete video transition and start video player
  const completeTransition = useCallback(() => {
    navigateTo('video-player');
  }, [navigateTo]);

  // Complete mission intro and start video transition
  const completeMissionIntro = useCallback(() => {
    navigateTo('video-transition');
  }, [navigateTo]);

  // Complete video and show completion screen
  const completeVideo = useCallback((score: number) => {
    options.onVideoComplete?.(score);
    
    navigateTo('completion', {
      completionScore: score,
    });
  }, [navigateTo, options]);

  // Quit video and return to dashboard
  const quitVideo = useCallback(() => {
    // Clean up video player
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    goHome();
  }, [goHome]);

  // Navigate to badges page
  const showBadges = useCallback(() => {
    navigateTo('badges');
  }, [navigateTo]);

  // Navigate to help page
  const showHelp = useCallback(() => {
    navigateTo('help');
  }, [navigateTo]);

  // Register cleanup function for video players
  const registerCleanup = useCallback((cleanup: () => void) => {
    cleanupRef.current = cleanup;
  }, []);

  // Clear cleanup function
  const clearCleanup = useCallback(() => {
    cleanupRef.current = null;
  }, []);

  // Check if currently in a specific route
  const isCurrentRoute = useCallback((route: DashboardRoute) => {
    return routerState.currentRoute === route;
  }, [routerState.currentRoute]);

  // Check if can go back
  const canGoBack = useCallback(() => {
    return routerState.previousRoute !== null && routerState.routeHistory.length > 1;
  }, [routerState.previousRoute, routerState.routeHistory.length]);

  // Get route history
  const getRouteHistory = useCallback(() => {
    return [...routerState.routeHistory];
  }, [routerState.routeHistory]);

  // Clear route history (useful for testing or reset)
  const clearHistory = useCallback(() => {
    setRouterState(prev => ({
      ...prev,
      routeHistory: [prev.currentRoute],
      previousRoute: null,
    }));
  }, []);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  return {
    // State
    currentRoute: routerState.currentRoute,
    previousRoute: routerState.previousRoute,
    selectedVideo: routerState.selectedVideo,
    selectedHomework: routerState.selectedHomework,
    completionScore: routerState.completionScore,
    routeHistory: routerState.routeHistory,

    // Navigation actions
    navigateTo,
    goBack,
    goHome,
    
    // Content actions
    startVideo,
    startHomework,
    completeTransition,
    completeMissionIntro,
    completeVideo,
    quitVideo,
    
    // Section navigation
    showBadges,
    showHelp,
    
    // Cleanup management
    registerCleanup,
    clearCleanup,
    
    // Utilities
    isCurrentRoute,
    canGoBack,
    getRouteHistory,
    clearHistory,
  };
}