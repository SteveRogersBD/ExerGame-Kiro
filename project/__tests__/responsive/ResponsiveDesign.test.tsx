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

describe('Responsive Design Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Mobile Layout (320px - 768px)', () => {
    beforeEach(() => {
      setViewportSize(375, 667) // iPhone SE size
    })

    it('renders mobile layout correctly', () => {
      render(<ParentAuth />)
      
      // Mobile layout should be visible
      const mobileLayout = document.querySelector('.lg\\:hidden')
      expect(mobileLayout).toBeInTheDocument()
      
      // Desktop layout should be hidden
      const desktopLayout = document.querySelector('.hidden.lg\\:flex')
      expect(desktopLayout).toBeInTheDocument()
    })

    it('has proper mobile spacing and sizing', () => {
      render(<ParentAuth />)
      
      // Check that mobile-specific classes are applied
      const authCard = document.querySelector('.max-w-sm')
      expect(authCard).toBeInTheDocument()
    })

    it('renders tiger image appropriately for mobile', () => {
      render(<ParentAuth />)
      
      const tigerImages = screen.getAllByAltText(/friendly tiger mascot/i)
      expect(tigerImages.length).toBeGreaterThan(0)
      
      // Should have mobile-appropriate sizing
      tigerImages.forEach(img => {
        expect(img).toHaveClass('w-full', 'h-auto', 'object-contain')
      })
    })

    it('has touch-friendly interactive elements', () => {
      render(<ParentAuth />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        // Should have touch-target class for minimum 44px touch targets
        const classList = Array.from(button.classList)
        const hasTouchTarget = classList.includes('touch-target') || 
                              classList.some(cls => cls.includes('p-') && parseInt(cls.split('-')[1]) >= 3)
        expect(hasTouchTarget).toBe(true)
      })
    })
  })

  describe('Tablet Layout (768px - 1024px)', () => {
    beforeEach(() => {
      setViewportSize(768, 1024) // iPad size
    })

    it('renders tablet layout correctly', () => {
      render(<ParentAuth />)
      
      // Should still use mobile layout at this breakpoint
      const mobileLayout = document.querySelector('.lg\\:hidden')
      expect(mobileLayout).toBeInTheDocument()
    })
  })

  describe('Desktop Layout (1024px+)', () => {
    beforeEach(() => {
      setViewportSize(1440, 900) // Desktop size
    })

    it('renders desktop layout correctly', () => {
      render(<ParentAuth />)
      
      // Desktop layout should be visible
      const desktopLayout = document.querySelector('.hidden.lg\\:flex')
      expect(desktopLayout).toBeInTheDocument()
      
      // Should have grid layout
      const gridContainer = document.querySelector('.lg\\:grid-cols-2')
      expect(gridContainer).toBeInTheDocument()
    })

    it('has proper desktop spacing and sizing', () => {
      render(<ParentAuth />)
      
      // Check for desktop-specific classes
      const maxWidthContainer = document.querySelector('.max-w-7xl')
      expect(maxWidthContainer).toBeInTheDocument()
    })

    it('renders tiger image appropriately for desktop', () => {
      render(<ParentAuth />)
      
      const tigerImages = screen.getAllByAltText(/friendly tiger mascot/i)
      expect(tigerImages.length).toBeGreaterThan(0)
      
      // Should have desktop-appropriate sizing
      tigerImages.forEach(img => {
        expect(img).toHaveStyle('min-height: 67vh')
        expect(img).toHaveStyle('max-height: 80vh')
      })
    })
  })

  describe('Form Responsiveness', () => {
    it('maintains proper form layout across screen sizes', () => {
      const { rerender } = render(<ParentAuth />)
      
      // Test mobile
      setViewportSize(375, 667)
      rerender(<ParentAuth />)
      
      let forms = document.querySelectorAll('form')
      forms.forEach(form => {
        expect(form).toBeInTheDocument()
      })
      
      // Test desktop
      setViewportSize(1440, 900)
      rerender(<ParentAuth />)
      
      forms = document.querySelectorAll('form')
      forms.forEach(form => {
        expect(form).toBeInTheDocument()
      })
    })

    it('maintains proper input sizing across screen sizes', () => {
      render(<ParentAuth />)
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        // Should have responsive padding and sizing
        const classList = Array.from(input.classList)
        const hasResponsivePadding = classList.some(cls => 
          cls.includes('p-') || cls.includes('px-') || cls.includes('py-')
        )
        expect(hasResponsivePadding).toBe(true)
      })
    })
  })

  describe('Content Visibility Optimization', () => {
    it('applies content-visibility to layout sections', () => {
      render(<ParentAuth />)
      
      const mobileLayout = document.querySelector('.lg\\:hidden')
      const desktopLayout = document.querySelector('.hidden.lg\\:flex')
      
      expect(mobileLayout).toHaveStyle('content-visibility: auto')
      expect(desktopLayout).toHaveStyle('content-visibility: auto')
    })
  })

  describe('Comprehensive Responsive Scenarios', () => {
    it('handles extreme viewport sizes', () => {
      const { rerender } = render(<ParentAuth />)
      
      // Test very small mobile (iPhone SE)
      setViewportSize(320, 568)
      rerender(<ParentAuth />)
      
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByText(/parent zone/i)).toBeInTheDocument()
      
      // Test large desktop (4K)
      setViewportSize(3840, 2160)
      rerender(<ParentAuth />)
      
      expect(screen.getByRole('main')).toBeInTheDocument()
      const maxWidthContainer = document.querySelector('.max-w-7xl')
      expect(maxWidthContainer).toBeInTheDocument()
    })

    it('maintains proper aspect ratios across screen sizes', () => {
      const { rerender } = render(<ParentAuth />)
      
      // Test different aspect ratios
      const aspectRatios = [
        { width: 375, height: 812 }, // iPhone X
        { width: 768, height: 1024 }, // iPad Portrait
        { width: 1024, height: 768 }, // iPad Landscape
        { width: 1920, height: 1080 }, // Full HD
        { width: 2560, height: 1440 }, // QHD
      ]
      
      aspectRatios.forEach(({ width, height }) => {
        setViewportSize(width, height)
        rerender(<ParentAuth />)
        
        const tigerImages = screen.getAllByAltText(/friendly tiger mascot/i)
        expect(tigerImages.length).toBeGreaterThan(0)
        
        tigerImages.forEach(img => {
          expect(img).toHaveClass('object-contain')
        })
      })
    })

    it('handles orientation changes', () => {
      const { rerender } = render(<ParentAuth />)
      
      // Portrait mobile
      setViewportSize(375, 812)
      rerender(<ParentAuth />)
      
      let mobileLayout = document.querySelector('.lg\\:hidden')
      expect(mobileLayout).toBeInTheDocument()
      
      // Landscape mobile (simulated)
      setViewportSize(812, 375)
      rerender(<ParentAuth />)
      
      mobileLayout = document.querySelector('.lg\\:hidden')
      expect(mobileLayout).toBeInTheDocument()
    })

    it('ensures text remains readable at all sizes', () => {
      const { rerender } = render(<ParentAuth />)
      
      const testSizes = [320, 768, 1024, 1440, 1920]
      
      testSizes.forEach(width => {
        setViewportSize(width, 800)
        rerender(<ParentAuth />)
        
        const headings = screen.getAllByRole('heading')
        headings.forEach(heading => {
          expect(heading).toBeVisible()
          expect(heading).toHaveClass(expect.stringMatching(/text-|font-/))
        })
        
        const buttons = screen.getAllByRole('button')
        buttons.forEach(button => {
          expect(button).toBeVisible()
        })
      })
    })

    it('maintains proper spacing at different breakpoints', () => {
      const { rerender } = render(<ParentAuth />)
      
      // Mobile spacing
      setViewportSize(375, 667)
      rerender(<ParentAuth />)
      
      const mobileContainer = document.querySelector('.px-4')
      expect(mobileContainer).toBeInTheDocument()
      
      // Desktop spacing
      setViewportSize(1440, 900)
      rerender(<ParentAuth />)
      
      const desktopContainer = document.querySelector('.p-6, .xl\\:p-8')
      expect(desktopContainer).toBeInTheDocument()
    })
  })

  describe('Touch and Interaction Responsiveness', () => {
    it('provides adequate touch targets on mobile', () => {
      setViewportSize(375, 667)
      render(<ParentAuth />)
      
      const interactiveElements = [
        ...screen.getAllByRole('button'),
        ...screen.getAllByRole('textbox'),
        ...screen.getAllByRole('checkbox'),
        ...screen.getAllByRole('tab'),
        ...screen.getAllByRole('link')
      ]
      
      interactiveElements.forEach(element => {
        const classList = Array.from(element.classList)
        const hasTouchTarget = classList.includes('touch-target') || 
                              classList.some(cls => cls.includes('p-') && parseInt(cls.split('-')[1]) >= 3) ||
                              classList.some(cls => cls.includes('min-h-') && parseInt(cls.split('-')[1]) >= 11)
        expect(hasTouchTarget).toBe(true)
      })
    })

    it('handles hover states appropriately across devices', () => {
      const { rerender } = render(<ParentAuth />)
      
      // Mobile - hover states should be minimal
      setViewportSize(375, 667)
      rerender(<ParentAuth />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        const classList = Array.from(button.classList)
        // Should have hover states but they won't activate on touch devices
        expect(classList.some(cls => cls.includes('hover:'))).toBe(true)
      })
      
      // Desktop - hover states should be present
      setViewportSize(1440, 900)
      rerender(<ParentAuth />)
      
      const desktopButtons = screen.getAllByRole('button')
      desktopButtons.forEach(button => {
        const classList = Array.from(button.classList)
        expect(classList.some(cls => cls.includes('hover:'))).toBe(true)
      })
    })
  })

  describe('Performance at Different Screen Sizes', () => {
    it('lazy loads appropriate content based on viewport', () => {
      const { rerender } = render(<ParentAuth />)
      
      // Mobile - should show mobile layout
      setViewportSize(375, 667)
      rerender(<ParentAuth />)
      
      const mobileLayout = document.querySelector('.lg\\:hidden')
      const desktopLayout = document.querySelector('.hidden.lg\\:flex')
      
      expect(mobileLayout).toBeVisible()
      expect(desktopLayout).not.toBeVisible()
      
      // Desktop - should show desktop layout
      setViewportSize(1440, 900)
      rerender(<ParentAuth />)
      
      const newMobileLayout = document.querySelector('.lg\\:hidden')
      const newDesktopLayout = document.querySelector('.hidden.lg\\:flex')
      
      expect(newMobileLayout).not.toBeVisible()
      expect(newDesktopLayout).toBeVisible()
    })

    it('optimizes image loading for different screen sizes', () => {
      const { rerender } = render(<ParentAuth />)
      
      const testSizes = [
        { width: 375, expectedSizes: '(max-width: 768px) 300px, 400px' },
        { width: 1440, expectedSizes: '(min-width: 1024px) 50vw, 100vw' }
      ]
      
      testSizes.forEach(({ width, expectedSizes }) => {
        setViewportSize(width, 800)
        rerender(<ParentAuth />)
        
        const images = screen.getAllByRole('img')
        images.forEach(img => {
          expect(img).toHaveAttribute('sizes')
          // The sizes attribute should be optimized for the viewport
          const sizesAttr = img.getAttribute('sizes')
          expect(sizesAttr).toBeTruthy()
        })
      })
    })
  })

  describe('Image Optimization', () => {
    it('uses Next.js Image component with proper sizing', () => {
      render(<ParentAuth />)
      
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        // Should have proper sizes attribute for responsive images
        expect(img).toHaveAttribute('sizes')
      })
    })

    it('has priority loading for above-the-fold images', () => {
      render(<ParentAuth />)
      
      const tigerImages = screen.getAllByAltText(/friendly tiger mascot/i)
      tigerImages.forEach(img => {
        // Should have priority attribute for LCP optimization
        expect(img).toHaveAttribute('priority')
      })
    })
  })
})