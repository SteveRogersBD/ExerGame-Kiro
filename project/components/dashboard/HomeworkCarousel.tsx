'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import HomeworkCard from './HomeworkCard';
import { HomeworkItem } from '@/types/dashboard';

interface HomeworkCarouselProps {
  homework: HomeworkItem[];
  onHomeworkSelect: (homework: HomeworkItem) => void;
}

export default function HomeworkCarousel({ homework, onHomeworkSelect }: HomeworkCarouselProps) {
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

  // Show message if no homework
  if (homework.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-8xl mb-4"
        >
          🎉
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2 text-center">
          All Done!
        </h3>
        <p className="text-lg text-white/80 text-center">
          No homework right now. Great job! 🌟
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left scroll button - only show if there are multiple items */}
      {homework.length > 1 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 text-2xl border-2 border-white/30 shadow-lg hover:bg-white/30 transition-colors"
          aria-label="Scroll left"
        >
          ⬅️
        </motion.button>
      )}

      {/* Right scroll button - only show if there are multiple items */}
      {homework.length > 1 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 text-2xl border-2 border-white/30 shadow-lg hover:bg-white/30 transition-colors"
          aria-label="Scroll right"
        >
          ➡️
        </motion.button>
      )}

      {/* Horizontal scrolling container */}
      <div
        ref={scrollContainerRef}
        className={`flex gap-6 overflow-x-auto scrollbar-hide py-4 ${
          homework.length > 1 ? 'px-12' : 'justify-center'
        }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {homework.map((homeworkItem, index) => (
          <motion.div
            key={homeworkItem.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            className="flex-shrink-0"
          >
            <HomeworkCard
              homework={homeworkItem}
              onClick={() => onHomeworkSelect(homeworkItem)}
            />
          </motion.div>
        ))}
      </div>

      {/* Custom scrollbar indicator - only show if there are multiple items */}
      {homework.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {homework.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-white/30"
            />
          ))}
        </div>
      )}
    </div>
  );
}