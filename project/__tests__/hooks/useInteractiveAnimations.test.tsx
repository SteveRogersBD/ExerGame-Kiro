import { renderHook } from '@testing-library/react';
import { useInteractiveAnimations } from '@/hooks/useInteractiveAnimations';

// Mock the useReducedMotion hook
jest.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn()
}));

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: jest.fn()
});

describe('useInteractiveAnimations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console.log mock
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns animation variants and utility functions', () => {
    const { useReducedMotion } = require('@/hooks/useReducedMotion');
    useReducedMotion.mockReturnValue(false);

    const { result } = renderHook(() => useInteractiveAnimations());

    expect(result.current).toHaveProperty('buttonVariants');
    expect(result.current).toHaveProperty('wiggleVariants');
    expect(result.current).toHaveProperty('glowVariants');
    expect(result.current).toHaveProperty('pageTransitionVariants');
    expect(result.current).toHaveProperty('bounceVariants');
    expect(result.current).toHaveProperty('pulseVariants');
    expect(result.current).toHaveProperty('playSound');
    expect(result.current).toHaveProperty('triggerHaptic');
    expect(result.current).toHaveProperty('prefersReducedMotion');
  });

  it('provides reduced motion variants when user prefers reduced motion', () => {
    const { useReducedMotion } = require('@/hooks/useReducedMotion');
    useReducedMotion.mockReturnValue(true);

    const { result } = renderHook(() => useInteractiveAnimations());

    expect(result.current.prefersReducedMotion).toBe(true);
    
    // Check that hover animations are reduced
    expect(result.current.buttonVariants.hover.scale).toBe(1.02);
    expect(result.current.wiggleVariants.wiggle.rotate).toEqual([0, 1, -1, 0]);
  });

  it('provides full motion variants when user does not prefer reduced motion', () => {
    const { useReducedMotion } = require('@/hooks/useReducedMotion');
    useReducedMotion.mockReturnValue(false);

    const { result } = renderHook(() => useInteractiveAnimations());

    expect(result.current.prefersReducedMotion).toBe(false);
    
    // Check that hover animations are full
    expect(result.current.buttonVariants.hover.scale).toBe(1.05);
    expect(result.current.wiggleVariants.wiggle.rotate).toEqual([0, -5, 5, -3, 3, 0]);
  });

  it('playSound function logs sound effects', () => {
    const { useReducedMotion } = require('@/hooks/useReducedMotion');
    useReducedMotion.mockReturnValue(false);

    const { result } = renderHook(() => useInteractiveAnimations());
    const consoleSpy = jest.spyOn(console, 'log');

    result.current.playSound('click');
    expect(consoleSpy).toHaveBeenCalledWith('🔊 Playing sound: click');

    result.current.playSound('hover');
    expect(consoleSpy).toHaveBeenCalledWith('🔊 Playing sound: hover');

    result.current.playSound('success');
    expect(consoleSpy).toHaveBeenCalledWith('🔊 Playing sound: success');
  });

  it('triggerHaptic function calls navigator.vibrate with correct patterns', () => {
    const { useReducedMotion } = require('@/hooks/useReducedMotion');
    useReducedMotion.mockReturnValue(false);

    const { result } = renderHook(() => useInteractiveAnimations());
    const vibrateSpy = jest.spyOn(navigator, 'vibrate');

    result.current.triggerHaptic('light');
    expect(vibrateSpy).toHaveBeenCalledWith([10]);

    result.current.triggerHaptic('medium');
    expect(vibrateSpy).toHaveBeenCalledWith([20]);

    result.current.triggerHaptic('heavy');
    expect(vibrateSpy).toHaveBeenCalledWith([30]);
  });

  it('handles missing vibrate API gracefully', () => {
    // Remove vibrate from navigator
    const originalVibrate = navigator.vibrate;
    delete (navigator as any).vibrate;

    const { useReducedMotion } = require('@/hooks/useReducedMotion');
    useReducedMotion.mockReturnValue(false);

    const { result } = renderHook(() => useInteractiveAnimations());

    // Should not throw error
    expect(() => {
      result.current.triggerHaptic('light');
    }).not.toThrow();

    // Restore vibrate
    (navigator as any).vibrate = originalVibrate;
  });

  it('provides correct animation variants structure', () => {
    const { useReducedMotion } = require('@/hooks/useReducedMotion');
    useReducedMotion.mockReturnValue(false);

    const { result } = renderHook(() => useInteractiveAnimations());

    // Check button variants structure
    expect(result.current.buttonVariants).toHaveProperty('idle');
    expect(result.current.buttonVariants).toHaveProperty('hover');
    expect(result.current.buttonVariants).toHaveProperty('tap');

    // Check page transition variants structure
    expect(result.current.pageTransitionVariants).toHaveProperty('initial');
    expect(result.current.pageTransitionVariants).toHaveProperty('animate');
    expect(result.current.pageTransitionVariants).toHaveProperty('exit');

    // Check that variants have expected properties
    expect(result.current.buttonVariants.idle).toHaveProperty('scale');
    expect(result.current.buttonVariants.hover).toHaveProperty('scale');
    expect(result.current.buttonVariants.tap).toHaveProperty('scale');
  });
});