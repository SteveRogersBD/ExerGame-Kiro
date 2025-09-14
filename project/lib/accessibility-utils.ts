/**
 * Accessibility utilities for the Kids Dashboard
 * Ensures compliance with WCAG 2.1 AA standards and child-friendly design
 */

export interface AccessibilityConfig {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReaderMode: boolean;
}

export interface TouchTargetConfig {
  minSize: number; // Minimum touch target size in pixels
  minSpacing: number; // Minimum spacing between targets
}

// WCAG 2.1 AA compliant touch target configuration
export const CHILD_TOUCH_CONFIG: TouchTargetConfig = {
  minSize: 44, // WCAG minimum, but we'll use larger for children
  minSpacing: 8
};

// Enhanced touch target configuration for children
export const ENHANCED_CHILD_TOUCH_CONFIG: TouchTargetConfig = {
  minSize: 60, // Larger for small hands
  minSpacing: 12
};

/**
 * High contrast color schemes for accessibility
 */
export const HIGH_CONTRAST_COLORS = {
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    primary: '#000000',
    secondary: '#4A4A4A',
    accent: '#0066CC',
    success: '#006600',
    warning: '#CC6600',
    error: '#CC0000',
    text: '#000000',
    textSecondary: '#4A4A4A',
    border: '#000000'
  },
  dark: {
    background: '#000000',
    surface: '#1A1A1A',
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    accent: '#66B3FF',
    success: '#66FF66',
    warning: '#FFB366',
    error: '#FF6666',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    border: '#FFFFFF'
  }
};

/**
 * Accessibility utility class for managing accessibility features
 */
export class AccessibilityManager {
  private config: AccessibilityConfig;
  private mediaQueries: { [key: string]: MediaQueryList } = {};

  constructor(initialConfig?: Partial<AccessibilityConfig>) {
    this.config = {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      screenReaderMode: false,
      ...initialConfig
    };

    this.initializeMediaQueries();
    this.applySystemPreferences();
  }

  /**
   * Initialize media queries for system preferences
   */
  private initializeMediaQueries() {
    if (typeof window !== 'undefined') {
      this.mediaQueries.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.mediaQueries.highContrast = window.matchMedia('(prefers-contrast: high)');
      this.mediaQueries.largeText = window.matchMedia('(prefers-reduced-data: reduce)');

      // Listen for changes
      Object.values(this.mediaQueries).forEach(mq => {
        mq.addEventListener('change', () => this.applySystemPreferences());
      });
    }
  }

  /**
   * Apply system accessibility preferences
   */
  private applySystemPreferences() {
    if (this.mediaQueries.reducedMotion?.matches) {
      this.config.reducedMotion = true;
    }
    if (this.mediaQueries.highContrast?.matches) {
      this.config.highContrast = true;
    }
  }

  /**
   * Update accessibility configuration
   */
  updateConfig(updates: Partial<AccessibilityConfig>) {
    this.config = { ...this.config, ...updates };
    this.applyConfiguration();
  }

  /**
   * Get current accessibility configuration
   */
  getConfig(): AccessibilityConfig {
    return { ...this.config };
  }

  /**
   * Apply accessibility configuration to document
   */
  private applyConfiguration() {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Apply high contrast mode
    if (this.config.highContrast) {
      root.classList.add('high-contrast');
      this.applyHighContrastColors();
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (this.config.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Apply large text
    if (this.config.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Apply screen reader mode
    if (this.config.screenReaderMode) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
  }

  /**
   * Apply high contrast colors using CSS custom properties
   */
  private applyHighContrastColors() {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const colors = HIGH_CONTRAST_COLORS.light; // Default to light theme

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--hc-${key}`, value);
    });
  }

  /**
   * Check if an element meets touch target size requirements
   */
  validateTouchTarget(element: HTMLElement, config: TouchTargetConfig = CHILD_TOUCH_CONFIG): boolean {
    const rect = element.getBoundingClientRect();
    return rect.width >= config.minSize && rect.height >= config.minSize;
  }

  /**
   * Get touch target validation results for all interactive elements
   */
  validateAllTouchTargets(container: HTMLElement, config: TouchTargetConfig = CHILD_TOUCH_CONFIG): Array<{
    element: HTMLElement;
    valid: boolean;
    width: number;
    height: number;
    issues: string[];
  }> {
    const interactiveElements = this.getInteractiveElements(container);
    
    return interactiveElements.map(element => {
      const rect = element.getBoundingClientRect();
      const issues: string[] = [];
      
      if (rect.width < config.minSize) {
        issues.push(`Width ${rect.width}px is less than minimum ${config.minSize}px`);
      }
      
      if (rect.height < config.minSize) {
        issues.push(`Height ${rect.height}px is less than minimum ${config.minSize}px`);
      }

      return {
        element,
        valid: issues.length === 0,
        width: rect.width,
        height: rect.height,
        issues
      };
    });
  }

  /**
   * Get all interactive elements in a container
   */
  private getInteractiveElements(container: HTMLElement): HTMLElement[] {
    const selectors = [
      'button',
      'a[href]',
      'input:not([type="hidden"])',
      'textarea',
      'select',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[role="link"]',
      '[role="menuitem"]',
      '[role="tab"]'
    ];

    return Array.from(container.querySelectorAll(selectors.join(', '))) as HTMLElement[];
  }

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (typeof document === 'undefined') return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Focus management utilities
   */
  focusManagement = {
    /**
     * Trap focus within a container (for modals, etc.)
     */
    trapFocus: (container: HTMLElement) => {
      const focusableElements = this.getInteractiveElements(container);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      container.addEventListener('keydown', handleKeyDown);
      firstElement.focus();

      return () => {
        container.removeEventListener('keydown', handleKeyDown);
      };
    },

    /**
     * Restore focus to a previously focused element
     */
    restoreFocus: (element: HTMLElement | null) => {
      if (element && typeof element.focus === 'function') {
        element.focus();
      }
    },

    /**
     * Get the next focusable element
     */
    getNextFocusable: (current: HTMLElement, container: HTMLElement): HTMLElement | null => {
      const focusableElements = this.getInteractiveElements(container);
      const currentIndex = focusableElements.indexOf(current);
      
      if (currentIndex === -1) return null;
      
      const nextIndex = (currentIndex + 1) % focusableElements.length;
      return focusableElements[nextIndex];
    },

    /**
     * Get the previous focusable element
     */
    getPreviousFocusable: (current: HTMLElement, container: HTMLElement): HTMLElement | null => {
      const focusableElements = this.getInteractiveElements(container);
      const currentIndex = focusableElements.indexOf(current);
      
      if (currentIndex === -1) return null;
      
      const prevIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
      return focusableElements[prevIndex];
    }
  };
}

/**
 * Hook for using accessibility manager in React components
 */
export function useAccessibilityManager(initialConfig?: Partial<AccessibilityConfig>) {
  if (typeof window === 'undefined') {
    return new AccessibilityManager(initialConfig);
  }

  // In browser environment, create singleton
  if (!(window as any).__accessibilityManager) {
    (window as any).__accessibilityManager = new AccessibilityManager(initialConfig);
  }

  return (window as any).__accessibilityManager as AccessibilityManager;
}

/**
 * Utility functions for ARIA attributes
 */
export const ariaUtils = {
  /**
   * Generate unique ID for ARIA relationships
   */
  generateId: (prefix: string = 'aria'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Create ARIA label for child-friendly descriptions
   */
  createChildFriendlyLabel: (action: string, context?: string): string => {
    const labels = {
      play: 'Start playing this fun video',
      pause: 'Pause the video',
      stop: 'Stop and go back',
      next: 'Go to the next activity',
      back: 'Go back to the previous page',
      home: 'Go to the main dashboard',
      help: 'Get help and guidance',
      badges: 'See your earned badges and rewards'
    };

    const baseLabel = labels[action as keyof typeof labels] || action;
    return context ? `${baseLabel} - ${context}` : baseLabel;
  },

  /**
   * Create descriptive text for complex UI elements
   */
  createDescription: (element: string, state?: string, additional?: string): string => {
    let description = element;
    
    if (state) {
      description += ` - ${state}`;
    }
    
    if (additional) {
      description += `. ${additional}`;
    }
    
    return description;
  }
};

/**
 * Keyboard navigation utilities
 */
export const keyboardUtils = {
  /**
   * Handle arrow key navigation in grids/lists
   */
  handleArrowNavigation: (
    event: KeyboardEvent,
    container: HTMLElement,
    orientation: 'horizontal' | 'vertical' | 'grid' = 'horizontal'
  ) => {
    const focusableElements = Array.from(
      container.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])')
    ) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(event.target as HTMLElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'grid') {
          nextIndex = (currentIndex + 1) % focusableElements.length;
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'grid') {
          nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
        }
        break;
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'grid') {
          nextIndex = (currentIndex + 1) % focusableElements.length;
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'grid') {
          nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
        }
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = focusableElements.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    focusableElements[nextIndex]?.focus();
  }
};