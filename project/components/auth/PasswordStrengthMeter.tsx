import React, { useMemo, memo } from 'react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-4
  feedback: string[];
}

function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      strength: 'weak',
      score: 0,
      feedback: ['Enter a password']
    };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include lowercase letters');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include uppercase letters');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include numbers');
  }

  // Special character check
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else if (score >= 3) {
    feedback.push('Consider adding special characters');
  }

  // Determine strength based on score
  let strength: PasswordStrength;
  if (score <= 1) {
    strength = 'weak';
  } else if (score === 2) {
    strength = 'fair';
  } else if (score === 3) {
    strength = 'good';
  } else {
    strength = 'strong';
  }

  return { strength, score, feedback };
}

const strengthConfig = {
  weak: {
    color: 'bg-red-400',
    textColor: 'text-red-600',
    label: 'Weak',
    width: '25%'
  },
  fair: {
    color: 'bg-orange-400',
    textColor: 'text-orange-600',
    label: 'Fair',
    width: '50%'
  },
  good: {
    color: 'bg-yellow-400',
    textColor: 'text-yellow-600',
    label: 'Good',
    width: '75%'
  },
  strong: {
    color: 'bg-green-400',
    textColor: 'text-green-600',
    label: 'Strong',
    width: '100%'
  }
};

function PasswordStrengthMeterComponent({ password, className }: PasswordStrengthMeterProps) {
  // Debounce password input to avoid excessive calculations
  const debouncedPassword = useDebounce(password, 300);
  
  // Memoize strength calculation to prevent unnecessary recalculations
  const { strength, feedback } = useMemo(() => 
    calculatePasswordStrength(debouncedPassword), 
    [debouncedPassword]
  );
  
  const config = strengthConfig[strength];

  // Don't show meter if no password
  if (!password) {
    return null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-600">
            Password strength
          </span>
          <span className={cn('text-xs font-medium', config.textColor)}>
            {config.label}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-300 ease-out rounded-full',
              config.color
            )}
            style={{ width: config.width }}
            role="progressbar"
            aria-valuenow={strengthConfig[strength] === strengthConfig.weak ? 25 : 
                          strengthConfig[strength] === strengthConfig.fair ? 50 :
                          strengthConfig[strength] === strengthConfig.good ? 75 : 100}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Password strength: ${config.label}`}
          />
        </div>
      </div>

      {/* Feedback */}
      {feedback.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-600">Suggestions:</p>
          <ul className="space-y-0.5">
            {feedback.slice(0, 3).map((item, index) => (
              <li
                key={index}
                className="text-xs text-gray-500 flex items-center gap-1"
              >
                <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const PasswordStrengthMeter = memo(PasswordStrengthMeterComponent);