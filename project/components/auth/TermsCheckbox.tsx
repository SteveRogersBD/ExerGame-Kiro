import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface TermsCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  error?: string;
  required?: boolean;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
  className?: string;
  id?: string;
}

export const TermsCheckbox = forwardRef<HTMLInputElement, TermsCheckboxProps>(
  (
    {
      checked = false,
      onChange,
      onBlur,
      error,
      required = false,
      onTermsClick,
      onPrivacyClick,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || 'terms-checkbox';
    const errorId = `${checkboxId}-error`;

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    const handleTermsClick = (e: React.MouseEvent) => {
      e.preventDefault();
      onTermsClick?.();
    };

    const handlePrivacyClick = (e: React.MouseEvent) => {
      e.preventDefault();
      onPrivacyClick?.();
    };

    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-start space-x-3">
          {/* Custom Checkbox */}
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              checked={checked}
              onChange={handleCheckboxChange}
              onBlur={onBlur}
              required={required}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              className="sr-only"
              {...props}
            />
            
            <motion.label
              htmlFor={checkboxId}
              className={cn(
                'relative flex items-center justify-center w-5 h-5 rounded-md cursor-pointer touch-target',
                'border-2 transition-all duration-200',
                // Default state
                !checked && !error && 'border-gray-300 bg-white hover:border-gray-400',
                // Checked state with wiggle colors
                checked && !error && 'border-wiggle-pink bg-gradient-to-br from-wiggle-pink to-wiggle-purple',
                // Error state
                error && 'border-red-400 bg-red-50',
                // Enhanced focus styles
                'auth-checkbox-focus'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Check icon */}
              <motion.div
                initial={false}
                animate={{
                  scale: checked ? 1 : 0,
                  opacity: checked ? 1 : 0
                }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30
                }}
              >
                <Check 
                  className="w-3 h-3 text-white" 
                  strokeWidth={3}
                />
              </motion.div>
            </motion.label>
          </div>

          {/* Label Text */}
          <label 
            htmlFor={checkboxId} 
            className="text-sm text-gray-700 leading-relaxed cursor-pointer select-none"
          >
            I agree to the{' '}
            <button
              type="button"
              onClick={handleTermsClick}
              className={cn(
                'font-medium underline transition-colors duration-200 touch-target',
                'text-wiggle-pink hover:text-wiggle-purple auth-text-readable',
                'auth-link-focus inline-flex items-center'
              )}
              aria-label="Read Terms and Conditions"
            >
              Terms & Conditions
            </button>
            {' '}and{' '}
            <button
              type="button"
              onClick={handlePrivacyClick}
              className={cn(
                'font-medium underline transition-colors duration-200 touch-target',
                'text-wiggle-pink hover:text-wiggle-purple auth-text-readable',
                'auth-link-focus inline-flex items-center'
              )}
              aria-label="Read Privacy Policy"
            >
              Privacy Policy
            </button>
            {required && <span className="text-wiggle-pink ml-1">*</span>}
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p
              id={errorId}
              className="auth-error-text auth-text-readable flex items-center gap-2 ml-8 text-sm font-medium"
              role="alert"
              aria-live="polite"
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          </motion.div>
        )}
      </div>
    );
  }
);

TermsCheckbox.displayName = 'TermsCheckbox';