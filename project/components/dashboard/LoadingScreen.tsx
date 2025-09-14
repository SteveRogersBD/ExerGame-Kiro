'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LoadingScreenProps {
  message?: string;
  mascotImage?: string;
  showBouncingBalls?: boolean;
  showStarBurst?: boolean;
  backgroundColor?: string;
}

export default function LoadingScreen({
  message = "Loading...",
  mascotImage = "/images/mascots/smilling_mascot.png",
  showBouncingBalls = true,
  showStarBurst = true,
  backgroundColor = "bg-gradient-to-br from-wiggle-blue via-wiggle-purple to-wiggle-pink"
}: LoadingScreenProps) {
  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center ${backgroundColor}`}>
      {/* Mascot */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
        className="mb-8"
      >
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <Image
            src={mascotImage}
            alt="Loading Mascot"
            fill
            className="object-contain"
            priority
          />
        </div>
      </motion.div>

      {/* Loading Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg mb-2">
          {message}
        </h2>
        <p className="text-lg md:text-xl text-white/90 drop-shadow">
          Just a moment! 🌟
        </p>
      </motion.div>

      {/* Loading Animations Container */}
      <div className="flex flex-col items-center space-y-8">
        {/* Bouncing Balls */}
        {showBouncingBalls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex space-x-3"
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={`ball-${index}`}
                animate={{
                  y: [-15, 0, -15],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: "easeInOut"
                }}
                className="w-4 h-4 md:w-6 md:h-6 bg-white rounded-full shadow-lg"
              />
            ))}
          </motion.div>
        )}

        {/* Star Burst Animation */}
        {showStarBurst && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative w-16 h-16 md:w-20 md:h-20"
          >
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <motion.div
                key={`star-${index}`}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: index * 0.25,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `rotate(${index * 60}deg)`
                }}
              >
                <div className="text-xl md:text-2xl">⭐</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pulsing Loading Text */}
        <motion.div
          animate={{ 
            opacity: [0.6, 1, 0.6],
            scale: [0.95, 1, 0.95]
          }}
          transition={{ 
            duration: 1.2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-lg md:text-xl text-white font-bold drop-shadow"
        >
          Getting ready for you! 🎮
        </motion.div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Sparkles */}
        {[...Array(12)].map((_, index) => (
          <motion.div
            key={`sparkle-${index}`}
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
              opacity: 0
            }}
            animate={{
              y: -100,
              opacity: [0, 1, 0],
              rotate: [0, 360],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className="absolute text-lg"
          >
            ✨
          </motion.div>
        ))}

        {/* Floating Bubbles */}
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={`bubble-${index}`}
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
              opacity: 0
            }}
            animate={{
              y: -100,
              opacity: [0, 0.7, 0],
              scale: [0.3, 1.2, 0.3]
            }}
            transition={{
              duration: 6 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "linear"
            }}
            className="absolute w-4 h-4 bg-white/30 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}