# Pose Detection System

This document explains the MediaPipe-based pose detection system integrated into the game.

## Overview

The system uses MediaPipe Pose Landmarker to detect 5 key movements:
1. **Raise Left Hand** - Left wrist above left shoulder
2. **Raise Right Hand** - Right wrist above right shoulder  
3. **Squat** - Knee angle < 95 degrees
4. **Jump** - Upward hip velocity or feet off ground
5. **Clap** - Wrists close together at chest height

## How It Works

### 1. Initialization
- MediaPipe Pose Landmarker loads from CDN
- Camera permission is requested
- Pose detection starts running at ~30 FPS

### 2. Game Flow
1. User clicks a video on `/play` page
2. Redirected to `/game` with video ID
3. Camera permission requested
4. User raises hand to start → video begins playing
5. Pose detection runs continuously, counting moves
6. Move counters update in real-time

### 3. Technical Details

#### Pose Detection (`lib/poseDetector.ts`)
- Uses MediaPipe Pose Landmarker WASM model
- Processes video frames in real-time
- Calculates angles and distances for move detection
- Includes debouncing to prevent rapid counting

#### Move Detection Thresholds
- **Hand Raise**: Wrist Y < Shoulder Y - 0.1 (10% margin)
- **Squat**: Knee angle < 95 degrees
- **Jump**: Hip velocity > 0.05 OR hip-ankle distance < 0.3
- **Clap**: Wrist distance < 0.08 AND at chest height (±0.15)

#### UI Components
- **WebcamView**: Main component handling camera and pose detection
- **Move Counters**: Real-time display of detected moves
- **Debug Skeleton**: Optional pose landmark overlay
- **Test Buttons**: Development-only manual counters

## Usage

### Basic Integration
```tsx
import { WebcamView } from '@/components/game/WebcamView';

<WebcamView
  onHandRaised={() => console.log('Hand raised!')}
  isWaitingForGesture={true}
  videoId="123"
  showDebugSkeleton={false}
/>
```

### API Endpoints
- `GET /api/video/[id]` - Serves video files from `public/videos/`

## Development

### Testing Moves
In development mode, manual test buttons appear to increment counters:
- +Left, +Right, +Squat, +Jump buttons
- Useful for UI testing without performing actual moves

### Debug Mode
Set `showDebugSkeleton={true}` to see pose landmarks overlaid on video.

### Adding Videos
1. Place MP4 files in `public/videos/`
2. Name them with the video ID (e.g., `1.mp4`, `2.mp4`)
3. Videos will be served at `/api/video/{id}`

## Browser Compatibility

### Requirements
- Modern browser with WebRTC support
- Camera access permission
- WebAssembly support
- Hardware acceleration recommended

### Tested Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

### Optimization
- Model loads once and reuses across sessions
- Frame processing runs at requestAnimationFrame rate
- Move detection includes debouncing (1 second intervals)
- Cleanup on component unmount prevents memory leaks

### Resource Usage
- ~50MB WASM model download (cached)
- ~10-20% CPU usage during detection
- Minimal memory footprint with proper cleanup

## Troubleshooting

### Common Issues
1. **"Pose AI Failed"** - MediaPipe failed to load
   - Check internet connection
   - Verify browser compatibility
   - Try refreshing the page

2. **Camera not working** - Permission or hardware issues
   - Grant camera permission
   - Check if camera is in use by another app
   - Try different browser

3. **Moves not detected** - Pose detection issues
   - Ensure good lighting
   - Stay within camera frame
   - Check if pose landmarks are visible (debug mode)

### Fallback Behavior
- System continues working even if pose detection fails
- Manual test buttons available in development
- Video playback works independently of pose detection

## Future Enhancements

### Potential Improvements
- Add more complex moves (sidestep, dance moves)
- Implement pose confidence scoring
- Add move streak tracking
- Include pose correction feedback
- Support multiple person detection
- Add gesture-based video controls

### Performance Optimizations
- WebGL acceleration for pose processing
- Model quantization for smaller download
- Frame skipping during low activity
- Background/foreground detection for better accuracy