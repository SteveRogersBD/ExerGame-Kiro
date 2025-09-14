'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calculator, Key, Mail } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Lottie Player to avoid SSR issues
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);
import { useRouter } from 'next/navigation';

interface ParentalGateProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ParentalGate({ isOpen, onClose }: ParentalGateProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [mathAnswer, setMathAnswer] = useState('');
  const [pinAnswer, setPinAnswer] = useState('');
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const mathProblem = { question: '23 + 58 = ?', answer: '81' };

  const handleMathSubmit = () => {
    if (mathAnswer === mathProblem.answer) {
      setShowSuccess(true);
    }
  };

  const handlePinSubmit = () => {
    if (pinAnswer === '2468') {
      setShowSuccess(true);
    }
  };

  const handleEmailSubmit = () => {
    if (email.includes('@')) {
      setShowSuccess(true);
    }
  };

  const resetModal = () => {
    setSelectedMethod(null);
    setMathAnswer('');
    setPinAnswer('');
    setEmail('');
    setShowSuccess(false);
  };
  const router = useRouter();
  const handleClose = () => {
    // Set verification flag for route protection
    if (showSuccess) {
      sessionStorage.setItem('parentalGateVerified', 'true');
    }
    resetModal();
    onClose();              // still closes the modal
    router.push("/play");   // change "/play" to your desired route
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Stop Tiger Image at Top */}
        <div className="flex justify-center mb-6 -mt-4">
          <motion.img
            src="/images/stop_tiger.png"
            alt="Stop Tiger"
            className="w-96 h-96 object-contain"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          />
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
{/* if the methods are successful, show this part */}
        {showSuccess ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <div className="w-32 h-32 mx-auto mb-6">
              <Player
                src="/lottie/mascot.json"
                autoplay
                loop
                style={{ height: '100%', width: '100%' }}
              />
            </div>
            <h3 className="text-3xl font-bold text-wiggle-green mb-4">Welcome to WiggleWorld! 🎉</h3>
            <p className="text-lg text-gray-600 mb-6">Get ready for an amazing adventure!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClose}
              className="bg-gradient-to-r from-wiggle-pink to-wiggle-purple text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg"
            >
              Let's Play! 🚀
            </motion.button>
          </motion.div>
        ) : !selectedMethod ? (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ask your parent to unlock WiggleWorld!</h3>
            <p className="text-gray-600 mb-8">Choose how your parent wants to help:</p>
            
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMethod('math')}
                className="w-full bg-wiggle-blue text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg"
              >
                <Calculator size={24} />
                🔢 Solve a Math Problem
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMethod('pin')}
                className="w-full bg-wiggle-green text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg"
              >
                <Key size={24} />
                🔑 Enter PIN
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMethod('email')}
                className="w-full bg-wiggle-pink text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg"
              >
                <Mail size={24} />
                📧 Email Unlock
              </motion.button>
            </div>
          </div>
        ) : selectedMethod === 'math' ? (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Math Challenge! 🧮</h3>
            <div className="bg-wiggle-yellow rounded-2xl p-6 mb-6">
              <p className="text-3xl font-bold text-gray-800">{mathProblem.question}</p>
            </div>
            <input
              type="number"
              value={mathAnswer}
              onChange={(e) => setMathAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="w-full p-4 border-2 border-wiggle-blue rounded-xl text-center text-xl font-bold mb-6"
            />
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMethod(null)}
                className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMathSubmit}
                className="flex-1 bg-wiggle-blue text-white font-bold py-3 px-6 rounded-xl"
              >
                Check Answer
              </motion.button>
            </div>
          </div>
        ) : selectedMethod === 'pin' ? (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Enter Parent PIN 🔑</h3>
            <input
              type="password"
              value={pinAnswer}
              onChange={(e) => setPinAnswer(e.target.value)}
              placeholder="Enter 4-digit PIN"
              maxLength={4}
              className="w-full p-4 border-2 border-wiggle-green rounded-xl text-center text-2xl font-bold mb-6 tracking-widest"
            />
            <p className="text-sm text-gray-500 mb-6">Default PIN: 2468</p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMethod(null)}
                className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePinSubmit}
                className="flex-1 bg-wiggle-green text-white font-bold py-3 px-6 rounded-xl"
              >
                Unlock
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Email Magic Link 📧</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@email.com"
              className="w-full p-4 border-2 border-wiggle-pink rounded-xl text-center text-lg font-bold mb-6"
            />
            <p className="text-sm text-gray-500 mb-6">We'll send a magic link to unlock WiggleWorld</p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMethod(null)}
                className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEmailSubmit}
                className="flex-1 bg-wiggle-pink text-white font-bold py-3 px-6 rounded-xl"
              >
                Send Magic Link
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}