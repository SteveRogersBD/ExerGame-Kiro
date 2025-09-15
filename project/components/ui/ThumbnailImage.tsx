import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ThumbnailImageProps {
  src?: string;
  alt: string;
  title: string;
  className?: string;
  fallbackGradient?: string;
}

export function ThumbnailImage({ 
  src, 
  alt, 
  title, 
  className = "h-36 w-full rounded-2xl object-cover",
  fallbackGradient = "from-pink-300 to-amber-200"
}: ThumbnailImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  // Generate initials from title
  const initials = title
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // If no src or error occurred, show fallback
  if (!src || error) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br ${fallbackGradient} text-4xl font-extrabold text-white shadow-inner ${className.replace('object-cover', '')}`}>
        {initials}
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br ${fallbackGradient} ${className.replace('object-cover', '')}`}>
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}