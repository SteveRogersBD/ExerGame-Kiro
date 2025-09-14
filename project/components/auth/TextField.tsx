import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: 'text' | 'email';
  placeholder?: string;
  error?: string;
  required?: boolean;
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
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          aria-invalid={ariaInvalid || !!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            // Base input styling
            'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200',
            'font-medium text-gray-900 placeholder-gray-400',
            'bg-white touch-target',
            // Enhanced focus styles with high contrast
            'focus:outline-none focus:ring-0',
            // Default border with enhanced focus
            !error && 'border-gray-200 auth-input-focus hover:border-gray-300',
            // Error state with enhanced focus
            error && 'border-red-400 auth-input-error-focus',
            // Hover state
            'hover:border-gray-300'
          )}
          {...props}
        />
        
        {error && (
          <p
            id={errorId}
            className="auth-error-text auth-text-readable flex items-center gap-2 text-sm font-medium"
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
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';