'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import Demo from '@/components/Demo'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'
import ParentalModal from '@/components/ParentalModal'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      <Header />
      <Hero onPlayNow={openModal} />
      <HowItWorks />
      <Features />
      <Demo />
      <FinalCTA onJoinNow={openModal} />
      <Footer />
      
      <ParentalModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </main>
  )
}

