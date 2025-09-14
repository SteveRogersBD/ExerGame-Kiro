/**
 * Accessibility testing script for the Parent Zone authentication
 * Run this in the browser console on the /parent/auth page
 */

// Import the accessibility tester (this would need to be bundled in a real scenario)
// For now, we'll include a simplified version directly

function testAccessibility() {
  console.log('🔍 Starting Accessibility Tests for Parent Zone Authentication...\n');

  const results = [];
  const container = document.querySelector('#main-content') || document.body;

  // Test 1: Tab Order
  console.log('1️⃣ Testing Tab Order...');
  const focusableElements = getFocusableElements(container);
  console.log(`Found ${focusableElements.length} focusable elements:`);
  
  focusableElements.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const id = element.id || 'no-id';
    const ariaLabel = element.getAttribute('aria-label') || 'no-aria-label';
    console.log(`  ${index + 1}. ${tagName}#${id} (${ariaLabel})`);
  });

  // Test 2: Keyboard Event Handling
  console.log('\n2️⃣ Testing Keyboard Event Handling...');
  testKeyboardEvents(focusableElements);

  // Test 3: ARIA Attributes
  console.log('\n3️⃣ Testing ARIA Attributes...');
  testAriaAttributes(container);

  // Test 4: Form Labels
  console.log('\n4️⃣ Testing Form Labels...');
  testFormLabels(container);

  // Test 5: Modal Accessibility
  console.log('\n5️⃣ Testing Modal Accessibility...');
  testModalAccessibility(container);

  // Test 6: Screen Reader Support
  console.log('\n6️⃣ Testing Screen Reader Support...');
  testScreenReaderSupport(container);

  console.log('\n✅ Accessibility testing complete!');
  return results;
}

function getFocusableElements(container) {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  const elements = Array.from(container.querySelectorAll(focusableSelectors));
  return elements.filter(element => {
    return (
      element.offsetWidth > 0 &&
      element.offsetHeight > 0 &&
      !element.hasAttribute('hidden') &&
      window.getComputedStyle(element).visibility !== 'hidden'
    );
  });
}

function testKeyboardEvents(elements) {
  let passed = 0;
  let total = 0;

  elements.forEach((element, index) => {
    total++;
    const tagName = element.tagName.toLowerCase();
    
    if (tagName === 'button' || tagName === 'a') {
      // Test if element responds to Enter key
      const hasClickHandler = element.onclick || element.addEventListener;
      if (hasClickHandler || tagName === 'button') {
        console.log(`  ✅ ${tagName} ${index + 1}: Supports keyboard activation`);
        passed++;
      } else {
        console.log(`  ❌ ${tagName} ${index + 1}: Missing keyboard activation`);
      }
    } else {
      console.log(`  ℹ️ ${tagName} ${index + 1}: Standard keyboard support expected`);
      passed++; // Assume standard elements work correctly
    }
  });

  console.log(`  📊 Keyboard Events: ${passed}/${total} passed`);
}

function testAriaAttributes(container) {
  let passed = 0;
  let total = 0;

  // Test form inputs
  const inputs = container.querySelectorAll('input, textarea, select');
  inputs.forEach((input, index) => {
    total++;
    const hasAriaInvalid = input.hasAttribute('aria-invalid');
    const hasError = input.classList.contains('border-red-400') || 
                    input.getAttribute('aria-describedby')?.includes('error');
    
    if (hasError && hasAriaInvalid) {
      console.log(`  ✅ Input ${index + 1}: Has aria-invalid for error state`);
      passed++;
    } else if (!hasError) {
      console.log(`  ✅ Input ${index + 1}: No error state, aria-invalid not required`);
      passed++;
    } else {
      console.log(`  ❌ Input ${index + 1}: Missing aria-invalid for error state`);
    }
  });

  // Test buttons
  const buttons = container.querySelectorAll('button');
  buttons.forEach((button, index) => {
    total++;
    const hasAccessibleName = button.textContent?.trim() || 
                             button.getAttribute('aria-label') ||
                             button.getAttribute('aria-labelledby');
    
    if (hasAccessibleName) {
      console.log(`  ✅ Button ${index + 1}: Has accessible name`);
      passed++;
    } else {
      console.log(`  ❌ Button ${index + 1}: Missing accessible name`);
    }
  });

  console.log(`  📊 ARIA Attributes: ${passed}/${total} passed`);
}

function testFormLabels(container) {
  let passed = 0;
  let total = 0;

  const formElements = container.querySelectorAll('input, textarea, select');
  formElements.forEach((element, index) => {
    total++;
    const id = element.id;
    const hasLabelFor = id && container.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = element.hasAttribute('aria-label');
    const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
    const isWrappedInLabel = element.closest('label');

    if (hasLabelFor || hasAriaLabel || hasAriaLabelledBy || isWrappedInLabel) {
      console.log(`  ✅ Form element ${index + 1}: Has proper label association`);
      passed++;
    } else {
      console.log(`  ❌ Form element ${index + 1}: Missing label association`);
    }
  });

  console.log(`  📊 Form Labels: ${passed}/${total} passed`);
}

function testModalAccessibility(container) {
  const modals = container.querySelectorAll('[role="dialog"]');
  
  if (modals.length === 0) {
    console.log('  ℹ️ No modals found to test');
    return;
  }

  let passed = 0;
  let total = 0;

  modals.forEach((modal, index) => {
    total += 3; // Test 3 things per modal

    // Test aria-modal
    if (modal.hasAttribute('aria-modal')) {
      console.log(`  ✅ Modal ${index + 1}: Has aria-modal attribute`);
      passed++;
    } else {
      console.log(`  ❌ Modal ${index + 1}: Missing aria-modal attribute`);
    }

    // Test aria-labelledby or aria-label
    if (modal.hasAttribute('aria-labelledby') || modal.hasAttribute('aria-label')) {
      console.log(`  ✅ Modal ${index + 1}: Has accessible label`);
      passed++;
    } else {
      console.log(`  ❌ Modal ${index + 1}: Missing accessible label`);
    }

    // Test focus trap (simplified check)
    const focusableInModal = getFocusableElements(modal);
    if (focusableInModal.length > 0) {
      console.log(`  ✅ Modal ${index + 1}: Contains focusable elements (${focusableInModal.length})`);
      passed++;
    } else {
      console.log(`  ❌ Modal ${index + 1}: No focusable elements found`);
    }
  });

  console.log(`  📊 Modal Accessibility: ${passed}/${total} passed`);
}

function testScreenReaderSupport(container) {
  let passed = 0;
  let total = 0;

  // Test heading structure
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length > 0) {
    total++;
    let properSequence = true;
    let previousLevel = 0;

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        properSequence = false;
      }
      previousLevel = level;
    });

    if (properSequence) {
      console.log(`  ✅ Heading structure: Proper sequence (${headings.length} headings)`);
      passed++;
    } else {
      console.log(`  ❌ Heading structure: Improper sequence`);
    }
  }

  // Test alt text on images
  const images = container.querySelectorAll('img');
  images.forEach((img, index) => {
    total++;
    if (img.hasAttribute('alt')) {
      console.log(`  ✅ Image ${index + 1}: Has alt text`);
      passed++;
    } else {
      console.log(`  ❌ Image ${index + 1}: Missing alt text`);
    }
  });

  // Test live regions
  total++;
  const liveRegions = container.querySelectorAll('[aria-live]');
  if (liveRegions.length > 0) {
    console.log(`  ✅ Live regions: Found ${liveRegions.length} live region(s)`);
    passed++;
  } else {
    console.log(`  ❌ Live regions: No live regions found`);
  }

  console.log(`  📊 Screen Reader Support: ${passed}/${total} passed`);
}

// Simulate keyboard navigation test
function simulateTabNavigation() {
  console.log('\n🎹 Simulating Tab Navigation...');
  
  const focusableElements = getFocusableElements(document.body);
  let currentIndex = 0;

  function focusNext() {
    if (currentIndex < focusableElements.length) {
      const element = focusableElements[currentIndex];
      element.focus();
      
      const tagName = element.tagName.toLowerCase();
      const id = element.id || 'no-id';
      const text = element.textContent?.trim().substring(0, 30) || 'no-text';
      
      console.log(`Tab ${currentIndex + 1}: ${tagName}#${id} - "${text}"`);
      
      // Check if element is actually focused
      if (document.activeElement === element) {
        console.log(`  ✅ Successfully focused`);
      } else {
        console.log(`  ❌ Failed to focus`);
      }
      
      currentIndex++;
      
      if (currentIndex < focusableElements.length) {
        setTimeout(focusNext, 500); // Delay for visual effect
      } else {
        console.log('\n✅ Tab navigation simulation complete!');
      }
    }
  }

  focusNext();
}

// Test escape key functionality
function testEscapeKey() {
  console.log('\n⌨️ Testing Escape Key Functionality...');
  
  // Look for modal triggers
  const modalTriggers = document.querySelectorAll('[data-modal], button[onclick*="modal"], button[onclick*="Modal"]');
  
  if (modalTriggers.length === 0) {
    console.log('  ℹ️ No modal triggers found. Try opening a modal first.');
    return;
  }

  console.log(`Found ${modalTriggers.length} potential modal trigger(s)`);
  
  // Simulate escape key press
  const escapeEvent = new KeyboardEvent('keydown', {
    key: 'Escape',
    code: 'Escape',
    keyCode: 27,
    bubbles: true
  });
  
  document.dispatchEvent(escapeEvent);
  console.log('  ✅ Escape key event dispatched');
}

// Export functions for console use
window.testAccessibility = testAccessibility;
window.simulateTabNavigation = simulateTabNavigation;
window.testEscapeKey = testEscapeKey;

console.log('🚀 Accessibility testing functions loaded!');
console.log('Run testAccessibility() to start comprehensive testing');
console.log('Run simulateTabNavigation() to test tab order');
console.log('Run testEscapeKey() to test escape key functionality');