'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { ChildCardData } from '@/types/dashboard';
import { EmptyChildrenState } from '@/components/dashboard/EmptyStates';
import LoadingState, { SkeletonCard } from '@/components/dashboard/LoadingState';
import ErrorDisplay from '@/components/dashboard/ErrorDisplay';
import { useChildrenData } from '@/hooks/useDashboardData';

// Mock data - in a real app, this would come from an API
const mockChildren: ChildCardData[] = [
  {
    id: '1',
    name: 'Emma',
    age: 7,
    avatar: '/images/avatars/child1.png',
    createdAt: new Date(),
    isArchived: false,
    todayPlayTime: 45,
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'Liam',
    age: 5,
    avatar: '/images/avatars/child2.png',
    createdAt: new Date(),
    isArchived: false,
    todayPlayTime: 30,
    status: 'offline' as const,
  },
  {
    id: '3',
    name: 'Sophia',
    age: 8,
    avatar: '/images/avatars/child3.png',
    createdAt: new Date(),
    isArchived: false,
    todayPlayTime: 60,
    status: 'paused' as const,
  },
];

export default function ActivityPage() {
  const router = useRouter();
  const { data: children, loading, error, retry } = useChildrenData();

  const handleChildClick = (childId: string) => {
    router.push(`/parent/dashboard/activity/${childId}`);
  };

  const handleAddChild = () => {
    router.push('/parent/dashboard/profiles');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Activity & Progress</h1>
        <div className="text-sm text-gray-600">
          Select a child to view detailed activity
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <ErrorDisplay error={error} onRetry={retry} />
      ) : children && children.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children.map((child) => (
            <motion.div
              key={child.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-white/20"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChildClick(child.id)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <Image
                  src={child.avatar}
                  alt={child.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{child.name}</h3>
                  <p className="text-gray-600">Age {child.age}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(child.status)}`}>
                  {child.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Today's Play Time</span>
                  <span className="font-semibold text-purple-600">
                    {formatPlayTime(child.todayPlayTime)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((child.todayPlayTime / 60) * 100, 100)}%` }}
                  />
                </div>
                
                <div className="text-xs text-gray-500 text-center">
                  {child.todayPlayTime < 60 ? 
                    `${60 - child.todayPlayTime} minutes until daily limit` :
                    'Daily limit reached'
                  }
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-purple-600 font-medium hover:text-purple-700 transition-colors">
                  View Detailed Activity →
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyChildrenState onAddChild={handleAddChild} />
      )}
    </div>
  );
}