import { useEffect } from 'react';

/**
 * Hook to detect keyboard navigation and add appropriate classes
 * This helps provide enhanced focus styles only for keyboard users
 */
export function useKeyboardNavigation() {
  useEffect(() => {
    let isKeyboardUser = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        if (!isKeyboardUser) {
          isKeyboardUser = true;
          document.body.classList.add('keyboard-user');
        }
      }
    };

    const handleMouseDown = () => {
      if (isKeyboardUser) {
        isKeyboardUser = false;
        document.body.classList.remove('keyboard-user');
      }
    };

    const handlePointerDown = () => {
      if (isKeyboardUser) {
        isKeyboardUser = false;
        document.body.classList.remove('keyboard-user');
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('pointerdown', handlePointerDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.body.classList.remove('keyboard-user');
    };
  }, []);
}

/**
 * Hook to announce messages to screen readers
 */
export function useScreenReaderAnnouncement() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.getElementById('auth-announcements');
    if (announcer) {
      announcer.setAttribute('aria-live', priority);
      announcer.textContent = message;
      
      // Clear the message after a short delay to allow for re-announcements
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  };

  return { announce };
}