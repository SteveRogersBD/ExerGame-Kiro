'use client'

import { motion } from 'framer-motion'
import LottieWrapper from './LottieWrapper'

interface HeroProps {
  onPlayNow: () => void
}

export default function Hero({ onPlayNow }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-neonPink/20 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-neonTeal/20 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-24 h-24 bg-lime/20 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Scattered Lottie Animations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left - Happy Dog */}
        <motion.div
          className="absolute top-32 left-8 w-24 h-24"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <LottieWrapper
            src="/lottie/Happy Dog.json"
            className="w-full h-full"
            loop
            autoplay
          />
        </motion.div>

        {/* Top right - Lion Running */}
        <motion.div
          className="absolute top-16 right-16 w-20 h-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <LottieWrapper
            src="/lottie/Lion Running.json"
            className="w-full h-full"
            loop
            autoplay
          />
        </motion.div>

        {/* Middle left - Crab Walk */}
        <motion.div
          className="absolute top-1/2 left-4 w-16 h-16"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <LottieWrapper
            src="/lottie/crab walk.json"
            className="w-full h-full"
            loop
            autoplay
          />
        </motion.div>

        {/* Middle right - Meditating Giraffe */}
        <motion.div
          className="absolute top-1/3 right-8 w-20 h-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <LottieWrapper
            src="/lottie/Meditating Giraffe.json"
            className="w-full h-full"
            loop
            autoplay
          />
        </motion.div>

        {/* Bottom left - Giraffe neck growing */}
        <motion.div
          className="absolute bottom-32 left-12 w-18 h-18"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.7 }}
        >
          <LottieWrapper
            src="/lottie/Giraffe neck growing.json"
            className="w-full h-full"
            loop
            autoplay
          />
        </motion.div>

        {/* Bottom right - Yay Jump */}
        <motion.div
          className="absolute bottom-20 right-12 w-16 h-16"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2.0 }}
        >
          <LottieWrapper
            src="/lottie/Yay Jump.json"
            className="w-full h-full"
            loop
            autoplay
          />
        </motion.div>

        {/* Center right - Mascot */}
        <motion.div
          className="absolute top-1/2 right-8 w-32 h-32 lg:w-40 lg:h-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2.3 }}
        >
          <LottieWrapper
            src="/lottie/mascot.json"
            className="w-full h-full"
            loop
            autoplay
          />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left side - Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-fredoka font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gradient neon-glow">Learn,</span>
            <br />
            <span className="text-white">Play,</span>
            <br />
            <span className="text-neonTeal neon-glow">Wiggle!</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The fun way for kids to stay active while learning.
          </motion.p>
          
          <motion.button
            onClick={onPlayNow}
            className="group relative px-8 py-4 bg-gradient-to-r from-neonTeal to-neonPink text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-neonTeal/50 transition-all duration-300 transform hover:scale-105 hover:-rotate-1"
            whileHover={{ 
              scale: 1.05,
              rotate: -2,
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="relative z-10">Play Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-neonTeal to-neonPink rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </motion.div>

        {/* Right side - Content placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative">
            <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-neonTeal/20 to-neonPink/20 rounded-full flex items-center justify-center border border-neonTeal/30">
              <div className="text-center">
                <div className="text-8xl mb-4">🎮</div>
                <h3 className="text-2xl font-fredoka font-bold text-white">
                  Ready to Wiggle?
                </h3>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-neonTeal rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-neonTeal rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
