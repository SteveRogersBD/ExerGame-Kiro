# Design Document

## Overview

The Parental Gate feature transforms the existing modal-based parental gate into a dedicated full-page experience at `/gate`. This design leverages the existing WiggleWorld design system while creating a standalone page that provides three unlock methods for parents. The implementation focuses on creating reusable components that maintain consistency with the existing codebase while providing an engaging, accessible experience.

## Architecture

### Page Structure
- **Route**: `/gate` using Next.js App Router (`app/gate/page.tsx`)
- **Layout**: Inherits from root layout with Fredoka font and global styles
- **Navigation**: Direct routing from landing page "Play Now" button, with back navigation to home

### Component Hierarchy
```
GatePage
├── AnimatedBackground (reused/enhanced)
├── GateHero
│   └── GateHeading
├── GateOptions
│   ├── GateOptionCard (Email)
│   ├── GateOptionCard (PIN) 
│   └── GateOptionCard (Math)
├── BackToHomeLink
└── GateModal (conditional)
    ├── StopImage (at top of modal)
    ├── EmailForm
    ├── PINForm
    └── MathForm
```

## Components and Interfaces

### 1. AnimatedBackground Component (Enhanced)
**Purpose**: Reusable animated background with vibrant gradients and floating elements

**Props Interface**:
```typescript
interface AnimatedBackgroundProps {
  variant?: 'default' | 'gate';
  intensity?: 'low' | 'medium' | 'high';
}
```

**Features**:
- Multi-stop gradient background using wiggle color palette
- Floating clouds, balloons, and stars with CSS keyframes
- Respects `prefers-reduced-motion` media query
- Configurable intensity for different pages

**Implementation Details**:
- Uses CSS gradients instead of heavy animations for performance
- Floating elements positioned with `position: absolute` and animated with `transform`
- Motion disabled via CSS media query: `@media (prefers-reduced-motion: reduce)`

### 2. GateOptionCard Component
**Purpose**: Reusable card component for unlock options

**Props Interface**:
```typescript
interface GateOptionCardProps {
  icon: string; // Emoji icon
  title: string;
  subtitle: string;
  color: keyof typeof wiggleColors;
  onClick: () => void;
  className?: string;
}
```

**Features**:
- Hover animations using Framer Motion (lift + wiggle)
- Colorful shadows matching the card color
- Responsive sizing (full width on mobile, grid on desktop)
- Accessible focus states and keyboard navigation

### 3. GateModal Component
**Purpose**: Accessible modal container for unlock forms

**Props Interface**:
```typescript
interface GateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showStopImage?: boolean;
}
```

**Features**:
- Focus trapping using Radix UI Dialog primitives
- Scale + fade animations on open/close
- Backdrop click and ESC key handling
- Proper ARIA attributes for screen readers
- Stop tiger image displayed at top of modal (200-260px mobile, 320-420px desktop)
- Responsive image sizing with proper alt text

### 4. Form Components
**EmailForm**, **PINForm**, **MathForm** - Specialized form components for each unlock method

**Common Interface**:
```typescript
interface UnlockFormProps {
  onSuccess: () => void;
  onClose: () => void;
}
```

**EmailForm Features**:
- Email input validation (basic format check)
- "Send Link" button with loading state
- Success toast using existing toast system

**PINForm Features**:
- Masked numeric input (4 digits)
- Virtual keypad layout for touch devices
- Visual feedback for PIN entry

**MathForm Features**:
- Random math problem generation (addition/subtraction)
- Numeric input with validation
- Success/error feedback

## Data Models

### Gate State Management
```typescript
interface GateState {
  selectedMethod: 'email' | 'pin' | 'math' | null;
  isModalOpen: boolean;
  formData: {
    email: string;
    pin: string;
    mathAnswer: string;
  };
  currentMathProblem: {
    question: string;
    answer: number;
  };
}
```

### Color System Extension
```typescript
// Extending existing wiggle colors in tailwind.config.ts
const wiggleColors = {
  blue: '#87CEEB',    // Sky blue
  green: '#A7F432',   // Lime
  pink: '#FF6AD5',    // Pink
  yellow: '#FFD93D',  // Lemon
  purple: '#9D8DF1',  // Pastel purple
} as const;
```

## Error Handling

### Form Validation
- **Email**: Basic format validation using regex pattern
- **PIN**: Length validation (exactly 4 digits)
- **Math**: Numeric input validation and answer checking

### Error States
```typescript
interface FormErrors {
  email?: string;
  pin?: string;
  math?: string;
}
```

### User Feedback
- Toast notifications for success states
- Inline error messages for validation failures
- Loading states for async operations (email sending simulation)

## Testing Strategy

### Unit Testing
- Component rendering and prop handling
- Form validation logic
- Animation behavior (with reduced motion)
- Accessibility features (focus management, ARIA attributes)

### Integration Testing
- Navigation flow from landing page to gate
- Modal interactions and state management
- Responsive behavior across breakpoints
- Keyboard navigation and screen reader compatibility

### Visual Testing
- Color contrast ratios meet WCAG AA standards
- Animation performance across devices
- Layout consistency across screen sizes

## Responsive Design

### Breakpoint Strategy
```css
/* Mobile First Approach */
.gate-options {
  /* Mobile: Stacked layout */
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .gate-options {
    /* Desktop: 3-column grid */
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

### Image Sizing (Modal Stop Tiger Image)
- **Mobile**: 200-260px (using `w-52 h-52` to `w-64 h-64`)
- **Desktop**: 320-420px (using `md:w-80 md:h-80` to `md:w-96 md:h-96`)
- Positioned at top of modal content area
- Centered horizontally with proper spacing

## Accessibility Features

### Focus Management
- Modal focus trapping using Radix UI Dialog
- Visible focus rings on all interactive elements
- Logical tab order throughout the page

### Screen Reader Support
- Descriptive alt text for stop tiger image
- ARIA labels for form inputs and buttons
- Live regions for dynamic content updates (toasts)

### Color and Contrast
- High contrast ratios for all text (minimum 4.5:1)
- Color not used as the only means of conveying information
- Focus indicators visible against all background colors

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Performance Considerations

### Animation Optimization
- Use `transform` and `opacity` properties only for animations
- Avoid animating `box-shadow`, `filter`, or layout properties
- Implement `will-change` property judiciously

### Code Splitting
- Gate page components loaded only when route is accessed
- Lazy loading for modal components until needed

### Image Optimization
- Use Next.js Image component for stop_tiger.png
- Provide appropriate alt text and loading states

## Integration Points

### Navigation Updates
**File**: `components/HeroSection.tsx`
- Update "Play Now" button to use Next.js router navigation
- Remove modal trigger, replace with `router.push('/gate')`

**Implementation**:
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
const handlePlayNow = () => {
  router.push('/gate');
};
```

### Toast System Integration
- Leverage existing toast system from `hooks/use-toast.ts`
- Consistent success/error messaging across the application

### Theme Consistency
- Use existing wiggle color palette from `tailwind.config.ts`
- Maintain Fredoka font family for headings
- Follow established shadow and border-radius patterns

## File Structure

```
app/
├── gate/
│   └── page.tsx                 # Main gate page component
components/
├── gate/
│   ├── AnimatedBackground.tsx   # Enhanced reusable background
│   ├── GateOptionCard.tsx       # Reusable option card
│   ├── GateModal.tsx           # Accessible modal wrapper
│   ├── EmailForm.tsx           # Email unlock form
│   ├── PINForm.tsx             # PIN unlock form
│   └── MathForm.tsx            # Math unlock form
public/
└── images/
    └── stop_tiger.png          # Gate hero image
```

## Security Considerations

### Input Sanitization
- Email input sanitized to prevent XSS
- PIN input restricted to numeric characters only
- Math answer input validated as numeric

### Demo Mode Implementation
- All unlock methods are demonstration only
- No real authentication or session management
- Success states show demo indicators

### Child Safety
- No data collection or storage
- No external API calls that could expose child information
- Clear visual indicators that parental involvement is required