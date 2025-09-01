'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import LottieWrapper from './LottieWrapper'

interface FinalCTAProps {
  onJoinNow: () => void
}

export default function FinalCTA({ onJoinNow }: FinalCTAProps) {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setIsSubmitted(true)
      // Here you would typically send the email to your backend
      setTimeout(() => setIsSubmitted(false), 3000)
      setEmail('')
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Scattered Lottie Animations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left - Meditating Giraffe */}
        <motion.div
          className="absolute top-16 left-20 w-18 h-18"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <LottieWrapper
            src="/lottie/Meditating Giraffe.json"
            className="w-full h-full"
            loop
            autoplay
          />
        </motion.div>

        {/* Top right - Giraffe neck growing */}
        <motion.div
          className="absolute top-24 right-24 w-16 h-16"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <LottieWrapper
            src="/lottie/Giraffe neck growing.json"
            className="w-full h-full"
            loop
            autoplay
          />
        </motion.div>

        {/* Bottom left - Happy Dog */}
        <motion.div
          className="absolute bottom-24 left-16 w-20 h-20"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <LottieWrapper
            src="/lottie/Happy Dog.json"
            className="w-full h-full"
            loop
            autoplay
          />
        </motion.div>
      </div>

      {/* Floating balloons background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-16 h-20 bg-neonPink/30 rounded-full"
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-12 h-16 bg-neonTeal/30 rounded-full"
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, -3, 3, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-14 h-18 bg-lime/30 rounded-full"
          animate={{ 
            y: [0, -35, 0],
            rotate: [0, 4, -4, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 4 }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-10 h-14 bg-lemon/30 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, -2, 2, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-fredoka font-bold mb-6">
            Join <span className="text-gradient neon-glow">WiggleWorld</span> Today!
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-8">
            Start your child's learning adventure with fun, movement, and discovery
          </p>
        </motion.div>

        {/* Email Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your hero name..."
                className="w-full px-6 py-4 bg-white/10 border-2 border-neonTeal/30 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-neonTeal focus:bg-white/15 transition-all duration-300 text-center text-lg"
                required
              />
              <motion.button
                type="submit"
                className="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-neonTeal to-neonPink text-white font-bold rounded-full shadow-lg hover:shadow-neonTeal/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join!
              </motion.button>
            </div>
          </form>

          {/* Success message */}
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 text-lime font-medium"
            >
              🎉 Welcome to WiggleWorld! Check your email for next steps.
            </motion.div>
          )}
        </motion.div>

        {/* Additional CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={onJoinNow}
            className="px-8 py-4 bg-gradient-to-r from-neonTeal to-neonPink text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-neonTeal/50 transition-all duration-300"
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Playing Now
          </motion.button>
          
          <motion.button
            className="px-8 py-4 border-2 border-neonTeal text-neonTeal font-bold text-lg rounded-full hover:bg-neonTeal hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/60"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <span>Safe & Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span>No Ads</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span>Age-Appropriate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📱</span>
            <span>Works Everywhere</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
