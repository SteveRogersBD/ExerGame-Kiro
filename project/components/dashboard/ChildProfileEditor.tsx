'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, User, Calendar, FileText, Camera } from 'lucide-react';
import { ChildProfile } from '@/types/dashboard';

interface ChildProfileEditorProps {
  child: ChildProfile | null;
  onSave: (childData: Partial<ChildProfile>) => void;
  onCancel: () => void;
}

const avatarOptions = [
  '/images/avatars/child1.png',
  '/images/avatars/child2.png',
  '/images/avatars/child3.png',
  '/images/avatars/child1.png', // Reuse for now
  '/images/avatars/child2.png', // Reuse for now
  '/images/avatars/child3.png', // Reuse for now
];

export default function ChildProfileEditor({ child, onSave, onCancel }: ChildProfileEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: 0,
    avatar: '',
    healthNotes: ''
  });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    if (child) {
      setFormData({
        name: child.name,
        age: child.age,
        avatar: child.avatar,
        healthNotes: child.healthNotes || ''
      });
    } else {
      setFormData({
        name: '',
        age: 0,
        avatar: avatarOptions[0],
        healthNotes: ''
      });
    }
  }, [child]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.age > 0) {
      onSave(formData);
    }
  };

  const handleAvatarSelect = (avatar: string) => {
    setFormData(prev => ({ ...prev, avatar }));
    setShowAvatarPicker(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {child ? 'Edit Child Profile' : 'Add New Child'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Selection */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold cursor-pointer hover:shadow-lg transition-all"
                   onClick={() => setShowAvatarPicker(true)}>
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={32} />
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(true)}
                className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:border-purple-300 transition-all"
              >
                <Camera size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Avatar Picker */}
            {showAvatarPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-10 mt-2 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200"
              >
                <div className="grid grid-cols-3 gap-3">
                  {avatarOptions.map((avatar, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAvatarSelect(avatar)}
                      className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${
                        formData.avatar === avatar ? 'border-purple-500 shadow-lg' : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(false)}
                  className="mt-3 w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-all"
                >
                  Close
                </button>
              </motion.div>
            )}
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-2" />
              Child's Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter child's name"
              required
            />
          </div>

          {/* Age Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-2" />
              Age
            </label>
            <input
              type="number"
              value={formData.age || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter child's age"
              min="1"
              max="18"
              required
            />
          </div>

          {/* Health Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Health Notes (Optional)
            </label>
            <textarea
              value={formData.healthNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, healthNotes: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Any health notes, allergies, or special considerations..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!formData.name.trim() || formData.age <= 0}
            >
              {child ? 'Update Profile' : 'Add Child'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}