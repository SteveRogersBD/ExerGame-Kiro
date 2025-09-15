"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Play, Book, Trophy, Star, AlertCircle, Loader2 } from "lucide-react";
import { WebcamPermission } from "@/components/game/WebcamPermission";
import { WebcamView } from "@/components/game/WebcamView";
import { Video, Question } from "@/lib/api/exergame";
import SmartPlayer from "@/components/player/SmartPlayer";

// ---------- emoji background ----------
function EmojiBackground() {
  const emojis = ["⭐", "🌈", "🍎", "🪁", "🧩", "🎈", "🎵", "🍀", "🌟", "🦄"];
  const nodes = Array.from({ length: 60 }).map((_, i) => {
    const left = Math.random() * 100;
    const top = Math.random() * 120;
    const rotate = Math.random() * 40 - 20;
    const scale = 0.8 + Math.random() * 0.8;
    const emoji = emojis[i % emojis.length];
    return (
      <span
        key={i}
        style={{ left: `${left}%`, top: `${top}%`, transform: `rotate(${rotate}deg) scale(${scale})` }}
        className="pointer-events-none absolute select-none opacity-20"
      >
        {emoji}
      </span>
    );
  });
  return <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">{nodes}</div>;
}

// ---------- mascots ----------
function GameMascots() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/happy_tigers.png" alt="tiger"
        className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 hidden md:block"
        style={{ width: 120, height: 120 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/bear.png" alt="bear"
        className="pointer-events-none absolute left-4 top-1/3 hidden md:block"
        style={{ width: 100, height: 100 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/eagle.png" alt="eagle"
        className="pointer-events-none absolute right-4 top-1/3 hidden md:block"
        style={{ width: 100, height: 100 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/penguin.png" alt="penguin"
        className="pointer-events-none absolute bottom-8 left-8 hidden md:block"
        style={{ width: 90, height: 90 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/monkey.png" alt="monkey"
        className="pointer-events-none absolute bottom-8 right-8 hidden md:block"
        style={{ width: 90, height: 90 }} />
    </>
  );
}

type GameState = 'loading' | 'permission' | 'webcam-setup' | 'waiting-gesture' | 'playing' | 'completed';

// Helper to normalize timestamps to seconds
function toSeconds(timestamp: string | number): number {
  if (typeof timestamp === 'number') {
    return timestamp;
  }
  
  const str = timestamp.toString();
  const parts = str.split(':').map(Number);
  
  if (parts.length === 3) {
    // H:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS format
    return parts[0] * 60 + parts[1];
  } else {
    // Assume it's already in seconds
    return parseFloat(str) || 0;
  }
}

// Helper to check if source is iframe-based (YouTube/Vimeo)
function isIframeSource(url: string): boolean {
  return /(?:youtube\.com|youtu\.be|vimeo\.com)/.test(url);
}

export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ---------- state ----------
  const [gameState, setGameState] = useState<GameState>('permission'); // start at permission
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  
  // Question system state
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [showQuestionPopup, setShowQuestionPopup] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [waitingForPose, setWaitingForPose] = useState<"jump" | "squat" | "clap" | null>(null);

  const itemType = searchParams.get('type'); // 'video' | 'homework'
  const itemId = searchParams.get('id');
  const itemTitle = searchParams.get('title') || 'Game';

  const mainVideoRef = useRef<HTMLVideoElement | null>(null);

  // ---------- handlers ----------
  const handleBackToPlay = () => {
    router.push('/play');
  };

  const handlePermissionGranted = () => {
    setPermissionError(null);
    setGameState('webcam-setup');
    // small delay so webcam warms up, then wait for gesture
    const t = setTimeout(() => setGameState('waiting-gesture'), 1200);
    return () => clearTimeout(t);
  };

  const handlePermissionDenied = (error: string) => {
    setPermissionError(error);
  };

  // Gate: on first hand-raise → fetch video (for videos), then start playing
  const handleHandRaised = async () => {
    // Prevent double-trigger while loading
    if (gameState === 'loading' || gameState === 'playing') return;

    // Homework flow doesn't require fetching a video URL first
    if (itemType !== 'video' || !itemId) {
      setVideo(null);
      setVideoError(null);
      setGameState('playing');
      return;
    }

    try {
      setGameState('loading');
      setVideoError(null);

      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";
      const videoUrl = `${API_BASE}/video/${itemId}`;
      
      console.log('Fetching video from:', videoUrl);
      console.log('Item ID:', itemId);
      console.log('Item Type:', itemType);
      
      const res = await fetch(videoUrl);
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log('Error response:', errorText);
        throw new Error(`Failed to fetch video: ${res.status} - ${errorText}`);
      }

      const data: Video = await res.json();
      console.log('Fetched video data:', data);
      setVideo(data);
      setGameState('playing');
    } catch (err) {
      console.error('Video fetch error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to load video';
      setVideoError(msg);
      // allow retry by raising hand again
      setGameState('waiting-gesture');
    }
  };

  const handleCompleteGame = () => {
    setGameState('completed');
    setTimeout(() => router.push('/play'), 2000);
  };

  // Handle pose detection for question answers
  const handlePoseDetected = (poseType: "jump" | "squat" | "clap") => {
    if (!currentQuestion || !showQuestionPopup) return;
    
    console.log(`Detected pose: ${poseType} for question answer`);
    
    // Mark question as answered
    setAnsweredQuestions(prev => new Set([...prev, currentQuestion.id]));
    
    // Clear UI state
    setShowQuestionPopup(false);
    setCurrentQuestion(null);
    setWaitingForPose(null);
    setIsVideoPaused(false);
    
    // Resume main video
    mainVideoRef.current?.play();

    console.log(`Question ${currentQuestion.id} answered with pose: ${poseType}`);
  };

  // Handle option selection (sets which pose to wait for)
  const handleOptionSelect = (option: 'A' | 'B' | 'C') => {
    const poseMap: Record<'A' | 'B' | 'C', "jump" | "squat" | "clap"> = {
      'A': 'jump',
      'B': 'squat', 
      'C': 'clap'
    };
    
    setWaitingForPose(poseMap[option]);
    console.log(`Waiting for ${poseMap[option]} pose for option ${option}`);
  };

  // Handle time progress for interactive questions
  const handleTimeProgress = (currentTime: number) => {
    // Only process if we're playing, no popup visible, and have questions
    if (gameState !== 'playing' || showQuestionPopup || !video?.questions) return;
    
    // Find the first question that should trigger at this time
    const questionToShow = video.questions.find(q => 
      Math.abs(currentTime - toSeconds(q.timeToStop)) < 0.5 && // Within 0.5 seconds of timestamp
      !answeredQuestions.has(q.id) // Not already answered
    );

    if (questionToShow) {
      // Pause the main video
      mainVideoRef.current?.pause();
      setIsVideoPaused(true);
      setShowQuestionPopup(true);
      setCurrentQuestion(questionToShow);
      console.log('Showing question at time:', currentTime, questionToShow);
    }
  };

  // Auto-finish when the main video ends (optional)
  useEffect(() => {
    const v = mainVideoRef.current;
    if (!v) return;
    const onEnd = () => handleCompleteGame();
    v.addEventListener('ended', onEnd);
    return () => v.removeEventListener('ended', onEnd);
  }, [mainVideoRef.current]);



  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-100 via-rose-100 to-amber-100 px-4 py-5">
      <EmojiBackground />
      <GameMascots />

      {/* header */}
      <div className="relative z-10 mb-6 flex items-center justify-between">
        <button
          onClick={handleBackToPlay}
          className="flex items-center gap-2 rounded-2xl border-2 border-sky-200 bg-white/80 px-4 py-2 text-sky-800 hover:bg-white hover:text-sky-900 shadow-lg transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Play
        </button>

        <div className="flex items-center gap-2 rounded-full border-2 border-amber-200 bg-white/80 px-4 py-2 text-amber-700 shadow-lg">
          <Trophy className="h-5 w-5 text-amber-500" />
          <span className="font-semibold">Game Time!</span>
        </div>
      </div>

      {/* main */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
        {gameState === 'permission' && (
          <>
            {permissionError ? (
              <div className="text-center max-w-2xl mx-auto mb-6">
                <div className="rounded-3xl border-4 border-red-300 bg-red-50/80 p-8 shadow-xl">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-red-700 mb-4">Camera Access Required</h2>
                  <p className="text-red-600 mb-6">{permissionError}</p>
                  <button
                    onClick={() => setPermissionError(null)}
                    className="rounded-2xl bg-red-500 hover:bg-red-600 px-6 py-3 text-white font-semibold transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : null}

            <WebcamPermission
              onPermissionGranted={handlePermissionGranted}
              onPermissionDenied={handlePermissionDenied}
            />
          </>
        )}

        {gameState === 'webcam-setup' && (
          <div className="text-center max-w-2xl mx-auto">
            <div className="rounded-3xl border-4 border-sky-300 bg-white/90 p-8 shadow-xl">
              <div className="mb-4 flex justify-center">
                {itemType === 'homework' ? (
                  <Book className="h-16 w-16 text-sky-500" />
                ) : (
                  <Play className="h-16 w-16 text-amber-500" />
                )}
              </div>
              <h1 className="mb-4 text-4xl font-black text-sky-900 drop-shadow">
                {decodeURIComponent(itemTitle)}
              </h1>
              <p className="mb-6 text-xl text-sky-700 font-medium">
                Setting up your camera for interactive gameplay...
              </p>
              <div className="flex items-center justify-center gap-2 text-sky-600">
                <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Initializing camera...</span>
              </div>
            </div>
          </div>
        )}

        {/* WAITING → full webcam with gate */}
        {gameState === 'waiting-gesture' && (
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-black text-sky-900 drop-shadow mb-2">
                {decodeURIComponent(itemTitle)}
              </h1>
              <p className="text-xl text-sky-700 font-medium">
                Raise your hand to start!
              </p>
              {videoError ? (
                <p className="mt-2 text-sm text-red-600">{videoError} — raise your hand to retry.</p>
              ) : null}
            </div>

            {/* Full webcam while waiting; hand raise triggers handleHandRaised */}
            <WebcamView
              onHandRaised={handleHandRaised}
              isWaitingForGesture={true}
              videoId={itemId || undefined}
              showDebugSkeleton={false}
            />
          </div>
        )}

        {/* LOADING → spinner while fetching /video/{id} */}
        {gameState === 'loading' && (
          <div className="text-center max-w-2xl mx-auto">
            <div className="rounded-3xl border-4 border-sky-300 bg-white/90 p-8 shadow-xl">
              <div className="mb-4 flex justify-center">
                <Loader2 className="h-16 w-16 text-sky-500 animate-spin" />
              </div>
              <h1 className="mb-4 text-4xl font-black text-sky-900 drop-shadow">Fetching your video…</h1>
              <p className="mb-6 text-xl text-sky-700 font-medium">Hold still, almost there!</p>
            </div>
          </div>
        )}

        {/* PLAYING → show main video + PiP webcam top-right */}
        {gameState === 'playing' && (
          <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-black text-emerald-800">Playing: {decodeURIComponent(itemTitle)}</h2>
              {videoError ? <p className="mt-2 text-sm text-red-600">{videoError}</p> : null}
            </div>

            {/* main video player */}
            <div className="relative">
              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && video?.url && (
                <div className="mb-2 p-2 bg-blue-100 rounded text-xs text-blue-800">
                  <strong>Video URL:</strong> {video.url}
                  {video.questions && <div><strong>Questions:</strong> {video.questions.length}</div>}
                  {isIframeSource(video.url) && (
                    <div className="text-orange-600 font-semibold">Interactive questions disabled for this source.</div>
                  )}
                </div>
              )}
              
              <SmartPlayer
                src={video?.url}
                videoRef={mainVideoRef}
                autoPlay
                showControls
                onTimeUpdate={handleTimeProgress}
                onEnded={handleCompleteGame}
                className="w-full aspect-video rounded-3xl border-4 border-emerald-300 bg-black shadow-xl"
              />
              
              {/* PiP webcam (kept running) */}
              <div className="absolute right-4 top-4 z-20 w-64">
                <div className="rounded-xl border-2 border-white/70 shadow-lg overflow-hidden bg-white/40 backdrop-blur">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-700 bg-white/70">📹 Your Moves</div>
                  <WebcamView
                    onHandRaised={() => { }}
                    isWaitingForGesture={false}
                    videoId={itemId || undefined}
                    showDebugSkeleton={false}
                    isPiPMode={true}
                    onPoseDetected={handlePoseDetected}
                    waitingForPose={waitingForPose}
                  />
                </div>
              </div>

              {/* Question Popup */}
              {showQuestionPopup && currentQuestion && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
                  <div className="bg-white rounded-3xl border-4 border-purple-300 p-8 max-w-2xl mx-4 shadow-2xl">
                    <div className="text-center mb-6">
                      <h3 className="text-3xl font-black text-purple-800 mb-4">
                        Question Time! 🤔
                      </h3>
                      <p className="text-xl text-gray-700 font-medium leading-relaxed">
                        {currentQuestion.question}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => handleOptionSelect('A')}
                        className={`w-full p-4 rounded-2xl border-3 text-left transition-all ${
                          waitingForPose === 'jump' 
                            ? 'border-green-400 bg-green-50 shadow-lg' 
                            : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl">
                            A
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{currentQuestion.optA}</p>
                            <p className="text-sm text-blue-600 mt-1">🦘 Perform a JUMP to select</p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleOptionSelect('B')}
                        className={`w-full p-4 rounded-2xl border-3 text-left transition-all ${
                          waitingForPose === 'squat' 
                            ? 'border-green-400 bg-green-50 shadow-lg' 
                            : 'border-orange-300 bg-orange-50 hover:bg-orange-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xl">
                            B
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{currentQuestion.optB}</p>
                            <p className="text-sm text-orange-600 mt-1">🏋️ Perform a SQUAT to select</p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleOptionSelect('C')}
                        className={`w-full p-4 rounded-2xl border-3 text-left transition-all ${
                          waitingForPose === 'clap' 
                            ? 'border-green-400 bg-green-50 shadow-lg' 
                            : 'border-purple-300 bg-purple-50 hover:bg-purple-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-xl">
                            C
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{currentQuestion.optC}</p>
                            <p className="text-sm text-purple-600 mt-1">👏 Perform a CLAP to select</p>
                          </div>
                        </div>
                      </button>
                    </div>

                    {waitingForPose && (
                      <div className="mt-6 p-4 bg-green-100 rounded-2xl border-2 border-green-300">
                        <div className="text-center">
                          <p className="text-green-800 font-bold text-lg">
                            Now perform a {waitingForPose.toUpperCase()} in front of the camera! 
                          </p>
                          <p className="text-green-600 text-sm mt-1">
                            The webcam is watching for your move...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* friendly panel + complete */}
            <div className="mt-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="animate-bounce">
                  <Star className="h-20 w-20 text-yellow-500" />
                </div>
              </div>
              <p className="text-xl text-emerald-700 font-medium mb-4">
                Great job! Follow the video and use your moves! 🌟
              </p>
              <button
                onClick={handleCompleteGame}
                className="rounded-3xl bg-gradient-to-r from-purple-400 to-pink-500 px-10 py-3 text-xl font-black text-white shadow-lg hover:from-purple-500 hover:to-pink-600 transform hover:scale-105 transition-all"
              >
                Complete & Return 🏆
              </button>
            </div>
          </div>
        )}

        {gameState === 'completed' && (
          <div className="text-center max-w-2xl mx-auto">
            <div className="rounded-3xl border-4 border-yellow-300 bg-white/90 p-8 shadow-xl">
              <div className="mb-6 flex justify-center">
                <div className="animate-bounce">
                  <Trophy className="h-20 w-20 text-yellow-500" />
                </div>
              </div>
              <h2 className="mb-4 text-4xl font-black text-yellow-700">Congratulations! 🎉</h2>
              <p className="text-xl text-yellow-600 font-medium mb-6">
                You've successfully completed "{decodeURIComponent(itemTitle)}"!
              </p>
              <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200 mb-6">
                <p className="text-yellow-700 font-semibold">
                  Great job using motion controls! You're becoming a pro! 🌟
                </p>
              </div>
              <p className="text-yellow-600">Returning to dashboard in a moment...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
