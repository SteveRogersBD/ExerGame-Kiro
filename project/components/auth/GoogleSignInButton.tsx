import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface GoogleSignInButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function GoogleSignInButton({ 
  onClick, 
  disabled = false, 
  loading = false,
  className 
}: GoogleSignInButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.button
      type="button"
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
        // Base styling with wiggle theme
        'w-full flex items-center justify-center px-6 py-3.5 rounded-xl touch-target',
        'text-sm font-semibold transition-all duration-200 auth-text-readable',
        // Background and border with wiggle colors
        'bg-gradient-to-r from-white to-gray-50',
        'border-2 border-gray-200 hover:border-gray-300',
        // Shadow with wiggle theme colors
        'shadow-[0_4px_14px_0_rgba(135,206,235,0.15),0_2px_8px_0_rgba(167,244,50,0.1)]',
        'hover:shadow-[0_6px_20px_0_rgba(135,206,235,0.2),0_4px_12px_0_rgba(167,244,50,0.15)]',
        // Text color
        'text-gray-700 hover:text-gray-900',
        // Enhanced focus styles
        'auth-focus-outline auth-focus-blue',
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none',
        // Loading state
        loading && 'cursor-wait',
        className
      )}
      aria-label="Sign in with Google"
    >
      {loading ? (
        <div className="flex items-center">
          <svg 
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" 
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
          Signing in...
        </div>
      ) : (
        <>
          {/* Google Logo SVG */}
          <svg 
            className="w-5 h-5 mr-3 flex-shrink-0" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          
          <span>Sign in with Google</span>
          
          {/* Subtle glow effect on hover */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-wiggle-blue/5 via-wiggle-green/5 to-wiggle-yellow/5 opacity-0 pointer-events-none"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </>
      )}
    </motion.button>
  );
}