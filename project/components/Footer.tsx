'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  const links = ['About', 'Privacy', 'Contact', 'Parent Zone'];

  return (
    <footer className="relative">
      {/* Hill-shaped background */}
      <div className="bg-gradient-to-r from-wiggle-mint to-wiggle-peach">
        <div className="w-full h-20 bg-white" style={{
          clipPath: 'ellipse(100% 100% at 50% 0%)'
        }}></div>
        
        <div className="container mx-auto px-4 py-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h3
              className="text-3xl font-bold text-gray-800 mb-8"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              WiggleWorld 🌈
            </motion.h3>
            
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {links.map((link, index) => (
                <motion.a
                  key={link}
                  href={link === 'Parent Zone' ? '/parent/auth' : '#'}
                  className="text-gray-700 hover:text-wiggle-purple font-semibold text-lg transition-colors relative"
                  whileHover={{ scale: 1.1, y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {link}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-wiggle-purple"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>
            
            <motion.p
              className="text-gray-600 font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              © 2025 WiggleWorld - Making Learning Fun! ✨
            </motion.p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}