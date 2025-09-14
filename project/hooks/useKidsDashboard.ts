'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { KidsDashboardState, INITIAL_KIDS_DASHBOARD_STATE, Badge } from '@/types/dashboard';

export interface UseKidsDashboardOptions {
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

export function useKidsDashboard(options: UseKidsDashboardOptions = {}) {
  const [state, setState] = useState<KidsDashboardState>(INITIAL_KIDS_DASHBOARD_STATE);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Refs to stabilize callback props
  const onErrorRef = useRef(options.onError);
  const onSuccessRef = useRef(options.onSuccess);
  
  // Ref to track initialization and prevent multiple initializations
  const didInitRef = useRef(false);
  
  // Ref to track previous state JSON for localStorage comparison
  const prevStateJsonRef = useRef<string>('');

  // Update callback refs when options change
  useEffect(() => {
    onErrorRef.current = options.onError;
    onSuccessRef.current = options.onSuccess;
  }, [options.onError, options.onSuccess]);

  // Initialize dashboard data
  const initializeDashboard = useCallback(async () => {
    try {
      // Simulate loading user data from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would fetch from an API
      const userData = {
        name: sessionStorage.getItem('childName') || 'Alex',
        avatar: sessionStorage.getItem('childAvatar') || '/images/avatars/child-avatar-1.png',
      };

      setState(prev => ({
        ...prev,
        user: {
          ...prev.user,
          name: userData.name,
          avatar: userData.avatar,
        },
        ui: {
          ...prev.ui,
          isLoading: false,
        }
      }));

      setIsInitialized(true);
      onSuccessRef.current?.('Dashboard loaded successfully!');
      
    } catch (error) {
      onErrorRef.current?.('Failed to load dashboard data');
    }
  }, []); // Empty dependency array since we use refs for callbacks

  // Navigate between dashboard sections
  const navigateToSection = useCallback((view: 'dashboard' | 'badges' | 'help') => {
    setState(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        currentView: view,
      }
    }));
  }, []);

  // Add a new badge to the user
  const addBadge = useCallback((badge: Badge) => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        badges: [...prev.user.badges, badge],
      }
    }));
  }, []);

  // Update homework status
  const updateHomeworkStatus = useCallback((homeworkId: string, status: 'not_started' | 'in_progress' | 'completed') => {
    setState(prev => ({
      ...prev,
      content: {
        ...prev.content,
        homework: prev.content.homework.map(hw =>
          hw.id === homeworkId ? { ...hw, status } : hw
        )
      }
    }));
  }, []);

  // Increment user streak
  const incrementStreak = useCallback(() => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        streak: prev.user.streak + 1,
      }
    }));
  }, []);

  // Update mascot message
  const updateMascotMessage = useCallback((message: string) => {
    setState(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        mascotMessage: message,
      }
    }));
  }, []);

  // Change background theme
  const changeBackgroundTheme = useCallback((theme: 'sky' | 'forest' | 'space') => {
    setState(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        backgroundTheme: theme,
      }
    }));
  }, []);

  // Set loading state
  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        isLoading,
      }
    }));
  }, []);

  // Get homework by status
  const getHomeworkByStatus = useCallback((status: 'not_started' | 'in_progress' | 'completed') => {
    return state.content.homework.filter(hw => hw.status === status);
  }, [state.content.homework]);

  // Get recently earned badges (within last 24 hours)
  const getRecentBadges = useCallback(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return state.user.badges.filter(badge => 
      badge.earnedAt && badge.earnedAt > oneDayAgo
    );
  }, [state.user.badges]);

  // Save state to localStorage for persistence (only when JSON actually changes)
  const saveState = useCallback((currentState: KidsDashboardState) => {
    try {
      const currentStateJson = JSON.stringify(currentState);
      if (currentStateJson !== prevStateJsonRef.current) {
        localStorage.setItem('kidsDashboardState', currentStateJson);
        prevStateJsonRef.current = currentStateJson;
      }
    } catch (error) {
      console.warn('Failed to save dashboard state:', error);
    }
  }, []);

  // Load state from localStorage
  const loadState = useCallback(() => {
    try {
      const savedState = localStorage.getItem('kidsDashboardState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setState(parsedState);
        prevStateJsonRef.current = savedState; // Store the loaded JSON
        return true;
      }
    } catch (error) {
      console.warn('Failed to load dashboard state:', error);
    }
    return false;
  }, []);

  // Auto-save state changes (only when initialized and state actually changes)
  useEffect(() => {
    if (isInitialized) {
      saveState(state);
    }
  }, [state, isInitialized, saveState]);

  // Initialize on mount (runs only once)
  useEffect(() => {
    if (didInitRef.current) return; // Prevent multiple initializations
    
    const initialize = async () => {
      didInitRef.current = true;
      const hasLoadedState = loadState();
      if (!hasLoadedState) {
        await initializeDashboard();
      } else {
        setIsInitialized(true);
      }
    };
    
    initialize();
  }, []); // Empty dependency array - runs only once

  return {
    // State
    state,
    isInitialized,
    
    // Actions
    initializeDashboard,
    navigateToSection,
    addBadge,
    updateHomeworkStatus,
    incrementStreak,
    updateMascotMessage,
    changeBackgroundTheme,
    setLoading,
    
    // Computed values
    getHomeworkByStatus,
    getRecentBadges,
    
    // Persistence (expose stable versions)
    saveState: useCallback(() => saveState(state), [saveState, state]),
    loadState,
  };
}