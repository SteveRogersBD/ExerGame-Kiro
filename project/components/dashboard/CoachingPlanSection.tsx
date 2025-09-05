'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Target, 
  Play, 
  Calendar,
  Star,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { CoachingPlan } from '@/types/dashboard';

interface CoachingPlanSectionProps {
  plan: CoachingPlan;
}

export default function CoachingPlanSection({ plan }: CoachingPlanSectionProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Coaching Plan</h2>
            <p className="text-gray-600 text-sm">{plan.title}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{plan.duration} weeks</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Updated {formatDate(plan.lastUpdated)}</span>
            </div>
          </div>
          
          {plan.isActive && (
            <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-gray-700">{plan.description}</p>
      </div>

      {/* Weekly Goals */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Weekly Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plan.weeklyGoals.map((goal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
            >
              <div className="p-1 bg-blue-500 rounded-full mt-0.5">
                <Star className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-blue-800">{goal}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Focus Areas Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Focus Areas ({plan.focusAreas.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.focusAreas.map((area, index) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800 capitalize">{area.area}</h4>
                <span className="text-xs text-gray-500">
                  Level {area.currentLevel} → {area.targetLevel}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{area.title}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  area.priority === 'high' ? 'bg-red-100 text-red-700' :
                  area.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {area.priority} priority
                </span>
                <div className="flex items-center space-x-1 text-gray-500 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{area.estimatedWeeks}w</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Suggested Videos Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Recommended Videos ({plan.suggestedVideos.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plan.suggestedVideos.slice(0, 3).map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm group-hover:text-purple-600 transition-colors">
                    {video.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{video.duration}m</span>
                    <span>•</span>
                    <span>{video.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {video.focusAreas.slice(0, 2).map((area, areaIndex) => (
                    <span
                      key={areaIndex}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full capitalize"
                    >
                      {area}
                    </span>
                  ))}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
        
        {plan.suggestedVideos.length > 3 && (
          <div className="mt-3 text-center">
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View all {plan.suggestedVideos.length} videos →
            </button>
          </div>
        )}
      </div>

      {/* Plan Status */}
      <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Lightbulb className="w-5 h-5 text-gray-600" />
          <div>
            <h4 className="font-medium text-gray-800">Plan Status</h4>
            <p className="text-gray-600 text-sm">
              {plan.isActive 
                ? 'This coaching plan is currently active and being tracked.'
                : 'This plan is ready to be activated. Click "Apply Plan" to start tracking progress.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}