# Requirements Document

## Introduction

The Parental Gate feature is a child safety mechanism for WiggleWorld, a kids' exergame platform. This feature creates a barrier that requires parental involvement before children can access the main game content. The gate provides three different methods for parents to unlock access: email verification, PIN entry, and math problem solving. The implementation focuses on creating an engaging, kid-friendly interface while maintaining security best practices for child protection.

## Requirements

### Requirement 1

**User Story:** As a child user, I want to see a clear stop signal when trying to access the game, so that I understand I need parental permission.

#### Acceptance Criteria

1. WHEN a child clicks "Play Now" on the landing page THEN the system SHALL navigate to the /gate page
2. WHEN the /gate page loads THEN the system SHALL display the heading "Ask your parent to unlock WiggleWorld"
3. WHEN the /gate page loads THEN the system SHALL display friendly subtext "Choose one of the options below"
4. WHEN any unlock modal opens THEN the system SHALL display a prominent stop_tiger.png image at the top (200-260px on mobile, 320-420px on desktop)

### Requirement 2

**User Story:** As a parent, I want multiple options to unlock the game for my child, so that I can choose the most convenient method for my situation.

#### Acceptance Criteria

1. WHEN the /gate page loads THEN the system SHALL display three unlock options: "Ask by Email", "Enter PIN", and "Solve a Math"
2. WHEN displayed on desktop THEN the system SHALL arrange the three options in a 3-column grid layout
3. WHEN displayed on mobile THEN the system SHALL stack the three options vertically
4. WHEN a user hovers over an option card THEN the system SHALL provide visual feedback with lift and wiggle animations
5. IF the user has prefers-reduced-motion enabled THEN the system SHALL disable hover animations

### Requirement 3

**User Story:** As a parent, I want to request access via email, so that I can unlock the game remotely without being physically present.

#### Acceptance Criteria

1. WHEN a user clicks the "Ask by Email" option THEN the system SHALL open a modal with an email input form
2. WHEN the email modal is open THEN the system SHALL display an input field for parent email address
3. WHEN the email modal is open THEN the system SHALL display a "Send Link" button
4. WHEN a user clicks "Send Link" THEN the system SHALL show a success toast message "Magic link sent (demo)"
5. WHEN the modal is open THEN the system SHALL provide a close button to return to the gate page

### Requirement 4

**User Story:** As a parent, I want to unlock the game using a PIN, so that I can quickly provide access when I'm present with my child.

#### Acceptance Criteria

1. WHEN a user clicks the "Enter PIN" option THEN the system SHALL open a modal with a PIN entry interface
2. WHEN the PIN modal is open THEN the system SHALL display a masked numeric input field
3. WHEN the PIN modal is open THEN the system SHALL display a keypad layout for number entry
4. WHEN the PIN modal is open THEN the system SHALL display an "Unlock (demo)" button
5. WHEN a user clicks "Unlock (demo)" THEN the system SHALL show appropriate feedback (no real validation required)
6. WHEN the modal is open THEN the system SHALL provide a close button to return to the gate page

### Requirement 5

**User Story:** As a parent, I want to solve a math problem to unlock the game, so that I can demonstrate adult-level cognitive ability as a verification method.

#### Acceptance Criteria

1. WHEN a user clicks the "Solve a Math" option THEN the system SHALL open a modal with a math problem interface
2. WHEN the math modal is open THEN the system SHALL display a generated math problem (e.g., "23 + 58 = ?")
3. WHEN the math modal is open THEN the system SHALL display an input field for the answer
4. WHEN the math modal is open THEN the system SHALL display a "Check (demo)" button
5. WHEN a user clicks "Check (demo)" THEN the system SHALL show "Correct! (demo)" message
6. WHEN the modal is open THEN the system SHALL provide a close button to return to the gate page

### Requirement 6

**User Story:** As a user, I want to navigate back to the home page from the gate, so that I can return to the main landing page if needed.

#### Acceptance Criteria

1. WHEN the /gate page loads THEN the system SHALL display a "👈 Back to Home" link
2. WHEN a user clicks the "Back to Home" link THEN the system SHALL navigate to the home page
3. WHEN displayed THEN the system SHALL position the back link below the unlock options

### Requirement 7

**User Story:** As a child user, I want the interface to be visually appealing and kid-friendly, so that the experience feels engaging even when being restricted.

#### Acceptance Criteria

1. WHEN the /gate page loads THEN the system SHALL use a vibrant color palette including sky blue (#87CEEB), lime (#A7F432), pink (#FF6AD5), lemon (#FFD93D), and pastel purple (#9D8DF1)
2. WHEN the page is displayed THEN the system SHALL show an animated background with soft multi-stop gradients and floating elements
3. WHEN the page is displayed THEN the system SHALL use rounded, playful UI elements with colorful shadows
4. WHEN the page is displayed THEN the system SHALL use kid-friendly fonts (Fredoka/Baloo for headings)
5. IF the user has prefers-reduced-motion enabled THEN the system SHALL disable background animations

### Requirement 8

**User Story:** As a user with accessibility needs, I want the interface to be fully accessible, so that I can navigate and use all features regardless of my abilities.

#### Acceptance Criteria

1. WHEN any interactive element receives focus THEN the system SHALL display clear focus rings
2. WHEN images are displayed THEN the system SHALL provide descriptive alt text
3. WHEN colors are used to convey information THEN the system SHALL maintain high color contrast ratios
4. WHEN modals are opened THEN the system SHALL implement proper focus trapping
5. WHEN modals are opened THEN the system SHALL provide accessible dialog behavior

### Requirement 9

**User Story:** As a user on any device, I want the interface to work well on my screen size, so that I can access all functionality regardless of my device.

#### Acceptance Criteria

1. WHEN viewed on mobile devices THEN the system SHALL display the stop tiger image at 200-260px size
2. WHEN viewed on desktop devices THEN the system SHALL display the stop tiger image at 320-420px size
3. WHEN viewed on mobile devices THEN the system SHALL stack unlock options vertically
4. WHEN viewed on desktop devices THEN the system SHALL arrange unlock options in a 3-column grid
5. WHEN viewed on any screen size THEN the system SHALL maintain proper spacing and readability

### Requirement 10

**User Story:** As a developer, I want the components to be reusable, so that I can maintain consistency across the application and reduce code duplication.

#### Acceptance Criteria

1. WHEN implementing the animated background THEN the system SHALL create a reusable AnimatedBG component
2. WHEN implementing option cards THEN the system SHALL create a reusable GateOptionCard component
3. WHEN implementing modals THEN the system SHALL create a reusable Modal component
4. WHEN creating components THEN the system SHALL ensure they can be used across multiple pages
5. WHEN implementing animations THEN the system SHALL use Framer Motion for micro-interactions only