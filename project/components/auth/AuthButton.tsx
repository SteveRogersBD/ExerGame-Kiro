import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AuthButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export function AuthButton({
  variant,
  children,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  className
}: AuthButtonProps) {
  const isPrimary = variant === 'primary';
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={prefersReducedMotion ? {} : { 
        scale: disabled ? 1 : 1.015,
        y: disabled ? 0 : -1
      }}
      whileTap={prefersReducedMotion ? {} : { 
        scale: disabled ? 1 : 0.985 
      }}
      transition={prefersReducedMotion ? { duration: 0 } : {
        type: 'spring',
        stiffness: 500,
        damping: 30,
        duration: 0.15
      }}
      className={cn(
        // Base styling
        'w-full flex justify-center items-center px-6 py-3.5 rounded-xl touch-target',
        'text-sm font-semibold transition-all duration-200 auth-text-readable',
        
        // Primary variant with wiggle theme gradient
        isPrimary && [
          'text-white auth-button-focus',
          'bg-gradient-to-r from-wiggle-pink via-wiggle-purple to-wiggle-blue',
          'hover:from-wiggle-pink/90 hover:via-wiggle-purple/90 hover:to-wiggle-blue/90',
          'shadow-[0_4px_14px_0_rgba(255,106,213,0.39),0_2px_8px_0_rgba(157,141,241,0.2)]',
          'hover:shadow-[0_6px_20px_0_rgba(255,106,213,0.5),0_4px_12px_0_rgba(157,141,241,0.3)]',
          // Disabled state for primary
          disabled && 'opacity-50 cursor-not-allowed hover:shadow-none'
        ],
        
        // Secondary variant
        !isPrimary && [
          'text-gray-700 hover:text-gray-900 auth-button-secondary-focus',
          'bg-gradient-to-r from-white to-gray-50',
          'border-2 border-gray-200 hover:border-gray-300',
          'shadow-[0_2px_8px_0_rgba(0,0,0,0.05)]',
          'hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.1)]',
          // Disabled state for secondary
          disabled && 'opacity-50 cursor-not-allowed hover:border-gray-200 hover:shadow-none'
        ],
        
        // Loading state
        loading && 'cursor-wait',
        
        className
      )}
      aria-disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center">
          <svg 
            className={cn(
              'animate-spin -ml-1 mr-3 h-5 w-5',
              isPrimary ? 'text-white' : 'text-gray-600'
            )} 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {typeof children === 'string' ? `${children}...` : children}
        </div>
      ) : (
        <>
          {children}
          
          {/* Subtle glow effect on hover for primary buttons */}
          {isPrimary && !disabled && !prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-wiggle-pink/10 via-wiggle-purple/10 to-wiggle-blue/10 opacity-0 pointer-events-none"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </>
      )}
    </motion.button>
  );
}