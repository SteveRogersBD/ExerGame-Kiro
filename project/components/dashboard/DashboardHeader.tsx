'use client';

import { useState } from 'react';

import { Plus, FileText, User, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NotificationsDropdown from './NotificationsDropdown';
import { useNotifications } from './NotificationService';
import { useToast } from '@/hooks/use-toast';

export default function DashboardHeader() {
  const router = useRouter();
  const { toast } = useToast();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/parent/auth');
  };

  const handleAddChild = () => {
    // TODO: Implement add child functionality
    console.log('Add child clicked');
  };

  const handleCreateQuiz = () => {
    // TODO: Implement create quiz functionality
    console.log('Create quiz clicked');
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  const handleClearAll = () => {
    clearAll();
    toast({
      title: "Notifications cleared",
      description: "All notifications have been cleared.",
    });
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Parent Avatar */}
          <div className="flex items-center space-x-2 sm:space-x-4 ml-12 lg:ml-0">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-xl hover:bg-gray-100/50 transition-colors touch-manipulation"
                aria-label="Open profile menu"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-gray-800">Parent</div>
                  <div className="text-xs text-gray-500">Dashboard</div>
                </div>
              </button>

              {/* Profile dropdown */}
              {showProfileMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 py-2 z-50">
                  <button
                    onClick={() => {
                      router.push('/parent/dashboard/profiles');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 touch-manipulation"
                  >
                    <User size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 touch-manipulation"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Add Child Button */}
            <button
              onClick={handleAddChild}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all touch-manipulation"
              aria-label="Add child"
            >
              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline font-medium text-sm">Add Child</span>
            </button>

            {/* Create Quiz Button */}
            <button
              onClick={handleCreateQuiz}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all touch-manipulation"
              aria-label="Create quiz"
            >
              <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline font-medium text-sm">Create Quiz</span>
            </button>

            {/* Notifications */}
            <NotificationsDropdown
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      </div>

      {/* Click outside to close profile menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
}