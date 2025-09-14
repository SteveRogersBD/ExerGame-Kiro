'use client';

import { useEffect } from 'react';
import MascotGuide from './MascotGuide';
import { useMascotGuide } from '../../hooks/useMascotGuide';

interface MascotGuideIntegrationProps {
  children: React.ReactNode;
  context?: 'dashboard' | 'video' | 'homework' | 'badges' | 'help';
  isFirstVisit?: boolean;
  hasNewBadge?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Integration component that wraps dashboard content and provides
 * contextual mascot guidance based on user state and actions
 */
const MascotGuideIntegration: React.FC<MascotGuideIntegrationProps> = ({
  children,
  context = 'dashboard',
  isFirstVisit = false,
  hasNewBadge = false,
  isLoading = false,
  error = null,
}) => {
  const {
    currentGuide,
    isVisible,
    hideGuide,
    showWelcome,
    showBadgeEarned,
    showLoading,
    showError,
    showHelp,
  } = useMascotGuide();

  // Handle contextual guidance based on props
  useEffect(() => {
    if (error) {
      showError(error);
      return;
    }

    if (isLoading) {
      showLoading();
      return;
    }

    if (hasNewBadge) {
      showBadgeEarned();
      return;
    }

    if (isFirstVisit && context === 'dashboard') {
      // Show welcome message for first-time visitors
      const timer = setTimeout(() => {
        showWelcome();
      }, 1000); // Delay to let dashboard load

      return () => clearTimeout(timer);
    }

    if (context === 'help') {
      showHelp();
    }
  }, [
    error,
    isLoading,
    hasNewBadge,
    isFirstVisit,
    context,
    showWelcome,
    showBadgeEarned,
    showLoading,
    showError,
    showHelp,
  ]);

  return (
    <>
      {children}
      
      {/* Render the active mascot guide */}
      {currentGuide && (
        <MascotGuide
          message={currentGuide.message}
          mascotImage={currentGuide.mascotImage}
          position={currentGuide.position}
          isVisible={isVisible}
          onDismiss={hideGuide}
          autoHide={currentGuide.autoHide}
          autoHideDelay={currentGuide.autoHideDelay}
        />
      )}
    </>
  );
};

export default MascotGuideIntegration;