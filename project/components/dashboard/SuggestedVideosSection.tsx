'use client';

import { motion } from 'framer-motion';
import { Play, Clock, Star, ArrowRight, Lightbulb } from 'lucide-react';
import { SuggestedVideo } from '@/types/dashboard';

interface SuggestedVideosSectionProps {
  videos: SuggestedVideo[];
}

const difficultyColors = {
  1: 'bg-green-100 text-green-700',
  2: 'bg-green-100 text-green-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-orange-100 text-orange-700',
  5: 'bg-red-100 text-red-700'
};

const difficultyLabels = {
  1: 'Beginner',
  2: 'Easy',
  3: 'Medium',
  4: 'Hard',
  5: 'Expert'
};

export default function SuggestedVideosSection({ videos }: SuggestedVideosSectionProps) {
  const handleVideoClick = (videoId: string) => {
    // In real implementation, this would navigate to the video or open a modal
    console.log('Playing video:', videoId);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg">
          <Play className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Suggested Videos</h2>
          <p className="text-gray-600 text-sm">Personalized content based on performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => handleVideoClick(video.id)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
              {/* Placeholder for video thumbnail */}
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
              
              {/* Duration badge */}
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{video.duration}m</span>
              </div>

              {/* Difficulty badge */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[video.difficulty as keyof typeof difficultyColors]}`}>
                {difficultyLabels[video.difficulty as keyof typeof difficultyLabels]}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                {video.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 overflow-hidden" style={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {video.description}
              </p>

              {/* Focus Areas */}
              <div className="flex flex-wrap gap-1 mb-3">
                {video.focusAreas.map((area, areaIndex) => (
                  <span
                    key={areaIndex}
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full capitalize"
                  >
                    {area}
                  </span>
                ))}
              </div>

              {/* Recommendation Reason */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 mb-3">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-800 text-xs">
                    {video.recommendationReason}
                  </p>
                </div>
              </div>

              {/* Category and Action */}
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {video.category}
                </span>
                <div className="flex items-center space-x-1 text-purple-600 text-sm font-medium group-hover:text-purple-700">
                  <span>Watch</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-pink-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Video Suggestions Yet</h3>
          <p className="text-gray-600 text-sm">
            Complete a few more sessions to get personalized video recommendations!
          </p>
        </div>
      )}
    </div>
  );
}