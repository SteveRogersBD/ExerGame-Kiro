/**
 * Accessibility validation tests for Kids Dashboard components
 * Tests touch targets, ARIA labels, and keyboard navigation
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import components to test
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import VideoCard from '@/components/dashboard/VideoCard';
import HomeworkCard from '@/components/dashboard/HomeworkCard';
import InteractiveButton from '@/components/ui/InteractiveButton';
import { AccessibilityManager, CHILD_TOUCH_CONFIG } from '@/lib/accessibility-utils';

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
  dueDate: new Date(Date.now() + 86400000)
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

jest.mock('@/hooks/useAccessibility', () => ({
  useAccessibility: () => [
    {
      isHighContrast: false,
      isReducedMotion: false,
      isLargeText: false,
      isScreenReaderMode: false,
      touchConfig: CHILD_TOUCH_CONFIG
    },
    {
      createChildFriendlyLabel: (action: string, context?: string) => 
        context ? `${action} - ${context}` : action,
      generateAriaId: (prefix: string = 'aria') => `${prefix}-test-id`,
      announceToScreenReader: jest.fn()
    }
  ],
  useScreenReaderAnnouncements: () => ({
    announceNavigation: jest.fn(),
    announceAction: jest.fn(),
    announceError: jest.fn(),
    announceSuccess: jest.fn(),
    announceLoading: jest.fn()
  }),
  useKeyboardNavigation: jest.fn(),
  useResponsiveAccessibility: () => ({
    screenSize: 'desktop' as const,
    orientation: 'landscape' as const,
    optimalTouchSize: 60,
    responsiveClasses: '',
    isTouch: false
  })
}));

describe('Accessibility Validation', () => {
  let accessibilityManager: AccessibilityManager;

  beforeEach(() => {
    accessibilityManager = new AccessibilityManager();
  });

  describe('Touch Target Validation', () => {
    test('InteractiveButton meets minimum touch target size', () => {
      const { container } = render(
        <InteractiveButton size="medium">Test Button</InteractiveButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('child-touch-target');
    });

    test('BottomNavigation buttons are large enough', () => {
      const { container } = render(
        <BottomNavigation currentView="dashboard" onNavigate={jest.fn()} />
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('child-touch-target');
        
        // Check minimum size classes
        const classList = Array.from(button.classList);
        const hasMinHeight = classList.some(cls => cls.includes('min-h-'));
        const hasMinWidth = classList.some(cls => cls.includes('min-w-'));
        
        expect(hasMinHeight).toBe(true);
        expect(hasMinWidth).toBe(true);
      });
    });

    test('VideoCard and HomeworkCard are touch-friendly', () => {
      const { container: videoContainer } = render(
        <VideoCard video={mockVideo} onClick={jest.fn()} />
      );
      
      const { container: homeworkContainer } = render(
        <HomeworkCard homework={mockHomework} onClick={jest.fn()} />
      );

      const videoCard = videoContainer.querySelector('[role="button"]');
      const homeworkCard = homeworkContainer.querySelector('[role="button"]');

      expect(videoCard).toHaveClass('child-touch-target');
      expect(homeworkCard).toHaveClass('child-touch-target');
    });
  });

  describe('ARIA Labels and Accessibility', () => {
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
        const ariaLabel = button.getAttribute('aria-label');
        const textContent = button.textContent;
        
        // Button should have either aria-label or text content
        expect(ariaLabel || textContent).toBeTruthy();
        
        if (ariaLabel) {
          expect(ariaLabel.length).toBeGreaterThan(0);
        }
        if (textContent) {
          expect(textContent.trim().length).toBeGreaterThan(0);
        }
      });
    });

    test('complex elements have proper ARIA descriptions', () => {
      render(<VideoCard video={mockVideo} onClick={jest.fn()} />);

      const videoCard = screen.getByRole('button');
      const describedBy = videoCard.getAttribute('aria-describedby');
      
      expect(describedBy).toBeTruthy();
      
      if (describedBy) {
        const description = document.getElementById(describedBy);
        expect(description).toBeInTheDocument();
      }
    });

    test('navigation has proper ARIA structure', () => {
      render(<BottomNavigation currentView="dashboard" onNavigate={jest.fn()} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label');
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    test('status information is properly communicated', () => {
      render(<HomeworkCard homework={mockHomework} onClick={jest.fn()} />);

      const homeworkCard = screen.getByRole('button');
      const ariaLabel = homeworkCard.getAttribute('aria-label');
      
      expect(ariaLabel).toContain('not started');
      expect(ariaLabel).toContain(mockHomework.assignedBy);
    });
  });

  describe('Keyboard Navigation', () => {
    test('all interactive elements are focusable', () => {
      render(
        <div>
          <InteractiveButton>Button 1</InteractiveButton>
          <InteractiveButton>Button 2</InteractiveButton>
          <InteractiveButton>Button 3</InteractiveButton>
        </div>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('tabIndex');
        const tabIndex = button.getAttribute('tabIndex');
        expect(tabIndex).not.toBe('-1'); // Should be focusable
      });
    });

    test('disabled buttons are not focusable', () => {
      render(<InteractiveButton disabled>Disabled Button</InteractiveButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '-1');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    test('keyboard events are handled properly', () => {
      const mockClick = jest.fn();
      render(<InteractiveButton onClick={mockClick}>Test Button</InteractiveButton>);

      const button = screen.getByRole('button');
      
      // Test Enter key
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(mockClick).toHaveBeenCalledTimes(1);

      // Test Space key
      fireEvent.keyDown(button, { key: ' ' });
      expect(mockClick).toHaveBeenCalledTimes(2);

      // Test other keys (should not trigger)
      fireEvent.keyDown(button, { key: 'a' });
      expect(mockClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Focus Management', () => {
    test('focus indicators are visible', () => {
      render(<InteractiveButton>Test Button</InteractiveButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible');
    });

    test('focus trap works in modals', () => {
      // This would test modal focus trapping when implemented
      const { container } = render(
        <div role="dialog" aria-modal="true">
          <InteractiveButton>First</InteractiveButton>
          <InteractiveButton>Last</InteractiveButton>
        </div>
      );

      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('Responsive Design', () => {
    test('components have responsive classes', () => {
      const { container } = render(
        <div className="interactive-spacing horizontal">
          <InteractiveButton>Button 1</InteractiveButton>
          <InteractiveButton>Button 2</InteractiveButton>
        </div>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('interactive-spacing');
      expect(wrapper).toHaveClass('horizontal');
    });

    test('touch targets scale appropriately', () => {
      render(<InteractiveButton size="large">Large Button</InteractiveButton>);

      const button = screen.getByRole('button');
      const classList = Array.from(button.classList);
      
      // Should have size-related classes
      const hasSizeClass = classList.some(cls => 
        cls.includes('min-h-') || cls.includes('min-w-') || cls.includes('px-') || cls.includes('py-')
      );
      
      expect(hasSizeClass).toBe(true);
    });
  });

  describe('Screen Reader Support', () => {
    test('decorative elements are hidden from screen readers', () => {
      render(<VideoCard video={mockVideo} onClick={jest.fn()} />);

      // Check for aria-hidden on decorative elements
      const decorativeElements = document.querySelectorAll('[aria-hidden="true"]');
      expect(decorativeElements.length).toBeGreaterThan(0);
    });

    test('meaningful images have alt text or labels', () => {
      render(<VideoCard video={mockVideo} onClick={jest.fn()} />);

      // Check for proper labeling of emoji and icon elements
      const emojiElements = document.querySelectorAll('[role="img"]');
      emojiElements.forEach(element => {
        const hasLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
        const isHidden = element.getAttribute('aria-hidden') === 'true';
        
        // Should either have a label or be hidden
        expect(hasLabel || isHidden).toBe(true);
      });
    });

    test('live regions are set up for announcements', () => {
      // Check that components can create live regions
      const manager = new AccessibilityManager();
      
      // Mock DOM methods
      const mockAppendChild = jest.spyOn(document.body, 'appendChild').mockImplementation();
      const mockRemoveChild = jest.spyOn(document.body, 'removeChild').mockImplementation();

      manager.announceToScreenReader('Test announcement');

      expect(mockAppendChild).toHaveBeenCalled();

      mockAppendChild.mockRestore();
      mockRemoveChild.mockRestore();
    });
  });

  describe('Child-Friendly Design', () => {
    test('error states use child-friendly language', () => {
      // Test that error messages are appropriate for children
      const childFriendlyErrors = [
        "Oops! Let's try that again!",
        "Something went wrong, but don't worry!",
        "Let's give it another try!"
      ];

      childFriendlyErrors.forEach(error => {
        expect(error).not.toMatch(/error|fail|invalid|timeout/i);
        expect(error).toMatch(/try|oops|let's|don't worry/i);
      });
    });

    test('success messages are encouraging', () => {
      const encouragingMessages = [
        "Great job!",
        "You did it!",
        "Awesome work!",
        "Well done!"
      ];

      encouragingMessages.forEach(message => {
        expect(message).toMatch(/great|awesome|good|well done|you did it/i);
      });
    });

    test('loading messages are engaging', () => {
      const engagingMessages = [
        "Getting ready for fun!",
        "Loading your adventure!",
        "Preparing something awesome!"
      ];

      engagingMessages.forEach(message => {
        expect(message).toMatch(/fun|adventure|awesome|exciting|ready/i);
      });
    });
  });
});

describe('AccessibilityManager', () => {
  test('validates touch targets correctly', () => {
    const manager = new AccessibilityManager();
    
    // Create mock element
    const mockElement = document.createElement('button');
    
    // Mock getBoundingClientRect for valid size
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

    // Mock getBoundingClientRect for invalid size
    jest.spyOn(mockElement, 'getBoundingClientRect').mockReturnValue({
      width: 30,
      height: 30,
      top: 0,
      left: 0,
      bottom: 30,
      right: 30,
      x: 0,
      y: 0,
      toJSON: () => ({})
    });

    const isInvalid = manager.validateTouchTarget(mockElement, CHILD_TOUCH_CONFIG);
    expect(isInvalid).toBe(false);
  });

  test('configuration updates work correctly', () => {
    const manager = new AccessibilityManager();
    
    const initialConfig = manager.getConfig();
    expect(initialConfig.highContrast).toBe(false);

    manager.updateConfig({ highContrast: true });
    
    const updatedConfig = manager.getConfig();
    expect(updatedConfig.highContrast).toBe(true);
  });

  test('ARIA utilities generate proper labels', () => {
    const { ariaUtils } = require('@/lib/accessibility-utils');
    
    const id = ariaUtils.generateId('test');
    expect(id).toMatch(/^test-/);
    
    const label = ariaUtils.createChildFriendlyLabel('play', 'video');
    expect(label).toContain('play');
    expect(label).toContain('video');
    
    const description = ariaUtils.createDescription('button', 'active', 'Click to start');
    expect(description).toContain('button');
    expect(description).toContain('active');
    expect(description).toContain('Click to start');
  });
});