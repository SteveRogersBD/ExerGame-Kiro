# Parent Dashboard Design Document

## Overview

The Parent Dashboard is a comprehensive web-based interface built with Next.js and React that serves as the central management hub for parents within the WiggleWorld ecosystem. The dashboard provides real-time monitoring, activity analytics, parental controls, and AI-powered coaching insights through a calming yet playful interface that maintains professional functionality while connecting to the WiggleWorld theme.

## Architecture

### Technology Stack
- **Frontend Framework**: Next.js 14 with App Router
- **UI Components**: React with TypeScript
- **Styling**: Tailwind CSS with custom gradient backgrounds
- **Charts & Analytics**: Recharts library for data visualization
- **State Management**: React Context API for dashboard state
- **Authentication**: Integration with existing auth system
- **Notifications**: Toast notifications using existing toast hook

### Route Structure
```
/parent/dashboard (main dashboard layout)
├── / (overview - default)
├── /activity/[childId] (activity & progress)
├── /controls (parental controls)
├── /notifications (notification settings)
├── /profiles (profile management)
├── /insights (AI coaching insights)
└── /live (live session monitoring)
```### Comp
onent Hierarchy
```
DashboardLayout
├── DashboardSidebar
├── DashboardHeader
└── DashboardContent
    ├── OverviewPage
    ├── ActivityProgressPage
    ├── ParentalControlsPage
    ├── NotificationsPage
    ├── ProfilesPage
    ├── InsightsPage
    └── LiveMonitoringPage
```

## Components and Interfaces

### Core Layout Components

#### DashboardLayout
- Provides the main layout structure with sidebar and content area
- Manages responsive behavior for mobile/tablet
- Implements the soft pastel gradient background
- Handles authentication state and redirects

#### DashboardSidebar
- Navigation menu with sections: Overview, Activity & Progress, Parental Controls, Notifications, Profiles, AI Insights, Live Monitoring
- Active section highlighting
- Collapsible for mobile responsiveness
- WiggleWorld branding integration

#### DashboardHeader
- Parent avatar display (leftmost position)
- Action buttons: Add Child, Create Quiz
- Notifications icon with badge (rightmost position)
- Responsive layout for different screen sizes#
## Page Components

#### OverviewPage
- **ActiveSessionCard**: Displays current session with child avatar, name, content thumbnail, start time, and controls (pause, end, lock)
- **ChildrenGrid**: Grid layout of child cards showing avatar, name, age, today's play time, and status
- **ActivityFeed**: Recent session completion logs with timestamps
- **EmptyState**: Tiger mascot image when no active sessions

#### ActivityProgressPage
- **PerformanceStats**: 7-day and 30-day performance metrics
- **PlayTimeChart**: Line chart showing play time trends
- **MovesChart**: Bar chart displaying moves by type
- **AccuracyChart**: Progress chart for accuracy percentage
- **QuizScores**: Quiz completion rates and scores
- **SessionsTable**: Recent sessions with date, duration, moves, accuracy, score

#### ParentalControlsPage
- **ScreenTimeLimits**: Per-child time limit configuration
- **SessionControls**: Real-time session management options
- **SafetySettings**: Content filtering and safety preferences

#### NotificationsPage
- **NotificationPreferences**: Toggle settings for different notification types
- **NotificationHistory**: Recent notifications log
- **DeliverySettings**: Email, push, and in-app notification preferences

#### ProfilesPage
- **ChildProfiles**: List of children with edit/archive options
- **ChildEditor**: Form for editing avatar, name, age, health notes
- **MascotCreator**: AI-powered mascot generation with prompts
- **ParentProfile**: Parent information editing interface

#### InsightsPage
- **FocusAreas**: AI recommendations for endurance and balance improvement
- **SuggestedVideos**: Performance-based video recommendations
- **PerformanceAnalysis**: AI analysis of recent activity data
- **CoachingPlans**: Actionable plans with apply/regenerate options

#### LiveMonitoringPage
- **LiveSession**: Real-time session display with content thumbnail and timer
- **SessionControls**: Pause, end, and lock app functionality
- **EmptyState**: Tiger mascot when no active session### Dat
a Models

#### Child Profile
```typescript
interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  healthNotes?: string;
  createdAt: Date;
  isArchived: boolean;
  mascot?: {
    name: string;
    image: string;
    prompt: string;
  };
}
```

#### Session Data
```typescript
interface Session {
  id: string;
  childId: string;
  contentTitle: string;
  contentThumbnail: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  moves: {
    type: string;
    count: number;
    accuracy: number;
  }[];
  quizScore?: number;
  status: 'active' | 'paused' | 'completed';
}
```

#### Performance Metrics
```typescript
interface PerformanceMetrics {
  childId: string;
  period: '7d' | '30d';
  totalPlayTime: number;
  movesByType: Record<string, number>;
  averageAccuracy: number;
  currentStreak: number;
  quizCompletionRate: number;
  averageQuizScore: number;
}
```## Err
or Handling

### Authentication Errors
- Redirect to login page if authentication fails
- Display error messages for session timeouts
- Handle token refresh automatically

### Data Loading Errors
- Show loading skeletons while fetching data
- Display error boundaries for component failures
- Provide retry mechanisms for failed requests
- Graceful degradation with mock data when APIs are unavailable

### Session Management Errors
- Handle session control failures with user feedback
- Provide fallback options when real-time updates fail
- Display connection status indicators

## Testing Strategy

### Unit Testing
- Test individual components with React Testing Library
- Mock external dependencies and API calls
- Test component state management and user interactions
- Validate data transformation and formatting functions

### Integration Testing
- Test page-level component integration
- Verify routing and navigation functionality
- Test authentication flow integration
- Validate data flow between components

### End-to-End Testing
- Test complete user workflows (login to dashboard navigation)
- Verify session monitoring and control functionality
- Test responsive design across different devices
- Validate notification and toast systems

### Performance Testing
- Monitor component render performance
- Test chart rendering with large datasets
- Validate mobile responsiveness and touch interactions
- Measure initial page load times## Visual
 Design Implementation

### Background and Layout
- Soft pastel gradient: `bg-gradient-to-br from-sky-100 via-purple-50 to-yellow-50`
- Content panels: `bg-white/90 backdrop-blur-sm rounded-xl shadow-lg`
- Decorative elements: Semi-transparent shapes with `opacity-10` in corners

### Color Palette
- Primary: Soft blues and purples from the gradient
- Secondary: Gentle yellows and greens for accents
- Text: Dark grays for readability (`text-gray-800`, `text-gray-600`)
- Success: Soft green (`bg-green-100`, `text-green-700`)
- Warning: Soft orange (`bg-orange-100`, `text-orange-700`)

### Typography and Spacing
- Font family: System fonts with fallbacks for readability
- Consistent spacing using Tailwind's spacing scale
- Rounded corners: `rounded-lg` for cards, `rounded-xl` for panels
- Shadows: Soft shadows using `shadow-lg` and `shadow-xl`

### Interactive Elements
- Hover states with subtle color transitions
- Focus states for accessibility compliance
- Loading states with skeleton components
- Toast notifications positioned top-right

This design provides a comprehensive foundation for implementing the parent dashboard while maintaining the playful WiggleWorld aesthetic and ensuring professional functionality for parent users.