'use client';

import { useState } from 'react';
import { Clock, Calendar, Moon, Save, AlertTriangle } from 'lucide-react';
import { ChildProfile, ScreenTimeLimit } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from './NotificationService';

interface ScreenTimeLimitsProps {
  children: ChildProfile[];
  screenTimeLimits: ScreenTimeLimit[];
  onUpdateLimits: (limits: ScreenTimeLimit[]) => void;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

export default function ScreenTimeLimits({ 
  children, 
  screenTimeLimits, 
  onUpdateLimits 
}: ScreenTimeLimitsProps) {
  const { toast } = useToast();
  const { triggerScreenTimeWarningNotification } = useNotifications();
  const [editingLimits, setEditingLimits] = useState<ScreenTimeLimit[]>(screenTimeLimits);

  const updateChildLimit = (childId: string, updates: Partial<ScreenTimeLimit>) => {
    setEditingLimits(prev => {
      const existing = prev.find(limit => limit.childId === childId);
      if (existing) {
        return prev.map(limit => 
          limit.childId === childId ? { ...limit, ...updates } : limit
        );
      } else {
        const newLimit: ScreenTimeLimit = {
          childId,
          dailyLimitMinutes: 60,
          weeklyLimitMinutes: 420,
          bedtimeStart: '20:00',
          bedtimeEnd: '07:00',
          allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          isEnabled: false,
          ...updates
        };
        return [...prev, newLimit];
      }
    });
  };

  const toggleDay = (childId: string, day: string) => {
    const currentLimit = editingLimits.find(limit => limit.childId === childId);
    if (!currentLimit) return;

    const allowedDays = currentLimit.allowedDays.includes(day)
      ? currentLimit.allowedDays.filter(d => d !== day)
      : [...currentLimit.allowedDays, day];

    updateChildLimit(childId, { allowedDays });
  };

  const handleSave = () => {
    onUpdateLimits(editingLimits);
    toast({
      title: "Screen time limits updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const testScreenTimeWarning = (childName: string) => {
    triggerScreenTimeWarningNotification(childName, 15);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="text-purple-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Screen Time Limits</h2>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="space-y-6">
        {children.map(child => {
          const limit = editingLimits.find(l => l.childId === child.id) || {
            childId: child.id,
            dailyLimitMinutes: 60,
            weeklyLimitMinutes: 420,
            bedtimeStart: '20:00',
            bedtimeEnd: '07:00',
            allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            isEnabled: false
          };

          return (
            <div key={child.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={child.avatar}
                    alt={child.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{child.name}</h3>
                    <p className="text-sm text-gray-600">Age {child.age}</p>
                  </div>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={limit.isEnabled}
                    onChange={(e) => updateChildLimit(child.id, { isEnabled: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Enable limits</span>
                </label>
              </div>

              {limit.isEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Time Limits */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 flex items-center space-x-2">
                      <Clock size={16} />
                      <span>Time Limits</span>
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Daily Limit
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="15"
                          max="480"
                          step="15"
                          value={limit.dailyLimitMinutes}
                          onChange={(e) => updateChildLimit(child.id, { 
                            dailyLimitMinutes: parseInt(e.target.value) 
                          })}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium text-gray-700 min-w-[60px]">
                          {formatTime(limit.dailyLimitMinutes)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Weekly Limit
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="60"
                          max="2520"
                          step="30"
                          value={limit.weeklyLimitMinutes}
                          onChange={(e) => updateChildLimit(child.id, { 
                            weeklyLimitMinutes: parseInt(e.target.value) 
                          })}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium text-gray-700 min-w-[60px]">
                          {formatTime(limit.weeklyLimitMinutes)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bedtime & Schedule */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 flex items-center space-x-2">
                      <Moon size={16} />
                      <span>Bedtime & Schedule</span>
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Bedtime Start
                        </label>
                        <input
                          type="time"
                          value={limit.bedtimeStart}
                          onChange={(e) => updateChildLimit(child.id, { bedtimeStart: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Bedtime End
                        </label>
                        <input
                          type="time"
                          value={limit.bedtimeEnd}
                          onChange={(e) => updateChildLimit(child.id, { bedtimeEnd: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Allowed Days
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {DAYS_OF_WEEK.map(day => (
                          <button
                            key={day.key}
                            onClick={() => toggleDay(child.id, day.key)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                              limit.allowedDays.includes(day.key)
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {children.length === 0 && (
        <div className="text-center py-8">
          <AlertTriangle className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600">No children profiles found. Add children to set up screen time limits.</p>
        </div>
      )}
    </div>
  );
}