import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  KidsLoadingScreen, 
  DashboardLoadingScreen, 
  VideoLoadingScreen, 
  HomeworkLoadingScreen 
} from '../../../components/dashboard/KidsLoadingScreen';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('KidsLoadingScreen', () => {
  describe('General Loading Screen', () => {
    it('renders with default props', () => {
      render(<KidsLoadingScreen />);
      
      expect(screen.getByText(/Loading Something Fun!/)).toBeInTheDocument();
      expect(screen.getByText(/Just a moment while we get things ready!/)).toBeInTheDocument();
      expect(screen.getByAltText('Happy Loading Mascot')).toBeInTheDocument();
    });

    it('renders custom message', () => {
      const customMessage = "Loading your awesome content!";
      render(<KidsLoadingScreen message={customMessage} />);
      
      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('shows bouncing animals by default', () => {
      render(<KidsLoadingScreen />);
      
      // Check for animal emojis
      expect(screen.getByText('🐻')).toBeInTheDocument();
      expect(screen.getByText('🐧')).toBeInTheDocument();
      expect(screen.getByText('🐵')).toBeInTheDocument();
      expect(screen.getByText('🦅')).toBeInTheDocument();
    });

    it('hides bouncing animals when showBouncingAnimals is false', () => {
      render(<KidsLoadingScreen showBouncingAnimals={false} />);
      
      expect(screen.queryByText('🐻')).not.toBeInTheDocument();
      expect(screen.queryByText('🐧')).not.toBeInTheDocument();
    });

    it('shows star burst animation by default', () => {
      render(<KidsLoadingScreen />);
      
      // Check for star emojis
      const stars = screen.getAllByText('⭐');
      expect(stars.length).toBeGreaterThan(0);
    });

    it('hides star burst when showStarBurst is false', () => {
      render(<KidsLoadingScreen showStarBurst={false} />);
      
      expect(screen.queryByText('⭐')).not.toBeInTheDocument();
    });

    it('shows encouraging messages by default', () => {
      render(<KidsLoadingScreen />);
      
      expect(screen.getByText(/Almost there!/)).toBeInTheDocument();
      expect(screen.getByText(/You're going to have so much fun!/)).toBeInTheDocument();
    });

    it('hides encouraging messages when showEncouragingMessages is false', () => {
      render(<KidsLoadingScreen showEncouragingMessages={false} />);
      
      expect(screen.queryByText(/Almost there!/)).not.toBeInTheDocument();
    });
  });

  describe('Dashboard Loading Screen', () => {
    it('renders dashboard-specific content', () => {
      render(<DashboardLoadingScreen />);
      
      expect(screen.getByText(/Getting Your Playground Ready!/)).toBeInTheDocument();
      expect(screen.getByText(/We're setting up all your fun activities!/)).toBeInTheDocument();
    });

    it('uses smiling mascot for dashboard loading', () => {
      render(<DashboardLoadingScreen />);
      
      const mascotImage = screen.getByAltText('Happy Loading Mascot');
      expect(mascotImage).toHaveAttribute('src', '/images/mascots/smilling_mascot.png');
    });

    it('renders custom message for dashboard loading', () => {
      const customMessage = "Setting up your special dashboard!";
      render(<DashboardLoadingScreen message={customMessage} />);
      
      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });
  });

  describe('Video Loading Screen', () => {
    it('renders video-specific content', () => {
      render(<VideoLoadingScreen />);
      
      expect(screen.getByText(/Starting Your Video!/)).toBeInTheDocument();
      expect(screen.getByText(/Get ready for an amazing adventure!/)).toBeInTheDocument();
    });

    it('uses happy tiger mascot for video loading', () => {
      render(<VideoLoadingScreen />);
      
      const mascotImage = screen.getByAltText('Happy Loading Mascot');
      expect(mascotImage).toHaveAttribute('src', '/images/mascots/happy_tiger.png');
    });

    it('shows video-specific encouraging messages', () => {
      render(<VideoLoadingScreen />);
      
      expect(screen.getByText(/The video is almost ready!/)).toBeInTheDocument();
      expect(screen.getByText(/Get ready to have fun!/)).toBeInTheDocument();
    });
  });

  describe('Homework Loading Screen', () => {
    it('renders homework-specific content', () => {
      render(<HomeworkLoadingScreen />);
      
      expect(screen.getByText(/Preparing Your Mission!/)).toBeInTheDocument();
      expect(screen.getByText(/Let's get ready for your learning adventure!/)).toBeInTheDocument();
    });

    it('shows homework-specific encouraging messages', () => {
      render(<HomeworkLoadingScreen />);
      
      expect(screen.getByText(/Your mission is loading!/)).toBeInTheDocument();
      expect(screen.getByText(/Learning can be fun!/)).toBeInTheDocument();
      expect(screen.getByText(/You're going to do great!/)).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('displays loading progress dots', () => {
      render(<KidsLoadingScreen />);
      
      // Check for loading dots (they should be rendered as divs with specific classes)
      const loadingContainer = screen.getByText(/You're going to have so much fun!/).closest('div');
      expect(loadingContainer).toBeInTheDocument();
    });

    it('includes sparkle and bubble animations', () => {
      render(<KidsLoadingScreen />);
      
      // Check for sparkle emoji
      expect(screen.getAllByText('✨').length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('has proper alt text for mascot image', () => {
      render(<KidsLoadingScreen />);
      
      const mascotImage = screen.getByAltText('Happy Loading Mascot');
      expect(mascotImage).toBeInTheDocument();
    });

    it('has proper heading structure', () => {
      render(<KidsLoadingScreen />);
      
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/Loading Something Fun!/);
    });

    it('uses descriptive text for screen readers', () => {
      render(<KidsLoadingScreen />);
      
      expect(screen.getByText(/Just a moment while we get things ready!/)).toBeInTheDocument();
    });
  });

  describe('Child-Friendly Language', () => {
    it('uses encouraging and positive language', () => {
      render(<KidsLoadingScreen />);
      
      expect(screen.getByText(/You're going to have so much fun!/)).toBeInTheDocument();
      expect(screen.getByText(/Almost there!/)).toBeInTheDocument();
    });

    it('includes fun emojis in messages', () => {
      render(<VideoLoadingScreen />);
      
      expect(screen.getByText(/🎬/)).toBeInTheDocument();
      expect(screen.getByText(/🎥/)).toBeInTheDocument();
    });

    it('uses simple, child-appropriate vocabulary', () => {
      render(<KidsLoadingScreen />);
      
      expect(screen.getByText(/Loading Something Fun!/)).toBeInTheDocument();
      expect(screen.getByText(/Just a moment while we get things ready!/)).toBeInTheDocument();
    });

    it('creates excitement and anticipation', () => {
      render(<HomeworkLoadingScreen />);
      
      expect(screen.getByText(/Preparing Your Mission!/)).toBeInTheDocument();
      expect(screen.getByText(/Let's get ready for your learning adventure!/)).toBeInTheDocument();
    });
  });
});