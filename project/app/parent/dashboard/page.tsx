'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import ActiveSessionCard from '@/components/dashboard/ActiveSessionCard';
import EmptySessionState from '@/components/dashboard/EmptySessionState';
import ChildrenGrid from '@/components/dashboard/ChildrenGrid';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { EmptyChildrenState, EmptyActivityState } from '@/components/dashboard/EmptyStates';
import { Session, ChildCardData } from '@/types/dashboard';

// Mock data - in a real app, this would come from an API
const mockChildren: ChildCardData[] = [
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
  {
    id: '3',
    name: 'Sophia',
    age: 8,
    avatar: '/images/avatars/child3.png',
    createdAt: new Date(),
    isArchived: false,
    todayPlayTime: 60,
    status: 'paused' as const,
  },
];

const mockActiveSessions: Session[] = [
  {
    id: 'session-1',
    childId: '1',
    contentTitle: 'Balance Adventure',
    contentThumbnail: '/images/content/balance-adventure.png',
    startTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    status: 'active',
    moves: [
      { type: 'balance', count: 12, accuracy: 85 },
      { type: 'jump', count: 8, accuracy: 92 },
    ],
  },
];

const mockRecentActivities = [
  {
    session: {
      id: 'session-2',
      childId: '2',
      contentTitle: 'Yoga Flow for Kids',
      contentThumbnail: '/images/content/yoga-flow.png',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      endTime: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
      status: 'completed' as const,
      moves: [
        { type: 'stretch', count: 15, accuracy: 88 },
        { type: 'balance', count: 10, accuracy: 95 },
      ],
      quizScore: 85,
    },
    child: mockChildren[1],
  },
  {
    session: {
      id: 'session-3',
      childId: '3',
      contentTitle: 'Dance Party',
      contentThumbnail: '/images/content/dance-party.png',
      startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      endTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000), // 3.5 hours ago
      status: 'completed' as const,
      moves: [
        { type: 'dance', count: 25, accuracy: 78 },
        { type: 'jump', count: 12, accuracy: 82 },
      ],
    },
    child: mockChildren[2],
  },
];

export default function DashboardOverviewPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Use mock data directly for now to avoid data fetching issues
  const children = mockChildren;
  const sessions = mockActiveSessions;
  const activities = mockRecentActivities;
  
  const childrenLoading = false;
  const sessionsLoading = false;
  const activitiesLoading = false;
  const childrenError = null;
  const sessionsError = null;
  const activitiesError = null;
  
  const retryChildren = () => {};
  const retrySessions = () => {};
  const retryActivities = () => {};

  const handlePauseSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would update the session via API
      const session = sessions?.find(s => s.id === sessionId);
      // For demo purposes, we'll toggle between active and paused
      const action = session?.status === 'active' ? 'paused' : 'resumed';
      
      toast({
        title: `Session ${action}`,
        description: `The session has been ${action} successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update session. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Session ended',
        description: 'The session has been ended successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to end session. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLockApp = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'App locked',
        description: 'The app has been locked for this session.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to lock app. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChild = () => {
    // TODO: Implement add child functionality
    console.log('Add child clicked');
  };

  const activeSession = sessions?.[0]; // For now, show only the first active session
  const activeChild = activeSession && children ? children.find(child => child.id === activeSession.childId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Overview</h1>
        <div className="text-xs sm:text-sm text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Active Session Section */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Active Sessions</h2>
        {activeSession && activeChild ? (
          <ActiveSessionCard
            session={activeSession}
            child={activeChild}
            onPause={handlePauseSession}
            onEnd={handleEndSession}
            onLock={handleLockApp}
          />
        ) : (
          <EmptySessionState />
        )}
      </div>

      {/* Children Grid Section */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Your Children</h2>
        {children && children.length > 0 ? (
          <ChildrenGrid children={children} />
        ) : (
          <EmptyChildrenState onAddChild={handleAddChild} />
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-3 sm:space-y-4">
        {activities && activities.length > 0 ? (
          <ActivityFeed activities={activities} />
        ) : (
          <EmptyActivityState />
        )}
      </div>
    </div>
  );
}