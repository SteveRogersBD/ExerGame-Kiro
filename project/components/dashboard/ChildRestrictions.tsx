'use client';

import { useState } from 'react';
import { Shield, Filter, Clock, AlertCircle, Save } from 'lucide-react';
import { ChildProfile, ChildRestriction } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';

interface ChildRestrictionsProps {
  children: ChildProfile[];
  restrictions: ChildRestriction[];
  onUpdateRestrictions: (restrictions: ChildRestriction[]) => void;
}

const CONTENT_CATEGORIES = [
  { id: 'balance', name: 'Balance Games', description: 'Games focusing on balance and coordination' },
  { id: 'strength', name: 'Strength Training', description: 'Activities building muscle strength' },
  { id: 'cardio', name: 'Cardio Workouts', description: 'Heart-pumping aerobic exercises' },
  { id: 'flexibility', name: 'Flexibility', description: 'Stretching and flexibility exercises' },
  { id: 'dance', name: 'Dance & Movement', description: 'Dance routines and creative movement' },
  { id: 'sports', name: 'Sports Skills', description: 'Sport-specific skill development' },
  { id: 'mindfulness', name: 'Mindfulness', description: 'Meditation and breathing exercises' },
];

const DIFFICULTY_LEVELS = [
  { level: 1, name: 'Beginner', description: 'Very easy, suitable for first-time users' },
  { level: 2, name: 'Easy', description: 'Simple movements and instructions' },
  { level: 3, name: 'Moderate', description: 'Standard difficulty level' },
  { level: 4, name: 'Challenging', description: 'More complex movements and coordination' },
  { level: 5, name: 'Advanced', description: 'Difficult, requires experience and skill' },
];

export default function ChildRestrictions({ 
  children, 
  restrictions, 
  onUpdateRestrictions 
}: ChildRestrictionsProps) {
  const { toast } = useToast();
  const [editingRestrictions, setEditingRestrictions] = useState<ChildRestriction[]>(restrictions);

  const updateChildRestriction = (childId: string, updates: Partial<ChildRestriction>) => {
    setEditingRestrictions(prev => {
      const existing = prev.find(restriction => restriction.childId === childId);
      if (existing) {
        return prev.map(restriction => 
          restriction.childId === childId ? { ...restriction, ...updates } : restriction
        );
      } else {
        const newRestriction: ChildRestriction = {
          childId,
          contentFilters: {
            maxDifficulty: 3,
            blockedCategories: [],
            allowedCategories: CONTENT_CATEGORIES.map(cat => cat.id),
          },
          sessionControls: {
            requireParentApproval: false,
            maxSessionDuration: 60,
            breakReminders: true,
            breakInterval: 20,
          },
          isEnabled: false,
          ...updates
        };
        return [...prev, newRestriction];
      }
    });
  };

  const toggleCategory = (childId: string, categoryId: string, isBlocked: boolean) => {
    const currentRestriction = editingRestrictions.find(r => r.childId === childId);
    if (!currentRestriction) return;

    const contentFilters = { ...currentRestriction.contentFilters };
    
    if (isBlocked) {
      contentFilters.blockedCategories = contentFilters.blockedCategories.includes(categoryId)
        ? contentFilters.blockedCategories.filter(id => id !== categoryId)
        : [...contentFilters.blockedCategories, categoryId];
      
      contentFilters.allowedCategories = contentFilters.allowedCategories.filter(id => id !== categoryId);
    } else {
      contentFilters.allowedCategories = contentFilters.allowedCategories.includes(categoryId)
        ? contentFilters.allowedCategories.filter(id => id !== categoryId)
        : [...contentFilters.allowedCategories, categoryId];
      
      contentFilters.blockedCategories = contentFilters.blockedCategories.filter(id => id !== categoryId);
    }

    updateChildRestriction(childId, { contentFilters });
  };

  const handleSave = () => {
    onUpdateRestrictions(editingRestrictions);
    toast({
      title: "Child restrictions updated",
      description: "Your safety settings have been saved successfully.",
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="text-purple-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Child Safety & Restrictions</h2>
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
          const restriction = editingRestrictions.find(r => r.childId === child.id) || {
            childId: child.id,
            contentFilters: {
              maxDifficulty: 3,
              blockedCategories: [],
              allowedCategories: CONTENT_CATEGORIES.map(cat => cat.id),
            },
            sessionControls: {
              requireParentApproval: false,
              maxSessionDuration: 60,
              breakReminders: true,
              breakInterval: 20,
            },
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
                    checked={restriction.isEnabled}
                    onChange={(e) => updateChildRestriction(child.id, { isEnabled: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Enable restrictions</span>
                </label>
              </div>

              {restriction.isEnabled && (
                <div className="space-y-6">
                  {/* Content Filters */}
                  <div>
                    <h4 className="font-medium text-gray-700 flex items-center space-x-2 mb-4">
                      <Filter size={16} />
                      <span>Content Filters</span>
                    </h4>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Maximum Difficulty Level
                      </label>
                      <div className="space-y-2">
                        {DIFFICULTY_LEVELS.map(level => (
                          <label key={level.level} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name={`difficulty-${child.id}`}
                              value={level.level}
                              checked={restriction.contentFilters.maxDifficulty === level.level}
                              onChange={(e) => updateChildRestriction(child.id, {
                                contentFilters: {
                                  ...restriction.contentFilters,
                                  maxDifficulty: parseInt(e.target.value)
                                }
                              })}
                              className="text-purple-600 focus:ring-purple-500"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700">{level.name}</span>
                              <p className="text-xs text-gray-500">{level.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Content Categories
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {CONTENT_CATEGORIES.map(category => {
                          const isAllowed = restriction.contentFilters.allowedCategories.includes(category.id);
                          const isBlocked = restriction.contentFilters.blockedCategories.includes(category.id);
                          
                          return (
                            <div key={category.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <div className="flex-1">
                                <h5 className="text-sm font-medium text-gray-700">{category.name}</h5>
                                <p className="text-xs text-gray-500">{category.description}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => toggleCategory(child.id, category.id, false)}
                                  className={`px-2 py-1 text-xs rounded ${
                                    isAllowed 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                                  }`}
                                >
                                  Allow
                                </button>
                                <button
                                  onClick={() => toggleCategory(child.id, category.id, true)}
                                  className={`px-2 py-1 text-xs rounded ${
                                    isBlocked 
                                      ? 'bg-red-100 text-red-700' 
                                      : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                                  }`}
                                >
                                  Block
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Session Controls */}
                  <div>
                    <h4 className="font-medium text-gray-700 flex items-center space-x-2 mb-4">
                      <Clock size={16} />
                      <span>Session Controls</span>
                    </h4>
                    
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={restriction.sessionControls.requireParentApproval}
                          onChange={(e) => updateChildRestriction(child.id, {
                            sessionControls: {
                              ...restriction.sessionControls,
                              requireParentApproval: e.target.checked
                            }
                          })}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Require parent approval</span>
                          <p className="text-xs text-gray-500">Child must ask permission before starting sessions</p>
                        </div>
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Maximum Session Duration
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="range"
                            min="15"
                            max="120"
                            step="15"
                            value={restriction.sessionControls.maxSessionDuration}
                            onChange={(e) => updateChildRestriction(child.id, {
                              sessionControls: {
                                ...restriction.sessionControls,
                                maxSessionDuration: parseInt(e.target.value)
                              }
                            })}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium text-gray-700 min-w-[60px]">
                            {restriction.sessionControls.maxSessionDuration} min
                          </span>
                        </div>
                      </div>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={restriction.sessionControls.breakReminders}
                          onChange={(e) => updateChildRestriction(child.id, {
                            sessionControls: {
                              ...restriction.sessionControls,
                              breakReminders: e.target.checked
                            }
                          })}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Break reminders</span>
                          <p className="text-xs text-gray-500">Remind child to take breaks during long sessions</p>
                        </div>
                      </label>

                      {restriction.sessionControls.breakReminders && (
                        <div className="ml-6">
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Break reminder interval
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="range"
                              min="10"
                              max="60"
                              step="5"
                              value={restriction.sessionControls.breakInterval}
                              onChange={(e) => updateChildRestriction(child.id, {
                                sessionControls: {
                                  ...restriction.sessionControls,
                                  breakInterval: parseInt(e.target.value)
                                }
                              })}
                              className="flex-1"
                            />
                            <span className="text-sm font-medium text-gray-700 min-w-[60px]">
                              {restriction.sessionControls.breakInterval} min
                            </span>
                          </div>
                        </div>
                      )}
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
          <AlertCircle className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600">No children profiles found. Add children to set up safety restrictions.</p>
        </div>
      )}
    </div>
  );
}