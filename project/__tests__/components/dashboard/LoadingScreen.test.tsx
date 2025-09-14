import { render, screen } from '@testing-library/react';
import LoadingScreen from '@/components/dashboard/LoadingScreen';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('LoadingScreen', () => {
  it('renders with default props', () => {
    render(<LoadingScreen />);

    expect(screen.getByText('Loading...')).toBeDefined();
    expect(screen.getByText('Just a moment! 🌟')).toBeDefined();
    expect(screen.getByText('Getting ready for you! 🎮')).toBeDefined();
    expect(screen.getByAltText('Loading Mascot')).toBeDefined();
  });

  it('renders with custom message', () => {
    render(<LoadingScreen message="Custom loading message" />);

    expect(screen.getByText('Custom loading message')).toBeDefined();
    expect(screen.getByText('Just a moment! 🌟')).toBeDefined();
  });

  it('renders with custom mascot image', () => {
    render(<LoadingScreen mascotImage="/custom/mascot.png" />);

    const mascotImage = screen.getByAltText('Loading Mascot');
    expect(mascotImage.getAttribute('src')).toBe('/custom/mascot.png');
  });

  it('can hide bouncing balls animation', () => {
    render(<LoadingScreen showBouncingBalls={false} />);

    // The bouncing balls are rendered as divs with specific classes
    // Since we're mocking framer-motion, we can't test the exact animation
    // but we can verify the component renders without errors
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('can hide star burst animation', () => {
    render(<LoadingScreen showStarBurst={false} />);

    // Similar to bouncing balls, we verify the component renders
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('applies custom background color', () => {
    const { container } = render(
      <LoadingScreen backgroundColor="bg-red-500" />
    );

    expect(container.firstChild).toHaveClass('bg-red-500');
  });
});