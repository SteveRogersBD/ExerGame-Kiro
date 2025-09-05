import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextFieldProps {
  label: string;
  type?: 'text' | 'email';
  placeholder?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  'aria-invalid'?: boolean;
  className?: string;
  id?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      type = 'text',
      placeholder,
      error,
      required = false,
      value,
      onChange,
      onBlur,
      'aria-invalid': ariaInvalid,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `textfield-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${inputId}-error`;

    return (
      <div className={cn('space-y-2', className)}>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-pink-500 ml-1">*</span>}
        </label>
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          required={required}
          aria-invalid={ariaInvalid || !!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            // Base input styling
            'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200',
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

TextField.displayName = 'TextField';