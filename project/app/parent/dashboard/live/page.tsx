'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Pause, Square, Lock, Play, Clock, User } from 'lucide-react';
import Image from 'next/image';
import { Session, ChildProfile } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';
import EmptySessionState from '@/components/dashboard/EmptySessionState';
import LoadingState from '@/components/dashboard/LoadingState';
import ErrorDisplay from '@/components/dashboard/ErrorDisplay';
import { useSessionData } from '@/hooks/useDashboardData';

// Mock data - in a real app, this would come from an API
const mockActiveSession: Session = {
  id: 'session-1',
  childId: '1',
  contentTitle: 'Balance Adventure',
  contentThumbnail: '/images/content/balance-adventure.png',
  startTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  status: 'active',
  moves: [
    { type: 'balance', count: 12, accuracy: 85 },
    { type: 'jump', count: 8, accuracy: 92 },
  ],
};

const mockChild: ChildProfile = {
  id: '1',
  name: 'Emma',
  age: 7,
  avatar: '/images/avatars/child1.png',
  createdAt: new Date(),
  isArchived: false,
};

export default function LiveMonitoringPage() {
  const { toast } = useToast();
  const [activeSession, setActiveSession] = useState<Session | null>(mockActiveSession);
  const [child] = useState<ChildProfile>(mockChild);
  const [isLoading, setIsLoading] = useState(false);

  const formatDuration = (startTime: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const [duration, setDuration] = useState(
    activeSession ? formatDuration(activeSession.startTime) : '0:00'
  );

  // Update duration every second
  useEffect(() => {
    if (!activeSession) return;
    
    const interval = setInterval(() => {
      setDuration(formatDuration(activeSession.startTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const handlePauseSession = async () => {
    if (!activeSession) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActiveSession(prev => prev ? {
        ...prev,
        status: prev.status === 'paused' ? 'active' : 'paused'
      } : null);
      
      const action = activeSession.status === 'paused' ? 'resumed' : 'paused';
      toast({
        title: `Session ${action}`,
        description: `${child.name}'s session has been ${action}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update session. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!activeSession) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActiveSession(null);
      
      toast({
        title: 'Session ended',
        description: `${child.name}'s session has been ended successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to end session. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLockApp = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'App locked',
        description: `The app has been locked for ${child.name}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to lock app. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Live Monitoring</h1>
            <p className="text-gray-600">Real-time session monitoring and controls</p>
          </div>
        </div>
        {activeSession && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-medium">LIVE</span>
          </div>
        )}
      </motion.div>

      {/* Live Session Content */}
      {activeSession ? (
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Session Header */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src={child.avatar}
                    alt={child.name}
                    width={64}
                    height={64}
                    className="rounded-full border-4 border-white/20"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{child.name}</h2>
                  <p className="text-white/80">Age {child.age} • Currently Playing</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-2xl font-mono font-bold">
                  <Clock size={24} />
                  <span>{duration}</span>
                </div>
                <p className="text-white/80">Session Duration</p>
              </div>
            </div>
          </div>

          {/* Content Preview */}
          <div className="p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative w-32 h-24 rounded-lg overflow-hidden">
                <Image
                  src={activeSession.contentThumbnail}
                  alt={activeSession.contentTitle}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {activeSession.contentTitle}
                </h3>
                <p className="text-gray-600 mb-3">
                  Started at {activeSession.startTime.toLocaleTimeString()}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    activeSession.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {activeSession.status === 'active' ? 'Playing' : 'Paused'}
                  </span>
                  {activeSession.moves.length > 0 && (
                    <span>
                      {activeSession.moves.reduce((sum, move) => sum + move.count, 0)} moves completed
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Session Stats */}
            {activeSession.moves.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {activeSession.moves.map((move, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 capitalize">{move.type}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-2xl font-bold text-purple-600">{move.count}</span>
                      <span className="text-sm text-gray-600">{move.accuracy}% accuracy</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <motion.button
                onClick={handlePauseSession}
                disabled={isLoading}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all
                  ${activeSession.status === 'paused' 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeSession.status === 'paused' ? (
                  <>
                    <Play size={20} />
                    <span>Resume Session</span>
                  </>
                ) : (
                  <>
                    <Pause size={20} />
                    <span>Pause Session</span>
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={handleLockApp}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Lock size={20} />
                <span>Lock App</span>
              </motion.button>

              <motion.button
                onClick={handleEndSession}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Square size={20} />
                <span>End Session</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        <EmptySessionState />
      )}

      {/* Additional Info */}
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Monitoring Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Radio size={16} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Real-time Updates</h4>
              <p className="text-sm text-gray-600">Monitor your child's activity as it happens with live session data.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <User size={16} className="text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Instant Controls</h4>
              <p className="text-sm text-gray-600">Pause, resume, or end sessions remotely with immediate effect.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock size={16} className="text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Session Tracking</h4>
              <p className="text-sm text-gray-600">Keep track of session duration and activity progress in real-time.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Lock size={16} className="text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Safety Controls</h4>
              <p className="text-sm text-gray-600">Lock the app instantly if needed for safety or break time.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}