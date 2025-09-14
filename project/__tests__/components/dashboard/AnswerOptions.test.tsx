import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnswerOptions from '@/components/dashboard/AnswerOptions';
import { QuizOption } from '@/types/dashboard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, className, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = props;
      return <button onClick={onClick} className={className} {...domProps}>{children}</button>;
    },
    span: ({ children, className, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = props;
      return <span className={className} {...domProps}>{children}</span>;
    },
  },
}));

const mockOptions: QuizOption[] = [
  { id: 'opt1', text: 'Jump high', gesture: 'jump' },
  { id: 'opt2', text: 'Squat low', gesture: 'squat' },
  { id: 'opt3', text: 'Clap hands', gesture: 'clap' }
];

describe('AnswerOptions', () => {
  const mockOnAnswer = jest.fn();

  beforeEach(() => {
    mockOnAnswer.mockClear();
  });

  it('renders all answer options', () => {
    render(<AnswerOptions options={mockOptions} onAnswer={mockOnAnswer} />);
    
    expect(screen.getByText('Jump high')).toBeInTheDocument();
    expect(screen.getByText('Squat low')).toBeInTheDocument();
    expect(screen.getByText('Clap hands')).toBeInTheDocument();
  });

  it('displays correct gesture emojis', () => {
    render(<AnswerOptions options={mockOptions} onAnswer={mockOnAnswer} />);
    
    // Check for gesture emojis (they should be in the document)
    expect(screen.getByText('🦘')).toBeInTheDocument(); // jump
    expect(screen.getByText('🐸')).toBeInTheDocument(); // squat
    expect(screen.getByText('👏')).toBeInTheDocument(); // clap
  });

  it('displays gesture names', () => {
    render(<AnswerOptions options={mockOptions} onAnswer={mockOnAnswer} />);
    
    expect(screen.getByText('jump')).toBeInTheDocument();
    expect(screen.getByText('squat')).toBeInTheDocument();
    expect(screen.getByText('clap')).toBeInTheDocument();
  });

  it('displays "Try this move!" text for each option', () => {
    render(<AnswerOptions options={mockOptions} onAnswer={mockOnAnswer} />);
    
    const tryThisMoveTexts = screen.getAllByText('Try this move!');
    expect(tryThisMoveTexts).toHaveLength(3);
  });

  it('calls onAnswer with correct option id when clicked', () => {
    render(<AnswerOptions options={mockOptions} onAnswer={mockOnAnswer} />);
    
    const jumpButton = screen.getByText('Jump high').closest('button');
    const squatButton = screen.getByText('Squat low').closest('button');
    const clapButton = screen.getByText('Clap hands').closest('button');
    
    fireEvent.click(jumpButton!);
    expect(mockOnAnswer).toHaveBeenCalledWith('opt1');
    
    fireEvent.click(squatButton!);
    expect(mockOnAnswer).toHaveBeenCalledWith('opt2');
    
    fireEvent.click(clapButton!);
    expect(mockOnAnswer).toHaveBeenCalledWith('opt3');
  });

  it('applies correct color classes for different gestures', () => {
    render(<AnswerOptions options={mockOptions} onAnswer={mockOnAnswer} />);
    
    const jumpButton = screen.getByText('Jump high').closest('button');
    const squatButton = screen.getByText('Squat low').closest('button');
    const clapButton = screen.getByText('Clap hands').closest('button');
    
    expect(jumpButton).toHaveClass('from-green-400', 'to-emerald-500');
    expect(squatButton).toHaveClass('from-blue-400', 'to-cyan-500');
    expect(clapButton).toHaveClass('from-yellow-400', 'to-orange-500');
  });

  it('renders empty grid when no options provided', () => {
    const { container } = render(<AnswerOptions options={[]} onAnswer={mockOnAnswer} />);
    
    const grid = container.firstChild;
    expect(grid).toHaveClass('grid', 'gap-4');
    expect(grid?.children).toHaveLength(0);
  });
});