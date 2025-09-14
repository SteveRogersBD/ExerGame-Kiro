import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayPage from '@/app/play/page';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock hooks
jest.mock('@/hooks/useInteractiveAnimations', () => ({
  useInteractiveAnimations: () => ({
    playSound: jest.fn(),
    triggerHaptic: jest.fn(),
  }),
}));

jest.mock('@/hooks/useMascotGuide', () => ({
  useMascotGuide: () => ({
    mascotMessage: 'Welcome back! Ready for some fun learning?',
    showMascot: true,
    updateMascotMessage: jest.fn(),
    hideMascot: jest.fn(),
  }),
}));

jest.mock('@/hooks/useOfflineDetection', () => ({
  useOfflineDetection: () => ({
    isOffline: false,
  }),
}));

jest.mock('@/hooks/useKidsDashboard', () => ({
  useKidsDashboard: () => ({
    state: {
      user: {
        name: 'Alex',
        avatar: '/images/avatars/child-avatar-1.png',
        badges: [
          { id: 'b1', name: 'Test Badge', icon: '⭐', category: 'video' }
        ],
        streak: 3
      },
      content: {
        presetVideos: [
          { id: 'v1', title: 'Test Video', thumbnail: '/test.jpg', url: 'test', duration: 300, quizQuestions: [], completionReward: { id: 'r1', name: 'Reward', icon: '🏆', category: 'video' } }
        ],
        homework: [
          { id: 'h1', title: 'Test Homework', icon: '📚', status: 'not_started', assignedBy: 'Mom', video: { id: 'hv1', title: 'Homework Video', thumbnail: '/test.jpg', url: 'test', duration: 300, quizQuestions: [], completionReward: { id: 'hr1', name: 'Homework Reward', icon: '🎯', category: 'homework' } } }
        ]
      },
      ui: {
        currentView: 'dashboard',
        isLoading: false,
        mascotMessage: 'Welcome!',
        backgroundTheme: 'sky'
      }
    },
    isInitialized: true,
    addBadge: jest.fn(),
    updateHomeworkStatus: jest.fn(),
    incrementStreak: jest.fn(),
    navigateToSection: jest.fn(),
  }),
}));

jest.mock('@/hooks/useKidsDashboardRouter', () => ({
  useKidsDashboardRouter: () => ({
    currentRoute: 'dashboard',
    selectedVideo: null,
    selectedHomework: null,
    completionScore: 0,
    startVideo: jest.fn(),
    startHomework: jest.fn(),
    completeTransition: jest.fn(),
    completeMissionIntro: jest.fn(),
    completeVideo: jest.fn(),
    quitVideo: jest.fn(),
    goHome: jest.fn(),
    showBadges: jest.fn(),
    showHelp: jest.fn(),
    registerCleanup: jest.fn(),
    isCurrentRoute: (route: string) => route === 'dashboard',
  }),
}));

// Mock components
jest.mock('@/components/AnimatedBackground', () => {
  return function MockAnimatedBackground() {
    return <div data-testid="animated-background">Animated Background</div>;
  };
});

jest.mock('@/components/FloatingMascots', () => {
  return function MockFloatingMascots() {
    return <div data-testid="floating-mascots">Floating Mascots</div>;
  };
});

jest.mock('@/components/dashboard/KidsDashboardHeader', () => {
  return function MockKidsDashboardHeader({ childName }: any) {
    return <div data-testid="dashboard-header">Header for {childName}</div>;
  };
});

jest.mock('@/components/dashboard/PresetVideosSection', () => {
  return function MockPresetVideosSection({ videos, onVideoSelect }: any) {
    return (
      <div data-testid="preset-videos-section">
        <h2>Preset Videos</h2>
        {videos.map((video: any) => (
          <button
            key={video.id}
            data-testid={`video-${video.id}`}
            onClick={() => onVideoSelect(video)}
          >
            {video.title}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('@/components/dashboard/HomeworkSection', () => {
  return function MockHomeworkSection({ homework, onHomeworkSelect }: any) {
    return (
      <div data-testid="homework-section">
        <h2>Homework</h2>
        {homework.map((hw: any) => (
          <button
            key={hw.id}
            data-testid={`homework-${hw.id}`}
            onClick={() => onHomeworkSelect(hw)}
          >
            {hw.title}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('@/components/dashboard/BottomNavigation', () => {
  return function MockBottomNavigation({ onNavigate }: any) {
    return (
      <div data-testid="bottom-navigation">
        <button onClick={() => onNavigate('dashboard')}>Home</button>
        <button onClick={() => onNavigate('badges')}>Badges</button>
        <button onClick={() => onNavigate('help')}>Help</button>
      </div>
    );
  };
});

jest.mock('@/components/dashboard/BadgesPage', () => {
  return function MockBadgesPage({ badges, onBackToDashboard }: any) {
    return (
      <div data-testid="badges-page">
        <h2>Badges ({badges.length})</h2>
        <button onClick={onBackToDashboard}>Back to Dashboard</button>
      </div>
    );
  };
});

jest.mock('@/components/dashboard/HelpPage', () => {
  return function MockHelpPage({ onBackToDashboard }: any) {
    return (
      <div data-testid="help-page">
        <h2>Help</h2>
        <button onClick={onBackToDashboard}>Back to Dashboard</button>
      </div>
    );
  };
});

jest.mock('@/components/dashboard/VideoTransition', () => {
  return function MockVideoTransition({ isVisible, videoTitle, onTransitionComplete }: any) {
    if (!isVisible) return null;
    return (
      <div data-testid="video-transition">
        <p>Starting: {videoTitle}</p>
        <button onClick={onTransitionComplete}>Complete Transition</button>
      </div>
    );
  };
});

jest.mock('@/components/dashboard/VideoPlayer', () => {
  return React.forwardRef(function MockVideoPlayer({ video, onComplete, onQuit }: any, ref) {
    return (
      <div data-testid="video-player">
        <h2>Playing: {video.title}</h2>
        <button onClick={() => onComplete(85)}>Complete Video</button>
        <button onClick={onQuit}>Quit Video</button>
      </div>
    );
  });
});

jest.mock('@/components/dashboard/CompletionScreen', () => {
  return function MockCompletionScreen({ score, videoTitle, onContinue }: any) {
    return (
      <div data-testid="completion-screen">
        <h2>Completed: {videoTitle}</h2>
        <p>Score: {score}</p>
        <button onClick={onContinue}>Continue</button>
      </div>
    );
  };
});

jest.mock('@/components/dashboard/MissionIntro', () => {
  return function MockMissionIntro({ homework, onStartMission, onCancel }: any) {
    return (
      <div data-testid="mission-intro">
        <h2>Mission: {homework.title}</h2>
        <button onClick={onStartMission}>Start Mission</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  };
});

jest.mock('@/components/dashboard/MascotGuide', () => {
  return function MockMascotGuide({ message, isVisible }: any) {
    if (!isVisible) return null;
    return <div data-testid="mascot-guide">{message}</div>;
  };
});

jest.mock('@/components/ui/VisualFeedback', () => ({
  __esModule: true,
  default: function MockVisualFeedback() {
    return <div data-testid="visual-feedback">Visual Feedback</div>;
  },
  useVisualFeedback: () => ({
    feedback: [],
    addFeedback: jest.fn(),
    removeFeedback: jest.fn(),
  }),
}));

jest.mock('@/components/ui/PageTransition', () => {
  return function MockPageTransition({ children }: any) {
    return <div data-testid="page-transition">{children}</div>;
  };
});

jest.mock('@/components/dashboard/LoadingScreen', () => {
  return function MockLoadingScreen({ message }: any) {
    return <div data-testid="loading-screen">{message}</div>;
  };
});

jest.mock('@/components/dashboard/KidsErrorScreen', () => {
  return function MockKidsErrorScreen({ message, onRetry }: any) {
    return (
      <div data-testid="error-screen">
        <p>{message}</p>
        <button onClick={onRetry}>Retry</button>
      </div>
    );
  };
});

jest.mock('@/components/dashboard/KidsErrorBoundary', () => {
  return function MockKidsErrorBoundary({ children }: any) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

// Setup sessionStorage mock
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('Kids Dashboard Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.getItem.mockReturnValue('true'); // Mock verified state
  });

  it('renders the complete dashboard interface', async () => {
    await act(async () => {
      render(<PlayPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('animated-background')).toBeInTheDocument();
      expect(screen.getByTestId('floating-mascots')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
      expect(screen.getByTestId('preset-videos-section')).toBeInTheDocument();
      expect(screen.getByTestId('homework-section')).toBeInTheDocument();
      expect(screen.getByTestId('bottom-navigation')).toBeInTheDocument();
    });
  });

  it('handles complete video flow from selection to completion', async () => {
    await act(async () => {
      render(<PlayPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('preset-videos-section')).toBeInTheDocument();
    });

    // Select a video
    const videoButton = screen.getByTestId('video-v1');
    await act(async () => {
      fireEvent.click(videoButton);
    });

    // Should show video transition
    await waitFor(() => {
      expect(screen.getByTestId('video-transition')).toBeInTheDocument();
    });

    // Complete transition
    const transitionButton = screen.getByText('Complete Transition');
    await act(async () => {
      fireEvent.click(transitionButton);
    });

    // Should show video player
    await waitFor(() => {
      expect(screen.getByTestId('video-player')).toBeInTheDocument();
    });

    // Complete video
    const completeButton = screen.getByText('Complete Video');
    await act(async () => {
      fireEvent.click(completeButton);
    });

    // Should show completion screen
    await waitFor(() => {
      expect(screen.getByTestId('completion-screen')).toBeInTheDocument();
      expect(screen.getByText('Score: 85')).toBeInTheDocument();
    });

    // Continue from completion
    const continueButton = screen.getByText('Continue');
    await act(async () => {
      fireEvent.click(continueButton);
    });

    // Should return to dashboard
    await waitFor(() => {
      expect(screen.getByTestId('preset-videos-section')).toBeInTheDocument();
    });
  });

  it('handles complete homework flow from selection to completion', async () => {
    await act(async () => {
      render(<PlayPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('homework-section')).toBeInTheDocument();
    });

    // Select homework
    const homeworkButton = screen.getByTestId('homework-h1');
    await act(async () => {
      fireEvent.click(homeworkButton);
    });

    // Should show mission intro
    await waitFor(() => {
      expect(screen.getByTestId('mission-intro')).toBeInTheDocument();
    });

    // Start mission
    const startButton = screen.getByText('Start Mission');
    await act(async () => {
      fireEvent.click(startButton);
    });

    // Should show video transition
    await waitFor(() => {
      expect(screen.getByTestId('video-transition')).toBeInTheDocument();
    });

    // Complete transition
    const transitionButton = screen.getByText('Complete Transition');
    await act(async () => {
      fireEvent.click(transitionButton);
    });

    // Should show video player
    await waitFor(() => {
      expect(screen.getByTestId('video-player')).toBeInTheDocument();
    });

    // Complete video
    const completeButton = screen.getByText('Complete Video');
    await act(async () => {
      fireEvent.click(completeButton);
    });

    // Should show completion screen
    await waitFor(() => {
      expect(screen.getByTestId('completion-screen')).toBeInTheDocument();
    });
  });

  it('handles navigation between dashboard sections', async () => {
    await act(async () => {
      render(<PlayPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('bottom-navigation')).toBeInTheDocument();
    });

    // Navigate to badges
    const badgesButton = screen.getByText('Badges');
    await act(async () => {
      fireEvent.click(badgesButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('badges-page')).toBeInTheDocument();
    });

    // Navigate to help
    const helpButton = screen.getByText('Help');
    await act(async () => {
      fireEvent.click(helpButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('help-page')).toBeInTheDocument();
    });

    // Navigate back to dashboard
    const homeButton = screen.getByText('Home');
    await act(async () => {
      fireEvent.click(homeButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('preset-videos-section')).toBeInTheDocument();
    });
  });

  it('handles video quit functionality', async () => {
    await act(async () => {
      render(<PlayPage />);
    });

    // Start video flow
    const videoButton = screen.getByTestId('video-v1');
    await act(async () => {
      fireEvent.click(videoButton);
    });

    // Complete transition to get to video player
    await waitFor(() => {
      expect(screen.getByTestId('video-transition')).toBeInTheDocument();
    });

    const transitionButton = screen.getByText('Complete Transition');
    await act(async () => {
      fireEvent.click(transitionButton);
    });

    // Quit video
    await waitFor(() => {
      expect(screen.getByTestId('video-player')).toBeInTheDocument();
    });

    const quitButton = screen.getByText('Quit Video');
    await act(async () => {
      fireEvent.click(quitButton);
    });

    // Should return to dashboard
    await waitFor(() => {
      expect(screen.getByTestId('preset-videos-section')).toBeInTheDocument();
    });
  });

  it('handles mission cancellation', async () => {
    await act(async () => {
      render(<PlayPage />);
    });

    // Select homework
    const homeworkButton = screen.getByTestId('homework-h1');
    await act(async () => {
      fireEvent.click(homeworkButton);
    });

    // Cancel mission
    await waitFor(() => {
      expect(screen.getByTestId('mission-intro')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // Should return to dashboard
    await waitFor(() => {
      expect(screen.getByTestId('preset-videos-section')).toBeInTheDocument();
    });
  });

  it('redirects to home when not verified', async () => {
    mockSessionStorage.getItem.mockReturnValue(null); // Not verified

    await act(async () => {
      render(<PlayPage />);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows loading screen initially', async () => {
    render(<PlayPage />);

    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
    expect(screen.getByText('Getting your playground ready!')).toBeInTheDocument();
  });
});