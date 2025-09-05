'use client';

import { useState, useEffect, useCallback } from 'react';

export interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseDashboardDataOptions {
  retryAttempts?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
}

export function useDashboardData<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options: UseDashboardDataOptions = {}
) {
  const { retryAttempts = 3, retryDelay = 1000, onError } = options;
  
  const [state, setState] = useState<DataState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fetchFn();
      setState({ data, loading: false, error: null });
      setRetryCount(0);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      if (retryCount < retryAttempts) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, retryDelay);
      } else {
        setState({ data: null, loading: false, error: errorMessage });
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    }
  }, [fetchFn, retryCount, retryAttempts, retryDelay, onError]);

  const retry = useCallback(() => {
    setRetryCount(0);
  }, []);

  // Separate effect for retry logic
  useEffect(() => {
    if (retryCount > 0) {
      fetchData();
    }
  }, [retryCount, fetchData]);

  // Initial fetch effect
  useEffect(() => {
    fetchData();
  }, [...dependencies]);

  return {
    ...state,
    retry,
    isRetrying: retryCount > 0,
  };
}

// Specific hooks for dashboard data
export function useChildrenData() {
  return useDashboardData(
    async () => {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      return [
        {
          id: '1',
          name: 'Emma',
          age: 7,
          avatar: '/images/avatars/child1.png',
          createdAt: new Date(),
          isArchived: false,
          todayPlayTime: 45,
          status: 'active' as const,
        },
        {
          id: '2',
          name: 'Liam',
          age: 5,
          avatar: '/images/avatars/child2.png',
          createdAt: new Date(),
          isArchived: false,
          todayPlayTime: 30,
          status: 'offline' as const,
        },
      ];
    },
    [],
    {
      onError: (error) => console.error('Failed to fetch children data:', error),
    }
  );
}

export function useSessionData() {
  return useDashboardData(
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      return [
        {
          id: 'session-1',
          childId: '1',
          contentTitle: 'Balance Adventure',
          contentThumbnail: '/images/content/balance-adventure.png',
          startTime: new Date(Date.now() - 15 * 60 * 1000),
          status: 'active' as const,
          moves: [
            { type: 'balance', count: 12, accuracy: 85 },
            { type: 'jump', count: 8, accuracy: 92 },
          ],
        },
      ];
    },
    [],
    {
      onError: (error) => console.error('Failed to fetch session data:', error),
    }
  );
}

export function useActivityData() {
  return useDashboardData(
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock data
      return [
        {
          session: {
            id: 'session-2',
            childId: '2',
            contentTitle: 'Yoga Flow for Kids',
            contentThumbnail: '/images/content/yoga-flow.png',
            startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
            endTime: new Date(Date.now() - 90 * 60 * 1000),
            status: 'completed' as const,
            moves: [
              { type: 'stretch', count: 15, accuracy: 88 },
              { type: 'balance', count: 10, accuracy: 95 },
            ],
            quizScore: 85,
          },
          child: {
            id: '2',
            name: 'Liam',
            age: 5,
            avatar: '/images/avatars/child2.png',
            createdAt: new Date(),
            isArchived: false,
          },
        },
      ];
    },
    [],
    {
      onError: (error) => console.error('Failed to fetch activity data:', error),
    }
  );
}