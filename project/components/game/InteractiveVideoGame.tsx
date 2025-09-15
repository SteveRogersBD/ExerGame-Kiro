"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Target, Zap } from 'lucide-react';
import { WebcamView } from './WebcamView';
import { PoseDetector } from '@/components/game/PoseDetector';
import { ScoreBoard } from '@/components/game/ScoreBoard';

// Quiz data from the user's requirements - Dora episode specific questions
const QUIZ_DATA = [
  {
    id: 1,
    question: "Where do we go to find the sneezes?",
    timeToStop: "0:08:26",
    pauseTime: 506, // 8:26 in seconds
    optA: "Jungle, Big Hill, Benny's Barn",
    optB: "River, Mountain, Tico's Tree",
    optC: "Bridge, Tunnel, Isa's Flowery Garden",
    correctAns: "A"
  },
  {
    id: 2,
    question: "What do we use to cover the boo-boos?",
    timeToStop: "0:12:40",
    pauseTime: 760, // 12:40 in seconds
    optA: "Shoes",
    optB: "Bandages",
    optC: "Gloves",
    correctAns: "B"
  },
  {
    id: 3,
    question: "What will make the bucket slip off the Big Red Chicken's foot?",
    timeToStop: "0:18:10",
    pauseTime: 1090, // 18:10 in seconds
    optA: "Liquid soap",
    optB: "Milk",
    optC: "Paint",
    correctAns: "A"
  },
  {
    id: 4,
    question: "What do we need to help Azul find his whistle?",
    timeToStop: "0:22:15",
    pauseTime: 1335, // 22:15 in seconds
    optA: "Binoculars",
    optB: "Stethoscope",
    optC: "Flashlight",
    correctAns: "B"
  },
  {
    id: 5,
    question: "What is Benny allergic to?",
    timeToStop: "0:29:10",
    pauseTime: 1750, // 29:10 in seconds
    optA: "Feather pillow",
    optB: "Hay",
    optC: "Flower",
    correctAns: "C"
  }
];

interface GameState {
  score: number;
  jumpCount: number;
  squatCount: number;
  clapCount: number;
  currentQuestionIndex: number;
  isVideoPlaying: boolean;
  isQuestionActive: boolean;
  showFeedback: boolean;
  lastAnswer: 'correct' | 'incorrect' | null;
  videoCurrentTime: number;
  questionsAnswered: boolean[];
  showJumpDetected: boolean;
}

interface InteractiveVideoGameProps {
  videoUrl?: string;
  onGameComplete?: (finalScore: number) => void;
}

export function InteractiveVideoGame({
  videoUrl = "https://www.youtube.com/watch?v=L8A4XbM5sXA&t=6s",
  onGameComplete
}: InteractiveVideoGameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    jumpCount: 0,
    squatCount: 0,
    clapCount: 0,
    currentQuestionIndex: 0,
    isVideoPlaying: false,
    isQuestionActive: false,
    showFeedback: false,
    lastAnswer: null,
    videoCurrentTime: 0,
    questionsAnswered: new Array(QUIZ_DATA.length).fill(false),
    showJumpDetected: false
  });

  const [gameStarted, setGameStarted] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const jumpDetectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Convert YouTube URL to embed format with API enabled
  const getEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    const timeMatch = url.match(/[?&]t=(\d+)s?/);
    const startTime = timeMatch ? parseInt(timeMatch[1]) : 0;

    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${startTime}&autoplay=1&controls=1&modestbranding=1&rel=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&origin=${encodeURIComponent(window.location.origin)}`;
  };

  // YouTube Player API integration
  useEffect(() => {
    if (!gameStarted) return;

    let player: any = null;
    let timeInterval: NodeJS.Timeout;

    // Load YouTube API if not already loaded
    if (!(window as any).YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
    }

    // YouTube API ready callback
    const initPlayer = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        try {
          player = new (window as any).YT.Player('youtube-player', {
            events: {
              onReady: () => {
                console.log('YouTube player ready');
                playerRef.current = player;

                // Start monitoring video time
                timeInterval = setInterval(() => {
                  if (player && player.getCurrentTime && player.getPlayerState) {
                    try {
                      const currentTime = Math.floor(player.getCurrentTime());
                      const playerState = player.getPlayerState();

                      setGameState(prev => {
                        const newState = {
                          ...prev,
                          videoCurrentTime: currentTime,
                          isVideoPlaying: playerState === 1 // 1 = playing
                        };

                        // Check if we need to pause for any question
                        for (let i = 0; i < QUIZ_DATA.length; i++) {
                          const question = QUIZ_DATA[i];
                          if (question &&
                            currentTime >= question.pauseTime &&
                            currentTime <= question.pauseTime + 2 && // 2 second window
                            playerState === 1 &&
                            !prev.isQuestionActive &&
                            !prev.showFeedback &&
                            !prev.questionsAnswered[i]) {
                            player.pauseVideo();

                            // Set up jump detection for first question after 5 seconds
                            if (i === 0) {
                              jumpDetectionTimeoutRef.current = setTimeout(() => {
                                setGameState(prevState => ({
                                  ...prevState,
                                  showJumpDetected: true,
                                  score: prevState.score + 1,
                                  jumpCount: prevState.jumpCount + 1
                                }));

                                // Hide popup after 2 seconds and resume video
                                setTimeout(() => {
                                  setGameState(prevState => {
                                    const newAnswered = [...prevState.questionsAnswered];
                                    newAnswered[0] = true;
                                    return {
                                      ...prevState,
                                      showJumpDetected: false,
                                      isQuestionActive: false,
                                      isVideoPlaying: true,
                                      questionsAnswered: newAnswered
                                    };
                                  });

                                  // Resume video
                                  if (player && player.playVideo) {
                                    player.playVideo();
                                  }
                                }, 2000);
                              }, 5000);
                            }

                            return {
                              ...newState,
                              currentQuestionIndex: i,
                              isVideoPlaying: false,
                              isQuestionActive: true
                            };
                          }
                        }

                        return newState;
                      });
                    } catch (error) {
                      console.warn('Error getting player state:', error);
                    }
                  }
                }, 500); // Check more frequently for better responsiveness
              },
              onStateChange: (event: any) => {
                const playerState = event.data;
                console.log('Player state changed:', playerState);

                // YouTube player states:
                // -1 = unstarted, 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = cued
                switch (playerState) {
                  case 1: // playing
                    setGameState(prev => ({ ...prev, isVideoPlaying: true }));
                    break;
                  case 2: // paused
                    setGameState(prev => ({ ...prev, isVideoPlaying: false }));
                    break;
                  case 0: // ended
                    // Video ended, complete the game
                    setGameState(prev => {
                      const allAnswered = prev.questionsAnswered.every(answered => answered);
                      if (allAnswered) {
                        setTimeout(() => onGameComplete?.(prev.score), 1000);
                      }
                      return prev;
                    });
                    break;
                  case 3: // buffering
                    console.log('Video buffering...');
                    break;
                  case -1: // unstarted
                    console.log('Video unstarted');
                    break;
                  case 5: // cued
                    console.log('Video cued');
                    break;
                }
              },
              onError: (event: any) => {
                console.error('YouTube player error:', event.data);
                const errorMessages: { [key: number]: string } = {
                  2: 'Invalid video ID',
                  5: 'HTML5 player error',
                  100: 'Video not found or private',
                  101: 'Video not available in embedded players',
                  150: 'Video not available in embedded players'
                };
                const errorMessage = errorMessages[event.data] || 'Unknown player error';
                setPlayerError(errorMessage);
              }
            }
          });
        } catch (error) {
          console.error('Error initializing YouTube player:', error);
        }
      }
    };

    // Check if API is ready, otherwise wait for it
    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
      if (jumpDetectionTimeoutRef.current) {
        clearTimeout(jumpDetectionTimeoutRef.current);
      }
      if (player && typeof player.destroy === 'function') {
        try {
          player.destroy();
        } catch (error) {
          console.warn('Error destroying player:', error);
        }
      }
    };
  }, [gameStarted, onGameComplete]); // Added onGameComplete to dependencies

  const currentQuestion = QUIZ_DATA[gameState.currentQuestionIndex];

  // Remove auto-detection - let user control poses

  // Handle hand detection to start the game
  const handleHandRaised = () => {
    if (!gameStarted) {
      setHandDetected(true);
      setGameStarted(true);
      setGameState(prev => ({ ...prev, isVideoPlaying: true }));
    }
  };

  // Handle pose detection for answers
  const handlePoseDetected = (pose: 'jump' | 'squat' | 'clap') => {
    if (!gameState.isQuestionActive || !currentQuestion) return;

    // Skip manual pose detection for first question (we handle it automatically)
    if (gameState.currentQuestionIndex === 0) return;

    // Update pose counters
    setGameState(prev => ({
      ...prev,
      jumpCount: pose === 'jump' ? prev.jumpCount + 1 : prev.jumpCount,
      squatCount: pose === 'squat' ? prev.squatCount + 1 : prev.squatCount,
      clapCount: pose === 'clap' ? prev.clapCount + 1 : prev.clapCount
    }));

    // Check if answer is correct
    const poseToAnswer = { jump: 'A', squat: 'B', clap: 'C' };
    const selectedAnswer = poseToAnswer[pose];
    const isCorrect = selectedAnswer === currentQuestion.correctAns;

    // Mark this question as answered
    const newQuestionsAnswered = [...gameState.questionsAnswered];
    newQuestionsAnswered[gameState.currentQuestionIndex] = true;

    // Update score and show feedback
    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      isQuestionActive: false,
      showFeedback: true,
      lastAnswer: isCorrect ? 'correct' : 'incorrect',
      questionsAnswered: newQuestionsAnswered
    }));

    // Continue video after feedback
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        showFeedback: false,
        lastAnswer: null
      }));

      // Check if all questions are answered
      const allAnswered = newQuestionsAnswered.every(answered => answered);
      if (allAnswered) {
        setTimeout(() => {
          onGameComplete?.(gameState.score + (isCorrect ? 1 : 0));
        }, 2000);
      } else {
        // Resume video
        resumeVideo();
        setGameState(prev => ({ ...prev, isVideoPlaying: true }));
      }
    }, 3000);
  };

  // Remove handleJumpDetected as it's no longer needed

  // Store player reference
  const playerRef = useRef<any>(null);

  // Resume video after question is answered
  const resumeVideo = () => {
    if (playerRef.current && playerRef.current.playVideo) {
      playerRef.current.playVideo();
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-rose-100 to-amber-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-sky-900 mb-4">🎮 Interactive Video Game</h1>
            <p className="text-xl text-sky-700 font-semibold">Raise your hand to start the adventure!</p>
          </div>

          <WebcamView
            onHandRaised={handleHandRaised}
            isWaitingForGesture={!handDetected}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-rose-100 to-amber-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Score Board */}
        <ScoreBoard
          score={gameState.score}
          jumpCount={gameState.jumpCount}
          squatCount={gameState.squatCount}
          clapCount={gameState.clapCount}
          totalQuestions={QUIZ_DATA.length}
          currentQuestion={gameState.questionsAnswered.filter(Boolean).length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Video Section */}
          <div className="space-y-4">
            <div className="rounded-3xl border-4 border-amber-300 bg-white/90 p-4 shadow-xl">
              <div className="aspect-video rounded-2xl overflow-hidden bg-black relative">
                <iframe
                  ref={iframeRef}
                  id="youtube-player"
                  src={getEmbedUrl(videoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="eager"
                  title="Interactive Video Game"
                />

                {/* Loading overlay for better UX */}
                {!gameState.isVideoPlaying && gameState.videoCurrentTime === 0 && !playerError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="font-semibold">Loading video...</p>
                    </div>
                  </div>
                )}

                {/* Error overlay */}
                {playerError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 rounded-2xl">
                    <div className="text-center text-white p-6">
                      <div className="text-4xl mb-4">⚠️</div>
                      <h3 className="text-xl font-bold mb-2">Video Error</h3>
                      <p className="mb-4">{playerError}</p>
                      <button
                        onClick={() => {
                          setPlayerError(null);
                          window.location.reload();
                        }}
                        className="px-4 py-2 bg-white text-red-900 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Status */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${gameState.isVideoPlaying
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
                  }`}>
                  {gameState.isVideoPlaying ? (
                    <>
                      <Play className="h-5 w-5" />
                      Playing
                    </>
                  ) : (
                    <>
                      <Pause className="h-5 w-5" />
                      Paused for Question
                    </>
                  )}
                </div>

                {/* Time Display */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-200 text-blue-800 font-bold">
                  <span>Time: {Math.floor(gameState.videoCurrentTime / 60)}:{(gameState.videoCurrentTime % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>

              {/* Next Question Navigation */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setGameState(prev => ({
                      ...prev,
                      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, QUIZ_DATA.length - 1)
                    }));
                  }}
                  disabled={gameState.currentQuestionIndex >= QUIZ_DATA.length - 1}
                  className={`px-6 py-3 rounded-2xl font-bold transition-all ${gameState.currentQuestionIndex >= QUIZ_DATA.length - 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
                    }`}
                >
                  Next Question ({gameState.currentQuestionIndex + 1}/{QUIZ_DATA.length})
                </button>

                <button
                  onClick={() => {
                    const nextQuestion = QUIZ_DATA[gameState.currentQuestionIndex + 1];
                    if (nextQuestion && playerRef.current) {
                      playerRef.current.seekTo(nextQuestion.pauseTime, true);
                      setGameState(prev => ({
                        ...prev,
                        currentQuestionIndex: prev.currentQuestionIndex + 1,
                        isQuestionActive: true,
                        isVideoPlaying: false
                      }));
                      playerRef.current.pauseVideo();
                    }
                  }}
                  disabled={gameState.currentQuestionIndex >= QUIZ_DATA.length - 1}
                  className={`px-6 py-3 rounded-2xl font-bold transition-all ${gameState.currentQuestionIndex >= QUIZ_DATA.length - 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-200 text-emerald-800 hover:bg-emerald-300'
                    }`}
                >
                  Skip to Next Question
                </button>
              </div>
            </div>
          </div>

          {/* Game Interaction Section */}
          <div className="space-y-4">
            {/* Question Card */}
            {currentQuestion && gameState.isQuestionActive && (
              <div className="rounded-3xl border-4 border-purple-300 bg-white/90 p-6 shadow-xl">


                <div className="text-center mb-6">
                  <h2 className="text-2xl font-black text-purple-800 mb-4">
                    Question {gameState.currentQuestionIndex + 1}
                  </h2>
                  <p className="text-xl font-bold text-purple-700 mb-6">
                    {currentQuestion.question}
                  </p>
                </div>

                {/* Answer Options with Poses */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-4 rounded-2xl border-3 border-red-300 bg-red-50">
                      <span className="font-bold text-red-800">A) {currentQuestion.optA}</span>
                      <div className="flex items-center gap-2 text-red-600">
                        <Zap className="h-5 w-5" />
                        <span className="font-bold">JUMP</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl border-3 border-blue-300 bg-blue-50">
                      <span className="font-bold text-blue-800">B) {currentQuestion.optB}</span>
                      <div className="flex items-center gap-2 text-blue-600">
                        <Target className="h-5 w-5" />
                        <span className="font-bold">SQUAT</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl border-3 border-green-300 bg-green-50">
                      <span className="font-bold text-green-800">C) {currentQuestion.optC}</span>
                      <div className="flex items-center gap-2 text-green-600">
                        <Volume2 className="h-5 w-5" />
                        <span className="font-bold">CLAP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Card */}
            {gameState.showFeedback && (
              <div className={`rounded-3xl border-4 p-6 shadow-xl text-center ${gameState.lastAnswer === 'correct'
                ? 'border-green-300 bg-green-50'
                : 'border-red-300 bg-red-50'
                }`}>
                <div className="text-4xl mb-3">
                  {gameState.lastAnswer === 'correct' ? '🎉' : '😅'}
                </div>
                <h3 className={`text-2xl font-black mb-2 ${gameState.lastAnswer === 'correct' ? 'text-green-800' : 'text-red-800'
                  }`}>
                  {gameState.lastAnswer === 'correct' ? 'Correct!' : 'Try Again!'}
                </h3>
                <p className={`text-lg font-semibold ${gameState.lastAnswer === 'correct' ? 'text-green-700' : 'text-red-700'
                  }`}>
                  {gameState.lastAnswer === 'correct'
                    ? '+1 Point • Great job!'
                    : 'Keep practicing your moves!'
                  }
                </p>
                <p className="text-sm text-gray-600 mt-2">Continuing video...</p>
              </div>
            )}

            {/* Jump Detected Popup */}
            {gameState.showJumpDetected && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="rounded-3xl border-4 border-green-300 bg-green-50 p-8 shadow-2xl text-center max-w-md mx-4">
                  <div className="text-6xl mb-4">🦘</div>
                  <h3 className="text-3xl font-black text-green-800 mb-2">
                    Jump Detected!
                  </h3>
                  <p className="text-xl font-bold text-green-700 mb-2">
                    Correct Answer!
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    +1 Point • Great job!
                  </p>
                </div>
              </div>
            )}

            {/* Pose Detection - Active during questions (except first question which is automatic) */}
            <PoseDetector
              onPoseDetected={handlePoseDetected}
              isActive={gameState.isQuestionActive && gameState.currentQuestionIndex > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}