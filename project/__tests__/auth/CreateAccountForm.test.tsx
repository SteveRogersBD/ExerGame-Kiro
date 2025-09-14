import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateAccountForm } from '@/components/auth/CreateAccountForm'

// Mock the sub-components to avoid import issues
jest.mock('@/components/auth/TextField', () => ({
  TextField: React.forwardRef<HTMLInputElement, any>((props, ref) => (
    <input
      ref={ref}
      type={props.type || 'text'}
      placeholder={props.placeholder}
      aria-label={props.label}
      aria-invalid={props['aria-invalid']}
      required={props.required}
      {...props}
    />
  ))
}))

jest.mock('@/components/auth/PasswordField', () => ({
  PasswordField: React.forwardRef<HTMLInputElement, any>((props, ref) => (
    <input
      ref={ref}
      type="password"
      placeholder={props.placeholder}
      aria-label={props.label}
      aria-invalid={props['aria-invalid']}
      required={props.required}
      {...props}
    />
  ))
}))

jest.mock('@/components/auth/PasswordStrengthMeter', () => ({
  PasswordStrengthMeter: ({ password }: { password: string }) => (
    <div data-testid="password-strength-meter">
      {password && <span>Password Strength</span>}
    </div>
  )
}))

jest.mock('@/components/auth/GoogleSignInButton', () => ({
  GoogleSignInButton: ({ onClick, disabled }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Continue with Google"
    >
      Continue with Google
    </button>
  )
}))

jest.mock('@/components/auth/TermsCheckbox', () => ({
  TermsCheckbox: ({ checked, onChange, error, required, onTermsClick, onPrivacyClick }: any) => (
    <div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        required={required}
        aria-invalid={!!error}
      />
      <label>
        I agree to the{' '}
        <button type="button" onClick={onTermsClick}>Terms & Conditions</button>
        {' '}and{' '}
        <button type="button" onClick={onPrivacyClick}>Privacy Policy</button>
      </label>
      {error && <div role="alert">{error}</div>}
    </div>
  )
}))

jest.mock('@/components/auth/AuthButton', () => ({
  AuthButton: ({ variant, type, disabled, loading, children, ...props }: any) => (
    <button
      type={type}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}))

describe('CreateAccountForm Component', () => {
  const mockProps = {
    onSubmit: jest.fn(),
    onSwitchToSignIn: jest.fn(),
    onGoogleSignIn: jest.fn(),
    onTermsClick: jest.fn(),
    onPrivacyClick: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(<CreateAccountForm {...mockProps} />)
    
    expect(screen.getByLabelText(/parent name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/parent name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    await user.tab() // Trigger blur event
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('validates password strength requirements', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    await user.type(passwordInput, 'weak')
    await user.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    })
  })

  it('validates password confirmation match', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    
    await user.type(passwordInput, 'Password123!')
    await user.type(confirmPasswordInput, 'DifferentPassword123!')
    await user.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
    })
  })

  it('validates terms agreement', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    // Fill valid form data but don't check terms
    await user.type(screen.getByLabelText(/parent name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/you must agree to the terms/i)).toBeInTheDocument()
    })

    // Check terms and verify error disappears
    const termsCheckbox = screen.getByRole('checkbox')
    await user.click(termsCheckbox)
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalled()
    })
  })

  it('shows password strength meter', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    await user.type(passwordInput, 'Password123!')
    
    await waitFor(() => {
      expect(screen.getByText(/password strength/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    // Fill valid form data
    await user.type(screen.getByLabelText(/parent name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
    await user.click(screen.getByRole('checkbox'))
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        parentName: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        agreeToTerms: true,
      })
    })
  })

  it('calls switch to sign in handler', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    const switchLink = screen.getByRole('button', { name: /switch to sign in form/i })
    await user.click(switchLink)
    
    expect(mockProps.onSwitchToSignIn).toHaveBeenCalled()
  })

  it('calls Google sign in handler', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i })
    await user.click(googleButton)
    
    expect(mockProps.onGoogleSignIn).toHaveBeenCalled()
  })

  it('has proper accessibility attributes', () => {
    render(<CreateAccountForm {...mockProps} />)
    
    const form = screen.getByRole('form') || screen.getByTestId('create-account-form') || document.querySelector('form')
    expect(form).toHaveAttribute('noValidate')
    
    // Check required fields have proper attributes
    expect(screen.getByLabelText(/parent name/i)).toHaveAttribute('required')
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('required')
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute('required')
  })
})

describe('Comprehensive Form Validation Scenarios', () => {
  const mockProps = {
    onSubmit: jest.fn(),
    onSwitchToSignIn: jest.fn(),
    onGoogleSignIn: jest.fn(),
    onTermsClick: jest.fn(),
    onPrivacyClick: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('validates parent name with various edge cases', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    const parentNameInput = screen.getByLabelText(/parent name/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    // Test empty name
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/parent name is required/i)).toBeInTheDocument()
    })

    // Test single character
    await user.clear(parentNameInput)
    await user.type(parentNameInput, 'A')
    await user.tab()
    await waitFor(() => {
      expect(screen.getByText(/parent name must be at least 2 characters/i)).toBeInTheDocument()
    })

    // Test invalid characters
    await user.clear(parentNameInput)
    await user.type(parentNameInput, 'John123')
    await user.tab()
    await waitFor(() => {
      expect(screen.getByText(/parent name can only contain letters/i)).toBeInTheDocument()
    })

    // Test too long name
    await user.clear(parentNameInput)
    await user.type(parentNameInput, 'A'.repeat(51))
    await user.tab()
    await waitFor(() => {
      expect(screen.getByText(/parent name must be less than 50 characters/i)).toBeInTheDocument()
    })

    // Test valid names
    const validNames = ['John Doe', "Mary O'Connor", 'Jean-Pierre Smith']
    for (const name of validNames) {
      await user.clear(parentNameInput)
      await user.type(parentNameInput, name)
      await user.tab()
      await waitFor(() => {
        expect(screen.queryByText(/parent name/)).not.toBeInTheDocument()
      })
    }
  })

  it('validates email with comprehensive scenarios', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    const emailInput = screen.getByLabelText(/email/i)

    // Test invalid email formats
    const invalidEmails = [
      'invalid',
      'invalid@',
      '@invalid.com',
      'invalid..email@test.com',
      '.invalid@test.com',
      'invalid@test.com.',
      'a'.repeat(250) + '@test.com' // Too long
    ]

    for (const email of invalidEmails) {
      await user.clear(emailInput)
      await user.type(emailInput, email)
      await user.tab()
      await waitFor(() => {
        const errorMessages = screen.queryAllByText(/email/i)
        expect(errorMessages.some(msg => 
          msg.textContent?.includes('valid email') || 
          msg.textContent?.includes('too long') ||
          msg.textContent?.includes('consecutive dots') ||
          msg.textContent?.includes('start or end')
        )).toBe(true)
      })
    }

    // Test valid emails
    const validEmails = ['test@example.com', 'user.name+tag@domain.co.uk']
    for (const email of validEmails) {
      await user.clear(emailInput)
      await user.type(emailInput, email)
      await user.tab()
      // Should not show email validation errors
      await waitFor(() => {
        expect(screen.queryByText(/please enter a valid email/i)).not.toBeInTheDocument()
      })
    }
  })

  it('validates password strength comprehensively', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)

    // Test various password scenarios
    const passwordTests = [
      { password: '', expectedError: /password is required/i },
      { password: 'short', expectedError: /password must be at least 8 characters/i },
      { password: 'nouppercase123', expectedError: /password must contain.*uppercase/i },
      { password: 'NOLOWERCASE123', expectedError: /password must contain.*lowercase/i },
      { password: 'NoNumbers!', expectedError: /password must contain.*number/i },
      { password: 'Has Spaces123', expectedError: /password cannot contain spaces/i },
      { password: 'A'.repeat(129), expectedError: /password must be less than 128 characters/i }
    ]

    for (const test of passwordTests) {
      await user.clear(passwordInput)
      await user.type(passwordInput, test.password)
      await user.tab()
      await waitFor(() => {
        expect(screen.getByText(test.expectedError)).toBeInTheDocument()
      })
    }

    // Test valid password
    await user.clear(passwordInput)
    await user.type(passwordInput, 'ValidPassword123!')
    await user.tab()
    await waitFor(() => {
      expect(screen.queryByText(/password must/i)).not.toBeInTheDocument()
    })
  })

  it('validates password confirmation in various scenarios', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    // Test empty confirmation
    await user.type(passwordInput, 'Password123!')
    await user.click(confirmPasswordInput)
    await user.tab()
    await waitFor(() => {
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument()
    })

    // Test mismatched passwords
    await user.type(confirmPasswordInput, 'DifferentPassword123!')
    await user.tab()
    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
    })

    // Test matching passwords
    await user.clear(confirmPasswordInput)
    await user.type(confirmPasswordInput, 'Password123!')
    await user.tab()
    await waitFor(() => {
      expect(screen.queryByText(/passwords don't match/i)).not.toBeInTheDocument()
    })
  })

  it('validates terms agreement requirement', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    // Fill all fields except terms
    await user.type(screen.getByLabelText(/parent name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/you must agree to the terms/i)).toBeInTheDocument()
    })

    // Check terms and verify error disappears
    const termsCheckbox = screen.getByRole('checkbox')
    await user.click(termsCheckbox)
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalled()
    })
  })

  it('handles form submission with loading states', async () => {
    const user = userEvent.setup()
    const slowSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<CreateAccountForm {...mockProps} onSubmit={slowSubmit} />)
    
    // Fill valid form
    await user.type(screen.getByLabelText(/parent name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
    await user.click(screen.getByRole('checkbox'))
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)
    
    // Should show loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    
    await waitFor(() => {
      expect(slowSubmit).toHaveBeenCalled()
    })
  })
})

describe('Real-time Validation Behavior', () => {
  const mockProps = {
    onSubmit: jest.fn(),
    onSwitchToSignIn: jest.fn(),
    onGoogleSignIn: jest.fn(),
    onTermsClick: jest.fn(),
    onPrivacyClick: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('validates fields on blur and re-validates on change', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    
    // Type invalid email and blur
    await user.type(emailInput, 'invalid')
    await user.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
    })
    
    // Fix email - should re-validate and clear error
    await user.clear(emailInput)
    await user.type(emailInput, 'valid@example.com')
    
    await waitFor(() => {
      expect(screen.queryByText(/please enter a valid email/i)).not.toBeInTheDocument()
    })
  })

  it('shows password strength meter updates in real-time', async () => {
    const user = userEvent.setup()
    render(<CreateAccountForm {...mockProps} />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    
    // Type password and check strength meter appears
    await user.type(passwordInput, 'weak')
    await waitFor(() => {
      expect(screen.getByText(/password strength/i)).toBeInTheDocument()
    })
    
    // Improve password strength
    await user.clear(passwordInput)
    await user.type(passwordInput, 'StrongPassword123!')
    await waitFor(() => {
      expect(screen.getByText(/password strength/i)).toBeInTheDocument()
    })
  })
})