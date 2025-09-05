'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pause, Square, Lock, Play, Clock } from 'lucide-react';
import Image from 'next/image';
import { Session, ChildProfile } from '@/types/dashboard';
import { useNotifications } from './NotificationService';
import { useToast } from '@/hooks/use-toast';

interface ActiveSessionCardProps {
  session: Session;
  child: ChildProfile;
  onPause: (sessionId: string) => void;
  onEnd: (sessionId: string) => void;
  onLock: (sessionId: string) => void;
}

export default function ActiveSessionCard({ 
  session, 
  child, 
  onPause, 
  onEnd, 
  onLock 
}: ActiveSessionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { triggerSessionMilestoneNotification } = useNotifications();
  const { toast } = useToast();

  const formatDuration = (startTime: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const [duration, setDuration] = useState(formatDuration(session.startTime));

  // Update duration every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(formatDuration(session.startTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [session.startTime]);

  const handleAction = async (action: () => void, actionType?: string) => {
    setIsLoading(true);
    try {
      await action();
      
      // Trigger notifications for certain actions
      if (actionType === 'end') {
        // Simulate milestone notification when session ends
        const sessionDurationMinutes = Math.floor((new Date().getTime() - session.startTime.getTime()) / 60000);
        if (sessionDurationMinutes >= 10) {
          triggerSessionMilestoneNotification(
            child.name, 
            `completed a ${sessionDurationMinutes}-minute session with great focus!`
          );
        }
        
        toast({
          title: "Session ended",
          description: `${child.name}'s session has been ended successfully.`,
        });
      } else if (actionType === 'pause') {
        toast({
          title: session.status === 'paused' ? "Session resumed" : "Session paused",
          description: `${child.name}'s session has been ${session.status === 'paused' ? 'resumed' : 'paused'}.`,
        });
      } else if (actionType === 'lock') {
        toast({
          title: "App locked",
          description: `The app has been locked for ${child.name}.`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-green-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="relative flex-shrink-0">
            <Image
              src={child.avatar}
              alt={child.name}
              width={40}
              height={40}
              className="rounded-full sm:w-12 sm:h-12"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{child.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600">Active Session</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 text-green-600 flex-shrink-0">
          <Clock size={14} className="sm:w-4 sm:h-4" />
          <span className="font-mono text-sm sm:text-lg font-semibold">{duration}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
        <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={session.contentThumbnail}
            alt={session.contentTitle}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 text-sm sm:text-base truncate">{session.contentTitle}</h4>
          <p className="text-xs sm:text-sm text-gray-600">
            Started at {session.startTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <motion.button
            onClick={() => handleAction(() => onPause(session.id), 'pause')}
            disabled={isLoading}
            className={`
              flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all touch-manipulation
              ${session.status === 'paused' 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }
              disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {session.status === 'paused' ? (
              <>
                <Play size={14} className="sm:w-4 sm:h-4" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause size={14} className="sm:w-4 sm:h-4" />
                <span>Pause</span>
              </>
            )}
          </motion.button>

          <motion.button
            onClick={() => handleAction(() => onLock(session.id), 'lock')}
            disabled={isLoading}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm touch-manipulation"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Lock size={14} className="sm:w-4 sm:h-4" />
            <span>Lock App</span>
          </motion.button>
        </div>

        <motion.button
          onClick={() => handleAction(() => onEnd(session.id), 'end')}
          disabled={isLoading}
          className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm touch-manipulation"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Square size={14} className="sm:w-4 sm:h-4" />
          <span>End Session</span>
        </motion.button>
      </div>
    </motion.div>
  );
}