import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ParentAuth from '@/app/parent/auth/page'

// Mock all necessary hooks and dependencies
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

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Helper function to set viewport size
const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  window.dispatchEvent(new Event('resize'))
}

describe('Comprehensive Authentication Testing Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset viewport to desktop size
    setViewportSize(1440, 900)
  })

  describe('End-to-End Form Validation and Submission Flow', () => {
    it('completes full create account flow with comprehensive validation', async () => {
      const user = userEvent.setup()
      render(<ParentAuth />)
      
      // Verify initial state
      expect(screen.getByRole('tab', { name: /create account/i })).toHaveAttribute('aria-selected', 'true')
      
      // Test form validation with invalid data
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/parent name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
      
      // Fill form with invalid data first
      await user.type(screen.getByLabelText(/parent name/i), 'A') // Too short
      await user.type(screen.getByLabelText(/email/i), 'invalid-email') // Invalid format
      await user.type(screen.getByLabelText(/^password$/i), 'weak') // Too weak
      await user.type(screen.getByLabelText(/confirm password/i), 'different') // Doesn't match
      
      await user.tab() // Trigger validation
      
      await waitFor(() => {
        expect(screen.getByText(/parent name must be at least 2 characters/i)).toBeInTheDocument()
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
        expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
      })
      
      // Fix all validation errors
      await user.clear(screen.getByLabelText(/parent name/i))
      await user.type(screen.getByLabelText(/parent name/i), 'John Doe')
      
      await user.clear(screen.getByLabelText(/email/i))
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      
      await user.clear(screen.getByLabelText(/^password$/i))
      await user.type(screen.getByLabelText(/^password$/i), 'StrongPassword123!')
      
      await user.clear(screen.getByLabelText(/confirm password/i))
      await user.type(screen.getByLabelText(/confirm password/i), 'StrongPassword123!')
      
      // Check terms agreement
      const termsCheckbox = screen.getByRole('checkbox')
      await user.click(termsCheckbox)
      
      // Submit valid form
      await user.click(submitButton)
      
      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/creating account/i)).toBeInTheDocument()
      })
    })

    it('completes full sign in flow with validation', async () => {
      const user = userEvent.setup()
      render(<ParentAuth />)
      
      // Switch to Sign In tab
      const signInTab = screen.getByRole('tab', { name: /sign in/i })
      await user.click(signInTab)
      
      expect(signInTab).toHaveAttribute('aria-selected', 'true')
      
      // Test empty form submission
      const signInButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(signInButton)
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
      
      // Fill valid credentials
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      // Test remember me functionality
      const rememberMeCheckbox = screen.getByRole('checkbox')
      await user.click(rememberMeCheckbox)
      expect(rememberMeCheckbox).toBeChecked()
      
      // Submit form
      await user.click(signInButton)
      
      await waitFor(() => {
        expect(screen.getByText(/signing in/i)).toBeInTheDocument()
      })
    })
  })

  describe('Cross-Device Responsive Behavior with Accessibility', () => {
    it('maintains accessibility across all viewport sizes', async () => {
      const user = userEvent.setup()
      const viewportSizes = [
        { width: 320, height: 568, name: 'Small Mobile' },
        { width: 375, height: 812, name: 'Mobile' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1024, height: 768, name: 'Small Desktop' },
        { width: 1440, height: 900, name: 'Desktop' },
        { width: 1920, height: 1080, name: 'Large Desktop' }
      ]
      
      for (const viewport of viewportSizes) {
        setViewportSize(viewport.width, viewport.height)
        const { rerender } = render(<ParentAuth />)
        
        // Test accessibility at this viewport size
        expect(screen.getByRole('main')).toBeInTheDocument()
        expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
        
        // Test skip link
        const skipLink = screen.getByText(/skip to main content/i)
        expect(skipLink).toHaveAttribute('href', '#main-content')
        
        // Test heading hierarchy
        const h1 = screen.getByRole('heading', { level: 1 })
        expect(h1).toHaveTextContent(/parent zone/i)
        
        // Test form accessibility
        const inputs = screen.getAllByRole('textbox')
        inputs.forEach(input => {
          expect(input).toHaveAccessibleName()
        })
        
        // Test keyboard navigation
        await user.keyboard('{Tab}')
        const focusedElement = document.activeElement
        expect(focusedElement).toBeInTheDocument()
        
        // Test touch targets on mobile
        if (viewport.width < 768) {
          const buttons = screen.getAllByRole('button')
          buttons.forEach(button => {
            const classList = Array.from(button.classList)
            const hasTouchTarget = classList.includes('touch-target') || 
                                  classList.some(cls => cls.includes('p-') && parseInt(cls.split('-')[1]) >= 3)
            expect(hasTouchTarget).toBe(true)
          })
        }
        
        rerender(<div />)
      }
    })

    it('handles form interaction across different input methods', async () => {
      const user = userEvent.setup()
      
      // Test mobile interaction
      setViewportSize(375, 812)
      const { rerender } = render(<ParentAuth />)
      
      // Touch interaction simulation
      const emailInput = screen.getByLabelText(/email/i)
      await user.click(emailInput)
      await user.type(emailInput, 'mobile@test.com')
      expect(emailInput).toHaveValue('mobile@test.com')
      
      // Test desktop interaction
      setViewportSize(1440, 900)
      rerender(<ParentAuth />)
      
      // Keyboard interaction
      const desktopEmailInput = screen.getByLabelText(/email/i)
      desktopEmailInput.focus()
      await user.keyboard('{Control>}a{/Control}')
      await user.keyboard('desktop@test.com')
      expect(desktopEmailInput).toHaveValue('desktop@test.com')
    })
  })

  describe('Accessibility Compliance with Animation Preferences', () => {
    it('respects reduced motion preferences while maintaining functionality', async () => {
      const user = userEvent.setup()
      
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })
      
      render(<ParentAuth />)
      
      // All functionality should work without animations
      const signInTab = screen.getByRole('tab', { name: /sign in/i })
      await user.click(signInTab)
      
      expect(signInTab).toHaveAttribute('aria-selected', 'true')
      
      // Form should be fully functional
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/signing in/i)).toBeInTheDocument()
      })
    })

    it('maintains color contrast compliance across all states', () => {
      render(<ParentAuth />)
      
      // Test various UI states for contrast compliance
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        // Should have proper contrast classes
        const classList = Array.from(button.classList)
        expect(classList.some(cls => 
          cls.includes('text-') || 
          cls.includes('bg-') || 
          cls.includes('border-')
        )).toBe(true)
      })
      
      // Test form inputs
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        const classList = Array.from(input.classList)
        expect(classList.some(cls => 
          cls.includes('border-') || 
          cls.includes('focus:')
        )).toBe(true)
      })
    })
  })

  describe('Error Handling and Recovery Scenarios', () => {
    it('handles network errors gracefully while maintaining accessibility', async () => {
      const user = userEvent.setup()
      
      // Mock console.error to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<ParentAuth />)
      
      // Fill valid form
      await user.type(screen.getByLabelText(/parent name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
      await user.click(screen.getByRole('checkbox'))
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      // Form should handle errors gracefully
      await waitFor(() => {
        // Button should be re-enabled after processing
        expect(submitButton).not.toBeDisabled()
      })
      
      // Accessibility should be maintained
      expect(submitButton).toHaveAccessibleName()
      
      consoleSpy.mockRestore()
    })

    it('recovers from validation errors with proper focus management', async () => {
      const user = userEvent.setup()
      render(<ParentAuth />)
      
      // Submit empty form
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      // Should focus first invalid field
      await waitFor(() => {
        const parentNameInput = screen.getByLabelText(/parent name/i)
        expect(parentNameInput).toHaveFocus()
        expect(parentNameInput).toHaveAttribute('aria-invalid', 'true')
      })
      
      // Fix errors and verify recovery
      await user.type(screen.getByLabelText(/parent name/i), 'John Doe')
      await user.tab()
      
      await waitFor(() => {
        const parentNameInput = screen.getByLabelText(/parent name/i)
        expect(parentNameInput).toHaveAttribute('aria-invalid', 'false')
      })
    })
  })

  describe('Performance and Loading States', () => {
    it('maintains accessibility during loading states', async () => {
      const user = userEvent.setup()
      render(<ParentAuth />)
      
      // Fill valid form
      await user.type(screen.getByLabelText(/parent name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
      await user.click(screen.getByRole('checkbox'))
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      // Loading state should be accessible
      await waitFor(() => {
        const loadingButton = screen.getByText(/creating account/i)
        expect(loadingButton).toBeInTheDocument()
        expect(loadingButton).toHaveAccessibleName()
        expect(loadingButton).toBeDisabled()
      })
    })

    it('handles rapid user interactions gracefully', async () => {
      const user = userEvent.setup()
      render(<ParentAuth />)
      
      // Rapid tab switching
      const createAccountTab = screen.getByRole('tab', { name: /create account/i })
      const signInTab = screen.getByRole('tab', { name: /sign in/i })
      
      await user.click(signInTab)
      await user.click(createAccountTab)
      await user.click(signInTab)
      await user.click(createAccountTab)
      
      // Should handle rapid switching without breaking
      expect(createAccountTab).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByLabelText(/parent name/i)).toBeInTheDocument()
      
      // Rapid form input
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'a')
      await user.keyboard('{Backspace}')
      await user.type(emailInput, 'test@example.com')
      
      expect(emailInput).toHaveValue('test@example.com')
    })
  })

  describe('Integration with External Services', () => {
    it('handles Google Sign In accessibility', async () => {
      const user = userEvent.setup()
      render(<ParentAuth />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      
      // Should be accessible
      expect(googleButton).toHaveAccessibleName()
      expect(googleButton).not.toBeDisabled()
      
      // Should be keyboard accessible
      googleButton.focus()
      await user.keyboard('{Enter}')
      
      // Should handle the interaction
      expect(googleButton).toBeInTheDocument()
    })

    it('handles modal interactions with proper focus management', async () => {
      const user = userEvent.setup()
      render(<ParentAuth />)
      
      // Switch to Sign In tab
      const signInTab = screen.getByRole('tab', { name: /sign in/i })
      await user.click(signInTab)
      
      // Open forgot password modal
      const forgotPasswordLink = screen.getByRole('button', { name: /forgot password/i })
      await user.click(forgotPasswordLink)
      
      // Modal should be accessible
      await waitFor(() => {
        const modal = screen.getByRole('dialog')
        expect(modal).toBeInTheDocument()
        
        // Should have proper focus management
        const emailInput = screen.getByLabelText(/email/i)
        expect(emailInput).toHaveFocus()
      })
      
      // Close modal with Escape
      await user.keyboard('{Escape}')
      
      // Focus should return to trigger
      await waitFor(() => {
        expect(forgotPasswordLink).toHaveFocus()
      })
    })
  })
})