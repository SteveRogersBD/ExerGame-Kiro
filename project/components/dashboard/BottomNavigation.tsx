'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInteractiveAnimations } from '@/hooks/useInteractiveAnimations';
import { useRippleEffect } from '@/hooks/useRippleEffect';
import { useAccessibility, useKeyboardNavigation, useScreenReaderAnnouncements } from '@/hooks/useAccessibility';
import { RippleEffect } from '@/components/ui/VisualFeedback';

interface BottomNavigationProps {
  currentView: 'dashboard' | 'video' | 'homework' | 'badges' | 'help';
  onNavigate: (view: 'dashboard' | 'badges' | 'help') => void;
}

export default function BottomNavigation({ currentView, onNavigate }: BottomNavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const { buttonVariants, playSound, triggerHaptic } = useInteractiveAnimations();
  const { ripples, createRipple, removeRipple } = useRippleEffect();
  const [accessibilityState, { createChildFriendlyLabel }] = useAccessibility();
  const { announceNavigation } = useScreenReaderAnnouncements();
  
  // Enable keyboard navigation
  useKeyboardNavigation(navRef, 'horizontal');

  const navigationItems = [
    {
      id: 'dashboard' as const,
      emoji: '🏠',
      label: 'Home',
      ariaLabel: createChildFriendlyLabel('home', 'main dashboard with videos and homework'),
      description: 'Return to the main dashboard to see your videos and homework'
    },
    {
      id: 'badges' as const,
      emoji: '🎖️',
      label: 'Badges',
      ariaLabel: createChildFriendlyLabel('badges', 'your earned rewards and achievements'),
      description: 'View all the badges and stickers you have earned'
    },
    {
      id: 'help' as const,
      emoji: '❓',
      label: 'Help',
      ariaLabel: createChildFriendlyLabel('help', 'get guidance from your friendly mascot'),
      description: 'Get help and tips from your friendly animal mascots'
    }
  ];

  const handleNavClick = (view: 'dashboard' | 'badges' | 'help', event: React.MouseEvent, item: typeof navigationItems[0]) => {
    // Create ripple effect (only if not reduced motion)
    if (!accessibilityState.isReducedMotion) {
      createRipple(event, 'rgba(255, 221, 61, 0.6)');
    }
    
    // Play sound and haptic feedback (respecting accessibility preferences)
    if (!accessibilityState.isReducedMotion) {
      playSound('click');
    }
    triggerHaptic('medium');
    
    // Announce navigation to screen reader
    announceNavigation(item.label);
    
    // Navigate
    onNavigate(view);
  };

  const handleKeyDown = (event: React.KeyboardEvent, view: 'dashboard' | 'badges' | 'help', item: typeof navigationItems[0]) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavClick(view, event as any, item);
    }
  };

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        delay: accessibilityState.isReducedMotion ? 0 : 0.6, 
        duration: accessibilityState.isReducedMotion ? 0.1 : 0.6 
      }}
      className="flex justify-center items-center p-6 bg-white/10 backdrop-blur-sm border-t border-white/20 interactive-spacing horizontal"
      role="navigation"
      aria-label="Main navigation for kids dashboard"
    >
      <div className="flex gap-6">
        {navigationItems.map((item) => {
          // Home button is active when on dashboard, video, or homework views
          const isActive = item.id === 'dashboard' 
            ? (currentView === 'dashboard' || currentView === 'video' || currentView === 'homework')
            : currentView === item.id;
          
          return (
            <motion.button
              key={item.id}
              variants={buttonVariants}
              initial="idle"
              whileHover={accessibilityState.isReducedMotion ? undefined : "hover"}
              whileTap={accessibilityState.isReducedMotion ? undefined : "tap"}
              onClick={(event) => handleNavClick(item.id, event, item)}
              onKeyDown={(event) => handleKeyDown(event, item.id, item)}
              onHoverStart={() => !accessibilityState.isReducedMotion && playSound('hover')}
              className={`
                relative flex flex-col items-center justify-center gap-2 p-4 rounded-3xl
                min-h-[80px] min-w-[80px] border-3 transition-all duration-300
                child-touch-target interactive-element focus-visible
                ${isActive 
                  ? 'bg-wiggle-yellow/90 border-wiggle-yellow text-wiggle-purple shadow-lg shadow-wiggle-yellow/30' 
                  : 'bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30'
                }
              `}
              aria-label={item.ariaLabel}
              aria-describedby={`${item.id}-description`}
              aria-pressed={isActive}
              aria-current={isActive ? 'page' : undefined}
              type="button"
              role="button"
            >
              {/* Emoji Icon */}
              <span className="text-3xl" role="img" aria-label={`${item.label} icon`}>
                {item.emoji}
              </span>
              
              {/* Label Text */}
              <span className="text-sm font-bold tracking-wide">
                {item.label}
              </span>

              {/* Hidden description for screen readers */}
              <span id={`${item.id}-description`} className="sr-only">
                {item.description}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -top-1 -right-1 w-4 h-4 bg-wiggle-pink rounded-full border-2 border-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.6 }}
                />
              )}

              {/* Bounce Animation for Active State (respecting reduced motion) */}
              {isActive && !accessibilityState.isReducedMotion && (
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-wiggle-yellow/20"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

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
    </motion.nav>
  );
}