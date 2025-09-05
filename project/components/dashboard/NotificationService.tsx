'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  triggerSessionStartNotification: (childName: string, contentTitle: string) => void;
  triggerSessionMilestoneNotification: (childName: string, milestone: string) => void;
  triggerScreenTimeWarningNotification: (childName: string, remainingMinutes: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Initialize with mock notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'session_start',
        title: 'Emma started a new session',
        message: 'Emma is now playing "Balance Adventure" - started 5 minutes ago',
        childId: 'child1',
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false
      },
      {
        id: '2',
        type: 'session_milestone',
        title: 'Great progress!',
        message: 'Alex completed 10 balance moves with 95% accuracy',
        childId: 'child2',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false
      },
      {
        id: '3',
        type: 'screen_time_warning',
        title: 'Screen time limit approaching',
        message: 'Emma has 15 minutes left for today',
        childId: 'child1',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      createdAt: new Date(),
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification if in-app notifications are enabled
    toast({
      title: newNotification.title,
      description: newNotification.message,
    });
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Specific notification triggers
  const triggerSessionStartNotification = (childName: string, contentTitle: string) => {
    addNotification({
      type: 'session_start',
      title: `${childName} started a new session`,
      message: `${childName} is now playing "${contentTitle}"`,
      childId: 'mock-child-id',
      isRead: false
    });
  };

  const triggerSessionMilestoneNotification = (childName: string, milestone: string) => {
    addNotification({
      type: 'session_milestone',
      title: 'Great progress!',
      message: `${childName} ${milestone}`,
      childId: 'mock-child-id',
      isRead: false
    });
  };

  const triggerScreenTimeWarningNotification = (childName: string, remainingMinutes: number) => {
    addNotification({
      type: 'screen_time_warning',
      title: 'Screen time limit approaching',
      message: `${childName} has ${remainingMinutes} minutes left for today`,
      childId: 'mock-child-id',
      isRead: false
    });
  };

  const value: NotificationContextType = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    triggerSessionStartNotification,
    triggerSessionMilestoneNotification,
    triggerScreenTimeWarningNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}