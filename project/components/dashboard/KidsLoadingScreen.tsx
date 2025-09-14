'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface KidsLoadingScreenProps {
  message?: string;
  type?: 'dashboard' | 'video' | 'homework' | 'general';
  showBouncingAnimals?: boolean;
  showStarBurst?: boolean;
  showEncouragingMessages?: boolean;
}

function KidsLoadingScreen({
  message,
  type = 'general',
  showBouncingAnimals = true,
  showStarBurst = true,
  showEncouragingMessages = true
}: KidsLoadingScreenProps) {
  const getLoadingConfig = () => {
    switch (type) {
      case 'dashboard':
        return {
          mascot: '/images/mascots/smilling_mascot.png',
          title: 'Getting Your Playground Ready! 🎮',
          message: message || "We're setting up all your fun activities!",
          backgroundColor: 'bg-gradient-to-br from-wiggle-blue via-wiggle-purple to-wiggle-pink',
          encouragingMessages: [
            "Almost ready for fun! 🎉",
            "Loading your adventures! 🚀",
            "Preparing something awesome! ✨"
          ]
        };
      case 'video':
        return {
          mascot: '/images/mascots/happy_tiger.png',
          title: 'Starting Your Video! 🎬',
          message: message || "Get ready for an amazing adventure!",
          backgroundColor: 'bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200',
          encouragingMessages: [
            "The video is almost ready! 🎥",
            "Get ready to have fun! 🎊",
            "Something exciting is coming! 🌟"
          ]
        };
      case 'homework':
        return {
          mascot: '/images/mascots/smilling_mascot.png',
          title: 'Preparing Your Mission! 📚',
          message: message || "Let's get ready for your learning adventure!",
          backgroundColor: 'bg-gradient-to-br from-green-200 via-blue-200 to-purple-200',
          encouragingMessages: [
            "Your mission is loading! 🎯",
            "Learning can be fun! 📖",
            "You're going to do great! 💪"
          ]
        };
      default:
        return {
          mascot: '/images/mascots/smilling_mascot.png',
          title: 'Loading Something Fun! 🎈',
          message: message || "Just a moment while we get things ready!",
          backgroundColor: 'bg-gradient-to-br from-wiggle-blue via-wiggle-purple to-wiggle-pink',
          encouragingMessages: [
            "Almost there! 🎯",
            "Getting ready for you! 🎪",
            "Something fun is coming! 🎨"
          ]
        };
    }
  };

  const config = getLoadingConfig();
  const animals = [
    { emoji: '🐻', name: 'bear' },
    { emoji: '🐧', name: 'penguin' },
    { emoji: '🐵', name: 'monkey' },
    { emoji: '🦅', name: 'eagle' }
  ];

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-6 ${config.backgroundColor}`}>
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Sparkles */}
        {[...Array(15)].map((_, index) => (
          <motion.div
            key={`sparkle-${index}`}
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
              opacity: 0
            }}
            animate={{
              y: -100,
              opacity: [0, 1, 0],
              rotate: [0, 360],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className="absolute text-lg"
          >
            ✨
          </motion.div>
        ))}

        {/* Floating Rainbow Bubbles */}
        {[...Array(10)].map((_, index) => (
          <motion.div
            key={`bubble-${index}`}
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
              opacity: 0
            }}
            animate={{
              y: -100,
              opacity: [0, 0.8, 0],
              scale: [0.3, 1.5, 0.3]
            }}
            transition={{
              duration: 6 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "linear"
            }}
            className="absolute w-6 h-6 rounded-full"
            style={{
              background: `hsl(${Math.random() * 360}, 70%, 80%)`
            }}
          />
        ))}
      </div>

      {/* Main Loading Content */}
      <motion.div
        initial={{ scale: 0, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
        className="text-center z-10"
      >
        {/* Happy Mascot */}
        <motion.div
          animate={{ 
            y: [-8, 8, -8],
            rotate: [-3, 3, -3]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
            <Image
              src={config.mascot}
              alt="Happy Loading Mascot"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Loading Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-4"
        >
          {config.title}
        </motion.h1>

        {/* Loading Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-2xl text-white/90 drop-shadow mb-8 max-w-md mx-auto leading-relaxed"
        >
          {config.message}
        </motion.p>

        {/* Bouncing Animals */}
        {showBouncingAnimals && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center space-x-6 mb-8"
          >
            {animals.map((animal, index) => (
              <motion.div
                key={`animal-${index}`}
                animate={{
                  y: [-15, 0, -15],
                  rotate: [-5, 5, -5],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
                className="text-4xl md:text-5xl"
              >
                {animal.emoji}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Star Burst Loading Animation */}
        {showStarBurst && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-8"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <motion.div
                key={`star-${index}`}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [0, 1.2, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `rotate(${index * 45}deg)`
                }}
              >
                <div className="text-2xl md:text-3xl">⭐</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Encouraging Messages */}
        {showEncouragingMessages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="space-y-4"
          >
            {config.encouragingMessages.map((msg, index) => (
              <motion.p
                key={`message-${index}`}
                animate={{ 
                  opacity: [0.6, 1, 0.6],
                  scale: [0.95, 1, 0.95],
                  y: [0, -2, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: index * 0.7,
                  ease: "easeInOut"
                }}
                className="text-lg md:text-xl text-white font-bold drop-shadow"
              >
                {msg}
              </motion.p>
            ))}
          </motion.div>
        )}

        {/* Loading Progress Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex justify-center space-x-2 mt-8"
        >
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={`dot-${index}`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-lg"
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom Encouraging Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center"
      >
        <motion.p
          animate={{ 
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-lg md:text-xl text-white font-bold drop-shadow"
        >
          You're going to have so much fun! 🎉
        </motion.p>
      </motion.div>
    </div>
  );
}

// Specific loading screen components for different scenarios
export function DashboardLoadingScreen({ message }: { message?: string }) {
  return (
    <KidsLoadingScreen
      type="dashboard"
      message={message}
    />
  );
}

export function VideoLoadingScreen({ message }: { message?: string }) {
  return (
    <KidsLoadingScreen
      type="video"
      message={message}
    />
  );
}

export function HomeworkLoadingScreen({ message }: { message?: string }) {
  return (
    <KidsLoadingScreen
      type="homework"
      message={message}
    />
  );
}

// Export the main component as default and named export
export default KidsLoadingScreen;
export { KidsLoadingScreen };