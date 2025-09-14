'use client';

import { motion } from 'framer-motion';
import HomeworkCarousel from './HomeworkCarousel';
import { HomeworkItem } from '@/types/dashboard';

interface HomeworkSectionProps {
  homework: HomeworkItem[];
  onHomeworkSelect: (homework: HomeworkItem) => void;
}

export default function HomeworkSection({ homework, onHomeworkSelect }: HomeworkSectionProps) {
  // Count homework by status for display
  const homeworkStats = homework.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const notStarted = homeworkStats.not_started || 0;
  const inProgress = homeworkStats.in_progress || 0;
  const completed = homeworkStats.completed || 0;

  return (
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-12"
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-5xl font-bold text-white mb-4 drop-shadow-lg"
        >
          📚 Homework
        </motion.h2>
        
        {/* Status summary */}
        {homework.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-center gap-6 mb-6"
          >
            {notStarted > 0 && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border-2 border-white/30">
                <span className="text-2xl">🟢</span>
                <span className="text-white font-bold">{notStarted} Ready</span>
              </div>
            )}
            {inProgress > 0 && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border-2 border-white/30">
                <span className="text-2xl">🟡</span>
                <span className="text-white font-bold">{inProgress} In Progress</span>
              </div>
            )}
            {completed > 0 && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border-2 border-white/30">
                <span className="text-2xl">✅</span>
                <span className="text-white font-bold">{completed} Done</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Encouraging message */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-xl text-white/90 font-medium"
        >
          {homework.length === 0 
            ? "No homework assignments right now! 🎉"
            : completed === homework.length
            ? "Amazing! You've completed all your homework! 🌟"
            : inProgress > 0
            ? "Keep going! You're doing great! 💪"
            : "Ready for some learning adventures? 🚀"
          }
        </motion.p>
      </div>

      {/* Homework Carousel */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <HomeworkCarousel 
          homework={homework} 
          onHomeworkSelect={onHomeworkSelect}
        />
      </motion.div>

      {/* Motivational footer */}
      {homework.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border-2 border-white/20">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-2xl"
            >
              🎯
            </motion.span>
            <span className="text-white font-bold text-lg">
              Complete missions to earn awesome rewards!
            </span>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}