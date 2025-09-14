'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Video, QuizQuestion } from '@/types/dashboard';
import { motion, AnimatePresence } from 'framer-motion';
import QuizOverlay from './QuizOverlay';

interface VideoPlayerProps {
  video: Video;
  onComplete: (score: number) => void;
  onQuit: () => void;
}

interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  showControls: boolean;
  currentQuiz: QuizQuestion | null;
  quizScore: number;
  completedQuizzes: string[];
}

export default function VideoPlayer({ video, onComplete, onQuit }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: true,
    showControls: true,
    currentQuiz: null,
    quizScore: 0,
    completedQuizzes: []
  });

  // Auto-hide controls after 3 seconds of inactivity
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const showControlsTemporarily = () => {
    setState(prev => ({ ...prev, showControls: true }));
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, showControls: false }));
    }, 3000);
  };

  // Handle video events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedData = () => {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        duration: videoElement.duration 
      }));
    };

    const handleTimeUpdate = () => {
      const currentTime = videoElement.currentTime;
      setState(prev => ({ ...prev, currentTime }));

      // Check for quiz questions at current time (auto-pause functionality)
      const pendingQuiz = video.quizQuestions.find(
        quiz => 
          Math.abs(quiz.timeInVideo - currentTime) < 0.5 && 
          !state.completedQuizzes.includes(quiz.id)
      );

      if (pendingQuiz && !state.currentQuiz && state.isPlaying) {
        // Auto-pause video at quiz checkpoint
        videoElement.pause();
        setState(prev => ({ 
          ...prev, 
          isPlaying: false,
          currentQuiz: pendingQuiz 
        }));
      }
    };

    const handleEnded = () => {
      onComplete(state.quizScore);
    };

    const handleError = () => {
      setState(prev => ({ ...prev, isLoading: false }));
    };

    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('error', handleError);
    };
  }, [video, state.completedQuizzes, state.currentQuiz, state.quizScore, onComplete]);

  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (state.isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    showControlsTemporarily();
  };

  const handleQuizAnswer = (selectedOptionId: string) => {
    if (!state.currentQuiz) return;
    
    const isCorrect = selectedOptionId === state.currentQuiz.correctAnswer;
    const newScore = isCorrect ? state.quizScore + 10 : state.quizScore;
    
    // Update state with quiz completion
    setState(prev => ({
      ...prev,
      quizScore: newScore,
      completedQuizzes: [...prev.completedQuizzes, state.currentQuiz!.id],
      currentQuiz: null
    }));

    // Resume video after a brief delay for user feedback
    setTimeout(() => {
      const videoElement = videoRef.current;
      if (videoElement && !videoElement.ended) {
        videoElement.play();
        setState(prev => ({ ...prev, isPlaying: true }));
      }
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onClick={showControlsTemporarily}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={video.url}
        playsInline
        preload="metadata"
      />

      {/* Loading Screen */}
      <AnimatePresence>
        {state.isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity }
              }}
              className="text-8xl mb-8"
            >
              ⭐
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">Getting ready...</h2>
            <p className="text-2xl text-white/80">Your video is loading!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Overlay */}
      <QuizOverlay
        quiz={state.currentQuiz}
        isVisible={!!state.currentQuiz}
        onAnswer={handleQuizAnswer}
      />

      {/* Video Controls */}
      <AnimatePresence>
        {state.showControls && !state.isLoading && !state.currentQuiz && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8"
          >
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-white text-lg">
                <span>{formatTime(state.currentTime)}</span>
                <span>{formatTime(state.duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-8">
              {/* Quit Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onQuit}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-6 shadow-2xl transition-colors duration-200"
              >
                <span className="text-4xl">⏹️</span>
              </motion.button>

              {/* Play/Pause Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlayPause}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full p-8 shadow-2xl transition-colors duration-200"
              >
                <span className="text-6xl">
                  {state.isPlaying ? '⏸️' : '▶️'}
                </span>
              </motion.button>

              {/* Score Display */}
              <div className="bg-purple-500 text-white rounded-2xl px-6 py-4 shadow-2xl">
                <div className="text-center">
                  <div className="text-2xl font-bold">Score</div>
                  <div className="text-3xl">{state.quizScore}</div>
                </div>
              </div>
            </div>

            {/* Video Title */}
            <div className="text-center mt-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                {video.title}
              </h2>
              <p className="text-xl text-white/80">
                Tap anywhere to show/hide controls
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}