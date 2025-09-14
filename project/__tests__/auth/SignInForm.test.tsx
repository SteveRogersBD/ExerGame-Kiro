import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignInForm } from '@/components/auth/SignInForm'

describe('SignInForm Component', () => {
  const mockProps = {
    onSubmit: jest.fn(),
    onSwitchToCreateAccount: jest.fn(),
    onForgotPassword: jest.fn(),
    onForgotPIN: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(<SignInForm {...mockProps} />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/remember me on this device/i)).toBeInTheDocument()
  })

  it('renders forgot links', () => {
    render(<SignInForm {...mockProps} />)
    
    expect(screen.getByRole('button', { name: /get help resetting your pin/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset your password via email/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<SignInForm {...mockProps} />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<SignInForm {...mockProps} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    await user.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<SignInForm {...mockProps} />)
    
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByLabelText(/remember me/i))
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        rememberMe: true,
      })
    })
  })

  it('calls forgot password handler', async () => {
    const user = userEvent.setup()
    render(<SignInForm {...mockProps} />)
    
    const forgotPasswordLink = screen.getByRole('button', { name: /reset your password via email/i })
    await user.click(forgotPasswordLink)
    
    expect(mockProps.onForgotPassword).toHaveBeenCalled()
  })

  it('calls forgot PIN handler', async () => {
    const user = userEvent.setup()
    render(<SignInForm {...mockProps} />)
    
    const forgotPINLink = screen.getByRole('button', { name: /get help resetting your pin/i })
    await user.click(forgotPINLink)
    
    expect(mockProps.onForgotPIN).toHaveBeenCalled()
  })

  it('calls switch to create account handler', async () => {
    const user = userEvent.setup()
    render(<SignInForm {...mockProps} />)
    
    const switchLink = screen.getByRole('button', { name: /switch to create new account form/i })
    await user.click(switchLink)
    
    expect(mockProps.onSwitchToCreateAccount).toHaveBeenCalled()
  })

  it('has proper accessibility attributes', () => {
    render(<SignInForm {...mockProps} />)
    
    const form = screen.getByRole('form') || document.querySelector('form')
    expect(form).toHaveAttribute('noValidate')
    
    // Check required fields have proper attributes
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('required')
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('required')
    
    // Check checkbox has proper description
    const checkbox = screen.getByLabelText(/remember me/i)
    expect(checkbox).toHaveAttribute('aria-describedby', 'remember-me-description')
  })

  it('supports keyboard navigation for links', async () => {
    const user = userEvent.setup()
    render(<SignInForm {...mockProps} />)
    
    const forgotPINLink = screen.getByRole('button', { name: /get help resetting your pin/i })
    const forgotPasswordLink = screen.getByRole('button', { name: /reset your password via email/i })
    
    // Tab to first link
    await user.tab()
    await user.tab()
    await user.tab()
    await user.tab() // Navigate through form fields to links
    
    // Should be able to activate with Enter or Space
    forgotPINLink.focus()
    await user.keyboard('{Enter}')
    expect(mockProps.onForgotPIN).toHaveBeenCalled()
  })
})