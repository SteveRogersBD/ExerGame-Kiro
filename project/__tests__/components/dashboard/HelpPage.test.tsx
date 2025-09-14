import { render, screen, fireEvent } from '@testing-library/react';
import HelpPage from '@/components/dashboard/HelpPage';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, whileHover, whileTap, ...props }: any) => 
      <div {...props}>{children}</div>,
    button: ({ children, initial, animate, transition, whileHover, whileTap, onClick, ...props }: any) => 
      <button onClick={onClick} {...props}>{children}</button>,
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

describe('HelpPage', () => {
  const mockOnBackToDashboard = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the help page with title and mascot guidance', () => {
    render(<HelpPage onBackToDashboard={mockOnBackToDashboard} />);
    
    expect(screen.getByText('❓ Need Help? We\'re Here! ❓')).toBeInTheDocument();
    expect(screen.getByText('Let our friendly mascots show you around!')).toBeInTheDocument();
  });

  it('displays all help items with mascot images and speech bubbles', () => {
    render(<HelpPage onBackToDashboard={mockOnBackToDashboard} />);
    
    // Check for help item titles
    expect(screen.getByText('How to Watch Videos')).toBeInTheDocument();
    expect(screen.getByText('Doing Your Homework')).toBeInTheDocument();
    expect(screen.getByText('Earning Badges')).toBeInTheDocument();
    expect(screen.getByText('Getting Around')).toBeInTheDocument();
    expect(screen.getByText('Feeling Confused?')).toBeInTheDocument();
    
    // Check for speech bubbles
    expect(screen.getByText('Tap here to start!')).toBeInTheDocument();
    expect(screen.getByText('Let\'s do homework together!')).toBeInTheDocument();
    expect(screen.getByText('Great job! You finished your video!')).toBeInTheDocument();
    expect(screen.getByText('These buttons will help you explore!')).toBeInTheDocument();
    expect(screen.getByText('Don\'t worry, you\'re doing great!')).toBeInTheDocument();
  });

  it('displays mascot images for each help item', () => {
    render(<HelpPage onBackToDashboard={mockOnBackToDashboard} />);
    
    // Check for mascot images
    expect(screen.getByAltText('How to Watch Videos mascot')).toBeInTheDocument();
    expect(screen.getByAltText('Doing Your Homework mascot')).toBeInTheDocument();
    expect(screen.getByAltText('Earning Badges mascot')).toBeInTheDocument();
    expect(screen.getByAltText('Getting Around mascot')).toBeInTheDocument();
    expect(screen.getByAltText('Feeling Confused? mascot')).toBeInTheDocument();
  });

  it('displays contextual help explanations for dashboard features', () => {
    render(<HelpPage onBackToDashboard={mockOnBackToDashboard} />);
    
    // Check for detailed explanations
    expect(screen.getByText(/Tap on any video card to start watching/)).toBeInTheDocument();
    expect(screen.getByText(/Look for the 📚 Homework section/)).toBeInTheDocument();
    expect(screen.getByText(/Complete videos and homework to earn cool badges/)).toBeInTheDocument();
    expect(screen.getByText(/Use the big buttons at the bottom/)).toBeInTheDocument();
    expect(screen.getByText(/Ask a grown-up for help/)).toBeInTheDocument();
  });

  it('renders back to dashboard button and calls callback when clicked', () => {
    render(<HelpPage onBackToDashboard={mockOnBackToDashboard} />);
    
    const backButton = screen.getByText('🏠 Back to Dashboard');
    expect(backButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    expect(mockOnBackToDashboard).toHaveBeenCalledTimes(1);
  });

  it('displays encouragement section with mascot', () => {
    render(<HelpPage onBackToDashboard={mockOnBackToDashboard} />);
    
    expect(screen.getByText('Still Need Help?')).toBeInTheDocument();
    expect(screen.getByText('Ask a grown-up to help you, or just explore and have fun!')).toBeInTheDocument();
    expect(screen.getByText('🌟 You\'re doing great! 🌟')).toBeInTheDocument();
    expect(screen.getByAltText('Happy mascot')).toBeInTheDocument();
  });

  it('renders without onBackToDashboard callback', () => {
    render(<HelpPage />);
    
    const backButton = screen.getByText('🏠 Back to Dashboard');
    expect(backButton).toBeInTheDocument();
    
    // Should not throw error when clicked without callback
    fireEvent.click(backButton);
  });

  it('displays proper icons for each help section', () => {
    render(<HelpPage onBackToDashboard={mockOnBackToDashboard} />);
    
    // Check for emoji icons in the help items by looking for the icon elements
    expect(screen.getByText('🎬')).toBeInTheDocument();
    expect(screen.getByText('📚')).toBeInTheDocument();
    expect(screen.getByText('🎖️')).toBeInTheDocument();
    expect(screen.getByText('🏠')).toBeInTheDocument();
    expect(screen.getByText('🤔')).toBeInTheDocument();
  });
});