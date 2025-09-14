'use client';

import React, { useState } from 'react';
import CompletionScreen from './CompletionScreen';
import { Badge } from '@/types/dashboard';

const CompletionScreenExample: React.FC = () => {
  const [showCompletion, setShowCompletion] = useState(false);

  const exampleBadge: Badge = {
    id: 'example-badge',
    name: 'Video Master',
    icon: '🎬',
    category: 'video',
    earnedAt: new Date()
  };

  const handleShowCompletion = () => {
    setShowCompletion(true);
  };

  const handleBackToDashboard = () => {
    setShowCompletion(false);
    console.log('Returning to dashboard...');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {!showCompletion ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            CompletionScreen Demo
          </h1>
          <button
            onClick={handleShowCompletion}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl"
          >
            Show Completion Screen
          </button>
        </div>
      ) : (
        <CompletionScreen
          score={8}
          totalQuestions={10}
          earnedBadge={exampleBadge}
          onBackToDashboard={handleBackToDashboard}
          isVisible={showCompletion}
        />
      )}
    </div>
  );
};

export default CompletionScreenExample;