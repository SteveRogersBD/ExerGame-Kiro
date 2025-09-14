'use client';

import React from 'react';
import { QuizQuestion } from '@/types/dashboard';
import { motion, AnimatePresence } from 'framer-motion';
import QuizCard from './QuizCard';

interface QuizOverlayProps {
  quiz: QuizQuestion | null;
  isVisible: boolean;
  onAnswer: (selectedOptionId: string) => void;
}

export default function QuizOverlay({ quiz, isVisible, onAnswer }: QuizOverlayProps) {
  if (!quiz) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        >
          <QuizCard 
            quiz={quiz}
            onAnswer={onAnswer}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}