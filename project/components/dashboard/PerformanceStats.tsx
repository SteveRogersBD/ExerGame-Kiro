'use client';

import { motion } from 'framer-motion';
import { Clock, Target, TrendingUp, Award } from 'lucide-react';
import { PerformanceMetrics } from '@/types/dashboard';

interface PerformanceStatsProps {
  metrics: PerformanceMetrics;
}

export default function PerformanceStats({ metrics }: PerformanceStatsProps) {
  const formatPlayTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const totalMoves = Object.values(metrics.movesByType).reduce((sum, count) => sum + count, 0);

  const stats = [
    {
      icon: Clock,
      label: 'Total Play Time',
      value: formatPlayTime(metrics.totalPlayTime),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      icon: Target,
      label: 'Total Moves',
      value: totalMoves.toString(),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      icon: TrendingUp,
      label: 'Average Accuracy',
      value: `${metrics.averageAccuracy}%`,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      icon: Award,
      label: 'Current Streak',
      value: `${metrics.currentStreak} days`,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 sm:p-4 lg:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4">
            <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} self-start`}>
              <stat.icon size={18} className={`${stat.textColor} sm:w-5 sm:h-5 lg:w-6 lg:h-6`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}