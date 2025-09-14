'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useState, useEffect } from 'react';

type Theme = 'sky' | 'forest' | 'space';

interface ThemeConfig {
  gradient: string;
  elements: {
    emoji: string;
    count: number;
    size: string;
    opacity: string;
  }[];
}

const themes: Record<Theme, ThemeConfig> = {
  sky: {
    gradient: 'bg-gradient-to-b from-blue-300 via-blue-200 to-blue-100',
    elements: [
      { emoji: '☁️', count: 6, size: 'text-6xl', opacity: 'opacity-30' },
      { emoji: '🌤️', count: 2, size: 'text-5xl', opacity: 'opacity-40' },
      { emoji: '🎈', count: 3, size: 'text-4xl', opacity: 'opacity-35' },
      { emoji: '🕊️', count: 2, size: 'text-3xl', opacity: 'opacity-25' },
    ]
  },
  forest: {
    gradient: 'bg-gradient-to-b from-green-300 via-green-200 to-green-100',
    elements: [
      { emoji: '🌳', count: 4, size: 'text-6xl', opacity: 'opacity-20' },
      { emoji: '🦋', count: 5, size: 'text-3xl', opacity: 'opacity-40' },
      { emoji: '🌸', count: 6, size: 'text-2xl', opacity: 'opacity-35' },
      { emoji: '🐝', count: 3, size: 'text-2xl', opacity: 'opacity-30' },
    ]
  },
  space: {
    gradient: 'bg-gradient-to-b from-purple-400 via-purple-300 to-indigo-300',
    elements: [
      { emoji: '⭐', count: 8, size: 'text-3xl', opacity: 'opacity-40' },
      { emoji: '🌟', count: 4, size: 'text-4xl', opacity: 'opacity-35' },
      { emoji: '🚀', count: 2, size: 'text-5xl', opacity: 'opacity-30' },
      { emoji: '🌙', count: 1, size: 'text-6xl', opacity: 'opacity-25' },
    ]
  }
};

export default function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [currentTheme, setCurrentTheme] = useState<Theme>('sky');

  // Theme rotation logic - change theme every 30 seconds
  useEffect(() => {
    const themeKeys = Object.keys(themes) as Theme[];
    let currentIndex = 0;

    const rotateTheme = () => {
      currentIndex = (currentIndex + 1) % themeKeys.length;
      setCurrentTheme(themeKeys[currentIndex]);
    };

    const interval = setInterval(rotateTheme, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  const theme = themes[currentTheme];

  // If user prefers reduced motion, render a static background
  if (prefersReducedMotion) {
    return (
      <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${theme.gradient}`}>
        {/* Static decorative elements */}
        {theme.elements.map((element, elementIndex) =>
          [...Array(Math.min(element.count, 3))].map((_, i) => (
            <div
              key={`static-${elementIndex}-${i}`}
              className={`absolute ${element.size} ${element.opacity}`}
              style={{
                left: `${20 + i * 30}%`,
                top: `${20 + i * 20}%`,
              }}
            >
              {element.emoji}
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <motion.div 
      key={currentTheme}
      className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${theme.gradient}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {/* Animated theme elements */}
      {theme.elements.map((element, elementIndex) =>
        [...Array(element.count)].map((_, i) => (
          <motion.div
            key={`${currentTheme}-${elementIndex}-${i}`}
            className={`absolute ${element.size} ${element.opacity}`}
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 90 + 5}%`,
            }}
            animate={{
              transform: [
                'translateX(0px) translateY(0px) rotate(0deg)',
                `translateX(${(Math.random() - 0.5) * 40}px) translateY(${(Math.random() - 0.5) * 30}px) rotate(${(Math.random() - 0.5) * 20}deg)`,
                'translateX(0px) translateY(0px) rotate(0deg)'
              ],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 4,
            }}
          >
            {element.emoji}
          </motion.div>
        ))
      )}

      {/* Theme transition indicator */}
      <motion.div
        className="absolute bottom-4 right-4 text-xs opacity-20 font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.2, y: 0 }}
        transition={{ delay: 1 }}
      >
        {currentTheme} theme
      </motion.div>
    </motion.div>
  );
}