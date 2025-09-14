'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/types/dashboard';
import { useState, useEffect } from 'react';

interface BadgesPageProps {
  badges: Badge[];
  totalEarned: number;
  onBackToDashboard: () => void;
}

export default function BadgesPage({ badges, totalEarned, onBackToDashboard }: BadgesPageProps) {
  const [newlyEarnedBadges, setNewlyEarnedBadges] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Check for newly earned badges (earned within last 24 hours)
  useEffect(() => {
    const recentBadges = badges.filter(badge => {
      if (!badge.earnedAt) return false;
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return badge.earnedAt > oneDayAgo;
    }).map(badge => badge.id);
    
    setNewlyEarnedBadges(recentBadges);
    if (recentBadges.length > 0) {
      setShowCelebration(true);
      // Hide celebration after 3 seconds
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [badges]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-wiggle-blue via-wiggle-purple to-wiggle-pink relative overflow-hidden">
      {/* Celebration Confetti Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -100, 
                  x: Math.random() * window.innerWidth,
                  rotate: 0,
                  scale: 0
                }}
                animate={{ 
                  y: window.innerHeight + 100,
                  rotate: 360,
                  scale: 1
                }}
                transition={{ 
                  duration: 3,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute text-4xl"
              >
                {['🎉', '⭐', '🏆', '🎊', '✨'][i % 5]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.6 }}
          onClick={onBackToDashboard}
          className="mb-6 bg-white/20 backdrop-blur-sm rounded-full p-4 border-3 border-white/30 hover:bg-white/30 transition-all duration-200 flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-3xl">🏠</span>
          <span className="text-xl font-bold text-white">Back to Dashboard</span>
        </motion.button>

        {/* Trophy Shelf Header */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.6 }}
          className="text-center mb-8"
        >
          <div className="bg-wiggle-yellow/90 rounded-3xl p-6 border-4 border-wiggle-yellow shadow-2xl">
            <h1 className="text-5xl font-bold text-wiggle-purple drop-shadow-lg mb-4">
              🏆 Your Trophy Shelf! 🏆
            </h1>
            <p className="text-2xl text-wiggle-purple/90 font-semibold">
              You've earned {totalEarned} amazing {totalEarned === 1 ? 'badge' : 'badges'}!
            </p>
            {newlyEarnedBadges.length > 0 && (
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-lg text-wiggle-purple/80 mt-2 font-bold"
              >
                🎉 {newlyEarnedBadges.length} new {newlyEarnedBadges.length === 1 ? 'badge' : 'badges'} earned recently!
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Trophy Shelf - Sticker Book Layout */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-4 border-white/20 shadow-2xl">
          {/* Shelf Bars */}
          <div className="space-y-8">
            {/* Top Shelf - Recent Badges */}
            {badges.length > 0 && (
              <div className="relative">
                <div className="bg-gradient-to-r from-wiggle-yellow to-wiggle-pink h-4 rounded-full mb-6 shadow-lg"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {badges.slice(0, 6).map((badge, index) => {
                    const isNewlyEarned = newlyEarnedBadges.includes(badge.id);
                    return (
                      <motion.div
                        key={badge.id}
                        initial={{ scale: 0, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ 
                          delay: index * 0.15, 
                          type: "spring", 
                          bounce: 0.7 
                        }}
                        whileHover={{ 
                          scale: 1.1, 
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.3 }
                        }}
                        className={`relative bg-gradient-to-br from-white to-gray-100 rounded-2xl p-4 border-3 text-center shadow-lg ${
                          isNewlyEarned 
                            ? 'border-wiggle-yellow animate-pulse' 
                            : 'border-gray-300'
                        }`}
                      >
                        {/* New Badge Sparkle Effect */}
                        {isNewlyEarned && (
                          <motion.div
                            animate={{ 
                              rotate: 360,
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="absolute -top-2 -right-2 text-2xl"
                          >
                            ✨
                          </motion.div>
                        )}
                        
                        <div className="text-5xl mb-3" role="img" aria-label={badge.name}>
                          {badge.icon}
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 mb-1">
                          {badge.name}
                        </h3>
                        <p className="text-xs text-gray-600 capitalize">
                          {badge.category}
                        </p>
                        {badge.earnedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            {badge.earnedAt.toLocaleDateString()}
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Middle Shelf - More Badges */}
            {badges.length > 6 && (
              <div className="relative">
                <div className="bg-gradient-to-r from-wiggle-blue to-wiggle-purple h-4 rounded-full mb-6 shadow-lg"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {badges.slice(6, 12).map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ scale: 0, opacity: 0, y: 50 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ 
                        delay: (index + 6) * 0.15, 
                        type: "spring", 
                        bounce: 0.7 
                      }}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 }
                      }}
                      className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-4 border-3 border-gray-300 text-center shadow-lg"
                    >
                      <div className="text-5xl mb-3" role="img" aria-label={badge.name}>
                        {badge.icon}
                      </div>
                      <h3 className="text-sm font-bold text-gray-800 mb-1">
                        {badge.name}
                      </h3>
                      <p className="text-xs text-gray-600 capitalize">
                        {badge.category}
                      </p>
                      {badge.earnedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          {badge.earnedAt.toLocaleDateString()}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Shelf - Empty Slots for Future Badges */}
            <div className="relative">
              <div className="bg-gradient-to-r from-wiggle-green to-wiggle-blue h-4 rounded-full mb-6 shadow-lg"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: Math.max(0, 6 - Math.max(0, badges.length - 12)) }).map((_, index) => (
                  <motion.div
                    key={`empty-${index}`}
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ 
                      delay: (badges.length + index) * 0.15, 
                      type: "spring", 
                      bounce: 0.7 
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border-3 border-white/30 text-center border-dashed"
                  >
                    <div className="text-4xl mb-3 opacity-40">
                      ❓
                    </div>
                    <h3 className="text-sm font-bold text-white/60 mb-1">
                      Mystery Badge
                    </h3>
                    <p className="text-xs text-white/50">
                      Keep playing!
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress and Encouragement Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 space-y-6"
        >
          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-wiggle-yellow/90 rounded-3xl p-6 border-3 border-wiggle-yellow text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-xl font-bold text-wiggle-purple mb-1">Total Badges</h3>
              <p className="text-3xl font-bold text-wiggle-purple">{totalEarned}</p>
            </div>
            
            <div className="bg-wiggle-pink/90 rounded-3xl p-6 border-3 border-wiggle-pink text-center">
              <div className="text-4xl mb-2">🔥</div>
              <h3 className="text-xl font-bold text-white mb-1">Learning Streak</h3>
              <p className="text-3xl font-bold text-white">3 days</p>
            </div>
            
            <div className="bg-wiggle-blue/90 rounded-3xl p-6 border-3 border-wiggle-blue text-center">
              <div className="text-4xl mb-2">⭐</div>
              <h3 className="text-xl font-bold text-white mb-1">Next Goal</h3>
              <p className="text-lg font-bold text-white">5 badges</p>
            </div>
          </div>

          {/* Encouragement Message with Mascot */}
          <div className="bg-gradient-to-r from-wiggle-green/90 to-wiggle-blue/90 rounded-3xl p-8 border-4 border-white/30 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="text-8xl">🐯</div>
              <div>
                <p className="text-3xl font-bold text-white mb-3">
                  🌟 You're doing amazing! 🌟
                </p>
                <p className="text-xl text-white/90 mb-4">
                  Complete more videos and homework to fill up your trophy shelf!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBackToDashboard}
                  className="bg-wiggle-yellow text-wiggle-purple font-bold text-xl px-8 py-4 rounded-full border-3 border-wiggle-yellow shadow-lg hover:bg-wiggle-yellow/90 transition-all duration-200"
                >
                  🎮 Let's Play More!
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}