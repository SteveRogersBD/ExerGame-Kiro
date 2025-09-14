'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface HelpPageProps {
  onBackToDashboard?: () => void;
}

export default function HelpPage({ onBackToDashboard }: HelpPageProps) {
  const helpItems = [
    {
      id: 'videos',
      title: 'How to Watch Videos',
      description: 'Tap on any video card to start watching! I\'ll guide you through each step.',
      speechBubble: 'Tap here to start!',
      icon: '🎬',
      mascot: '/images/mascots/happy_tiger.png'
    },
    {
      id: 'homework',
      title: 'Doing Your Homework',
      description: 'Look for the 📚 Homework section and tap on your assignments to start your mission!',
      speechBubble: 'Let\'s do homework together!',
      icon: '📚',
      mascot: '/images/mascots/smilling_mascot.png'
    },
    {
      id: 'badges',
      title: 'Earning Badges',
      description: 'Complete videos and homework to earn cool badges and stickers! Collect them all!',
      speechBubble: 'Great job! You finished your video!',
      icon: '🎖️',
      mascot: '/images/mascots/happy_tiger.png'
    },
    {
      id: 'navigation',
      title: 'Getting Around',
      description: 'Use the big buttons at the bottom: 🏠 for home, 🎖️ for badges, and ❓ for help!',
      speechBubble: 'These buttons will help you explore!',
      icon: '🏠',
      mascot: '/images/animals/bear.png'
    },
    {
      id: 'confused',
      title: 'Feeling Confused?',
      description: 'It\'s okay! Ask a grown-up for help, or just explore and have fun learning!',
      speechBubble: 'Don\'t worry, you\'re doing great!',
      icon: '🤔',
      mascot: '/images/mascots/confused_tiger.png'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      {/* Page Header */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-4">
          ❓ Need Help? We're Here! ❓
        </h1>
        <p className="text-2xl text-white/90 drop-shadow">
          Let our friendly mascots show you around!
        </p>
      </motion.div>

      {/* Help Items */}
      <div className="space-y-6">
        {helpItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              delay: index * 0.2, 
              type: "spring", 
              bounce: 0.4 
            }}
            className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border-3 border-white/30 relative"
          >
            <div className="flex items-center gap-6">
              {/* Mascot Image with Speech Bubble */}
              <div className="flex-shrink-0 relative">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-24 h-24 relative"
                >
                  <Image
                    src={item.mascot}
                    alt={`${item.title} mascot`}
                    fill
                    className="object-contain"
                  />
                </motion.div>
                
                {/* Speech Bubble */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                  className="absolute -top-2 -right-4 bg-white rounded-2xl px-3 py-2 shadow-lg border-2 border-wiggle-blue max-w-32"
                >
                  <p className="text-xs font-bold text-gray-800 text-center">
                    {item.speechBubble}
                  </p>
                  {/* Speech bubble tail */}
                  <div className="absolute bottom-0 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white transform translate-y-full"></div>
                </motion.div>
              </div>

              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-wiggle-yellow/90 rounded-full flex items-center justify-center border-3 border-wiggle-yellow">
                  <span className="text-3xl" role="img" aria-hidden="true">
                    {item.icon}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-lg text-white/90">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Back to Dashboard Button */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center mt-8"
      >
        <motion.button
          onClick={onBackToDashboard}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-wiggle-green hover:bg-wiggle-green/90 text-white font-bold text-2xl px-8 py-4 rounded-3xl border-3 border-white shadow-lg transition-colors"
        >
          🏠 Back to Dashboard
        </motion.button>
      </motion.div>

      {/* Encouragement Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-center mt-8"
      >
        <div className="bg-wiggle-pink/90 rounded-3xl p-8 border-3 border-wiggle-pink relative">
          {/* Mascot with encouragement */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-20 h-20 relative"
            >
              <Image
                src="/images/mascots/happy_tiger.png"
                alt="Happy mascot"
                fill
                className="object-contain"
              />
            </motion.div>
            <div className="text-6xl">🤗</div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-xl text-white/90 mb-6">
            Ask a grown-up to help you, or just explore and have fun!
          </p>
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="text-4xl"
          >
            🌟 You're doing great! 🌟
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}