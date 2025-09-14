import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter'

// Mock the debounce hook
jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: string) => value, // Return immediately for testing
}))

describe('PasswordStrengthMeter Component', () => {
  it('does not render when password is empty', () => {
    render(<PasswordStrengthMeter password="" />)
    
    expect(screen.queryByText(/password strength/i)).not.toBeInTheDocument()
  })

  it('shows weak strength for short password', async () => {
    render(<PasswordStrengthMeter password="123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/password strength/i)).toBeInTheDocument()
      expect(screen.getByText(/weak/i)).toBeInTheDocument()
    })
  })

  it('shows fair strength for medium password', async () => {
    render(<PasswordStrengthMeter password="password123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/fair/i)).toBeInTheDocument()
    })
  })

  it('shows good strength for strong password', async () => {
    render(<PasswordStrengthMeter password="Password123" />)
    
    await waitFor(() => {
      expect(screen.getByText(/good/i)).toBeInTheDocument()
    })
  })

  it('shows strong strength for very strong password', async () => {
    render(<PasswordStrengthMeter password="Password123!" />)
    
    await waitFor(() => {
      expect(screen.getByText(/strong/i)).toBeInTheDocument()
    })
  })

  it('displays appropriate feedback for weak password', async () => {
    render(<PasswordStrengthMeter password="weak" />)
    
    await waitFor(() => {
      expect(screen.getByText(/suggestions:/i)).toBeInTheDocument()
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/include uppercase letters/i)).toBeInTheDocument()
      expect(screen.getByText(/include numbers/i)).toBeInTheDocument()
    })
  })

  it('has proper ARIA attributes for progress bar', async () => {
    render(<PasswordStrengthMeter password="Password123!" />)
    
    await waitFor(() => {
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '100')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
      expect(progressBar).toHaveAttribute('aria-label', 'Password strength: Strong')
    })
  })

  it('updates strength meter width based on strength', async () => {
    const { rerender } = render(<PasswordStrengthMeter password="weak" />)
    
    await waitFor(() => {
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveStyle('width: 25%')
    })
    
    rerender(<PasswordStrengthMeter password="Password123!" />)
    
    await waitFor(() => {
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveStyle('width: 100%')
    })
  })

  it('applies correct color classes based on strength', async () => {
    const { rerender } = render(<PasswordStrengthMeter password="weak" />)
    
    await waitFor(() => {
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveClass('bg-red-400')
    })
    
    rerender(<PasswordStrengthMeter password="Password123!" />)
    
    await waitFor(() => {
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveClass('bg-green-400')
    })
  })

  it('limits feedback suggestions to 3 items', async () => {
    render(<PasswordStrengthMeter password="a" />)
    
    await waitFor(() => {
      const suggestions = screen.getAllByText(/include|at least/i)
      expect(suggestions.length).toBeLessThanOrEqual(3)
    })
  })

  it('applies custom className when provided', () => {
    const { container } = render(
      <PasswordStrengthMeter password="test" className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
})