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