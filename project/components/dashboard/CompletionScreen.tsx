'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Badge } from '@/types/dashboard';

interface CompletionScreenProps {
  score: number;
  totalQuestions: number;
  earnedBadge: Badge;
  onBackToDashboard: () => void;
  isVisible: boolean;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  delay: number;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  score,
  totalQuestions,
  earnedBadge,
  onBackToDashboard,
  isVisible
}) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showContent, setShowContent] = useState(isVisible);

  // Generate confetti pieces
  useEffect(() => {
    if (isVisible) {
      const pieces: ConfettiPiece[] = [];
      for (let i = 0; i < 50; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          color: ['#FFD93D', '#FF6AD5', '#87CEEB', '#A7F432', '#9D8DF1'][Math.floor(Math.random() * 5)],
          rotation: Math.random() * 360,
          delay: Math.random() * 2
        });
      }
      setConfetti(pieces);
      
      // Show content immediately, with optional delay for animations
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  }, [isVisible]);

  const scorePercentage = Math.round((score / totalQuestions) * 100);
  
  // Determine encouragement message based on score
  const getEncouragementMessage = () => {
    if (scorePercentage >= 90) return "Amazing work! You're a superstar! 🌟";
    if (scorePercentage >= 70) return "Great job! You did fantastic! 🎉";
    if (scorePercentage >= 50) return "Good work! Keep practicing! 👏";
    return "Nice try! You're getting better! 💪";
  };

  const getScoreColor = () => {
    if (scorePercentage >= 90) return "text-green-500";
    if (scorePercentage >= 70) return "text-blue-500";
    if (scorePercentage >= 50) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center overflow-hidden"
        >
          {/* Confetti Animation */}
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{ 
                x: `${piece.x}vw`, 
                y: '-10vh',
                rotate: piece.rotation,
                opacity: 1
              }}
              animate={{ 
                y: '110vh',
                rotate: piece.rotation + 720,
                opacity: 0
              }}
              transition={{
                duration: 3,
                delay: piece.delay,
                ease: "easeOut"
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: piece.color }}
            />
          ))}

          {/* Main Content */}
          {showContent && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 20,
                  delay: 0.2
                }}
                className="bg-white rounded-3xl p-8 mx-4 max-w-md w-full text-center shadow-2xl"
              >
                {/* Happy Tiger Mascot */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15,
                    delay: 0.5
                  }}
                  className="mb-6"
                >
                  <Image
                    src="/images/mascots/happy_tiger.png"
                    alt="Happy Tiger Mascot"
                    width={120}
                    height={120}
                    className="mx-auto"
                  />
                </motion.div>

                {/* Completion Message */}
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-4xl font-bold text-purple-600 mb-4 font-fredoka"
                >
                  🎉 Well Done! 🎉
                </motion.h1>

                {/* Score Display */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mb-6"
                >
                  <div className={`text-6xl font-bold ${getScoreColor()} mb-2 font-fredoka`}>
                    {score}/{totalQuestions}
                  </div>
                  <div className="text-2xl text-gray-600 font-fredoka">
                    {getEncouragementMessage()}
                  </div>
                </motion.div>

                {/* Badge Reward */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: 1.1
                  }}
                  className="mb-8"
                >
                  <div className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl p-4 mx-auto max-w-xs">
                    <div className="text-lg font-bold text-orange-800 mb-2 font-fredoka">
                      🏆 You Earned a Badge! 🏆
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-4xl">{earnedBadge.icon}</span>
                      <div className="text-xl font-bold text-orange-800 font-fredoka">
                        {earnedBadge.name}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Back to Dashboard Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBackToDashboard}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-fredoka min-h-[60px] min-w-[200px]"
                >
                  🏠 Back to Dashboard
                </motion.button>

                {/* Celebration Stars */}
                <div className="absolute -top-4 -left-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="text-4xl"
                  >
                    ⭐
                  </motion.div>
                </div>
                <div className="absolute -top-4 -right-4">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="text-3xl"
                  >
                    🌟
                  </motion.div>
                </div>
                <div className="absolute -bottom-4 -left-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="text-3xl"
                  >
                    ✨
                  </motion.div>
                </div>
                <div className="absolute -bottom-4 -right-4">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                    className="text-4xl"
                  >
                    💫
                  </motion.div>
                </div>
              </motion.div>
            )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompletionScreen;