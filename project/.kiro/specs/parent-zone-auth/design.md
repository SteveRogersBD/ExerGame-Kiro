# Design Document

## Overview

The Parent Zone Authentication feature provides a comprehensive authentication interface for parents to create accounts and sign in to manage their children's WiggleWorld experience. The design leverages the existing component architecture, utilizing Radix UI primitives with custom styling that matches the vibrant, kid-friendly aesthetic. The implementation focuses on accessibility, responsive design, and smooth user interactions while maintaining the playful brand identity.

## Architecture

### Route Structure
```
/parent/auth - Main authentication page (app/parent/auth/page.tsx)
```

### Component Hierarchy
```
ParentAuthPage
├── AnimatedBackground (reused)
├── AuthPageHeader
├── AuthContainer
│   ├── TigerIllustration
│   └── AuthCard
│       ├── AuthTabs
│       │   ├── TabsList (Create Account | Sign In)
│       │   ├── CreateAccountTab
│       │   │   ├── AuthForm
│       │   │   │   ├── TextField (Parent Name)
│       │   │   │   ├── TextField (Email)
│       │   │   │   ├── PasswordField (Password)
│       │   │   │   ├── PasswordField (Confirm Password)
│       │   │   │   └── PasswordStrengthMeter
│       │   │   ├── GoogleSignInButton
│       │   │   ├── TermsCheckbox
│       │   │   ├── SubmitButton
│       │   │   └── SwitchTabLink
│       │   └── SignInTab
│       │       ├── AuthForm
│       │       │   ├── TextField (Email)
│       │       │   └── PasswordField (Password)
│       │       ├── RememberMeCheckbox
│       │       ├── ForgotLinks
│       │       └── SubmitButton
├── ForgotPasswordModal
├── ForgotPINModal
└── Toaster (for success/error messages)
```

### State Management
- Form state managed with React Hook Form + Zod validation
- Modal state managed with local React state
- Toast notifications managed with Sonner library
- Tab state managed with Radix UI Tabs primitive

## Components and Interfaces

### Core Page Component
```typescript
// app/parent/auth/page.tsx
interface ParentAuthPageProps {}

export default function ParentAuthPage(): JSX.Element
```

### Authentication Components

#### AuthTabs Component
```typescript
interface AuthTabsProps {
  defaultTab?: 'create-account' | 'sign-in';
  onTabChange?: (tab: string) => void;
}

export function AuthTabs({ defaultTab = 'create-account', onTabChange }: AuthTabsProps): JSX.Element
```

#### AuthCard Component
```typescript
interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps): JSX.Element
```

#### TextField Component
```typescript
interface TextFieldProps {
  label: string;
  type?: 'text' | 'email';
  placeholder?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  'aria-invalid'?: boolean;
}

export function TextField(props: TextFieldProps): JSX.Element
```

#### PasswordField Component
```typescript
interface PasswordFieldProps {
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  showStrengthMeter?: boolean;
  'aria-invalid'?: boolean;
}

export function PasswordField(props: PasswordFieldProps): JSX.Element
```

#### PasswordStrengthMeter Component
```typescript
interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps): JSX.Element
```

#### AuthButton Component
```typescript
interface AuthButtonProps {
  variant: 'primary' | 'google';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
}

export function AuthButton(props: AuthButtonProps): JSX.Element
```

### Modal Components

#### ForgotPasswordModal Component
```typescript
interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export function ForgotPasswordModal(props: ForgotPasswordModalProps): JSX.Element
```

#### ForgotPINModal Component
```typescript
interface ForgotPINModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPINModal(props: ForgotPINModalProps): JSX.Element
```

## Data Models

### Form Validation Schemas

#### Create Account Schema
```typescript
const createAccountSchema = z.object({
  parentName: z.string()
    .min(2, 'Parent name must be at least 2 characters')
    .max(50, 'Parent name must be less than 50 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean()
    .refine(val => val === true, 'You must agree to the terms and privacy policy')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type CreateAccountFormData = z.infer<typeof createAccountSchema>;
```

#### Sign In Schema
```typescript
const signInSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

type SignInFormData = z.infer<typeof signInSchema>;
```

#### Forgot Password Schema
```typescript
const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
```

### Password Strength Calculation
```typescript
interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-4
  feedback: string[];
}

function calculatePasswordStrength(password: string): PasswordStrengthResult
```

## Error Handling

### Client-Side Validation
- Real-time validation using Zod schemas
- Field-level validation on blur events
- Form-level validation on submit
- Visual error indicators with accessible error messages

### Error Display Strategy
```typescript
interface ValidationError {
  field: string;
  message: string;
}

interface FormErrors {
  [fieldName: string]: string | undefined;
}
```

### Toast Notifications
```typescript
interface ToastMessage {
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

// Success messages
const successMessages = {
  accountCreated: "Account created (demo)",
  signedIn: "Signed in (demo)",
  resetLinkSent: "Password reset link sent (demo)"
};
```

## Testing Strategy

### Unit Testing
- Component rendering and prop handling
- Form validation logic
- Password strength calculation
- Accessibility compliance (focus management, ARIA attributes)

### Integration Testing
- Form submission flows
- Tab switching functionality
- Modal open/close behavior
- Toast notification display

### Accessibility Testing
- Keyboard navigation through all interactive elements
- Screen reader compatibility
- Focus trap behavior in modals
- Color contrast validation
- Reduced motion preference handling

### Responsive Testing
- Mobile layout (320px - 768px)
- Tablet layout (768px - 1024px)
- Desktop layout (1024px+)
- Touch interaction testing on mobile devices

## Visual Design System

### Color Palette
```css
:root {
  --wiggle-blue: #87CEEB;
  --wiggle-green: #A7F432;
  --wiggle-pink: #FF6AD5;
  --wiggle-yellow: #FFD93D;
  --wiggle-purple: #9D8DF1;
  --wiggle-orange: #FFB347;
  --wiggle-coral: #FF7F7F;
  --wiggle-mint: #98FB98;
  --wiggle-lavender: #E6E6FA;
  --wiggle-peach: #FFCBA4;
}
```

### Typography Scale
```css
.auth-heading {
  font-family: 'Fredoka', system-ui, sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  line-height: 1.2;
}

.auth-subheading {
  font-family: 'Fredoka', system-ui, sans-serif;
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.4;
}

.auth-body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
}
```

### Component Styling

#### AuthCard Styling
```css
.auth-card {
  background: linear-gradient(135deg, #ffffff 0%, #fefce8 100%);
  border-radius: 1.5rem;
  box-shadow: 
    0 20px 25px -5px rgba(255, 109, 213, 0.1),
    0 10px 10px -5px rgba(255, 109, 213, 0.04),
    0 0 0 1px rgba(255, 109, 213, 0.05);
  padding: 2rem;
  max-width: 28rem;
  width: 100%;
}
```

#### Button Styling
```css
.auth-button-primary {
  background: linear-gradient(135deg, #FF6AD5 0%, #9D8DF1 100%);
  border-radius: 1rem;
  padding: 0.75rem 2rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 4px 14px 0 rgba(255, 106, 213, 0.39);
  transition: all 0.2s ease;
}

.auth-button-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px 0 rgba(255, 106, 213, 0.5);
}

.auth-button-google {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  padding: 0.75rem 2rem;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease;
}
```

#### Input Field Styling
```css
.auth-input {
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.auth-input:focus {
  border-color: #FF6AD5;
  box-shadow: 0 0 0 3px rgba(255, 106, 213, 0.1);
  outline: none;
}

.auth-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

### Animation Specifications

#### Tab Transition
```css
.tab-underline {
  position: absolute;
  bottom: 0;
  height: 3px;
  background: linear-gradient(90deg, #FF6AD5, #9D8DF1);
  border-radius: 1.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Button Hover Animation
```css
.auth-button:hover {
  transform: translateY(-2px) scale(1.02);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Modal Animations
```css
.modal-overlay {
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  animation: scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { 
    opacity: 0; 
    transform: translate(-50%, -50%) scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: translate(-50%, -50%) scale(1); 
  }
}
```

### Responsive Breakpoints
```css
/* Mobile First Approach */
.auth-container {
  padding: 1rem;
}

@media (min-width: 640px) {
  .auth-container {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .auth-container {
    padding: 3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }
}
```

### Accessibility Features

#### Focus Management
- Visible focus rings with high contrast
- Focus trap implementation in modals
- Logical tab order throughout the interface
- Skip links for keyboard navigation

#### Screen Reader Support
- Proper heading hierarchy (h1 → h2 → h3)
- Descriptive labels for all form inputs
- Error announcements with aria-live regions
- Status updates for form submission states

#### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  .animated-background {
    animation: none;
  }
  
  .auth-button,
  .tab-underline,
  .modal-content {
    transition: none;
  }
}
```

## Performance Considerations

### Code Splitting
- Lazy load modal components
- Dynamic imports for heavy validation libraries
- Separate chunks for authentication logic

### Image Optimization
- WebP format for sign_in_tiger.png with fallback
- Responsive image sizing based on viewport
- Lazy loading for non-critical images

### Bundle Optimization
```typescript
// Lazy load heavy components
const ForgotPasswordModal = lazy(() => import('./ForgotPasswordModal'));
const ForgotPINModal = lazy(() => import('./ForgotPINModal'));

// Tree-shake unused Radix UI components
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
```

### Runtime Performance
- Use React.memo for stable components
- Debounce password strength calculations
- Optimize re-renders with useCallback and useMemo
- Content-visibility: auto for off-screen elements

## Security Considerations

### Client-Side Validation
- Input sanitization for all form fields
- XSS prevention through proper escaping
- CSRF protection considerations for future backend integration

### Password Security
- Minimum complexity requirements
- Visual strength feedback without exposing actual password
- Secure password field implementation (no autocomplete for sensitive fields)

### Data Handling
- No sensitive data stored in localStorage
- Proper form data cleanup on unmount
- Secure handling of "Remember Me" functionality (preparation for future backend)