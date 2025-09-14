'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import Lottie Player to avoid SSR issues
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);
import { useState } from 'react';

export default function FinalCTA() {
  const [heroName, setHeroName] = useState('');

  return (
    <section className="py-20 bg-gradient-to-r from-wiggle-pink via-wiggle-purple to-wiggle-blue relative overflow-hidden">
      {/* Floating Balloons */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`balloon-${i}`}
          className="absolute text-4xl opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        >
          🎈
        </motion.div>
      ))}

      {/* Emoji Animals for better performance */}
      <motion.div
        className="absolute top-16 left-16 text-4xl opacity-30"
        animate={{ 
          y: [0, -25, 0],
          rotate: [0, 15, -15, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🎉
      </motion.div>

      <motion.div
        className="absolute top-20 right-20 text-5xl opacity-25"
        animate={{ 
          x: [0, 20, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        🦒
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-1/4 text-4xl opacity-35"
        animate={{ 
          x: [0, 20, 0],
          rotate: [0, 15, -15, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        🐕
      </motion.div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2
          className="text-5xl lg:text-7xl font-bold text-white mb-8 drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Join WiggleWorld Today! 🌟
        </motion.h2>
        
        <motion.p
          className="text-xl lg:text-2xl text-white/90 mb-12 font-medium drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
        >
          Start your child's learning adventure now!
        </motion.p>
        
        <motion.div
          className="max-w-md mx-auto mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <input
            type="text"
            value={heroName}
            onChange={(e) => setHeroName(e.target.value)}
            placeholder="Enter your hero name..."
            className="w-full p-4 text-xl font-bold text-gray-800 bg-white rounded-full shadow-lg border-4 border-wiggle-yellow focus:outline-none focus:border-wiggle-pink transition-colors text-center"
          />
        </motion.div>
        
        <motion.button
          className="bg-gradient-to-r from-wiggle-yellow to-wiggle-orange text-gray-800 font-bold py-6 px-12 rounded-full text-2xl shadow-2xl relative overflow-hidden group mb-12"
          whileHover={{ 
            scale: 1.05, 
            y: -5,
            boxShadow: "0 20px 40px rgba(255, 221, 61, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          animate={{ 
            boxShadow: [
              "0 10px 30px rgba(255, 221, 61, 0.3)",
              "0 15px 40px rgba(255, 221, 61, 0.5)",
              "0 10px 30px rgba(255, 221, 61, 0.3)"
            ]
          }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10">Start Adventure! 🚀</span>
        </motion.button>

        {/* Cheering Mascot */}
        <motion.div
          className="w-32 h-32 mx-auto"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2.5,
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
      </div>
    </section>
  );
}