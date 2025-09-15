// Webcam utility functions for game interaction

export interface WebcamPermissionResult {
  granted: boolean;
  error?: string;
}

/**
 * Request webcam permission from the user
 */
export async function requestWebcamPermission(): Promise<WebcamPermissionResult> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      } 
    });
    
    // Stop the stream immediately after getting permission
    stream.getTracks().forEach(track => track.stop());
    
    return { granted: true };
  } catch (error) {
    console.error('Webcam permission denied:', error);
    
    let errorMessage = 'Camera access denied';
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access to play the game.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please connect a camera to play the game.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is being used by another application.';
      }
    }
    
    return { granted: false, error: errorMessage };
  }
}

/**
 * Start webcam stream and attach to video element
 */
export async function startWebcamStream(videoElement: HTMLVideoElement): Promise<MediaStream | null> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      } 
    });
    
    videoElement.srcObject = stream;
    return stream;
  } catch (error) {
    console.error('Failed to start webcam stream:', error);
    return null;
  }
}

/**
 * Stop webcam stream
 */
export function stopWebcamStream(stream: MediaStream | null) {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

/**
 * Check if browser supports webcam
 */
export function isWebcamSupported(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}