import { renderHook, act, waitFor } from '@testing-library/react';
import { useOfflineDetection, useKidsOfflineDetection } from '../../hooks/useOfflineDetection';

// Mock fetch for ping functionality
global.fetch = jest.fn();

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

// Mock window event listeners
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
});
Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
});

describe('useOfflineDetection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (navigator as any).onLine = true;
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Basic functionality', () => {
    it('initializes with online state when navigator.onLine is true', () => {
      const { result } = renderHook(() => useOfflineDetection());
      
      expect(result.current.isOnline).toBe(true);
      expect(result.current.isOffline).toBe(false);
      expect(result.current.wasOffline).toBe(false);
    });

    it('initializes with offline state when navigator.onLine is false', () => {
      (navigator as any).onLine = false;
      
      const { result } = renderHook(() => useOfflineDetection());
      
      expect(result.current.isOnline).toBe(false);
      expect(result.current.isOffline).toBe(true);
    });

    it('sets up event listeners on mount', () => {
      renderHook(() => useOfflineDetection());
      
      expect(mockAddEventListener).toHaveBeenCalledWith('online', expect.any(Function));
      expect(mockAddEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
    });

    it('removes event listeners on unmount', () => {
      const { unmount } = renderHook(() => useOfflineDetection());
      
      unmount();
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith('online', expect.any(Function));
      expect(mockRemoveEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
    });
  });

  describe('Event handling', () => {
    it('calls onOnline callback when going online', () => {
      const onOnline = jest.fn();
      const { result } = renderHook(() => useOfflineDetection({ onOnline }));
      
      // Simulate going online
      act(() => {
        const onlineHandler = mockAddEventListener.mock.calls.find(
          call => call[0] === 'online'
        )?.[1];
        onlineHandler?.();
      });
      
      expect(onOnline).toHaveBeenCalledTimes(1);
      expect(result.current.isOnline).toBe(true);
      expect(result.current.lastOnlineTime).toBeInstanceOf(Date);
    });

    it('calls onOffline callback when going offline', () => {
      const onOffline = jest.fn();
      const { result } = renderHook(() => useOfflineDetection({ onOffline }));
      
      // Simulate going offline
      act(() => {
        const offlineHandler = mockAddEventListener.mock.calls.find(
          call => call[0] === 'offline'
        )?.[1];
        offlineHandler?.();
      });
      
      expect(onOffline).toHaveBeenCalledTimes(1);
      expect(result.current.isOffline).toBe(true);
      expect(result.current.lastOfflineTime).toBeInstanceOf(Date);
    });

    it('updates wasOffline flag correctly', () => {
      const { result } = renderHook(() => useOfflineDetection());
      
      // Go offline first
      act(() => {
        const offlineHandler = mockAddEventListener.mock.calls.find(
          call => call[0] === 'offline'
        )?.[1];
        offlineHandler?.();
      });
      
      expect(result.current.isOffline).toBe(true);
      expect(result.current.wasOffline).toBe(false);
      
      // Then go back online
      act(() => {
        const onlineHandler = mockAddEventListener.mock.calls.find(
          call => call[0] === 'online'
        )?.[1];
        onlineHandler?.();
      });
      
      expect(result.current.isOnline).toBe(true);
      expect(result.current.wasOffline).toBe(true);
    });
  });

  describe('Ping functionality', () => {
    it('does not ping when enablePing is false', () => {
      renderHook(() => useOfflineDetection({ enablePing: false }));
      
      expect(fetch).not.toHaveBeenCalled();
    });

    it('pings server when enablePing is true', async () => {
      jest.useFakeTimers();
      (fetch as jest.Mock).mockResolvedValue({ ok: true });
      
      renderHook(() => useOfflineDetection({ 
        enablePing: true, 
        pingInterval: 1000 
      }));
      
      // Fast-forward time to trigger ping
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/ping', expect.any(Object));
      });
      
      jest.useRealTimers();
    });

    it('uses custom ping URL when provided', async () => {
      jest.useFakeTimers();
      (fetch as jest.Mock).mockResolvedValue({ ok: true });
      
      renderHook(() => useOfflineDetection({ 
        enablePing: true, 
        pingUrl: '/custom/ping',
        pingInterval: 1000 
      }));
      
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/custom/ping', expect.any(Object));
      });
      
      jest.useRealTimers();
    });
  });

  describe('Utility methods', () => {
    it('calculates offline duration correctly', () => {
      jest.useFakeTimers();
      const now = new Date();
      jest.setSystemTime(now);
      
      const { result } = renderHook(() => useOfflineDetection());
      
      // Go offline
      act(() => {
        const offlineHandler = mockAddEventListener.mock.calls.find(
          call => call[0] === 'offline'
        )?.[1];
        offlineHandler?.();
      });
      
      // Advance time by 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      
      expect(result.current.getOfflineDuration()).toBe(5000);
      
      jest.useRealTimers();
    });

    it('returns 0 offline duration when online', () => {
      const { result } = renderHook(() => useOfflineDetection());
      
      expect(result.current.getOfflineDuration()).toBe(0);
    });

    it('provides friendly offline duration message', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useOfflineDetection());
      
      // Go offline
      act(() => {
        const offlineHandler = mockAddEventListener.mock.calls.find(
          call => call[0] === 'offline'
        )?.[1];
        offlineHandler?.();
      });
      
      // Advance time by 65 seconds
      act(() => {
        jest.advanceTimersByTime(65000);
      });
      
      expect(result.current.getOfflineDurationMessage()).toBe('Offline for 1 minute');
      
      jest.useRealTimers();
    });
  });
});

describe('useKidsOfflineDetection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (navigator as any).onLine = true;
  });

  it('provides child-friendly offline messages', () => {
    const { result } = renderHook(() => useKidsOfflineDetection());
    
    // Go offline
    act(() => {
      const offlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'offline'
      )?.[1];
      offlineHandler?.();
    });
    
    const message = result.current.getKidsOfflineMessage();
    expect(message).toContain('internet is taking a little break');
    expect(message).toContain('📡');
  });

  it('provides child-friendly online messages', () => {
    const { result } = renderHook(() => useKidsOfflineDetection());
    
    // Go offline first
    act(() => {
      const offlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'offline'
      )?.[1];
      offlineHandler?.();
    });
    
    // Then go back online
    act(() => {
      const onlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'online'
      )?.[1];
      onlineHandler?.();
    });
    
    const message = result.current.getKidsOnlineMessage();
    expect(message).toContain('internet is back');
    expect(message).toContain('🌐✨');
  });

  it('shows offline message when offline', () => {
    const { result } = renderHook(() => useKidsOfflineDetection());
    
    // Go offline
    act(() => {
      const offlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'offline'
      )?.[1];
      offlineHandler?.();
    });
    
    expect(result.current.showOfflineMessage).toBe(true);
    expect(result.current.offlineMessageType).toBe('initial');
  });

  it('changes to extended message after timeout', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useKidsOfflineDetection());
    
    // Go offline
    act(() => {
      const offlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'offline'
      )?.[1];
      offlineHandler?.();
    });
    
    expect(result.current.offlineMessageType).toBe('initial');
    
    // Fast-forward past the timeout
    act(() => {
      jest.advanceTimersByTime(30000);
    });
    
    expect(result.current.offlineMessageType).toBe('extended');
    
    jest.useRealTimers();
  });

  it('provides appropriate status message', () => {
    const { result } = renderHook(() => useKidsOfflineDetection());
    
    // Initially online, no status message
    expect(result.current.statusMessage).toBeNull();
    
    // Go offline
    act(() => {
      const offlineHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'offline'
      )?.[1];
      offlineHandler?.();
    });
    
    expect(result.current.statusMessage).toContain('internet is taking a little break');
  });
});