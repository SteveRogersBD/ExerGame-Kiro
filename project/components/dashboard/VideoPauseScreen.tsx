'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface VideoPauseScreenProps {
  videoTitle: string;
  onResume: () => void;
  onQuit: () => void;
  currentScore?: number;
}

export default function VideoPauseScreen({
  videoTitle,
  onResume,
  onQuit,
  currentScore = 0
}: VideoPauseScreenProps) {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Stars */}
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={`star-${index}`}
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: 0
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
            className="absolute text-2xl"
          >
            ⭐
          </motion.div>
        ))}
      </div>

      {/* Main Pause Content */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.6, duration: 0.6 }}
        className="bg-gradient-to-br from-wiggle-blue via-wiggle-purple to-wiggle-pink rounded-3xl p-8 md:p-12 shadow-2xl text-center max-w-md mx-4"
      >
        {/* Pause Mascot */}
        <motion.div
          animate={{ 
            y: [-5, 5, -5],
            rotate: [-2, 2, -2]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-6"
        >
          <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
            <Image
              src="/images/mascots/smilling_mascot.png"
              alt="Pause Mascot"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Pause Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-4"
        >
          Video Paused! ⏸️
        </motion.h1>

        {/* Video Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg md:text-xl text-white/90 drop-shadow mb-2 font-semibold"
        >
          {videoTitle}
        </motion.p>

        {/* Score Display */}
        {currentScore > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white/20 rounded-2xl p-4 mb-6"
          >
            <div className="text-white">
              <div className="text-lg font-bold">Your Score</div>
              <div className="text-2xl font-bold">{currentScore} ⭐</div>
            </div>
          </motion.div>
        )}

        {/* Encouraging Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-base md:text-lg text-white/80 drop-shadow mb-8"
        >
          Take your time! Ready to continue? 🎬
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Resume Button */}
          <motion.button
            onClick={onResume}
            className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xl md:text-2xl font-bold px-8 py-4 rounded-3xl shadow-lg min-w-[180px] min-h-[70px] flex items-center justify-center gap-3"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="text-3xl">▶️</span>
            Resume!
          </motion.button>

          {/* Quit Button */}
          <motion.button
            onClick={onQuit}
            className="bg-gradient-to-r from-red-400 to-red-600 text-white text-xl md:text-2xl font-bold px-8 py-4 rounded-3xl shadow-lg min-w-[180px] min-h-[70px] flex items-center justify-center gap-3"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="text-3xl">🏠</span>
            Quit
          </motion.button>
        </motion.div>

        {/* Helper Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-sm md:text-base text-white/70 mt-6"
        >
          Tap Resume to continue watching! 🎉
        </motion.p>
      </motion.div>

      {/* Floating Hearts for Comfort */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-4">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={`heart-${index}`}
              animate={{
                y: [-8, 0, -8],
                scale: [1, 1.1, 1],
                rotate: [-5, 5, -5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.4,
                ease: "easeInOut"
              }}
              className="text-xl"
            >
              💖
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}