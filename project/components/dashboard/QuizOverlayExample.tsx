'use client';

import React, { useState } from 'react';
import QuizOverlay from './QuizOverlay';
import { QuizQuestion } from '@/types/dashboard';

const exampleQuiz: QuizQuestion = {
  id: 'example-quiz',
  question: 'Which animal makes this sound: "Roar!"?',
  timeInVideo: 60,
  correctAnswer: 'lion',
  options: [
    { id: 'lion', text: 'Lion', gesture: 'jump' },
    { id: 'elephant', text: 'Elephant', gesture: 'squat' },
    { id: 'monkey', text: 'Monkey', gesture: 'clap' }
  ]
};

export default function QuizOverlayExample() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (optionId: string) => {
    setSelectedAnswer(optionId);
    setShowQuiz(false);
    
    // Show result for 2 seconds
    setTimeout(() => {
      setSelectedAnswer(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          Quiz Overlay System Demo
        </h1>
        
        {!showQuiz && !selectedAnswer && (
          <button
            onClick={() => setShowQuiz(true)}
            className="bg-white text-purple-600 font-bold text-2xl px-8 py-4 rounded-2xl shadow-lg hover:bg-gray-100 transition-colors"
          >
            Show Quiz Overlay
          </button>
        )}
        
        {selectedAnswer && (
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Answer Selected! 🎉
            </h2>
            <p className="text-xl text-gray-600">
              You chose: {exampleQuiz.options.find(opt => opt.id === selectedAnswer)?.text}
            </p>
            <p className="text-lg text-gray-500 mt-2">
              {selectedAnswer === exampleQuiz.correctAnswer ? 'Correct! 🎯' : 'Try again! 💪'}
            </p>
          </div>
        )}
      </div>
      
      <QuizOverlay
        quiz={showQuiz ? exampleQuiz : null}
        isVisible={showQuiz}
        onAnswer={handleAnswer}
      />
    </div>
  );
}