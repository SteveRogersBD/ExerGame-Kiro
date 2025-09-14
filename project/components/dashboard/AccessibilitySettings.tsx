'use client';

import { motion } from 'framer-motion';
import { useAccessibility, useScreenReaderAnnouncements } from '@/hooks/useAccessibility';
import { InteractiveButton } from '@/components/ui/InteractiveButton';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilitySettings({ isOpen, onClose }: AccessibilitySettingsProps) {
  const [state, actions] = useAccessibility();
  const { announceAction } = useScreenReaderAnnouncements();

  const handleToggle = (setting: string, toggleFunction: () => void, newState: boolean) => {
    toggleFunction();
    announceAction(`${setting} ${newState ? 'enabled' : 'disabled'}`);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-settings-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-wiggle-yellow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 id="accessibility-settings-title" className="text-2xl font-bold text-gray-800 mb-2">
            <span role="img" aria-label="Settings">⚙️</span> Accessibility Settings
          </h2>
          <p className="text-gray-600">Make the app work better for you!</p>
        </div>

        {/* Settings Options */}
        <div className="space-y-4">
          {/* High Contrast Mode */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">
                <span role="img" aria-hidden="true">🎨</span> High Contrast
              </h3>
              <p className="text-sm text-gray-600">Make colors easier to see</p>
            </div>
            <InteractiveButton
              size="small"
              variant={state.isHighContrast ? 'success' : 'secondary'}
              onClick={() => handleToggle('High contrast mode', actions.toggleHighContrast, !state.isHighContrast)}
              ariaLabel={`${state.isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
              className="ml-4"
            >
              {state.isHighContrast ? 'ON' : 'OFF'}
            </InteractiveButton>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">
                <span role="img" aria-hidden="true">🐌</span> Reduce Motion
              </h3>
              <p className="text-sm text-gray-600">Less moving animations</p>
            </div>
            <InteractiveButton
              size="small"
              variant={state.isReducedMotion ? 'success' : 'secondary'}
              onClick={() => handleToggle('Reduced motion', actions.toggleReducedMotion, !state.isReducedMotion)}
              ariaLabel={`${state.isReducedMotion ? 'Disable' : 'Enable'} reduced motion`}
              className="ml-4"
            >
              {state.isReducedMotion ? 'ON' : 'OFF'}
            </InteractiveButton>
          </div>

          {/* Large Text */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">
                <span role="img" aria-hidden="true">🔍</span> Large Text
              </h3>
              <p className="text-sm text-gray-600">Make text bigger and easier to read</p>
            </div>
            <InteractiveButton
              size="small"
              variant={state.isLargeText ? 'success' : 'secondary'}
              onClick={() => handleToggle('Large text mode', actions.toggleLargeText, !state.isLargeText)}
              ariaLabel={`${state.isLargeText ? 'Disable' : 'Enable'} large text mode`}
              className="ml-4"
            >
              {state.isLargeText ? 'ON' : 'OFF'}
            </InteractiveButton>
          </div>

          {/* Screen Reader Mode */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">
                <span role="img" aria-hidden="true">🔊</span> Screen Reader
              </h3>
              <p className="text-sm text-gray-600">Enhanced support for screen readers</p>
            </div>
            <InteractiveButton
              size="small"
              variant={state.isScreenReaderMode ? 'success' : 'secondary'}
              onClick={() => handleToggle('Screen reader mode', actions.toggleScreenReaderMode, !state.isScreenReaderMode)}
              ariaLabel={`${state.isScreenReaderMode ? 'Disable' : 'Enable'} screen reader mode`}
              className="ml-4"
            >
              {state.isScreenReaderMode ? 'ON' : 'OFF'}
            </InteractiveButton>
          </div>
        </div>

        {/* Touch Target Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
          <h3 className="font-bold text-blue-800 mb-2">
            <span role="img" aria-hidden="true">👆</span> Touch-Friendly Design
          </h3>
          <p className="text-sm text-blue-700">
            All buttons are designed to be easy to tap with small hands. 
            Minimum size: {state.touchConfig.minSize}px for comfortable use.
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-6 text-center">
          <InteractiveButton
            size="large"
            variant="primary"
            onClick={onClose}
            ariaLabel="Close accessibility settings and return to dashboard"
          >
            <span role="img" aria-hidden="true">✅</span> Done
          </InteractiveButton>
        </div>

        {/* Keyboard Instructions */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Press Escape to close • Use Tab to navigate • Press Enter or Space to activate buttons
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Accessibility Settings Button Component
 * Can be placed in the dashboard header or help section
 */
export function AccessibilitySettingsButton({ onClick }: { onClick: () => void }) {
  const { createChildFriendlyLabel } = useAccessibility()[1];

  return (
    <InteractiveButton
      size="medium"
      variant="secondary"
      onClick={onClick}
      ariaLabel={createChildFriendlyLabel('settings', 'change how the app looks and works for you')}
      className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
    >
      <span role="img" aria-label="Accessibility settings">♿</span>
      <span className="hidden sm:inline">Settings</span>
    </InteractiveButton>
  );
}