'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/types/dashboard';

interface KidsDashboardHeaderProps {
  childName: string;
  childAvatar: string;
  streak?: number;
  badges?: Badge[];
  totalBadges?: number;
}

export default function KidsDashboardHeader({ 
  childName, 
  childAvatar, 
  streak = 0, 
  badges = [], 
  totalBadges = 0 
}: KidsDashboardHeaderProps) {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center justify-between p-4 sm:p-6 z-10"
    >
      {/* Child Profile Section */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Child Avatar */}
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-white/50"
          role="img"
          aria-label={`${childName}'s avatar`}
        >
          {childAvatar ? (
            <img 
              src={childAvatar} 
              alt={`${childName}'s avatar`}
              className="w-full h-full object-cover"
              loading="eager"
            />
          ) : (
            <span className="text-xl sm:text-2xl" role="img" aria-label="Default child avatar">
              👶
            </span>
          )}
        </motion.div>
        
        {/* Child Name and Greeting */}
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg font-fredoka">
            Hi, {childName}! 🌟
          </h1>
          <p className="text-white/80 text-xs sm:text-sm font-fredoka">
            Ready for an adventure?
          </p>
        </div>
      </div>

      {/* Streak and Badge Indicators */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
        className="flex items-center gap-2 sm:gap-3"
      >
        {/* Streak Indicator */}
        {streak > 0 && (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1 flex items-center gap-1 border border-white/30"
            role="status"
            aria-label={`${streak} day learning streak`}
          >
            <span className="text-sm sm:text-lg" role="img" aria-label="Fire emoji">🔥</span>
            <span className="text-white font-bold text-xs sm:text-sm font-fredoka">
              {streak}
            </span>
          </motion.div>
        )}
        
        {/* Badge Count Indicator */}
        {totalBadges > 0 && (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1 flex items-center gap-1 border border-white/30"
            role="status"
            aria-label={`${totalBadges} badges earned`}
          >
            <span className="text-sm sm:text-lg" role="img" aria-label="Star emoji">⭐</span>
            <span className="text-white font-bold text-xs sm:text-sm font-fredoka">
              {totalBadges}
            </span>
          </motion.div>
        )}

        {/* Recent Badge Preview (show latest earned badge) */}
        {badges.length > 0 && (
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="bg-white/20 backdrop-blur-sm rounded-full p-1 sm:p-2 flex items-center justify-center border border-white/30"
            title={`Latest badge: ${badges[badges.length - 1]?.name}`}
            role="button"
            aria-label={`Latest badge earned: ${badges[badges.length - 1]?.name}`}
          >
            <span className="text-sm sm:text-lg" role="img" aria-label={badges[badges.length - 1]?.name || 'Badge'}>
              {badges[badges.length - 1]?.icon || '🏆'}
            </span>
          </motion.div>
        )}
      </motion.div>
    </motion.header>
  );
}