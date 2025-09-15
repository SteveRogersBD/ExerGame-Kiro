import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface SmartPlayerProps {
  src?: string;
  videoRef?: React.RefObject<HTMLVideoElement>;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

// Helper function to extract YouTube video ID from various YouTube URL formats
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Helper function to check if URL is a YouTube URL
function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/.test(url);
}

// Helper function to check if URL is a Vimeo URL
function isVimeoUrl(url: string): boolean {
  return /vimeo\.com/.test(url);
}

// Helper function to extract Vimeo video ID
function getVimeoVideoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

const SmartPlayer = forwardRef<HTMLVideoElement, SmartPlayerProps>(
  ({ src, videoRef, autoPlay = false, showControls = true, className = '', onTimeUpdate, onEnded }, ref) => {
    const internalVideoRef = useRef<HTMLVideoElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Use external ref if provided, otherwise use internal ref
    const actualVideoRef = videoRef || internalVideoRef;

    // Expose the video element through the ref
    useImperativeHandle(ref, () => actualVideoRef.current as HTMLVideoElement, [actualVideoRef]);

    useEffect(() => {
      if (onEnded && actualVideoRef.current) {
        const videoElement = actualVideoRef.current;
        videoElement.addEventListener('ended', onEnded);
        return () => videoElement.removeEventListener('ended', onEnded);
      }
    }, [onEnded, actualVideoRef]);

    // If no src provided, show placeholder
    if (!src) {
      return (
        <div className={`flex items-center justify-center bg-gray-900 text-white ${className}`}>
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold mb-2">No Video Available</h3>
            <p className="text-gray-400">Video content will appear here when available</p>
          </div>
        </div>
      );
    }

    // Handle YouTube URLs
    if (isYouTubeUrl(src)) {
      const videoId = getYouTubeVideoId(src);
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?${autoPlay ? 'autoplay=1&' : ''}rel=0&modestbranding=1`;
        
        return (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className={className}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          />
        );
      }
    }

    // Handle Vimeo URLs
    if (isVimeoUrl(src)) {
      const videoId = getVimeoVideoId(src);
      if (videoId) {
        const embedUrl = `https://player.vimeo.com/video/${videoId}?${autoPlay ? 'autoplay=1&' : ''}title=0&byline=0&portrait=0`;
        
        return (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className={className}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          />
        );
      }
    }

    // Handle regular video files (MP4, WebM, etc.)
    return (
      <video
        ref={actualVideoRef}
        src={src}
        autoPlay={autoPlay}
        controls={showControls}
        className={className}
        onTimeUpdate={(e) => onTimeUpdate?.(e.currentTarget.currentTime)}
        onEnded={onEnded}
        playsInline
        muted={autoPlay} // Muted for autoplay compliance
      />
    );
  }
);

SmartPlayer.displayName = 'SmartPlayer';

export default SmartPlayer;