import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoPauseScreen from '../../../components/dashboard/VideoPauseScreen';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('VideoPauseScreen', () => {
  const mockOnResume = jest.fn();
  const mockOnQuit = jest.fn();
  const defaultProps = {
    videoTitle: 'Test Video Adventure',
    onResume: mockOnResume,
    onQuit: mockOnQuit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with required props', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      expect(screen.getByText('Video Paused! ⏸️')).toBeInTheDocument();
      expect(screen.getByText('Test Video Adventure')).toBeInTheDocument();
      expect(screen.getByAltText('Pause Mascot')).toBeInTheDocument();
    });

    it('displays encouraging message', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      expect(screen.getByText(/Take your time! Ready to continue?/)).toBeInTheDocument();
      expect(screen.getByText(/Tap Resume to continue watching!/)).toBeInTheDocument();
    });

    it('shows score when provided', () => {
      render(<VideoPauseScreen {...defaultProps} currentScore={85} />);
      
      expect(screen.getByText('Your Score')).toBeInTheDocument();
      expect(screen.getByText('85 ⭐')).toBeInTheDocument();
    });

    it('hides score when not provided or zero', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      expect(screen.queryByText('Your Score')).not.toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('calls onResume when resume button is clicked', async () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      const resumeButton = screen.getByText('Resume!');
      fireEvent.click(resumeButton);
      
      await waitFor(() => {
        expect(mockOnResume).toHaveBeenCalledTimes(1);
      });
    });

    it('calls onQuit when quit button is clicked', async () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      const quitButton = screen.getByText('Quit');
      fireEvent.click(quitButton);
      
      await waitFor(() => {
        expect(mockOnQuit).toHaveBeenCalledTimes(1);
      });
    });

    it('has properly sized buttons for child interaction', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      const resumeButton = screen.getByText('Resume!');
      const quitButton = screen.getByText('Quit');
      
      expect(resumeButton).toHaveClass('min-w-[180px]', 'min-h-[70px]');
      expect(quitButton).toHaveClass('min-w-[180px]', 'min-h-[70px]');
    });
  });

  describe('Visual Elements', () => {
    it('displays mascot image with proper alt text', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      const mascotImage = screen.getByAltText('Pause Mascot');
      expect(mascotImage).toHaveAttribute('src', '/images/mascots/smilling_mascot.png');
    });

    it('includes emojis in button text', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      expect(screen.getByText('▶️')).toBeInTheDocument(); // Resume button emoji
      expect(screen.getByText('🏠')).toBeInTheDocument(); // Quit button emoji
    });

    it('displays floating hearts for comfort', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      const hearts = screen.getAllByText('💖');
      expect(hearts).toHaveLength(3);
    });

    it('shows floating stars animation', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      const stars = screen.getAllByText('⭐');
      expect(stars.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles and text', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /Resume!/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Quit/i })).toBeInTheDocument();
    });

    it('has proper heading structure', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Video Paused! ⏸️');
    });

    it('provides clear visual feedback for actions', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      const resumeButton = screen.getByText('Resume!');
      const quitButton = screen.getByText('Quit');
      
      // Check for visual styling classes
      expect(resumeButton).toHaveClass('bg-gradient-to-r', 'from-green-400', 'to-green-600');
      expect(quitButton).toHaveClass('bg-gradient-to-r', 'from-red-400', 'to-red-600');
    });
  });

  describe('Child-Friendly Design', () => {
    it('uses large, child-friendly buttons', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      const resumeButton = screen.getByText('Resume!');
      const quitButton = screen.getByText('Quit');
      
      expect(resumeButton).toHaveClass('text-xl', 'md:text-2xl', 'font-bold');
      expect(quitButton).toHaveClass('text-xl', 'md:text-2xl', 'font-bold');
    });

    it('uses encouraging and positive language', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      expect(screen.getByText(/Take your time! Ready to continue?/)).toBeInTheDocument();
      expect(screen.getByText(/Tap Resume to continue watching!/)).toBeInTheDocument();
    });

    it('includes fun emojis throughout the interface', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      expect(screen.getByText(/⏸️/)).toBeInTheDocument(); // Pause emoji
      expect(screen.getByText(/🎬/)).toBeInTheDocument(); // Movie emoji
      expect(screen.getByText(/🎉/)).toBeInTheDocument(); // Party emoji
    });

    it('provides clear visual hierarchy', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      const title = screen.getByText('Video Paused! ⏸️');
      const videoTitle = screen.getByText('Test Video Adventure');
      
      expect(title).toHaveClass('text-3xl', 'md:text-4xl', 'font-bold');
      expect(videoTitle).toHaveClass('text-lg', 'md:text-xl', 'font-semibold');
    });
  });

  describe('Score Display', () => {
    it('shows score with proper formatting when score is greater than 0', () => {
      render(<VideoPauseScreen {...defaultProps} currentScore={42} />);
      
      expect(screen.getByText('Your Score')).toBeInTheDocument();
      expect(screen.getByText('42 ⭐')).toBeInTheDocument();
    });

    it('does not show score section when score is 0', () => {
      render(<VideoPauseScreen {...defaultProps} currentScore={0} />);
      
      expect(screen.queryByText('Your Score')).not.toBeInTheDocument();
    });

    it('does not show score section when score is undefined', () => {
      render(<VideoPauseScreen {...defaultProps} />);
      
      expect(screen.queryByText('Your Score')).not.toBeInTheDocument();
    });
  });
});