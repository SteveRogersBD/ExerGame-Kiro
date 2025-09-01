'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating Clouds */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute text-6xl opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            transform: [
              'translateX(0px) translateY(0px)',
              'translateX(20px) translateY(-15px)',
              'translateX(0px) translateY(0px)'
            ]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        >
          ☁️
        </motion.div>
      ))}

      {/* Floating Balloons */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`balloon-${i}`}
          className="absolute text-4xl opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            transform: [
              'translateY(0px) rotate(0deg)',
              'translateY(-30px) rotate(5deg)',
              'translateY(0px) rotate(-5deg)',
              'translateY(0px) rotate(0deg)'
            ]
          }}
          transition={{
            duration: 6 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        >
          🎈
        </motion.div>
      ))}

      {/* Floating Stars */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute text-2xl opacity-25"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            transform: [
              'scale(1) rotate(0deg)',
              'scale(1.2) rotate(180deg)',
              'scale(1) rotate(360deg)'
            ],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 4,
          }}
        >
          ⭐
        </motion.div>
      ))}
    </div>
  );
}