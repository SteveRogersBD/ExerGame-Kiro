'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Mascot {
  id: string;
  image: string;
  name: string;
  x: number;
  y: number;
  scale: number;
  duration: number;
}

const ANIMAL_IMAGES = [
  { image: '/images/animals/bear.png', name: 'bear' },
  { image: '/images/animals/eagle.png', name: 'eagle' },
  { image: '/images/animals/monkey.png', name: 'monkey' },
  { image: '/images/animals/penguin.png', name: 'penguin' },
  { image: '/images/mascots/happy_tiger.png', name: 'happy tiger' },
  { image: '/images/mascots/smilling_mascot.png', name: 'smiling mascot' },
];

const FloatingMascots = () => {
  const [mascots, setMascots] = useState<Mascot[]>([]);

  // Generate random position within safe bounds (avoiding UI elements)
  const generateRandomPosition = () => ({
    x: Math.random() * 60 + 20, // 20% to 80% of screen width
    y: Math.random() * 50 + 25, // 25% to 75% of screen height
  });

  // Create a new mascot with random properties
  const createMascot = (): Mascot => {
    const animalData = ANIMAL_IMAGES[Math.floor(Math.random() * ANIMAL_IMAGES.length)];
    const position = generateRandomPosition();
    
    return {
      id: `mascot-${Date.now()}-${Math.random()}`,
      image: animalData.image,
      name: animalData.name,
      x: position.x,
      y: position.y,
      scale: Math.random() * 0.4 + 0.6, // Scale between 0.6 and 1.0
      duration: Math.random() * 3 + 4, // Duration between 4-7 seconds
    };
  };

  // Add mascots periodically
  useEffect(() => {
    const addMascot = () => {
      setMascots(prev => {
        // Limit to maximum 3 mascots at once
        if (prev.length >= 3) return prev;
        return [...prev, createMascot()];
      });
    };

    // Add initial mascot after a short delay
    const initialTimer = setTimeout(addMascot, 2000);

    // Add new mascots every 8-15 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to add a mascot
        addMascot();
      }
    }, Math.random() * 7000 + 8000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // Remove mascot after its animation completes
  const removeMascot = (mascotId: string) => {
    setMascots(prev => prev.filter(mascot => mascot.id !== mascotId));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {mascots.map((mascot) => (
          <motion.div
            key={mascot.id}
            className="absolute"
            style={{
              left: `${mascot.x}%`,
              top: `${mascot.y}%`,
            }}
            initial={{ 
              opacity: 0, 
              scale: 0,
              rotate: -180,
              y: 50,
            }}
            animate={{ 
              opacity: 1, 
              scale: mascot.scale,
              rotate: 0,
              y: [0, -20, 0, -15, 0], // Gentle floating motion
              x: [0, 10, -5, 8, 0], // Slight horizontal drift
            }}
            exit={{ 
              opacity: 0, 
              scale: 0,
              rotate: 180,
              y: -50,
              transition: { duration: 1.0, ease: "backIn" }
            }}
            transition={{
              duration: 1.0, 
              ease: "backOut",
              y: {
                duration: mascot.duration,
                repeat: Infinity,
                ease: "easeInOut",
              },
              x: {
                duration: mascot.duration * 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }
            }}
            onAnimationComplete={(definition) => {
              // Remove mascot after floating animation completes several cycles
              if (definition === "animate") {
                setTimeout(() => removeMascot(mascot.id), mascot.duration * 1000 * 2.5);
              }
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <Image
                src={mascot.image}
                alt={`Floating ${mascot.name} mascot`}
                width={80}
                height={80}
                className="drop-shadow-lg"
                priority={false}
              />
              {/* Subtle glow effect */}
              <div 
                className="absolute inset-0 rounded-full bg-white/20 blur-sm -z-10"
                style={{
                  animation: `pulse ${mascot.duration}s ease-in-out infinite`,
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingMascots;