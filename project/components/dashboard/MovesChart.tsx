'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MovesChartData } from '@/types/dashboard';

interface MovesChartProps {
  movesByType: Record<string, number>;
}

const moveTypeColors: Record<string, string> = {
  balance: '#8b5cf6',
  jump: '#06b6d4',
  stretch: '#10b981',
  dance: '#f59e0b',
  yoga: '#ef4444',
  cardio: '#ec4899',
};

const moveTypeLabels: Record<string, string> = {
  balance: 'Balance',
  jump: 'Jumping',
  stretch: 'Stretching',
  dance: 'Dancing',
  yoga: 'Yoga',
  cardio: 'Cardio',
};

export default function MovesChart({ movesByType }: MovesChartProps) {
  const data: MovesChartData[] = Object.entries(movesByType).map(([type, count]) => ({
    type: moveTypeLabels[type] || type,
    count,
    accuracy: Math.floor(Math.random() * 20) + 80, // Mock accuracy data
    color: moveTypeColors[type] || '#6b7280',
  }));

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'count') return [`${value} moves`, 'Total Moves'];
    if (name === 'accuracy') return [`${value}%`, 'Accuracy'];
    return [value, name];
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Moves by Type</h3>
        <div className="text-sm text-gray-600">
          Total: {Object.values(movesByType).reduce((sum, count) => sum + count, 0)} moves
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="type" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={formatTooltipValue}
              labelStyle={{ color: '#374151' }}
            />
            <Bar 
              dataKey="count" 
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {data.length === 0 && (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p className="text-lg font-medium">No moves data</p>
            <p className="text-sm">Move statistics will appear here once activities are completed.</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {data.map((item) => (
          <div key={item.type} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">{item.type}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}