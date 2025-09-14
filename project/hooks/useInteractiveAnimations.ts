import { useReducedMotion } from './useReducedMotion';
import { useCallback } from 'react';

/**
 * Custom hook for interactive animations that respects user's motion preferences
 */
export function useInteractiveAnimations() {
  const prefersReducedMotion = useReducedMotion();

  // Button animation variants
  const buttonVariants = {
    idle: { 
      scale: 1, 
      rotate: 0,
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
    },
    hover: prefersReducedMotion ? {
      scale: 1.02,
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
    } : {
      scale: 1.05,
      rotate: [0, -1, 1, 0],
      boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
    },
    tap: {
      scale: 0.95
    }
  };

  // Wiggle animation for emphasis
  const wiggleVariants = {
    idle: { rotate: 0 },
    wiggle: prefersReducedMotion ? {
      rotate: [0, 1, -1, 0]
    } : {
      rotate: [0, -5, 5, -3, 3, 0]
    }
  };

  // Glow effect variants
  const glowVariants = {
    idle: { 
      boxShadow: "0 0 0px rgba(255,255,255,0)" 
    },
    glow: prefersReducedMotion ? {
      boxShadow: "0 0 10px rgba(255,255,255,0.3)"
    } : {
      boxShadow: [
        "0 0 5px rgba(255,255,255,0.2)",
        "0 0 20px rgba(255,255,255,0.4)",
        "0 0 5px rgba(255,255,255,0.2)"
      ]
    }
  };

  // Page transition variants
  const pageTransitionVariants = {
    initial: { 
      opacity: 0, 
      y: prefersReducedMotion ? 10 : 50,
      scale: prefersReducedMotion ? 0.98 : 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1
    },
    exit: { 
      opacity: 0, 
      y: prefersReducedMotion ? -10 : -50,
      scale: prefersReducedMotion ? 0.98 : 0.95
    }
  };

  // Bounce animation for success states
  const bounceVariants = {
    idle: { scale: 1 },
    bounce: prefersReducedMotion ? {
      scale: [1, 1.05, 1]
    } : {
      scale: [1, 1.2, 0.9, 1.1, 1]
    }
  };

  // Pulse animation for attention
  const pulseVariants = {
    idle: { scale: 1, opacity: 1 },
    pulse: prefersReducedMotion ? {
      opacity: [1, 0.8, 1]
    } : {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1]
    }
  };

  // Sound effect placeholder function
  const playSound = useCallback((soundType: 'click' | 'hover' | 'success' | 'error' | 'whoosh') => {
    // Placeholder for sound effects - will be implemented when audio system is added
    console.log(`🔊 Playing sound: ${soundType}`);
    
    // Future implementation would play actual sounds:
    // const audio = new Audio(`/sounds/${soundType}.mp3`);
    // audio.volume = 0.3;
    // audio.play().catch(console.warn);
  }, []);

  // Haptic feedback for mobile devices
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  return {
    buttonVariants,
    wiggleVariants,
    glowVariants,
    pageTransitionVariants,
    bounceVariants,
    pulseVariants,
    playSound,
    triggerHaptic,
    prefersReducedMotion
  };
}