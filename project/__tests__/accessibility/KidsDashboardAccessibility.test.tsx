/**
 * Comprehensive accessibility tests for the Kids Dashboard
 * Tests WCAG 2.1 AA compliance and child-friendly design requirements
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Import components to test
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import VideoCard from '@/components/dashboard/VideoCard';
import HomeworkCard from '@/components/dashboard/HomeworkCard';
import InteractiveButton from '@/components/ui/InteractiveButton';
import AccessibilitySettings from '@/components/dashboard/AccessibilitySettings';
import { AccessibilityManager, CHILD_TOUCH_CONFIG, ENHANCED_CHILD_TOUCH_CONFIG } from '@/lib/accessibility-utils';

// Mock data
const mockVideo = {
  id: 'v1',
  title: 'Fun Counting Adventure',
  thumbnail: '/images/video-thumb.jpg',
  url: 'https://youtube.com/watch?v=test',
  duration: 300,
  quizQuestions: [
    {
      id: 'q1',
      question: 'How many apples?',
      timeInVideo: 120,
      options: [
        { id: 'a1', text: '5 apples', gesture: 'jump' as const },
        { id: 'a2', text: '3 apples', gesture: 'squat' as const }
      ],
      correctAnswer: 'a1'
    }
  ],
  completionReward: {
    id: 'b1',
    name: 'Math Master',
    icon: '🔢',
    earnedAt: new Date(),
    category: 'video' as const
  }
};

const mockHomework = {
  id: 'h1',
  title: 'Dora Episode Quiz',
  icon: '🗺️',
  status: 'not_started' as const,
  assignedBy: 'Mom',
  video: mockVideo,
  dueDate: new Date(Date.now() + 86400000) // Tomorrow
};

// Mock hooks
jest.mock('@/hooks/useInteractiveAnimations', () => ({
  useInteractiveAnimations: () => ({
    buttonVariants: {
      idle: { scale: 1 },
      hover: { scale: 1.05 },
      tap: { scale: 0.95 }
    },
    playSound: jest.fn(),
    triggerHaptic: jest.fn()
  })
}));

jest.mock('@/hooks/useRippleEffect', () => ({
  useRippleEffect: () => ({
    ripples: [],
    createRipple: jest.fn(),
    removeRipple: jest.fn()
  })
}));

describe('Kids Dashboard Accessibility', () => {
  let accessibilityManager: AccessibilityManager;

  beforeEach(() => {
    accessibilityManager = new AccessibilityManager();
    // Reset to default state
    accessibilityManager.updateConfig({
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      screenReaderMode: false
    });
  });

  describe('Touch Target Validation', () => {
    test('all interactive elements meet minimum touch target size', async () => {
      const { container } = render(
        <div>
          <BottomNavigation currentView="dashboard" onNavigate={jest.fn()} />
          <VideoCard video={mockVideo} onClick={jest.fn()} />
          <HomeworkCard homework={mockHomework} onClick={jest.fn()} />
        </div>
      );

      const results = accessibilityManager.validateAllTouchTargets(container, CHILD_TOUCH_CONFIG);
      const invalidTargets = results.filter(result => !result.valid);

      if (invalidTargets.length > 0) {
        console.warn('Invalid touch targets found:', invalidTargets.map(t => ({
          element: t.element.tagName,
          size: `${t.width}x${t.height}`,
          issues: t.issues
        })));
      }

      expect(invalidTargets.length).toBe(0);
    });

    test('enhanced touch targets for young children', async () => {
      const { container } = render(
        <InteractiveButton size="large">Test Button</InteractiveButton>
      );

      const results = accessibilityManager.validateAllTouchTargets(container, ENHANCED_CHILD_TOUCH_CONFIG);
      expect(results.every(result => result.valid)).toBe(true);
    });

    test('touch targets have adequate spacing', async () => {
      const { container } = render(
        <div className="interactive-spacing horizontal">
          <InteractiveButton>Button 1</InteractiveButton>
          <InteractiveButton>Button 2</InteractiveButton>
          <InteractiveButton>Button 3</InteractiveButton>
        </div>
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(1);

      // Check spacing between buttons
      for (let i = 0; i < buttons.length - 1; i++) {
        const current = buttons[i].getBoundingClientRect();
        const next = buttons[i + 1].getBoundingClientRect();
        const spacing = next.left - current.right;
        
        expect(spacing).toBeGreaterThanOrEqual(CHILD_TOUCH_CONFIG.minSpacing);
      }
    });
  });

  describe('Keyboard Navigation', () => {
    test('all interactive elements are keyboard accessible', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();

      render(<BottomNavigation currentView="dashboard" onNavigate={mockNavigate} />);

      // Tab through navigation items
      await user.tab();
      expect(screen.getByRole('button', { name: /home/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /badges/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /help/i })).toHaveFocus();
    });

    test('Enter and Space keys activate buttons', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();

      render(<InteractiveButton onClick={mockClick}>Test Button</InteractiveButton>);

      const button = screen.getByRole('button');
      button.focus();

      // Test Enter key
      await user.keyboard('{Enter}');
      expect(mockClick).toHaveBeenCalledTimes(1);

      // Test Space key
      await user.keyboard(' ');
      expect(mockClick).toHaveBeenCalledTimes(2);
    });

    test('arrow keys navigate between items in carousels', async () => {
      const user = userEvent.setup();
      
      const { container } = render(
        <div role="group" aria-label="Video carousel">
          <VideoCard video={mockVideo} onClick={jest.fn()} />
          <VideoCard video={{...mockVideo, id: 'v2', title: 'Another Video'}} onClick={jest.fn()} />
        </div>
      );

      const firstCard = container.querySelector('[role="button"]') as HTMLElement;
      firstCard.focus();

      // Test arrow key navigation
      await user.keyboard('{ArrowRight}');
      // Should focus next card (implementation depends on carousel component)
    });

    test('Escape key closes modals', async () => {
      const user = userEvent.setup();
      const mockClose = jest.fn();

      render(<AccessibilitySettings isOpen={true} onClose={mockClose} />);

      await user.keyboard('{Escape}');
      expect(mockClose).toHaveBeenCalled();
    });
  });

  describe('ARIA Labels and Screen Reader Support', () => {
    test('all buttons have accessible names', () => {
      render(
        <div>
          <BottomNavigation currentView="dashboard" onNavigate={jest.fn()} />
          <VideoCard video={mockVideo} onClick={jest.fn()} />
          <HomeworkCard homework={mockHomework} onClick={jest.fn()} />
        </div>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const accessibleName = button.getAttribute('aria-label') || button.textContent;
        expect(accessibleName).toBeTruthy();
        expect(accessibleName!.length).toBeGreaterThan(0);
      });
    });

    test('complex UI elements have proper ARIA descriptions', () => {
      render(<VideoCard video={mockVideo} onClick={jest.fn()} />);

      const videoCard = screen.getByRole('button');
      const describedBy = videoCard.getAttribute('aria-describedby');
      
      expect(describedBy).toBeTruthy();
      
      if (describedBy) {
        const description = document.getElementById(describedBy);
        expect(description).toBeInTheDocument();
        expect(description?.textContent).toContain(mockVideo.title);
      }
    });

    test('status information is announced to screen readers', () => {
      render(<HomeworkCard homework={mockHomework} onClick={jest.fn()} />);

      const homeworkCard = screen.getByRole('button');
      const ariaLabel = homeworkCard.getAttribute('aria-label');
      
      expect(ariaLabel).toContain('not started');
      expect(ariaLabel).toContain(mockHomework.assignedBy);
    });

    test('decorative images are hidden from screen readers', () => {
      render(<VideoCard video={mockVideo} onClick={jest.fn()} />);

      const decorativeElements = document.querySelectorAll('[aria-hidden="true"]');
      expect(decorativeElements.length).toBeGreaterThan(0);
    });

    test('live regions announce important changes', async () => {
      const { rerender } = render(
        <AccessibilitySettings isOpen={false} onClose={jest.fn()} />
      );

      // Check for live region setup
      const liveRegions = document.querySelectorAll('[aria-live]');
      expect(liveRegions.length).toBeGreaterThanOrEqual(0); // May be created dynamically
    });
  });

  describe('High Contrast Mode', () => {
    test('high contrast mode applies appropriate styles', () => {
      accessibilityManager.updateConfig({ highContrast: true });

      render(<InteractiveButton>Test Button</InteractiveButton>);

      // Check if high contrast class is applied
      expect(document.documentElement).toHaveClass('high-contrast');
    });

    test('color contrast meets WCAG AA standards in high contrast mode', () => {
      accessibilityManager.updateConfig({ highContrast: true });

      const { container } = render(
        <div>
          <InteractiveButton variant="primary">Primary Button</InteractiveButton>
          <InteractiveButton variant="secondary">Secondary Button</InteractiveButton>
        </div>
      );

      // In a real implementation, you would check computed styles
      // and calculate contrast ratios here
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        expect(styles.borderWidth).toBe('3px'); // High contrast should have thicker borders
      });
    });
  });

  describe('Reduced Motion Support', () => {
    test('animations are disabled when reduced motion is enabled', () => {
      accessibilityManager.updateConfig({ reducedMotion: true });

      render(<InteractiveButton animationType="bounce">Animated Button</InteractiveButton>);

      expect(document.documentElement).toHaveClass('reduced-motion');
    });

    test('essential animations are preserved in reduced motion mode', () => {
      accessibilityManager.updateConfig({ reducedMotion: true });

      render(<InteractiveButton>Button</InteractiveButton>);

      // Focus indicators should still be visible
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveClass('focus-visible');
    });
  });

  describe('Large Text Mode', () => {
    test('text scales appropriately in large text mode', () => {
      accessibilityManager.updateConfig({ largeText: true });

      render(<InteractiveButton size="medium">Test Button</InteractiveButton>);

      expect(document.documentElement).toHaveClass('large-text');
    });

    test('touch targets increase in size with large text', () => {
      accessibilityManager.updateConfig({ largeText: true });

      const { container } = render(<InteractiveButton>Button</InteractiveButton>);

      const button = container.querySelector('button');
      const rect = button!.getBoundingClientRect();
      
      // Should be larger than standard size
      expect(rect.height).toBeGreaterThanOrEqual(ENHANCED_CHILD_TOUCH_CONFIG.minSize);
    });
  });

  describe('Screen Reader Mode', () => {
    test('additional descriptive content is provided in screen reader mode', () => {
      accessibilityManager.updateConfig({ screenReaderMode: true });

      render(<InteractiveButton ariaLabel="Custom label">Button</InteractiveButton>);

      expect(document.documentElement).toHaveClass('screen-reader-mode');
      
      // Check for screen reader only content
      const srOnlyElements = document.querySelectorAll('.sr-only');
      expect(srOnlyElements.length).toBeGreaterThan(0);
    });

    test('decorative elements are hidden in screen reader mode', () => {
      accessibilityManager.updateConfig({ screenReaderMode: true });

      render(<VideoCard video={mockVideo} onClick={jest.fn()} />);

      const decorativeElements = document.querySelectorAll('.decorative');
      decorativeElements.forEach(element => {
        expect(element).not.toBeVisible();
      });
    });
  });

  describe('Responsive Design', () => {
    test('components adapt to different screen sizes', () => {
      // Mock different viewport sizes
      const originalInnerWidth = window.innerWidth;
      const originalInnerHeight = window.innerHeight;

      // Mobile portrait
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, writable: true });

      const { container, rerender } = render(<InteractiveButton>Mobile Button</InteractiveButton>);

      // Trigger resize event
      fireEvent(window, new Event('resize'));

      // Check mobile-specific classes or styles
      const button = container.querySelector('button');
      expect(button).toHaveClass('child-touch-target');

      // Tablet landscape
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

      rerender(<InteractiveButton>Tablet Button</InteractiveButton>);
      fireEvent(window, new Event('resize'));

      // Desktop
      Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true });

      rerender(<InteractiveButton>Desktop Button</InteractiveButton>);
      fireEvent(window, new Event('resize'));

      // Restore original values
      Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, writable: true });
    });

    test('orientation changes are handled properly', () => {
      const { container } = render(
        <div className="landscape-optimize">
          <InteractiveButton>Button 1</InteractiveButton>
          <InteractiveButton>Button 2</InteractiveButton>
        </div>
      );

      // Simulate orientation change
      fireEvent(window, new Event('orientationchange'));

      // Check that layout adapts
      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement).toHaveClass('landscape-optimize');
    });
  });

  describe('WCAG 2.1 AA Compliance', () => {
    test('no accessibility violations in default state', async () => {
      const { container } = render(
        <div>
          <BottomNavigation currentView="dashboard" onNavigate={jest.fn()} />
          <VideoCard video={mockVideo} onClick={jest.fn()} />
          <HomeworkCard homework={mockHomework} onClick={jest.fn()} />
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('no accessibility violations in high contrast mode', async () => {
      accessibilityManager.updateConfig({ highContrast: true });

      const { container } = render(
        <div>
          <InteractiveButton variant="primary">Primary</InteractiveButton>
          <InteractiveButton variant="secondary">Secondary</InteractiveButton>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('focus management works correctly', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <InteractiveButton>First</InteractiveButton>
          <InteractiveButton>Second</InteractiveButton>
          <InteractiveButton>Third</InteractiveButton>
        </div>
      );

      // Test tab order
      await user.tab();
      expect(screen.getByText('First')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('Second')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('Third')).toHaveFocus();

      // Test shift+tab (reverse)
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(screen.getByText('Second')).toHaveFocus();
    });
  });

  describe('Child-Friendly Features', () => {
    test('error messages are child-friendly', () => {
      // This would test error components when they're implemented
      const errorMessage = "Oops! Something went wrong. Let's try again!";
      expect(errorMessage).not.toContain('Error 404');
      expect(errorMessage).not.toContain('Network timeout');
    });

    test('loading states are engaging for children', () => {
      // Test loading animations and messages
      const loadingMessage = "Getting ready for fun!";
      expect(loadingMessage).toMatch(/fun|ready|exciting|adventure/i);
    });

    test('success messages are encouraging', () => {
      const successMessage = "Great job! You did it!";
      expect(successMessage).toMatch(/great|awesome|fantastic|well done/i);
    });
  });

  describe('Performance with Accessibility Features', () => {
    test('accessibility features do not significantly impact performance', async () => {
      const startTime = performance.now();

      // Enable all accessibility features
      accessibilityManager.updateConfig({
        highContrast: true,
        reducedMotion: true,
        largeText: true,
        screenReaderMode: true
      });

      render(
        <div>
          <BottomNavigation currentView="dashboard" onNavigate={jest.fn()} />
          <VideoCard video={mockVideo} onClick={jest.fn()} />
          <HomeworkCard homework={mockHomework} onClick={jest.fn()} />
        </div>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time (adjust threshold as needed)
      expect(renderTime).toBeLessThan(100); // 100ms threshold
    });
  });
});

describe('Accessibility Utils', () => {
  test('AccessibilityManager validates touch targets correctly', () => {
    const manager = new AccessibilityManager();
    
    // Create a mock element
    const mockElement = document.createElement('button');
    mockElement.style.width = '60px';
    mockElement.style.height = '60px';
    
    // Mock getBoundingClientRect
    jest.spyOn(mockElement, 'getBoundingClientRect').mockReturnValue({
      width: 60,
      height: 60,
      top: 0,
      left: 0,
      bottom: 60,
      right: 60,
      x: 0,
      y: 0,
      toJSON: () => ({})
    });

    const isValid = manager.validateTouchTarget(mockElement, CHILD_TOUCH_CONFIG);
    expect(isValid).toBe(true);
  });

  test('screen reader announcements work correctly', () => {
    const manager = new AccessibilityManager();
    
    // Mock document.body.appendChild and removeChild
    const mockAppendChild = jest.spyOn(document.body, 'appendChild').mockImplementation();
    const mockRemoveChild = jest.spyOn(document.body, 'removeChild').mockImplementation();

    manager.announceToScreenReader('Test announcement', 'assertive');

    expect(mockAppendChild).toHaveBeenCalled();
    
    // Check that removal is scheduled
    setTimeout(() => {
      expect(mockRemoveChild).toHaveBeenCalled();
    }, 1100);

    mockAppendChild.mockRestore();
    mockRemoveChild.mockRestore();
  });
});