'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface KidsErrorScreenProps {
  type?: 'network' | 'video' | 'general' | 'offline';
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showRetryButton?: boolean;
  showHomeButton?: boolean;
}

function KidsErrorScreen({
  type = 'general',
  message,
  onRetry,
  onGoHome,
  showRetryButton = true,
  showHomeButton = true
}: KidsErrorScreenProps) {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          mascot: '/images/mascots/sad_tiger.png',
          title: 'Oops! No Internet! 📡',
          message: message || "The internet is taking a nap! Let's try again when it wakes up.",
          backgroundColor: 'bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200'
        };
      case 'video':
        return {
          mascot: '/images/mascots/confused_tiger.png',
          title: 'This Video is Sleepy! 😴',
          message: message || "This video is taking a little nap. Let's try waking it up!",
          backgroundColor: 'bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200'
        };
      case 'offline':
        return {
          mascot: '/images/mascots/sad_tiger.png',
          title: 'No Internet Right Now! 🌐',
          message: message || "Don't worry! We can still play some fun games while we wait for the internet to come back!",
          backgroundColor: 'bg-gradient-to-br from-gray-200 via-blue-200 to-purple-200'
        };
      default:
        return {
          mascot: '/images/mascots/sad_tiger.png',
          title: 'Oops! Something Happened! 🤔',
          message: message || "Don't worry! Sometimes things get a little mixed up. Let's try again!",
          backgroundColor: 'bg-gradient-to-br from-wiggle-blue via-wiggle-purple to-wiggle-pink'
        };
    }
  };

  const config = getErrorConfig();

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-6 ${config.backgroundColor}`}>
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Sad Clouds */}
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={`cloud-${index}`}
            initial={{ 
              x: -100,
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: 0
            }}
            animate={{
              x: (typeof window !== 'undefined' ? window.innerWidth : 1000) + 100,
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "linear"
            }}
            className="absolute text-4xl"
          >
            ☁️
          </motion.div>
        ))}
      </div>

      {/* Main Error Content */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
        className="text-center z-10"
      >
        {/* Sad Mascot */}
        <motion.div
          animate={{ 
            y: [-5, 5, -5],
            rotate: [-2, 2, -2]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
            <Image
              src={config.mascot}
              alt="Sad Mascot"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Error Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-4"
        >
          {config.title}
        </motion.h1>

        {/* Error Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-2xl text-white/90 drop-shadow mb-8 max-w-md mx-auto leading-relaxed"
        >
          {config.message}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {showRetryButton && onRetry && (
            <motion.button
              onClick={onRetry}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xl md:text-2xl font-bold px-8 py-4 rounded-3xl shadow-lg min-w-[160px] min-h-[60px] flex items-center justify-center gap-3"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="text-2xl">🔄</span>
              Try Again!
            </motion.button>
          )}

          {showHomeButton && onGoHome && (
            <motion.button
              onClick={onGoHome}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xl md:text-2xl font-bold px-8 py-4 rounded-3xl shadow-lg min-w-[160px] min-h-[60px] flex items-center justify-center gap-3"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="text-2xl">🏠</span>
              Go Home
            </motion.button>
          )}
        </motion.div>

        {/* Encouraging Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8"
        >
          <motion.p
            animate={{ 
              opacity: [0.7, 1, 0.7],
              scale: [0.98, 1, 0.98]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-lg md:text-xl text-white font-bold drop-shadow"
          >
            Don't worry! We'll fix this together! 💪✨
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Bouncing Hearts for Comfort */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-4">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={`heart-${index}`}
              animate={{
                y: [-10, 0, -10],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.3,
                ease: "easeInOut"
              }}
              className="text-2xl"
            >
              💖
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Specific error screen components for different scenarios
export function NetworkErrorScreen({ onRetry, onGoHome }: { onRetry?: () => void; onGoHome?: () => void }) {
  return (
    <KidsErrorScreen
      type="network"
      onRetry={onRetry}
      onGoHome={onGoHome}
    />
  );
}

export function VideoErrorScreen({ onRetry, onGoHome }: { onRetry?: () => void; onGoHome?: () => void }) {
  return (
    <KidsErrorScreen
      type="video"
      onRetry={onRetry}
      onGoHome={onGoHome}
    />
  );
}

export function OfflineScreen({ onGoHome }: { onGoHome?: () => void }) {
  return (
    <KidsErrorScreen
      type="offline"
      onGoHome={onGoHome}
      showRetryButton={false}
      message="No internet right now, but that's okay! Let's play some fun offline games while we wait! 🎮"
    />
  );
}

export function GeneralErrorScreen({ message, onRetry, onGoHome }: { 
  message?: string; 
  onRetry?: () => void; 
  onGoHome?: () => void; 
}) {
  return (
    <KidsErrorScreen
      type="general"
      message={message}
      onRetry={onRetry}
      onGoHome={onGoHome}
    />
  );
}

// Export the main component as default and named export
export default KidsErrorScreen;
export { KidsErrorScreen };