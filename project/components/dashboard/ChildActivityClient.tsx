'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { ChildProfile, PerformanceMetrics, SessionTableRow } from '@/types/dashboard';
import PerformanceStats from '@/components/dashboard/PerformanceStats';
import PlayTimeChart from '@/components/dashboard/PlayTimeChart';
import MovesChart from '@/components/dashboard/MovesChart';
import AccuracyChart from '@/components/dashboard/AccuracyChart';
import QuizScores from '@/components/dashboard/QuizScores';
import SessionsTable from '@/components/dashboard/SessionsTable';
import { EmptySessionHistoryState, EmptyQuizScoresState } from '@/components/dashboard/EmptyStates';
import LoadingState, { SkeletonCard, SkeletonChart, SkeletonTable } from '@/components/dashboard/LoadingState';
import ErrorDisplay from '@/components/dashboard/ErrorDisplay';

// Mock data - in a real app, this would come from an API
const mockChildren: ChildProfile[] = [
  {
    id: '1',
    name: 'Emma',
    age: 7,
    avatar: '/images/avatars/child1.png',
    createdAt: new Date(),
    isArchived: false,
  },
  {
    id: '2',
    name: 'Liam',
    age: 5,
    avatar: '/images/avatars/child2.png',
    createdAt: new Date(),
    isArchived: false,
  },
  {
    id: '3',
    name: 'Sophia',
    age: 8,
    avatar: '/images/avatars/child3.png',
    createdAt: new Date(),
    isArchived: false,
  },
];

const mockPerformanceMetrics: Record<string, PerformanceMetrics[]> = {
  '1': [
    {
      childId: '1',
      period: '7d',
      totalPlayTime: 315, // 5h 15m
      movesByType: {
        'balance': 45,
        'jump': 32,
        'stretch': 28,
        'dance': 15,
      },
      averageAccuracy: 87,
      currentStreak: 5,
      quizCompletionRate: 85,
      averageQuizScore: 82,
    },
    {
      childId: '1',
      period: '30d',
      totalPlayTime: 1260, // 21h
      movesByType: {
        'balance': 180,
        'jump': 145,
        'stretch': 120,
        'dance': 85,
      },
      averageAccuracy: 84,
      currentStreak: 5,
      quizCompletionRate: 78,
      averageQuizScore: 79,
    },
  ],
  '2': [
    {
      childId: '2',
      period: '7d',
      totalPlayTime: 210, // 3h 30m
      movesByType: {
        'stretch': 35,
        'balance': 28,
        'jump': 20,
        'dance': 12,
      },
      averageAccuracy: 92,
      currentStreak: 3,
      quizCompletionRate: 90,
      averageQuizScore: 88,
    },
    {
      childId: '2',
      period: '30d',
      totalPlayTime: 900, // 15h
      movesByType: {
        'stretch': 140,
        'balance': 110,
        'jump': 85,
        'dance': 65,
      },
      averageAccuracy: 89,
      currentStreak: 3,
      quizCompletionRate: 85,
      averageQuizScore: 85,
    },
  ],
  '3': [
    {
      childId: '3',
      period: '7d',
      totalPlayTime: 420, // 7h
      movesByType: {
        'dance': 55,
        'jump': 42,
        'balance': 38,
        'stretch': 25,
      },
      averageAccuracy: 81,
      currentStreak: 7,
      quizCompletionRate: 75,
      averageQuizScore: 76,
    },
    {
      childId: '3',
      period: '30d',
      totalPlayTime: 1680, // 28h
      movesByType: {
        'dance': 220,
        'jump': 180,
        'balance': 155,
        'stretch': 125,
      },
      averageAccuracy: 79,
      currentStreak: 7,
      quizCompletionRate: 72,
      averageQuizScore: 74,
    },
  ],
};

const mockRecentSessions: Record<string, SessionTableRow[]> = {
  '1': [
    {
      id: 'session-1',
      date: '2025-01-05',
      duration: 25,
      moves: 18,
      accuracy: 89,
      score: 85,
      contentTitle: 'Balance Adventure',
    },
    {
      id: 'session-2',
      date: '2025-01-04',
      duration: 30,
      moves: 22,
      accuracy: 92,
      score: 88,
      contentTitle: 'Yoga Flow for Kids',
    },
    {
      id: 'session-3',
      date: '2025-01-03',
      duration: 20,
      moves: 15,
      accuracy: 85,
      score: 82,
      contentTitle: 'Dance Party',
    },
  ],
  '2': [
    {
      id: 'session-4',
      date: '2025-01-05',
      duration: 20,
      moves: 12,
      accuracy: 95,
      score: 92,
      contentTitle: 'Gentle Stretches',
    },
    {
      id: 'session-5',
      date: '2025-01-04',
      duration: 25,
      moves: 16,
      accuracy: 88,
      score: 85,
      contentTitle: 'Balance Challenge',
    },
  ],
  '3': [
    {
      id: 'session-6',
      date: '2025-01-05',
      duration: 35,
      moves: 28,
      accuracy: 78,
      score: 75,
      contentTitle: 'High Energy Dance',
    },
    {
      id: 'session-7',
      date: '2025-01-04',
      duration: 40,
      moves: 32,
      accuracy: 82,
      score: 79,
      contentTitle: 'Jump & Move',
    },
  ],
};

interface ChildActivityClientProps {
  childId: string;
}

export default function ChildActivityClient({ childId }: ChildActivityClientProps) {
  const router = useRouter();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d'>('7d');
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch child data
    const fetchChildData = async () => {
      setIsLoading(true);
      try {
        // Find child
        const foundChild = mockChildren.find(c => c.id === childId);
        if (!foundChild) {
          router.push('/parent/dashboard');
          return;
        }
        
        setChild(foundChild);
        setPerformanceMetrics(mockPerformanceMetrics[childId] || []);
        setRecentSessions(mockRecentSessions[childId] || []);
      } catch (error) {
        console.error('Error fetching child data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (childId) {
      fetchChildData();
    }
  }, [childId, router]);

  const currentMetrics = performanceMetrics.find(m => m.period === selectedPeriod);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState message="Loading activity data..." size="lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
        <SkeletonTable />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700">Child not found</h2>
          <p className="text-gray-500 mt-2">The requested child profile could not be found.</p>
          <button
            onClick={() => router.push('/parent/dashboard')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <button
            onClick={() => router.push('/parent/dashboard')}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors touch-manipulation flex-shrink-0"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} className="text-gray-600 sm:w-5 sm:h-5" />
          </button>
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <Image
              src={child.avatar}
              alt={child.name}
              width={32}
              height={32}
              className="rounded-full sm:w-10 sm:h-10 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate">{child.name}'s Activity</h1>
              <p className="text-sm sm:text-base text-gray-600">Age {child.age}</p>
            </div>
          </div>
        </div>
        
        {/* Period Selector */}
        <div className="flex bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setSelectedPeriod('7d')}
            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
              selectedPeriod === '7d'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setSelectedPeriod('30d')}
            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
              selectedPeriod === '30d'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </motion.div>

      {/* Performance Stats */}
      {currentMetrics && (
        <PerformanceStats metrics={currentMetrics} />
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {currentMetrics && (
          <>
            <PlayTimeChart childId={childId} period={selectedPeriod} />
            <MovesChart movesByType={currentMetrics.movesByType} />
          </>
        )}
      </div>

      {/* Accuracy and Quiz Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {currentMetrics && (
          <>
            <AccuracyChart childId={childId} period={selectedPeriod} />
            <QuizScores 
              completionRate={currentMetrics.quizCompletionRate}
              averageScore={currentMetrics.averageQuizScore}
            />
          </>
        )}
      </div>

      {/* Recent Sessions Table */}
      {recentSessions.length > 0 ? (
        <SessionsTable sessions={recentSessions} />
      ) : (
        <EmptySessionHistoryState />
      )}
    </div>
  );
}