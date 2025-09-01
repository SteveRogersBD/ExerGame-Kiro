'use client'

import { motion } from 'framer-motion'
import LottieWrapper from './LottieWrapper'

const footerLinks = {
  company: [
    { name: 'About', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' }
  ],
  product: [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#' }
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Parent Zone', href: '#parent-zone' }
  ],
  legal: [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Safety', href: '#' }
  ]
}

export default function Footer() {
  return (
    <footer className="bg-background/50 border-t border-white/10 relative overflow-hidden">
      {/* Scattered Lottie Animations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left - Yay Jump */}
        <motion.div
          className="absolute top-8 left-20 w-16 h-16"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <LottieWrapper
            src="/lottie/Yay Jump.json"
            className="w-full h-full"
            loop
            autoplay
          />
        </motion.div>

        {/* Top right - Crab Walk */}
        <motion.div
          className="absolute top-12 right-24 w-14 h-14"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <LottieWrapper
            src="/lottie/crab walk.json"
            className="w-full h-full"
            loop
            autoplay
          />
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute bottom-10 left-10 w-32 h-32 bg-neonTeal/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-neonPink/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div>
            <h3 className="text-lg font-fredoka font-bold text-neonTeal mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-white/70 hover:text-neonTeal transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-fredoka font-bold text-lime mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-white/70 hover:text-lime transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-fredoka font-bold text-neonPink mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-white/70 hover:text-neonPink transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-fredoka font-bold text-lemon mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-white/70 hover:text-lemon transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo and copyright */}
            <motion.div 
              className="flex items-center mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <h2 className="text-2xl font-fredoka font-bold text-gradient neon-glow">
                WiggleWorld
              </h2>
            </motion.div>

            <div className="text-center md:text-right">
              <p className="text-white/50 text-sm mb-2">
                © 2025 WiggleWorld. All rights reserved.
              </p>
              <p className="text-white/40 text-xs">
                Making learning fun, one wiggle at a time! 🎉
              </p>
            </div>
          </div>

          {/* Social links */}
          <motion.div 
            className="flex justify-center mt-8 space-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-neonTeal hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-lg">📘</span>
            </motion.a>
            <motion.a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-lime hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-lg">📱</span>
            </motion.a>
            <motion.a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-neonPink hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-lg">📺</span>
            </motion.a>
            <motion.a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-lemon hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-lg">🎮</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
