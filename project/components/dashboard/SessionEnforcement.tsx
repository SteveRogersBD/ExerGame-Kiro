'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Pause, Square, Lock, Bell } from 'lucide-react';
import { Session, ChildProfile, ScreenTimeLimit, ScreenTimeUsage } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';

interface SessionEnforcementProps {
  activeSessions: Session[];
  children: ChildProfile[];
  screenTimeLimits: ScreenTimeLimit[];
  screenTimeUsage: ScreenTimeUsage[];
  onSessionAction: (sessionId: string, action: 'pause' | 'end' | 'lock') => void;
  onSendNotification: (childId: string, type: 'warning' | 'limit_reached') => void;
}

export default function SessionEnforcement({
  activeSessions,
  children,
  screenTimeLimits,
  screenTimeUsage,
  onSessionAction,
  onSendNotification
}: SessionEnforcementProps) {
  const { toast } = useToast();
  const [sessionTimers, setSessionTimers] = useState<Record<string, number>>({});

  // Update session timers every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers: Record<string, number> = {};
      activeSessions.forEach(session => {
        if (session.status === 'active') {
          const elapsed = Math.floor((Date.now() - session.startTime.getTime()) / (1000 * 60));
          newTimers[session.id] = elapsed;
        }
      });
      setSessionTimers(newTimers);
    }, 60000); // Update every minute

    // Initial calculation
    const initialTimers: Record<string, number> = {};
    activeSessions.forEach(session => {
      if (session.status === 'active') {
        const elapsed = Math.floor((Date.now() - session.startTime.getTime()) / (1000 * 60));
        initialTimers[session.id] = elapsed;
      }
    });
    setSessionTimers(initialTimers);

    return () => clearInterval(interval);
  }, [activeSessions]);

  const getChildLimit = (childId: string) => {
    return screenTimeLimits.find(limit => limit.childId === childId && limit.isEnabled);
  };

  const getChildUsage = (childId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return screenTimeUsage.find(usage => usage.childId === childId && usage.date === today);
  };

  const isInBedtime = (childId: string) => {
    const limit = getChildLimit(childId);
    if (!limit) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const bedtimeStart = parseInt(limit.bedtimeStart.split(':')[0]) * 60 + parseInt(limit.bedtimeStart.split(':')[1]);
    const bedtimeEnd = parseInt(limit.bedtimeEnd.split(':')[0]) * 60 + parseInt(limit.bedtimeEnd.split(':')[1]);

    if (bedtimeStart > bedtimeEnd) {
      // Bedtime spans midnight
      return currentTime >= bedtimeStart || currentTime <= bedtimeEnd;
    } else {
      return currentTime >= bedtimeStart && currentTime <= bedtimeEnd;
    }
  };

  const getTimeRemaining = (childId: string) => {
    const limit = getChildLimit(childId);
    const usage = getChildUsage(childId);
    if (!limit || !usage) return null;

    const remainingDaily = limit.dailyLimitMinutes - usage.totalMinutes;
    return Math.max(0, remainingDaily);
  };

  const getSessionWarningLevel = (session: Session) => {
    const child = children.find(c => c.id === session.childId);
    if (!child) return 'none';

    const limit = getChildLimit(session.childId);
    const usage = getChildUsage(session.childId);
    const sessionTime = sessionTimers[session.id] || 0;

    if (isInBedtime(session.childId)) {
      return 'critical'; // During bedtime
    }

    if (limit && usage) {
      const totalToday = usage.totalMinutes + sessionTime;
      const remaining = limit.dailyLimitMinutes - totalToday;

      if (remaining <= 0) {
        return 'critical'; // Limit exceeded
      } else if (remaining <= 15) {
        return 'warning'; // 15 minutes or less remaining
      } else if (remaining <= 30) {
        return 'caution'; // 30 minutes or less remaining
      }
    }

    return 'none';
  };

  const handleSessionAction = (sessionId: string, action: 'pause' | 'end' | 'lock') => {
    onSessionAction(sessionId, action);
    
    const session = activeSessions.find(s => s.id === sessionId);
    const child = children.find(c => c.id === session?.childId);
    
    if (child) {
      toast({
        title: `Session ${action}${action === 'end' ? 'ed' : 'd'}`,
        description: `${child.name}'s session has been ${action}${action === 'end' ? 'ed' : 'd'}.`,
      });
    }
  };

  const sendLimitNotification = (childId: string, type: 'warning' | 'limit_reached') => {
    onSendNotification(childId, type);
    
    const child = children.find(c => c.id === childId);
    if (child) {
      toast({
        title: type === 'warning' ? 'Screen time warning sent' : 'Limit notification sent',
        description: `${child.name} has been notified about their screen time.`,
      });
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (activeSessions.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="text-purple-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Active Session Monitoring</h2>
        </div>
        <div className="text-center py-8">
          <Clock className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600">No active sessions to monitor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="text-purple-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Active Session Monitoring</h2>
      </div>

      <div className="space-y-4">
        {activeSessions.map(session => {
          const child = children.find(c => c.id === session.childId);
          if (!child) return null;

          const warningLevel = getSessionWarningLevel(session);
          const sessionTime = sessionTimers[session.id] || 0;
          const timeRemaining = getTimeRemaining(session.childId);
          const inBedtime = isInBedtime(session.childId);

          const warningColors = {
            none: 'border-gray-200 bg-white',
            caution: 'border-yellow-300 bg-yellow-50',
            warning: 'border-orange-300 bg-orange-50',
            critical: 'border-red-300 bg-red-50'
          };

          return (
            <div key={session.id} className={`border rounded-lg p-4 ${warningColors[warningLevel]}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={child.avatar}
                    alt={child.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{child.name}</h3>
                    <p className="text-sm text-gray-600">{session.contentTitle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSessionAction(session.id, 'pause')}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-100 rounded-lg transition-all"
                    title="Pause session"
                  >
                    <Pause size={16} />
                  </button>
                  <button
                    onClick={() => handleSessionAction(session.id, 'end')}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all"
                    title="End session"
                  >
                    <Square size={16} />
                  </button>
                  <button
                    onClick={() => handleSessionAction(session.id, 'lock')}
                    className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-100 rounded-lg transition-all"
                    title="Lock app"
                  >
                    <Lock size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Session Time</p>
                  <p className="font-semibold text-gray-800">{formatTime(sessionTime)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Started</p>
                  <p className="font-semibold text-gray-800">
                    {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {timeRemaining !== null && (
                  <div>
                    <p className="text-xs text-gray-500">Time Remaining</p>
                    <p className={`font-semibold ${timeRemaining <= 15 ? 'text-red-600' : timeRemaining <= 30 ? 'text-orange-600' : 'text-gray-800'}`}>
                      {formatTime(timeRemaining)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className={`font-semibold capitalize ${session.status === 'active' ? 'text-green-600' : 'text-orange-600'}`}>
                    {session.status}
                  </p>
                </div>
              </div>

              {/* Warning messages and actions */}
              {warningLevel !== 'none' && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle 
                      size={16} 
                      className={
                        warningLevel === 'critical' ? 'text-red-500' :
                        warningLevel === 'warning' ? 'text-orange-500' :
                        'text-yellow-500'
                      } 
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {inBedtime ? 'Session during bedtime hours' :
                       warningLevel === 'critical' ? 'Daily screen time limit reached' :
                       warningLevel === 'warning' ? 'Approaching daily limit' :
                       'Screen time caution'}
                    </span>
                  </div>
                  <button
                    onClick={() => sendLimitNotification(session.childId, warningLevel === 'critical' ? 'limit_reached' : 'warning')}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
                  >
                    <Bell size={12} />
                    <span>Notify</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}