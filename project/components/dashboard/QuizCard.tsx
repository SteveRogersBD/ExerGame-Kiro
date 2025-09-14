'use client';

import React from 'react';
import { QuizQuestion } from '@/types/dashboard';
import { motion } from 'framer-motion';
import AnswerOptions from './AnswerOptions';

interface QuizCardProps {
  quiz: QuizQuestion;
  onAnswer: (selectedOptionId: string) => void;
}

export default function QuizCard({ quiz, onAnswer }: QuizCardProps) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl"
    >
      {/* Header with Mascot and Question */}
      <div className="flex items-center mb-8">
        <motion.img 
          src="/images/animals/smiling_mascot.png" 
          alt="Friendly mascot"
          className="w-24 h-24 mr-6 flex-shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring", bounce: 0.6 }}
        />
        <div className="flex-1">
          <motion.h3 
            className="text-3xl font-bold text-gray-800 mb-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            Quiz Time! 🎯
          </motion.h3>
          <motion.p 
            className="text-2xl text-gray-600 leading-relaxed"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {quiz.question}
          </motion.p>
        </div>
      </div>

      {/* Answer Options */}
      <AnswerOptions 
        options={quiz.options}
        onAnswer={onAnswer}
      />
    </motion.div>
  );
}