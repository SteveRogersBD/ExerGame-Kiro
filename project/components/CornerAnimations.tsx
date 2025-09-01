'use client';

import { motion } from 'framer-motion';

export default function CornerAnimations() {
  const cornerAnimals = [
    { emoji: '🦀', position: 'top-20 left-4', size: 'text-2xl' },
    { emoji: '🐘', position: 'top-32 left-16', size: 'text-3xl' },
    { emoji: '🦁', position: 'top-24 right-6', size: 'text-3xl' },
    { emoji: '🦒', position: 'top-40 right-20', size: 'text-2xl' },
    { emoji: '🐨', position: 'bottom-6 left-8', size: 'text-2xl' },
    { emoji: '🐼', position: 'bottom-20 left-20', size: 'text-3xl' },
    { emoji: '🦊', position: 'bottom-8 right-4', size: 'text-2xl' },
    { emoji: '🐶', position: 'bottom-24 right-16', size: 'text-3xl' },
  ];

  return (
    <>
      {cornerAnimals.map((animal, index) => (
        <motion.div
          key={index}
          className={`fixed ${animal.position} ${animal.size} opacity-20 z-10 pointer-events-none`}
          animate={{ 
            rotate: [0, 15, -15, 0],
            scale: [0.8, 1.2, 0.8],
            y: [0, -15, 0],
            x: index % 2 === 0 ? [0, 10, 0] : [0, -10, 0]
          }}
          transition={{ 
            duration: 4 + (index * 0.5),
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.8
          }}
        >
          {animal.emoji}
        </motion.div>
      ))}
    </>
  );
}