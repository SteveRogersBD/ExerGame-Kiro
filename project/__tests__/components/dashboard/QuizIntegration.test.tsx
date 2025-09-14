import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizOverlay from '@/components/dashboard/QuizOverlay';
import { QuizQuestion } from '@/types/dashboard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = props;
      return <div className={className} {...domProps}>{children}</div>;
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
    button: ({ children, onClick, className, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = props;
      return <button onClick={onClick} className={className} {...domProps}>{children}</button>;
    },
    span: ({ children, className, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = props;
      return <span className={className} {...domProps}>{children}</span>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockQuiz: QuizQuestion = {
  id: 'integration-quiz',
  question: 'What is your favorite animal?',
  timeInVideo: 120,
  correctAnswer: 'option2',
  options: [
    { id: 'option1', text: 'Elephant', gesture: 'jump' },
    { id: 'option2', text: 'Tiger', gesture: 'squat' },
    { id: 'option3', text: 'Monkey', gesture: 'clap' }
  ]
};

describe('Quiz Integration', () => {
  const mockOnAnswer = jest.fn();

  beforeEach(() => {
    mockOnAnswer.mockClear();
  });

  it('renders complete quiz overlay with all components', () => {
    render(
      <QuizOverlay quiz={mockQuiz} isVisible={true} onAnswer={mockOnAnswer} />
    );
    
    // Check QuizCard elements
    expect(screen.getByText('Quiz Time! 🎯')).toBeInTheDocument();
    expect(screen.getByText('What is your favorite animal?')).toBeInTheDocument();
    expect(screen.getByAltText('Friendly mascot')).toBeInTheDocument();
    
    // Check AnswerOptions elements
    expect(screen.getByText('Elephant')).toBeInTheDocument();
    expect(screen.getByText('Tiger')).toBeInTheDocument();
    expect(screen.getByText('Monkey')).toBeInTheDocument();
    
    // Check gesture emojis
    expect(screen.getByText('🦘')).toBeInTheDocument(); // jump
    expect(screen.getByText('🐸')).toBeInTheDocument(); // squat
    expect(screen.getByText('👏')).toBeInTheDocument(); // clap
    
    // Check gesture names
    expect(screen.getByText('jump')).toBeInTheDocument();
    expect(screen.getByText('squat')).toBeInTheDocument();
    expect(screen.getByText('clap')).toBeInTheDocument();
  });

  it('handles answer selection correctly', () => {
    render(
      <QuizOverlay quiz={mockQuiz} isVisible={true} onAnswer={mockOnAnswer} />
    );
    
    // Click on the Tiger option (squat gesture)
    const tigerButton = screen.getByText('Tiger').closest('button');
    fireEvent.click(tigerButton!);
    
    expect(mockOnAnswer).toHaveBeenCalledWith('option2');
  });

  it('displays correct gesture instructions', () => {
    render(
      <QuizOverlay quiz={mockQuiz} isVisible={true} onAnswer={mockOnAnswer} />
    );
    
    // Check that "Try this move!" appears for each option
    const tryThisMoveTexts = screen.getAllByText('Try this move!');
    expect(tryThisMoveTexts).toHaveLength(3);
    
    // Check that gesture names are capitalized correctly
    expect(screen.getByText('jump')).toBeInTheDocument();
    expect(screen.getByText('squat')).toBeInTheDocument();
    expect(screen.getByText('clap')).toBeInTheDocument();
  });

  it('applies correct styling and layout', () => {
    const { container } = render(
      <QuizOverlay quiz={mockQuiz} isVisible={true} onAnswer={mockOnAnswer} />
    );
    
    // Check overlay background
    const overlay = container.querySelector('.bg-black\\/80');
    expect(overlay).toBeInTheDocument();
    
    // Check quiz card styling
    const quizCard = container.querySelector('.bg-white.rounded-3xl');
    expect(quizCard).toBeInTheDocument();
    
    // Check button styling for different gestures
    const jumpButton = screen.getByText('Elephant').closest('button');
    const squatButton = screen.getByText('Tiger').closest('button');
    const clapButton = screen.getByText('Monkey').closest('button');
    
    expect(jumpButton).toHaveClass('from-green-400', 'to-emerald-500');
    expect(squatButton).toHaveClass('from-blue-400', 'to-cyan-500');
    expect(clapButton).toHaveClass('from-yellow-400', 'to-orange-500');
  });

  it('shows mascot image with correct attributes', () => {
    render(
      <QuizOverlay quiz={mockQuiz} isVisible={true} onAnswer={mockOnAnswer} />
    );
    
    const mascotImage = screen.getByAltText('Friendly mascot');
    expect(mascotImage).toHaveAttribute('src', '/images/animals/smiling_mascot.png');
    expect(mascotImage).toHaveClass('w-24', 'h-24');
  });
});