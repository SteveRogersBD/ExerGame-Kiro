import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MascotGuideIntegration from '../../../components/dashboard/MascotGuideIntegration';

// Mock the MascotGuide component
jest.mock('../../../components/dashboard/MascotGuide', () => {
  return function MockMascotGuide({ message, isVisible }: any) {
    return isVisible ? <div data-testid="mascot-guide">{message}</div> : null;
  };
});

// Mock the useMascotGuide hook
const mockUseMascotGuide = {
  currentGuide: null,
  isVisible: false,
  hideGuide: jest.fn(),
  showWelcome: jest.fn(),
  showBadgeEarned: jest.fn(),
  showLoading: jest.fn(),
  showError: jest.fn(),
  showHelp: jest.fn(),
};

jest.mock('../../../hooks/useMascotGuide', () => ({
  useMascotGuide: () => mockUseMascotGuide,
}));

describe('MascotGuideIntegration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
    
    // Reset mock state
    mockUseMascotGuide.currentGuide = null;
    mockUseMascotGuide.isVisible = false;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders children content', () => {
    render(
      <MascotGuideIntegration>
        <div>Dashboard Content</div>
      </MascotGuideIntegration>
    );
    
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });

  it('shows welcome guide for first-time visitors after delay', async () => {
    render(
      <MascotGuideIntegration isFirstVisit={true} context="dashboard">
        <div>Dashboard Content</div>
      </MascotGuideIntegration>
    );
    
    // Should not show immediately
    expect(mockUseMascotGuide.showWelcome).not.toHaveBeenCalled();
    
    // Advance timer to trigger welcome
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(mockUseMascotGuide.showWelcome).toHaveBeenCalledTimes(1);
    });
  });

  it('shows badge earned guide when hasNewBadge is true', () => {
    render(
      <MascotGuideIntegration hasNewBadge={true}>
        <div>Dashboard Content</div>
      </MascotGuideIntegration>
    );
    
    expect(mockUseMascotGuide.showBadgeEarned).toHaveBeenCalledTimes(1);
  });

  it('shows loading guide when isLoading is true', () => {
    render(
      <MascotGuideIntegration isLoading={true}>
        <div>Dashboard Content</div>
      </MascotGuideIntegration>
    );
    
    expect(mockUseMascotGuide.showLoading).toHaveBeenCalledTimes(1);
  });

  it('shows error guide when error is provided', () => {
    const errorMessage = 'Something went wrong!';
    render(
      <MascotGuideIntegration error={errorMessage}>
        <div>Dashboard Content</div>
      </MascotGuideIntegration>
    );
    
    expect(mockUseMascotGuide.showError).toHaveBeenCalledWith(errorMessage);
  });

  it('shows help guide when context is help', () => {
    render(
      <MascotGuideIntegration context="help">
        <div>Help Content</div>
      </MascotGuideIntegration>
    );
    
    expect(mockUseMascotGuide.showHelp).toHaveBeenCalledTimes(1);
  });

  it('prioritizes error over other states', () => {
    render(
      <MascotGuideIntegration 
        error="Error occurred"
        isLoading={true}
        hasNewBadge={true}
        isFirstVisit={true}
      >
        <div>Content</div>
      </MascotGuideIntegration>
    );
    
    expect(mockUseMascotGuide.showError).toHaveBeenCalledWith('Error occurred');
    expect(mockUseMascotGuide.showLoading).not.toHaveBeenCalled();
    expect(mockUseMascotGuide.showBadgeEarned).not.toHaveBeenCalled();
    expect(mockUseMascotGuide.showWelcome).not.toHaveBeenCalled();
  });

  it('prioritizes loading over badge and welcome states', () => {
    render(
      <MascotGuideIntegration 
        isLoading={true}
        hasNewBadge={true}
        isFirstVisit={true}
      >
        <div>Content</div>
      </MascotGuideIntegration>
    );
    
    expect(mockUseMascotGuide.showLoading).toHaveBeenCalledTimes(1);
    expect(mockUseMascotGuide.showBadgeEarned).not.toHaveBeenCalled();
    expect(mockUseMascotGuide.showWelcome).not.toHaveBeenCalled();
  });

  it('prioritizes badge earned over welcome state', () => {
    render(
      <MascotGuideIntegration 
        hasNewBadge={true}
        isFirstVisit={true}
      >
        <div>Content</div>
      </MascotGuideIntegration>
    );
    
    expect(mockUseMascotGuide.showBadgeEarned).toHaveBeenCalledTimes(1);
    expect(mockUseMascotGuide.showWelcome).not.toHaveBeenCalled();
  });

  it('renders MascotGuide when currentGuide is available', () => {
    mockUseMascotGuide.currentGuide = {
      message: 'Test message',
      mascotImage: '/images/mascots/happy_tiger.png',
      position: 'corner' as const,
    };
    mockUseMascotGuide.isVisible = true;
    
    render(
      <MascotGuideIntegration>
        <div>Content</div>
      </MascotGuideIntegration>
    );
    
    expect(screen.getByTestId('mascot-guide')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('does not render MascotGuide when currentGuide is null', () => {
    mockUseMascotGuide.currentGuide = null;
    mockUseMascotGuide.isVisible = false;
    
    render(
      <MascotGuideIntegration>
        <div>Content</div>
      </MascotGuideIntegration>
    );
    
    expect(screen.queryByTestId('mascot-guide')).not.toBeInTheDocument();
  });

  it('does not show welcome for non-dashboard contexts', () => {
    render(
      <MascotGuideIntegration isFirstVisit={true} context="video">
        <div>Video Content</div>
      </MascotGuideIntegration>
    );
    
    jest.advanceTimersByTime(1000);
    
    expect(mockUseMascotGuide.showWelcome).not.toHaveBeenCalled();
  });

  it('cleans up timer on unmount', () => {
    const { unmount } = render(
      <MascotGuideIntegration isFirstVisit={true} context="dashboard">
        <div>Content</div>
      </MascotGuideIntegration>
    );
    
    unmount();
    
    jest.advanceTimersByTime(1000);
    
    expect(mockUseMascotGuide.showWelcome).not.toHaveBeenCalled();
  });
});