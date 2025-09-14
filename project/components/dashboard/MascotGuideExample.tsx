'use client';

import { useState } from 'react';
import MascotGuide from './MascotGuide';

/**
 * Example component demonstrating various uses of MascotGuide
 * This shows how to integrate contextual mascot guidance throughout the dashboard
 */
const MascotGuideExample = () => {
  const [currentGuide, setCurrentGuide] = useState<string | null>(null);

  const guides = {
    welcome: {
      message: "Welcome to your playground! Tap anywhere to explore!",
      mascot: '/images/mascots/happy_tiger.png',
      position: 'center' as const,
    },
    videoStart: {
      message: "Tap here to start your video adventure!",
      mascot: '/images/mascots/smilling_mascot.png',
      position: 'corner' as const,
    },
    homeworkReady: {
      message: "Great job! You're ready for today's homework mission!",
      mascot: '/images/mascots/happy_tiger.png',
      position: 'corner' as const,
    },
    completion: {
      message: "Amazing work! You earned a new badge!",
      mascot: '/images/mascots/happy_tiger.png',
      position: 'center' as const,
    },
    help: {
      message: "Need help? I'm here to guide you through everything!",
      mascot: '/images/mascots/confused_tiger.png',
      position: 'corner' as const,
    },
    error: {
      message: "Oops! Something went wrong. Let's try again together!",
      mascot: '/images/mascots/sad_tiger.png',
      position: 'center' as const,
    },
  };

  const showGuide = (guideType: keyof typeof guides) => {
    setCurrentGuide(guideType);
  };

  const hideGuide = () => {
    setCurrentGuide(null);
  };

  const currentGuideData = currentGuide ? guides[currentGuide as keyof typeof guides] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          MascotGuide Examples
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(guides).map(([key, guide]) => (
            <button
              key={key}
              onClick={() => showGuide(key as keyof typeof guides)}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white font-bold hover:bg-white/30 transition-colors duration-200"
            >
              Show {key.charAt(0).toUpperCase() + key.slice(1)} Guide
            </button>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">Usage Examples:</h2>
          <ul className="space-y-2 text-lg">
            <li><strong>Welcome:</strong> First-time user onboarding</li>
            <li><strong>Video Start:</strong> Encouraging video interaction</li>
            <li><strong>Homework Ready:</strong> Positive reinforcement for homework</li>
            <li><strong>Completion:</strong> Celebrating achievements</li>
            <li><strong>Help:</strong> Providing assistance and guidance</li>
            <li><strong>Error:</strong> Friendly error handling</li>
          </ul>
        </div>

        {/* Context-aware guide examples */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">Context-Aware Integration:</h2>
          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold mb-2">Dashboard Entry:</h3>
              <code className="text-sm">
                {`<MascotGuide 
  message="Welcome back! Ready for more adventures?" 
  isVisible={isFirstVisit}
  position="center"
  autoHideDelay={3000}
/>`}
              </code>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold mb-2">Video Hover:</h3>
              <code className="text-sm">
                {`<MascotGuide 
  message="This looks fun! Tap to watch!" 
  isVisible={hoveredVideo !== null}
  position="corner"
  mascotImage="/images/mascots/smilling_mascot.png"
/>`}
              </code>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold mb-2">Achievement Unlock:</h3>
              <code className="text-sm">
                {`<MascotGuide 
  message="Wow! You unlocked the Math Master badge!" 
  isVisible={newBadgeEarned}
  position="center"
  autoHide={false}
  onDismiss={() => setNewBadgeEarned(false)}
/>`}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Active MascotGuide */}
      {currentGuideData && (
        <MascotGuide
          message={currentGuideData.message}
          mascotImage={currentGuideData.mascot}
          position={currentGuideData.position}
          isVisible={true}
          onDismiss={hideGuide}
          autoHideDelay={5000}
        />
      )}
    </div>
  );
};

export default MascotGuideExample;