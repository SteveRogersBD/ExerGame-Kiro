'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import LottieWrapper from './LottieWrapper'

interface ParentalModalProps {
  isOpen: boolean
  onClose: () => void
}

const mathQuestions = [
  { question: "What is 7 + 5?", answer: 12 },
  { question: "What is 9 - 3?", answer: 6 },
  { question: "What is 4 × 6?", answer: 24 },
  { question: "What is 15 ÷ 3?", answer: 5 },
  { question: "What is 8 + 12?", answer: 20 }
]

export default function ParentalModal({ isOpen, onClose }: ParentalModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const question = mathQuestions[currentQuestion]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const answer = parseInt(userAnswer)
    
    if (answer === question.answer) {
      setIsCorrect(true)
      setTimeout(() => {
        if (currentQuestion < mathQuestions.length - 1) {
          setCurrentQuestion(prev => prev + 1)
          setUserAnswer('')
          setIsCorrect(null)
        } else {
          setShowSuccess(true)
          setTimeout(() => {
            onClose()
            setShowSuccess(false)
            setCurrentQuestion(0)
            setUserAnswer('')
            setIsCorrect(null)
          }, 2000)
        }
      }, 1000)
    } else {
      setIsCorrect(false)
      setTimeout(() => {
        setIsCorrect(null)
        setUserAnswer('')
      }, 1500)
    }
  }

  const handleClose = () => {
    if (!showSuccess) {
      onClose()
      setCurrentQuestion(0)
      setUserAnswer('')
      setIsCorrect(null)
    }
  }

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-background border border-neonTeal/30 rounded-2xl p-8 shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              disabled={showSuccess}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!showSuccess ? (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🔒</div>
                  <h2 className="text-2xl font-fredoka font-bold text-neonTeal mb-2">
                    Parental Gate
                  </h2>
                  <p className="text-white/70">
                    Please solve this to continue
                  </p>
                </div>

                {/* Question */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">🧮</div>
                  <h3 className="text-xl font-fredoka font-bold text-white mb-4">
                    {question.question}
                  </h3>
                  
                  {/* Progress indicator */}
                  <div className="flex justify-center space-x-2 mb-4">
                    {mathQuestions.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index < currentQuestion 
                            ? 'bg-lime' 
                            : index === currentQuestion 
                            ? 'bg-neonTeal' 
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Answer form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Enter your answer..."
                      className="w-full px-4 py-3 bg-white/10 border-2 border-neonTeal/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neonTeal focus:bg-white/15 transition-all duration-300 text-center text-lg"
                      autoFocus
                      required
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-neonTeal to-neonPink text-white font-bold rounded-lg shadow-lg hover:shadow-neonTeal/50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Submit Answer
                  </motion.button>
                </form>

                {/* Feedback */}
                <AnimatePresence>
                  {isCorrect !== null && (
                    <motion.div
                      className={`text-center mt-4 p-3 rounded-lg ${
                        isCorrect ? 'bg-lime/20 text-lime' : 'bg-neonPink/20 text-neonPink'
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      {isCorrect ? (
                        <div className="flex items-center justify-center gap-2">
                          <span>✅ Correct!</span>
                          <LottieWrapper
                            src="/lottie/Yay Jump.json"
                            className="w-8 h-8"
                            loop={false}
                            autoplay
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>❌ Try again!</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              /* Success state */
              <div className="text-center">
                <div className="text-8xl mb-4">🎉</div>
                <h2 className="text-2xl font-fredoka font-bold text-lime mb-4">
                  Access Granted!
                </h2>
                <p className="text-white/70 mb-6">
                  Welcome to WiggleWorld! Redirecting...
                </p>
                <LottieWrapper
                  src="/lottie/Happy Dog.json"
                  className="w-24 h-24 mx-auto"
                  loop
                  autoplay
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
