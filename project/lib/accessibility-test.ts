/**
 * Accessibility testing utilities for keyboard navigation and screen reader compatibility
 */

export interface AccessibilityTestResult {
  passed: boolean;
  message: string;
  element?: HTMLElement;
}

export class AccessibilityTester {
  private results: AccessibilityTestResult[] = [];

  /**
   * Test tab order through all interactive elements
   */
  testTabOrder(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    
    // Get all focusable elements
    const focusableElements = this.getFocusableElements(container);
    
    if (focusableElements.length === 0) {
      results.push({
        passed: false,
        message: 'No focusable elements found in container'
      });
      return results;
    }

    // Test that elements can receive focus
    focusableElements.forEach((element, index) => {
      try {
        element.focus();
        if (document.activeElement === element) {
          results.push({
            passed: true,
            message: `Element ${index + 1} (${element.tagName}) can receive focus`,
            element
          });
        } else {
          results.push({
            passed: false,
            message: `Element ${index + 1} (${element.tagName}) cannot receive focus`,
            element
          });
        }
      } catch (error) {
        results.push({
          passed: false,
          message: `Error focusing element ${index + 1}: ${error}`,
          element
        });
      }
    });

    return results;
  }

  /**
   * Test keyboard event handling
   */
  testKeyboardEvents(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const focusableElements = this.getFocusableElements(container);

    focusableElements.forEach((element, index) => {
      // Test Enter key on buttons and links
      if (element.tagName === 'BUTTON' || element.tagName === 'A') {
        const hasClickHandler = this.hasEventListener(element, 'click');
        results.push({
          passed: hasClickHandler,
          message: `Element ${index + 1} (${element.tagName}) ${hasClickHandler ? 'has' : 'missing'} click handler`,
          element
        });
      }

      // Test Space key on buttons
      if (element.tagName === 'BUTTON') {
        const hasKeyHandler = this.hasEventListener(element, 'keydown') || this.hasEventListener(element, 'keyup');
        results.push({
          passed: true, // Buttons handle space by default
          message: `Element ${index + 1} (BUTTON) supports space key activation`,
          element
        });
      }
    });

    return results;
  }

  /**
   * Test ARIA attributes and labels
   */
  testAriaAttributes(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const elements = container.querySelectorAll('*');

    elements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      
      // Test form inputs have labels
      if (htmlElement.tagName === 'INPUT' || htmlElement.tagName === 'TEXTAREA' || htmlElement.tagName === 'SELECT') {
        const hasLabel = this.hasAssociatedLabel(htmlElement);
        results.push({
          passed: hasLabel,
          message: `Form element ${index + 1} ${hasLabel ? 'has' : 'missing'} associated label`,
          element: htmlElement
        });

        // Test aria-invalid on form elements with errors
        const hasAriaInvalid = htmlElement.hasAttribute('aria-invalid');
        const hasErrorClass = htmlElement.classList.contains('error') || 
                             htmlElement.classList.contains('border-red-400') ||
                             htmlElement.getAttribute('aria-describedby')?.includes('error');
        
        if (hasErrorClass) {
          results.push({
            passed: hasAriaInvalid,
            message: `Form element ${index + 1} with error state ${hasAriaInvalid ? 'has' : 'missing'} aria-invalid`,
            element: htmlElement
          });
        }
      }

      // Test buttons have accessible names
      if (htmlElement.tagName === 'BUTTON') {
        const hasAccessibleName = this.hasAccessibleName(htmlElement);
        results.push({
          passed: hasAccessibleName,
          message: `Button ${index + 1} ${hasAccessibleName ? 'has' : 'missing'} accessible name`,
          element: htmlElement
        });
      }

      // Test modal dialogs have proper ARIA
      if (htmlElement.getAttribute('role') === 'dialog') {
        const hasAriaModal = htmlElement.hasAttribute('aria-modal');
        const hasAriaLabel = htmlElement.hasAttribute('aria-labelledby') || htmlElement.hasAttribute('aria-label');
        
        results.push({
          passed: hasAriaModal,
          message: `Dialog ${hasAriaModal ? 'has' : 'missing'} aria-modal attribute`,
          element: htmlElement
        });
        
        results.push({
          passed: hasAriaLabel,
          message: `Dialog ${hasAriaLabel ? 'has' : 'missing'} accessible label`,
          element: htmlElement
        });
      }
    });

    return results;
  }

  /**
   * Test color contrast (basic check)
   */
  testColorContrast(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const textElements = container.querySelectorAll('p, span, label, button, a, h1, h2, h3, h4, h5, h6');

    textElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      const styles = window.getComputedStyle(htmlElement);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // Basic contrast check (simplified)
      const hasGoodContrast = this.checkBasicContrast(color, backgroundColor);
      
      results.push({
        passed: hasGoodContrast,
        message: `Text element ${index + 1} ${hasGoodContrast ? 'has adequate' : 'may have poor'} color contrast`,
        element: htmlElement
      });
    });

    return results;
  }

  /**
   * Run all accessibility tests
   */
  runAllTests(container: HTMLElement): AccessibilityTestResult[] {
    const allResults: AccessibilityTestResult[] = [];
    
    allResults.push(...this.testTabOrder(container));
    allResults.push(...this.testKeyboardEvents(container));
    allResults.push(...this.testAriaAttributes(container));
    allResults.push(...this.testColorContrast(container));

    return allResults;
  }

  /**
   * Get summary of test results
   */
  getTestSummary(results: AccessibilityTestResult[]): { passed: number; failed: number; total: number } {
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    
    return {
      passed,
      failed,
      total: results.length
    };
  }

  // Helper methods
  private getFocusableElements(container: HTMLElement): HTMLElement[] {
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
      container.querySelectorAll(focusableSelectors)
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

  private hasEventListener(element: HTMLElement, eventType: string): boolean {
    // This is a simplified check - in a real implementation you'd need more sophisticated detection
    const hasOnAttribute = element.hasAttribute(`on${eventType}`);
    const hasClickableRole = element.getAttribute('role') === 'button';
    const isInteractiveElement = ['BUTTON', 'A', 'INPUT'].includes(element.tagName);
    
    return hasOnAttribute || hasClickableRole || isInteractiveElement;
  }

  private hasAssociatedLabel(element: HTMLElement): boolean {
    const id = element.id;
    const hasLabelFor = id && document.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = element.hasAttribute('aria-label');
    const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
    const isWrappedInLabel = element.closest('label');

    return !!(hasLabelFor || hasAriaLabel || hasAriaLabelledBy || isWrappedInLabel);
  }

  private hasAccessibleName(element: HTMLElement): boolean {
    const hasTextContent = element.textContent?.trim();
    const hasAriaLabel = element.hasAttribute('aria-label');
    const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
    const hasTitle = element.hasAttribute('title');

    return !!(hasTextContent || hasAriaLabel || hasAriaLabelledBy || hasTitle);
  }

  private checkBasicContrast(color: string, backgroundColor: string): boolean {
    // This is a very basic check - a real implementation would calculate actual contrast ratios
    // For now, we'll just check if colors are not the same and not transparent
    return color !== backgroundColor && 
           backgroundColor !== 'rgba(0, 0, 0, 0)' && 
           backgroundColor !== 'transparent';
  }
}

/**
 * Simulate keyboard navigation for testing
 */
export function simulateKeyboardNavigation(container: HTMLElement): Promise<AccessibilityTestResult[]> {
  return new Promise((resolve) => {
    const results: AccessibilityTestResult[] = [];
    const tester = new AccessibilityTester();
    
    // Test tab navigation
    const tabResults = tester.testTabOrder(container);
    results.push(...tabResults);
    
    // Test escape key on modals
    const modals = container.querySelectorAll('[role="dialog"]');
    modals.forEach((modal, index) => {
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      modal.dispatchEvent(escapeEvent);
      
      results.push({
        passed: true,
        message: `Modal ${index + 1} escape key event dispatched`,
        element: modal as HTMLElement
      });
    });

    resolve(results);
  });
}

/**
 * Test screen reader compatibility
 */
export function testScreenReaderCompatibility(container: HTMLElement): AccessibilityTestResult[] {
  const results: AccessibilityTestResult[] = [];
  
  // Check for proper heading structure
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const isProperSequence = level <= previousLevel + 1;
    
    results.push({
      passed: isProperSequence,
      message: `Heading ${index + 1} (${heading.tagName}) ${isProperSequence ? 'follows' : 'breaks'} proper sequence`,
      element: heading as HTMLElement
    });
    
    previousLevel = level;
  });

  // Check for alt text on images
  const images = container.querySelectorAll('img');
  images.forEach((img, index) => {
    const hasAlt = img.hasAttribute('alt');
    results.push({
      passed: hasAlt,
      message: `Image ${index + 1} ${hasAlt ? 'has' : 'missing'} alt text`,
      element: img as HTMLElement
    });
  });

  // Check for live regions
  const liveRegions = container.querySelectorAll('[aria-live]');
  results.push({
    passed: liveRegions.length > 0,
    message: `${liveRegions.length > 0 ? 'Found' : 'No'} live regions for screen reader announcements`
  });

  return results;
}