'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { FocusAreaRecommendation } from '@/types/dashboard';

interface FocusAreasSectionProps {
  focusAreas: FocusAreaRecommendation[];
}

const areaIcons = {
  endurance: '🏃‍♂️',
  balance: '🧘‍♀️',
  coordination: '🤹‍♀️',
  strength: '💪'
};

const priorityColors = {
  high: 'from-red-500 to-orange-500',
  medium: 'from-yellow-500 to-amber-500',
  low: 'from-green-500 to-emerald-500'
};

const priorityBgColors = {
  high: 'from-red-50 to-orange-50 border-red-200',
  medium: 'from-yellow-50 to-amber-50 border-yellow-200',
  low: 'from-green-50 to-emerald-50 border-green-200'
};

export default function FocusAreasSection({ focusAreas }: FocusAreasSectionProps) {
  const renderProgressBar = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Focus Areas</h2>
          <p className="text-gray-600 text-sm">Recommended areas for improvement</p>
        </div>
      </div>

      <div className="space-y-4">
        {focusAreas.map((area, index) => (
          <motion.div
            key={area.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-r ${priorityBgColors[area.priority]} border rounded-xl p-4`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{areaIcons[area.area]}</span>
                <div>
                  <h3 className="font-semibold text-gray-800 capitalize">{area.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 bg-gradient-to-r ${priorityColors[area.priority]} text-white text-xs rounded-full`}>
                      {area.priority} priority
                    </span>
                    <div className="flex items-center space-x-1 text-gray-600 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{area.estimatedWeeks} weeks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-sm mb-4">{area.description}</p>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Current Progress</span>
                <span className="text-sm text-gray-600">
                  Level {area.currentLevel} → {area.targetLevel}
                </span>
              </div>
              {renderProgressBar(area.currentLevel, area.targetLevel)}
            </div>

            {/* Activities */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Activities</h4>
              <div className="flex flex-wrap gap-2">
                {area.activities.map((activity, activityIndex) => (
                  <span
                    key={activityIndex}
                    className="px-3 py-1 bg-white/80 text-gray-700 text-xs rounded-full border"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {focusAreas.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">All Areas Looking Great!</h3>
          <p className="text-gray-600 text-sm">
            Your child is performing well across all focus areas. Keep up the great work!
          </p>
        </div>
      )}
    </div>
  );
}