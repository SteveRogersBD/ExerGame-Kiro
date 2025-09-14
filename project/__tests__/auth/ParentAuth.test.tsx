import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ParentAuth from '@/app/parent/auth/page'

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

// Mock Sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
  Toaster: () => <div data-testid="toaster" />,
}))

describe('ParentAuth Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the page with correct heading and subtitle', () => {
    render(<ParentAuth />)
    
    expect(screen.getByRole('heading', { name: /parent zone/i })).toBeInTheDocument()
    expect(screen.getByText(/manage settings, pin, and permissions/i)).toBeInTheDocument()
  })

  it('renders the tiger image with correct alt text', () => {
    render(<ParentAuth />)
    
    const tigerImages = screen.getAllByAltText(/friendly tiger mascot/i)
    expect(tigerImages.length).toBeGreaterThan(0)
  })

  it('renders authentication tabs with Create Account as default', () => {
    render(<ParentAuth />)
    
    expect(screen.getByRole('tab', { name: /create account/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /sign in/i })).toBeInTheDocument()
    
    // Create Account should be selected by default
    expect(screen.getByRole('tab', { name: /create account/i })).toHaveAttribute('aria-selected', 'true')
  })

  it('switches between tabs when clicked', async () => {
    const user = userEvent.setup()
    render(<ParentAuth />)
    
    const signInTab = screen.getByRole('tab', { name: /sign in/i })
    const createAccountTab = screen.getByRole('tab', { name: /create account/i })
    
    // Click Sign In tab
    await user.click(signInTab)
    
    await waitFor(() => {
      expect(signInTab).toHaveAttribute('aria-selected', 'true')
      expect(createAccountTab).toHaveAttribute('aria-selected', 'false')
    })
  })

  it('renders skip link for accessibility', () => {
    render(<ParentAuth />)
    
    const skipLink = screen.getByLabelText(/skip to main authentication content/i)
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  it('renders back to home link', () => {
    render(<ParentAuth />)
    
    const backLink = screen.getByText(/back to home/i)
    expect(backLink).toBeInTheDocument()
    expect(backLink.closest('a')).toHaveAttribute('href', '/')
  })

  it('has proper ARIA landmarks', () => {
    render(<ParentAuth />)
    
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })

  it('renders live region for screen reader announcements', () => {
    render(<ParentAuth />)
    
    const liveRegion = screen.getByLabelText(/auth-announcements/i)
    expect(liveRegion).toBeInTheDocument()
    expect(liveRegion).toHaveAttribute('aria-live', 'polite')
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
  })

  it('applies content-visibility optimization to layout sections', () => {
    render(<ParentAuth />)
    
    // Check that layout sections have content-visibility style
    const mobileLayout = document.querySelector('.lg\\:hidden')
    const desktopLayout = document.querySelector('.hidden.lg\\:flex')
    
    expect(mobileLayout).toHaveStyle('content-visibility: auto')
    expect(desktopLayout).toHaveStyle('content-visibility: auto')
  })
})