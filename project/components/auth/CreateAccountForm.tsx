import React, { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { TextField } from './TextField';
import { PasswordField } from './PasswordField';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { GoogleSignInButton } from './GoogleSignInButton';
import { TermsCheckbox } from './TermsCheckbox';
import { AuthButton } from './AuthButton';

// Zod validation schema for Create Account form
const createAccountSchema = z.object({
  parentName: z.string()
    .min(1, 'Parent name is required')
    .min(2, 'Parent name must be at least 2 characters')
    .max(50, 'Parent name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Parent name can only contain letters, spaces, hyphens, and apostrophes')
    .refine(val => val.trim().length >= 2, 'Parent name must contain at least 2 non-space characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
    .refine(val => !val.includes('..'), 'Email cannot contain consecutive dots')
    .refine(val => !val.startsWith('.') && !val.endsWith('.'), 'Email cannot start or end with a dot'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/^(?=.*\d)/, 'Password must contain at least one number')
    .refine(val => !/\s/.test(val), 'Password cannot contain spaces'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  agreeToTerms: z.boolean()
    .refine(val => val === true, 'You must agree to the terms and privacy policy')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;

interface CreateAccountFormProps {
  onSubmit: (data: CreateAccountFormData) => void;
  onSwitchToSignIn?: () => void;
  onGoogleSignIn?: () => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
  className?: string;
}

function CreateAccountFormComponent({ 
  onSubmit, 
  onSwitchToSignIn,
  onGoogleSignIn,
  onTermsClick,
  onPrivacyClick,
  className 
}: CreateAccountFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid }
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    mode: 'onBlur', // Real-time validation on blur
    reValidateMode: 'onChange', // Re-validate on change after first validation
    defaultValues: {
      parentName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  });

  // Watch password for strength meter and terms checkbox
  const password = watch('password');
  const agreeToTerms = watch('agreeToTerms');

  const handleFormSubmit = useCallback((data: CreateAccountFormData) => {
    onSubmit(data);
  }, [onSubmit]);

  const handleTermsChange = useCallback((checked: boolean) => {
    setValue('agreeToTerms', checked);
  }, [setValue]);

  return (
    <form 
      onSubmit={handleSubmit(handleFormSubmit)}
      className={className}
      noValidate
    >
      <div className="space-y-6">
        {/* Parent Name Field */}
        <TextField
          label="Parent Name"
          placeholder="Enter your full name"
          required
          error={errors.parentName?.message}
          aria-invalid={!!errors.parentName}
          {...register('parentName')}
        />

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
        <div className="space-y-3">
          <PasswordField
            label="Password"
            placeholder="Create a strong password"
            required
            error={errors.password?.message}
            aria-invalid={!!errors.password}
            showStrengthMeter={true}
            {...register('password')}
          />
          
          {/* Password Strength Meter */}
          <PasswordStrengthMeter 
            password={password || ''} 
            className="mt-2"
          />
        </div>

        {/* Confirm Password Field */}
        <PasswordField
          label="Confirm Password"
          placeholder="Re-enter your password"
          required
          error={errors.confirmPassword?.message}
          aria-invalid={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />

        {/* Terms and Privacy Checkbox */}
        <TermsCheckbox
          checked={agreeToTerms}
          onChange={handleTermsChange}
          error={errors.agreeToTerms?.message}
          required
          onTermsClick={onTermsClick}
          onPrivacyClick={onPrivacyClick}
        />

        {/* Google Sign In Button */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>

        <GoogleSignInButton
          onClick={onGoogleSignIn}
          disabled={isSubmitting}
        />

        {/* Submit Button */}
        <AuthButton
          variant="primary"
          type="submit"
          disabled={isSubmitting || !isValid}
          loading={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </AuthButton>

        {/* Switch to Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className={cn(
                'font-semibold transition-all duration-200 touch-target auth-text-readable',
                'text-wiggle-pink hover:text-wiggle-purple',
                'auth-link-focus',
                'underline decoration-2 underline-offset-2',
                'hover:decoration-wiggle-purple'
              )}
              aria-label="Switch to sign in form"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </form>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const CreateAccountForm = memo(CreateAccountFormComponent);