'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  AccessibilityManager, 
  AccessibilityConfig, 
  useAccessibilityManager,
  CHILD_TOUCH_CONFIG,
  ENHANCED_CHILD_TOUCH_CONFIG,
  ariaUtils
} from '@/lib/accessibility-utils';

export interface UseAccessibilityOptions {
  enableHighContrast?: boolean;
  enableReducedMotion?: boolean;
  enableLargeText?: boolean;
  touchTargetSize?: 'standard' | 'enhanced';
  announceChanges?: boolean;
}

export interface AccessibilityState {
  isHighContrast: boolean;
  isReducedMotion: boolean;
  isLargeText: boolean;
  isScreenReaderMode: boolean;
  touchConfig: typeof CHILD_TOUCH_CONFIG;
}

export interface AccessibilityActions {
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleLargeText: () => void;
  toggleScreenReaderMode: () => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  validateTouchTargets: (container: HTMLElement) => boolean;
  generateAriaId: (prefix?: string) => string;
  createChildFriendlyLabel: (action: string, context?: string) => string;
  focusTrap: (container: HTMLElement) => (() => void) | undefined;
}

/**
 * Hook for managing accessibility features in components
 */
export function useAccessibility(options: UseAccessibilityOptions = {}): [AccessibilityState, AccessibilityActions] {
  const {
    enableHighContrast = true,
    enableReducedMotion = true,
    enableLargeText = true,
    touchTargetSize = 'enhanced',
    announceChanges = true
  } = options;

  const accessibilityManager = useAccessibilityManager();
  const [config, setConfig] = useState<AccessibilityConfig>(accessibilityManager.getConfig());
  const previousConfigRef = useRef<AccessibilityConfig>(config);

  // Update state when config changes
  useEffect(() => {
    const currentConfig = accessibilityManager.getConfig();
    setConfig(currentConfig);
    
    // Announce changes to screen reader if enabled
    if (announceChanges) {
      const previous = previousConfigRef.current;
      
      if (previous.highContrast !== currentConfig.highContrast) {
        accessibilityManager.announceToScreenReader(
          currentConfig.highContrast ? 'High contrast mode enabled' : 'High contrast mode disabled'
        );
      }
      
      if (previous.reducedMotion !== currentConfig.reducedMotion) {
        accessibilityManager.announceToScreenReader(
          currentConfig.reducedMotion ? 'Reduced motion enabled' : 'Reduced motion disabled'
        );
      }
      
      if (previous.largeText !== currentConfig.largeText) {
        accessibilityManager.announceToScreenReader(
          currentConfig.largeText ? 'Large text mode enabled' : 'Large text mode disabled'
        );
      }
    }
    
    previousConfigRef.current = currentConfig;
  }, [accessibilityManager, announceChanges]);

  // State object
  const state: AccessibilityState = {
    isHighContrast: config.highContrast,
    isReducedMotion: config.reducedMotion,
    isLargeText: config.largeText,
    isScreenReaderMode: config.screenReaderMode,
    touchConfig: touchTargetSize === 'enhanced' ? ENHANCED_CHILD_TOUCH_CONFIG : CHILD_TOUCH_CONFIG
  };

  // Actions object
  const actions: AccessibilityActions = {
    toggleHighContrast: useCallback(() => {
      if (enableHighContrast) {
        accessibilityManager.updateConfig({ highContrast: !config.highContrast });
      }
    }, [accessibilityManager, config.highContrast, enableHighContrast]),

    toggleReducedMotion: useCallback(() => {
      if (enableReducedMotion) {
        accessibilityManager.updateConfig({ reducedMotion: !config.reducedMotion });
      }
    }, [accessibilityManager, config.reducedMotion, enableReducedMotion]),

    toggleLargeText: useCallback(() => {
      if (enableLargeText) {
        accessibilityManager.updateConfig({ largeText: !config.largeText });
      }
    }, [accessibilityManager, config.largeText, enableLargeText]),

    toggleScreenReaderMode: useCallback(() => {
      accessibilityManager.updateConfig({ screenReaderMode: !config.screenReaderMode });
    }, [accessibilityManager, config.screenReaderMode]),

    announceToScreenReader: useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
      accessibilityManager.announceToScreenReader(message, priority);
    }, [accessibilityManager]),

    validateTouchTargets: useCallback((container: HTMLElement) => {
      const results = accessibilityManager.validateAllTouchTargets(container, state.touchConfig);
      const allValid = results.every(result => result.valid);
      
      if (!allValid && announceChanges) {
        const invalidCount = results.filter(result => !result.valid).length;
        accessibilityManager.announceToScreenReader(
          `${invalidCount} buttons may be too small for easy tapping`,
          'assertive'
        );
      }
      
      return allValid;
    }, [accessibilityManager, state.touchConfig, announceChanges]),

    generateAriaId: useCallback((prefix?: string) => {
      return ariaUtils.generateId(prefix);
    }, []),

    createChildFriendlyLabel: useCallback((action: string, context?: string) => {
      return ariaUtils.createChildFriendlyLabel(action, context);
    }, []),

    focusTrap: useCallback((container: HTMLElement) => {
      return accessibilityManager.focusManagement.trapFocus(container);
    }, [accessibilityManager])
  };

  return [state, actions];
}

/**
 * Hook for keyboard navigation in lists and grids
 */
export function useKeyboardNavigation(
  containerRef: React.RefObject<HTMLElement>,
  orientation: 'horizontal' | 'vertical' | 'grid' = 'horizontal'
) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!containerRef.current) return;

    const { keyboardUtils } = require('@/lib/accessibility-utils');
    keyboardUtils.handleArrowNavigation(event, containerRef.current, orientation);
  }, [containerRef, orientation]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Hook for managing focus within a component
 */
export function useFocusManagement() {
  const [, { focusTrap }] = useAccessibility();
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
      previousFocusRef.current.focus();
    }
  }, []);

  const trapFocus = useCallback((container: HTMLElement) => {
    saveFocus();
    return focusTrap(container);
  }, [focusTrap, saveFocus]);

  return {
    saveFocus,
    restoreFocus,
    trapFocus
  };
}

/**
 * Hook for screen reader announcements
 */
export function useScreenReaderAnnouncements() {
  const [, { announceToScreenReader }] = useAccessibility();

  const announceNavigation = useCallback((destination: string) => {
    announceToScreenReader(`Navigating to ${destination}`, 'polite');
  }, [announceToScreenReader]);

  const announceAction = useCallback((action: string) => {
    announceToScreenReader(action, 'assertive');
  }, [announceToScreenReader]);

  const announceError = useCallback((error: string) => {
    announceToScreenReader(`Error: ${error}`, 'assertive');
  }, [announceToScreenReader]);

  const announceSuccess = useCallback((message: string) => {
    announceToScreenReader(`Success: ${message}`, 'polite');
  }, [announceToScreenReader]);

  const announceLoading = useCallback((message: string = 'Loading') => {
    announceToScreenReader(message, 'polite');
  }, [announceToScreenReader]);

  return {
    announceNavigation,
    announceAction,
    announceError,
    announceSuccess,
    announceLoading
  };
}

/**
 * Hook for validating component accessibility
 */
export function useAccessibilityValidation(containerRef: React.RefObject<HTMLElement>) {
  const [, { validateTouchTargets }] = useAccessibility();
  const [validationResults, setValidationResults] = useState<{
    touchTargets: boolean;
    lastChecked: Date | null;
  }>({
    touchTargets: true,
    lastChecked: null
  });

  const runValidation = useCallback(() => {
    if (!containerRef.current) return;

    const touchTargetsValid = validateTouchTargets(containerRef.current);
    
    setValidationResults({
      touchTargets: touchTargetsValid,
      lastChecked: new Date()
    });

    return {
      touchTargets: touchTargetsValid,
      overall: touchTargetsValid
    };
  }, [containerRef, validateTouchTargets]);

  // Run validation when component mounts and when container changes
  useEffect(() => {
    if (containerRef.current) {
      runValidation();
    }
  }, [runValidation]);

  return {
    validationResults,
    runValidation
  };
}

/**
 * Hook for responsive design based on accessibility needs
 */
export function useResponsiveAccessibility() {
  const [state] = useAccessibility();
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');

  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Determine screen size
      if (width <= 480) {
        setScreenSize('mobile');
      } else if (width <= 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
      
      // Determine orientation
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);
    window.addEventListener('orientationchange', updateScreenInfo);

    return () => {
      window.removeEventListener('resize', updateScreenInfo);
      window.removeEventListener('orientationchange', updateScreenInfo);
    };
  }, []);

  // Calculate optimal touch target size based on screen and accessibility settings
  const getOptimalTouchSize = useCallback(() => {
    let baseSize = state.touchConfig.minSize;
    
    // Increase size for mobile devices
    if (screenSize === 'mobile') {
      baseSize += 10;
    }
    
    // Increase size for large text mode
    if (state.isLargeText) {
      baseSize += 8;
    }
    
    return baseSize;
  }, [state.touchConfig.minSize, state.isLargeText, screenSize]);

  // Get responsive class names
  const getResponsiveClasses = useCallback(() => {
    const classes = [];
    
    if (state.isHighContrast) classes.push('high-contrast');
    if (state.isReducedMotion) classes.push('reduced-motion');
    if (state.isLargeText) classes.push('large-text');
    if (state.isScreenReaderMode) classes.push('screen-reader-mode');
    
    classes.push(`screen-${screenSize}`);
    classes.push(`orientation-${orientation}`);
    
    return classes.join(' ');
  }, [state, screenSize, orientation]);

  return {
    screenSize,
    orientation,
    optimalTouchSize: getOptimalTouchSize(),
    responsiveClasses: getResponsiveClasses(),
    isTouch: screenSize !== 'desktop'
  };
}