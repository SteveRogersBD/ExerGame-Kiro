"use client";

import React, { useState } from 'react';
import { Camera, Shield, Play } from 'lucide-react';

interface WebcamPermissionProps {
  onPermissionGranted: () => void;
  onPermissionDenied: (error: string) => void;
}

export function WebcamPermission({ onPermissionGranted, onPermissionDenied }: WebcamPermissionProps) {
  const [isRequesting, setIsRequesting] = useState(false);

  const requestPermission = async () => {
    setIsRequesting(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      // Stop the stream immediately - we just needed to check permission
      stream.getTracks().forEach(track => track.stop());
      
      onPermissionGranted();
    } catch (error) {
      let errorMessage = 'Camera access denied';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access and refresh the page.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please connect a camera and try again.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera is already in use by another application.';
        } else {
          errorMessage = `Camera error: ${error.message}`;
        }
      }
      
      onPermissionDenied(errorMessage);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="rounded-3xl border-4 border-sky-300 bg-white/90 p-8 shadow-xl">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Camera className="h-20 w-20 text-sky-500" />
            <Shield className="h-8 w-8 text-emerald-500 absolute -top-2 -right-2 bg-white rounded-full p-1" />
          </div>
        </div>
        
        <h1 className="mb-4 text-4xl font-black text-sky-900 drop-shadow">
          Camera Permission Required
        </h1>
        
        <p className="mb-6 text-xl text-sky-700 font-medium">
          This interactive game uses your camera to detect hand gestures and body movements. 
          Your camera feed stays on your device and is never recorded or shared.
        </p>
        
        <div className="mb-6 bg-sky-50 rounded-2xl p-6 border-2 border-sky-200">
          <h3 className="text-lg font-bold text-sky-800 mb-3">What we'll detect:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">🖐️</div>
              <p className="font-semibold text-sky-700">Hand Raises</p>
              <p className="text-sky-600">To start the game</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🦘</div>
              <p className="font-semibold text-sky-700">Jumping</p>
              <p className="text-sky-600">For option A</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🏋️</div>
              <p className="font-semibold text-sky-700">Squatting</p>
              <p className="text-sky-600">For option B</p>
            </div>
          </div>
          <div className="text-center mt-4">
            <div className="text-2xl mb-2">👏</div>
            <p className="font-semibold text-sky-700">Clapping</p>
            <p className="text-sky-600">For option C</p>
          </div>
        </div>
        
        <button
          onClick={requestPermission}
          disabled={isRequesting}
          className="rounded-3xl bg-gradient-to-r from-sky-400 to-emerald-500 px-10 py-4 text-xl font-black text-white shadow-lg hover:from-sky-500 hover:to-emerald-600 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isRequesting ? (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Requesting Permission...
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Play className="h-6 w-6" />
              Allow Camera & Start Game
            </div>
          )}
        </button>
        
        <div className="mt-4 text-sm text-sky-600 bg-sky-50 rounded-xl p-3 border-2 border-sky-200">
          <p className="font-semibold mb-1">🔒 Privacy Notice</p>
          <p>Your camera feed is processed locally on your device. No video data is sent to our servers or stored anywhere.</p>
        </div>
      </div>
    </div>
  );
}