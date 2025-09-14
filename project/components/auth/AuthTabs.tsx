import React, { useState, useCallback, memo } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { CreateAccountForm, CreateAccountFormData } from './CreateAccountForm';
import { SignInForm, SignInFormData } from './SignInForm';

interface AuthTabsProps {
  defaultTab?: 'create-account' | 'sign-in';
  onTabChange?: (tab: string) => void;
  onCreateAccount?: (data: CreateAccountFormData) => void;
  onSignIn?: (data: SignInFormData) => void;
  onGoogleSignIn?: () => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
  onForgotPassword?: () => void;
  onForgotPIN?: () => void;
  className?: string;
  children?: React.ReactNode;
}

function AuthTabsComponent({ 
  defaultTab = 'create-account', 
  onTabChange,
  onCreateAccount,
  onSignIn,
  onGoogleSignIn,
  onTermsClick,
  onPrivacyClick,
  onForgotPassword,
  onForgotPIN,
  className,
  children 
}: AuthTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const prefersReducedMotion = useReducedMotion();

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as 'create-account' | 'sign-in');
    onTabChange?.(value);
  }, [onTabChange]);

  const handleSwitchToSignIn = useCallback(() => {
    handleTabChange('sign-in');
  }, [handleTabChange]);

  const handleSwitchToCreateAccount = useCallback(() => {
    handleTabChange('create-account');
  }, [handleTabChange]);

  const tabs = [
    { value: 'create-account', label: 'Create Account' },
    { value: 'sign-in', label: 'Sign In' }
  ];

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={handleTabChange}
      className={cn('w-full', className)}
    >
      <Tabs.List
        className={cn(
          // Container styling with wiggle theme
          'relative flex w-full rounded-2xl p-1.5',
          // Vibrant gradient background using wiggle colors
          'bg-gradient-to-r from-wiggle-lavender/30 via-wiggle-peach/20 to-wiggle-mint/30',
          // Colorful border and shadow
          'border-2 border-wiggle-pink/20',
          'shadow-[0_8px_32px_-12px_rgba(255,106,213,0.3),0_4px_16px_-8px_rgba(157,141,241,0.2)]',
          // Backdrop blur for modern glass effect
          'backdrop-blur-sm',
          // Spacing
          'mb-8'
        )}
        aria-label="Authentication options"
      >
        {/* Animated underline indicator with wiggle colors */}
        <motion.div
          className={cn(
            'absolute bottom-1.5 h-1 rounded-full',
            'bg-gradient-to-r from-wiggle-pink via-wiggle-purple to-wiggle-blue',
            'shadow-[0_2px_8px_rgba(255,106,213,0.4)]'
          )}
          layoutId="tab-underline"
          initial={false}
          animate={{
            left: activeTab === 'create-account' ? '0.375rem' : '50%',
            width: activeTab === 'create-account' ? 'calc(50% - 0.75rem)' : 'calc(50% - 0.75rem)',
          }}
          transition={prefersReducedMotion ? { duration: 0 } : {
            type: 'spring',
            stiffness: 400,
            damping: 30,
            duration: 0.3
          }}
        />

        {tabs.map((tab, index) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              // Base styling with rounded corners
              'flex-1 relative px-6 py-4 text-sm font-semibold rounded-xl touch-target',
              'transition-all duration-300 ease-out auth-text-readable',
              'auth-tab-focus',
              // Text styling
              'text-center select-none',
              // Active state with vibrant styling
              activeTab === tab.value && [
                'text-gray-900 font-bold',
                'bg-gradient-to-br from-white/90 to-white/70',
                'shadow-[0_4px_20px_rgba(255,106,213,0.15),0_2px_8px_rgba(157,141,241,0.1)]',
                'border-2 border-white/60',
                'backdrop-blur-sm'
              ],
              // Inactive state with subtle wiggle theme
              activeTab !== tab.value && [
                'text-gray-700 hover:text-gray-900',
                'hover:bg-gradient-to-br hover:from-white/50 hover:to-white/30',
                'hover:shadow-[0_2px_12px_rgba(255,106,213,0.1)]',
                'border-2 border-transparent hover:border-white/40'
              ],
              // Micro-interactions
              'hover:scale-[1.02] active:scale-[0.98]',
              'transform-gpu' // Hardware acceleration
            )}
          >
            <motion.span
              initial={false}
              animate={{
                scale: prefersReducedMotion ? 1 : (activeTab === tab.value ? 1.05 : 1),
              }}
              whileHover={prefersReducedMotion ? {} : {
                scale: activeTab === tab.value ? 1.08 : 1.03,
              }}
              whileTap={prefersReducedMotion ? {} : {
                scale: 0.95,
              }}
              transition={prefersReducedMotion ? { duration: 0 } : {
                type: 'spring',
                stiffness: 400,
                damping: 25
              }}
              className="block"
            >
              {tab.label}
            </motion.span>
            
            {/* Subtle glow effect for active tab */}
            {activeTab === tab.value && (
              <motion.div
                className={cn(
                  'absolute inset-0 rounded-xl',
                  'bg-gradient-to-r from-wiggle-pink/5 via-wiggle-purple/5 to-wiggle-blue/5',
                  'pointer-events-none'
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
              />
            )}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {/* Tab content area with enhanced styling */}
      <div className="relative">
        <Tabs.Content
          value="create-account"
          className={cn(
            'focus:outline-none',
            'data-[state=inactive]:hidden'
          )}
        >
          <motion.div
            key="create-account"
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            transition={prefersReducedMotion ? { duration: 0 } : { 
              duration: 0.25, 
              ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for smooth easing
            }}
          >
            {/* Create Account form content */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className={cn(
                  'text-2xl font-bold bg-gradient-to-r from-wiggle-pink via-wiggle-purple to-wiggle-blue',
                  'bg-clip-text text-transparent'
                )}>
                  Create Your Parent Account
                </h3>
                <p className="text-gray-600 font-medium">
                  Join WiggleWorld to manage your child's gaming experience
                </p>
              </div>
              
              <CreateAccountForm
                onSubmit={onCreateAccount || (() => {})}
                onSwitchToSignIn={handleSwitchToSignIn}
                onGoogleSignIn={onGoogleSignIn}
                onTermsClick={onTermsClick}
                onPrivacyClick={onPrivacyClick}
              />
            </div>
          </motion.div>
        </Tabs.Content>

        <Tabs.Content
          value="sign-in"
          className={cn(
            'focus:outline-none',
            'data-[state=inactive]:hidden'
          )}
        >
          <motion.div
            key="sign-in"
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            transition={prefersReducedMotion ? { duration: 0 } : { 
              duration: 0.25, 
              ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for smooth easing
            }}
          >
            {/* Sign In form content */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className={cn(
                  'text-2xl font-bold bg-gradient-to-r from-wiggle-blue via-wiggle-green to-wiggle-yellow',
                  'bg-clip-text text-transparent'
                )}>
                  Welcome Back!
                </h3>
                <p className="text-gray-600 font-medium">
                  Sign in to access your parent dashboard
                </p>
              </div>
              
              <SignInForm
                onSubmit={onSignIn || (() => {})}
                onSwitchToCreateAccount={handleSwitchToCreateAccount}
                onForgotPassword={onForgotPassword}
                onForgotPIN={onForgotPIN}
              />
            </div>
          </motion.div>
        </Tabs.Content>
      </div>

      {children}
    </Tabs.Root>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const AuthTabs = memo(AuthTabsComponent);