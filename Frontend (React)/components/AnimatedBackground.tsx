'use client'

import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Large floating orbs */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-neonTeal/5 rounded-full blur-3xl"
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute top-40 right-20 w-80 h-80 bg-neonPink/5 rounded-full blur-3xl"
        animate={{ 
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
      
      <motion.div
        className="absolute bottom-40 left-20 w-72 h-72 bg-lime/5 rounded-full blur-3xl"
        animate={{ 
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 10 }}
      />

      {/* Medium floating shapes */}
      <motion.div
        className="absolute top-60 left-1/4 w-32 h-32 bg-lemon/10 rounded-full blur-2xl"
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute top-80 right-1/3 w-24 h-24 bg-neonTeal/10 rounded-full blur-2xl"
        animate={{ 
          y: [0, 25, 0],
          rotate: [0, -180, -360]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Small floating particles */}
      <motion.div
        className="absolute top-32 left-1/2 w-4 h-4 bg-neonPink/30 rounded-full"
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute top-48 right-1/4 w-3 h-3 bg-lime/40 rounded-full"
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.4, 1, 0.4]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <motion.div
        className="absolute top-96 left-1/3 w-2 h-2 bg-lemon/50 rounded-full"
        animate={{ 
          y: [0, -18, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/4 right-10 w-16 h-16 bg-neonTeal/20 rounded-lg blur-xl"
        animate={{ 
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-neonPink/20 rounded-lg blur-xl"
        animate={{ 
          rotate: [0, -90, -180, -270, -360],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 5 }}
      />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(110, 231, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(110, 231, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-neonTeal/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-neonPink/10 to-transparent" />
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-lime/10 to-transparent" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-lemon/10 to-transparent" />
    </div>
  )
}

