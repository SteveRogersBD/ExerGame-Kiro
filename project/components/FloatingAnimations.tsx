'use client';

import { motion } from 'framer-motion';

export default function FloatingAnimations() {
  // Lots of jiggling animal emojis for background
  const animalEmojis = [
    '🐕', '🦁', '🦀', '🦒', '🐘', '🦓', '🐅', '🦏', '🐆', '🦘', 
    '🐨', '🐼', '🦔', '🐿️', '🦫', '🐰', '🐹', '🐭', '🐱', '🐶',
    '🦊', '🐺', '🐻', '🐸', '🐵', '🦍', '🐧', '🦆', '🦢', '🦩'
  ];

  // Generate random positions and properties for many animals
  const generateAnimals = () => {
    return Array.from({ length: 25 }, (_, index) => ({
      emoji: animalEmojis[index % animalEmojis.length],
      size: ['text-xl', 'text-2xl', 'text-3xl'][Math.floor(Math.random() * 3)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 6 + Math.random() * 8,
    }));
  };

  const floatingAnimals = generateAnimals();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {floatingAnimals.map((animal, index) => (
        <motion.div
          key={index}
          className={`absolute ${animal.size} opacity-15`}
          style={{
            left: `${animal.left}%`,
            top: `${animal.top}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, -10, 0],
            rotate: [0, 15, -15, 0],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: animal.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: animal.delay,
          }}
        >
          {animal.emoji}
        </motion.div>
      ))}
    </div>
  );
}