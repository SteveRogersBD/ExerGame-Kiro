'use client';

import { motion } from 'framer-motion';
import { BookOpen, Trophy, TrendingUp } from 'lucide-react';

interface QuizScoresProps {
  completionRate: number;
  averageScore: number;
}

export default function QuizScores({ completionRate, averageScore }: QuizScoresProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Quiz Performance</h3>
        <BookOpen size={20} className="text-purple-600" />
      </div>

      <div className="space-y-6">
        {/* Completion Rate */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completion Rate</span>
            <span className={`text-lg font-bold ${getCompletionColor(completionRate)}`}>
              {completionRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Average Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Average Score</span>
            <div className="flex items-center space-x-2">
              <span className={`text-lg font-bold ${getScoreColor(averageScore)}`}>
                {averageScore}%
              </span>
              <div className={`px-2 py-1 rounded text-xs font-bold text-white ${
                averageScore >= 90 ? 'bg-green-500' :
                averageScore >= 80 ? 'bg-yellow-500' :
                averageScore >= 70 ? 'bg-orange-500' : 'bg-red-500'
              }`}>
                {getScoreGrade(averageScore)}
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                averageScore >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                averageScore >= 80 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                averageScore >= 70 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                'bg-gradient-to-r from-red-500 to-red-600'
              }`}
              style={{ width: `${averageScore}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mx-auto mb-2">
              <Trophy size={16} className="text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">Grade</p>
            <p className={`text-lg font-bold ${getScoreColor(averageScore)}`}>
              {getScoreGrade(averageScore)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
              <TrendingUp size={16} className="text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Trend</p>
            <p className="text-lg font-bold text-green-600">
              {averageScore >= 80 ? '↗' : averageScore >= 70 ? '→' : '↘'}
            </p>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            {averageScore >= 90 ? '🌟 Excellent work! Keep up the amazing performance!' :
             averageScore >= 80 ? '👍 Great job! You\'re doing really well!' :
             averageScore >= 70 ? '💪 Good progress! Keep practicing to improve!' :
             '🎯 Keep trying! Every quiz helps you learn and grow!'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}