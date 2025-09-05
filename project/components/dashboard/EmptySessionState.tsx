'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function EmptySessionState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center"
    >
      <div className="w-32 h-32 mx-auto mb-6 relative">
        <Image
          src="/images/no_session_tiger.png"
          alt="No active session"
          fill
          className="object-contain"
          onError={(e) => {
            // Fallback if image doesn't exist
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className="hidden w-full h-full bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full flex items-center justify-center">
          <span className="text-4xl">🐅</span>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Active Sessions</h3>
      <p className="text-gray-600">
        No children are currently playing. Sessions will appear here when they start.
      </p>
    </motion.div>
  );
}