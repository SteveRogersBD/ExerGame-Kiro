'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInteractiveAnimations } from '@/hooks/useInteractiveAnimations';

interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: string;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
}

export default function PageTransition({ 
  children, 
  pageKey, 
  className = '',
  direction = 'up'
}: PageTransitionProps) {
  const { pageTransitionVariants, prefersReducedMotion } = useInteractiveAnimations();

  // Custom transition variants based on direction
  const getDirectionalVariants = () => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      };
    }

    const baseTransition = {
      duration: 0.6,
      ease: "easeOut" as const
    };

    switch (direction) {
      case 'up':
        return {
          initial: { opacity: 0, y: 50, scale: 0.95 },
          animate: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: baseTransition
          },
          exit: { 
            opacity: 0, 
            y: -50, 
            scale: 0.95,
            transition: { duration: 0.4, ease: "easeIn" as const }
          }
        };
      case 'down':
        return {
          initial: { opacity: 0, y: -50, scale: 0.95 },
          animate: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: baseTransition
          },
          exit: { 
            opacity: 0, 
            y: 50, 
            scale: 0.95,
            transition: { duration: 0.4, ease: "easeIn" as const }
          }
        };
      case 'left':
        return {
          initial: { opacity: 0, x: 100, scale: 0.95 },
          animate: { 
            opacity: 1, 
            x: 0, 
            scale: 1,
            transition: baseTransition
          },
          exit: { 
            opacity: 0, 
            x: -100, 
            scale: 0.95,
            transition: { duration: 0.4, ease: "easeIn" as const }
          }
        };
      case 'right':
        return {
          initial: { opacity: 0, x: -100, scale: 0.95 },
          animate: { 
            opacity: 1, 
            x: 0, 
            scale: 1,
            transition: baseTransition
          },
          exit: { 
            opacity: 0, 
            x: 100, 
            scale: 0.95,
            transition: { duration: 0.4, ease: "easeIn" as const }
          }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { 
            opacity: 1, 
            scale: 1,
            transition: baseTransition
          },
          exit: { 
            opacity: 0, 
            scale: 0.8,
            transition: { duration: 0.4, ease: "easeIn" as const }
          }
        };
      default:
        return pageTransitionVariants;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        variants={getDirectionalVariants()}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}