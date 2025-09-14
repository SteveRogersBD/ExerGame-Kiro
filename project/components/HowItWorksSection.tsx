'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import Lottie Player to avoid SSR issues
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);
import { Eye, Activity, Trophy } from 'lucide-react';

const steps = [
  {
    icon: <Eye size={48} />,
    emoji: '🎥',
    title: 'Watch & Listen',
    description: 'Cartoon characters ask fun questions',
    bgColor: 'bg-wiggle-blue',
    textColor: 'text-white'
  },
  {
    icon: <Activity size={48} />,
    emoji: '🏃',
    title: 'Move & Wiggle',
    description: 'Kids answer by jumping and moving',
    bgColor: 'bg-wiggle-pink',
    textColor: 'text-white'
  },
  {
    icon: <Trophy size={48} />,
    emoji: '🎉',
    title: 'Learn & Win',
    description: 'Celebrate success with confetti',
    bgColor: 'bg-wiggle-yellow',
    textColor: 'text-gray-800'
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-wiggle-lavender relative overflow-hidden">
      {/* Single Right Side Animation - Full Opacity */}
      <motion.div
        className="absolute right-8 top-1/2 transform -translate-y-1/2 w-40 h-40 hidden lg:block"
        animate={{ 
          y: [0, -25, 0],
          x: [0, 15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Player
          src="/lottie/Lion Running.json"
          autoplay
          loop
          style={{ height: '100%', width: '100%' }}
        />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-5xl lg:text-6xl font-bold text-center text-gray-800 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          How WiggleWorld Works
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`${step.bgColor} ${step.textColor} p-8 rounded-3xl shadow-xl relative overflow-hidden group cursor-pointer`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                scale: 1.05,
                rotate: [0, -2, 2, 0],
                transition: { 
                  rotate: { duration: 0.3 },
                  scale: { duration: 0.2 }
                }
              }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2 
              }}
              viewport={{ once: true }}
            >
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative z-10 text-center">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                >
                  {step.emoji}
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-lg font-medium opacity-90">{step.description}</p>
              </div>
              
              <motion.div
                className="absolute bottom-4 right-4 opacity-20"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.7
                }}
              >
                {step.icon}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}