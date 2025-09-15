import React, { useState } from 'react';
import { Camera, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { requestWebcamPermission, isWebcamSupported } from '@/lib/utils/webcam';

interface WebcamPermissionProps {
  onPermissionGranted: () => void;
  onPermissionDenied: (error: string) => void;
}

export function WebcamPermission({ onPermissionGranted, onPermissionDenied }: WebcamPermissionProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleRequestPermission = async () => {
    if (!isWebcamSupported()) {
      onPermissionDenied('Your browser does not support camera access. Please use a modern browser like Chrome, Firefox, or Safari.');
      return;
    }

    setIsRequesting(true);
    
    try {
      const result = await requestWebcamPermission();
      
      if (result.granted) {
        onPermissionGranted();
      } else {
        onPermissionDenied(result.error || 'Camera permission denied');
      }
    } catch (error) {
      onPermissionDenied('Failed to request camera permission');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto">
      <div className="rounded-3xl border-4 border-sky-300 bg-white/90 p-8 shadow-xl text-center">
        {/* Camera Icon */}
        <div className="mb-6">
          <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-sky-200 to-purple-200 flex items-center justify-center border-4 border-sky-300">
            <Camera className="h-12 w-12 text-sky-600" />
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black text-sky-900 mb-4">
          Camera Permission Needed
        </h2>

        {/* Description */}
        <p className="text-xl text-sky-700 font-medium mb-6 leading-relaxed">
          To play this interactive game, we need access to your camera to detect your hand movements and gestures!
        </p>

        {/* Features */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-center gap-3 text-emerald-700">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <span className="font-medium">Detect hand gestures</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-emerald-700">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <span className="font-medium">Interactive gameplay</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-emerald-700">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <span className="font-medium">Safe and secure</span>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mb-6 p-4 rounded-2xl bg-sky-50 border-2 border-sky-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-sky-500 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold text-sky-800 mb-1">Your Privacy is Protected</p>
              <p className="text-xs text-sky-600">
                Your camera feed stays on your device and is never recorded or shared. 
                We only use it to detect gestures for the game.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleRequestPermission}
            disabled={isRequesting}
            className="w-full rounded-3xl bg-gradient-to-r from-emerald-400 to-green-500 px-8 py-4 text-xl font-black text-white shadow-lg hover:from-emerald-500 hover:to-green-600 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isRequesting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Requesting Permission...
              </div>
            ) : (
              <>Allow Camera Access 📹</>
            )}
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sky-600 hover:text-sky-800 font-medium text-sm underline"
          >
            {showDetails ? 'Hide' : 'Show'} technical details
          </button>
        </div>

        {/* Technical Details */}
        {showDetails && (
          <div className="mt-6 p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 text-left">
            <h4 className="font-semibold text-gray-800 mb-2">Technical Information:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Camera access is requested via WebRTC API</li>
              <li>• Video processing happens locally on your device</li>
              <li>• No data is sent to external servers</li>
              <li>• You can revoke permission anytime in browser settings</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}