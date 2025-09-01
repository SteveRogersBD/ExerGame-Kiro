'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import ParentalGate from '@/components/ParentalGate';
import AnimatedBackground from '@/components/AnimatedBackground';
import FloatingAnimations from '@/components/FloatingAnimations';
import CornerAnimations from '@/components/CornerAnimations';
import WelcomeSection from '@/components/WelcomeSection';

export default function Home() {
  const [isParentalGateOpen, setIsParentalGateOpen] = useState(false);

  return (
    <motion.div
      className="min-h-screen font-fredoka relative overflow-x-hidden w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatedBackground />
      <FloatingAnimations />
      <CornerAnimations />
      
      <Header />
      
      <main className="relative z-10 overflow-x-hidden w-full">
        <HeroSection onPlayNow={() => setIsParentalGateOpen(true)} />
        <WelcomeSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FinalCTA />
      </main>
      
      <Footer />
      
      <ParentalGate 
        isOpen={isParentalGateOpen} 
        onClose={() => setIsParentalGateOpen(false)} 
      />
    </motion.div>
  );
}