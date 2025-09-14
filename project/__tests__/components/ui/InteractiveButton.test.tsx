import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InteractiveButton from '@/components/ui/InteractiveButton';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, onHoverStart, className, ...props }: any) => (
      <button 
        onClick={onClick}
        onMouseEnter={onHoverStart}
        className={className}
        {...props}
      >
        {children}
      </button>
    )
  }
}));

// Mock the interactive animations hook
const mockPlaySound = jest.fn();
const mockTriggerHaptic = jest.fn();

jest.mock('@/hooks/useInteractiveAnimations', () => ({
  useInteractiveAnimations: jest.fn(() => ({
    buttonVariants: {
      idle: { scale: 1 },
      hover: { scale: 1.05 },
      tap: { scale: 0.95 }
    },
    wiggleVariants: {
      idle: { rotate: 0 },
      wiggle: { rotate: [0, -5, 5, 0] }
    },
    glowVariants: {
      idle: { boxShadow: "0 0 0px rgba(255,255,255,0)" },
      glow: { boxShadow: "0 0 20px rgba(255,255,255,0.4)" }
    },
    bounceVariants: {
      idle: { scale: 1 },
      bounce: { scale: [1, 1.2, 0.9, 1.1, 1] }
    },
    pulseVariants: {
      idle: { scale: 1, opacity: 1 },
      pulse: { scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }
    },
    playSound: mockPlaySound,
    triggerHaptic: mockTriggerHaptic,
    prefersReducedMotion: false
  }))
}));

describe('InteractiveButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(
      <InteractiveButton onClick={mockOnClick}>
        Test Button
      </InteractiveButton>
    );

    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-gradient-to-r', 'from-wiggle-pink', 'to-wiggle-purple');
  });

  it('applies correct variant styles', () => {
    render(
      <InteractiveButton onClick={mockOnClick} variant="success">
        Success Button
      </InteractiveButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gradient-to-r', 'from-green-400', 'to-emerald-500');
  });

  it('applies correct size styles', () => {
    render(
      <InteractiveButton onClick={mockOnClick} size="large">
        Large Button
      </InteractiveButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-8', 'py-4', 'text-xl', 'min-h-[80px]', 'min-w-[160px]');
  });

  it('handles click events with sound and haptic feedback', async () => {
    render(
      <InteractiveButton 
        onClick={mockOnClick}
        soundEffect="success"
        hapticFeedback="heavy"
      >
        Click Me
      </InteractiveButton>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockPlaySound).toHaveBeenCalledWith('success');
    expect(mockTriggerHaptic).toHaveBeenCalledWith('heavy');
  });

  it('handles hover events with sound feedback', async () => {
    render(
      <InteractiveButton onClick={mockOnClick}>
        Hover Me
      </InteractiveButton>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);

    expect(mockPlaySound).toHaveBeenCalledWith('hover');
  });

  it('respects disabled state', () => {
    render(
      <InteractiveButton onClick={mockOnClick} disabled>
        Disabled Button
      </InteractiveButton>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');

    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(
      <InteractiveButton onClick={mockOnClick} className="custom-class">
        Custom Button
      </InteractiveButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('uses aria-label when provided', () => {
    render(
      <InteractiveButton onClick={mockOnClick} ariaLabel="Custom aria label">
        Button
      </InteractiveButton>
    );

    const button = screen.getByRole('button', { name: 'Custom aria label' });
    expect(button).toBeInTheDocument();
  });

  it('supports different animation types', () => {
    const { rerender } = render(
      <InteractiveButton onClick={mockOnClick} animationType="wiggle">
        Wiggle Button
      </InteractiveButton>
    );

    let button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    rerender(
      <InteractiveButton onClick={mockOnClick} animationType="glow">
        Glow Button
      </InteractiveButton>
    );

    button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    rerender(
      <InteractiveButton onClick={mockOnClick} animationType="bounce">
        Bounce Button
      </InteractiveButton>
    );

    button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});