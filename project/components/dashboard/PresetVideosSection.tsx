'use client';

import { motion } from 'framer-motion';
import VideoCarousel from './VideoCarousel';
import { Video } from '@/types/dashboard';

interface PresetVideosSectionProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
}

export default function PresetVideosSection({ videos, onVideoSelect }: PresetVideosSectionProps) {
  return (
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="w-full max-w-6xl mx-auto px-4"
    >
      {/* Section Header with colorful emoji and text */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", bounce: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-3">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl md:text-6xl"
          >
            🎬
          </motion.span>
          <span className="bg-gradient-to-r from-wiggle-yellow via-wiggle-pink to-wiggle-purple bg-clip-text text-transparent">
            Preset
          </span>
        </h2>
        <p className="text-center text-white/80 text-lg mt-2 drop-shadow">
          Fun learning videos ready to play!
        </p>
      </motion.div>

      {/* Video Carousel */}
      <VideoCarousel videos={videos} onVideoSelect={onVideoSelect} />
    </motion.section>
  );
}