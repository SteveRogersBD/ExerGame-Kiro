import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompletionScreen from '@/components/dashboard/CompletionScreen';
import { Badge } from '@/types/dashboard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('CompletionScreen', () => {
  const mockBadge: Badge = {
    id: 'test-badge',
    name: 'Math Master',
    icon: '🔢',
    category: 'video',
    earnedAt: new Date()
  };

  const defaultProps = {
    score: 8,
    totalQuestions: 10,
    earnedBadge: mockBadge,
    onBackToDashboard: jest.fn(),
    isVisible: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders completion screen when visible', async () => {
    render(<CompletionScreen {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('🎉 Well Done! 🎉')).toBeInTheDocument();
    });
    expect(screen.getByText('8/10')).toBeInTheDocument();
    expect(screen.getByText('🏠 Back to Dashboard')).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    render(<CompletionScreen {...defaultProps} isVisible={false} />);
    
    expect(screen.queryByText('🎉 Well Done! 🎉')).not.toBeInTheDocument();
  });

  it('displays the happy tiger mascot', async () => {
    render(<CompletionScreen {...defaultProps} />);
    
    await waitFor(() => {
      const mascotImage = screen.getByAltText('Happy Tiger Mascot');
      expect(mascotImage).toBeInTheDocument();
      expect(mascotImage).toHaveAttribute('src', '/images/mascots/happy_tiger.png');
    });
  });

  it('shows the correct score', async () => {
    render(<CompletionScreen {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('8/10')).toBeInTheDocument();
    });
  });

  it('displays the earned badge information', async () => {
    render(<CompletionScreen {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('🏆 You Earned a Badge! 🏆')).toBeInTheDocument();
    });
    expect(screen.getByText('Math Master')).toBeInTheDocument();
    expect(screen.getByText('🔢')).toBeInTheDocument();
  });

  it('calls onBackToDashboard when back button is clicked', async () => {
    const mockOnBack = jest.fn();
    render(<CompletionScreen {...defaultProps} onBackToDashboard={mockOnBack} />);
    
    await waitFor(() => {
      const backButton = screen.getByText('🏠 Back to Dashboard');
      fireEvent.click(backButton);
    });
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  describe('encouragement messages based on score', () => {
    it('shows "Amazing work!" for 90%+ scores', async () => {
      render(<CompletionScreen {...defaultProps} score={9} totalQuestions={10} />);
      
      await waitFor(() => {
        expect(screen.getByText("Amazing work! You're a superstar! 🌟")).toBeInTheDocument();
      });
    });

    it('shows "Great job!" for 70-89% scores', async () => {
      render(<CompletionScreen {...defaultProps} score={7} totalQuestions={10} />);
      
      await waitFor(() => {
        expect(screen.getByText('Great job! You did fantastic! 🎉')).toBeInTheDocument();
      });
    });

    it('shows "Good work!" for 50-69% scores', async () => {
      render(<CompletionScreen {...defaultProps} score={5} totalQuestions={10} />);
      
      await waitFor(() => {
        expect(screen.getByText('Good work! Keep practicing! 👏')).toBeInTheDocument();
      });
    });

    it('shows "Nice try!" for below 50% scores', async () => {
      render(<CompletionScreen {...defaultProps} score={3} totalQuestions={10} />);
      
      await waitFor(() => {
        expect(screen.getByText("Nice try! You're getting better! 💪")).toBeInTheDocument();
      });
    });
  });

  describe('score colors', () => {
    it('applies green color for 90%+ scores', async () => {
      render(<CompletionScreen {...defaultProps} score={9} totalQuestions={10} />);
      
      await waitFor(() => {
        const scoreElement = screen.getByText('9/10');
        expect(scoreElement).toHaveClass('text-green-500');
      });
    });

    it('applies blue color for 70-89% scores', async () => {
      render(<CompletionScreen {...defaultProps} score={7} totalQuestions={10} />);
      
      await waitFor(() => {
        const scoreElement = screen.getByText('7/10');
        expect(scoreElement).toHaveClass('text-blue-500');
      });
    });

    it('applies yellow color for 50-69% scores', async () => {
      render(<CompletionScreen {...defaultProps} score={5} totalQuestions={10} />);
      
      await waitFor(() => {
        const scoreElement = screen.getByText('5/10');
        expect(scoreElement).toHaveClass('text-yellow-500');
      });
    });

    it('applies orange color for below 50% scores', async () => {
      render(<CompletionScreen {...defaultProps} score={3} totalQuestions={10} />);
      
      await waitFor(() => {
        const scoreElement = screen.getByText('3/10');
        expect(scoreElement).toHaveClass('text-orange-500');
      });
    });
  });

  it('has proper accessibility attributes', async () => {
    render(<CompletionScreen {...defaultProps} />);
    
    await waitFor(() => {
      const backButton = screen.getByRole('button', { name: /back to dashboard/i });
      expect(backButton).toBeInTheDocument();
      
      const mascotImage = screen.getByRole('img', { name: /happy tiger mascot/i });
      expect(mascotImage).toBeInTheDocument();
    });
  });

  it('uses child-friendly font classes', async () => {
    render(<CompletionScreen {...defaultProps} />);
    
    await waitFor(() => {
      const title = screen.getByText('🎉 Well Done! 🎉');
      expect(title).toHaveClass('font-fredoka');
      
      const backButton = screen.getByText('🏠 Back to Dashboard');
      expect(backButton).toHaveClass('font-fredoka');
    });
  });

  it('has large touch-friendly button size', async () => {
    render(<CompletionScreen {...defaultProps} />);
    
    await waitFor(() => {
      const backButton = screen.getByText('🏠 Back to Dashboard');
      expect(backButton).toHaveClass('min-h-[60px]');
      expect(backButton).toHaveClass('min-w-[200px]');
    });
  });

  describe('different badge categories', () => {
    it('displays homework badge correctly', async () => {
      const homeworkBadge: Badge = {
        id: 'hw-badge',
        name: 'Homework Hero',
        icon: '📚',
        category: 'homework'
      };
      
      render(<CompletionScreen {...defaultProps} earnedBadge={homeworkBadge} />);
      
      await waitFor(() => {
        expect(screen.getByText('Homework Hero')).toBeInTheDocument();
        expect(screen.getByText('📚')).toBeInTheDocument();
      });
    });

    it('displays streak badge correctly', async () => {
      const streakBadge: Badge = {
        id: 'streak-badge',
        name: 'Streak Master',
        icon: '🔥',
        category: 'streak'
      };
      
      render(<CompletionScreen {...defaultProps} earnedBadge={streakBadge} />);
      
      await waitFor(() => {
        expect(screen.getByText('Streak Master')).toBeInTheDocument();
        expect(screen.getByText('🔥')).toBeInTheDocument();
      });
    });
  });

  it('handles perfect score correctly', async () => {
    render(<CompletionScreen {...defaultProps} score={10} totalQuestions={10} />);
    
    await waitFor(() => {
      expect(screen.getByText('10/10')).toBeInTheDocument();
      expect(screen.getByText("Amazing work! You're a superstar! 🌟")).toBeInTheDocument();
    });
  });

  it('handles zero score correctly', async () => {
    render(<CompletionScreen {...defaultProps} score={0} totalQuestions={10} />);
    
    await waitFor(() => {
      expect(screen.getByText('0/10')).toBeInTheDocument();
      expect(screen.getByText("Nice try! You're getting better! 💪")).toBeInTheDocument();
    });
  });
});