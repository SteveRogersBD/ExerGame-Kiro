'use client';

import { motion } from 'framer-motion';
import { Plus, Users, Activity, Bell, Brain, BarChart3 } from 'lucide-react';
import EmptyState from './EmptyState';

// Empty state for when no children are added
export function EmptyChildrenState({ onAddChild }: { onAddChild?: () => void }) {
  return (
    <EmptyState
      title="No Children Added Yet"
      description="Add your first child to start tracking their activities and progress in WiggleWorld."
      mascotEmoji="👶"
      action={
        onAddChild && (
          <motion.button
            onClick={onAddChild}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} />
            <span>Add Your First Child</span>
          </motion.button>
        )
      }
    />
  );
}

// Empty state for activity feed
export function EmptyActivityState() {
  return (
    <EmptyState
      title="No Recent Activity"
      description="Activity will appear here once your children start playing and completing sessions."
      mascotEmoji="📊"
    />
  );
}

// Empty state for notifications
export function EmptyNotificationsState() {
  return (
    <EmptyState
      title="No Notifications"
      description="You're all caught up! Notifications about your children's activities will appear here."
      mascotEmoji="🔔"
    />
  );
}

// Empty state for insights when no data is available
export function EmptyInsightsState() {
  return (
    <EmptyState
      title="Building Your Insights"
      description="We need a bit more activity data to provide personalized coaching insights. Keep playing!"
      mascotEmoji="🧠"
    />
  );
}

// Empty state for session history
export function EmptySessionHistoryState() {
  return (
    <EmptyState
      title="No Session History"
      description="Session history will appear here once your children complete their first activities."
      mascotEmoji="📈"
    />
  );
}

// Empty state for quiz scores
export function EmptyQuizScoresState() {
  return (
    <EmptyState
      title="No Quiz Scores Yet"
      description="Quiz scores and completion rates will be displayed here once your children start taking quizzes."
      mascotEmoji="🎯"
    />
  );
}

// Empty state for parental controls when no children exist
export function EmptyControlsState({ onAddChild }: { onAddChild?: () => void }) {
  return (
    <EmptyState
      title="No Children to Manage"
      description="Add children to your account to set up parental controls and screen time limits."
      mascotEmoji="🛡️"
      action={
        onAddChild && (
          <motion.button
            onClick={onAddChild}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Users size={18} />
            <span>Add Child</span>
          </motion.button>
        )
      }
    />
  );
}

// Empty state for search results
export function EmptySearchState({ searchTerm }: { searchTerm: string }) {
  return (
    <EmptyState
      title="No Results Found"
      description={`We couldn't find anything matching "${searchTerm}". Try adjusting your search terms.`}
      mascotEmoji="🔍"
    />
  );
}

// Empty state for archived children
export function EmptyArchivedState() {
  return (
    <EmptyState
      title="No Archived Children"
      description="Children you archive will appear here. You can restore them anytime."
      mascotEmoji="📦"
    />
  );
}