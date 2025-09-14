import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BadgesPage from '@/components/dashboard/BadgesPage';
import { Badge } from '@/types/dashboard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, whileHover, whileTap, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, initial, animate, transition, whileHover, whileTap, ...props }: any) => <button {...props}>{children}</button>,
    p: ({ children, initial, animate, transition, whileHover, whileTap, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock window.innerWidth and innerHeight for confetti animation
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

describe('BadgesPage', () => {
  const mockOnBackToDashboard = jest.fn();

  const mockBadges: Badge[] = [
    {
      id: 'badge1',
      name: 'Math Master',
      icon: '🔢',
      category: 'video',
      earnedAt: new Date('2024-01-15'),
    },
    {
      id: 'badge2',
      name: 'Animal Expert',
      icon: '🐾',
      category: 'video',
      earnedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago (newly earned)
    },
    {
      id: 'badge3',
      name: 'Explorer Badge',
      icon: '🧭',
      category: 'homework',
      earnedAt: new Date('2024-01-10'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the badges page with correct title and total count', () => {
    render(
      <BadgesPage
        badges={mockBadges}
        totalEarned={3}
        onBackToDashboard={mockOnBackToDashboard}
      />
    );

    expect(screen.getByText('🏆 Your Trophy Shelf! 🏆')).toBeInTheDocument();
    expect(screen.getByText("You've earned 3 amazing badges!")).toBeInTheDocument();
  });

  it('renders back to dashboard button and handles click', () => {
    render(
      <BadgesPage
        badges={mockBadges}
        totalEarned={3}
        onBackToDashboard={mockOnBackToDashboard}
      />
    );

    const backButton = screen.getByText('Back to Dashboard');
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(mockOnBackToDashboard).toHaveBeenCalledTimes(1);
  });

  it('displays all earned badges with correct information', () => {
    render(
      <BadgesPage
        badges={mockBadges}
        totalEarned={3}
        onBackToDashboard={mockOnBackToDashboard}
      />
    );

    // Check that all badges are displayed
    expect(screen.getByText('Math Master')).toBeInTheDocument();
    expect(screen.getByText('Animal Expert')).toBeInTheDocument();
    expect(screen.getByText('Explorer Badge')).toBeInTheDocument();

    // Check badge categories
    expect(screen.getAllByText('video')).toHaveLength(2);
    expect(screen.getByText('homework')).toBeInTheDocument();

    // Check badge icons are present (as aria-labels)
    expect(screen.getByLabelText('Math Master')).toBeInTheDocument();
    expect(screen.getByLabelText('Animal Expert')).toBeInTheDocument();
    expect(screen.getByLabelText('Explorer Badge')).toBeInTheDocument();
  });

  it('shows newly earned badge indicator for recent badges', () => {
    render(
      <BadgesPage
        badges={mockBadges}
        totalEarned={3}
        onBackToDashboard={mockOnBackToDashboard}
      />
    );

    // Should show indicator for newly earned badges
    expect(screen.getByText('🎉 1 new badge earned recently!')).toBeInTheDocument();
  });

  it('displays empty slots for future badges', () => {
    render(
      <BadgesPage
        badges={mockBadges}
        totalEarned={3}
        onBackToDashboard={mockOnBackToDashboard}
      />
    );

    // Should show mystery badge slots (6 empty slots on bottom shelf since we have 3 badges on top shelf)
    expect(screen.getAllByText('Mystery Badge')).toHaveLength(6); // Bottom shelf has 6 empty slots
    expect(screen.getAllByText('Keep playing!')).toHaveLength(6);
  });

  it('displays progress stats correctly', () => {
    render(
      <BadgesPage
        badges={mockBadges}
        totalEarned={3}
        onBackToDashboard={mockOnBackToDashboard}
      />
    );

    // Check progress stats
    expect(screen.getByText('Total Badges')).toBeInTheDocument();
    expect(screen.getByText('Learning Streak')).toBeInTheDocument();
    expect(screen.getByText('Next Goal')).toBeInTheDocument();
    expect(screen.getByText('3 days')).toBeInTheDocument();
    expect(screen.getByText('5 badges')).toBeInTheDocument();
  });

  it('shows encouragement message and play more button', () => {
    render(
      <BadgesPage
        badges={mockBadges}
        totalEarned={3}
        onBackToDashboard={mockOnBackToDashboard}
      />
    );

    expect(screen.getByText("🌟 You're doing amazing! 🌟")).toBeInTheDocument();
    expect(screen.getByText('Complete more videos and homework to fill up your trophy shelf!')).toBeInTheDocument();
    
    const playMoreButton = screen.getByText("🎮 Let's Play More!");
    expect(playMoreButton).toBeInTheDocument();

    fireEvent.click(playMoreButton);
    expect(mockOnBackToDashboard).toHaveBeenCalledTimes(1);
  });

  it('handles empty badges array correctly', () => {
    render(
      <BadgesPage
        badges={[]}
        totalEarned={0}
        onBackToDashboard={mockOnBackToDashboard}
      />
    );

    expect(screen.getByText("You've earned 0 amazing badges!")).toBeInTheDocument();
    expect(screen.getAllByText('Mystery Badge')).toHaveLength(6); // All 6 slots should be empty
  });

  it('handles singular badge count correctly', () => {
    const singleBadge: Badge[] = [
      {
        id: 'badge1',
        name: 'First Badge',
        icon: '⭐',
        category: 'video',
        earnedAt: new Date(),
      },
    ];

    render(
      <BadgesPage
        badges={singleBadge}
        totalEarned={1}
        onBackToDashboard={mockOnBackToDashboard}
      />
    );

    expect(screen.getByText("You've earned 1 amazing badge!")).toBeInTheDocument();
    expect(screen.getByText('🎉 1 new badge earned recently!')).toBeInTheDocument();
  });

  it('displays badges without earnedAt date correctly', () => {
    const badgeWithoutDate: Badge[] = [
      {
        id: 'badge1',
        name: 'Test Badge',
        icon: '🎯',
        category: 'video',
        // No earnedAt date
      },
    ];

    render(
      <BadgesPage
        badges={badgeWithoutDate}
        totalEarned={1}
        onBackToDashboard={mockOnBackToDashboard}
      />
    );

    expect(screen.getByText('Test Badge')).toBeInTheDocument();
    // Should not show newly earned indicator since no earnedAt date
    expect(screen.queryByText(/new badge earned recently/)).not.toBeInTheDocument();
  });

  it('renders trophy shelf layout with multiple shelves', () => {
    // Create more badges to test multiple shelves
    const manyBadges: Badge[] = Array.from({ length: 10 }, (_, i) => ({
      id: `badge${i}`,
      name: `Badge ${i + 1}`,
      icon: '🏆',
      category: 'video' as const,
      earnedAt: new Date(),
    }));

    render(
      <BadgesPage
        badges={manyBadges}
        totalEarned={10}
        onBackToDashboard={mockOnBackToDashboard}
      />
    );

    // Should display all badges
    expect(screen.getByText('Badge 1')).toBeInTheDocument();
    expect(screen.getByText('Badge 10')).toBeInTheDocument();
    expect(screen.getByText("You've earned 10 amazing badges!")).toBeInTheDocument();
  });
});