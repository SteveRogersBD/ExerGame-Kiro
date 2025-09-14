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
  id: 'test-quiz',
  question: 'What color is the sky?',
  timeInVideo: 120,
  correctAnswer: 'option1',
  options: [
    { id: 'option1', text: 'Blue', gesture: 'jump' },
    { id: 'option2', text: 'Red', gesture: 'squat' },
    { id: 'option3', text: 'Green', gesture: 'clap' }
  ]
};

describe('QuizOverlay', () => {
  const mockOnAnswer = jest.fn();

  beforeEach(() => {
    mockOnAnswer.mockClear();
  });

  it('renders nothing when quiz is null', () => {
    const { container } = render(
      <QuizOverlay quiz={null} isVisible={true} onAnswer={mockOnAnswer} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when not visible', () => {
    const { container } = render(
      <QuizOverlay quiz={mockQuiz} isVisible={false} onAnswer={mockOnAnswer} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders quiz overlay when visible and quiz provided', () => {
    render(
      <QuizOverlay quiz={mockQuiz} isVisible={true} onAnswer={mockOnAnswer} />
    );
    
    expect(screen.getByText('Quiz Time! 🎯')).toBeInTheDocument();
    expect(screen.getByText('What color is the sky?')).toBeInTheDocument();
  });

  it('renders all answer options', () => {
    render(
      <QuizOverlay quiz={mockQuiz} isVisible={true} onAnswer={mockOnAnswer} />
    );
    
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();
  });

  it('calls onAnswer when an option is clicked', () => {
    render(
      <QuizOverlay quiz={mockQuiz} isVisible={true} onAnswer={mockOnAnswer} />
    );
    
    const blueOption = screen.getByText('Blue').closest('button');
    fireEvent.click(blueOption!);
    
    expect(mockOnAnswer).toHaveBeenCalledWith('option1');
  });

  it('displays gesture instructions for each option', () => {
    render(
      <QuizOverlay quiz={mockQuiz} isVisible={true} onAnswer={mockOnAnswer} />
    );
    
    expect(screen.getByText('jump')).toBeInTheDocument();
    expect(screen.getByText('squat')).toBeInTheDocument();
    expect(screen.getByText('clap')).toBeInTheDocument();
  });

  it('displays mascot image', () => {
    render(
      <QuizOverlay quiz={mockQuiz} isVisible={true} onAnswer={mockOnAnswer} />
    );
    
    const mascotImage = screen.getByAltText('Friendly mascot');
    expect(mascotImage).toBeInTheDocument();
    expect(mascotImage).toHaveAttribute('src', '/images/animals/smiling_mascot.png');
  });
});