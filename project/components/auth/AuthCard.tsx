import React from 'react';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        // Base card styling
        'w-full max-w-md mx-auto',
        // Pastel background with gradient
        'bg-gradient-to-br from-white to-yellow-50',
        // Rounded corners
        'rounded-2xl',
        // Colorful shadow with wiggle theme colors
        'shadow-[0_20px_25px_-5px_rgba(255,109,213,0.1),0_10px_10px_-5px_rgba(255,109,213,0.04),0_0_0_1px_rgba(255,109,213,0.05)]',
        // Responsive padding
        'p-6 sm:p-8',
        // Border for subtle definition
        'border border-pink-100/50',
        className
      )}
    >
      {children}
    </div>
  );
}