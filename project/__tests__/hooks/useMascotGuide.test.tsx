import { renderHook, act } from '@testing-library/react';
import { useMascotGuide } from '../../hooks/useMascotGuide';

describe('useMascotGuide', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('initializes with no guide visible', () => {
    const { result } = renderHook(() => useMascotGuide());
    
    expect(result.current.currentGuide).toBeNull();
    expect(result.current.isVisible).toBe(false);
  });

  it('shows predefined context guide', () => {
    const { result } = renderHook(() => useMascotGuide());
    
    act(() => {
      result.current.showWelcome();
    });
    
    expect(result.current.isVisible).toBe(true);
    expect(result.current.currentGuide).toEqual({
      message: "Welcome to your playground! Let's have some fun!",
      mascotImage: '/images/mascots/happy_tiger.png',
      position: 'center',
      autoHideDelay: 4000,
    });
  });

  it('shows custom guide with message and options', () => {
    const { result } = renderHook(() => useMascotGuide());
    
    act(() => {
      result.current.showCustomGuide('Custom message!', {
        position: 'center',
        mascotImage: '/images/mascots/confused_tiger.png',
      });
    });
    
    expect(result.current.isVisible).toBe(true);
    expect(result.current.currentGuide).toEqual({
      message: 'Custom message!',
      mascotImage: '/images/mascots/confused_tiger.png',
      position: 'center',
      autoHideDelay: 3000,
    });
  });

  it('hides guide and clears state after delay', () => {
    const { result } = renderHook(() => useMascotGuide());
    
    act(() => {
      result.current.showWelcome();
    });
    
    expect(result.current.isVisible).toBe(true);
    
    act(() => {
      result.current.hideGuide();
    });
    
    expect(result.current.isVisible).toBe(false);
    expect(result.current.currentGuide).not.toBeNull(); // Still there during animation
    
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    expect(result.current.currentGuide).toBeNull();
  });

  it('shows error with custom message', () => {
    const { result } = renderHook(() => useMascotGuide());
    
    act(() => {
      result.current.showError('Custom error message');
    });
    
    expect(result.current.isVisible).toBe(true);
    expect(result.current.currentGuide?.message).toBe('Custom error message');
    expect(result.current.currentGuide?.mascotImage).toBe('/images/mascots/sad_tiger.png');
  });

  it('shows error with default message when no custom message provided', () => {
    const { result } = renderHook(() => useMascotGuide());
    
    act(() => {
      result.current.showError();
    });
    
    expect(result.current.isVisible).toBe(true);
    expect(result.current.currentGuide?.message).toBe("Oops! Something went wrong. Let's try again together!");
  });

  it('provides all convenience methods', () => {
    const { result } = renderHook(() => useMascotGuide());
    
    const methods = [
      'showWelcome',
      'showVideoHover',
      'showVideoStart',
      'showHomeworkStart',
      'showQuizCorrect',
      'showQuizIncorrect',
      'showCompletion',
      'showBadgeEarned',
      'showHelp',
      'showError',
      'showLoading',
      'showCustomGuide',
    ];
    
    methods.forEach(method => {
      expect(typeof result.current[method as keyof typeof result.current]).toBe('function');
    });
  });

  it('shows different contexts with correct properties', () => {
    const { result } = renderHook(() => useMascotGuide());
    
    // Test video hover context
    act(() => {
      result.current.showVideoHover();
    });
    
    expect(result.current.currentGuide?.message).toBe("This looks exciting! Tap to start watching!");
    expect(result.current.currentGuide?.position).toBe('corner');
    
    // Test completion context
    act(() => {
      result.current.showCompletion();
    });
    
    expect(result.current.currentGuide?.message).toBe("Amazing work! You completed everything!");
    expect(result.current.currentGuide?.position).toBe('center');
  });

  it('shows badge earned context without auto-hide', () => {
    const { result } = renderHook(() => useMascotGuide());
    
    act(() => {
      result.current.showBadgeEarned();
    });
    
    expect(result.current.currentGuide?.autoHide).toBe(false);
    expect(result.current.currentGuide?.message).toBe("Wow! You earned a new badge! Keep it up!");
  });

  it('shows help context without auto-hide', () => {
    const { result } = renderHook(() => useMascotGuide());
    
    act(() => {
      result.current.showHelp();
    });
    
    expect(result.current.currentGuide?.autoHide).toBe(false);
    expect(result.current.currentGuide?.mascotImage).toBe('/images/mascots/confused_tiger.png');
  });

  it('shows loading context without auto-hide', () => {
    const { result } = renderHook(() => useMascotGuide());
    
    act(() => {
      result.current.showLoading();
    });
    
    expect(result.current.currentGuide?.autoHide).toBe(false);
    expect(result.current.currentGuide?.message).toBe("Getting everything ready for you! Almost there!");
  });

  it('provides access to all contexts', () => {
    const { result } = renderHook(() => useMascotGuide());
    
    expect(result.current.contexts).toBeDefined();
    expect(result.current.contexts.welcome).toBeDefined();
    expect(result.current.contexts.error).toBeDefined();
    expect(result.current.contexts.completion).toBeDefined();
  });

  it('can show guide with direct context object', () => {
    const { result } = renderHook(() => useMascotGuide());
    
    const customGuide = {
      message: 'Direct context test',
      mascotImage: '/images/mascots/happy_tiger.png',
      position: 'center' as const,
      autoHideDelay: 1000,
    };
    
    act(() => {
      result.current.showGuide(customGuide);
    });
    
    expect(result.current.currentGuide).toEqual(customGuide);
    expect(result.current.isVisible).toBe(true);
  });
});