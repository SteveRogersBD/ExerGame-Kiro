'use client';

import { motion } from 'framer-motion';
import { Bell, Play, Trophy, AlertTriangle, FileText } from 'lucide-react';
import { useNotifications } from './NotificationService';

export default function NotificationDemo() {
  const { 
    triggerSessionStartNotification, 
    triggerSessionMilestoneNotification, 
    triggerScreenTimeWarningNotification,
    addNotification 
  } = useNotifications();

  const handleSessionStart = () => {
    triggerSessionStartNotification('Emma', 'Balance Adventure');
  };

  const handleMilestone = () => {
    triggerSessionMilestoneNotification('Alex', 'completed 15 balance moves with 98% accuracy');
  };

  const handleScreenTimeWarning = () => {
    triggerScreenTimeWarningNotification('Emma', 10);
  };

  const handleWeeklyReport = () => {
    addNotification({
      type: 'weekly_report',
      title: 'Weekly Activity Report Ready',
      message: 'Your children had an amazing week! Check out their progress summary.',
      isRead: false
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Bell size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Notification Demo</h2>
          <p className="text-sm text-gray-600">Test different notification types</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.button
          onClick={handleSessionStart}
          className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Play size={20} className="text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-800">Session Start</h3>
            <p className="text-sm text-gray-600">Trigger session start notification</p>
          </div>
        </motion.button>

        <motion.button
          onClick={handleMilestone}
          className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Trophy size={20} className="text-green-600" />
          <div>
            <h3 className="font-medium text-gray-800">Milestone</h3>
            <p className="text-sm text-gray-600">Trigger milestone notification</p>
          </div>
        </motion.button>

        <motion.button
          onClick={handleScreenTimeWarning}
          className="flex items-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AlertTriangle size={20} className="text-orange-600" />
          <div>
            <h3 className="font-medium text-gray-800">Screen Time Warning</h3>
            <p className="text-sm text-gray-600">Trigger screen time warning</p>
          </div>
        </motion.button>

        <motion.button
          onClick={handleWeeklyReport}
          className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FileText size={20} className="text-purple-600" />
          <div>
            <h3 className="font-medium text-gray-800">Weekly Report</h3>
            <p className="text-sm text-gray-600">Trigger weekly report notification</p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}