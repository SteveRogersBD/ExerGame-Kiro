'use client';

import { useState, useEffect } from 'react';
import { Shield, Settings } from 'lucide-react';
import ScreenTimeLimits from '@/components/dashboard/ScreenTimeLimits';
import ChildRestrictions from '@/components/dashboard/ChildRestrictions';
import SessionEnforcement from '@/components/dashboard/SessionEnforcement';
import { EmptyControlsState } from '@/components/dashboard/EmptyStates';
import LoadingState from '@/components/dashboard/LoadingState';
import ErrorDisplay from '@/components/dashboard/ErrorDisplay';
import { useChildrenData } from '@/hooks/useDashboardData';
import { 
  ChildProfile, 
  ScreenTimeLimit, 
  ChildRestriction, 
  Session, 
  ScreenTimeUsage 
} from '@/types/dashboard';

// Mock data - in a real app, this would come from an API
const mockChildren: ChildProfile[] = [
  {
    id: '1',
    name: 'Emma',
    age: 8,
    avatar: '/public/images/child-avatar-1.png',
    healthNotes: 'No restrictions',
    createdAt: new Date('2024-01-15'),
    isArchived: false,
  },
  {
    id: '2',
    name: 'Liam',
    age: 6,
    avatar: '/public/images/child-avatar-2.png',
    healthNotes: 'Mild asthma - avoid intense cardio',
    createdAt: new Date('2024-02-20'),
    isArchived: false,
  },
];

const mockActiveSessions: Session[] = [
  {
    id: 'session-1',
    childId: '1',
    contentTitle: 'Balance Adventure',
    contentThumbnail: '/public/images/balance-game.png',
    startTime: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    moves: [],
    status: 'active',
  },
];

const mockScreenTimeUsage: ScreenTimeUsage[] = [
  {
    childId: '1',
    date: new Date().toISOString().split('T')[0],
    totalMinutes: 45,
    sessionCount: 2,
    lastSessionEnd: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isLimitReached: false,
    warningsSent: 1,
  },
  {
    childId: '2',
    date: new Date().toISOString().split('T')[0],
    totalMinutes: 20,
    sessionCount: 1,
    isLimitReached: false,
    warningsSent: 0,
  },
];

export default function ControlsPage() {
  const { data: children, loading, error, retry } = useChildrenData();
  const [activeSessions] = useState<Session[]>(mockActiveSessions);
  const [screenTimeUsage] = useState<ScreenTimeUsage[]>(mockScreenTimeUsage);
  const [screenTimeLimits, setScreenTimeLimits] = useState<ScreenTimeLimit[]>([
    {
      childId: '1',
      dailyLimitMinutes: 60,
      weeklyLimitMinutes: 420,
      bedtimeStart: '20:00',
      bedtimeEnd: '07:00',
      allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      isEnabled: true,
    },
  ]);
  const [childRestrictions, setChildRestrictions] = useState<ChildRestriction[]>([
    {
      childId: '2',
      contentFilters: {
        maxDifficulty: 2,
        blockedCategories: ['cardio'],
        allowedCategories: ['balance', 'flexibility', 'mindfulness'],
      },
      sessionControls: {
        requireParentApproval: true,
        maxSessionDuration: 30,
        breakReminders: true,
        breakInterval: 15,
      },
      isEnabled: true,
    },
  ]);

  const handleUpdateScreenTimeLimits = (limits: ScreenTimeLimit[]) => {
    setScreenTimeLimits(limits);
    // In a real app, this would save to an API
    console.log('Updated screen time limits:', limits);
  };

  const handleUpdateChildRestrictions = (restrictions: ChildRestriction[]) => {
    setChildRestrictions(restrictions);
    // In a real app, this would save to an API
    console.log('Updated child restrictions:', restrictions);
  };

  const handleSessionAction = (sessionId: string, action: 'pause' | 'end' | 'lock') => {
    // In a real app, this would call an API to control the session
    console.log(`Session ${sessionId} action: ${action}`);
  };

  const handleSendNotification = (childId: string, type: 'warning' | 'limit_reached') => {
    // In a real app, this would send a notification to the child's device
    console.log(`Sending ${type} notification to child ${childId}`);
  };

  const handleAddChild = () => {
    // Navigate to profiles page to add a child
    window.location.href = '/parent/dashboard/profiles';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingState message="Loading parental controls..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorDisplay error={error} onRetry={retry} />
      </div>
    );
  }

  if (!children || children.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="text-purple-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Parental Controls</h1>
          </div>
        </div>
        <EmptyControlsState onAddChild={handleAddChild} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="text-purple-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Parental Controls</h1>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Settings size={16} />
          <span>Manage your children's safety and screen time</span>
        </div>
      </div>

      {/* Active Session Monitoring */}
      <SessionEnforcement
        activeSessions={activeSessions}
        children={children}
        screenTimeLimits={screenTimeLimits}
        screenTimeUsage={screenTimeUsage}
        onSessionAction={handleSessionAction}
        onSendNotification={handleSendNotification}
      />

      {/* Screen Time Limits */}
      <ScreenTimeLimits
        children={children}
        screenTimeLimits={screenTimeLimits}
        onUpdateLimits={handleUpdateScreenTimeLimits}
      />

      {/* Child Restrictions */}
      <ChildRestrictions
        children={children}
        restrictions={childRestrictions}
        onUpdateRestrictions={handleUpdateChildRestrictions}
      />
    </div>
  );
}