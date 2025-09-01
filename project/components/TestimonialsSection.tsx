'use client';

import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';

const testimonials = [
  {
    text: "My son loves WiggleWorld! He doesn't even realize he's learning.",
    author: "Sarah M.",
    avatar: "👩",
    bgColor: "bg-wiggle-mint"
  },
  {
    text: "Finally, fun and learning together. Best investment for our family!",
    author: "Mike D.",
    avatar: "👨",
    bgColor: "bg-wiggle-peach"
  },
  {
    text: "The movement-based learning is genius. My daughter is more active than ever!",
    author: "Lisa K.",
    avatar: "👩‍🦱",
    bgColor: "bg-wiggle-lavender"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-wiggle-blue/20 to-wiggle-mint/20 relative overflow-hidden">
      {/* Large Side Animations - Full Opacity */}
      <motion.div
        className="absolute left-8 top-1/4 w-44 h-44 hidden lg:block"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Player
          src="/lottie/Giraffe neck growing.json"
          autoplay
          loop
          style={{ height: '100%', width: '100%' }}
        />
      </motion.div>

      <motion.div
        className="absolute right-8 top-1/3 w-48 h-48 hidden lg:block"
        animate={{
          rotate: [0, 360],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Player
          src="/lottie/crab walk.json"
          autoplay
          loop
          style={{ height: '100%', width: '100%' }}
        />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        {/* Demo Video Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-wiggle-purple to-wiggle-pink p-8 rounded-3xl shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
            <motion.div
              className="w-full h-64 bg-white/20 rounded-2xl flex items-center justify-center relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-3xl">▶️</span>
              </motion.div>

              <div className="absolute top-4 right-4 text-4xl">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🎉
                </motion.div>
              </div>
            </motion.div>
            <p className="text-white font-bold text-center mt-4 text-lg">Watch Kids in Action! 🎬</p>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.h3
            className="text-4xl lg:text-5xl font-bold text-gray-800 mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            Happy Families Say... 💬
          </motion.h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className={`${testimonial.bgColor} p-6 rounded-2xl shadow-lg relative`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15
                }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="text-3xl bg-white/20 p-2 rounded-full"
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium mb-2 text-lg">"{testimonial.text}"</p>
                    <p className="text-gray-600 font-bold">- {testimonial.author}</p>
                  </div>
                </div>

                <motion.div
                  className="absolute top-2 right-2 text-xl opacity-30"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 15, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.8
                  }}
                >
                  💖
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}