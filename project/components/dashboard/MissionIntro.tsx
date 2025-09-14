'use client';

import { motion } from 'framer-motion';
import { HomeworkItem } from '@/types/dashboard';
import Image from 'next/image';

interface MissionIntroProps {
  homework: HomeworkItem;
  onStartMission: () => void;
  onBack: () => void;
}

export default function MissionIntro({ homework, onStartMission, onBack }: MissionIntroProps) {
  // Format duration from seconds to minutes:seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format due date if available
  const formatDueDate = (date?: Date) => {
    if (!date) return null;
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays > 1) return `Due in ${diffDays} days`;
    if (diffDays < 0) return 'Overdue';
    return null;
  };

  const dueText = formatDueDate(homework.dueDate);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-wiggle-blue via-wiggle-purple to-wiggle-pink flex items-center justify-center p-4 z-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300 text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ⭐
          </motion.div>
        ))}
      </div>

      {/* Main mission intro card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-white/50 max-w-2xl w-full mx-4 overflow-hidden"
      >
        {/* Header with mascot */}
        <div className="relative bg-gradient-to-r from-wiggle-green to-wiggle-blue p-8 text-center">
          {/* Mascot image */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            className="flex justify-center mb-4"
          >
            <div className="relative">
              <Image
                src="/images/smiling_mascot.png"
                alt="Smiling Mascot"
                width={120}
                height={120}
                className="rounded-full border-4 border-white shadow-lg"
              />
              {/* Speech bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="absolute -top-2 -right-4 bg-white rounded-2xl px-4 py-2 shadow-lg border-2 border-wiggle-yellow"
              >
                <div className="text-sm font-bold text-gray-800">Hi there!</div>
                <div className="absolute bottom-0 left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
              </motion.div>
            </div>
          </motion.div>

          {/* Mascot message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Here's today's homework! 📚
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-xl text-white/90"
          >
            Let's make learning fun together!
          </motion.p>
        </div>

        {/* Mission details */}
        <div className="p-8">
          {/* Assignment title with icon */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl"
              >
                {homework.icon}
              </motion.div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {homework.title}
                </h2>
                <p className="text-lg text-gray-600">
                  Assigned by {homework.assignedBy}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mission info cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {/* Duration card */}
            <div className="bg-gradient-to-br from-wiggle-yellow/20 to-wiggle-orange/20 rounded-2xl p-4 text-center border-2 border-wiggle-yellow/30">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-sm font-bold text-gray-700">Duration</div>
              <div className="text-lg font-bold text-gray-800">{formatDuration(homework.video.duration)}</div>
            </div>

            {/* Quiz questions card */}
            <div className="bg-gradient-to-br from-wiggle-purple/20 to-wiggle-pink/20 rounded-2xl p-4 text-center border-2 border-wiggle-purple/30">
              <div className="text-2xl mb-2">🧠</div>
              <div className="text-sm font-bold text-gray-700">Quiz Questions</div>
              <div className="text-lg font-bold text-gray-800">{homework.video.quizQuestions.length}</div>
            </div>

            {/* Due date card */}
            <div className="bg-gradient-to-br from-wiggle-green/20 to-wiggle-blue/20 rounded-2xl p-4 text-center border-2 border-wiggle-green/30">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-sm font-bold text-gray-700">Due Date</div>
              <div className="text-lg font-bold text-gray-800">{dueText || 'No rush!'}</div>
            </div>
          </motion.div>

          {/* Reward preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="bg-gradient-to-r from-wiggle-pink/10 to-wiggle-purple/10 rounded-2xl p-6 mb-8 text-center border-2 border-wiggle-pink/30"
          >
            <div className="text-lg font-bold text-gray-700 mb-2">Complete this mission to earn:</div>
            <div className="flex items-center justify-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-3xl"
              >
                {homework.video.completionReward.icon}
              </motion.div>
              <div className="text-xl font-bold text-gray-800">
                {homework.video.completionReward.name}
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {/* Back button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="text-xl">👈</span>
              Back to Dashboard
            </motion.button>

            {/* Start mission button */}
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartMission}
              className="flex-1 bg-gradient-to-r from-wiggle-pink to-wiggle-purple hover:from-wiggle-purple hover:to-wiggle-pink text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-xl"
              >
                🚀
              </motion.span>
              Start Mission!
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}