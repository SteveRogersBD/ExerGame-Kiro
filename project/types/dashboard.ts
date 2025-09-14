// Dashboard Data Models

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  healthNotes?: string;
  createdAt: Date;
  isArchived: boolean;
  mascot?: {
    name: string;
    image: string;
    prompt: string;
  };
}

// Extended child profile for dashboard display
export interface ChildCardData extends ChildProfile {
  todayPlayTime: number; // in minutes
  status: 'active' | 'offline' | 'paused';
}

export interface Session {
  id: string;
  childId: string;
  contentTitle: string;
  contentThumbnail: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  moves: {
    type: string;
    count: number;
    accuracy: number;
  }[];
  quizScore?: number;
  status: 'active' | 'paused' | 'completed';
}

export interface PerformanceMetrics {
  childId: string;
  period: '7d' | '30d';
  totalPlayTime: number;
  movesByType: Record<string, number>;
  averageAccuracy: number;
  currentStreak: number;
  quizCompletionRate: number;
  averageQuizScore: number;
}

export interface ParentProfile {
  id: string;
  fullName: string;
  email: string;
  username?: string;
  avatar?: string;
  createdAt: Date;
  preferences: {
    notifications: {
      sessionStart: boolean;
      sessionMilestones: boolean;
      screenTimeWarnings: boolean;
      weeklyReports: boolean;
    };
    screenTimeLimits: Record<string, number>; // childId -> minutes per day
  };
}

// Screen time and parental control types
export interface ScreenTimeLimit {
  childId: string;
  dailyLimitMinutes: number;
  weeklyLimitMinutes: number;
  bedtimeStart: string; // HH:MM format
  bedtimeEnd: string; // HH:MM format
  allowedDays: string[]; // ['monday', 'tuesday', etc.]
  isEnabled: boolean;
}

export interface ChildRestriction {
  childId: string;
  contentFilters: {
    maxDifficulty: number; // 1-5 scale
    blockedCategories: string[];
    allowedCategories: string[];
  };
  sessionControls: {
    requireParentApproval: boolean;
    maxSessionDuration: number; // minutes
    breakReminders: boolean;
    breakInterval: number; // minutes
  };
  isEnabled: boolean;
}

export interface ScreenTimeUsage {
  childId: string;
  date: string; // YYYY-MM-DD
  totalMinutes: number;
  sessionCount: number;
  lastSessionEnd?: Date;
  isLimitReached: boolean;
  warningsSent: number;
}

export interface Notification {
  id: string;
  type: 'session_start' | 'session_milestone' | 'screen_time_warning' | 'weekly_report';
  title: string;
  message: string;
  childId?: string;
  createdAt: Date;
  isRead: boolean;
}

export interface NotificationPreferences {
  sessionStart: boolean;
  sessionMilestones: boolean;
  screenTimeWarnings: boolean;
  weeklyReports: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
}

export interface CoachingInsight {
  id: string;
  childId: string;
  type: 'focus_area' | 'suggested_video' | 'performance_analysis';
  title: string;
  description: string;
  recommendations: string[];
  createdAt: Date;
  isApplied: boolean;
}

export interface FocusAreaRecommendation {
  id: string;
  childId: string;
  area: 'endurance' | 'balance' | 'coordination' | 'strength';
  title: string;
  description: string;
  currentLevel: number; // 1-5 scale
  targetLevel: number;
  activities: string[];
  estimatedWeeks: number;
  priority: 'high' | 'medium' | 'low';
}

export interface SuggestedVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number; // in minutes
  difficulty: number; // 1-5 scale
  category: string;
  focusAreas: string[];
  recommendationReason: string;
}

export interface PerformanceAnalysis {
  id: string;
  childId: string;
  period: '7d' | '30d';
  overallScore: number; // 1-100
  strengths: string[];
  areasForImprovement: string[];
  trends: {
    playTime: 'increasing' | 'decreasing' | 'stable';
    accuracy: 'improving' | 'declining' | 'stable';
    engagement: 'high' | 'medium' | 'low';
  };
  insights: string[];
  generatedAt: Date;
}

export interface CoachingPlan {
  id: string;
  childId: string;
  title: string;
  description: string;
  focusAreas: FocusAreaRecommendation[];
  suggestedVideos: SuggestedVideo[];
  weeklyGoals: string[];
  duration: number; // in weeks
  isActive: boolean;
  createdAt: Date;
  lastUpdated: Date;
}

export interface DashboardStats {
  totalChildren: number;
  activeSessionsCount: number;
  todayPlayTime: number;
  weeklyPlayTime: number;
  recentActivities: Session[];
}

// Navigation and UI types
export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

export interface DashboardContextType {
  children: ChildProfile[];
  activeSessions: Session[];
  notifications: Notification[];
  parentProfile: ParentProfile | null;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

// Chart data types for analytics
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface MovesChartData {
  type: string;
  count: number;
  accuracy: number;
  color: string;
}

export interface SessionTableRow {
  id: string;
  date: string;
  duration: number;
  moves: number;
  accuracy: number;
  score?: number;
  contentTitle: string;
}

// Activity feed item combining session and child data
export interface ActivityFeedItem {
  session: Session;
  child: ChildProfile;
}

// Kids Dashboard Types - for the child-facing interface

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string; // YouTube URL for now
  duration: number; // in seconds
  quizQuestions: QuizQuestion[];
  completionReward: Badge;
}

export interface HomeworkItem {
  id: string;
  title: string;
  icon: string;
  status: 'not_started' | 'in_progress' | 'completed';
  assignedBy: string; // Parent name
  video: Video;
  dueDate?: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  timeInVideo: number; // When to pause video (in seconds)
}

export interface QuizOption {
  id: string;
  text: string;
  gesture: 'jump' | 'squat' | 'clap';
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  earnedAt?: Date;
  category: 'video' | 'homework' | 'streak';
}

// Kids Dashboard State Management
export interface KidsDashboardState {
  user: {
    name: string;
    avatar: string;
    badges: Badge[];
    streak: number;
  };
  content: {
    presetVideos: Video[];
    homework: HomeworkItem[];
  };
  ui: {
    currentView: 'dashboard' | 'video' | 'homework' | 'badges' | 'help';
    isLoading: boolean;
    mascotMessage: string;
    backgroundTheme: 'sky' | 'forest' | 'space';
  };
}

// Placeholder data arrays for development
export const PLACEHOLDER_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'Counting Adventure',
    thumbnail: '/images/content/counting-thumb.jpg',
    url: 'https://youtube.com/watch?v=placeholder1',
    duration: 300, // 5 minutes
    quizQuestions: [
      {
        id: 'q1',
        question: 'How many apples did we count?',
        timeInVideo: 120, // 2 minutes in
        options: [
          { id: 'a1', text: '5 apples', gesture: 'jump' },
          { id: 'a2', text: '3 apples', gesture: 'squat' },
          { id: 'a3', text: '7 apples', gesture: 'clap' }
        ],
        correctAnswer: 'a1'
      },
      {
        id: 'q2',
        question: 'What color were the balloons?',
        timeInVideo: 240, // 4 minutes in
        options: [
          { id: 'b1', text: 'Red balloons', gesture: 'jump' },
          { id: 'b2', text: 'Blue balloons', gesture: 'squat' },
          { id: 'b3', text: 'Yellow balloons', gesture: 'clap' }
        ],
        correctAnswer: 'b2'
      }
    ],
    completionReward: {
      id: 'b1',
      name: 'Math Master',
      icon: '🔢',
      category: 'video'
    }
  },
  {
    id: 'v2',
    title: 'Animal Dance Party',
    thumbnail: '/images/content/animals-thumb.jpg',
    url: 'https://youtube.com/watch?v=placeholder2',
    duration: 420, // 7 minutes
    quizQuestions: [
      {
        id: 'q3',
        question: 'Which animal hops like this?',
        timeInVideo: 180,
        options: [
          { id: 'c1', text: 'Bunny rabbit', gesture: 'jump' },
          { id: 'c2', text: 'Elephant', gesture: 'squat' },
          { id: 'c3', text: 'Bird', gesture: 'clap' }
        ],
        correctAnswer: 'c1'
      }
    ],
    completionReward: {
      id: 'b2',
      name: 'Animal Expert',
      icon: '🐾',
      category: 'video'
    }
  },
  {
    id: 'v3',
    title: 'Space Explorer',
    thumbnail: '/images/content/space-thumb.jpg',
    url: 'https://youtube.com/watch?v=placeholder3',
    duration: 360, // 6 minutes
    quizQuestions: [
      {
        id: 'q4',
        question: 'How many planets did we visit?',
        timeInVideo: 200,
        options: [
          { id: 'd1', text: '3 planets', gesture: 'jump' },
          { id: 'd2', text: '5 planets', gesture: 'squat' },
          { id: 'd3', text: '2 planets', gesture: 'clap' }
        ],
        correctAnswer: 'd1'
      }
    ],
    completionReward: {
      id: 'b3',
      name: 'Space Cadet',
      icon: '🚀',
      category: 'video'
    }
  }
];

export const PLACEHOLDER_HOMEWORK: HomeworkItem[] = [
  {
    id: 'h1',
    title: 'Dora Episode Quiz',
    icon: '🗺️',
    status: 'not_started',
    assignedBy: 'Mom',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    video: {
      id: 'h1v1',
      title: 'Dora the Explorer - Map Reading',
      thumbnail: '/images/content/dora-thumb.jpg',
      url: 'https://youtube.com/watch?v=dora-placeholder',
      duration: 480, // 8 minutes
      quizQuestions: [
        {
          id: 'hq1',
          question: 'Which direction should we go?',
          timeInVideo: 240,
          options: [
            { id: 'ha1', text: 'Left path', gesture: 'jump' },
            { id: 'ha2', text: 'Right path', gesture: 'squat' },
            { id: 'ha3', text: 'Straight ahead', gesture: 'clap' }
          ],
          correctAnswer: 'ha2'
        }
      ],
      completionReward: {
        id: 'hb1',
        name: 'Explorer Badge',
        icon: '🧭',
        category: 'homework'
      }
    }
  },
  {
    id: 'h2',
    title: 'Alphabet Song Practice',
    icon: '🔤',
    status: 'in_progress',
    assignedBy: 'Dad',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    video: {
      id: 'h2v1',
      title: 'ABC Song with Actions',
      thumbnail: '/images/content/abc-thumb.jpg',
      url: 'https://youtube.com/watch?v=abc-placeholder',
      duration: 240, // 4 minutes
      quizQuestions: [
        {
          id: 'hq2',
          question: 'What letter comes after M?',
          timeInVideo: 120,
          options: [
            { id: 'hb1', text: 'Letter N', gesture: 'jump' },
            { id: 'hb2', text: 'Letter O', gesture: 'squat' },
            { id: 'hb3', text: 'Letter L', gesture: 'clap' }
          ],
          correctAnswer: 'hb1'
        }
      ],
      completionReward: {
        id: 'hb2',
        name: 'ABC Master',
        icon: '📚',
        category: 'homework'
      }
    }
  },
  {
    id: 'h3',
    title: 'Color Mixing Fun',
    icon: '🎨',
    status: 'completed',
    assignedBy: 'Mom',
    video: {
      id: 'h3v1',
      title: 'Primary Colors Adventure',
      thumbnail: '/images/content/colors-thumb.jpg',
      url: 'https://youtube.com/watch?v=colors-placeholder',
      duration: 300, // 5 minutes
      quizQuestions: [
        {
          id: 'hq3',
          question: 'What color do we get when we mix red and blue?',
          timeInVideo: 180,
          options: [
            { id: 'hc1', text: 'Purple', gesture: 'jump' },
            { id: 'hc2', text: 'Green', gesture: 'squat' },
            { id: 'hc3', text: 'Orange', gesture: 'clap' }
          ],
          correctAnswer: 'hc1'
        }
      ],
      completionReward: {
        id: 'hb3',
        name: 'Color Artist',
        icon: '🌈',
        category: 'homework'
      }
    }
  }
];

// Initial state for kids dashboard
export const INITIAL_KIDS_DASHBOARD_STATE: KidsDashboardState = {
  user: {
    name: 'Alex',
    avatar: '/images/avatars/child-avatar-1.png',
    badges: [
      {
        id: 'starter',
        name: 'First Steps',
        icon: '⭐',
        earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        category: 'streak'
      },
      {
        id: 'math-master',
        name: 'Math Master',
        icon: '🔢',
        earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        category: 'video'
      },
      {
        id: 'homework-hero',
        name: 'Homework Hero',
        icon: '📚',
        earnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        category: 'homework'
      },
      {
        id: 'new-badge',
        name: 'Super Star',
        icon: '🌟',
        earnedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago (newly earned)
        category: 'video'
      }
    ],
    streak: 3
  },
  content: {
    presetVideos: PLACEHOLDER_VIDEOS,
    homework: PLACEHOLDER_HOMEWORK
  },
  ui: {
    currentView: 'dashboard',
    isLoading: false,
    mascotMessage: 'Welcome back! Ready to learn and play?',
    backgroundTheme: 'sky'
  }
};