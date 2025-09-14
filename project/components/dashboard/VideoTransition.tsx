'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface VideoTransitionProps {
  isVisible: boolean;
  videoTitle: string;
  onTransitionComplete: () => void;
}

export default function VideoTransition({ 
  isVisible, 
  videoTitle, 
  onTransitionComplete 
}: VideoTransitionProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Sequence the transition animations
      const messageTimer = setTimeout(() => setShowMessage(true), 500);
      const loadingTimer = setTimeout(() => setShowLoadingAnimation(true), 1500);
      const completeTimer = setTimeout(() => {
        onTransitionComplete();
      }, 4000);

      return () => {
        clearTimeout(messageTimer);
        clearTimeout(loadingTimer);
        clearTimeout(completeTimer);
      };
    } else {
      setShowMessage(false);
      setShowLoadingAnimation(false);
    }
  }, [isVisible, onTransitionComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-wiggle-blue via-wiggle-purple to-wiggle-pink flex flex-col items-center justify-center"
        >
          {/* Mascot Introduction */}
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ 
              delay: 0.2, 
              type: "spring", 
              bounce: 0.6,
              duration: 0.8 
            }}
            className="flex flex-col items-center mb-8"
          >
            <div className="relative w-32 h-32 md:w-48 md:h-48 mb-6">
              <Image
                src="/images/mascots/smilling_mascot.png"
                alt="Smiling Mascot"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Mascot Speech Bubble */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring", bounce: 0.4 }}
              className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-md mx-4"
            >
              {/* Speech bubble tail */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
              
              <p className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
                🎬 Get Ready! 🎬
              </p>
              <p className="text-lg md:text-xl text-center text-gray-600">
                The video is starting!
              </p>
            </motion.div>
          </motion.div>

          {/* Video Title Display */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
                  {videoTitle}
                </h2>
                <p className="text-xl md:text-2xl text-white/90 drop-shadow">
                  Let&apos;s have some fun! 🌟
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Playful Loading Animations */}
          <AnimatePresence>
            {showLoadingAnimation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-6"
              >
                {/* Bouncing Ball Animation */}
                <div className="flex space-x-4">
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      animate={{
                        y: [-20, 0, -20],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: index * 0.2,
                        ease: "easeInOut"
                      }}
                      className="w-6 h-6 bg-white rounded-full shadow-lg"
                    />
                  ))}
                </div>

                {/* Star Burst Animation */}
                <div className="relative w-24 h-24">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        transform: `rotate(${index * 60}deg)`
                      }}
                    >
                      <div className="text-3xl">⭐</div>
                    </motion.div>
                  ))}
                </div>

                {/* Loading Text */}
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-xl text-white font-bold drop-shadow"
                >
                  Loading your adventure...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Elements for Extra Magic */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Floating Hearts */}
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={`heart-${index}`}
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
                  opacity: 0
                }}
                animate={{
                  y: -100,
                  opacity: [0, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "linear"
                }}
                className="absolute text-2xl"
              >
                💖
              </motion.div>
            ))}

            {/* Floating Stars */}
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={`star-${index}`}
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
                  opacity: 0
                }}
                animate={{
                  y: -100,
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5]
                }}
                transition={{
                  duration: 5 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: "linear"
                }}
                className="absolute text-xl"
              >
                ✨
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}