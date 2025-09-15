import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Hand, Loader2, AlertCircle, Activity } from 'lucide-react';
import { startWebcamStream, stopWebcamStream } from '@/lib/utils/webcam';
import { PoseDetector, PoseMove } from '@/lib/poseDetector';

interface WebcamViewProps {
  onHandRaised: () => void;
  isWaitingForGesture: boolean;
  videoId?: string;
  showDebugSkeleton?: boolean;
  isPiPMode?: boolean; // Picture-in-picture mode for smaller display
  onPoseDetected?: (poseType: "jump" | "squat" | "clap") => void; // Callback for pose detection
  waitingForPose?: "jump" | "squat" | "clap" | null; // Which pose we're waiting for
}

export function WebcamView({ onHandRaised, isWaitingForGesture, videoId, showDebugSkeleton = false, isPiPMode = false, onPoseDetected, waitingForPose }: WebcamViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);


  const poseDetectorRef = useRef<PoseDetector | null>(null);
  const animationFrameRef = useRef<number>();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [handDetected, setHandDetected] = useState(false);
  const [poseInitialized, setPoseInitialized] = useState(false);
  const [moveCounts, setMoveCounts] = useState<PoseMove>({
    raise_left_hand: 0,
    raise_right_hand: 0,
    squat: 0,
    jump: 0,
    clap: 0
  });
  const [currentMoves, setCurrentMoves] = useState<PoseMove>({
    raise_left_hand: 0,
    raise_right_hand: 0,
    squat: 0,
    jump: 0,
    clap: 0
  });
  const [lastMoveDetection, setLastMoveDetection] = useState<{ [key: string]: number }>({});

  // Initialize webcam and pose detector
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
          videoRef.current.onloadedmetadata = async () => {
            if (mounted) {
              // Initialize pose detector
              poseDetectorRef.current = new PoseDetector();
              const initialized = await poseDetectorRef.current.initialize();
              setPoseInitialized(initialized);
              setIsLoading(false);

              if (initialized) {
                startPoseDetection();
              } else {
                console.warn('Pose detection failed to initialize, using fallback mode');
                // Still allow the game to work without pose detection
              }
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (poseDetectorRef.current) {
        poseDetectorRef.current.cleanup();
      }
      if (stream) {
        stopWebcamStream(stream);
      }
    };
  }, []);

  // Pose detection loop
  const startPoseDetection = useCallback(() => {
    if (!poseDetectorRef.current || !videoRef.current) return;

    const detectPose = () => {
      if (!poseDetectorRef.current || !videoRef.current) return;

      const result = poseDetectorRef.current.detectPose(videoRef.current);
      setCurrentMoves(result.moves);

      // Update move counters with debouncing (prevent rapid counting)
      const now = Date.now();
      const debounceTime = 1000; // 1 second between counts

      setMoveCounts(prev => {
        const newCounts = { ...prev };

        Object.keys(result.moves).forEach(moveKey => {
          const move = moveKey as keyof PoseMove;
          if (result.moves[move] > 0) {
            const lastDetected = lastMoveDetection[move] || 0;
            if (now - lastDetected > debounceTime) {
              newCounts[move] = prev[move] + 1;
              setLastMoveDetection(prev => ({ ...prev, [move]: now }));
            }
          }
        });

        return newCounts;
      });

      // Handle hand raise detection for game start
      if (isWaitingForGesture && (result.moves.raise_left_hand > 0 || result.moves.raise_right_hand > 0)) {
        if (!handDetected) {
          setHandDetected(true);
          setTimeout(() => {
            onHandRaised();
            if (videoId) {
              startGameVideo();
            }
          }, 1000);
        }
      }

      // Handle pose detection for question answers
      if (onPoseDetected && waitingForPose) {
        if (waitingForPose === 'jump' && result.moves.jump > 0) {
          onPoseDetected('jump');
        } else if (waitingForPose === 'squat' && result.moves.squat > 0) {
          onPoseDetected('squat');
        } else if (waitingForPose === 'clap' && result.moves.clap > 0) {
          onPoseDetected('clap');
        }
      }

      // Note: Pose landmarks drawing has been disabled

      animationFrameRef.current = requestAnimationFrame(detectPose);
    };

    detectPose();
  }, [isWaitingForGesture, handDetected, onHandRaised, videoId, onPoseDetected, waitingForPose]);

  // Note: Video fetching is now handled by the parent game page
  const startGameVideo = useCallback(async () => {
    console.log('Video fetching is handled by parent component');
  }, []);

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
    <div className={`flex flex-col items-center w-full ${isPiPMode ? '' : 'max-w-6xl mx-auto'}`}>
      <div className="flex flex-col items-center w-full">
        {/* Webcam Video */}
        <div className={`w-full ${isPiPMode ? '' : 'max-w-2xl'}`}>
          <div className={`relative ${isPiPMode ? 'rounded-xl border-2' : 'rounded-3xl border-4'} border-amber-300 bg-white/90 ${isPiPMode ? 'p-2' : 'p-4'} shadow-xl overflow-hidden`}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-200 to-purple-200 rounded-2xl">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto mb-4" />
                  <p className="text-sky-700 font-semibold">
                    {poseInitialized ? 'Starting camera...' : 'Loading pose detection...'}
                  </p>
                </div>
              </div>
            )}

            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-auto ${isPiPMode ? 'rounded-lg' : 'rounded-2xl'} ${isWaitingForGesture ? 'cursor-pointer' : ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                style={{
                  maxWidth: isPiPMode ? '240px' : '640px',
                  maxHeight: isPiPMode ? '180px' : '480px'
                }}
                onClick={handleVideoClick}
              />


            </div>

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

            {/* Pose detection status */}
            {!isLoading && !isPiPMode && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded-lg text-xs">
                <Activity className={`h-3 w-3 ${poseInitialized ? 'text-green-400' : 'text-red-400'}`} />
                {poseInitialized ? 'Pose AI Active' : 'Pose AI Failed'}
              </div>
            )}

            {/* Compact status for PiP mode */}
            {!isLoading && isPiPMode && (
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-400 border border-white"></div>
            )}

            {/* Pose waiting indicator for PiP mode */}
            {isPiPMode && waitingForPose && (
              <div className="absolute bottom-1 left-1 right-1 bg-yellow-400 text-black text-xs font-bold px-1 py-0.5 rounded text-center">
                {waitingForPose === 'jump' && '🦘 JUMP'}
                {waitingForPose === 'squat' && '🏋️ SQUAT'}
                {waitingForPose === 'clap' && '👏 CLAP'}
              </div>
            )}


          </div>


        </div>
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