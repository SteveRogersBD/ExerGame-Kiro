'use client';

import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import { PLACEHOLDER_VIDEOS } from '@/types/dashboard';

/**
 * Example component showing how to integrate VideoPlayer with the kids dashboard
 * This demonstrates the complete video flow from selection to completion
 */
export default function VideoPlayerExample() {
  const [currentVideo, setCurrentVideo] = useState<typeof PLACEHOLDER_VIDEOS[0] | null>(null);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);

  const handleVideoSelect = (video: typeof PLACEHOLDER_VIDEOS[0]) => {
    setCurrentVideo(video);
    setIsVideoPlayerOpen(true);
  };

  const handleVideoComplete = (score: number) => {
    console.log(`Video completed with score: ${score}`);
    // Here you would typically:
    // 1. Save the completion to the backend
    // 2. Award badges/rewards
    // 3. Update user progress
    // 4. Show completion screen
    setIsVideoPlayerOpen(false);
    setCurrentVideo(null);
  };

  const handleVideoQuit = () => {
    console.log('Video quit by user');
    setIsVideoPlayerOpen(false);
    setCurrentVideo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          🎬 Video Player Demo
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLACEHOLDER_VIDEOS.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => handleVideoSelect(video)}
            >
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🎥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {video.title}
              </h3>
              <p className="text-gray-600 mb-4">
                Duration: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {video.quizQuestions.length} quiz questions
                </span>
                <span className="text-2xl">{video.completionReward.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-white text-lg">
            Click on any video card above to start the full-screen video player experience!
          </p>
        </div>
      </div>

      {/* Video Player */}
      {isVideoPlayerOpen && currentVideo && (
        <VideoPlayer
          video={currentVideo}
          onComplete={handleVideoComplete}
          onQuit={handleVideoQuit}
        />
      )}
    </div>
  );
}