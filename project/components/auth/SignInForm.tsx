import React, { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { TextField } from './TextField';
import { PasswordField } from './PasswordField';
import { AuthButton } from './AuthButton';

// Zod validation schema for Sign In form
const signInSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
  password: z.string()
    .min(1, 'Password is required')
    .max(128, 'Password is too long'),
  rememberMe: z.boolean().optional()
});

export type SignInFormData = z.infer<typeof signInSchema>;

interface SignInFormProps {
  onSubmit: (data: SignInFormData) => void;
  onSwitchToCreateAccount?: () => void;
  onForgotPassword?: () => void;
  onForgotPIN?: () => void;
  className?: string;
}

function SignInFormComponent({ 
  onSubmit, 
  onSwitchToCreateAccount,
  onForgotPassword,
  onForgotPIN,
  className 
}: SignInFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur', // Real-time validation on blur
    reValidateMode: 'onChange', // Re-validate on change after first validation
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const handleFormSubmit = useCallback((data: SignInFormData) => {
    onSubmit(data);
  }, [onSubmit]);

  return (
    <form 
      onSubmit={handleSubmit(handleFormSubmit)}
      className={className}
      noValidate
    >
      <div className="space-y-6">
        {/* Email Field */}
        <TextField
          label="Email"
          type="email"
          placeholder="Enter your email address"
          required
          error={errors.email?.message}
          aria-invalid={!!errors.email}
          {...register('email')}
        />

        {/* Password Field */}
        <PasswordField
          label="Password"
          placeholder="Enter your password"
          required
          error={errors.password?.message}
          aria-invalid={!!errors.password}
          {...register('password')}
        />

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-3 cursor-pointer touch-target">
            <input
              type="checkbox"
              className={cn(
                'w-5 h-5 rounded border-2 transition-all duration-200 touch-target',
                'border-gray-300 auth-focus-outline auth-focus-pink',
                'text-wiggle-pink focus:ring-offset-0',
                'checked:bg-wiggle-pink checked:border-wiggle-pink',
                'hover:border-gray-400'
              )}
              {...register('rememberMe')}
              aria-describedby="remember-me-description"
            />
            <span 
              id="remember-me-description"
              className="text-sm font-medium text-gray-700 auth-text-readable"
            >
              Remember me on this device
            </span>
          </label>
        </div>

        {/* Forgot Links */}
        <div className="flex justify-between items-center text-sm">
          <button
            type="button"
            onClick={onForgotPIN}
            className={cn(
              'font-medium transition-all duration-200 touch-target auth-text-readable',
              'text-wiggle-blue hover:text-wiggle-purple',
              'auth-link-focus',
              'underline decoration-2 underline-offset-2',
              'hover:decoration-wiggle-purple'
            )}
            aria-label="Get help resetting your PIN"
          >
            Forgot PIN?
          </button>
          
          <button
            type="button"
            onClick={onForgotPassword}
            className={cn(
              'font-medium transition-all duration-200 touch-target auth-text-readable',
              'text-wiggle-blue hover:text-wiggle-purple',
              'auth-link-focus',
              'underline decoration-2 underline-offset-2',
              'hover:decoration-wiggle-purple'
            )}
            aria-label="Reset your password via email"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <AuthButton
          variant="primary"
          type="submit"
          disabled={isSubmitting || !isValid}
          loading={isSubmitting}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </AuthButton>

        {/* Switch to Create Account Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToCreateAccount}
              className={cn(
                'font-semibold transition-all duration-200 touch-target auth-text-readable',
                'text-wiggle-pink hover:text-wiggle-purple',
                'auth-link-focus',
                'underline decoration-2 underline-offset-2',
                'hover:decoration-wiggle-purple'
              )}
              aria-label="Switch to create new account form"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </form>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const SignInForm = memo(SignInFormComponent);