# MascotGuide Component

The `MascotGuide` component provides contextual hints and encouragement throughout the kids' dashboard using animated mascot characters with speech bubbles.

## Features

- **Contextual Messaging**: Dynamic messages based on user actions and context
- **Smooth Animations**: Entrance/exit animations with floating effects
- **Flexible Positioning**: Corner or center positioning options
- **Auto-hide Support**: Configurable auto-hide with custom delays
- **Speech Bubbles**: Animated speech bubbles with proper tails
- **Dismissible**: Optional dismiss button for user control
- **Accessibility**: Proper ARIA labels and keyboard support

## Basic Usage

```tsx
import MascotGuide from './components/dashboard/MascotGuide';

// Simple usage
<MascotGuide 
  message="Tap here to start!" 
  isVisible={true}
/>

// With custom mascot and positioning
<MascotGuide 
  message="Great job! You finished your video!"
  mascotImage="/images/mascots/happy_tiger.png"
  position="center"
  isVisible={showGuide}
  onDismiss={() => setShowGuide(false)}
/>
```

## Using the Hook

The `useMascotGuide` hook provides a convenient way to manage mascot guide state:

```tsx
import { useMascotGuide } from './hooks/useMascotGuide';
import MascotGuide from './components/dashboard/MascotGuide';

function MyComponent() {
  const { currentGuide, isVisible, showWelcome, hideGuide } = useMascotGuide();

  // Show welcome message
  const handleFirstVisit = () => {
    showWelcome();
  };

  return (
    <div>
      <button onClick={handleFirstVisit}>Show Welcome</button>
      
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
    </div>
  );
}
```

## Integration Component

Use `MascotGuideIntegration` to automatically handle contextual guidance:

```tsx
import MascotGuideIntegration from './components/dashboard/MascotGuideIntegration';

function Dashboard() {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [hasNewBadge, setHasNewBadge] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <MascotGuideIntegration
      context="dashboard"
      isFirstVisit={isFirstVisit}
      hasNewBadge={hasNewBadge}
      isLoading={isLoading}
      error={error}
    >
      {/* Your dashboard content */}
      <div>Dashboard content here...</div>
    </MascotGuideIntegration>
  );
}
```

## Props

### MascotGuide Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | Required | The message to display in the speech bubble |
| `mascotImage` | `string` | `'/images/mascots/happy_tiger.png'` | Path to the mascot image |
| `position` | `'corner' \| 'center'` | `'corner'` | Where to position the mascot |
| `isVisible` | `boolean` | `true` | Whether the guide is visible |
| `onDismiss` | `() => void` | `undefined` | Callback when guide is dismissed |
| `autoHide` | `boolean` | `true` | Whether to auto-hide the guide |
| `autoHideDelay` | `number` | `5000` | Delay in ms before auto-hiding |

### MascotGuideIntegration Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | Required | Content to wrap |
| `context` | `'dashboard' \| 'video' \| 'homework' \| 'badges' \| 'help'` | `'dashboard'` | Current context |
| `isFirstVisit` | `boolean` | `false` | Whether this is the user's first visit |
| `hasNewBadge` | `boolean` | `false` | Whether user has earned a new badge |
| `isLoading` | `boolean` | `false` | Whether content is loading |
| `error` | `string \| null` | `null` | Error message to display |

## Available Mascot Images

- `/images/mascots/happy_tiger.png` - Happy, encouraging mascot
- `/images/mascots/confused_tiger.png` - Confused, questioning mascot
- `/images/mascots/sad_tiger.png` - Sad, sympathetic mascot
- `/images/mascots/smilling_mascot.png` - Smiling, friendly mascot

## Predefined Contexts

The hook provides these predefined contexts:

- **welcome**: First-time user onboarding
- **videoHover**: Encouraging video interaction
- **videoStart**: Video starting encouragement
- **homeworkStart**: Homework mission introduction
- **quizCorrect**: Positive reinforcement for correct answers
- **quizIncorrect**: Encouraging retry for incorrect answers
- **completion**: Celebrating task completion
- **badgeEarned**: Celebrating new achievements
- **help**: Providing assistance
- **error**: Friendly error handling
- **loading**: Loading state messaging

## Examples

### Welcome Message
```tsx
const { showWelcome } = useMascotGuide();

useEffect(() => {
  if (isFirstTimeUser) {
    showWelcome();
  }
}, [isFirstTimeUser]);
```

### Video Interaction
```tsx
const { showVideoHover, showVideoStart } = useMascotGuide();

<VideoCard 
  onMouseEnter={() => showVideoHover()}
  onClick={() => showVideoStart()}
/>
```

### Error Handling
```tsx
const { showError } = useMascotGuide();

try {
  await loadContent();
} catch (error) {
  showError('Oops! Could not load your videos. Let\'s try again!');
}
```

### Achievement Celebration
```tsx
const { showBadgeEarned } = useMascotGuide();

const handleVideoComplete = (earnedBadge) => {
  if (earnedBadge) {
    showBadgeEarned();
  }
};
```

### Custom Messages
```tsx
const { showCustomGuide } = useMascotGuide();

showCustomGuide(
  "You're doing amazing! Keep up the great work!",
  {
    position: 'center',
    mascotImage: '/images/mascots/happy_tiger.png',
    autoHideDelay: 4000,
  }
);
```

## Animations

The component includes several animation effects:

- **Entrance**: Scale up with rotation and bounce
- **Exit**: Scale down with rotation
- **Floating**: Gentle up/down movement
- **Sparkles**: Animated sparkle effects around mascot
- **Glow**: Pulsing glow effect
- **Hover**: Scale up on hover
- **Tap**: Scale down on tap

## Accessibility

- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast support
- Dismissible with keyboard (ESC key)
- Focus management

## Requirements Fulfilled

This component fulfills requirement 4.6:
> "WHEN the mascot appears THEN the system SHALL provide contextual guidance like 'Tap here to start!' or 'Great job! You finished your video!'"

The component provides:
- Contextual messaging based on user actions
- Dynamic mascot appearances with guidance
- Smooth animations for engaging interactions
- Flexible positioning for different contexts
- Auto-hide and manual dismiss options