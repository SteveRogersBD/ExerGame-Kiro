# Requirements Document

## Introduction

The Parent Dashboard is a comprehensive management interface that allows parents to monitor, control, and gain insights into their children's activities. The dashboard provides real-time monitoring capabilities, activity analytics, parental controls, and AI-powered coaching insights. It serves as the central hub for parents to engage with their children's physical activity and learning progress within the WiggleWorld ecosystem and also gain tips from our AI agent.

## Requirements

### Requirement 1

**User Story:** As a parent, I want to access the dashboard from the landing page, so that I can quickly navigate to my management interface.

#### Acceptance Criteria

1. WHEN a parent successfully registers/logs in THEN the system SHALL redirect them to the parent dashboard
2. WHEN the dashboard loads THEN the system SHALL display the overview page as the default view
3. WHEN the dashboard is accessed THEN the system SHALL use a soft pastel gradient background with professional styling

### Requirement 2

**User Story:** As a parent, I want to see an overview of current activities and my children's status, so that I can quickly understand what's happening.

#### Acceptance Criteria

1. WHEN there is an active session THEN the system SHALL display an active session card with child avatar, name, content, and start time
2. WHEN there is an active session THEN the system SHALL provide pause, end, and lock app controls
3. WHEN there is no active session THEN the system SHALL display an empty state with /public/images/no_session_tiger.png
4. WHEN viewing the overview THEN the system SHALL display a grid of child cards showing avatar, name, age, today's play time, and status
5. WHEN viewing the overview THEN the system SHALL display a recent activity feed with session completion logs

### Requirement 3

**User Story:** As a parent, I want to view detailed activity and progress for each child, so that I can track their physical and mental development and engagement.

#### Acceptance Criteria

1. WHEN a parent clicks on a child card THEN the system SHALL redirect to the Activity & Progress page for that child
2. WHEN viewing activity progress THEN the system SHALL display performance stats for last 7 and 30 days
3. WHEN viewing activity progress THEN the system SHALL show play time, moves by type, accuracy percentage, and streak data
4. WHEN viewing activity progress THEN the system SHALL display quiz scores and completion rates
5. WHEN viewing activity progress THEN the system SHALL provide charts for play time trends, moves by type, and accuracy
6. WHEN viewing activity progress THEN the system SHALL show a recent sessions table with date, duration, moves, accuracy, and score

### Requirement 4

**User Story:** As a parent, I want to set and manage parental controls for each child, so that I can ensure appropriate screen time and safety.

#### Acceptance Criteria

1. WHEN accessing parental controls THEN the system SHALL allow setting screen-time limits per child
2. WHEN screen-time limits are set THEN the system SHALL enforce these limits during active sessions
3. WHEN limits are reached THEN the system SHALL notify parents and provide session termination options

### Requirement 5

**User Story:** As a parent, I want to configure notifications for various activities, so that I can stay informed about my children's engagement.

#### Acceptance Criteria

1. WHEN a new session is created THEN the system SHALL notify the parents
2. WHEN session milestones are reached THEN the system SHALL send progress notifications
3. WHEN notification preferences are configured THEN the system SHALL respect parent notification settings

### Requirement 6

**User Story:** As a parent, I want to manage profiles for my children and myself, so that I can maintain accurate information and preferences.

#### Acceptance Criteria

1. WHEN managing child profiles THEN the system SHALL allow editing avatar, name, age, health notes
2. WHEN managing children THEN the system SHALL provide add, edit, archive, and mascot creating with prompt functionality
3. WHEN managing parent profile THEN the system SHALL allow editing dp, name, username, email, and password
4. WHEN profile changes are made THEN the system SHALL save updates and provide confirmation

### Requirement 7

**User Story:** As a parent, I want to monitor live sessions in real-time, so that I can observe my child's current activity.

#### Acceptance Criteria

1. WHEN a session is active THEN the system SHALL display current content thumbnail, title, and child name
2. WHEN monitoring live THEN the system SHALL show session start time and a running timer
3. WHEN session is active THEN the system SHALL provide pause, end, and lock app controls
4. WHEN no session is active THEN the system SHALL display an empty state with the public/images/no_session_tiger.png

### Requirement 8

**User Story:** As a parent, I want to receive AI-powered coaching insights and suggestions, so that I can better support my child's development.

#### Acceptance Criteria

1. WHEN viewing insights THEN the system SHALL display focus area recommendations for endurance and balance
2. WHEN accessing coaching THEN the system SHALL provide suggested videos based on child's performance
3. WHEN reviewing feedback THEN the system SHALL show AI analysis of recent performance data
4. WHEN viewing suggestions THEN the system SHALL provide apply and regenerate options for coaching plans
5. WHEN no data is available THEN the system SHALL display mock data placeholders

### Requirement 9

**User Story:** As a parent, I want consistent navigation and layout throughout the dashboard, so that I can efficiently access all features.

#### Acceptance Criteria

1. WHEN using the dashboard THEN the system SHALL provide a left sidebar with navigation to all main sections
2. WHEN navigating THEN the system SHALL highlight the current active section in the sidebar
3. WHEN using the interface THEN the system SHALL display at top parent avatar (on the furthest left), add child button, create quiz, and notifications (on right)
4. WHEN interacting with the system THEN the system SHALL provide toast notifications for save and apply actions
5. WHEN encountering empty states THEN the system SHALL display mascot illustrations with gentle messaging

### Requirement 10

**User Story:** As a parent, I want the dashboard to have a calming yet playful visual design, so that it feels connected to the WiggleWorld theme while maintaining professionalism.

#### Acceptance Criteria

1. WHEN viewing the dashboard THEN the system SHALL use a soft pastel gradient background from sky blue to lavender to pale yellow
2. WHEN displaying content THEN the system SHALL use white or near-white panels with rounded corners and soft shadows
3. WHEN showing decorative elements THEN the system SHALL include faint, semi-transparent shapes in corners with low opacity
4. WHEN presenting information THEN the system SHALL prioritize readability and avoid dark or overly vibrant tones
5. WHEN styling components THEN the system SHALL maintain consistency with the playful WiggleWorld theme