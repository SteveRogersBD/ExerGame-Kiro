'use client';

import { useState, useEffect, useCallback } from 'react';

interface OfflineDetectionState {
  isOnline: boolean;
  isOffline: boolean;
  wasOffline: boolean;
  connectionType: string | null;
  lastOnlineTime: Date | null;
  lastOfflineTime: Date | null;
}

interface UseOfflineDetectionOptions {
  onOnline?: () => void;
  onOffline?: () => void;
  pingUrl?: string;
  pingInterval?: number;
  enablePing?: boolean;
}

export function useOfflineDetection(options: UseOfflineDetectionOptions = {}) {
  const {
    onOnline,
    onOffline,
    pingUrl = '/api/ping',
    pingInterval = 30000, // 30 seconds
    enablePing = false
  } = options;

  const [state, setState] = useState<OfflineDetectionState>(() => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    wasOffline: false,
    connectionType: null,
    lastOnlineTime: null,
    lastOfflineTime: null
  }));

  // Get connection type if available
  const getConnectionType = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.effectiveType || connection?.type || null;
    }
    return null;
  }, []);

  // Handle online event
  const handleOnline = useCallback(() => {
    const now = new Date();
    setState(prev => ({
      ...prev,
      isOnline: true,
      isOffline: false,
      wasOffline: prev.isOffline,
      connectionType: getConnectionType(),
      lastOnlineTime: now
    }));
    
    console.log('🌐 Connection restored at', now.toLocaleTimeString());
    onOnline?.();
  }, [onOnline, getConnectionType]);

  // Handle offline event
  const handleOffline = useCallback(() => {
    const now = new Date();
    setState(prev => ({
      ...prev,
      isOnline: false,
      isOffline: true,
      wasOffline: false,
      connectionType: null,
      lastOfflineTime: now
    }));
    
    console.log('📡 Connection lost at', now.toLocaleTimeString());
    onOffline?.();
  }, [onOffline]);

  // Ping server to verify actual connectivity
  const pingServer = useCallback(async (): Promise<boolean> => {
    if (!enablePing) return state.isOnline;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(pingUrl, {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn('Ping failed:', error);
      return false;
    }
  }, [enablePing, pingUrl, state.isOnline]);

  // Check actual connectivity with server ping
  const checkConnectivity = useCallback(async () => {
    if (!enablePing) return;
    
    const isActuallyOnline = await pingServer();
    const navigatorOnline = navigator.onLine;
    
    // If navigator says online but ping fails, we're actually offline
    if (navigatorOnline && !isActuallyOnline && state.isOnline) {
      handleOffline();
    }
    // If navigator says offline but we were pinging successfully, trust navigator
    else if (!navigatorOnline && state.isOnline) {
      handleOffline();
    }
    // If navigator says online and ping succeeds, we're online
    else if (navigatorOnline && isActuallyOnline && !state.isOnline) {
      handleOnline();
    }
  }, [enablePing, pingServer, state.isOnline, handleOnline, handleOffline]);

  // Set up event listeners and ping interval
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set up periodic connectivity check
    let pingIntervalId: NodeJS.Timeout | null = null;
    if (enablePing) {
      pingIntervalId = setInterval(checkConnectivity, pingInterval);
    }

    // Initial connection type check
    setState(prev => ({
      ...prev,
      connectionType: getConnectionType()
    }));

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (pingIntervalId) {
        clearInterval(pingIntervalId);
      }
    };
  }, [handleOnline, handleOffline, enablePing, checkConnectivity, pingInterval, getConnectionType]);

  // Manual connectivity check
  const checkConnection = useCallback(async () => {
    await checkConnectivity();
  }, [checkConnectivity]);

  // Get offline duration
  const getOfflineDuration = useCallback(() => {
    if (!state.lastOfflineTime || state.isOnline) return 0;
    return Date.now() - state.lastOfflineTime.getTime();
  }, [state.lastOfflineTime, state.isOnline]);

  // Get friendly offline duration message
  const getOfflineDurationMessage = useCallback(() => {
    const duration = getOfflineDuration();
    if (duration === 0) return null;
    
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `Offline for ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `Offline for ${seconds} second${seconds > 1 ? 's' : ''}`;
    }
  }, [getOfflineDuration]);

  return {
    ...state,
    checkConnection,
    getOfflineDuration,
    getOfflineDurationMessage,
    // Utility methods
    hasBeenOffline: state.wasOffline || state.isOffline,
    isReconnecting: state.wasOffline && state.isOnline,
  };
}

// Hook specifically for kids dashboard with child-friendly messaging
export function useKidsOfflineDetection() {
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [offlineMessageType, setOfflineMessageType] = useState<'initial' | 'extended'>('initial');

  const offlineDetection = useOfflineDetection({
    onOffline: () => {
      setShowOfflineMessage(true);
      setOfflineMessageType('initial');
      
      // Show extended message after 30 seconds offline
      setTimeout(() => {
        setOfflineMessageType('extended');
      }, 30000);
    },
    onOnline: () => {
      // Hide offline message after a brief delay to show "back online" message
      setTimeout(() => {
        setShowOfflineMessage(false);
      }, 2000);
    },
    enablePing: true,
    pingInterval: 15000 // Check every 15 seconds for kids app
  });

  const getKidsOfflineMessage = useCallback(() => {
    if (!offlineDetection.isOffline) return null;
    
    if (offlineMessageType === 'initial') {
      return "Oops! The internet is taking a little break! 📡";
    } else {
      return "The internet is still sleeping! Let's play some offline games while we wait! 🎮";
    }
  }, [offlineDetection.isOffline, offlineMessageType]);

  const getKidsOnlineMessage = useCallback(() => {
    if (!offlineDetection.isReconnecting) return null;
    return "Yay! The internet is back! We can play online games again! 🌐✨";
  }, [offlineDetection.isReconnecting]);

  return {
    ...offlineDetection,
    showOfflineMessage,
    offlineMessageType,
    getKidsOfflineMessage,
    getKidsOnlineMessage,
    // Child-friendly status messages
    statusMessage: offlineDetection.isOffline 
      ? getKidsOfflineMessage()
      : offlineDetection.isReconnecting 
        ? getKidsOnlineMessage()
        : null
  };
}