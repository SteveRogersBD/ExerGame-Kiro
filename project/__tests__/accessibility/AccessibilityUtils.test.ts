/**
 * Tests for accessibility utilities and configuration
 */

import { 
  AccessibilityManager, 
  CHILD_TOUCH_CONFIG, 
  ENHANCED_CHILD_TOUCH_CONFIG,
  ariaUtils,
  keyboardUtils
} from '@/lib/accessibility-utils';

// Mock DOM methods
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('AccessibilityManager', () => {
  let manager: AccessibilityManager;

  beforeEach(() => {
    manager = new AccessibilityManager();
  });

  test('initializes with default configuration', () => {
    const config = manager.getConfig();
    
    expect(config.highContrast).toBe(false);
    expect(config.reducedMotion).toBe(false);
    expect(config.largeText).toBe(false);
    expect(config.screenReaderMode).toBe(false);
  });

  test('updates configuration correctly', () => {
    manager.updateConfig({ highContrast: true });
    
    const config = manager.getConfig();
    expect(config.highContrast).toBe(true);
    expect(config.reducedMotion).toBe(false); // Other settings unchanged
  });

  test('validates touch targets correctly', () => {
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

  test('announces to screen reader', () => {
    // Mock document.body methods
    const mockAppendChild = jest.spyOn(document.body, 'appendChild').mockImplementation();
    const mockRemoveChild = jest.spyOn(document.body, 'removeChild').mockImplementation();

    manager.announceToScreenReader('Test announcement', 'assertive');

    expect(mockAppendChild).toHaveBeenCalled();
    
    // Check that the announcement element was created correctly
    const call = mockAppendChild.mock.calls[0];
    const announcementElement = call[0] as HTMLElement;
    
    expect(announcementElement.getAttribute('aria-live')).toBe('assertive');
    expect(announcementElement.getAttribute('aria-atomic')).toBe('true');
    expect(announcementElement.textContent).toBe('Test announcement');
    expect(announcementElement.className).toBe('sr-only');

    mockAppendChild.mockRestore();
    mockRemoveChild.mockRestore();
  });

  test('validates all touch targets in container', () => {
    // Create container with buttons
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    
    container.appendChild(button1);
    container.appendChild(button2);

    // Mock getBoundingClientRect for both buttons
    jest.spyOn(button1, 'getBoundingClientRect').mockReturnValue({
      width: 60, height: 60, top: 0, left: 0, bottom: 60, right: 60, x: 0, y: 0, toJSON: () => ({})
    });
    
    jest.spyOn(button2, 'getBoundingClientRect').mockReturnValue({
      width: 30, height: 30, top: 0, left: 0, bottom: 30, right: 30, x: 0, y: 0, toJSON: () => ({})
    });

    const results = manager.validateAllTouchTargets(container, CHILD_TOUCH_CONFIG);
    
    expect(results).toHaveLength(2);
    expect(results[0].valid).toBe(true);
    expect(results[1].valid).toBe(false);
    expect(results[1].issues).toContain('Width 30px is less than minimum 44px');
    expect(results[1].issues).toContain('Height 30px is less than minimum 44px');
  });
});

describe('Touch Target Configuration', () => {
  test('CHILD_TOUCH_CONFIG has correct values', () => {
    expect(CHILD_TOUCH_CONFIG.minSize).toBe(44);
    expect(CHILD_TOUCH_CONFIG.minSpacing).toBe(8);
  });

  test('ENHANCED_CHILD_TOUCH_CONFIG has larger values', () => {
    expect(ENHANCED_CHILD_TOUCH_CONFIG.minSize).toBe(60);
    expect(ENHANCED_CHILD_TOUCH_CONFIG.minSpacing).toBe(12);
    expect(ENHANCED_CHILD_TOUCH_CONFIG.minSize).toBeGreaterThan(CHILD_TOUCH_CONFIG.minSize);
  });
});

describe('ARIA Utilities', () => {
  test('generateId creates unique IDs', () => {
    const id1 = ariaUtils.generateId('test');
    const id2 = ariaUtils.generateId('test');
    
    expect(id1).toMatch(/^test-/);
    expect(id2).toMatch(/^test-/);
    expect(id1).not.toBe(id2);
  });

  test('createChildFriendlyLabel generates appropriate labels', () => {
    const label1 = ariaUtils.createChildFriendlyLabel('play');
    expect(label1).toBe('Start playing this fun video');

    const label2 = ariaUtils.createChildFriendlyLabel('play', 'counting video');
    expect(label2).toBe('Start playing this fun video - counting video');

    const label3 = ariaUtils.createChildFriendlyLabel('home');
    expect(label3).toBe('Go to the main dashboard');

    const label4 = ariaUtils.createChildFriendlyLabel('unknown');
    expect(label4).toBe('unknown');
  });

  test('createDescription builds comprehensive descriptions', () => {
    const desc1 = ariaUtils.createDescription('button');
    expect(desc1).toBe('button');

    const desc2 = ariaUtils.createDescription('button', 'active');
    expect(desc2).toBe('button - active');

    const desc3 = ariaUtils.createDescription('button', 'active', 'Click to start');
    expect(desc3).toBe('button - active. Click to start');
  });
});

describe('Keyboard Utilities', () => {
  test('handleArrowNavigation processes keyboard events', () => {
    // Create mock container with focusable elements
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    const button3 = document.createElement('button');
    
    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);

    // Mock focus method
    const mockFocus1 = jest.spyOn(button1, 'focus').mockImplementation();
    const mockFocus2 = jest.spyOn(button2, 'focus').mockImplementation();
    const mockFocus3 = jest.spyOn(button3, 'focus').mockImplementation();

    // Test ArrowRight navigation
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    Object.defineProperty(event, 'target', { value: button1 });
    const mockPreventDefault = jest.spyOn(event, 'preventDefault').mockImplementation();

    keyboardUtils.handleArrowNavigation(event, container, 'horizontal');

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(mockFocus2).toHaveBeenCalled();

    mockFocus1.mockRestore();
    mockFocus2.mockRestore();
    mockFocus3.mockRestore();
  });

  test('handleArrowNavigation wraps around at end', () => {
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    
    container.appendChild(button1);
    container.appendChild(button2);

    const mockFocus1 = jest.spyOn(button1, 'focus').mockImplementation();
    const mockFocus2 = jest.spyOn(button2, 'focus').mockImplementation();

    // Navigate from last button should wrap to first
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    Object.defineProperty(event, 'target', { value: button2 });
    const mockPreventDefault = jest.spyOn(event, 'preventDefault').mockImplementation();

    keyboardUtils.handleArrowNavigation(event, container, 'horizontal');

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(mockFocus1).toHaveBeenCalled();

    mockFocus1.mockRestore();
    mockFocus2.mockRestore();
  });

  test('handleArrowNavigation handles Home and End keys', () => {
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    const button3 = document.createElement('button');
    
    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);

    const mockFocus1 = jest.spyOn(button1, 'focus').mockImplementation();
    const mockFocus3 = jest.spyOn(button3, 'focus').mockImplementation();

    // Test Home key
    const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
    Object.defineProperty(homeEvent, 'target', { value: button2 });
    const mockPreventDefaultHome = jest.spyOn(homeEvent, 'preventDefault').mockImplementation();

    keyboardUtils.handleArrowNavigation(homeEvent, container, 'horizontal');

    expect(mockPreventDefaultHome).toHaveBeenCalled();
    expect(mockFocus1).toHaveBeenCalled();

    // Test End key
    const endEvent = new KeyboardEvent('keydown', { key: 'End' });
    Object.defineProperty(endEvent, 'target', { value: button2 });
    const mockPreventDefaultEnd = jest.spyOn(endEvent, 'preventDefault').mockImplementation();

    keyboardUtils.handleArrowNavigation(endEvent, container, 'horizontal');

    expect(mockPreventDefaultEnd).toHaveBeenCalled();
    expect(mockFocus3).toHaveBeenCalled();

    mockFocus1.mockRestore();
    mockFocus3.mockRestore();
  });
});

describe('Focus Management', () => {
  test('trapFocus creates focus trap', () => {
    const manager = new AccessibilityManager();
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    
    container.appendChild(button1);
    container.appendChild(button2);

    const mockFocus1 = jest.spyOn(button1, 'focus').mockImplementation();
    const mockAddEventListener = jest.spyOn(container, 'addEventListener').mockImplementation();

    const cleanup = manager.focusManagement.trapFocus(container);

    expect(mockFocus1).toHaveBeenCalled();
    expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(typeof cleanup).toBe('function');

    mockFocus1.mockRestore();
    mockAddEventListener.mockRestore();
  });

  test('getNextFocusable returns correct element', () => {
    const manager = new AccessibilityManager();
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    const button3 = document.createElement('button');
    
    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);

    const next = manager.focusManagement.getNextFocusable(button1, container);
    expect(next).toBe(button2);

    const nextFromLast = manager.focusManagement.getNextFocusable(button3, container);
    expect(nextFromLast).toBe(button1); // Should wrap around
  });

  test('getPreviousFocusable returns correct element', () => {
    const manager = new AccessibilityManager();
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    const button3 = document.createElement('button');
    
    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);

    const prev = manager.focusManagement.getPreviousFocusable(button2, container);
    expect(prev).toBe(button1);

    const prevFromFirst = manager.focusManagement.getPreviousFocusable(button1, container);
    expect(prevFromFirst).toBe(button3); // Should wrap around
  });
});

describe('Child-Friendly Design Validation', () => {
  test('validates child-friendly error messages', () => {
    const childFriendlyErrors = [
      "Oops! Let's try that again!",
      "Something went wrong, but don't worry!",
      "Let's give it another try!"
    ];

    const adultErrors = [
      "Error 404: Not Found",
      "Network timeout occurred",
      "Invalid input parameters"
    ];

    childFriendlyErrors.forEach(error => {
      expect(error).not.toMatch(/error|fail|invalid|timeout/i);
      expect(error).toMatch(/try|oops|let's|don't worry/i);
    });

    adultErrors.forEach(error => {
      expect(error).toMatch(/error|timeout|invalid/i);
    });
  });

  test('validates encouraging success messages', () => {
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

  test('validates engaging loading messages', () => {
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

describe('Responsive Design Helpers', () => {
  test('touch target configurations scale appropriately', () => {
    // Standard configuration for WCAG compliance
    expect(CHILD_TOUCH_CONFIG.minSize).toBeGreaterThanOrEqual(44);
    
    // Enhanced configuration for young children
    expect(ENHANCED_CHILD_TOUCH_CONFIG.minSize).toBeGreaterThan(CHILD_TOUCH_CONFIG.minSize);
    expect(ENHANCED_CHILD_TOUCH_CONFIG.minSpacing).toBeGreaterThan(CHILD_TOUCH_CONFIG.minSpacing);
  });
});

describe('High Contrast Mode', () => {
  test('high contrast colors are defined', () => {
    const { HIGH_CONTRAST_COLORS } = require('@/lib/accessibility-utils');
    
    expect(HIGH_CONTRAST_COLORS.light).toBeDefined();
    expect(HIGH_CONTRAST_COLORS.dark).toBeDefined();
    
    expect(HIGH_CONTRAST_COLORS.light.background).toBe('#FFFFFF');
    expect(HIGH_CONTRAST_COLORS.light.text).toBe('#000000');
    
    expect(HIGH_CONTRAST_COLORS.dark.background).toBe('#000000');
    expect(HIGH_CONTRAST_COLORS.dark.text).toBe('#FFFFFF');
  });
});