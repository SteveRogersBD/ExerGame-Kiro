import { render, screen, waitFor } from '@testing-library/react';
import VideoTransition from '@/components/dashboard/VideoTransition';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('VideoTransition', () => {
  const mockOnTransitionComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when visible', () => {
    render(
      <VideoTransition
        isVisible={true}
        videoTitle="Test Video"
        onTransitionComplete={mockOnTransitionComplete}
      />
    );

    expect(screen.getByText('🎬 Get Ready! 🎬')).toBeDefined();
    expect(screen.getByText('The video is starting!')).toBeDefined();
    expect(screen.getByAltText('Smiling Mascot')).toBeDefined();
  });

  it('does not render when not visible', () => {
    render(
      <VideoTransition
        isVisible={false}
        videoTitle="Test Video"
        onTransitionComplete={mockOnTransitionComplete}
      />
    );

    expect(screen.queryByText('🎬 Get Ready! 🎬')).toBeNull();
  });

  it('displays the correct video title', () => {
    render(
      <VideoTransition
        isVisible={true}
        videoTitle="Amazing Adventure Video"
        onTransitionComplete={mockOnTransitionComplete}
      />
    );

    expect(screen.getByText('Amazing Adventure Video')).toBeDefined();
  });

  it('calls onTransitionComplete after timeout', async () => {
    jest.useFakeTimers();
    
    render(
      <VideoTransition
        isVisible={true}
        videoTitle="Test Video"
        onTransitionComplete={mockOnTransitionComplete}
      />
    );

    // Fast-forward time to trigger the completion
    jest.advanceTimersByTime(4000);

    await waitFor(() => {
      expect(mockOnTransitionComplete).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });

  it('shows loading animation elements', async () => {
    jest.useFakeTimers();
    
    render(
      <VideoTransition
        isVisible={true}
        videoTitle="Test Video"
        onTransitionComplete={mockOnTransitionComplete}
      />
    );

    // Fast-forward to show loading animations
    jest.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(screen.getByText('Loading your adventure...')).toBeDefined();
      expect(screen.getByText('Getting ready for you! 🎮')).toBeDefined();
    });

    jest.useRealTimers();
  });
});