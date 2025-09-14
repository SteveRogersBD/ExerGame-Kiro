import { useState, useCallback } from 'react';

interface RipplePoint {
  id: string;
  x: number;
  y: number;
  color?: string;
}

/**
 * Hook for managing click ripple effects
 */
export function useRippleEffect() {
  const [ripples, setRipples] = useState<RipplePoint[]>([]);

  const createRipple = useCallback((event: React.MouseEvent, color?: string) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    const newRipple: RipplePoint = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      color
    };

    setRipples(prev => [...prev, newRipple]);
  }, []);

  const removeRipple = useCallback((id: string) => {
    setRipples(prev => prev.filter(ripple => ripple.id !== id));
  }, []);

  const clearRipples = useCallback(() => {
    setRipples([]);
  }, []);

  return {
    ripples,
    createRipple,
    removeRipple,
    clearRipples
  };
}