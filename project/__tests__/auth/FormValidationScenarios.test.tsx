import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthTabs } from '@/components/auth/AuthTabs'
import { SignInForm } from '@/components/auth/SignInForm'

// Mock hooks
jest.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}))

describe('Comprehensive Form Validation Scenarios', () => {
  const mockAuthTabsProps = {
    onCreateAccount: jest.fn(),
    onSignIn: jest.fn(),
    onGoogleSignIn: jest.fn(),
    onTermsClick: jest.fn(),
    onPrivacyClick: jest.fn(),
    onForgotPassword: jest.fn(),
    onForgotPIN: jest.fn(),
  }

  const mockSignInProps = {
    onSubmit: jest.fn(),
    onSwitchToCreateAccount: jest.fn(),
    onForgotPassword: jest.fn(),
    onForgotPIN: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Cross-Form Validation Consistency', () => {
    it('maintains consistent email validation across forms', async () => {
      const user = userEvent.setup()
      
      // Test in AuthTabs (Create Account)
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      const createAccountEmailInput = screen.getByLabelText(/email/i)
      await user.type(createAccountEmailInput, 'invalid-email')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
      
      // Switch to Sign In tab
      const signInTab = screen.getByRole('tab', { name: /sign in/i })
      await user.click(signInTab)
      
      await waitFor(() => {
        const signInEmailInput = screen.getByLabelText(/email/i)
        expect(signInEmailInput).toBeInTheDocument()
      })
      
      // Test same validation in Sign In form
      const signInEmailInput = screen.getByLabelText(/email/i)
      await user.type(signInEmailInput, 'invalid-email')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
    })

    it('handles form switching without losing validation state', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Fill Create Account form with invalid data
      await user.type(screen.getByLabelText(/parent name/i), 'A')
      await user.type(screen.getByLabelText(/email/i), 'invalid')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/parent name must be at least 2 characters/i)).toBeInTheDocument()
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
      
      // Switch to Sign In tab
      const signInTab = screen.getByRole('tab', { name: /sign in/i })
      await user.click(signInTab)
      
      // Switch back to Create Account tab
      const createAccountTab = screen.getByRole('tab', { name: /create account/i })
      await user.click(createAccountTab)
      
      // Form should be reset (this is expected behavior)
      expect(screen.queryByText(/parent name must be at least 2 characters/i)).not.toBeInTheDocument()
    })
  })

  describe('Edge Case Input Scenarios', () => {
    it('handles special characters in form inputs', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      const parentNameInput = screen.getByLabelText(/parent name/i)
      
      // Test various special characters
      const specialCharTests = [
        { input: 'José María', shouldPass: true },
        { input: "O'Connor-Smith", shouldPass: true },
        { input: 'Jean-Pierre', shouldPass: true },
        { input: 'Name@123', shouldPass: false },
        { input: 'Name#$%', shouldPass: false },
        { input: 'Name123', shouldPass: false }
      ]
      
      for (const test of specialCharTests) {
        await user.clear(parentNameInput)
        await user.type(parentNameInput, test.input)
        await user.tab()
        
        if (test.shouldPass) {
          await waitFor(() => {
            expect(screen.queryByText(/parent name can only contain/i)).not.toBeInTheDocument()
          })
        } else {
          await waitFor(() => {
            expect(screen.getByText(/parent name can only contain/i)).toBeInTheDocument()
          })
        }
      }
    })

    it('handles copy-paste operations with validation', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      const emailInput = screen.getByLabelText(/email/i)
      
      // Simulate pasting invalid email
      await user.click(emailInput)
      await user.keyboard('{Control>}a{/Control}')
      await user.keyboard('invalid-pasted-email')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
      
      // Simulate pasting valid email
      await user.click(emailInput)
      await user.keyboard('{Control>}a{/Control}')
      await user.keyboard('valid@pasted.com')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument()
      })
    })

    it('handles rapid input changes', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      const passwordInput = screen.getByLabelText(/^password$/i)
      
      // Rapidly type and delete characters
      await user.type(passwordInput, 'a')
      await user.keyboard('{Backspace}')
      await user.type(passwordInput, 'ab')
      await user.keyboard('{Backspace}{Backspace}')
      await user.type(passwordInput, 'ValidPassword123!')
      
      await user.tab()
      
      // Should handle the final valid state
      await waitFor(() => {
        expect(screen.queryByText(/password must be at least 8 characters/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Submission Edge Cases', () => {
    it('prevents double submission', async () => {
      const user = userEvent.setup()
      const mockSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<AuthTabs {...mockAuthTabsProps} onCreateAccount={mockSubmit} />)
      
      // Fill valid form
      await user.type(screen.getByLabelText(/parent name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
      await user.click(screen.getByRole('checkbox'))
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      
      // Click submit multiple times rapidly
      await user.click(submitButton)
      await user.click(submitButton)
      await user.click(submitButton)
      
      // Should only be called once
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledTimes(1)
      })
    })

    it('handles form submission with network errors', async () => {
      const user = userEvent.setup()
      const mockSubmit = jest.fn(() => Promise.reject(new Error('Network error')))
      
      render(<AuthTabs {...mockAuthTabsProps} onCreateAccount={mockSubmit} />)
      
      // Fill valid form
      await user.type(screen.getByLabelText(/parent name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
      await user.click(screen.getByRole('checkbox'))
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      // Form should handle the error gracefully
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled()
      })
      
      // Button should be re-enabled after error
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled()
      })
    })
  })

  describe('Sign In Form Specific Validation', () => {
    it('validates sign in form with various scenarios', async () => {
      const user = userEvent.setup()
      render(<SignInForm {...mockSignInProps} />)
      
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      // Test empty form submission
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
      
      // Test with valid email but empty password
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
      
      // Test with valid credentials
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockSignInProps.onSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: false
        })
      })
    })

    it('handles remember me checkbox correctly', async () => {
      const user = userEvent.setup()
      render(<SignInForm {...mockSignInProps} />)
      
      // Fill form and check remember me
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      const rememberMeCheckbox = screen.getByRole('checkbox')
      await user.click(rememberMeCheckbox)
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockSignInProps.onSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: true
        })
      })
    })
  })

  describe('Accessibility in Form Validation', () => {
    it('provides proper ARIA attributes for validation errors', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      const emailInput = screen.getByLabelText(/email/i)
      
      // Trigger validation error
      await user.type(emailInput, 'invalid')
      await user.tab()
      
      await waitFor(() => {
        expect(emailInput).toHaveAttribute('aria-invalid', 'true')
      })
      
      // Fix the error
      await user.clear(emailInput)
      await user.type(emailInput, 'valid@example.com')
      await user.tab()
      
      await waitFor(() => {
        expect(emailInput).toHaveAttribute('aria-invalid', 'false')
      })
    })

    it('associates error messages with form fields', async () => {
      const user = userEvent.setup()
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      const parentNameInput = screen.getByLabelText(/parent name/i)
      
      // Trigger validation error
      await user.type(parentNameInput, 'A')
      await user.tab()
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/parent name must be at least 2 characters/i)
        expect(errorMessage).toBeInTheDocument()
        
        // Error should be associated with the input
        const errorId = errorMessage.getAttribute('id')
        if (errorId) {
          expect(parentNameInput).toHaveAttribute('aria-describedby', expect.stringContaining(errorId))
        }
      })
    })
  })
})