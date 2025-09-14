'use client';

import { motion } from 'framer-motion';

export default function DashboardHeader() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-3 lg:px-6 lg:py-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
            Parent Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Monitor your child's learning progress
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Placeholder for future parent header features */}
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            👤
          </div>
        </div>
      </div>
    </motion.header>
  );
}