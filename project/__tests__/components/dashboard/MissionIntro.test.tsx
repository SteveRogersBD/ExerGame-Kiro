import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MissionIntro from '@/components/dashboard/MissionIntro';
import { HomeworkItem } from '@/types/dashboard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

const mockHomework: HomeworkItem = {
  id: 'h1',
  title: 'Dora Episode Quiz',
  icon: '🗺️',
  status: 'not_started',
  assignedBy: 'Mom',
  dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  video: {
    id: 'h1v1',
    title: 'Dora the Explorer - Map Reading',
    thumbnail: '/images/content/dora-thumb.jpg',
    url: 'https://youtube.com/watch?v=dora-placeholder',
    duration: 480, // 8 minutes
    quizQuestions: [
      {
        id: 'hq1',
        question: 'Which direction should we go?',
        timeInVideo: 240,
        options: [
          { id: 'ha1', text: 'Left path', gesture: 'jump' },
          { id: 'ha2', text: 'Right path', gesture: 'squat' },
          { id: 'ha3', text: 'Straight ahead', gesture: 'clap' }
        ],
        correctAnswer: 'ha2'
      }
    ],
    completionReward: {
      id: 'hb1',
      name: 'Explorer Badge',
      icon: '🧭',
      category: 'homework'
    }
  }
};

describe('MissionIntro Component', () => {
  const mockOnStartMission = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the mission intro with homework details', () => {
    render(
      <MissionIntro
        homework={mockHomework}
        onStartMission={mockOnStartMission}
        onBack={mockOnBack}
      />
    );

    // Check for mascot message
    expect(screen.getByText("Here's today's homework! 📚")).toBeInTheDocument();
    expect(screen.getByText('Let\'s make learning fun together!')).toBeInTheDocument();

    // Check for homework title and assignment info
    expect(screen.getByText('Dora Episode Quiz')).toBeInTheDocument();
    expect(screen.getByText('Assigned by Mom')).toBeInTheDocument();

    // Check for mission info cards
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('8:00')).toBeInTheDocument(); // 480 seconds = 8:00
    expect(screen.getByText('Quiz Questions')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 quiz question
    expect(screen.getByText('Due Date')).toBeInTheDocument();

    // Check for reward preview
    expect(screen.getByText('Complete this mission to earn:')).toBeInTheDocument();
    expect(screen.getByText('Explorer Badge')).toBeInTheDocument();

    // Check for action buttons
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Start Mission!')).toBeInTheDocument();
  });

  it('displays the mascot image with correct attributes', () => {
    render(
      <MissionIntro
        homework={mockHomework}
        onStartMission={mockOnStartMission}
        onBack={mockOnBack}
      />
    );

    const mascotImage = screen.getByAltText('Smiling Mascot');
    expect(mascotImage).toBeInTheDocument();
    expect(mascotImage).toHaveAttribute('src', '/images/smiling_mascot.png');
  });

  it('displays homework icon and title correctly', () => {
    render(
      <MissionIntro
        homework={mockHomework}
        onStartMission={mockOnStartMission}
        onBack={mockOnBack}
      />
    );

    // The homework icon should be displayed
    expect(screen.getByText('🗺️')).toBeInTheDocument();
    expect(screen.getByText('Dora Episode Quiz')).toBeInTheDocument();
  });

  it('formats duration correctly', () => {
    const homeworkWithDifferentDuration = {
      ...mockHomework,
      video: {
        ...mockHomework.video,
        duration: 125 // 2 minutes and 5 seconds
      }
    };

    render(
      <MissionIntro
        homework={homeworkWithDifferentDuration}
        onStartMission={mockOnStartMission}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText('2:05')).toBeInTheDocument();
  });

  it('displays correct number of quiz questions', () => {
    const homeworkWithMultipleQuestions = {
      ...mockHomework,
      video: {
        ...mockHomework.video,
        quizQuestions: [
          ...mockHomework.video.quizQuestions,
          {
            id: 'hq2',
            question: 'Another question?',
            timeInVideo: 300,
            options: [
              { id: 'hb1', text: 'Option 1', gesture: 'jump' },
              { id: 'hb2', text: 'Option 2', gesture: 'squat' },
              { id: 'hb3', text: 'Option 3', gesture: 'clap' }
            ],
            correctAnswer: 'hb1'
          }
        ]
      }
    };

    render(
      <MissionIntro
        homework={homeworkWithMultipleQuestions}
        onStartMission={mockOnStartMission}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // 2 quiz questions
  });

  it('handles due date formatting correctly', () => {
    // Test with homework due today
    const homeworkDueToday = {
      ...mockHomework,
      dueDate: new Date() // Today
    };

    render(
      <MissionIntro
        homework={homeworkDueToday}
        onStartMission={mockOnStartMission}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText('Due today')).toBeInTheDocument();
  });

  it('handles homework without due date', () => {
    const homeworkNoDueDate = {
      ...mockHomework,
      dueDate: undefined
    };

    render(
      <MissionIntro
        homework={homeworkNoDueDate}
        onStartMission={mockOnStartMission}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText('No rush!')).toBeInTheDocument();
  });

  it('displays completion reward correctly', () => {
    render(
      <MissionIntro
        homework={mockHomework}
        onStartMission={mockOnStartMission}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText('🧭')).toBeInTheDocument(); // Reward icon
    expect(screen.getByText('Explorer Badge')).toBeInTheDocument(); // Reward name
  });

  it('calls onStartMission when start mission button is clicked', () => {
    render(
      <MissionIntro
        homework={mockHomework}
        onStartMission={mockOnStartMission}
        onBack={mockOnBack}
      />
    );

    const startButton = screen.getByText('Start Mission!');
    fireEvent.click(startButton);

    expect(mockOnStartMission).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when back button is clicked', () => {
    render(
      <MissionIntro
        homework={mockHomework}
        onStartMission={mockOnStartMission}
        onBack={mockOnBack}
      />
    );

    const backButton = screen.getByText('Back to Dashboard');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(
      <MissionIntro
        homework={mockHomework}
        onStartMission={mockOnStartMission}
        onBack={mockOnBack}
      />
    );

    // Check that buttons are accessible
    const startButton = screen.getByText('Start Mission!');
    const backButton = screen.getByText('Back to Dashboard');

    expect(startButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();

    // Check that the mascot image has alt text
    const mascotImage = screen.getByAltText('Smiling Mascot');
    expect(mascotImage).toBeInTheDocument();
  });

  it('renders with different homework statuses', () => {
    const inProgressHomework = {
      ...mockHomework,
      status: 'in_progress' as const
    };

    render(
      <MissionIntro
        homework={inProgressHomework}
        onStartMission={mockOnStartMission}
        onBack={mockOnBack}
      />
    );

    // Component should render regardless of homework status
    expect(screen.getByText("Here's today's homework! 📚")).toBeInTheDocument();
    expect(screen.getByText('Start Mission!')).toBeInTheDocument();
  });
});