'use client';

import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingState({ 
  message = 'Loading...', 
  size = 'md',
  className = '' 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };

  const spinnerSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg ${sizeClasses[size]} text-center ${className}`}
    >
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          className={`${spinnerSizes[size]} border-4 border-purple-200 border-t-purple-500 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </motion.div>
  );
}

// Skeleton loading component for specific content types
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 sm:h-3 bg-gray-200 rounded"></div>
          <div className="h-2 sm:h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/3 mb-4 sm:mb-6"></div>
        <div className="h-48 sm:h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/4 mb-4 sm:mb-6"></div>
        <div className="space-y-3 sm:space-y-4">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex space-x-2 sm:space-x-4">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}