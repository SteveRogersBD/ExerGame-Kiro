'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export interface MascotGuideProps {
  message: string;
  mascotImage?: string;
  position?: 'corner' | 'center';
  isVisible?: boolean;
  onDismiss?: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
}

const MASCOT_IMAGES = {
  happy: '/images/mascots/happy_tiger.png',
  confused: '/images/mascots/confused_tiger.png',
  sad: '/images/mascots/sad_tiger.png',
  smiling: '/images/mascots/smilling_mascot.png',
};

const MascotGuide: React.FC<MascotGuideProps> = ({
  message,
  mascotImage = MASCOT_IMAGES.happy,
  position = 'corner',
  isVisible = true,
  onDismiss,
  autoHide = true,
  autoHideDelay = 5000,
}) => {
  const [showGuide, setShowGuide] = useState(isVisible);

  useEffect(() => {
    setShowGuide(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (autoHide && showGuide && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        setShowGuide(false);
        onDismiss?.();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, showGuide, autoHideDelay, onDismiss]);

  const handleDismiss = () => {
    setShowGuide(false);
    onDismiss?.();
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      case 'corner':
      default:
        return 'bottom-24 right-6';
    }
  };

  const getSpeechBubblePosition = () => {
    switch (position) {
      case 'center':
        return 'bottom-full mb-4 left-1/2 transform -translate-x-1/2';
      case 'corner':
      default:
        return 'bottom-full mb-4 right-0';
    }
  };

  return (
    <AnimatePresence>
      {showGuide && (
        <motion.div
          className={`fixed z-50 ${getPositionClasses()}`}
          initial={{ 
            opacity: 0, 
            scale: 0,
            rotate: -180,
            y: 50,
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            rotate: 0,
            y: [0, -10, 0],
          }}
          exit={{ 
            opacity: 0, 
            scale: 0,
            rotate: 180,
            y: 50,
            transition: { duration: 0.5, ease: "backIn" }
          }}
          transition={{
            duration: 0.6, 
            ease: "backOut",
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }}
        >
          {/* Speech Bubble */}
          <motion.div
            className={`absolute ${getSpeechBubblePosition()} max-w-xs`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="relative bg-white rounded-2xl p-4 shadow-lg border-4 border-yellow-300">
              {/* Speech bubble tail */}
              <div 
                className={`absolute top-full ${position === 'center' ? 'left-1/2 transform -translate-x-1/2' : 'right-6'} w-0 h-0`}
                style={{
                  borderLeft: '12px solid transparent',
                  borderRight: '12px solid transparent',
                  borderTop: '12px solid #fde047', // yellow-300
                }}
              />
              <div 
                className={`absolute top-full ${position === 'center' ? 'left-1/2 transform -translate-x-1/2' : 'right-6'} w-0 h-0 mt-[-2px]`}
                style={{
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid white',
                }}
              />
              
              {/* Message text */}
              <p className="text-lg font-bold text-gray-800 text-center leading-relaxed">
                {message}
              </p>
              
              {/* Dismiss button */}
              {onDismiss && (
                <button
                  onClick={handleDismiss}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm transition-colors duration-200"
                  aria-label="Dismiss mascot guide"
                >
                  ×
                </button>
              )}
            </div>
          </motion.div>

          {/* Mascot Image */}
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={position === 'center' ? handleDismiss : undefined}
          >
            <Image
              src={mascotImage}
              alt="Mascot guide"
              width={100}
              height={100}
              className="drop-shadow-xl"
              priority
            />
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-yellow-300/30 blur-lg -z-10 animate-pulse" />
            
            {/* Sparkle effects */}
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-400 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MascotGuide;