# Kids Dashboard Design Document

## Overview

The Kids Dashboard is a full-screen, immersive playground experience designed specifically for children aged 3-8. It serves as the main hub after successful parental gate verification, providing access to preset educational videos and parent-assigned homework in a fun, engaging interface. The design prioritizes visual appeal, simplicity, and child-friendly interactions through cartoon mascots, bright colors, and large touch targets.

## Architecture

### Component Hierarchy

```
KidsDashboard (Main Container)
├── DashboardHeader (Avatar, Name, Badges)
├── AnimatedBackground (Sky/Forest/Space scenes)
├── FloatingMascots (Random animal animations)
├── ContentSections
│   ├── PresetVideosSection
│   │   ├── SectionHeader ("🎬 Preset")
│   │   └── VideoCarousel (Horizontal scroll)
│   │       └── VideoCard[] (Thumbnail + Title)
│   └── HomeworkSection
│       ├── SectionHeader ("📚 Homework")
│       └── HomeworkCarousel (Horizontal scroll)
│           └── HomeworkCard[] (Icon + Title + Status)
├── BottomNavigation
│   ├── HomeButton (🏠)
│   ├── BadgesButton (🎖️)
│   └── HelpButton (❓)
└── MascotGuide (Contextual helper)
```

### Video Player Architecture

```
VideoPlayerContainer
├── TransitionScreen (Mascot introduction)
├── VideoPlayer (Full-screen with child controls)
├── QuizOverlay (Interactive questions)
│   ├── QuizCard (Question + Mascot)
│   └── AnswerOptions[] (Gesture instructions)
├── CompletionScreen (Confetti + Rewards)
└── NavigationControls (Large pause/quit buttons)
```

### State Management

```typescript
interface KidsDashboardState {
  user: {
    name: string;
    avatar: string;
    badges: Badge[];
    streak: number;
  };
  content: {
    presetVideos: Video[];
    homework: HomeworkItem[];
  };
  ui: {
    currentView: 'dashboard' | 'video' | 'homework' | 'badges' | 'help';
    isLoading: boolean;
    mascotMessage: string;
    backgroundTheme: 'sky' | 'forest' | 'space';
  };
}
```

## Components and Interfaces

### Core Data Models

```typescript
interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string; // YouTube URL for now
  duration: number;
  quizQuestions: QuizQuestion[];
  completionReward: Badge;
}

interface HomeworkItem {
  id: string;
  title: string;
  icon: string;
  status: 'not_started' | 'in_progress' | 'completed';
  assignedBy: string; // Parent name
  video: Video;
  dueDate?: Date;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  timeInVideo: number; // When to pause video
}

interface QuizOption {
  id: string;
  text: string;
  gesture: 'jump' | 'squat' | 'clap';
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  earnedAt: Date;
  category: 'video' | 'homework' | 'streak';
}
```

### Key Components Design

#### 1. KidsDashboard Component
- **Purpose**: Main container managing overall layout and state
- **Props**: `userId: string`
- **Features**:
  - Full-screen layout with no header/footer distractions
  - Animated background with theme rotation
  - Floating animal mascots for visual appeal
  - Responsive grid layout for different screen sizes

#### 2. VideoCarousel Component
- **Purpose**: Horizontal scrolling list of video cards
- **Props**: `videos: Video[], onVideoSelect: (video: Video) => void`
- **Features**:
  - Touch-friendly horizontal scroll
  - Large thumbnail cards (minimum 200x150px)
  - Smooth scroll animations
  - Auto-scroll to center selected item

#### 3. VideoCard Component
- **Purpose**: Individual video preview card
- **Props**: `video: Video, onClick: () => void`
- **Features**:
  - Large, colorful thumbnail
  - Bold, readable title text
  - Hover/tap animations (scale, glow)
  - Duration indicator with fun icons

#### 4. VideoPlayer Component
- **Purpose**: Full-screen video playback with quiz integration
- **Props**: `video: Video, onComplete: (score: number) => void`
- **Features**:
  - Custom video controls (large buttons)
  - Auto-pause at quiz timestamps
  - Quiz overlay with mascot guidance
  - Progress tracking with visual indicators

#### 5. MascotGuide Component
- **Purpose**: Contextual helper providing guidance
- **Props**: `message: string, mascotImage: string, position: 'corner' | 'center'`
- **Features**:
  - Animated mascot with speech bubbles
  - Context-aware messaging
  - Smooth entrance/exit animations
  - Voice-over capability (future enhancement)

#### 6. BadgesPage Component
- **Purpose**: Rewards and achievements display
- **Props**: `badges: Badge[], totalEarned: number`
- **Features**:
  - Sticker book or trophy shelf layout
  - Celebration animations for new badges
  - Progress indicators for badge categories
  - Share achievements functionality

### Design System

#### Color Palette
- **Primary Colors**: Existing wiggle color scheme
  - Blue: `#87CEEB` (Sky theme)
  - Green: `#A7F432` (Forest theme)
  - Pink: `#FF6AD5` (Accent)
  - Yellow: `#FFD93D` (Highlights)
  - Purple: `#9D8DF1` (Space theme)

#### Typography
- **Font**: Fredoka (existing) - child-friendly, rounded
- **Sizes**:
  - Headings: `text-4xl` (36px) - Section titles
  - Buttons: `text-2xl` (24px) - Action buttons
  - Cards: `text-xl` (20px) - Card titles
  - Body: `text-lg` (18px) - General text

#### Button Design
- **Size**: Minimum 60px height, 120px width
- **Shape**: Rounded corners (`rounded-3xl`)
- **Animation**: Scale on hover/tap, wiggle on interaction
- **Colors**: High contrast, bright colors from palette
- **Icons**: Large, recognizable emojis and symbols

#### Layout Grid
- **Mobile**: Single column, full-width cards
- **Tablet**: Two-column grid for cards
- **Desktop**: Three-column grid with larger cards

## Data Models

### Video Content Structure
```typescript
// Temporary placeholder data until API integration
const PLACEHOLDER_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'Counting Adventure',
    thumbnail: '/images/content/counting-thumb.jpg',
    url: 'https://youtube.com/watch?v=placeholder1',
    duration: 300, // 5 minutes
    quizQuestions: [
      {
        id: 'q1',
        question: 'How many apples did we count?',
        timeInVideo: 120,
        options: [
          { id: 'a1', text: '5 apples', gesture: 'jump' },
          { id: 'a2', text: '3 apples', gesture: 'squat' },
          { id: 'a3', text: '7 apples', gesture: 'clap' }
        ],
        correctAnswer: 'a1'
      }
    ],
    completionReward: {
      id: 'b1',
      name: 'Math Master',
      icon: '🔢',
      category: 'video'
    }
  }
];
```

### Homework Assignment Structure
```typescript
const PLACEHOLDER_HOMEWORK: HomeworkItem[] = [
  {
    id: 'h1',
    title: 'Dora Episode Quiz',
    icon: '🗺️',
    status: 'not_started',
    assignedBy: 'Mom',
    video: {
      // Same structure as preset videos
      id: 'h1v1',
      title: 'Dora the Explorer - Map Reading',
      url: 'https://youtube.com/watch?v=placeholder2'
      // ... rest of video properties
    }
  }
];
```

## Error Handling

### Loading States
- **Dashboard Loading**: Bouncing animal mascots with "Getting ready..." message
- **Video Loading**: Spinning star animation with mascot encouragement
- **Content Loading**: Gentle pulsing placeholders for cards

### Error States
- **Network Error**: Sad tiger mascot with "Oops! Let's try again" message
- **Video Error**: Confused tiger with "This video is taking a nap" message
- **General Error**: Friendly error screen with big retry button

### Offline Handling
- **Offline Detection**: Show cached content with offline indicator
- **Sync on Reconnect**: Background sync with success animation
- **Offline Message**: "No internet? No problem! Play offline games"

## Testing Strategy

### Unit Testing
- **Component Rendering**: Test all components render correctly
- **User Interactions**: Test button clicks, card selections
- **State Management**: Test state updates and data flow
- **Animation Triggers**: Test animation start/stop conditions

### Integration Testing
- **Video Playback**: Test video player integration
- **Quiz Flow**: Test quiz overlay and answer handling
- **Navigation**: Test routing between dashboard sections
- **Data Loading**: Test API integration (when implemented)

### Accessibility Testing
- **Keyboard Navigation**: Tab order and focus management
- **Screen Reader**: ARIA labels and descriptions
- **Color Contrast**: Ensure sufficient contrast ratios
- **Touch Targets**: Minimum 44px touch target size

### Child Usability Testing
- **Age-Appropriate Design**: Test with target age group (3-8)
- **Intuitive Navigation**: Observe natural user behavior
- **Engagement Metrics**: Track interaction time and completion rates
- **Parent Feedback**: Gather feedback on educational value

### Performance Testing
- **Load Times**: Optimize for fast initial load
- **Animation Performance**: Smooth 60fps animations
- **Memory Usage**: Monitor for memory leaks in long sessions
- **Battery Impact**: Optimize for mobile device battery life

## Implementation Phases

### Phase 1: Core Dashboard
- Basic layout with header, sections, and navigation
- Placeholder content cards
- Basic mascot integration
- Simple animations

### Phase 2: Video Integration
- Video player component
- Quiz overlay system
- Completion flow with rewards
- Enhanced animations

### Phase 3: Advanced Features
- Badges and rewards system
- Help system with mascot guidance
- Advanced animations and sound effects
- Performance optimizations

### Phase 4: API Integration
- Replace placeholder data with real APIs
- Dynamic content loading
- Progress tracking and persistence
- Parent dashboard integration

## Technical Considerations

### Performance Optimizations
- **Lazy Loading**: Load video thumbnails on demand
- **Image Optimization**: Use Next.js Image component
- **Animation Optimization**: Use CSS transforms for smooth animations
- **Memory Management**: Cleanup video players when not in use

### Accessibility Features
- **High Contrast Mode**: Support for visual impairments
- **Large Text Mode**: Scalable text for reading difficulties
- **Reduced Motion**: Respect user motion preferences
- **Voice Navigation**: Future enhancement for hands-free use

### Security Considerations
- **Content Filtering**: Ensure all video content is child-appropriate
- **Data Privacy**: Minimal data collection, COPPA compliance
- **Secure Video Streaming**: Use secure video hosting
- **Parent Controls**: Respect parental settings and restrictions