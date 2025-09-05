'use client';

import { motion } from 'framer-motion';
import { Clock, Trophy, Target, Zap } from 'lucide-react';
import Image from 'next/image';
import { Session, ChildProfile } from '@/types/dashboard';

interface ActivityFeedItem {
  session: Session;
  child: ChildProfile;
}

interface ActivityFeedProps {
  activities: ActivityFeedItem[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const formatDuration = (startTime: Date, endTime?: Date) => {
    if (!endTime) return 'In progress...';
    const diff = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60);
    return `${diff} min`;
  };

  const getActivityIcon = (session: Session) => {
    if (session.quizScore !== undefined) {
      return <Trophy size={16} className="text-yellow-600" />;
    }
    if (session.moves.length > 0) {
      return <Target size={16} className="text-blue-600" />;
    }
    return <Zap size={16} className="text-purple-600" />;
  };

  const getActivityDescription = (session: Session) => {
    if (session.status === 'completed') {
      const totalMoves = session.moves.reduce((sum, move) => sum + move.count, 0);
      const avgAccuracy = session.moves.length > 0 
        ? Math.round(session.moves.reduce((sum, move) => sum + move.accuracy, 0) / session.moves.length)
        : 0;
      
      let description = `Completed ${session.contentTitle}`;
      if (totalMoves > 0) {
        description += ` • ${totalMoves} moves • ${avgAccuracy}% accuracy`;
      }
      if (session.quizScore !== undefined) {
        description += ` • Quiz: ${session.quizScore}%`;
      }
      return description;
    }
    return `Started ${session.contentTitle}`;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-purple-500 rounded-full mx-auto flex items-center justify-center mb-4">
            <Clock size={24} className="text-white" />
          </div>
          <p className="text-gray-500">No recent activity to show.</p>
          <p className="text-sm text-gray-400 mt-1">Activity will appear here as your children play.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.slice(0, 10).map((activity, index) => (
          <motion.div
            key={activity.session.id}
            className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50/50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="relative flex-shrink-0">
              <Image
                src={activity.child.avatar}
                alt={activity.child.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                {getActivityIcon(activity.session)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-800">
                  {activity.child.name}
                </p>
                <span className="text-xs text-gray-500">
                  {getTimeAgo(activity.session.endTime || activity.session.startTime)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {getActivityDescription(activity.session)}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{formatDuration(activity.session.startTime, activity.session.endTime)}</span>
                </div>
                {activity.session.status === 'completed' && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    Completed
                  </span>
                )}
                {activity.session.status === 'active' && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    Active
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {activities.length > 10 && (
          <div className="text-center pt-4 border-t border-gray-200">
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              View All Activity →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}