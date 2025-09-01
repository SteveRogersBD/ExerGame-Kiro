'use client'

import { motion } from 'framer-motion'
import LottieWrapper from './LottieWrapper'

const steps = [
  {
    icon: '🎥',
    title: 'Watch & Listen',
    description: 'Cartoon asks a question',
    lottie: '/lottie/Happy Dog.json',
    color: 'neonTeal'
  },
  {
    icon: '🏃',
    title: 'Move & Wiggle',
    description: 'Kid answers by jumping/squatting/waving',
    lottie: '/lottie/Lion Running.json',
    color: 'lime'
  },
  {
    icon: '🎉',
    title: 'Learn & Win',
    description: 'Mascot cheers and rewards',
    lottie: '/lottie/Yay Jump.json',
    color: 'neonPink'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Scattered Lottie Animations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left - Happy Dog */}
        <motion.div
          className="absolute top-10 left-8 w-20 h-20"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
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
          className="absolute top-20 right-12 w-16 h-16"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <LottieWrapper
            src="/lottie/Lion Running.json"
            className="w-full h-full"
            loop
            autoplay
          />
        </motion.div>

        {/* Bottom left - Yay Jump */}
        <motion.div
          className="absolute bottom-10 left-16 w-18 h-18"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <LottieWrapper
            src="/lottie/Yay Jump.json"
            className="w-full h-full"
            loop
            autoplay
          />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-fredoka font-bold mb-6">
            How <span className="text-gradient neon-glow">WiggleWorld</span> Works
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Three simple steps to make learning fun and active for your little ones!
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5
              }}
            >
              {/* Card */}
              <div className={`relative p-8 rounded-2xl bg-gradient-to-br from-${step.color}/10 to-${step.color}/5 border border-${step.color}/30 backdrop-blur-sm group-hover:border-${step.color}/60 transition-all duration-300`}>
                {/* Background glow */}
                <div className={`absolute inset-0 bg-${step.color}/5 rounded-2xl blur-xl group-hover:bg-${step.color}/10 transition-all duration-300`} />
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  
                                     {/* Icon Placeholder */}
                   <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center border border-white/20">
                     <div className="text-4xl">{step.icon}</div>
                   </div>
                  
                  {/* Title */}
                  <h3 className={`text-2xl font-fredoka font-bold mb-3 text-${step.color}`}>
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/80 text-lg">
                    {step.description}
                  </p>
                </div>

                {/* Step number */}
                <div className={`absolute -top-4 -right-4 w-8 h-8 bg-${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {index + 1}
                </div>
              </div>

              {/* Connecting line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-neonTeal to-lime transform -translate-y-1/2">
                  <motion.div
                    className="h-full bg-neonTeal"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-xl text-white/70 mb-6">
            Ready to start the adventure?
          </p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-neonTeal to-neonPink text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-neonTeal/50 transition-all duration-300"
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today!
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
