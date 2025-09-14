'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import Lottie Player to avoid SSR issues
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);
import { useState } from 'react';

interface InteractiveLottieProps {
  src: string;
  className?: string;
  size?: string;
}

export default function InteractiveLottie({ 
  src, 
  className = '', 
  size = 'w-16 h-16' 
}: InteractiveLottieProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`${size} ${className} cursor-pointer`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.2,
        rotate: [0, 10, -10, 0],
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.9 }}
      animate={isHovered ? {
        y: [0, -10, 0],
        transition: { duration: 0.5, repeat: Infinity }
      } : {}}
    >
      <Player
        src={src}
        autoplay
        loop
        style={{ height: '100%', width: '100%' }}
      />
    </motion.div>
  );
}