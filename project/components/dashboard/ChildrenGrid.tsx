'use client';

import { motion } from 'framer-motion';
import { Clock, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChildCardData } from '@/types/dashboard';

interface ChildrenGridProps {
  children: ChildCardData[];
}

export default function ChildrenGrid({ children }: ChildrenGridProps) {
  const router = useRouter();

  const formatPlayTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Playing';
      case 'paused':
        return 'Paused';
      default:
        return 'Offline';
    }
  };

  const handleChildClick = (childId: string) => {
    router.push(`/parent/dashboard/activity/${childId}`);
  };

  if (children.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
            <span className="text-white text-2xl">👶</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">No Children Added</h3>
            <p className="text-gray-500">Add your first child to start monitoring their activities.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {children.map((child, index) => (
        <motion.div
          key={child.id}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all touch-manipulation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onClick={() => handleChildClick(child.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <div className="relative">
              <Image
                src={child.avatar}
                alt={child.name}
                width={40}
                height={40}
                className="rounded-full sm:w-12 sm:h-12"
              />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 ${getStatusColor(child.status)} rounded-full border-2 border-white`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{child.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600">Age {child.age}</p>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2 text-gray-600">
                <Clock size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Today's Play Time</span>
              </div>
              <span className="font-semibold text-purple-600 text-xs sm:text-sm">
                {formatPlayTime(child.todayPlayTime)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2 text-gray-600">
                <TrendingUp size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Status</span>
              </div>
              <span className={`text-xs sm:text-sm font-medium ${
                child.status === 'active' ? 'text-green-600' :
                child.status === 'paused' ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {getStatusText(child.status)}
              </span>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <button className="w-full text-xs sm:text-sm text-purple-600 hover:text-purple-700 font-medium touch-manipulation">
              View Activity & Progress →
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}