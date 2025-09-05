'use client';

import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { Gamepad2, BookOpen, Users, Shield } from 'lucide-react';

const features = [
  {
    icon: <Gamepad2 size={48} />,
    emoji: '🎮',
    title: 'Gesture-based Play',
    description: 'Kids control games with natural movements',
    bgColor: 'bg-wiggle-green',
  },
  {
    icon: <BookOpen size={48} />,
    emoji: '📚',
    title: 'Learning Through Fun',
    description: 'Educational content disguised as play',
    bgColor: 'bg-wiggle-purple',
  },
  {
    icon: <Users size={48} />,
    emoji: '👨‍👩‍👧',
    title: 'Parent Custom Games',
    description: 'Create personalized learning experiences',
    bgColor: 'bg-wiggle-orange',
  },
  {
    icon: <Shield size={48} />,
    emoji: '🛡️',
    title: 'Safe & Secure',
    description: 'Kid-friendly environment with parental controls',
    bgColor: 'bg-wiggle-coral',
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-wiggle-lavender to-white relative overflow-hidden">
      {/* Large Feature Animations */}
      <motion.div
        className="absolute top-20 right-12 w-28 h-28 opacity-50 hidden lg:block"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 360]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Player
          src="/lottie/Yay Jump.json"
          autoplay
          loop
          style={{ height: '100%', width: '100%' }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-16 left-12 w-32 h-32 opacity-45 hidden lg:block"
        animate={{ 
          x: [0, 25, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <Player
          src="/lottie/Meditating Giraffe.json"
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
          Why Kids & Parents Love It
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`${feature.bgColor} text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group cursor-pointer`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1 
              }}
              viewport={{ once: true }}
            >
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative z-10 text-center">
                <motion.div
                  className="text-4xl mb-3"
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3
                  }}
                >
                  {feature.emoji}
                </motion.div>
                
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm font-medium opacity-90">{feature.description}</p>
              </div>
              
              <motion.div
                className="absolute bottom-2 right-2 opacity-20"
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {feature.icon}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}