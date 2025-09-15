"use client";

import React from 'react';
import { Trophy, Zap, Target, Volume2, Star } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  jumpCount: number;
  squatCount: number;
  clapCount: number;
  totalQuestions: number;
  currentQuestion: number;
}

export function ScoreBoard({
  score,
  jumpCount,
  squatCount,
  clapCount,
  totalQuestions,
  currentQuestion
}: ScoreBoardProps) {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="rounded-3xl border-4 border-yellow-300 bg-gradient-to-r from-yellow-100 to-orange-100 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-600" />
          <h2 className="text-2xl font-black text-yellow-800">Score Board</h2>
        </div>
        
        <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 border-2 border-yellow-300">
          <Star className="h-5 w-5 text-yellow-600" />
          <span className="font-black text-yellow-800 text-lg">
            {score}/{totalQuestions}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Current Score */}
        <div className="text-center bg-white/80 rounded-2xl p-4 border-2 border-yellow-300">
          <div className="text-3xl font-black text-yellow-700 mb-1">{score}</div>
          <div className="text-sm font-bold text-yellow-600">Correct</div>
          <div className="text-xs text-yellow-500">{percentage}% accuracy</div>
        </div>

        {/* Jump Count */}
        <div className="text-center bg-white/80 rounded-2xl p-4 border-2 border-red-300">
          <div className="flex items-center justify-center mb-2">
            <Zap className="h-6 w-6 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-700 mb-1">{jumpCount}</div>
          <div className="text-sm font-bold text-red-600">Jumps</div>
        </div>

        {/* Squat Count */}
        <div className="text-center bg-white/80 rounded-2xl p-4 border-2 border-blue-300">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 mb-1">{squatCount}</div>
          <div className="text-sm font-bold text-blue-600">Squats</div>
        </div>

        {/* Clap Count */}
        <div className="text-center bg-white/80 rounded-2xl p-4 border-2 border-green-300">
          <div className="flex items-center justify-center mb-2">
            <Volume2 className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-black text-green-700 mb-1">{clapCount}</div>
          <div className="text-sm font-bold text-green-600">Claps</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-yellow-700">Progress</span>
          <span className="text-sm font-bold text-yellow-700">
            Question {currentQuestion}/{totalQuestions}
          </span>
        </div>
        <div className="w-full bg-yellow-200 rounded-full h-3 border-2 border-yellow-300">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0}%`
            }}
          />
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 text-center">
        <div className="bg-white/80 rounded-xl p-3 border-2 border-yellow-300">
          <p className="text-yellow-700 font-bold text-sm">
            {score === totalQuestions && totalQuestions > 0
              ? "🎉 Perfect Score! You're amazing!"
              : score >= totalQuestions * 0.8 && totalQuestions > 0
              ? "⭐ Great job! Keep it up!"
              : score >= totalQuestions * 0.5 && totalQuestions > 0
              ? "👍 Good work! You're doing well!"
              : "💪 Keep trying! You've got this!"
            }
          </p>
        </div>
      </div>
    </div>
  );
}