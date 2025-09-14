import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MascotGuide from '../../../components/dashboard/MascotGuide';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('MascotGuide', () => {
  const defaultProps = {
    message: 'Tap here to start!',
    isVisible: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the mascot guide when visible', () => {
    render(<MascotGuide {...defaultProps} />);
    
    expect(screen.getByText('Tap here to start!')).toBeInTheDocument();
    expect(screen.getByAltText('Mascot guide')).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    render(<MascotGuide {...defaultProps} isVisible={false} />);
    
    expect(screen.queryByText('Tap here to start!')).not.toBeInTheDocument();
  });

  it('uses default happy mascot image when no image specified', () => {
    render(<MascotGuide {...defaultProps} />);
    
    const mascotImage = screen.getByAltText('Mascot guide');
    expect(mascotImage).toHaveAttribute('src', '/images/mascots/happy_tiger.png');
  });

  it('uses custom mascot image when specified', () => {
    render(
      <MascotGuide 
        {...defaultProps} 
        mascotImage="/images/mascots/confused_tiger.png" 
      />
    );
    
    const mascotImage = screen.getByAltText('Mascot guide');
    expect(mascotImage).toHaveAttribute('src', '/images/mascots/confused_tiger.png');
  });

  it('displays message in speech bubble', () => {
    const customMessage = 'Great job! You finished your video!';
    render(<MascotGuide {...defaultProps} message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('shows dismiss button when onDismiss is provided', () => {
    const mockOnDismiss = jest.fn();
    render(<MascotGuide {...defaultProps} onDismiss={mockOnDismiss} />);
    
    const dismissButton = screen.getByLabelText('Dismiss mascot guide');
    expect(dismissButton).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const mockOnDismiss = jest.fn();
    render(<MascotGuide {...defaultProps} onDismiss={mockOnDismiss} />);
    
    const dismissButton = screen.getByLabelText('Dismiss mascot guide');
    fireEvent.click(dismissButton);
    
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not show dismiss button when onDismiss is not provided', () => {
    render(<MascotGuide {...defaultProps} />);
    
    expect(screen.queryByLabelText('Dismiss mascot guide')).not.toBeInTheDocument();
  });

  it('applies corner positioning by default', () => {
    const { container } = render(<MascotGuide {...defaultProps} />);
    
    const mascotContainer = container.querySelector('.fixed');
    expect(mascotContainer).toHaveClass('bottom-24', 'right-6');
  });

  it('applies center positioning when specified', () => {
    const { container } = render(
      <MascotGuide {...defaultProps} position="center" />
    );
    
    const mascotContainer = container.querySelector('.fixed');
    expect(mascotContainer).toHaveClass('top-1/2', 'left-1/2');
  });

  it('auto-hides after specified delay', async () => {
    const mockOnDismiss = jest.fn();
    render(
      <MascotGuide 
        {...defaultProps} 
        onDismiss={mockOnDismiss}
        autoHide={true}
        autoHideDelay={1000}
      />
    );
    
    // Initially visible
    expect(screen.getByText('Tap here to start!')).toBeInTheDocument();
    
    // Wait for auto-hide delay
    await waitFor(() => {
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    }, { timeout: 1500 });
  });

  it('does not auto-hide when autoHide is false', async () => {
    const mockOnDismiss = jest.fn();
    render(
      <MascotGuide 
        {...defaultProps} 
        onDismiss={mockOnDismiss}
        autoHide={false}
        autoHideDelay={100}
      />
    );
    
    // Wait longer than the delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Should still be visible and onDismiss should not be called
    expect(screen.getByText('Tap here to start!')).toBeInTheDocument();
    expect(mockOnDismiss).not.toHaveBeenCalled();
  });

  it('handles visibility changes through props', () => {
    const { rerender } = render(<MascotGuide {...defaultProps} isVisible={true} />);
    
    expect(screen.getByText('Tap here to start!')).toBeInTheDocument();
    
    rerender(<MascotGuide {...defaultProps} isVisible={false} />);
    
    expect(screen.queryByText('Tap here to start!')).not.toBeInTheDocument();
  });

  it('allows clicking mascot to dismiss when in center position', () => {
    const mockOnDismiss = jest.fn();
    render(
      <MascotGuide 
        {...defaultProps} 
        position="center"
        onDismiss={mockOnDismiss}
      />
    );
    
    const mascotImage = screen.getByAltText('Mascot guide');
    fireEvent.click(mascotImage);
    
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not dismiss on mascot click when in corner position', () => {
    const mockOnDismiss = jest.fn();
    render(
      <MascotGuide 
        {...defaultProps} 
        position="corner"
        onDismiss={mockOnDismiss}
      />
    );
    
    const mascotImage = screen.getByAltText('Mascot guide');
    fireEvent.click(mascotImage);
    
    // Should only be called by auto-hide, not by click
    expect(mockOnDismiss).not.toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    const mockOnDismiss = jest.fn();
    render(<MascotGuide {...defaultProps} onDismiss={mockOnDismiss} />);
    
    const dismissButton = screen.getByLabelText('Dismiss mascot guide');
    expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss mascot guide');
    
    const mascotImage = screen.getByAltText('Mascot guide');
    expect(mascotImage).toHaveAttribute('alt', 'Mascot guide');
  });

  it('renders with proper styling classes', () => {
    const { container } = render(<MascotGuide {...defaultProps} />);
    
    const mascotContainer = container.querySelector('.fixed');
    expect(mascotContainer).toHaveClass('z-50');
    
    const speechBubble = container.querySelector('.bg-white.rounded-2xl');
    expect(speechBubble).toBeInTheDocument();
  });
});