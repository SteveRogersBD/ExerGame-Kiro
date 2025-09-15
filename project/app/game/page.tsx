"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Trophy, AlertCircle, Book, Play } from "lucide-react";
import { WebcamPermission } from "@/components/game/WebcamPermission";
import { WebcamView } from "@/components/game/WebcamView";
import { InteractiveVideoGame } from "@/components/game/InteractiveVideoGame";

// emoji background layer (same as play page)
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

// floating mascots for decoration
function GameMascots() {
  return (
    <>
      {/* happy tiger in top center */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="/images/happy_tigers.png" 
        alt="tiger" 
        className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 hidden md:block" 
        style={{ width: 120, height: 120 }} 
      />
      
      {/* bear on left */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="/images/bear.png" 
        alt="bear" 
        className="pointer-events-none absolute left-4 top-1/3 hidden md:block" 
        style={{ width: 100, height: 100 }} 
      />
      
      {/* eagle on right */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="/images/eagle.png" 
        alt="eagle" 
        className="pointer-events-none absolute right-4 top-1/3 hidden md:block" 
        style={{ width: 100, height: 100 }} 
      />
      
      {/* penguin bottom left */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="/images/penguin.png" 
        alt="penguin" 
        className="pointer-events-none absolute bottom-8 left-8 hidden md:block" 
        style={{ width: 90, height: 90 }} 
      />
      
      {/* monkey bottom right */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="/images/monkey.png" 
        alt="monkey" 
        className="pointer-events-none absolute bottom-8 right-8 hidden md:block" 
        style={{ width: 90, height: 90 }} 
      />
    </>
  );
}

type GameState = 'permission' | 'webcam-setup' | 'waiting-gesture' | 'playing' | 'completed';

export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gameState, setGameState] = useState<GameState>('permission');
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  const itemType = searchParams.get('type');
  const itemId = searchParams.get('id');
  const itemTitle = searchParams.get('title') || 'Game';

  const handleBackToPlay = () => {
    router.push('/play');
  };

  const handlePermissionGranted = () => {
    setPermissionError(null);
    setGameState('webcam-setup');
    // Give a moment for the webcam to initialize, then wait for gesture
    setTimeout(() => {
      setGameState('waiting-gesture');
    }, 2000);
  };

  const handlePermissionDenied = (error: string) => {
    setPermissionError(error);
  };

  const handleHandRaised = () => {
    setGameState('playing');
  };

  const handleCompleteGame = () => {
    setGameState('completed');
    // Auto-return to play after showing completion
    setTimeout(() => {
      router.push('/play');
    }, 3000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-100 via-rose-100 to-amber-100 px-4 py-5">
      {/* emoji background */}
      <EmojiBackground />
      
      {/* floating mascots */}
      <GameMascots />

      {/* header with back button */}
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

      {/* main game content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
        {gameState === 'permission' && (
          /* Camera permission request */
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
          /* Webcam initializing */
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

        {gameState === 'waiting-gesture' && (
          /* Webcam view waiting for hand gesture */
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-black text-sky-900 drop-shadow mb-2">
                {decodeURIComponent(itemTitle)}
              </h1>
              <p className="text-xl text-sky-700 font-medium">
                Raise your hand to start the interactive video game!
              </p>
            </div>
            
            <WebcamView
              onHandRaised={handleHandRaised}
              isWaitingForGesture={true}
            />
          </div>
        )}

        {gameState === 'playing' && (
          /* Interactive Video Game */
          <div className="w-full">
            <InteractiveVideoGame
              videoUrl="https://www.youtube.com/watch?v=L8A4XbM5sXA&t=6s"
              onGameComplete={handleCompleteGame}
            />
          </div>
        )}

        {gameState === 'completed' && (
          /* Game completion screen */
          <div className="text-center max-w-2xl mx-auto">
            <div className="rounded-3xl border-4 border-yellow-300 bg-white/90 p-8 shadow-xl">
              <div className="mb-6 flex justify-center">
                <div className="animate-bounce">
                  <Trophy className="h-20 w-20 text-yellow-500" />
                </div>
              </div>
              
              <h2 className="mb-4 text-4xl font-black text-yellow-700">
                Congratulations! 🎉
              </h2>
              
              <p className="text-xl text-yellow-600 font-medium mb-6">
                You've successfully completed "{decodeURIComponent(itemTitle)}"!
              </p>
              
              <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200 mb-6">
                <p className="text-yellow-700 font-semibold">
                  Great job using motion controls! You're becoming a pro! 🌟
                </p>
              </div>
              
              <p className="text-yellow-600">
                Returning to dashboard in a moment...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}