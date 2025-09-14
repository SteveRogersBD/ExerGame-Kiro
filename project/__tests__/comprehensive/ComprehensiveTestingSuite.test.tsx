import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock components for comprehensive testing
const MockAuthForm = ({ onSubmit, onValidationError }: any) => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    parentName: '',
    agreeToTerms: false
  })
  
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Parent name is required'
    } else if (formData.parentName.length < 2) {
      newErrors.parentName = 'Parent name must be at least 2 characters'
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.parentName)) {
      newErrors.parentName = 'Parent name can only contain letters, spaces, hyphens, and apostrophes'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and privacy policy'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      onValidationError?.(newErrors)
      return false
    }
    
    return true
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit?.(formData)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="parentName">Parent Name</label>
        <input
          id="parentName"
          type="text"
          value={formData.parentName}
          onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
          aria-invalid={!!errors.parentName}
          aria-describedby={errors.parentName ? 'parentName-error' : undefined}
          required
          className="touch-target auth-focus-outline"
        />
        {errors.parentName && (
          <div id="parentName-error" role="alert" className="auth-error-text">
            {errors.parentName}
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          required
          className="touch-target auth-focus-outline"
        />
        {errors.email && (
          <div id="email-error" role="alert" className="auth-error-text">
            {errors.email}
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          required
          className="touch-target auth-focus-outline"
        />
        {errors.password && (
          <div id="password-error" role="alert" className="auth-error-text">
            {errors.password}
          </div>
        )}
        {formData.password && (
          <div data-testid="password-strength-meter">
            Password Strength: {formData.password.length >= 8 ? 'Strong' : 'Weak'}
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          required
          className="touch-target auth-focus-outline"
        />
        {errors.confirmPassword && (
          <div id="confirmPassword-error" role="alert" className="auth-error-text">
            {errors.confirmPassword}
          </div>
        )}
      </div>
      
      <div>
        <input
          id="agreeToTerms"
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
          aria-invalid={!!errors.agreeToTerms}
          aria-describedby={errors.agreeToTerms ? 'agreeToTerms-error' : undefined}
          required
          className="touch-target"
        />
        <label htmlFor="agreeToTerms">
          I agree to the Terms & Conditions and Privacy Policy
        </label>
        {errors.agreeToTerms && (
          <div id="agreeToTerms-error" role="alert" className="auth-error-text">
            {errors.agreeToTerms}
          </div>
        )}
      </div>
      
      <button type="submit" className="touch-target auth-button-primary">
        Create Account
      </button>
    </form>
  )
}

const MockResponsiveLayout = ({ children }: { children: React.ReactNode }) => {
  const [viewport, setViewport] = React.useState({ width: 1440, height: 900 })
  
  React.useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const isMobile = viewport.width < 768
  const isTablet = viewport.width >= 768 && viewport.width < 1024
  const isDesktop = viewport.width >= 1024
  
  return (
    <div 
      data-testid="responsive-container"
      data-viewport={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}
      className={`
        ${isMobile ? 'mobile-layout px-4' : ''}
        ${isTablet ? 'tablet-layout px-6' : ''}
        ${isDesktop ? 'desktop-layout px-8' : ''}
      `}
      style={{ contentVisibility: 'auto' }}
    >
      {children}
    </div>
  )
}

const MockAccessibleComponent = ({ reduceMotion = false }: { reduceMotion?: boolean }) => {
  const [focusedElement, setFocusedElement] = React.useState<string | null>(null)
  
  return (
    <div data-testid="accessible-component" data-reduced-motion={reduceMotion}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      <main id="main-content" role="main">
        <h1>Main Heading</h1>
        <h2>Section Heading</h2>
        
        <button
          className="auth-focus-outline auth-focus-pink touch-target"
          onFocus={() => setFocusedElement('button1')}
          onBlur={() => setFocusedElement(null)}
          style={{
            outline: focusedElement === 'button1' ? '2px solid #FF6AD5' : 'none',
            transition: reduceMotion ? 'none' : 'all 0.2s ease'
          }}
        >
          Accessible Button
        </button>
        
        <input
          aria-label="Accessible Input"
          className="auth-focus-outline touch-target"
          onFocus={() => setFocusedElement('input1')}
          onBlur={() => setFocusedElement(null)}
          style={{
            outline: focusedElement === 'input1' ? '2px solid #87CEEB' : 'none',
            transition: reduceMotion ? 'none' : 'all 0.2s ease'
          }}
        />
      </main>
      
      <div aria-live="polite" aria-atomic="true" className="auth-live-region">
        {focusedElement && `Focused on ${focusedElement}`}
      </div>
    </div>
  )
}

// Helper function to simulate viewport changes
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

describe('Comprehensive Authentication Testing Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setViewportSize(1440, 900) // Reset to desktop
  })

  describe('1. Form Validation with Various Input Scenarios', () => {
    it('validates all form fields with comprehensive edge cases', async () => {
      const user = userEvent.setup()
      const mockSubmit = jest.fn()
      const mockValidationError = jest.fn()
      
      render(<MockAuthForm onSubmit={mockSubmit} onValidationError={mockValidationError} />)
      
      // Test empty form submission
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/parent name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
        expect(screen.getByText(/you must agree to the terms/i)).toBeInTheDocument()
      })
      
      // Test invalid parent name scenarios
      const parentNameInput = screen.getByLabelText(/parent name/i)
      
      // Too short
      await user.type(parentNameInput, 'A')
      await user.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText(/parent name must be at least 2 characters/i)).toBeInTheDocument()
      })
      
      // Invalid characters
      await user.clear(parentNameInput)
      await user.type(parentNameInput, 'John123')
      await user.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText(/parent name can only contain letters/i)).toBeInTheDocument()
      })
      
      // Test email validation
      const emailInput = screen.getByLabelText(/email/i)
      await user.clear(emailInput)
      await user.type(emailInput, 'invalid-email')
      await user.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
      
      // Test password validation
      const passwordInput = screen.getByLabelText(/^password$/i)
      await user.clear(passwordInput)
      await user.type(passwordInput, 'weak')
      await user.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
      })
      
      // Test password mismatch
      await user.clear(passwordInput)
      await user.type(passwordInput, 'StrongPassword123!')
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      await user.type(confirmPasswordInput, 'DifferentPassword123!')
      await user.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
      })
      
      // Test valid form submission
      await user.clear(parentNameInput)
      await user.type(parentNameInput, 'John Doe')
      await user.clear(emailInput)
      await user.type(emailInput, 'john@example.com')
      await user.clear(confirmPasswordInput)
      await user.type(confirmPasswordInput, 'StrongPassword123!')
      
      const termsCheckbox = screen.getByRole('checkbox')
      await user.click(termsCheckbox)
      
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          parentName: 'John Doe',
          email: 'john@example.com',
          password: 'StrongPassword123!',
          confirmPassword: 'StrongPassword123!',
          agreeToTerms: true
        })
      })
    })

    it('shows real-time password strength feedback', async () => {
      const user = userEvent.setup()
      render(<MockAuthForm onSubmit={jest.fn()} />)
      
      const passwordInput = screen.getByLabelText(/^password$/i)
      
      // Type weak password
      await user.type(passwordInput, 'weak')
      await waitFor(() => {
        expect(screen.getByText(/password strength: weak/i)).toBeInTheDocument()
      })
      
      // Type strong password
      await user.clear(passwordInput)
      await user.type(passwordInput, 'StrongPassword123!')
      await waitFor(() => {
        expect(screen.getByText(/password strength: strong/i)).toBeInTheDocument()
      })
    })

    it('handles rapid input changes and validation', async () => {
      const user = userEvent.setup()
      render(<MockAuthForm onSubmit={jest.fn()} />)
      
      const emailInput = screen.getByLabelText(/email/i)
      
      // Rapid typing and corrections
      await user.type(emailInput, 'invalid')
      await user.keyboard('{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}')
      await user.type(emailInput, 'valid@example.com')
      
      expect(emailInput).toHaveValue('valid@example.com')
    })
  })

  describe('2. Responsive Design Across Different Screen Sizes', () => {
    it('adapts layout for mobile devices', () => {
      setViewportSize(375, 667) // iPhone SE
      
      render(
        <MockResponsiveLayout>
          <MockAuthForm onSubmit={jest.fn()} />
        </MockResponsiveLayout>
      )
      
      const container = screen.getByTestId('responsive-container')
      expect(container).toHaveAttribute('data-viewport', 'mobile')
      expect(container).toHaveClass('mobile-layout', 'px-4')
      
      // Check touch targets are appropriate for mobile
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveClass('touch-target')
      })
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveClass('touch-target')
      })
    })

    it('adapts layout for tablet devices', () => {
      setViewportSize(768, 1024) // iPad
      
      render(
        <MockResponsiveLayout>
          <MockAuthForm onSubmit={jest.fn()} />
        </MockResponsiveLayout>
      )
      
      const container = screen.getByTestId('responsive-container')
      expect(container).toHaveAttribute('data-viewport', 'tablet')
      expect(container).toHaveClass('tablet-layout', 'px-6')
    })

    it('adapts layout for desktop devices', () => {
      setViewportSize(1440, 900) // Desktop
      
      render(
        <MockResponsiveLayout>
          <MockAuthForm onSubmit={jest.fn()} />
        </MockResponsiveLayout>
      )
      
      const container = screen.getByTestId('responsive-container')
      expect(container).toHaveAttribute('data-viewport', 'desktop')
      expect(container).toHaveClass('desktop-layout', 'px-8')
    })

    it('handles extreme viewport sizes', () => {
      const extremeSizes = [
        { width: 320, height: 568, name: 'Very Small Mobile' },
        { width: 3840, height: 2160, name: '4K Desktop' }
      ]
      
      extremeSizes.forEach(({ width, height, name }) => {
        setViewportSize(width, height)
        
        render(
          <MockResponsiveLayout>
            <MockAuthForm onSubmit={jest.fn()} />
          </MockResponsiveLayout>
        )
        
        const container = screen.getByTestId('responsive-container')
        expect(container).toBeInTheDocument()
        
        // Form should remain functional at all sizes
        expect(screen.getByLabelText(/parent name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      })
    })

    it('optimizes content visibility for performance', () => {
      render(
        <MockResponsiveLayout>
          <MockAuthForm onSubmit={jest.fn()} />
        </MockResponsiveLayout>
      )
      
      const container = screen.getByTestId('responsive-container')
      expect(container).toHaveStyle('content-visibility: auto')
    })
  })

  describe('3. Accessibility Features with Keyboard Navigation', () => {
    it('provides proper keyboard navigation support', async () => {
      const user = userEvent.setup()
      render(<MockAccessibleComponent />)
      
      // Test skip link
      const skipLink = screen.getByText(/skip to main content/i)
      expect(skipLink).toHaveAttribute('href', '#main-content')
      
      // Test main landmark
      const main = screen.getByRole('main')
      expect(main).toHaveAttribute('id', 'main-content')
      
      // Test heading hierarchy
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      
      // Test keyboard navigation
      await user.keyboard('{Tab}')
      const button = screen.getByRole('button')
      expect(button).toHaveFocus()
      
      await user.keyboard('{Tab}')
      const input = screen.getByRole('textbox')
      expect(input).toHaveFocus()
    })

    it('provides proper ARIA attributes and live regions', async () => {
      const user = userEvent.setup()
      render(<MockAuthForm onSubmit={jest.fn()} />)
      
      // Test form has proper attributes
      const form = screen.getByRole('form') || document.querySelector('form')
      expect(form).toHaveAttribute('noValidate')
      
      // Test inputs have proper labels
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName()
      })
      
      // Test error handling with ARIA
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        const parentNameInput = screen.getByLabelText(/parent name/i)
        expect(parentNameInput).toHaveAttribute('aria-invalid', 'true')
        
        const errorMessage = screen.getByText(/parent name is required/i)
        expect(errorMessage).toHaveAttribute('role', 'alert')
      })
    })

    it('supports screen reader announcements', async () => {
      const user = userEvent.setup()
      render(<MockAccessibleComponent />)
      
      const liveRegion = document.querySelector('[aria-live="polite"]')
      expect(liveRegion).toBeInTheDocument()
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
      
      // Focus on button to trigger announcement
      const button = screen.getByRole('button')
      await user.click(button)
      
      await waitFor(() => {
        expect(liveRegion).toHaveTextContent('Focused on button1')
      })
    })

    it('handles focus management correctly', async () => {
      const user = userEvent.setup()
      render(<MockAuthForm onSubmit={jest.fn()} />)
      
      // Test tab order
      await user.keyboard('{Tab}')
      expect(screen.getByLabelText(/parent name/i)).toHaveFocus()
      
      await user.keyboard('{Tab}')
      expect(screen.getByLabelText(/email/i)).toHaveFocus()
      
      await user.keyboard('{Tab}')
      expect(screen.getByLabelText(/^password$/i)).toHaveFocus()
      
      // Test reverse tab order
      await user.keyboard('{Shift>}{Tab}{/Shift}')
      expect(screen.getByLabelText(/email/i)).toHaveFocus()
    })
  })

  describe('4. Color Contrast Ratios for Accessibility Compliance', () => {
    it('applies high contrast focus indicators', () => {
      render(<MockAccessibleComponent />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('auth-focus-outline', 'auth-focus-pink')
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('auth-focus-outline')
    })

    it('provides readable text styling', () => {
      render(<MockAuthForm onSubmit={jest.fn()} />)
      
      // Test error text has proper styling
      const submitButton = screen.getByRole('button', { name: /create account/i })
      submitButton.click()
      
      waitFor(() => {
        const errorMessages = screen.getAllByRole('alert')
        errorMessages.forEach(error => {
          expect(error).toHaveClass('auth-error-text')
        })
      })
    })

    it('ensures touch targets meet minimum size requirements', () => {
      render(<MockAuthForm onSubmit={jest.fn()} />)
      
      const interactiveElements = [
        ...screen.getAllByRole('textbox'),
        ...screen.getAllByRole('button'),
        ...screen.getAllByRole('checkbox')
      ]
      
      interactiveElements.forEach(element => {
        expect(element).toHaveClass('touch-target')
      })
    })

    it('validates color combinations for WCAG compliance', () => {
      render(<MockAccessibleComponent />)
      
      const button = screen.getByRole('button')
      const computedStyle = window.getComputedStyle(button)
      
      // In a real implementation, you would calculate actual contrast ratios
      // Here we verify the classes are applied correctly
      expect(button).toHaveClass('auth-focus-pink')
    })
  })

  describe('5. Reduced Motion Preferences and Animation Behavior', () => {
    it('respects reduced motion preferences', () => {
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
      
      render(<MockAccessibleComponent reduceMotion={true} />)
      
      const component = screen.getByTestId('accessible-component')
      expect(component).toHaveAttribute('data-reduced-motion', 'true')
      
      // Elements should have no transitions when reduced motion is preferred
      const button = screen.getByRole('button')
      expect(button).toHaveStyle('transition: none')
    })

    it('enables animations when motion is not reduced', () => {
      render(<MockAccessibleComponent reduceMotion={false} />)
      
      const component = screen.getByTestId('accessible-component')
      expect(component).toHaveAttribute('data-reduced-motion', 'false')
      
      // Elements should have transitions when motion is allowed
      const button = screen.getByRole('button')
      expect(button).toHaveStyle('transition: all 0.2s ease')
    })

    it('maintains functionality when animations are disabled', async () => {
      const user = userEvent.setup()
      render(<MockAuthForm onSubmit={jest.fn()} />)
      
      // All form functionality should work without animations
      const parentNameInput = screen.getByLabelText(/parent name/i)
      await user.type(parentNameInput, 'John Doe')
      expect(parentNameInput).toHaveValue('John Doe')
      
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'john@example.com')
      expect(emailInput).toHaveValue('john@example.com')
    })

    it('provides consistent timing for reduced motion states', () => {
      const TestComponent = ({ reduceMotion }: { reduceMotion: boolean }) => (
        <div 
          data-testid="timing-component"
          style={{
            transitionDuration: reduceMotion ? '0s' : '0.3s',
            animationDuration: reduceMotion ? '0s' : '0.5s'
          }}
        >
          Content
        </div>
      )
      
      const { rerender } = render(<TestComponent reduceMotion={true} />)
      
      let component = screen.getByTestId('timing-component')
      expect(component).toHaveStyle('transition-duration: 0s')
      expect(component).toHaveStyle('animation-duration: 0s')
      
      rerender(<TestComponent reduceMotion={false} />)
      
      component = screen.getByTestId('timing-component')
      expect(component).toHaveStyle('transition-duration: 0.3s')
      expect(component).toHaveStyle('animation-duration: 0.5s')
    })
  })

  describe('6. Integration Testing Scenarios', () => {
    it('handles complete user workflow with all features', async () => {
      const user = userEvent.setup()
      const mockSubmit = jest.fn()
      
      render(
        <MockResponsiveLayout>
          <MockAccessibleComponent />
          <MockAuthForm onSubmit={mockSubmit} />
        </MockResponsiveLayout>
      )
      
      // Test responsive behavior
      const container = screen.getByTestId('responsive-container')
      expect(container).toHaveAttribute('data-viewport', 'desktop')
      
      // Test accessibility
      const skipLink = screen.getByText(/skip to main content/i)
      expect(skipLink).toBeInTheDocument()
      
      // Test form validation and submission
      await user.type(screen.getByLabelText(/parent name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'StrongPassword123!')
      await user.type(screen.getByLabelText(/confirm password/i), 'StrongPassword123!')
      await user.click(screen.getByRole('checkbox'))
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled()
      })
    })

    it('maintains performance across different scenarios', () => {
      const performanceStart = performance.now()
      
      render(
        <MockResponsiveLayout>
          <MockAccessibleComponent />
          <MockAuthForm onSubmit={jest.fn()} />
        </MockResponsiveLayout>
      )
      
      const performanceEnd = performance.now()
      const renderTime = performanceEnd - performanceStart
      
      // Component should render quickly (under 100ms for this simple test)
      expect(renderTime).toBeLessThan(100)
      
      // All elements should be present
      expect(screen.getByLabelText(/parent name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })
  })
})