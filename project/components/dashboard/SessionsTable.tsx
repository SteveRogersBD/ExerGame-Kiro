'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Target, TrendingUp, Award } from 'lucide-react';
import { SessionTableRow } from '@/types/dashboard';

interface SessionsTableProps {
  sessions: SessionTableRow[];
}

export default function SessionsTable({ sessions }: SessionsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600 bg-green-50';
    if (accuracy >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  if (sessions.length === 0) {
    return (
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center mb-4">
            <Calendar size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Sessions Yet</h3>
          <p className="text-gray-500">Recent session data will appear here once activities are completed.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Recent Sessions</h3>
        <div className="text-sm text-gray-600">
          Last {sessions.length} sessions
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>Date</span>
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Content</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>Duration</span>
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                <div className="flex items-center space-x-2">
                  <Target size={16} />
                  <span>Moves</span>
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                <div className="flex items-center space-x-2">
                  <TrendingUp size={16} />
                  <span>Accuracy</span>
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                <div className="flex items-center space-x-2">
                  <Award size={16} />
                  <span>Score</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <motion.tr
                key={session.id}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="py-4 px-4 text-gray-700">
                  {formatDate(session.date)}
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-800">{session.contentTitle}</div>
                </td>
                <td className="py-4 px-4 text-gray-700">
                  {formatDuration(session.duration)}
                </td>
                <td className="py-4 px-4 text-gray-700">
                  {session.moves}
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccuracyColor(session.accuracy)}`}>
                    {session.accuracy}%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`font-medium ${getScoreColor(session.score)}`}>
                    {session.score ? `${session.score}%` : 'N/A'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            className="bg-gray-50/50 rounded-lg p-4 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">{session.contentTitle}</h4>
              <span className="text-sm text-gray-600">{formatDate(session.date)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock size={14} className="text-gray-500" />
                <span className="text-gray-700">{formatDuration(session.duration)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target size={14} className="text-gray-500" />
                <span className="text-gray-700">{session.moves} moves</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp size={14} className="text-gray-500" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccuracyColor(session.accuracy)}`}>
                  {session.accuracy}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Award size={14} className="text-gray-500" />
                <span className={`font-medium ${getScoreColor(session.score)}`}>
                  {session.score ? `${session.score}%` : 'N/A'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}