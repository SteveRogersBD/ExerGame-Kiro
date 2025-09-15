import React, { useRef, useEffect, useState } from 'react';
import { Camera, Hand, Loader2, AlertCircle } from 'lucide-react';
import { startWebcamStream, stopWebcamStream } from '@/lib/utils/webcam';

interface WebcamViewProps {
  onHandRaised: () => void;
  isWaitingForGesture: boolean;
}

export function WebcamView({ onHandRaised, isWaitingForGesture }: WebcamViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [handDetected, setHandDetected] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initWebcam() {
      if (!videoRef.current) return;

      try {
        setIsLoading(true);
        setError(null);
        
        const webcamStream = await startWebcamStream(videoRef.current);
        
        if (!mounted) return;
        
        if (webcamStream) {
          setStream(webcamStream);
          
          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            if (mounted) {
              setIsLoading(false);
            }
          };
        } else {
          setError('Failed to start camera');
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError('Camera access failed');
          setIsLoading(false);
        }
      }
    }

    initWebcam();

    return () => {
      mounted = false;
      if (stream) {
        stopWebcamStream(stream);
      }
    };
  }, []);

  // Simulate hand detection (in a real app, you'd use ML libraries like MediaPipe or TensorFlow.js)
  useEffect(() => {
    if (!isWaitingForGesture || !stream) return;

    const interval = setInterval(() => {
      // Simulate random hand detection for demo purposes
      // In a real implementation, you'd analyze the video stream
      const randomDetection = Math.random() > 0.7; // 30% chance per check
      
      if (randomDetection && !handDetected) {
        setHandDetected(true);
        setTimeout(() => {
          onHandRaised();
        }, 1000); // Give user time to see the detection
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isWaitingForGesture, stream, handDetected, onHandRaised]);

  // Manual trigger for testing (click on video)
  const handleVideoClick = () => {
    if (isWaitingForGesture) {
      setHandDetected(true);
      setTimeout(() => {
        onHandRaised();
      }, 500);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
        <div className="rounded-3xl border-4 border-red-300 bg-red-50/80 p-8 shadow-xl text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-700 mb-2">Camera Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-red-500">
            Please check your camera permissions and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Webcam Video */}
      <div className="relative rounded-3xl border-4 border-amber-300 bg-white/90 p-4 shadow-xl overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-200 to-purple-200 rounded-2xl">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto mb-4" />
              <p className="text-sky-700 font-semibold">Starting camera...</p>
            </div>
          </div>
        )}
        
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-auto rounded-2xl ${isWaitingForGesture ? 'cursor-pointer' : ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          style={{ maxWidth: '640px', maxHeight: '480px' }}
          onClick={handleVideoClick}
        />
        
        {/* Hand detection overlay */}
        {isWaitingForGesture && (
          <div className="absolute inset-4 rounded-2xl border-4 border-dashed border-emerald-400 bg-emerald-100/20 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <Hand className={`h-16 w-16 mx-auto mb-2 ${handDetected ? 'text-emerald-500 animate-bounce' : 'text-emerald-400 animate-pulse'}`} />
              <p className={`text-lg font-bold ${handDetected ? 'text-emerald-600' : 'text-emerald-500'}`}>
                {handDetected ? 'Hand Detected! 🎉' : 'Raise your hand!'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Instruction Card */}
      {isWaitingForGesture && (
        <div className="mt-6 rounded-3xl border-4 border-emerald-300 bg-white/90 p-6 shadow-xl text-center max-w-md">
          <div className="mb-4">
            <Hand className="h-12 w-12 text-emerald-500 mx-auto animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-emerald-800 mb-2">Ready to Start?</h3>
          <p className="text-emerald-700 font-medium mb-4">
            Raise your hand in front of the camera to begin the game!
          </p>
          <div className="text-sm text-emerald-600 bg-emerald-50 rounded-xl p-3 border-2 border-emerald-200">
            <p className="font-semibold">💡 Tip: You can also click on the video to start</p>
          </div>
        </div>
      )}
    </div>
  );
}