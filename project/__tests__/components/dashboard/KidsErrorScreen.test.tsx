import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  KidsErrorScreen, 
  NetworkErrorScreen, 
  VideoErrorScreen, 
  OfflineScreen, 
  GeneralErrorScreen 
} from '../../../components/dashboard/KidsErrorScreen';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('KidsErrorScreen', () => {
  const mockOnRetry = jest.fn();
  const mockOnGoHome = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('General Error Screen', () => {
    it('renders with default props', () => {
      render(<KidsErrorScreen />);
      
      expect(screen.getByText(/Oops! Something Happened!/)).toBeInTheDocument();
      expect(screen.getByText(/Don't worry! Sometimes things get a little mixed up/)).toBeInTheDocument();
      expect(screen.getByAltText('Sad Mascot')).toBeInTheDocument();
    });

    it('renders custom message', () => {
      const customMessage = "This is a custom error message for kids!";
      render(<KidsErrorScreen message={customMessage} />);
      
      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', async () => {
      render(<KidsErrorScreen onRetry={mockOnRetry} />);
      
      const retryButton = screen.getByText('Try Again!');
      fireEvent.click(retryButton);
      
      await waitFor(() => {
        expect(mockOnRetry).toHaveBeenCalledTimes(1);
      });
    });

    it('calls onGoHome when home button is clicked', async () => {
      render(<KidsErrorScreen onGoHome={mockOnGoHome} />);
      
      const homeButton = screen.getByText('Go Home');
      fireEvent.click(homeButton);
      
      await waitFor(() => {
        expect(mockOnGoHome).toHaveBeenCalledTimes(1);
      });
    });

    it('hides retry button when showRetryButton is false', () => {
      render(<KidsErrorScreen showRetryButton={false} />);
      
      expect(screen.queryByText('Try Again!')).not.toBeInTheDocument();
    });

    it('hides home button when showHomeButton is false', () => {
      render(<KidsErrorScreen showHomeButton={false} />);
      
      expect(screen.queryByText('Go Home')).not.toBeInTheDocument();
    });
  });

  describe('Network Error Screen', () => {
    it('renders network-specific content', () => {
      render(<NetworkErrorScreen onRetry={mockOnRetry} onGoHome={mockOnGoHome} />);
      
      expect(screen.getByText(/Oops! No Internet!/)).toBeInTheDocument();
      expect(screen.getByText(/The internet is taking a nap!/)).toBeInTheDocument();
    });

    it('uses sad tiger mascot for network errors', () => {
      render(<NetworkErrorScreen />);
      
      const mascotImage = screen.getByAltText('Sad Mascot');
      expect(mascotImage).toHaveAttribute('src', '/images/mascots/sad_tiger.png');
    });
  });

  describe('Video Error Screen', () => {
    it('renders video-specific content', () => {
      render(<VideoErrorScreen onRetry={mockOnRetry} onGoHome={mockOnGoHome} />);
      
      expect(screen.getByText(/This Video is Sleepy!/)).toBeInTheDocument();
      expect(screen.getByText(/This video is taking a little nap/)).toBeInTheDocument();
    });

    it('uses confused tiger mascot for video errors', () => {
      render(<VideoErrorScreen />);
      
      const mascotImage = screen.getByAltText('Sad Mascot');
      expect(mascotImage).toHaveAttribute('src', '/images/mascots/confused_tiger.png');
    });
  });

  describe('Offline Screen', () => {
    it('renders offline-specific content', () => {
      render(<OfflineScreen onGoHome={mockOnGoHome} />);
      
      expect(screen.getByText(/No Internet Right Now!/)).toBeInTheDocument();
      expect(screen.getByText(/No internet right now, but that's okay!/)).toBeInTheDocument();
    });

    it('does not show retry button for offline screen', () => {
      render(<OfflineScreen />);
      
      expect(screen.queryByText('Try Again!')).not.toBeInTheDocument();
    });

    it('shows home button for offline screen', () => {
      render(<OfflineScreen onGoHome={mockOnGoHome} />);
      
      expect(screen.getByText('Go Home')).toBeInTheDocument();
    });
  });

  describe('General Error Screen Component', () => {
    it('renders with custom message', () => {
      const customMessage = "Something specific went wrong!";
      render(<GeneralErrorScreen message={customMessage} onRetry={mockOnRetry} />);
      
      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper alt text for mascot image', () => {
      render(<KidsErrorScreen />);
      
      const mascotImage = screen.getByAltText('Sad Mascot');
      expect(mascotImage).toBeInTheDocument();
    });

    it('has accessible button text', () => {
      render(<KidsErrorScreen onRetry={mockOnRetry} onGoHome={mockOnGoHome} />);
      
      expect(screen.getByRole('button', { name: /Try Again!/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Go Home/i })).toBeInTheDocument();
    });

    it('has proper heading structure', () => {
      render(<KidsErrorScreen />);
      
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/Oops! Something Happened!/);
    });
  });

  describe('Child-Friendly Language', () => {
    it('uses encouraging and positive language', () => {
      render(<KidsErrorScreen />);
      
      expect(screen.getByText(/Don't worry! Sometimes things get a little mixed up/)).toBeInTheDocument();
      expect(screen.getByText(/Don't worry! We'll fix this together!/)).toBeInTheDocument();
    });

    it('includes fun emojis in messages', () => {
      render(<NetworkErrorScreen />);
      
      expect(screen.getByText(/📡/)).toBeInTheDocument();
    });

    it('uses simple, child-appropriate vocabulary', () => {
      render(<VideoErrorScreen />);
      
      expect(screen.getByText(/sleepy/i)).toBeInTheDocument();
      expect(screen.getByText(/nap/i)).toBeInTheDocument();
    });
  });
});