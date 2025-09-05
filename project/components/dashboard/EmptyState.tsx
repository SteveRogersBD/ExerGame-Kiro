'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  mascotImage?: string;
  mascotEmoji?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  mascotImage,
  mascotEmoji = '🐅',
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center ${className}`}
    >
      <div className="w-32 h-32 mx-auto mb-6 relative">
        {mascotImage ? (
          <>
            <Image
              src={mascotImage}
              alt={title}
              fill
              className="object-contain"
              onError={(e) => {
                // Fallback to emoji if image doesn't exist
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden w-full h-full bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">{mascotEmoji}</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full flex items-center justify-center">
            <span className="text-4xl">{mascotEmoji}</span>
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </motion.div>
  );
}