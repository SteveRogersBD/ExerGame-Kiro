import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import the hooks directly to test them
import { useKidsDashboard } from '@/hooks/useKidsDashboard';
import { useKidsDashboardRouter } from '@/hooks/useKidsDashboardRouter';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test component that uses the hooks
function TestDashboard() {
  const {
    state,
    isInitialized,
    addBadge,
    updateHomeworkStatus,
    incrementStreak,
  } = useKidsDashboard();

  const {
    currentRoute,
    selectedVideo,
    selectedHomework,
    startVideo,
    startHomework,
    completeVideo,
    goHome,
    isCurrentRoute,
  } = useKidsDashboardRouter();

  const handleVideoSelect = () => {
    const testVideo = state.content.presetVideos[0];
    if (testVideo) {
      startVideo(testVideo);
    }
  };

  const handleHomeworkSelect = () => {
    const testHomework = state.content.homework[0];
    if (testHomework) {
      startHomework(testHomework);
    }
  };

  const handleVideoComplete = () => {
    const newBadge = {
      id: 'test-badge',
      name: 'Test Badge',
      icon: '🏆',
      earnedAt: new Date(),
      category: 'video' as const,
    };
    addBadge(newBadge);
    incrementStreak();
    completeVideo(85);
  };

  if (!isInitialized) {
    return <div data-testid="loading">Loading...</div>;
  }

  return (
    <div data-testid="dashboard">
      <div data-testid="current-route">{currentRoute}</div>
      <div data-testid="user-name">{state.user.name}</div>
      <div data-testid="user-streak">{state.user.streak}</div>
      <div data-testid="badge-count">{state.user.badges.length}</div>
      
      {isCurrentRoute('dashboard') && (
        <div data-testid="dashboard-content">
          <button onClick={handleVideoSelect} data-testid="select-video">
            Select Video
          </button>
          <button onClick={handleHomeworkSelect} data-testid="select-homework">
            Select Homework
          </button>
        </div>
      )}

      {isCurrentRoute('video-transition') && (
        <div data-testid="video-transition">
          Video Transition: {selectedVideo?.title}
        </div>
      )}

      {isCurrentRoute('mission-intro') && (
        <div data-testid="mission-intro">
          Mission: {selectedHomework?.title}
        </div>
      )}

      {isCurrentRoute('completion') && (
        <div data-testid="completion">
          <button onClick={goHome} data-testid="go-home">
            Go Home
          </button>
        </div>
      )}

      <button onClick={handleVideoComplete} data-testid="complete-video">
        Complete Video
      </button>
    </div>
  );
}

describe('Dashboard Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('initializes dashboard state correctly', async () => {
    await act(async () => {
      render(<TestDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });

    expect(screen.getByTestId('current-route')).toHaveTextContent('dashboard');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Alex');
    expect(screen.getByTestId('user-streak')).toHaveTextContent('3');
  });

  it('handles video selection and routing', async () => {
    await act(async () => {
      render(<TestDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
    });

    // Select video
    const selectVideoButton = screen.getByTestId('select-video');
    await act(async () => {
      fireEvent.click(selectVideoButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-route')).toHaveTextContent('video-transition');
    });

    expect(screen.getByTestId('video-transition')).toBeInTheDocument();
  });

  it('handles homework selection and routing', async () => {
    await act(async () => {
      render(<TestDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
    });

    // Select homework
    const selectHomeworkButton = screen.getByTestId('select-homework');
    await act(async () => {
      fireEvent.click(selectHomeworkButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-route')).toHaveTextContent('mission-intro');
    });

    expect(screen.getByTestId('mission-intro')).toBeInTheDocument();
  });

  it('handles video completion and badge awarding', async () => {
    await act(async () => {
      render(<TestDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });

    const initialBadgeCount = parseInt(screen.getByTestId('badge-count').textContent || '0');
    const initialStreak = parseInt(screen.getByTestId('user-streak').textContent || '0');

    // Complete video
    const completeVideoButton = screen.getByTestId('complete-video');
    await act(async () => {
      fireEvent.click(completeVideoButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-route')).toHaveTextContent('completion');
    });

    // Check that badge was added and streak incremented
    expect(screen.getByTestId('badge-count')).toHaveTextContent((initialBadgeCount + 1).toString());
    expect(screen.getByTestId('user-streak')).toHaveTextContent((initialStreak + 1).toString());
  });

  it('handles navigation back to dashboard', async () => {
    await act(async () => {
      render(<TestDashboard />);
    });

    // Complete video to get to completion screen
    const completeVideoButton = screen.getByTestId('complete-video');
    await act(async () => {
      fireEvent.click(completeVideoButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('completion')).toBeInTheDocument();
    });

    // Go home
    const goHomeButton = screen.getByTestId('go-home');
    await act(async () => {
      fireEvent.click(goHomeButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-route')).toHaveTextContent('dashboard');
    });

    expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
  });
});