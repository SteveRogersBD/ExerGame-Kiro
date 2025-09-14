import React from 'react'
import { render, screen } from '@testing-library/react'
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

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
  Toaster: () => <div data-testid="toaster" />,
}))

describe('Accessibility Compliance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has proper heading hierarchy', () => {
    render(<ParentAuth />)
    
    // Should have h1 for main page title
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent(/parent zone/i)
    
    // Should have h3 for form sections
    const h3Elements = screen.getAllByRole('heading', { level: 3 })
    expect(h3Elements.length).toBeGreaterThan(0)
  })

  it('has proper form labels', () => {
    render(<ParentAuth />)
    
    // All form inputs should have associated labels
    const inputs = screen.getAllByRole('textbox')
    inputs.forEach(input => {
      expect(input).toHaveAccessibleName()
    })
    
    const passwordInputs = document.querySelectorAll('input[type="password"]')
    passwordInputs.forEach(input => {
      expect(input).toHaveAccessibleName()
    })
  })

  it('has proper ARIA landmarks', () => {
    render(<ParentAuth />)
    
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })

  it('has skip navigation link', () => {
    render(<ParentAuth />)
    
    const skipLink = screen.getByText(/skip to main content/i)
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  it('has live region for announcements', () => {
    render(<ParentAuth />)
    
    const liveRegion = document.querySelector('[aria-live="polite"]')
    expect(liveRegion).toBeInTheDocument()
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
  })

  it('has proper button accessibility', () => {
    render(<ParentAuth />)
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      // All buttons should have accessible names
      expect(button).toHaveAccessibleName()
      
      // Interactive elements should be focusable
      expect(button).not.toHaveAttribute('tabindex', '-1')
    })
  })

  it('has proper tab accessibility', () => {
    render(<ParentAuth />)
    
    const tabs = screen.getAllByRole('tab')
    tabs.forEach(tab => {
      expect(tab).toHaveAttribute('aria-selected')
    })
    
    const tabList = screen.getByRole('tablist')
    expect(tabList).toHaveAttribute('aria-label')
  })

  it('has proper form validation accessibility', async () => {
    render(<ParentAuth />)
    
    // Form should have noValidate to handle custom validation
    const forms = document.querySelectorAll('form')
    forms.forEach(form => {
      expect(form).toHaveAttribute('noValidate')
    })
  })

  it('has proper color contrast indicators', () => {
    render(<ParentAuth />)
    
    // Check that focus indicators are present
    const focusableElements = screen.getAllByRole('button')
    focusableElements.forEach(element => {
      // Should have focus styles (checked via CSS classes)
      const classList = Array.from(element.classList)
      const hasFocusStyles = classList.some(className => 
        className.includes('focus') || 
        className.includes('ring') ||
        className.includes('outline')
      )
      expect(hasFocusStyles).toBe(true)
    })
  })

  it('supports reduced motion preferences', () => {
    // Mock reduced motion preference
    jest.doMock('@/hooks/useReducedMotion', () => ({
      useReducedMotion: () => true,
    }))
    
    render(<ParentAuth />)
    
    // Component should render without motion-dependent features
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('has proper image alt text', () => {
    render(<ParentAuth />)
    
    const images = screen.getAllByRole('img')
    images.forEach(img => {
      expect(img).toHaveAttribute('alt')
      expect(img.getAttribute('alt')).not.toBe('')
    })
  })

  it('has proper checkbox accessibility', () => {
    render(<ParentAuth />)
    
    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach(checkbox => {
      expect(checkbox).toHaveAccessibleName()
    })
  })

  it('has proper link accessibility', () => {
    render(<ParentAuth />)
    
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAccessibleName()
    })
  })
})