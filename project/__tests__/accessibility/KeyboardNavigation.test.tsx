import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ParentAuth from '@/app/parent/auth/page'
import { AuthTabs } from '@/components/auth/AuthTabs'
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal'

// Mock the hooks
jest.mock('@/hooks/useKeyboardNavigation', () => ({
  useKeyboardNavigation: jest.fn(),
  useScreenReaderAnnouncement: () => ({
    announce: jest.fn(),
  }),
}))

jest.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
  Toaster: () => <div data-testid="toaster" />,
}))

jest.mock('@/lib/focus-trap', () => ({
  useFocusTrap: jest.fn(),
}))

describe('Comprehensive Keyboard Navigation Tests', () => {
  const mockAuthTabsProps = {
    onCreateAccount: jest.fn(),
    onSignIn: jest.fn(),
    onGoogleSignIn: jest.fn(),
    onTermsClick: jest.fn(),
    onPrivacyClick: jest.fn(),
    onForgotPassword: jest.fn(),
    onForgotPIN: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Tab Order and Focus Management', () => {
    it('maintains logical tab order through authentication forms', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Start from the beginning and tab through all elements
      const firstTab = screen.getByRole('tab', { name: /create account/i })
      firstTab.focus()
      
      // Tab through the tab list
      await user.keyboard('{Tab}')
      expect(screen.getByRole('tab', { name: /sign in/i })).toHaveFocus()
      
      // Tab into form content
      await user.keyboard('{Tab}')
      const parentNameInput = screen.getByLabelText(/parent name/i)
      expect(parentNameInput).toHaveFocus()
      
      // Continue tabbing through form fields
      await user.keyboard('{Tab}')
      expect(screen.getByLabelText(/email/i)).toHaveFocus()
      
      await user.keyboard('{Tab}')
      expect(screen.getByLabelText(/^password$/i)).toHaveFocus()
      
      await user.keyboard('{Tab}')
      expect(screen.getByLabelText(/confirm password/i)).toHaveFocus()
      
      await user.keyboard('{Tab}')
      expect(screen.getByRole('checkbox')).toHaveFocus()
      
      await user.keyboard('{Tab}')
      expect(screen.getByRole('button', { name: /continue with google/i })).toHaveFocus()
      
      await user.keyboard('{Tab}')
      expect(screen.getByRole('button', { name: /create account/i })).toHaveFocus()
    })

    it('handles tab navigation between form tabs', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Focus on Create Account tab
      const createAccountTab = screen.getByRole('tab', { name: /create account/i })
      createAccountTab.focus()
      
      // Use arrow keys to navigate between tabs
      await user.keyboard('{ArrowRight}')
      expect(screen.getByRole('tab', { name: /sign in/i })).toHaveFocus()
      
      await user.keyboard('{ArrowLeft}')
      expect(screen.getByRole('tab', { name: /create account/i })).toHaveFocus()
      
      // Use Enter to activate tab
      await user.keyboard('{Enter}')
      expect(screen.getByRole('tab', { name: /create account/i })).toHaveAttribute('aria-selected', 'true')
    })

    it('maintains focus when switching between tabs', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Fill some data in Create Account form
      const parentNameInput = screen.getByLabelText(/parent name/i)
      await user.type(parentNameInput, 'John Doe')
      
      // Switch to Sign In tab
      const signInTab = screen.getByRole('tab', { name: /sign in/i })
      await user.click(signInTab)
      
      // Focus should be on the first input of Sign In form
      await user.keyboard('{Tab}')
      expect(screen.getByLabelText(/email/i)).toHaveFocus()
      
      // Switch back to Create Account tab
      const createAccountTab = screen.getByRole('tab', { name: /create account/i })
      await user.click(createAccountTab)
      
      // Form should be reset, focus should be manageable
      await user.keyboard('{Tab}')
      expect(screen.getByLabelText(/parent name/i)).toHaveFocus()
    })

    it('handles reverse tab navigation correctly', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Focus on submit button
      const submitButton = screen.getByRole('button', { name: /create account/i })
      submitButton.focus()
      
      // Shift+Tab backwards through form
      await user.keyboard('{Shift>}{Tab}{/Shift}')
      expect(screen.getByRole('button', { name: /continue with google/i })).toHaveFocus()
      
      await user.keyboard('{Shift>}{Tab}{/Shift}')
      expect(screen.getByRole('checkbox')).toHaveFocus()
      
      await user.keyboard('{Shift>}{Tab}{/Shift}')
      expect(screen.getByLabelText(/confirm password/i)).toHaveFocus()
    })
  })

  describe('Keyboard Shortcuts and Interactions', () => {
    it('supports Enter key for form submission', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Fill valid form data
      await user.type(screen.getByLabelText(/parent name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
      await user.click(screen.getByRole('checkbox'))
      
      // Press Enter on any form field to submit
      const emailInput = screen.getByLabelText(/email/i)
      emailInput.focus()
      await user.keyboard('{Enter}')
      
      expect(mockAuthTabsProps.onCreateAccount).toHaveBeenCalled()
    })

    it('supports Space key for checkbox and button activation', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Use Space to check checkbox
      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()
      await user.keyboard(' ')
      
      expect(checkbox).toBeChecked()
      
      // Use Space again to uncheck
      await user.keyboard(' ')
      expect(checkbox).not.toBeChecked()
      
      // Use Space to activate button
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      googleButton.focus()
      await user.keyboard(' ')
      
      expect(mockAuthTabsProps.onGoogleSignIn).toHaveBeenCalled()
    })

    it('handles Escape key for modal dismissal', async () => {
      const user = userEvent.setup()
      const mockModalProps = {
        isOpen: true,
        onClose: jest.fn(),
        onSubmit: jest.fn(),
      }
      
      render(<ForgotPasswordModal {...mockModalProps} />)
      
      // Press Escape to close modal
      await user.keyboard('{Escape}')
      
      expect(mockModalProps.onClose).toHaveBeenCalled()
    })

    it('supports keyboard navigation in password visibility toggle', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      const passwordInput = screen.getByLabelText(/^password$/i)
      await user.type(passwordInput, 'password123')
      
      // Find and focus the show/hide button
      const toggleButton = document.querySelector('[aria-label*="password"]')
      if (toggleButton) {
        toggleButton.focus()
        await user.keyboard('{Enter}')
        
        // Password should now be visible
        expect(passwordInput).toHaveAttribute('type', 'text')
        
        // Toggle back
        await user.keyboard(' ')
        expect(passwordInput).toHaveAttribute('type', 'password')
      }
    })
  })

  describe('Focus Trapping and Management', () => {
    it('traps focus within modals', async () => {
      const user = userEvent.setup()
      const mockModalProps = {
        isOpen: true,
        onClose: jest.fn(),
        onSubmit: jest.fn(),
      }
      
      render(<ForgotPasswordModal {...mockModalProps} />)
      
      // Focus should be trapped within modal
      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
      
      // Tab through modal elements
      await user.keyboard('{Tab}')
      const emailInput = screen.getByLabelText(/email/i)
      expect(emailInput).toHaveFocus()
      
      await user.keyboard('{Tab}')
      const submitButton = screen.getByRole('button', { name: /send reset link/i })
      expect(submitButton).toHaveFocus()
      
      await user.keyboard('{Tab}')
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toHaveFocus()
      
      // Tab should wrap back to first element
      await user.keyboard('{Tab}')
      expect(emailInput).toHaveFocus()
    })

    it('restores focus after modal closes', async () => {
      const user = userEvent.setup()
      render(<ParentAuth />)
      
      // Focus on forgot password link
      const signInTab = screen.getByRole('tab', { name: /sign in/i })
      await user.click(signInTab)
      
      const forgotPasswordLink = screen.getByRole('button', { name: /forgot password/i })
      forgotPasswordLink.focus()
      
      // Open modal
      await user.keyboard('{Enter}')
      
      // Modal should be open and focused
      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
      
      // Close modal with Escape
      await user.keyboard('{Escape}')
      
      // Focus should return to the trigger element
      expect(forgotPasswordLink).toHaveFocus()
    })

    it('manages focus on form validation errors', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Submit form with invalid data
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      // Focus should move to first field with error
      const parentNameInput = screen.getByLabelText(/parent name/i)
      expect(parentNameInput).toHaveFocus()
      expect(parentNameInput).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('Screen Reader Navigation Support', () => {
    it('provides proper landmarks for navigation', () => {
      render(<ParentAuth />)
      
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
      
      // Skip link should be present
      const skipLink = screen.getByText(/skip to main content/i)
      expect(skipLink).toHaveAttribute('href', '#main-content')
    })

    it('provides proper heading structure for navigation', () => {
      render(<ParentAuth />)
      
      // Should have proper heading hierarchy
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent(/parent zone/i)
      
      const h3Elements = screen.getAllByRole('heading', { level: 3 })
      expect(h3Elements.length).toBeGreaterThan(0)
    })

    it('provides proper form structure for screen readers', () => {
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // All inputs should have proper labels
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName()
      })
      
      // Password inputs
      const passwordInputs = document.querySelectorAll('input[type="password"]')
      passwordInputs.forEach(input => {
        expect(input).toHaveAccessibleName()
      })
      
      // Checkboxes should have proper labels
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAccessibleName()
      })
    })

    it('announces form validation errors to screen readers', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      const emailInput = screen.getByLabelText(/email/i)
      
      // Trigger validation error
      await user.type(emailInput, 'invalid')
      await user.tab()
      
      // Error should be announced via aria-live region or role="alert"
      const errorMessage = screen.getByText(/please enter a valid email address/i)
      expect(errorMessage).toBeInTheDocument()
      
      // Error should be associated with input
      expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('Keyboard Navigation Edge Cases', () => {
    it('handles disabled elements correctly', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Submit button should be disabled initially
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toBeDisabled()
      
      // Disabled elements should not receive focus via tab
      await user.keyboard('{Tab}')
      expect(submitButton).not.toHaveFocus()
    })

    it('handles dynamic content changes', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Switch tabs and verify focus management
      const signInTab = screen.getByRole('tab', { name: /sign in/i })
      await user.click(signInTab)
      
      // New form content should be focusable
      await user.keyboard('{Tab}')
      expect(screen.getByLabelText(/email/i)).toHaveFocus()
    })

    it('maintains accessibility during loading states', async () => {
      const user = userEvent.setup()
      const slowSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<AuthTabs {...mockAuthTabsProps} onCreateAccount={slowSubmit} />)
      
      // Fill valid form
      await user.type(screen.getByLabelText(/parent name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
      await user.click(screen.getByRole('checkbox'))
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      // Button should show loading state and remain accessible
      expect(screen.getByText(/creating account/i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveAccessibleName()
    })
  })
})