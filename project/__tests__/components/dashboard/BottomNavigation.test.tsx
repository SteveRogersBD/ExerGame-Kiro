import { render, screen, fireEvent } from '@testing-library/react';
import BottomNavigation from '@/components/dashboard/BottomNavigation';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('BottomNavigation', () => {
  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    mockOnNavigate.mockClear();
  });

  it('renders all navigation buttons', () => {
    render(
      <BottomNavigation 
        currentView="dashboard" 
        onNavigate={mockOnNavigate} 
      />
    );

    expect(screen.getByLabelText('Go to home dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('View your badges and rewards')).toBeInTheDocument();
    expect(screen.getByLabelText('Get help and guidance')).toBeInTheDocument();
  });

  it('highlights the active button correctly', () => {
    render(
      <BottomNavigation 
        currentView="badges" 
        onNavigate={mockOnNavigate} 
      />
    );

    const badgesButton = screen.getByLabelText('View your badges and rewards');
    expect(badgesButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('highlights home button when on dashboard, video, or homework views', () => {
    const { rerender } = render(
      <BottomNavigation 
        currentView="dashboard" 
        onNavigate={mockOnNavigate} 
      />
    );

    let homeButton = screen.getByLabelText('Go to home dashboard');
    expect(homeButton).toHaveAttribute('aria-pressed', 'true');

    rerender(
      <BottomNavigation 
        currentView="video" 
        onNavigate={mockOnNavigate} 
      />
    );

    homeButton = screen.getByLabelText('Go to home dashboard');
    expect(homeButton).toHaveAttribute('aria-pressed', 'true');

    rerender(
      <BottomNavigation 
        currentView="homework" 
        onNavigate={mockOnNavigate} 
      />
    );

    homeButton = screen.getByLabelText('Go to home dashboard');
    expect(homeButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onNavigate when buttons are clicked', () => {
    render(
      <BottomNavigation 
        currentView="dashboard" 
        onNavigate={mockOnNavigate} 
      />
    );

    fireEvent.click(screen.getByLabelText('View your badges and rewards'));
    expect(mockOnNavigate).toHaveBeenCalledWith('badges');

    fireEvent.click(screen.getByLabelText('Get help and guidance'));
    expect(mockOnNavigate).toHaveBeenCalledWith('help');

    fireEvent.click(screen.getByLabelText('Go to home dashboard'));
    expect(mockOnNavigate).toHaveBeenCalledWith('dashboard');
  });

  it('has proper accessibility attributes', () => {
    render(
      <BottomNavigation 
        currentView="dashboard" 
        onNavigate={mockOnNavigate} 
      />
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');

    // Check that all buttons have proper ARIA labels
    expect(screen.getByLabelText('Go to home dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('View your badges and rewards')).toBeInTheDocument();
    expect(screen.getByLabelText('Get help and guidance')).toBeInTheDocument();
  });

  it('meets minimum touch target size requirements', () => {
    render(
      <BottomNavigation 
        currentView="dashboard" 
        onNavigate={mockOnNavigate} 
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      // Check that buttons have minimum size classes for child-friendly interaction
      expect(button).toHaveClass('min-h-[80px]', 'min-w-[80px]');
    });
  });
});