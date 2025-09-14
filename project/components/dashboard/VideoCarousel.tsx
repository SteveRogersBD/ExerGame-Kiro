'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import VideoCard from './VideoCard';
import { Video } from '@/types/dashboard';

interface VideoCarouselProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
}

export default function VideoCarousel({ videos, onVideoSelect }: VideoCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* Left scroll button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 text-2xl border-2 border-white/30 shadow-lg hover:bg-white/30 transition-colors"
        aria-label="Scroll left"
      >
        ⬅️
      </motion.button>

      {/* Right scroll button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 text-2xl border-2 border-white/30 shadow-lg hover:bg-white/30 transition-colors"
        aria-label="Scroll right"
      >
        ➡️
      </motion.button>

      {/* Horizontal scrolling container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-12 py-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            className="flex-shrink-0"
          >
            <VideoCard
              video={video}
              onClick={() => onVideoSelect(video)}
            />
          </motion.div>
        ))}
      </div>

      {/* Custom scrollbar indicator */}
      <div className="flex justify-center mt-4 gap-2">
        {videos.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-white/30"
          />
        ))}
      </div>
    </div>
  );
}