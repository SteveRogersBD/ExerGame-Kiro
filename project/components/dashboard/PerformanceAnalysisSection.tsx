'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Star, Target, Lightbulb, Calendar } from 'lucide-react';
import { PerformanceAnalysis } from '@/types/dashboard';

interface PerformanceAnalysisSectionProps {
  analysis: PerformanceAnalysis;
}

const trendIcons = {
  increasing: TrendingUp,
  decreasing: TrendingDown,
  stable: Minus,
  improving: TrendingUp,
  declining: TrendingDown,
  high: Star,
  medium: Target,
  low: Minus
};

const trendColors = {
  increasing: 'text-green-600 bg-green-100',
  decreasing: 'text-red-600 bg-red-100',
  stable: 'text-gray-600 bg-gray-100',
  improving: 'text-green-600 bg-green-100',
  declining: 'text-red-600 bg-red-100',
  high: 'text-green-600 bg-green-100',
  medium: 'text-yellow-600 bg-yellow-100',
  low: 'text-red-600 bg-red-100'
};

export default function PerformanceAnalysisSection({ analysis }: PerformanceAnalysisSectionProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-orange-500';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Performance Analysis</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Last {analysis.period === '7d' ? '7 days' : '30 days'}</span>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Performance Score</span>
          <span className={`text-2xl font-bold ${getScoreTextColor(analysis.overallScore)}`}>
            {analysis.overallScore}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className={`bg-gradient-to-r ${getScoreColor(analysis.overallScore)} h-3 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${analysis.overallScore}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
      </div>

      {/* Trends */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Trends</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(analysis.trends).map(([key, value], index) => {
            const Icon = trendIcons[value as keyof typeof trendIcons];
            const colorClass = trendColors[value as keyof typeof trendColors];
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-3"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div className={`p-1 rounded-full ${colorClass}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <span className={`text-xs capitalize ${colorClass.split(' ')[0]} font-medium`}>
                  {value}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Strengths */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Strengths</h3>
        <div className="space-y-2">
          {analysis.strengths.map((strength, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
            >
              <div className="p-1 bg-green-500 rounded-full mt-0.5">
                <Star className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-green-800">{strength}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Areas for Improvement */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Areas for Improvement</h3>
        <div className="space-y-2">
          {analysis.areasForImprovement.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg"
            >
              <div className="p-1 bg-yellow-500 rounded-full mt-0.5">
                <Target className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-yellow-800">{area}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Insights</h3>
        <div className="space-y-2">
          {analysis.insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg"
            >
              <div className="p-1 bg-blue-500 rounded-full mt-0.5">
                <Lightbulb className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-blue-800">{insight}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Generated timestamp */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Analysis generated on {analysis.generatedAt.toLocaleDateString()} at {analysis.generatedAt.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}