'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Video } from '@/types/dashboard';
import { useInteractiveAnimations } from '@/hooks/useInteractiveAnimations';
import { useRippleEffect } from '@/hooks/useRippleEffect';
import { useAccessibility, useScreenReaderAnnouncements } from '@/hooks/useAccessibility';
import { RippleEffect } from '@/components/ui/VisualFeedback';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { buttonVariants, playSound, triggerHaptic } = useInteractiveAnimations();
  const { ripples, createRipple, removeRipple } = useRippleEffect();
  const [accessibilityState, { createChildFriendlyLabel, generateAriaId }] = useAccessibility();
  const { announceAction } = useScreenReaderAnnouncements();
  
  const cardId = useRef(generateAriaId('video-card')).current;
  const descriptionId = useRef(generateAriaId('video-description')).current;

  // Format duration from seconds to minutes:seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCardClick = (event: React.MouseEvent) => {
    // Create ripple effect (respecting reduced motion)
    if (!accessibilityState.isReducedMotion) {
      createRipple(event, 'rgba(255, 109, 213, 0.6)');
    }
    
    // Play sound and haptic feedback
    if (!accessibilityState.isReducedMotion) {
      playSound('whoosh');
    }
    triggerHaptic('medium');
    
    // Announce action to screen reader
    announceAction(`Starting video: ${video.title}`);
    
    // Call the onClick handler
    onClick();
  };

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    
    if (!accessibilityState.isReducedMotion) {
      createRipple(event, 'rgba(255, 255, 255, 0.8)');
      playSound('success');
    }
    triggerHaptic('heavy');
    
    announceAction(`Playing video: ${video.title}`);
    onClick();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(event as any);
    }
  };

  // Create comprehensive ARIA label
  const videoAriaLabel = createChildFriendlyLabel('play', `${video.title} video, ${formatDuration(video.duration)} long${video.quizQuestions.length > 0 ? ` with ${video.quizQuestions.length} quiz questions` : ''}`);
  const videoDescription = `Fun video called ${video.title}. Duration: ${formatDuration(video.duration)}. ${video.quizQuestions.length > 0 ? `Includes ${video.quizQuestions.length} interactive quiz questions. ` : ''}${video.completionReward ? `Earn a ${video.completionReward.name} badge when you finish!` : ''}`;

  return (
    <>
      <motion.div
        ref={cardRef}
        id={cardId}
        variants={buttonVariants}
        initial="idle"
        whileHover={accessibilityState.isReducedMotion ? undefined : "hover"}
        whileTap={accessibilityState.isReducedMotion ? undefined : "tap"}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        onHoverStart={() => !accessibilityState.isReducedMotion && playSound('hover')}
        className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border-4 border-white/50 cursor-pointer w-80 hover:border-wiggle-yellow transition-all duration-300 relative child-touch-target interactive-element focus-visible"
        role="button"
        tabIndex={0}
        aria-label={videoAriaLabel}
        aria-describedby={descriptionId}
      >
      {/* Video Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-wiggle-blue to-wiggle-purple overflow-hidden">
        {/* Placeholder thumbnail with colorful gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-wiggle-blue via-wiggle-purple to-wiggle-pink flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="text-6xl opacity-50"
          >
            🎬
          </motion.div>
        </div>
        
        {/* Play button overlay */}
        <motion.div
          whileHover={accessibilityState.isReducedMotion ? undefined : { scale: 1.2 }}
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border-2 border-white/50">
            <div className="text-4xl" role="img" aria-label="Play button">▶️</div>
          </div>
        </motion.div>

        {/* Duration badge */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-bold" aria-label={`Video duration: ${formatDuration(video.duration)}`}>
          <span role="img" aria-hidden="true">⏱️</span> {formatDuration(video.duration)}
        </div>

        {/* Reward badge indicator */}
        {video.completionReward && (
          <div className="absolute top-3 left-3 bg-wiggle-yellow/90 backdrop-blur-sm rounded-full p-2 text-lg" aria-label={`Earn ${video.completionReward.name} badge`}>
            <span role="img" aria-hidden="true">{video.completionReward.icon}</span>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 text-center leading-tight">
          {video.title}
        </h3>
        
        {/* Hidden description for screen readers */}
        <div id={descriptionId} className="sr-only">
          {videoDescription}
        </div>
        
        {/* Quiz indicator */}
        {video.quizQuestions.length > 0 && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3" aria-label={`This video has ${video.quizQuestions.length} interactive quiz questions`}>
            <span className="text-lg" role="img" aria-label="Quiz questions">🧠</span>
            <span>{video.quizQuestions.length} quiz question{video.quizQuestions.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Action button */}
        <motion.button
          variants={buttonVariants}
          initial="idle"
          whileHover={accessibilityState.isReducedMotion ? undefined : "hover"}
          whileTap={accessibilityState.isReducedMotion ? undefined : "tap"}
          onClick={handleButtonClick}
          onHoverStart={() => !accessibilityState.isReducedMotion && playSound('hover')}
          className="w-full bg-gradient-to-r from-wiggle-pink to-wiggle-purple text-white font-bold py-3 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 child-touch-target focus-visible"
          aria-label={createChildFriendlyLabel('play', `${video.title} video now`)}
          type="button"
        >
          <span role="img" aria-hidden="true">🚀</span> Let's Play!
        </motion.button>
      </div>
      </motion.div>

      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <RippleEffect
          key={ripple.id}
          x={ripple.x}
          y={ripple.y}
          color={ripple.color}
          onComplete={() => removeRipple(ripple.id)}
        />
      ))}
    </>
  );
}