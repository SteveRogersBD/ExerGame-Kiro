'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MascotCreatorProps {
  childId: string;
  childName: string;
  onMascotCreated: (childId: string, mascot: { name: string; image: string; prompt: string }) => void;
  onCancel: () => void;
}

const mascotPrompts = [
  "A friendly purple dragon who loves to dance and play music",
  "A magical unicorn with rainbow wings who teaches kindness",
  "A playful robot companion who loves solving puzzles",
  "A wise owl wearing glasses who enjoys reading stories",
  "A cheerful bear who loves outdoor adventures and hiking",
  "A colorful parrot who speaks many languages and loves jokes",
  "A gentle elephant who never forgets and loves helping friends",
  "A energetic monkey who loves swinging and playing games"
];

const mascotNames = [
  "Sparkle", "Rainbow", "Buddy", "Wise", "Adventure", "Giggles", "Memory", "Zippy",
  "Luna", "Sunny", "Dash", "Pixel", "Comet", "Whiskers", "Bounce", "Glow"
];

export default function MascotCreator({ childId, childName, onMascotCreated, onCancel }: MascotCreatorProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [mascotName, setMascotName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMascot, setGeneratedMascot] = useState<{ name: string; image: string; prompt: string } | null>(null);
  const { toast } = useToast();

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    setCustomPrompt(prompt);
  };

  const generateRandomName = () => {
    const randomName = mascotNames[Math.floor(Math.random() * mascotNames.length)];
    setMascotName(randomName);
  };

  const handleGenerate = async () => {
    if (!customPrompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a description for the mascot.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a random mascot name if none provided
      const finalName = mascotName.trim() || mascotNames[Math.floor(Math.random() * mascotNames.length)];
      
      // Mock generated mascot (in real implementation, this would call an AI service)
      const mockMascot = {
        name: finalName,
        image: `/images/mascots/generated_${Date.now()}.png`,
        prompt: customPrompt.trim()
      };
      
      setGeneratedMascot(mockMascot);
      toast({
        title: "Mascot Generated!",
        description: `Meet ${finalName}, ${childName}'s new companion!`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate mascot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (generatedMascot) {
      onMascotCreated(childId, generatedMascot);
    }
  };

  const handleRegenerate = () => {
    setGeneratedMascot(null);
    handleGenerate();
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
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Create Mascot</h2>
              <p className="text-sm text-gray-600">for {childName}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!generatedMascot ? (
            <>
              {/* Mascot Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mascot Name (Optional)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={mascotName}
                    onChange={(e) => setMascotName(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter a name or leave blank for random"
                  />
                  <motion.button
                    type="button"
                    onClick={generateRandomName}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Wand2 size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Prompt Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose a Mascot Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mascotPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() => handlePromptSelect(prompt)}
                      className={`p-3 text-left rounded-lg border-2 transition-all ${
                        selectedPrompt === prompt
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <p className="text-sm font-medium">{prompt}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customize Your Mascot
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe your child's perfect mascot companion..."
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be creative! Describe the mascot's appearance, personality, and special abilities.
                </p>
              </div>

              {/* Generate Button */}
              <motion.button
                onClick={handleGenerate}
                disabled={isGenerating || !customPrompt.trim()}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    <span>Generating Mascot...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generate Mascot</span>
                  </>
                )}
              </motion.button>
            </>
          ) : (
            <>
              {/* Generated Mascot Preview */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <Sparkles size={48} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{generatedMascot.name}</h3>
                <p className="text-gray-600 mb-4">{generatedMascot.prompt}</p>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    🎉 Your mascot has been generated! {generatedMascot.name} is ready to be {childName}'s companion in WiggleWorld.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <motion.button
                  onClick={handleRegenerate}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw size={16} />
                  <span>Regenerate</span>
                </motion.button>
                <motion.button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles size={16} />
                  <span>Save Mascot</span>
                </motion.button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}