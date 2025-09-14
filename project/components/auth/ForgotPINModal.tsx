import React, { useRef, useEffect, memo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useFocusTrap } from '@/lib/focus-trap';

interface ForgotPINModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ForgotPINModalComponent({ 
  isOpen, 
  onClose 
}: ForgotPINModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Focus trap for accessibility
  useFocusTrap(modalRef, isOpen, {
    initialFocus: closeButtonRef.current,
    escapeDeactivates: true,
    clickOutsideDeactivates: false, // Let Radix handle this
    returnFocusOnDeactivate: true,
  });

  // Set initial focus when modal opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
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
              'bg-gradient-to-br from-white to-blue-50',
              'border-2 border-wiggle-blue/20',
              'rounded-2xl shadow-2xl',
              'shadow-wiggle-blue/20',
              // Enhanced focus outline for high contrast
              'focus-within:ring-4 focus-within:ring-wiggle-blue/30 focus-within:ring-offset-2'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-pin-title"
            aria-describedby="forgot-pin-description"
          >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title 
              id="forgot-pin-title"
              className={cn(
                'text-2xl font-semibold text-gray-900',
                'font-fredoka'
              )}
            >
              Reset PIN
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                ref={closeButtonRef}
                className={cn(
                  'rounded-full p-2 transition-all duration-200',
                  'text-gray-500 hover:text-gray-700',
                  'hover:bg-gray-100',
                  // Enhanced focus outline with high contrast
                  'focus:outline-none focus:ring-4 focus:ring-wiggle-blue/60 focus:ring-offset-2',
                  'focus:bg-gray-100'
                )}
                aria-label="Close PIN reset information dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Info Icon and Message */}
          <div className="flex items-start gap-4 mb-8">
            <div className={cn(
              'flex-shrink-0 w-12 h-12 rounded-full',
              'bg-wiggle-blue/10 flex items-center justify-center',
              'border-2 border-wiggle-blue/20'
            )}>
              <Info className="h-6 w-6 text-wiggle-blue" />
            </div>
            
            <div className="flex-1">
              <Dialog.Description 
                id="forgot-pin-description"
                className={cn(
                  'text-gray-700 leading-relaxed',
                  'text-base font-medium'
                )}
              >
                PIN can be reset after sign-in in Parent Settings.
              </Dialog.Description>
              
              <p className={cn(
                'text-gray-600 mt-3 text-sm leading-relaxed'
              )}>
                To reset your PIN, please sign in to your account first. Once signed in, 
                you can update your PIN in the Parent Settings section.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Dialog.Close asChild>
              <button
                className={cn(
                  'px-6 py-3 rounded-xl font-semibold',
                  'bg-gradient-to-r from-wiggle-blue to-wiggle-purple',
                  'text-white shadow-lg shadow-wiggle-blue/30',
                  'transition-all duration-200',
                  'hover:shadow-xl hover:shadow-wiggle-blue/40',
                  'hover:scale-105 active:scale-95',
                  // Enhanced focus outline with high contrast
                  'focus:outline-none focus:ring-4 focus:ring-wiggle-blue/60 focus:ring-offset-2',
                  'font-fredoka'
                )}
                aria-label="Close PIN reset information and return to sign in"
              >
                Got it
              </button>
            </Dialog.Close>
          </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const ForgotPINModal = memo(ForgotPINModalComponent);