'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInteractiveAnimations } from '@/hooks/useInteractiveAnimations';

interface FeedbackItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'celebration';
  message: string;
  emoji?: string;
  duration?: number;
}

interface VisualFeedbackProps {
  feedback: FeedbackItem[];
  onRemove: (id: string) => void;
  position?: 'top' | 'center' | 'bottom';
}

interface RippleEffectProps {
  x: number;
  y: number;
  color?: string;
  onComplete: () => void;
}

// Ripple effect component for click feedback
export function RippleEffect({ x, y, color = 'rgba(255, 255, 255, 0.6)', onComplete }: RippleEffectProps) {
  const { prefersReducedMotion } = useInteractiveAnimations();

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: x - 25, top: y - 25 }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ 
        scale: prefersReducedMotion ? 2 : 4, 
        opacity: 0 
      }}
      transition={{ 
        duration: prefersReducedMotion ? 0.3 : 0.6, 
        ease: "easeOut" 
      }}
      onAnimationComplete={onComplete}
    >
      <div 
        className="w-12 h-12 rounded-full border-2"
        style={{ borderColor: color }}
      />
    </motion.div>
  );
}

// Confetti particle component
function ConfettiParticle({ delay = 0 }: { delay?: number }) {
  const { prefersReducedMotion } = useInteractiveAnimations();
  const emojis = ['🎉', '⭐', '🎊', '✨', '🌟', '💫'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  return (
    <motion.div
      className="absolute text-2xl pointer-events-none"
      initial={{ 
        y: -20, 
        x: Math.random() * 400 - 200,
        rotate: 0,
        opacity: 1
      }}
      animate={{ 
        y: prefersReducedMotion ? 100 : 300,
        x: Math.random() * 200 - 100,
        rotate: prefersReducedMotion ? 90 : 360,
        opacity: 0
      }}
      transition={{ 
        duration: prefersReducedMotion ? 1 : 2,
        delay,
        ease: "easeOut"
      }}
    >
      {emoji}
    </motion.div>
  );
}

// Main visual feedback component
export default function VisualFeedback({ 
  feedback, 
  onRemove, 
  position = 'top' 
}: VisualFeedbackProps) {
  const { prefersReducedMotion } = useInteractiveAnimations();

  const positionClasses = {
    top: 'top-4 left-1/2 transform -translate-x-1/2',
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  const getTypeStyles = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-400';
      case 'error':
        return 'bg-red-500 text-white border-red-400';
      case 'info':
        return 'bg-blue-500 text-white border-blue-400';
      case 'celebration':
        return 'bg-gradient-to-r from-wiggle-yellow to-wiggle-pink text-wiggle-purple border-wiggle-yellow';
      default:
        return 'bg-gray-500 text-white border-gray-400';
    }
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]}`}>
      <AnimatePresence>
        {feedback.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ 
              opacity: 0, 
              y: position === 'bottom' ? 50 : -50,
              scale: 0.8
            }}
            animate={{ 
              opacity: 1, 
              y: index * (prefersReducedMotion ? 60 : 80),
              scale: 1
            }}
            exit={{ 
              opacity: 0, 
              x: 100,
              scale: 0.8
            }}
            transition={{ 
              duration: prefersReducedMotion ? 0.2 : 0.4,
              ease: "easeOut"
            }}
            className={`
              relative px-6 py-4 rounded-2xl border-3 shadow-lg backdrop-blur-sm
              flex items-center gap-3 mb-2 min-w-[300px] max-w-[500px]
              ${getTypeStyles(item.type)}
            `}
          >
            {/* Emoji */}
            {item.emoji && (
              <motion.span
                animate={prefersReducedMotion ? {} : { 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="text-3xl"
              >
                {item.emoji}
              </motion.span>
            )}

            {/* Message */}
            <span className="font-bold text-lg flex-1">
              {item.message}
            </span>

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(item.id)}
              className="text-2xl opacity-70 hover:opacity-100 transition-opacity"
            >
              ✕
            </motion.button>

            {/* Celebration confetti */}
            {item.type === 'celebration' && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: prefersReducedMotion ? 3 : 8 }).map((_, i) => (
                  <ConfettiParticle key={i} delay={i * 0.1} />
                ))}
              </div>
            )}

            {/* Auto-remove timer */}
            <FeedbackTimer
              duration={item.duration || 3000}
              onComplete={() => onRemove(item.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Timer component for auto-removing feedback
function FeedbackTimer({ duration, onComplete }: { duration: number; onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <motion.div
      className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
      initial={{ width: '100%' }}
      animate={{ width: '0%' }}
      transition={{ duration: duration / 1000, ease: "linear" }}
    />
  );
}

// Hook for managing visual feedback
export function useVisualFeedback() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);

  const addFeedback = (item: Omit<FeedbackItem, 'id'>) => {
    const newItem: FeedbackItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    };
    setFeedback(prev => [...prev, newItem]);
  };

  const removeFeedback = (id: string) => {
    setFeedback(prev => prev.filter(item => item.id !== id));
  };

  const clearAllFeedback = () => {
    setFeedback([]);
  };

  return {
    feedback,
    addFeedback,
    removeFeedback,
    clearAllFeedback
  };
}