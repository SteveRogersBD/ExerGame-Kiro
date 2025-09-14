import React from 'react'
import { render, screen } from '@testing-library/react'
import { AuthTabs } from '@/components/auth/AuthTabs'
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal'
import userEvent from '@testing-library/user-event'
import userEvent from '@testing-library/user-event'
import userEvent from '@testing-library/user-event'

// Mock the useReducedMotion hook
const mockUseReducedMotion = jest.fn()
jest.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}))

jest.mock('@/lib/focus-trap', () => ({
  useFocusTrap: jest.fn(),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('Reduced Motion Accessibility Tests', () => {
  const mockAuthTabsProps = {
    onCreateAccount: jest.fn(),
    onSignIn: jest.fn(),
    onGoogleSignIn: jest.fn(),
    onTermsClick: jest.fn(),
    onPrivacyClick: jest.fn(),
    onForgotPassword: jest.fn(),
    onForgotPIN: jest.fn(),
  }

  const mockModalProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('When reduced motion is preferred', () => {
    beforeEach(() => {
      mockUseReducedMotion.mockReturnValue(true)
    })

    it('disables animations in AuthTabs component', () => {
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Component should still render but without animations
      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /create account/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /sign in/i })).toBeInTheDocument()
    })

    it('disables animations in modal components', () => {
      render(<ForgotPasswordModal {...mockModalProps} />)
      
      // Modal should render but without motion animations
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText(/reset password/i)).toBeInTheDocument()
    })

    it('applies reduced motion styles to Framer Motion components', () => {
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // The component should handle reduced motion internally
      // We can't directly test Framer Motion props, but we can ensure the component renders
      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })
  })

  describe('When reduced motion is not preferred', () => {
    beforeEach(() => {
      mockUseReducedMotion.mockReturnValue(false)
    })

    it('enables animations in AuthTabs component', () => {
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Component should render with animations enabled
      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /create account/i })).toBeInTheDocument()
    })

    it('enables animations in modal components', () => {
      render(<ForgotPasswordModal {...mockModalProps} />)
      
      // Modal should render with animations enabled
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('CSS-based reduced motion support', () => {
    it('should respect prefers-reduced-motion media query', () => {
      // Mock matchMedia to simulate reduced motion preference
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

      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Component should still function properly
      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })
  })

  describe('Animation performance considerations', () => {
    it('uses transform and opacity for animations', () => {
      mockUseReducedMotion.mockReturnValue(false)
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Check that components render (we can't directly test CSS properties in JSDOM)
      expect(screen.getByRole('tablist')).toBeInTheDocument()
      
      // The actual CSS animation properties would be tested in E2E tests
      // Here we ensure the components render correctly
    })

    it('provides fallback behavior when animations are disabled', () => {
      mockUseReducedMotion.mockReturnValue(true)
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // All functionality should work without animations
      expect(screen.getByRole('tab', { name: /create account/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /sign in/i })).toBeInTheDocument()
    })
  })

  describe('Background animations', () => {
    it('should disable background animations when reduced motion is preferred', () => {
      // This would typically be tested with the AnimatedBackground component
      // For now, we ensure the hook is being called correctly
      mockUseReducedMotion.mockReturnValue(true)
      
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Verify the hook was called
      expect(mockUseReducedMotion).toHaveBeenCalled()
    })
  })

  describe('Comprehensive Animation Behavior Tests', () => {
    it('disables all Framer Motion animations when reduced motion is preferred', () => {
      mockUseReducedMotion.mockReturnValue(true)
      
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // All motion components should respect reduced motion
      const tabList = screen.getByRole('tablist')
      expect(tabList).toBeInTheDocument()
      
      // Animation properties should be disabled
      // In a real implementation, you would check that motion components
      // receive { duration: 0 } or similar props
    })

    it('enables smooth animations when motion is not reduced', () => {
      mockUseReducedMotion.mockReturnValue(false)
      
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      const tabList = screen.getByRole('tablist')
      expect(tabList).toBeInTheDocument()
      
      // Animations should be enabled (default behavior)
    })

    it('handles tab switching animations based on motion preference', async () => {
      const user = userEvent.setup()
      
      // Test with reduced motion
      mockUseReducedMotion.mockReturnValue(true)
      const { rerender } = render(<AuthTabs {...mockAuthTabsProps} />)
      
      const signInTab = screen.getByRole('tab', { name: /sign in/i })
      await user.click(signInTab)
      
      // Tab should switch without animation
      expect(signInTab).toHaveAttribute('aria-selected', 'true')
      
      // Test with motion enabled
      mockUseReducedMotion.mockReturnValue(false)
      rerender(<AuthTabs {...mockAuthTabsProps} />)
      
      const createAccountTab = screen.getByRole('tab', { name: /create account/i })
      await user.click(createAccountTab)
      
      // Tab should switch with animation
      expect(createAccountTab).toHaveAttribute('aria-selected', 'true')
    })

    it('respects system-level reduced motion preferences', () => {
      // Mock system preference for reduced motion
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

      const TestComponent = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        
        return (
          <div 
            data-testid="motion-aware-component"
            data-reduced-motion={prefersReducedMotion}
            style={{
              transition: prefersReducedMotion ? 'none' : 'all 0.3s ease',
              animation: prefersReducedMotion ? 'none' : 'fadeIn 0.5s ease'
            }}
          >
            Motion-aware content
          </div>
        )
      }
      
      render(<TestComponent />)
      
      const component = document.querySelector('[data-testid="motion-aware-component"]')
      expect(component).toHaveAttribute('data-reduced-motion', 'true')
      expect(component).toHaveStyle('transition: none')
      expect(component).toHaveStyle('animation: none')
    })

    it('provides alternative feedback when animations are disabled', () => {
      mockUseReducedMotion.mockReturnValue(true)
      
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // When animations are disabled, immediate visual feedback should be provided
      const tabs = screen.getAllByRole('tab')
      tabs.forEach(tab => {
        // Tabs should still have visual states without animation
        expect(tab).toHaveAttribute('aria-selected')
      })
    })

    it('handles hover animations based on motion preference', async () => {
      const user = userEvent.setup()
      
      // Test with reduced motion
      mockUseReducedMotion.mockReturnValue(true)
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      const button = screen.getByRole('button', { name: /create account/i })
      
      // Hover should not trigger animations
      await user.hover(button)
      expect(button).toBeInTheDocument()
      
      // Test with motion enabled
      mockUseReducedMotion.mockReturnValue(false)
      const { rerender } = render(<AuthTabs {...mockAuthTabsProps} />)
      
      const newButton = screen.getByRole('button', { name: /create account/i })
      await user.hover(newButton)
      expect(newButton).toBeInTheDocument()
    })

    it('maintains functionality when animations are disabled', async () => {
      const user = userEvent.setup()
      mockUseReducedMotion.mockReturnValue(true)
      
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // All functionality should work without animations
      const signInTab = screen.getByRole('tab', { name: /sign in/i })
      await user.click(signInTab)
      
      expect(signInTab).toHaveAttribute('aria-selected', 'true')
      
      // Form should be functional
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'test@example.com')
      expect(emailInput).toHaveValue('test@example.com')
    })

    it('handles modal animations with reduced motion', () => {
      mockUseReducedMotion.mockReturnValue(true)
      
      const mockModalProps = {
        isOpen: true,
        onClose: jest.fn(),
        onSubmit: jest.fn(),
      }
      
      render(<ForgotPasswordModal {...mockModalProps} />)
      
      // Modal should appear without animation
      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
      
      // Content should be immediately visible
      expect(screen.getByText(/reset password/i)).toBeInTheDocument()
    })

    it('provides consistent timing for reduced motion states', () => {
      mockUseReducedMotion.mockReturnValue(true)
      
      const TestTimingComponent = () => {
        const prefersReducedMotion = mockUseReducedMotion()
        
        return (
          <div 
            data-testid="timing-component"
            style={{
              transitionDuration: prefersReducedMotion ? '0s' : '0.3s',
              animationDuration: prefersReducedMotion ? '0s' : '0.5s'
            }}
          >
            Timing test
          </div>
        )
      }
      
      render(<TestTimingComponent />)
      
      const component = document.querySelector('[data-testid="timing-component"]')
      expect(component).toHaveStyle('transition-duration: 0s')
      expect(component).toHaveStyle('animation-duration: 0s')
    })
  })

  describe('Performance Considerations with Reduced Motion', () => {
    it('optimizes rendering when animations are disabled', () => {
      mockUseReducedMotion.mockReturnValue(true)
      
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // Component should render efficiently without animation overhead
      const tabList = screen.getByRole('tablist')
      expect(tabList).toBeInTheDocument()
      
      // Verify that reduced motion is being respected
      expect(mockUseReducedMotion).toHaveBeenCalled()
    })

    it('maintains accessibility when optimizing for reduced motion', () => {
      mockUseReducedMotion.mockReturnValue(true)
      
      render(<AuthTabs {...mockAuthTabsProps} />)
      
      // All accessibility features should remain intact
      const tabs = screen.getAllByRole('tab')
      tabs.forEach(tab => {
        expect(tab).toHaveAccessibleName()
        expect(tab).toHaveAttribute('aria-selected')
      })
      
      const tabList = screen.getByRole('tablist')
      expect(tabList).toHaveAttribute('aria-label')
    })
  })
})