'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { HomeworkItem } from '@/types/dashboard';
import { useInteractiveAnimations } from '@/hooks/useInteractiveAnimations';
import { useRippleEffect } from '@/hooks/useRippleEffect';
import { useAccessibility, useScreenReaderAnnouncements } from '@/hooks/useAccessibility';
import { RippleEffect } from '@/components/ui/VisualFeedback';

interface HomeworkCardProps {
  homework: HomeworkItem;
  onClick: () => void;
}

export default function HomeworkCard({ homework, onClick }: HomeworkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { buttonVariants, playSound, triggerHaptic } = useInteractiveAnimations();
  const { ripples, createRipple, removeRipple } = useRippleEffect();
  const [accessibilityState, { createChildFriendlyLabel, generateAriaId }] = useAccessibility();
  const { announceAction } = useScreenReaderAnnouncements();
  
  const cardId = useRef(generateAriaId('homework-card')).current;
  const descriptionId = useRef(generateAriaId('homework-description')).current;

  // Get status badge based on homework status
  const getStatusBadge = () => {
    switch (homework.status) {
      case 'not_started':
        return { emoji: '🟢', text: 'Ready to Start', color: 'bg-green-500' };
      case 'in_progress':
        return { emoji: '🟡', text: 'In Progress', color: 'bg-yellow-500' };
      case 'completed':
        return { emoji: '✅', text: 'Completed', color: 'bg-emerald-500' };
      default:
        return { emoji: '🟢', text: 'Ready to Start', color: 'bg-green-500' };
    }
  };

  // Format due date if available
  const formatDueDate = (date?: Date) => {
    if (!date) return null;
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays > 1) return `Due in ${diffDays} days`;
    if (diffDays < 0) return 'Overdue';
    return null;
  };

  // Format duration from seconds to minutes:seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const statusBadge = getStatusBadge();
  const dueText = formatDueDate(homework.dueDate);

  const handleCardClick = (event: React.MouseEvent) => {
    // Create ripple effect (respecting reduced motion)
    if (!accessibilityState.isReducedMotion) {
      createRipple(event, 'rgba(167, 244, 50, 0.6)');
    }
    
    // Play sound and haptic feedback
    if (!accessibilityState.isReducedMotion) {
      playSound('whoosh');
    }
    triggerHaptic('medium');
    
    // Announce action to screen reader
    const action = homework.status === 'completed' ? 'Reviewing' : 
                   homework.status === 'in_progress' ? 'Continuing' : 'Starting';
    announceAction(`${action} homework: ${homework.title}`);
    
    // Call the onClick handler
    onClick();
  };

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    
    if (!accessibilityState.isReducedMotion) {
      createRipple(event, 'rgba(255, 255, 255, 0.8)');
      playSound(homework.status === 'completed' ? 'success' : 'click');
    }
    triggerHaptic('heavy');
    
    const action = homework.status === 'completed' ? 'Reviewing' : 
                   homework.status === 'in_progress' ? 'Continuing' : 'Starting';
    announceAction(`${action} homework mission: ${homework.title}`);
    onClick();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(event as any);
    }
  };

  // Create comprehensive ARIA label and description
  const homeworkAriaLabel = createChildFriendlyLabel(
    homework.status === 'completed' ? 'review' : 
    homework.status === 'in_progress' ? 'continue' : 'start',
    `${homework.title} homework mission, assigned by ${homework.assignedBy}, status: ${statusBadge.text}`
  );
  
  const homeworkDescription = `Homework mission: ${homework.title}. Assigned by ${homework.assignedBy}. Status: ${statusBadge.text}. Duration: ${formatDuration(homework.video.duration)}. ${homework.video.quizQuestions.length > 0 ? `Includes ${homework.video.quizQuestions.length} quiz questions. ` : ''}${dueText ? `${dueText}. ` : ''}${homework.video.completionReward ? `Complete to earn ${homework.video.completionReward.name} badge!` : ''}`;

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
        aria-label={homeworkAriaLabel}
        aria-describedby={descriptionId}
      >
      {/* Homework Header */}
      <div className="relative h-48 bg-gradient-to-br from-wiggle-green to-wiggle-blue overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-wiggle-green via-wiggle-blue to-wiggle-purple flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="text-6xl opacity-50"
          >
            📚
          </motion.div>
        </div>
        
        {/* Main homework icon */}
        <motion.div
          whileHover={{ scale: 1.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 border-2 border-white/50">
            <div className="text-5xl">{homework.icon}</div>
          </div>
        </motion.div>

        {/* Status badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-lg">{statusBadge.emoji}</span>
          <span className="text-white text-sm font-bold">{statusBadge.text}</span>
        </div>

        {/* Due date badge */}
        {dueText && (
          <div className="absolute top-3 left-3 bg-wiggle-pink/90 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-bold">
            ⏰ {dueText}
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-bold">
          ⏱️ {formatDuration(homework.video.duration)}
        </div>
      </div>

      {/* Homework Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 text-center leading-tight">
          {homework.title}
        </h3>
        
        {/* Assigned by info */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
          <span className="text-lg">👨‍👩‍👧‍👦</span>
          <span>Assigned by {homework.assignedBy}</span>
        </div>

        {/* Quiz indicator */}
        {homework.video.quizQuestions.length > 0 && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
            <span className="text-lg">🧠</span>
            <span>{homework.video.quizQuestions.length} quiz question{homework.video.quizQuestions.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Action button */}
        <motion.button
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          onClick={handleButtonClick}
          onHoverStart={() => playSound('hover')}
          className={`w-full font-bold py-3 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
            homework.status === 'completed'
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white'
              : homework.status === 'in_progress'
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
              : 'bg-gradient-to-r from-wiggle-pink to-wiggle-purple text-white'
          }`}
        >
          {homework.status === 'completed' ? '🎉 Review Mission' : 
           homework.status === 'in_progress' ? '🚀 Continue Mission' : 
           '🎯 Start Mission'}
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