'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  type?: 'network' | 'server' | 'generic';
  className?: string;
}

export default function ErrorDisplay({ 
  error, 
  onRetry, 
  type = 'generic',
  className = '' 
}: ErrorDisplayProps) {
  const getErrorIcon = () => {
    switch (type) {
      case 'network':
        return <WifiOff size={32} className="text-red-600" />;
      case 'server':
        return <AlertTriangle size={32} className="text-orange-600" />;
      default:
        return <AlertTriangle size={32} className="text-red-600" />;
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case 'network':
        return 'Connection Problem';
      case 'server':
        return 'Server Error';
      default:
        return 'Something went wrong';
    }
  };

  const getErrorDescription = () => {
    switch (type) {
      case 'network':
        return 'Please check your internet connection and try again.';
      case 'server':
        return 'Our servers are experiencing issues. Please try again in a moment.';
      default:
        return error || 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center ${className}`}
    >
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
        {getErrorIcon()}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{getErrorTitle()}</h3>
      <p className="text-gray-600 mb-6">{getErrorDescription()}</p>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all mx-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw size={18} />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  );
}

// Specific error components for common scenarios
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error="Network connection failed"
      onRetry={onRetry}
      type="network"
    />
  );
}

export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error="Server temporarily unavailable"
      onRetry={onRetry}
      type="server"
    />
  );
}

export function DataError({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error={error}
      onRetry={onRetry}
      type="generic"
    />
  );
}