import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoPlayer from '@/components/dashboard/VideoPlayer';
import { Video } from '@/types/dashboard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = props;
      return <div className={className} {...domProps}>{children}</div>;
    },
    button: ({ children, onClick, className, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = props;
      return <button onClick={onClick} className={className} {...domProps}>{children}</button>;
    },
    img: ({ children, className, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = props;
      return <img className={className} {...domProps}>{children}</img>;
    },
    h3: ({ children, className, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = props;
      return <h3 className={className} {...domProps}>{children}</h3>;
    },
    p: ({ children, className, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = props;
      return <p className={className} {...domProps}>{children}</p>;
    },
    span: ({ children, className, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = props;
      return <span className={className} {...domProps}>{children}</span>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockVideo: Video = {
  id: 'test-video',
  title: 'Test Video',
  thumbnail: '/test-thumb.jpg',
  url: '/test-video.mp4',
  duration: 300,
  quizQuestions: [
    {
      id: 'q1',
      question: 'Test question?',
      timeInVideo: 60,
      options: [
        { id: 'a1', text: 'Option 1', gesture: 'jump' },
        { id: 'a2', text: 'Option 2', gesture: 'squat' },
        { id: 'a3', text: 'Option 3', gesture: 'clap' }
      ],
      correctAnswer: 'a1'
    }
  ],
  completionReward: {
    id: 'reward1',
    name: 'Test Badge',
    icon: '🏆',
    category: 'video'
  }
};

const mockProps = {
  video: mockVideo,
  onComplete: jest.fn(),
  onQuit: jest.fn()
};

// Mock HTMLVideoElement methods
Object.defineProperty(HTMLVideoElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLVideoElement.prototype, 'currentTime', {
  writable: true,
  value: 0,
});

Object.defineProperty(HTMLVideoElement.prototype, 'duration', {
  writable: true,
  value: 300,
});

describe('VideoPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders video player with loading state initially', () => {
    render(<VideoPlayer {...mockProps} />);
    
    expect(screen.getByText('Getting ready...')).toBeInTheDocument();
    expect(screen.getByText('Your video is loading!')).toBeInTheDocument();
  });

  it('displays video title and controls after loading', async () => {
    render(<VideoPlayer {...mockProps} />);
    
    const video = document.querySelector('video');
    
    // Simulate video loaded
    if (video) {
      fireEvent.loadedData(video);
    }

    await waitFor(() => {
      expect(screen.getByText('Test Video')).toBeInTheDocument();
    });
  });

  it('shows play button initially and toggles to pause when clicked', async () => {
    render(<VideoPlayer {...mockProps} />);
    
    const video = document.querySelector('video');
    if (video) {
      fireEvent.loadedData(video);
    }

    await waitFor(() => {
      const playButton = screen.getByText('▶️');
      expect(playButton).toBeInTheDocument();
      
      fireEvent.click(playButton);
      
      expect(screen.getByText('⏸️')).toBeInTheDocument();
    });
  });

  it('calls onQuit when quit button is clicked', async () => {
    render(<VideoPlayer {...mockProps} />);
    
    const video = document.querySelector('video');
    if (video) {
      fireEvent.loadedData(video);
    }

    await waitFor(() => {
      const quitButton = screen.getByText('⏹️');
      fireEvent.click(quitButton);
      
      expect(mockProps.onQuit).toHaveBeenCalled();
    });
  });

  it('displays quiz overlay when quiz time is reached', async () => {
    render(<VideoPlayer {...mockProps} />);
    
    const video = document.querySelector('video');
    if (video) {
      // Set video duration first
      Object.defineProperty(video, 'duration', {
        writable: true,
        value: 300,
      });
      
      fireEvent.loadedData(video);
      
      // Start playing the video first
      const playButton = screen.getByText('▶️');
      fireEvent.click(playButton);
      
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Simulate video time reaching quiz time
      Object.defineProperty(video, 'currentTime', {
        writable: true,
        value: 60,
      });
      
      fireEvent.timeUpdate(video);
    }

    await waitFor(() => {
      expect(screen.getByText('Quiz Time! 🎯')).toBeInTheDocument();
      expect(screen.getByText('Test question?')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles quiz answer selection correctly', async () => {
    render(<VideoPlayer {...mockProps} />);
    
    const video = document.querySelector('video');
    if (video) {
      // Set video duration first
      Object.defineProperty(video, 'duration', {
        writable: true,
        value: 300,
      });
      
      fireEvent.loadedData(video);
      
      // Start playing the video first
      const playButton = screen.getByText('▶️');
      fireEvent.click(playButton);
      
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Trigger quiz
      Object.defineProperty(video, 'currentTime', {
        writable: true,
        value: 60,
      });
      fireEvent.timeUpdate(video);
    }

    await waitFor(() => {
      const option1Button = screen.getByText('Option 1');
      fireEvent.click(option1Button);
    }, { timeout: 3000 });

    // Quiz should disappear after answer
    await waitFor(() => {
      expect(screen.queryByText('Quiz Time! 🎯')).not.toBeInTheDocument();
    });
  });

  it('displays score correctly', async () => {
    render(<VideoPlayer {...mockProps} />);
    
    const video = document.querySelector('video');
    if (video) {
      fireEvent.loadedData(video);
    }

    await waitFor(() => {
      expect(screen.getByText('Score')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  it('calls onComplete when video ends', async () => {
    render(<VideoPlayer {...mockProps} />);
    
    const video = document.querySelector('video');
    if (video) {
      fireEvent.loadedData(video);
      fireEvent.ended(video);
    }

    expect(mockProps.onComplete).toHaveBeenCalledWith(0);
  });

  it('shows progress bar with correct percentage', async () => {
    render(<VideoPlayer {...mockProps} />);
    
    const video = document.querySelector('video');
    if (video) {
      fireEvent.loadedData(video);
      
      // Set video to 50% complete
      Object.defineProperty(video, 'currentTime', {
        writable: true,
        value: 150,
      });
      Object.defineProperty(video, 'duration', {
        writable: true,
        value: 300,
      });
      
      fireEvent.timeUpdate(video);
    }

    await waitFor(() => {
      expect(screen.getByText('2:30')).toBeInTheDocument(); // Current time
      expect(screen.getByText('5:00')).toBeInTheDocument(); // Duration
    });
  });

  it('shows gesture icons for quiz options', async () => {
    render(<VideoPlayer {...mockProps} />);
    
    const video = document.querySelector('video');
    if (video) {
      // Set video duration first
      Object.defineProperty(video, 'duration', {
        writable: true,
        value: 300,
      });
      
      fireEvent.loadedData(video);
      
      // Start playing the video first
      const playButton = screen.getByText('▶️');
      fireEvent.click(playButton);
      
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Trigger quiz
      Object.defineProperty(video, 'currentTime', {
        writable: true,
        value: 60,
      });
      fireEvent.timeUpdate(video);
    }

    await waitFor(() => {
      expect(screen.getByText('🦘')).toBeInTheDocument(); // jump
      expect(screen.getByText('🐸')).toBeInTheDocument(); // squat
      expect(screen.getByText('👏')).toBeInTheDocument(); // clap
    }, { timeout: 3000 });
  });

  it('handles video errors gracefully', async () => {
    render(<VideoPlayer {...mockProps} />);
    
    const video = document.querySelector('video');
    if (video) {
      fireEvent.error(video);
    }

    // Should not show loading state after error
    await waitFor(() => {
      expect(screen.queryByText('Getting ready...')).not.toBeInTheDocument();
    });
  });
});