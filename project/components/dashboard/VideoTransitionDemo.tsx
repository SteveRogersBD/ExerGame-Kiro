'use client';

import { useState } from 'react';
import VideoTransition from './VideoTransition';

export default function VideoTransitionDemo() {
  const [showTransition, setShowTransition] = useState(false);

  const handleStart = () => {
    setShowTransition(true);
  };

  const handleComplete = () => {
    setShowTransition(false);
    alert('Video transition completed! This is where the video player would start.');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Video Transition Demo</h1>
        <button
          onClick={handleStart}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={showTransition}
        >
          {showTransition ? 'Transition Running...' : 'Start Video Transition'}
        </button>
      </div>

      <VideoTransition
        isVisible={showTransition}
        videoTitle="Amazing Adventure Video"
        onTransitionComplete={handleComplete}
      />
    </div>
  );
}