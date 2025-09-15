# Testing Guide - Pose Detection Game

This guide explains how to test the MediaPipe pose detection system.

## 🚀 Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Navigate to Play Page
- Go to `http://localhost:3001/play`
- You'll see videos and homework items

### 3. Click a Video
- Click any video card
- A popup will appear with "Get ready for the game!"
- Click "Let's Go! 🚀"

### 4. Grant Camera Permission
- Allow camera access when prompted
- Wait for pose detection to initialize

### 5. Raise Your Hand
- Raise either hand to start the game
- The system will detect your hand and start the video

### 6. Try the Moves
Perform these moves in front of the camera:
- **✋ Raise Left Hand** - Lift left hand above shoulder
- **🤚 Raise Right Hand** - Lift right hand above shoulder  
- **🏋️ Squat** - Bend knees (knee angle < 95°)
- **🦘 Jump** - Quick upward movement
- **👏 Clap** - Bring hands together at chest level

## 🎯 What You'll See

### Video Playing Mode
- **Main video** plays in the center (if available)
- **Webcam feed** appears in top-right corner
- **Move counters** show your detected moves
- **Pose skeleton** overlay (in debug mode)

### Demo Mode (No Video)
- If video isn't found, shows "Demo Mode"
- Webcam and pose detection still work
- Perfect for testing the AI without video content

## 🔧 Development Features

### Test Buttons
In development mode, you'll see manual test buttons:
- **+Left**, **+Right**, **+Squat**, **+Jump**
- Click to manually increment counters
- Useful for UI testing

### Debug Mode
- Set `showDebugSkeleton={true}` in WebcamView
- Shows pose landmarks and connections
- Helps debug pose detection accuracy

## 🌐 API Integration

### Video API
The system tries to fetch videos from:
1. **Primary**: `http://localhost:8080/video/{id}` (your backend)
2. **Fallback**: `/api/video/{id}` (Next.js API route)

### Expected API Response
```json
{
  "id": 1,
  "title": "Beach Cleanup Adventure",
  "url": "https://example.com/video.mp4",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 🎮 Game Flow

1. **Video Selection** → Store video ID
2. **Camera Permission** → Request webcam access
3. **Pose Detection Init** → Load MediaPipe model
4. **Hand Raise Detection** → Wait for user gesture
5. **Video Fetch & Play** → Load video from API
6. **Live Pose Tracking** → Count moves in real-time
7. **Game Completion** → Return to dashboard

## 🐛 Troubleshooting

### Camera Issues
- **"Camera Access Required"** → Grant permission in browser
- **"Camera Error"** → Check if camera is in use by another app
- **Black screen** → Try refreshing the page

### Pose Detection Issues
- **"Pose AI Failed"** → MediaPipe failed to load
  - Check internet connection
  - Try different browser
  - Refresh the page
- **Moves not detected** → Ensure good lighting and stay in frame

### Video Issues
- **"Demo Mode"** appears → Video API not available or video not found
- **Video won't play** → Check video URL and format
- **No video controls** → Video element may not have loaded

### API Issues
- **Failed to fetch video** → Backend server not running on port 8080
- **CORS errors** → Add CORS headers to your backend
- **404 errors** → Video ID doesn't exist in database

## 📱 Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+  
- ✅ Safari 14+
- ✅ Edge 90+

### Required Features
- WebRTC (camera access)
- WebAssembly (MediaPipe)
- ES6+ JavaScript
- Hardware acceleration (recommended)

## 🎯 Testing Checklist

### Basic Functionality
- [ ] Camera permission works
- [ ] Pose detection initializes
- [ ] Hand raise starts game
- [ ] Move counters update
- [ ] Video plays (if available)
- [ ] Webcam shows in corner during video

### Move Detection
- [ ] Left hand raise detected
- [ ] Right hand raise detected
- [ ] Squat detected (bend knees)
- [ ] Jump detected (quick up movement)
- [ ] Clap detected (hands together)

### Error Handling
- [ ] Works without video (demo mode)
- [ ] Handles camera permission denial
- [ ] Continues if pose detection fails
- [ ] Shows appropriate error messages

### Performance
- [ ] Smooth video playback
- [ ] Responsive pose detection
- [ ] No memory leaks on page exit
- [ ] Good frame rate (30+ FPS)

## 🚀 Next Steps

### Adding Real Videos
1. Place MP4 files in `public/videos/`
2. Name them with video IDs (e.g., `1.mp4`)
3. Or set up your backend API properly

### Customizing Moves
1. Edit `lib/poseDetector.ts`
2. Adjust thresholds in `analyzeMoves()`
3. Add new move types as needed

### Improving Accuracy
1. Tune detection thresholds
2. Add confidence scoring
3. Implement move validation
4. Add pose correction feedback

Happy testing! 🎉