'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-wiggle-yellow/95 backdrop-blur-sm shadow-xl' 
          : 'bg-wiggle-yellow'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-10 h-10"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Player
                src="/lottie/Happy Dog.json"
                autoplay
                loop
                style={{ height: '100%', width: '100%' }}
              />
            </motion.div>
            <span className="text-3xl font-bold bg-gradient-to-r from-wiggle-pink to-wiggle-purple bg-clip-text text-transparent">
              WiggleWorld
            </span>
          </motion.div>
          
          <nav className="hidden md:flex space-x-8">
            {['How It Works', 'Features', 'Parent Zone'].map((item, index) => (
              <motion.a
                key={item}
                href={item === 'Parent Zone' ? '/parent/auth' : '#'}
                className="text-gray-700 hover:text-wiggle-purple font-semibold transition-colors relative"
                whileHover={{ scale: 1.1, y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-wiggle-purple"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </nav>

          <motion.button
            className="md:hidden text-gray-700 hover:text-wiggle-purple"
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-6 h-6 flex flex-col justify-between">
              <span className="h-0.5 bg-current rounded"></span>
              <span className="h-0.5 bg-current rounded"></span>
              <span className="h-0.5 bg-current rounded"></span>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}