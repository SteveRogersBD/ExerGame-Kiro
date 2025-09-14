import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal'

// Mock the hooks
jest.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}))

jest.mock('@/lib/focus-trap', () => ({
  useFocusTrap: jest.fn(),
}))

// Mock Sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('ForgotPasswordModal Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when open', () => {
    render(<ForgotPasswordModal {...mockProps} />)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/reset password/i)).toBeInTheDocument()
    expect(screen.getByText(/enter your email address/i)).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<ForgotPasswordModal {...mockProps} isOpen={false} />)
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders email input field', () => {
    render(<ForgotPasswordModal {...mockProps} />)
    
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter your email address/i)).toBeInTheDocument()
  })

  it('validates email field', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordModal {...mockProps} />)
    
    const submitButton = screen.getByRole('button', { name: /send reset link/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordModal {...mockProps} />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    await user.type(emailInput, 'invalid-email')
    await user.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid email', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordModal {...mockProps} />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    await user.type(emailInput, 'john@example.com')
    
    const submitButton = screen.getByRole('button', { name: /send reset link/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith('john@example.com')
    })
  })

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordModal {...mockProps} />)
    
    const closeButton = screen.getByLabelText(/close reset password dialog/i)
    await user.click(closeButton)
    
    expect(mockProps.onClose).toHaveBeenCalled()
  })

  it('closes modal when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordModal {...mockProps} />)
    
    const cancelButton = screen.getByRole('button', { name: /cancel password reset/i })
    await user.click(cancelButton)
    
    expect(mockProps.onClose).toHaveBeenCalled()
  })

  it('supports Escape key to close', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordModal {...mockProps} />)
    
    await user.keyboard('{Escape}')
    
    expect(mockProps.onClose).toHaveBeenCalled()
  })

  it('has proper ARIA attributes', () => {
    render(<ForgotPasswordModal {...mockProps} />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'forgot-password-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'forgot-password-description')
  })

  it('disables submit button when form is invalid', () => {
    render(<ForgotPasswordModal {...mockProps} />)
    
    const submitButton = screen.getByRole('button', { name: /send reset link/i })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when form is valid', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordModal {...mockProps} />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    await user.type(emailInput, 'john@example.com')
    
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /send reset link/i })
      expect(submitButton).not.toBeDisabled()
    })
  })
})