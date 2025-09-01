'use client';

import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';

interface HeroSectionProps {
  onPlayNow: () => void;
}

export default function HeroSection({ onPlayNow }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-wiggle-blue via-wiggle-green to-wiggle-pink overflow-hidden">
      {/* Floating Animals Background - Using emojis for better performance */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 text-4xl opacity-40"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🐕
        </motion.div>
        
        <motion.div
          className="absolute top-40 right-20 text-5xl opacity-35"
          animate={{ 
            y: [0, -30, 0],
            x: [0, 15, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          🦁
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-1/4 text-3xl opacity-30"
          animate={{ 
            x: [0, 20, 0],
            rotate: [0, -15, 15, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          🦀
        </motion.div>
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left z-10 relative"
          >
            <motion.h1
              className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="drop-shadow-lg">Learn,</span>
              <br />
              <span className="text-wiggle-yellow drop-shadow-lg">Play,</span>
              <br />
              <motion.span
                className="text-wiggle-pink drop-shadow-lg"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Wiggle!
              </motion.span>
            </motion.h1>
            
            <motion.p
              className="text-xl lg:text-2xl text-white/90 mb-8 font-medium drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              A fun, active adventure where kids move to learn
            </motion.p>
            
            <motion.button
              onClick={onPlayNow}
              className="bg-gradient-to-r from-wiggle-pink to-wiggle-purple text-white font-bold py-6 px-12 rounded-full text-2xl shadow-2xl relative overflow-hidden group"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Play Now! 🎮</span>
              <motion.div
                className="absolute -top-1 -right-1 w-6 h-6 bg-wiggle-yellow rounded-full"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>
          </motion.div>

          {/* Right Mascot */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="w-80 h-80 mx-auto"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Player
                src="/lottie/mascot.json"
                autoplay
                loop
                style={{ height: '100%', width: '100%' }}
              />
            </motion.div>
            
            {/* Floating sparkles around mascot */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              >
                ✨
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}