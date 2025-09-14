'use client';

import React, { useRef, useEffect } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useInteractiveAnimations } from '@/hooks/useInteractiveAnimations';
import { useAccessibility, useResponsiveAccessibility } from '@/hooks/useAccessibility';

interface InteractiveButtonProps extends Omit<MotionProps, 'children'> {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large' | 'xl';
  animationType?: 'default' | 'wiggle' | 'glow' | 'bounce' | 'pulse';
  soundEffect?: 'click' | 'hover' | 'success' | 'error' | 'whoosh';
  hapticFeedback?: 'light' | 'medium' | 'heavy';
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaPressed?: boolean;
  role?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-wiggle-pink to-wiggle-purple text-white border-wiggle-pink',
  secondary: 'bg-gradient-to-r from-wiggle-blue to-wiggle-green text-white border-wiggle-blue',
  success: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-400',
  warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-400',
  danger: 'bg-gradient-to-r from-red-400 to-red-600 text-white border-red-400'
};

const sizeStyles = {
  small: 'px-4 py-2 text-sm min-h-[44px] min-w-[80px]',
  medium: 'px-6 py-3 text-lg min-h-[60px] min-w-[120px]',
  large: 'px-8 py-4 text-xl min-h-[80px] min-w-[160px]',
  xl: 'px-12 py-6 text-2xl min-h-[100px] min-w-[200px]'
};

// Enhanced size styles for better accessibility
const accessibleSizeStyles = {
  small: 'px-6 py-3 text-base min-h-[60px] min-w-[100px]',
  medium: 'px-8 py-4 text-lg min-h-[70px] min-w-[140px]',
  large: 'px-10 py-5 text-xl min-h-[80px] min-w-[180px]',
  xl: 'px-14 py-7 text-2xl min-h-[100px] min-w-[220px]'
};

export default function InteractiveButton({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  animationType = 'default',
  soundEffect = 'click',
  hapticFeedback = 'light',
  disabled = false,
  className = '',
  ariaLabel,
  ariaDescribedBy,
  ariaPressed,
  role = 'button',
  type = 'button',
  ...motionProps
}: InteractiveButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [accessibilityState, { generateAriaId, createChildFriendlyLabel, announceToScreenReader }] = useAccessibility();
  const { optimalTouchSize, responsiveClasses, isTouch } = useResponsiveAccessibility();
  
  const {
    buttonVariants,
    wiggleVariants,
    glowVariants,
    bounceVariants,
    pulseVariants,
    playSound,
    triggerHaptic
  } = useInteractiveAnimations();

  // Generate unique ID for ARIA relationships
  const buttonId = useRef(generateAriaId('button')).current;

  // Select animation variants based on type
  const getAnimationVariants = () => {
    switch (animationType) {
      case 'wiggle':
        return wiggleVariants;
      case 'glow':
        return glowVariants;
      case 'bounce':
        return bounceVariants;
      case 'pulse':
        return pulseVariants;
      default:
        return buttonVariants;
    }
  };

  // Validate touch target size on mount
  useEffect(() => {
    if (buttonRef.current && isTouch) {
      const rect = buttonRef.current.getBoundingClientRect();
      if (rect.width < optimalTouchSize || rect.height < optimalTouchSize) {
        console.warn(`Button may be too small for touch interaction. Current: ${rect.width}x${rect.height}, Recommended: ${optimalTouchSize}x${optimalTouchSize}`);
      }
    }
  }, [optimalTouchSize, isTouch]);

  const handleClick = () => {
    if (disabled) return;
    
    // Play sound effect (respecting reduced motion)
    if (!accessibilityState.isReducedMotion) {
      playSound(soundEffect);
    }
    
    // Trigger haptic feedback
    triggerHaptic(hapticFeedback);
    
    // Announce action to screen reader if needed
    if (ariaLabel && accessibilityState.isScreenReaderMode) {
      announceToScreenReader(`Activated: ${ariaLabel}`, 'assertive');
    }
    
    // Call the onClick handler
    onClick?.();
  };

  const handleHover = () => {
    if (disabled || accessibilityState.isReducedMotion) return;
    playSound('hover');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Handle Enter and Space keys for accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  // Choose size styles based on accessibility needs
  const currentSizeStyles = isTouch || accessibilityState.isLargeText 
    ? accessibleSizeStyles[size] 
    : sizeStyles[size];

  const baseClasses = `
    font-bold rounded-3xl border-3 shadow-lg cursor-pointer
    transition-all duration-200 flex items-center justify-center gap-2
    focus:outline-none focus:ring-4 focus:ring-wiggle-yellow/50 focus-visible
    child-touch-target interactive-element
    ${variantStyles[variant]}
    ${currentSizeStyles}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
    ${responsiveClasses}
    ${className}
  `;

  // Create child-friendly ARIA label if not provided
  const finalAriaLabel = ariaLabel || (typeof children === 'string' ? createChildFriendlyLabel(children) : undefined);

  return (
    <motion.button
      ref={buttonRef}
      id={buttonId}
      variants={getAnimationVariants()}
      initial="idle"
      whileHover={disabled || accessibilityState.isReducedMotion ? undefined : "hover"}
      whileTap={disabled || accessibilityState.isReducedMotion ? undefined : "tap"}
      animate={animationType === 'pulse' && !accessibilityState.isReducedMotion ? 'pulse' : 'idle'}
      onClick={handleClick}
      onHoverStart={handleHover}
      onKeyDown={handleKeyDown}
      className={baseClasses}
      disabled={disabled}
      type={type}
      role={role}
      aria-label={finalAriaLabel}
      aria-describedby={ariaDescribedBy}
      aria-pressed={ariaPressed}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...motionProps}
    >
      {children}
      
      {/* Screen reader only text for complex buttons */}
      {accessibilityState.isScreenReaderMode && ariaLabel && (
        <span className="sr-only">
          {finalAriaLabel}
        </span>
      )}
    </motion.button>
  );
}