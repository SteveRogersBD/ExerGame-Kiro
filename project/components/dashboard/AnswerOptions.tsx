'use client';

import React from 'react';
import { QuizOption } from '@/types/dashboard';
import { motion } from 'framer-motion';
import { useInteractiveAnimations } from '@/hooks/useInteractiveAnimations';
import { useRippleEffect } from '@/hooks/useRippleEffect';
import { RippleEffect } from '@/components/ui/VisualFeedback';

interface AnswerOptionsProps {
  options: QuizOption[];
  onAnswer: (selectedOptionId: string) => void;
}

const gestureEmojis = {
  jump: '🦘',
  squat: '🐸',
  clap: '👏'
};

const gestureColors = {
  jump: 'from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600',
  squat: 'from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600',
  clap: 'from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600'
};

export default function AnswerOptions({ options, onAnswer }: AnswerOptionsProps) {
  const { buttonVariants, wiggleVariants, playSound, triggerHaptic } = useInteractiveAnimations();
  const { ripples, createRipple, removeRipple } = useRippleEffect();

  const handleAnswerClick = (optionId: string, event: React.MouseEvent) => {
    // Create ripple effect
    createRipple(event, 'rgba(255, 255, 255, 0.8)');
    
    // Play sound and haptic feedback
    playSound('success');
    triggerHaptic('heavy');
    
    // Call the answer handler
    onAnswer(optionId);
  };

  return (
    <>
      <div className="grid gap-4">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            variants={buttonVariants}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover="hover"
            whileTap="tap"
            transition={{ 
              delay: 0.6 + (index * 0.1), 
              duration: 0.4,
              type: "spring",
              stiffness: 100
            }}
            onClick={(event) => handleAnswerClick(option.id, event)}
            onHoverStart={() => playSound('hover')}
            className={`bg-gradient-to-r ${gestureColors[option.gesture]} text-white text-2xl font-bold py-6 px-8 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-between group relative overflow-hidden`}
          >
          <span className="flex-1 text-left">{option.text}</span>
          
            <div className="flex items-center space-x-3 ml-4">
              <motion.span 
                className="text-4xl"
                variants={wiggleVariants}
                animate="wiggle"
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                {gestureEmojis[option.gesture]}
              </motion.span>
              
              <div className="text-right">
                <div className="text-lg opacity-90 capitalize font-semibold">
                  {option.gesture}
                </div>
                <div className="text-sm opacity-70">
                  Try this move!
                </div>
              </div>
            </div>

            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        ))}
      </div>

      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <RippleEffect
          key={ripple.id}
          x={ripple.x}
          y={ripple.y}
          color={ripple.color}
          onComplete={() => removeRipple(ripple.id)}
        />
      ))}
    </>
  );
}