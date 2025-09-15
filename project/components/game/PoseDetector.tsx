"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Camera, Zap, Target, Volume2, AlertCircle } from 'lucide-react';

interface PoseDetectorProps {
  onPoseDetected: (pose: 'jump' | 'squat' | 'clap') => void;
  isActive: boolean;
}

export function PoseDetector({ onPoseDetected, isActive }: PoseDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detectedPose, setDetectedPose] = useState<'jump' | 'squat' | 'clap' | null>(null);
  const [poseConfidence, setPoseConfidence] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function initWebcam() {
      if (!videoRef.current) return;

      try {
        setIsLoading(true);
        setError(null);
        
        const webcamStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 }
        });
        
        if (!mounted) return;
        
        if (webcamStream) {
          setStream(webcamStream);
          videoRef.current.srcObject = webcamStream;
          
          videoRef.current.onloadedmetadata = () => {
            if (mounted) {
              setIsLoading(false);
            }
          };
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
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simulate pose detection (in a real app, you'd use MediaPipe or TensorFlow.js)
  useEffect(() => {
    if (!isActive || !stream) return;

    const interval = setInterval(() => {
      // Simulate pose detection with random poses
      const poses = ['jump', 'squat', 'clap'] as const;
      const randomPose = poses[Math.floor(Math.random() * poses.length)];
      const confidence = Math.random() * 0.4 + 0.6; // 60-100% confidence
      
      if (Math.random() > 0.8) { // 20% chance per check
        setDetectedPose(randomPose);
        setPoseConfidence(confidence);
        onPoseDetected(randomPose);
        
        // Clear detection after showing feedback
        setTimeout(() => {
          setDetectedPose(null);
          setPoseConfidence(0);
        }, 2000);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isActive, stream, onPoseDetected]);

  // Manual pose triggers for testing
  const triggerPose = (pose: 'jump' | 'squat' | 'clap') => {
    if (isActive) {
      setDetectedPose(pose);
      setPoseConfidence(0.95);
      onPoseDetected(pose);
      
      setTimeout(() => {
        setDetectedPose(null);
        setPoseConfidence(0);
      }, 2000);
    }
  };

  if (error) {
    return (
      <div className="rounded-3xl border-4 border-red-300 bg-red-50/80 p-6 shadow-xl">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-700 mb-2">Camera Error</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border-4 border-sky-300 bg-white/90 p-4 shadow-xl">
      <div className="text-center mb-4">
        <h3 className="text-xl font-black text-sky-800 mb-2">📹 Motion Detection</h3>
        <p className="text-sky-600 text-sm font-medium">
          {isActive ? "Watching for your moves!" : "Camera ready"}
        </p>
      </div>

      {/* Webcam Video */}
      <div className="relative rounded-2xl overflow-hidden bg-black mb-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-sky-200">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sky-700 text-sm font-semibold">Loading camera...</p>
            </div>
          </div>
        )}
        
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-auto ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          style={{ maxHeight: '200px' }}
        />
        
        {/* Pose detection overlay */}
        {detectedPose && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-2xl">
            <div className="text-center bg-white/90 rounded-xl p-3">
              <div className="text-2xl mb-1">
                {detectedPose === 'jump' && '🦘'}
                {detectedPose === 'squat' && '🏋️'}
                {detectedPose === 'clap' && '👏'}
              </div>
              <p className="text-green-700 font-bold text-sm">
                {detectedPose.toUpperCase()} DETECTED!
              </p>
              <p className="text-green-600 text-xs">
                {Math.round(poseConfidence * 100)}% confidence
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Manual Pose Triggers for Testing */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => triggerPose('jump')}
          className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-red-300 bg-red-50 hover:bg-red-100 transition-colors"
          disabled={!isActive}
        >
          <Zap className="h-5 w-5 text-red-600" />
          <span className="text-xs font-bold text-red-700">JUMP</span>
        </button>

        <button
          onClick={() => triggerPose('squat')}
          className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors"
          disabled={!isActive}
        >
          <Target className="h-5 w-5 text-blue-600" />
          <span className="text-xs font-bold text-blue-700">SQUAT</span>
        </button>

        <button
          onClick={() => triggerPose('clap')}
          className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-green-300 bg-green-50 hover:bg-green-100 transition-colors"
          disabled={!isActive}
        >
          <Volume2 className="h-5 w-5 text-green-600" />
          <span className="text-xs font-bold text-green-700">CLAP</span>
        </button>
      </div>

      {!isActive && (
        <div className="mt-3 text-center">
          <p className="text-gray-500 text-xs">
            💡 Click the buttons above to test pose detection
          </p>
        </div>
      )}
    </div>
  );
}