/**
 * Focus trap utility for modal components
 * Ensures keyboard navigation stays within modal boundaries
 */

import React from 'react';

export interface FocusTrapOptions {
  initialFocus?: HTMLElement | null;
  fallbackFocus?: HTMLElement | null;
  escapeDeactivates?: boolean;
  clickOutsideDeactivates?: boolean;
  returnFocusOnDeactivate?: boolean;
}

export class FocusTrap {
  private container: HTMLElement;
  private options: FocusTrapOptions;
  private previouslyFocusedElement: HTMLElement | null = null;
  private isActive = false;

  constructor(container: HTMLElement, options: FocusTrapOptions = {}) {
    this.container = container;
    this.options = {
      escapeDeactivates: true,
      clickOutsideDeactivates: true,
      returnFocusOnDeactivate: true,
      ...options,
    };
  }

  activate(): void {
    if (this.isActive) return;

    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    this.isActive = true;

    // Add event listeners
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('click', this.handleClick);

    // Set initial focus
    this.setInitialFocus();
  }

  deactivate(): void {
    if (!this.isActive) return;

    this.isActive = false;

    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('click', this.handleClick);

    // Return focus to previously focused element
    if (this.options.returnFocusOnDeactivate && this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.isActive) return;

    if (event.key === 'Escape' && this.options.escapeDeactivates) {
      event.preventDefault();
      this.deactivate();
      return;
    }

    if (event.key === 'Tab') {
      this.handleTabKey(event);
    }
  };

  private handleClick = (event: MouseEvent): void => {
    if (!this.isActive || !this.options.clickOutsideDeactivates) return;

    const target = event.target as HTMLElement;
    if (!this.container.contains(target)) {
      event.preventDefault();
      this.deactivate();
    }
  };

  private handleTabKey(event: KeyboardEvent): void {
    const focusableElements = this.getFocusableElements();
    
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const currentElement = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab (backward)
      if (currentElement === firstElement || !this.container.contains(currentElement)) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab (forward)
      if (currentElement === lastElement || !this.container.contains(currentElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private setInitialFocus(): void {
    const initialFocus = this.options.initialFocus || this.getFocusableElements()[0];
    
    if (initialFocus) {
      initialFocus.focus();
    } else if (this.options.fallbackFocus) {
      this.options.fallbackFocus.focus();
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    const elements = Array.from(
      this.container.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];

    return elements.filter(element => {
      return (
        element.offsetWidth > 0 &&
        element.offsetHeight > 0 &&
        !element.hasAttribute('hidden') &&
        window.getComputedStyle(element).visibility !== 'hidden'
      );
    });
  }
}

/**
 * React hook for focus trap functionality
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean,
  options: FocusTrapOptions = {}
): void {
  React.useEffect(() => {
    if (!containerRef.current || !isActive) return;

    const focusTrap = new FocusTrap(containerRef.current, options);
    focusTrap.activate();

    return () => {
      focusTrap.deactivate();
    };
  }, [containerRef, isActive, options]);
}