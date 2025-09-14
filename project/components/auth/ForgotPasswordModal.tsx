import React, { useRef, useEffect, memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useFocusTrap } from '@/lib/focus-trap';
import { TextField } from './TextField';
import { AuthButton } from './AuthButton';

// Zod validation schema for forgot password form
const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (email: string) => void;
}

function ForgotPasswordModalComponent({ 
  isOpen, 
  onClose, 
  onSubmit 
}: ForgotPasswordModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  
  // Focus trap for accessibility
  useFocusTrap(modalRef, isOpen, {
    initialFocus: emailInputRef.current,
    escapeDeactivates: true,
    clickOutsideDeactivates: false, // Let Radix handle this
    returnFocusOnDeactivate: true,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur', // Real-time validation on blur
    reValidateMode: 'onChange', // Re-validate on change after first validation
    defaultValues: {
      email: ''
    }
  });

  // Set initial focus when modal opens
  useEffect(() => {
    if (isOpen && emailInputRef.current) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    try {
      // Call the onSubmit callback if provided
      if (onSubmit) {
        await onSubmit(data.email);
      }
      
      // Show success toast
      toast.success('Password reset link sent (demo)', {
        description: 'Check your email for password reset instructions.',
        duration: 4000,
      });
      
      // Reset form and close modal
      reset();
      onClose();
    } catch (error) {
      // Handle any errors
      toast.error('Failed to send reset link', {
        description: 'Please try again later.',
        duration: 4000,
      });
    }
  };

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15 }}
            className={cn(
              'fixed inset-0 z-50',
              'bg-black/50 backdrop-blur-sm'
            )}
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            ref={modalRef}
            initial={prefersReducedMotion ? { 
              opacity: 1, 
              scale: 1,
              x: '-50%',
              y: '-50%'
            } : { 
              opacity: 0, 
              scale: 0.95,
              x: '-50%',
              y: '-50%'
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: '-50%',
              y: '-50%'
            }}
            exit={prefersReducedMotion ? { 
              opacity: 1, 
              scale: 1,
              x: '-50%',
              y: '-50%'
            } : { 
              opacity: 0, 
              scale: 0.95,
              x: '-50%',
              y: '-50%'
            }}
            transition={prefersReducedMotion ? { duration: 0 } : {
              type: 'spring',
              stiffness: 400,
              damping: 30,
              duration: 0.2
            }}
            className={cn(
              'fixed left-[50%] top-[50%] z-50',
              'w-full max-w-md p-6',
              'bg-gradient-to-br from-white to-yellow-50',
              'border-2 border-wiggle-pink/20',
              'rounded-2xl shadow-2xl',
              'shadow-wiggle-pink/20',
              // Enhanced focus outline for high contrast
              'focus-within:ring-4 focus-within:ring-wiggle-pink/30 focus-within:ring-offset-2'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-password-title"
            aria-describedby="forgot-password-description"
          >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title 
              id="forgot-password-title"
              className={cn(
                'text-2xl font-semibold text-gray-900',
                'font-fredoka'
              )}
            >
              Reset Password
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className={cn(
                  'rounded-full p-2 transition-all duration-200',
                  'text-gray-500 hover:text-gray-700',
                  'hover:bg-gray-100',
                  // Enhanced focus outline with high contrast
                  'focus:outline-none focus:ring-4 focus:ring-wiggle-pink/60 focus:ring-offset-2',
                  'focus:bg-gray-100'
                )}
                aria-label="Close reset password dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Description */}
          <Dialog.Description 
            id="forgot-password-description"
            className={cn(
              'text-gray-600 mb-6 leading-relaxed',
              'text-sm'
            )}
          >
            Enter your email address and we'll send you a link to reset your password.
          </Dialog.Description>

          {/* Form */}
          <form 
            onSubmit={handleSubmit(handleFormSubmit)} 
            className="space-y-6"
            noValidate
          >
            <TextField
              ref={emailInputRef}
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              required
              error={errors.email?.message}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : 'forgot-password-description'}
              {...register('email')}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className={cn(
                    'flex-1 px-4 py-3 rounded-xl font-medium',
                    'text-gray-700 bg-gray-100 hover:bg-gray-200',
                    'transition-all duration-200',
                    // Enhanced focus outline with high contrast
                    'focus:outline-none focus:ring-4 focus:ring-gray-400/60 focus:ring-offset-2',
                    'focus:bg-gray-200',
                    'border-2 border-transparent hover:border-gray-300'
                  )}
                  aria-label="Cancel password reset"
                >
                  Cancel
                </button>
              </Dialog.Close>
              
              <AuthButton
                variant="primary"
                type="submit"
                disabled={isSubmitting || !isValid}
                loading={isSubmitting}
                className="flex-1"
                aria-describedby={errors.email ? 'email-error' : undefined}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </AuthButton>
            </div>
          </form>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const ForgotPasswordModal = memo(ForgotPasswordModalComponent);