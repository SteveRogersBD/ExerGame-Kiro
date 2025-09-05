'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { 
  Home, 
  Activity, 
  Shield, 
  Bell, 
  Users, 
  Brain, 
  Radio,
  Menu,
  X
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const navigationItems: NavigationItem[] = [
  { name: 'Overview', href: '/parent/dashboard', icon: Home },
  { name: 'Activity & Progress', href: '/parent/dashboard/activity', icon: Activity },
  { name: 'Parental Controls', href: '/parent/dashboard/controls', icon: Shield },
  { name: 'Notifications', href: '/parent/dashboard/notifications', icon: Bell },
  { name: 'Profiles', href: '/parent/dashboard/profiles', icon: Users },
  { name: 'AI Insights', href: '/parent/dashboard/insights', icon: Brain },
  { name: 'Live Monitoring', href: '/parent/dashboard/live', icon: Radio },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === '/parent/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg touch-manipulation"
        aria-label="Open navigation menu"
      >
        <Menu size={20} className="text-gray-700" />
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 touch-manipulation"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 sm:w-80 lg:w-64 bg-white/95 backdrop-blur-sm shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          touch-manipulation
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-800 font-fredoka">WiggleWorld</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100/50 touch-manipulation"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    w-full flex items-center space-x-3 px-3 sm:px-4 py-3 sm:py-3 rounded-xl text-left transition-all touch-manipulation
                    ${active 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100/50 hover:text-purple-600 active:bg-gray-200/50'
                    }
                  `}
                >
                  <Icon size={20} className={active ? 'text-white' : 'text-gray-500'} />
                  <span className="font-medium text-sm sm:text-base">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-gray-200/50">
            <div className="text-xs text-gray-500 text-center">
              Parent Dashboard v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
}