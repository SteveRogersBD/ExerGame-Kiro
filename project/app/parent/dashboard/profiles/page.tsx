'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, User, Settings } from 'lucide-react';
import ChildProfilesSection from '@/components/dashboard/ChildProfilesSection';
import ParentProfileSection from '@/components/dashboard/ParentProfileSection';

export default function ProfilesPage() {
  const [activeTab, setActiveTab] = useState<'children' | 'parent'>('children');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Profiles</h1>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('children')}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
              ${activeTab === 'children'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-purple-600 hover:bg-gray-100/50'
              }
            `}
          >
            <User size={18} />
            <span>Children Profiles</span>
          </button>
          <button
            onClick={() => setActiveTab('parent')}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
              ${activeTab === 'parent'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-purple-600 hover:bg-gray-100/50'
              }
            `}
          >
            <Settings size={18} />
            <span>Parent Profile</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'children' ? (
          <ChildProfilesSection />
        ) : (
          <ParentProfileSection />
        )}
      </motion.div>
    </div>
  );
}