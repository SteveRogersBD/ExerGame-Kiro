'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Play, 
  TrendingUp, 
  RefreshCw, 
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { FocusAreaRecommendation, SuggestedVideo, PerformanceAnalysis, CoachingPlan } from '@/types/dashboard';
import FocusAreasSection from '@/components/dashboard/FocusAreasSection';
import SuggestedVideosSection from '@/components/dashboard/SuggestedVideosSection';
import PerformanceAnalysisSection from '@/components/dashboard/PerformanceAnalysisSection';
import CoachingPlanSection from '@/components/dashboard/CoachingPlanSection';
import { EmptyInsightsState } from '@/components/dashboard/EmptyStates';
import LoadingState from '@/components/dashboard/LoadingState';

// Mock data for demonstration
const mockFocusAreas: FocusAreaRecommendation[] = [
  {
    id: '1',
    childId: 'child1',
    area: 'endurance',
    title: 'Build Cardiovascular Endurance',
    description: 'Your child shows great potential but could benefit from longer activity sessions to build stamina.',
    currentLevel: 2,
    targetLevel: 4,
    activities: ['Dance sequences', 'Jumping games', 'Movement challenges'],
    estimatedWeeks: 4,
    priority: 'high'
  },
  {
    id: '2',
    childId: 'child1',
    area: 'balance',
    title: 'Improve Balance & Stability',
    description: 'Recent sessions show some wobbling during single-leg movements. Balance exercises will help.',
    currentLevel: 3,
    targetLevel: 4,
    activities: ['Yoga poses', 'Balance beam games', 'Standing challenges'],
    estimatedWeeks: 3,
    priority: 'medium'
  }
];

const mockSuggestedVideos: SuggestedVideo[] = [
  {
    id: '1',
    title: 'Jungle Adventure Cardio',
    description: 'A fun jungle-themed workout that builds endurance through animal movements.',
    thumbnail: '/images/video-thumb-jungle.jpg',
    duration: 15,
    difficulty: 3,
    category: 'Cardio',
    focusAreas: ['endurance', 'coordination'],
    recommendationReason: 'Perfect for building the cardiovascular endurance identified in your focus areas.'
  },
  {
    id: '2',
    title: 'Wobble Warrior Balance',
    description: 'Master balance with this engaging warrior-themed stability challenge.',
    thumbnail: '/images/video-thumb-balance.jpg',
    duration: 12,
    difficulty: 2,
    category: 'Balance',
    focusAreas: ['balance', 'strength'],
    recommendationReason: 'Specifically designed to improve the balance skills your child is working on.'
  },
  {
    id: '3',
    title: 'Rainbow Dance Party',
    description: 'Colorful dance moves that combine fun with fitness fundamentals.',
    thumbnail: '/images/video-thumb-dance.jpg',
    duration: 20,
    difficulty: 3,
    category: 'Dance',
    focusAreas: ['coordination', 'endurance'],
    recommendationReason: 'Great for maintaining engagement while building endurance.'
  }
];

const mockPerformanceAnalysis: PerformanceAnalysis = {
  id: '1',
  childId: 'child1',
  period: '30d',
  overallScore: 78,
  strengths: [
    'Excellent consistency with daily sessions',
    'Strong improvement in coordination moves',
    'High engagement with dance activities'
  ],
  areasForImprovement: [
    'Session duration could be increased gradually',
    'Balance exercises need more focus',
    'Quiz completion rate could be higher'
  ],
  trends: {
    playTime: 'increasing',
    accuracy: 'improving',
    engagement: 'high'
  },
  insights: [
    'Your child is most active in the afternoon sessions',
    'Dance-based activities show 25% higher completion rates',
    'Accuracy improves significantly after the first 5 minutes of each session'
  ],
  generatedAt: new Date()
};

const mockCoachingPlan: CoachingPlan = {
  id: '1',
  childId: 'child1',
  title: 'Endurance & Balance Builder',
  description: 'A 4-week plan focused on building cardiovascular endurance and improving balance skills.',
  focusAreas: mockFocusAreas,
  suggestedVideos: mockSuggestedVideos,
  weeklyGoals: [
    'Complete 3 endurance-focused sessions',
    'Practice balance exercises daily',
    'Increase session duration by 2 minutes',
    'Maintain 80%+ accuracy in movement tracking'
  ],
  duration: 4,
  isActive: false,
  createdAt: new Date(),
  lastUpdated: new Date()
};

export default function InsightsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<CoachingPlan | null>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setCurrentPlan(mockCoachingPlan);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRegeneratePlan = async () => {
    setIsRegenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRegenerating(false);
    // In real implementation, this would fetch new recommendations
  };

  const handleApplyPlan = async () => {
    if (currentPlan) {
      setCurrentPlan({
        ...currentPlan,
        isActive: true,
        lastUpdated: new Date()
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingState message="Generating AI insights..." size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AI Coaching Insights</h1>
            <p className="text-gray-600">Personalized recommendations for your child's development</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            onClick={handleRegeneratePlan}
            disabled={isRegenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-white/90 hover:bg-white/95 text-gray-700 rounded-lg shadow-md transition-all disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
          </motion.button>

          {currentPlan && !currentPlan.isActive && (
            <motion.button
              onClick={handleApplyPlan}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply Plan</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Current Plan Status */}
      {currentPlan && currentPlan.isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Active Coaching Plan</h3>
              <p className="text-green-700 text-sm">{currentPlan.title} is currently active</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Focus Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FocusAreasSection focusAreas={mockFocusAreas} />
        </motion.div>

        {/* Performance Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PerformanceAnalysisSection analysis={mockPerformanceAnalysis} />
        </motion.div>

        {/* Suggested Videos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <SuggestedVideosSection videos={mockSuggestedVideos} />
        </motion.div>

        {/* Coaching Plan */}
        {currentPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <CoachingPlanSection plan={currentPlan} />
          </motion.div>
        )}
      </div>

      {/* Empty State for No Data */}
      {!currentPlan && (
        <EmptyInsightsState />
      )}
    </div>
  );
}