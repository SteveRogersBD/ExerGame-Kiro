// Utility functions for generating and handling video thumbnails

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  quality?: 'default' | 'medium' | 'high' | 'maxres';
}

/**
 * Generate thumbnail URL from video URL
 */
export function generateThumbnailUrl(videoUrl: string, options: ThumbnailOptions = {}): string {
  const { quality = 'maxresdefault' } = options;
  
  // YouTube URL patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/
  ];
  
  for (const pattern of youtubePatterns) {
    const match = videoUrl.match(pattern);
    if (match) {
      const videoId = match[1];
      return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    }
  }
  
  // Vimeo URL pattern
  const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    // For Vimeo, we'd need to call their API to get the actual thumbnail
    // For now, return a placeholder that could be handled by your backend
    return `/api/thumbnails/vimeo/${vimeoMatch[1]}`;
  }
  
  // Local video files - assume backend provides thumbnails
  if (videoUrl.match(/\.(mp4|webm|mov|avi|mkv)$/i)) {
    // Replace video extension with thumbnail extension
    return videoUrl.replace(/\.(mp4|webm|mov|avi|mkv)$/i, '_thumbnail.jpg');
  }
  
  // For other URLs, try to construct a thumbnail path
  if (videoUrl.startsWith('/') || videoUrl.includes(window.location.origin)) {
    // Local URL - assume backend can provide thumbnail
    return videoUrl.replace(/\.[^.]+$/, '_thumbnail.jpg');
  }
  
  // Fallback: return original URL (might work for some services)
  return videoUrl;
}

/**
 * Generate homework thumbnail URL
 */
export function generateHomeworkThumbnailUrl(homeworkId: number): string {
  return `/api/homework/${homeworkId}/thumbnail`;
}

/**
 * Generate a placeholder thumbnail based on title
 */
export function generatePlaceholderThumbnail(title: string): string {
  // Create a data URL for a simple colored rectangle with initials
  const initials = title
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  
  // You could generate an SVG data URL here
  // For now, return a placeholder service URL
  return `https://via.placeholder.com/400x225/FF6B6B/FFFFFF?text=${encodeURIComponent(initials)}`;
}

/**
 * Check if a URL is likely to be a valid image
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(pathname);
  } catch {
    return false;
  }
}

/**
 * Get the best thumbnail URL with fallbacks
 */
export function getBestThumbnailUrl(
  videoUrl?: string, 
  customThumbnail?: string, 
  title?: string
): string | undefined {
  // Priority: custom thumbnail > generated from video > placeholder
  if (customThumbnail && isValidImageUrl(customThumbnail)) {
    return customThumbnail;
  }
  
  if (videoUrl) {
    const generated = generateThumbnailUrl(videoUrl);
    if (generated !== videoUrl) { // Only use if we actually generated something different
      return generated;
    }
  }
  
  if (title) {
    return generatePlaceholderThumbnail(title);
  }
  
  return undefined;
}