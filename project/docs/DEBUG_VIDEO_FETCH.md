# Debug Video Fetching Issues

## 🔍 **Potential Issues & Solutions**

### **1. Backend Server Not Running**
**Check:** Is your backend server running on port 8080?
```bash
# Check if server is running
curl http://localhost:8080/video/1
```

**Expected Response:**
```json
{
  "id": 1,
  "title": "Video Title",
  "url": "https://example.com/video.mp4",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### **2. CORS Issues**
**Problem:** Browser blocks requests due to CORS policy

**Solution:** Add CORS headers to your backend:
```java
// Spring Boot example
@CrossOrigin(origins = "http://localhost:3001")
@RestController
public class VideoController {
    // your endpoints
}
```

### **3. Video ID Issues**
**Check:** Are you passing the correct video ID?

**Debug Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Click a video on `/play` page
4. Raise your hand to trigger fetch
5. Look for console logs:
   - "Fetching video from: ..."
   - "Item ID: ..."
   - "Response status: ..."

### **4. Environment Variables**
**Check:** Is `NEXT_PUBLIC_API_BASE` set correctly?

**Add to `.env.local`:**
```
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

### **5. Network Issues**
**Check:** Can you access the API directly?

**Test in browser:**
1. Open new tab
2. Go to: `http://localhost:8080/video/1`
3. Should return JSON response

## 🛠 **Quick Fixes**

### **Fix 1: Test with Mock Data**
If backend is not ready, test with mock data:

```typescript
// In game/page.tsx, replace the fetch with:
const mockVideo: Video = {
  id: parseInt(itemId || '1'),
  title: 'Test Video',
  url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  createdAt: new Date().toISOString()
};
setVideo(mockVideo);
setGameState('playing');
```

### **Fix 2: Add Fallback URL**
```typescript
const data: Video = await res.json();
// Add fallback if URL is missing
if (!data.url) {
  data.url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
}
setVideo(data);
```

### **Fix 3: Skip Video Fetch for Testing**
```typescript
// In handleHandRaised, add this at the top:
if (process.env.NODE_ENV === 'development') {
  setVideo(null);
  setGameState('playing');
  return;
}
```

## 🔧 **Debugging Steps**

### **Step 1: Check Console Logs**
1. Open DevTools → Console
2. Click video → Raise hand
3. Look for error messages

### **Step 2: Check Network Tab**
1. Open DevTools → Network
2. Click video → Raise hand  
3. Look for failed requests (red entries)
4. Click on failed request to see details

### **Step 3: Test API Directly**
```bash
# Test if API is accessible
curl -X GET http://localhost:8080/video/1 \
  -H "Accept: application/json" \
  -v
```

### **Step 4: Check CORS**
If you see CORS errors in console:
```
Access to fetch at 'http://localhost:8080/video/1' from origin 'http://localhost:3001' has been blocked by CORS policy
```

**Solution:** Configure CORS on your backend server.

## 🎯 **Expected Flow**

1. **User clicks video** → URL: `/game?type=video&id=1&title=Video%20Name`
2. **User raises hand** → Triggers `handleHandRaised()`
3. **Fetch video** → `GET http://localhost:8080/video/1`
4. **Parse response** → Extract `url` field
5. **Play video** → Set `src` on video element
6. **Show webcam** → Picture-in-picture overlay

## 🚨 **Common Errors**

### **"Failed to fetch"**
- Backend server not running
- Wrong port number
- Network connectivity issues

### **"CORS policy"**
- Backend doesn't allow frontend origin
- Missing CORS headers

### **"404 Not Found"**
- Video ID doesn't exist in database
- Wrong API endpoint URL

### **"Video won't play"**
- Invalid video URL
- Video format not supported
- CORS issues with video file

## ✅ **Quick Test**

Add this to your browser console on the game page:
```javascript
// Test API directly
fetch('http://localhost:8080/video/1')
  .then(r => r.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));
```

This will help identify if the issue is with the API or the frontend code.