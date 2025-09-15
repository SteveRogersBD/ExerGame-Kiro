# API Integration Documentation

## Overview
This document describes the integration of the Exergame APIs into the child's dashboard.

## Integrated APIs

### 1. Get All Videos
- **Endpoint**: `GET /video`
- **Purpose**: Fetches all available videos for the preset row
- **Usage**: Displayed in the "🎬 preset" section of the kids dashboard

### 2. Get Child Homework
- **Endpoint**: `GET /homework/{childId}/all`
- **Purpose**: Fetches all homework assignments for a specific child
- **Usage**: Displayed in the "📚 homework" section of the kids dashboard
- **Current Implementation**: Uses `childId=1` as requested
- **Response**: Includes thumbnail URLs and videoId for each homework assignment

### 3. Get Video by ID
- **Endpoint**: `GET /video/{id}`
- **Purpose**: Fetches video details for homework assignments that have a videoId
- **Usage**: Used to get video URLs for generating thumbnails from homework videos
- **Integration**: Automatically called for each homework with a videoId

## File Structure

```
lib/api/
├── exergame.ts          # Main API service functions
└── types.ts             # Shared types and constants

hooks/
└── useExergameData.ts   # React hooks for data fetching

app/play/page.tsx        # Kids dashboard with integrated APIs
```

## Configuration

### Environment Variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Features

### Loading States
- Shows loading spinners while fetching data
- Graceful handling of empty states
- Smooth thumbnail loading with placeholders

### Error Handling
- Displays user-friendly error messages
- Comprehensive error logging
- Fallback UI for failed requests
- Graceful thumbnail error handling with fallbacks

### Data Transformation
- Maps API responses to existing component structure
- Normalizes homework status values
- Maintains backward compatibility with existing UI

### Thumbnail Support
- Automatic thumbnail generation from video URLs
- Support for YouTube, Vimeo, and local video files
- Fallback SVG thumbnails for homework assignments
- Loading states and error handling for images
- Colorful gradient fallbacks with initials

## Usage Example

```typescript
import { useVideos, useChildHomework } from '@/hooks/useExergameData';

function MyComponent() {
  const { videos, loading, error } = useVideos();
  const { homework, loading: hwLoading, error: hwError } = useChildHomework(1);
  
  // Component logic here
}
```

## Status Mapping

Homework status values are normalized:
- `COMPLETED` → `DONE`
- `PENDING` → `NOT_STARTED`  
- `ACTIVE` → `IN_PROGRESS`

## Next Steps

1. Implement homework status update API
2. Add video playback integration
3. Add error retry mechanisms
4. Implement caching for better performance
#
# Thumbnail System

### Video Thumbnails
The system automatically generates thumbnails for videos based on their URLs:

- **YouTube**: Extracts video ID and uses YouTube's thumbnail service
- **Vimeo**: Placeholder for Vimeo API integration
- **Local Videos**: Assumes backend provides `_thumbnail.jpg` versions
- **Fallback**: Colorful gradient with video title initials

### Homework Thumbnails
Homework assignments get thumbnails with this priority:
1. **Video URL Thumbnail**: If homework has `videoId`, fetches video from `/video/{id}` and generates thumbnail from video URL (same as preset videos)
2. **API Thumbnail**: Uses `thumbnail` field from homework API response
3. **SVG Fallback**: API endpoint `/api/homework/{id}/thumbnail` (SVG placeholder)
4. **Final Fallback**: Gradient with homework title initials

### Components

#### ThumbnailImage Component
Located at `components/ui/ThumbnailImage.tsx`
- Handles loading states with spinners
- Graceful error handling with fallbacks
- Customizable gradient colors
- Smooth transitions between states

### Example Usage

```typescript
<ThumbnailImage
  src={thumbnailUrl}
  alt="Video thumbnail"
  title="My Video Title"
  fallbackGradient="from-pink-300 to-amber-200"
/>
```

### Backend Integration
To fully support thumbnails, your backend should:
1. Serve thumbnail images at `/homework/{id}/thumbnail`
2. Provide `_thumbnail.jpg` files alongside video files
3. Handle thumbnail generation for uploaded videos

## Enhanced Homework Integration

### Data Flow
1. **Fetch Homework**: Call `/homework/{childId}/all` to get homework list
2. **Extract Video IDs**: For each homework with `videoId`, call `/video/{id}`
3. **Generate Thumbnails**: Use video URLs to generate thumbnails (YouTube, Vimeo, local videos)
4. **Fallback Chain**: If video fetch fails, use homework thumbnail → SVG → gradient

### Performance Considerations
- Video details are fetched in parallel using `Promise.all()`
- Failed video fetches don't break the homework display
- Graceful degradation ensures UI always shows something

### Example Homework with Video
```json
{
  "id": 101,
  "title": "Math Quiz Video",
  "status": "NOT_STARTED", 
  "videoId": 42,
  "thumbnail": "https://example.com/thumb.jpg",
  "video": {
    "id": 42,
    "title": "Introduction to Fractions",
    "url": "https://youtube.com/watch?v=abc123",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

In this case, the thumbnail will be generated from the YouTube URL, providing the same rich thumbnail experience as preset videos.## Inter
active Game Features

### Webcam Integration
The game page now includes interactive webcam functionality for motion-controlled gameplay:

#### Game Flow
1. **Permission Request**: Asks user for camera access with clear privacy information
2. **Webcam Setup**: Initializes camera and displays video feed
3. **Gesture Detection**: Waits for user to raise hand to start the game
4. **Interactive Gameplay**: Continues webcam during game for motion controls
5. **Completion**: Shows success screen and returns to dashboard

#### Components

##### WebcamPermission Component
- Clear explanation of why camera access is needed
- Privacy protection information
- Browser compatibility checks
- Graceful error handling

##### WebcamView Component
- Live camera feed with themed border
- Hand gesture detection (simulated for demo)
- Visual feedback for detected gestures
- Click-to-start fallback for testing

#### Technical Features
- **Privacy First**: Video processing happens locally, no data sent to servers
- **Browser Support**: Checks for WebRTC compatibility
- **Error Handling**: Graceful fallbacks for permission denied or camera unavailable
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Clear instructions and alternative interaction methods

#### File Structure
```
components/game/
├── WebcamPermission.tsx    # Camera permission request UI
└── WebcamView.tsx          # Live camera feed and gesture detection

lib/utils/
└── webcam.ts              # Webcam utility functions

app/game/page.tsx          # Updated game page with webcam integration
```

#### Future Enhancements
- Real hand gesture detection using MediaPipe or TensorFlow.js
- Multiple gesture types (wave, thumbs up, etc.)
- Pose detection for full-body exercises
- Real-time feedback during exercises