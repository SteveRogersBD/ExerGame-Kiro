import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  showStrengthMeter?: boolean;
  'aria-invalid'?: boolean;
  className?: string;
  id?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      label,
      placeholder,
      error,
      required = false,
      value,
      onChange,
      onBlur,
      showStrengthMeter = false,
      'aria-invalid': ariaInvalid,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `passwordfield-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${inputId}-error`;
    const toggleId = `${inputId}-toggle`;

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={cn('space-y-2', className)}>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-pink-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={onBlur}
            required={required}
            aria-invalid={ariaInvalid || !!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              // Base input styling
              'w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200',
              'font-medium text-gray-900 placeholder-gray-400',
              'bg-white',
              // Focus styles with wiggle theme colors
              'focus:outline-none focus:ring-0',
              // Default border
              !error && 'border-gray-200 focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(255,109,213,0.1)]',
              // Error state
              error && 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]',
              // Hover state
              'hover:border-gray-300'
            )}
            {...props}
          />
          
          <button
            id={toggleId}
            type="button"
            onClick={togglePasswordVisibility}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'p-1 rounded-lg transition-colors duration-200',
              'text-gray-400 hover:text-gray-600 focus:text-gray-600',
              'focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-1'
            )}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            tabIndex={0}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {error && (
          <p
            id={errorId}
            className="text-sm text-red-600 flex items-center gap-1"
            role="alert"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';