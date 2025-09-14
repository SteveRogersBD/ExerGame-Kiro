import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthTabs } from '@/components/auth/AuthTabs'

// Mock the hooks
jest.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}))

describe('AuthTabs Component', () => {
  const mockProps = {
    onCreateAccount: jest.fn(),
    onSignIn: jest.fn(),
    onGoogleSignIn: jest.fn(),
    onTermsClick: jest.fn(),
    onPrivacyClick: jest.fn(),
    onForgotPassword: jest.fn(),
    onForgotPIN: jest.fn(),
    onTabChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders both tabs with correct labels', () => {
    render(<AuthTabs {...mockProps} />)
    
    expect(screen.getByRole('tab', { name: /create account/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /sign in/i })).toBeInTheDocument()
  })

  it('sets Create Account as default active tab', () => {
    render(<AuthTabs {...mockProps} />)
    
    const createAccountTab = screen.getByRole('tab', { name: /create account/i })
    const signInTab = screen.getByRole('tab', { name: /sign in/i })
    
    expect(createAccountTab).toHaveAttribute('aria-selected', 'true')
    expect(signInTab).toHaveAttribute('aria-selected', 'false')
  })

  it('respects defaultTab prop', () => {
    render(<AuthTabs {...mockProps} defaultTab="sign-in" />)
    
    const createAccountTab = screen.getByRole('tab', { name: /create account/i })
    const signInTab = screen.getByRole('tab', { name: /sign in/i })
    
    expect(createAccountTab).toHaveAttribute('aria-selected', 'false')
    expect(signInTab).toHaveAttribute('aria-selected', 'true')
  })

  it('switches tabs when clicked and calls onTabChange', async () => {
    const user = userEvent.setup()
    render(<AuthTabs {...mockProps} />)
    
    const signInTab = screen.getByRole('tab', { name: /sign in/i })
    
    await user.click(signInTab)
    
    await waitFor(() => {
      expect(signInTab).toHaveAttribute('aria-selected', 'true')
      expect(mockProps.onTabChange).toHaveBeenCalledWith('sign-in')
    })
  })

  it('renders Create Account form content when active', () => {
    render(<AuthTabs {...mockProps} />)
    
    expect(screen.getByText(/create your parent account/i)).toBeInTheDocument()
    expect(screen.getByText(/join wiggleworld to manage/i)).toBeInTheDocument()
  })

  it('renders Sign In form content when active', async () => {
    const user = userEvent.setup()
    render(<AuthTabs {...mockProps} />)
    
    const signInTab = screen.getByRole('tab', { name: /sign in/i })
    await user.click(signInTab)
    
    await waitFor(() => {
      expect(screen.getByText(/welcome back!/i)).toBeInTheDocument()
      expect(screen.getByText(/sign in to access your parent dashboard/i)).toBeInTheDocument()
    })
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<AuthTabs {...mockProps} />)
    
    const createAccountTab = screen.getByRole('tab', { name: /create account/i })
    const signInTab = screen.getByRole('tab', { name: /sign in/i })
    
    // Focus first tab
    createAccountTab.focus()
    expect(createAccountTab).toHaveFocus()
    
    // Navigate to second tab with arrow key
    await user.keyboard('{ArrowRight}')
    expect(signInTab).toHaveFocus()
    
    // Activate with Enter
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(signInTab).toHaveAttribute('aria-selected', 'true')
    })
  })

  it('has proper ARIA attributes', () => {
    render(<AuthTabs {...mockProps} />)
    
    const tabList = screen.getByRole('tablist')
    expect(tabList).toHaveAttribute('aria-label', 'Authentication options')
    
    const tabs = screen.getAllByRole('tab')
    tabs.forEach(tab => {
      expect(tab).toHaveAttribute('aria-selected')
    })
  })

  it('applies wiggle theme colors and styling', () => {
    render(<AuthTabs {...mockProps} />)
    
    const tabList = screen.getByRole('tablist')
    expect(tabList).toHaveClass('bg-gradient-to-r')
    expect(tabList).toHaveClass('border-wiggle-pink/20')
  })
})