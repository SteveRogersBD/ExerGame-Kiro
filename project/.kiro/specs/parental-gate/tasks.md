# Implementation Plan

- [ ] 1. Create enhanced AnimatedBackground component for reuse across pages
  - Enhance existing AnimatedBackground component to support different variants and intensity levels
  - Add vibrant multi-stop gradient background using wiggle color palette
  - Implement prefers-reduced-motion support to disable animations when requested
  - Add props interface for variant and intensity configuration
  - _Requirements: 7.2, 7.5, 8.5_

- [ ] 2. Create reusable GateOptionCard component
  - Implement card component with icon, title, subtitle, and color props
  - Add hover animations using Framer Motion (lift and wiggle effects)
  - Implement colorful shadows that match card colors
  - Ensure responsive sizing and accessibility features
  - Add keyboard navigation support and focus states
  - _Requirements: 2.4, 7.3, 7.4, 8.1, 8.2_

- [ ] 3. Create accessible GateModal component wrapper
  - Implement modal component using Radix UI Dialog primitives for accessibility
  - Add stop_tiger.png image at top of modal with responsive sizing (200-260px mobile, 320-420px desktop)
  - Add scale and fade animations for modal open/close transitions
  - Implement focus trapping and proper ARIA attributes
  - Add backdrop click and ESC key handling
  - Ensure proper z-index layering and responsive behavior
  - _Requirements: 1.4, 3.5, 4.6, 5.6, 8.1, 8.4_

- [ ] 4. Implement EmailForm component for email unlock method
  - Create form component with email input validation
  - Add "Send Link" button with loading state simulation
  - Implement success toast notification using existing toast system
  - Add proper form validation and error handling
  - Ensure accessibility with proper labels and ARIA attributes
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 8.2_

- [ ] 5. Implement PINForm component for PIN unlock method
  - Create form with masked numeric input field (4 digits maximum)
  - Implement virtual keypad layout for touch device compatibility
  - Add "Unlock (demo)" button with visual feedback
  - Implement PIN length validation and numeric-only input restriction
  - Add proper accessibility features and keyboard navigation
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 8.2_

- [ ] 6. Implement MathForm component for math problem unlock method
  - Create component that generates random math problems (addition/subtraction)
  - Implement numeric input field for answer entry
  - Add "Check (demo)" button with success/error feedback
  - Implement answer validation and user feedback system
  - Ensure proper form accessibility and keyboard navigation
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 8.2_

- [ ] 7. Create main gate page at /gate route
  - Implement app/gate/page.tsx using Next.js App Router
  - Implement main heading "Ask your parent to unlock WiggleWorld" and subtext
  - Add three GateOptionCard components for Email, PIN, and Math options
  - Implement modal state management for different unlock methods
  - Add "Back to Home" navigation link
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 6.1, 6.2, 6.3, 9.1, 9.2, 9.3, 9.4_

- [ ] 8. Update HeroSection component to navigate to gate page
  - Modify "Play Now" button in HeroSection component to use Next.js router navigation
  - Remove existing modal trigger functionality
  - Implement router.push('/gate') navigation
  - Ensure button maintains existing styling and animations
  - Test navigation flow from landing page to gate page
  - _Requirements: 1.1_

- [ ] 9. Implement responsive layout and styling
  - Add responsive grid layout (3-column desktop, stacked mobile)
  - Implement proper spacing and typography using Tailwind classes
  - Add colorful shadows and rounded UI elements consistent with design
  - Ensure proper contrast ratios and accessibility compliance
  - Test layout across different screen sizes and devices
  - _Requirements: 2.2, 2.3, 7.3, 7.4, 8.3, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 10. Add toast notifications and user feedback systems
  - Integrate existing toast system for success messages
  - Implement "Magic link sent (demo)" toast for email method
  - Add "Correct! (demo)" feedback for math method
  - Implement loading states and error handling for all forms
  - Ensure toast messages are accessible with proper ARIA live regions
  - _Requirements: 3.4, 5.5, 8.4_

- [ ] 11. Implement motion and animation features
  - Add Framer Motion animations for option card hover effects
  - Implement modal entrance/exit animations (scale and fade)
  - Add subtle animations for form interactions and state changes
  - Ensure all animations respect prefers-reduced-motion settings
  - Test animation performance across different devices
  - _Requirements: 2.4, 7.5, 8.5_

- [ ] 12. Add comprehensive accessibility features
  - Implement proper focus management and tab order
  - Add descriptive alt text for stop tiger image in modals ("Stop! Ask your parent to unlock.")
  - Ensure high color contrast ratios throughout the interface
  - Add proper ARIA labels and descriptions for all interactive elements
  - Test with screen readers and keyboard-only navigation
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 13. Create unit tests for all new components
  - Write tests for AnimatedBackground component props and rendering
  - Test GateOptionCard hover states and accessibility features
  - Create tests for modal focus management and keyboard interactions
  - Test form validation logic for all three unlock methods
  - Add tests for responsive behavior and animation states
  - _Requirements: All requirements - testing coverage_

- [ ] 14. Integration testing and final polish
  - Test complete user flow from landing page to gate page
  - Verify all modal interactions and state management work correctly
  - Test responsive behavior across multiple device sizes
  - Validate accessibility compliance with automated and manual testing
  - Ensure consistent styling and behavior with existing site components
  - _Requirements: All requirements - integration validation_