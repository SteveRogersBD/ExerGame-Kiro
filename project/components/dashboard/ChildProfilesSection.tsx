'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Archive, Sparkles, User, Calendar, FileText } from 'lucide-react';
import { ChildProfile } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';
import ChildProfileEditor from './ChildProfileEditor';
import MascotCreator from './MascotCreator';

// Mock data for demonstration
const mockChildren: ChildProfile[] = [
  {
    id: '1',
    name: 'Emma',
    age: 7,
    avatar: '/images/avatars/child1.png',
    healthNotes: 'No known allergies',
    createdAt: new Date('2024-01-15'),
    isArchived: false,
    mascot: {
      name: 'Sparkle',
      image: '/images/mascots/sparkle.png',
      prompt: 'A friendly purple dragon who loves to dance'
    }
  },
  {
    id: '2',
    name: 'Lucas',
    age: 5,
    avatar: '/images/avatars/child2.png',
    healthNotes: 'Wears glasses for reading',
    createdAt: new Date('2024-02-20'),
    isArchived: false
  }
];

export default function ChildProfilesSection() {
  const [children, setChildren] = useState<ChildProfile[]>(mockChildren);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMascotCreator, setShowMascotCreator] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddChild = () => {
    setEditingChild(null);
    setShowAddForm(true);
  };

  const handleEditChild = (child: ChildProfile) => {
    setEditingChild(child);
    setShowAddForm(true);
  };

  const handleArchiveChild = (childId: string) => {
    setChildren(prev => prev.map(child => 
      child.id === childId ? { ...child, isArchived: true } : child
    ));
    toast({
      title: "Child Archived",
      description: "The child profile has been archived successfully.",
    });
  };

  const handleSaveChild = (childData: Partial<ChildProfile>) => {
    if (editingChild) {
      // Update existing child
      setChildren(prev => prev.map(child => 
        child.id === editingChild.id ? { ...child, ...childData } : child
      ));
      toast({
        title: "Profile Updated",
        description: "Child profile has been updated successfully.",
      });
    } else {
      // Add new child
      const newChild: ChildProfile = {
        id: Date.now().toString(),
        name: childData.name || '',
        age: childData.age || 0,
        avatar: childData.avatar || '/images/avatars/child1.png',
        healthNotes: childData.healthNotes,
        createdAt: new Date(),
        isArchived: false
      };
      setChildren(prev => [...prev, newChild]);
      toast({
        title: "Child Added",
        description: "New child profile has been created successfully.",
      });
    }
    setShowAddForm(false);
    setEditingChild(null);
  };

  const handleMascotCreated = (childId: string, mascot: { name: string; image: string; prompt: string }) => {
    setChildren(prev => prev.map(child => 
      child.id === childId ? { ...child, mascot } : child
    ));
    setShowMascotCreator(null);
    toast({
      title: "Mascot Created",
      description: "A new mascot has been created for your child!",
    });
  };

  const activeChildren = children.filter(child => !child.isArchived);

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Children Profiles</h2>
          <p className="text-gray-600 mt-1">Manage your children's profiles and mascots</p>
        </div>
        <motion.button
          onClick={handleAddChild}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} />
          <span>Add Child</span>
        </motion.button>
      </div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {activeChildren.map((child) => (
            <motion.div
              key={child.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              {/* Child Avatar and Basic Info */}
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold">
                  {child.avatar ? (
                    <img src={child.avatar} alt={child.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    child.name.charAt(0).toUpperCase()
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{child.name}</h3>
                <p className="text-gray-600 flex items-center justify-center space-x-1">
                  <Calendar size={14} />
                  <span>{child.age} years old</span>
                </p>
              </div>

              {/* Health Notes */}
              {child.healthNotes && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <FileText size={14} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Health Notes</p>
                      <p className="text-sm text-blue-600">{child.healthNotes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mascot Section */}
              <div className="mb-4">
                {child.mascot ? (
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-800">Mascot: {child.mascot.name}</p>
                        <p className="text-xs text-purple-600">{child.mascot.prompt}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowMascotCreator(child.id)}
                    className="w-full p-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-all"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles size={16} />
                      <span className="text-sm font-medium">Create Mascot</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => handleEditChild(child)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit size={14} />
                  <span className="text-sm">Edit</span>
                </motion.button>
                <motion.button
                  onClick={() => handleArchiveChild(child.id)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Archive size={14} />
                  <span className="text-sm">Archive</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {activeChildren.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <User size={32} className="text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Children Added Yet</h3>
          <p className="text-gray-500 mb-4">Add your first child to get started with WiggleWorld!</p>
          <motion.button
            onClick={handleAddChild}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Your First Child
          </motion.button>
        </div>
      )}

      {/* Child Profile Editor Modal */}
      <AnimatePresence>
        {showAddForm && (
          <ChildProfileEditor
            child={editingChild}
            onSave={handleSaveChild}
            onCancel={() => {
              setShowAddForm(false);
              setEditingChild(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Mascot Creator Modal */}
      <AnimatePresence>
        {showMascotCreator && (
          <MascotCreator
            childId={showMascotCreator}
            childName={children.find(c => c.id === showMascotCreator)?.name || ''}
            onMascotCreated={handleMascotCreated}
            onCancel={() => setShowMascotCreator(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}