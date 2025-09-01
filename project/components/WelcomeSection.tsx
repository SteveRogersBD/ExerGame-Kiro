'use client';

import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';

export default function WelcomeSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-wiggle-mint/30 to-wiggle-peach/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Large Animation */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="w-64 h-64 lg:w-80 lg:h-80"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
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
          </motion.div>

          {/* Right: Welcome Message */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              Meet Your Learning Buddy! 🐕
            </motion.h2>
            
            <motion.p
              className="text-xl text-gray-700 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              Our friendly companion will guide your child through exciting adventures, 
              making learning feel like the most fun game ever!
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              {['Interactive Stories', 'Movement Games', 'Reward System'].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="bg-white/80 px-4 py-2 rounded-full shadow-md"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-gray-800 font-semibold">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}