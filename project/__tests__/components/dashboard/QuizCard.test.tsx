import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizCard from '@/components/dashboard/QuizCard';
import { QuizQuestion } from '@/types/dashboard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

const mockQuiz: QuizQuestion = {
  id: 'test-quiz',
  question: 'How many stars are in the sky?',
  timeInVideo: 180,
  correctAnswer: 'option2',
  options: [
    { id: 'option1', text: 'Five stars', gesture: 'jump' },
    { id: 'option2', text: 'Many stars', gesture: 'squat' },
    { id: 'option3', text: 'No stars', gesture: 'clap' }
  ]
};

describe('QuizCard', () => {
  const mockOnAnswer = jest.fn();

  beforeEach(() => {
    mockOnAnswer.mockClear();
  });

  it('renders quiz question and title', () => {
    render(<QuizCard quiz={mockQuiz} onAnswer={mockOnAnswer} />);
    
    expect(screen.getByText('Quiz Time! 🎯')).toBeInTheDocument();
    expect(screen.getByText('How many stars are in the sky?')).toBeInTheDocument();
  });

  it('renders mascot image with correct attributes', () => {
    render(<QuizCard quiz={mockQuiz} onAnswer={mockOnAnswer} />);
    
    const mascotImage = screen.getByAltText('Friendly mascot');
    expect(mascotImage).toBeInTheDocument();
    expect(mascotImage).toHaveAttribute('src', '/images/animals/smiling_mascot.png');
    expect(mascotImage).toHaveClass('w-24', 'h-24');
  });

  it('passes quiz options to AnswerOptions component', () => {
    render(<QuizCard quiz={mockQuiz} onAnswer={mockOnAnswer} />);
    
    // Check that all options are rendered
    expect(screen.getByText('Five stars')).toBeInTheDocument();
    expect(screen.getByText('Many stars')).toBeInTheDocument();
    expect(screen.getByText('No stars')).toBeInTheDocument();
  });

  it('passes onAnswer callback to AnswerOptions', () => {
    render(<QuizCard quiz={mockQuiz} onAnswer={mockOnAnswer} />);
    
    const firstOption = screen.getByText('Five stars').closest('button');
    fireEvent.click(firstOption!);
    
    expect(mockOnAnswer).toHaveBeenCalledWith('option1');
  });

  it('applies correct styling classes', () => {
    const { container } = render(<QuizCard quiz={mockQuiz} onAnswer={mockOnAnswer} />);
    
    const card = container.firstChild;
    expect(card).toHaveClass('bg-white', 'rounded-3xl', 'p-8', 'shadow-2xl');
  });
});