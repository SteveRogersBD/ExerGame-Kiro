'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '@/types/dashboard';

interface AccuracyChartProps {
  childId: string;
  period: '7d' | '30d';
}

// Mock accuracy data - in a real app, this would come from an API
const mockAccuracyData: Record<string, Record<string, ChartDataPoint[]>> = {
  '1': {
    '7d': [
      { date: '2025-01-01', value: 85, label: 'Jan 1' },
      { date: '2025-01-02', value: 88, label: 'Jan 2' },
      { date: '2025-01-03', value: 82, label: 'Jan 3' },
      { date: '2025-01-04', value: 92, label: 'Jan 4' },
      { date: '2025-01-05', value: 89, label: 'Jan 5' },
      { date: '2025-01-06', value: 87, label: 'Jan 6' },
      { date: '2025-01-07', value: 91, label: 'Jan 7' },
    ],
    '30d': [
      { date: '2024-12-08', value: 82, label: 'Dec 8' },
      { date: '2024-12-15', value: 84, label: 'Dec 15' },
      { date: '2024-12-22', value: 86, label: 'Dec 22' },
      { date: '2024-12-29', value: 85, label: 'Dec 29' },
      { date: '2025-01-05', value: 87, label: 'Jan 5' },
    ],
  },
  '2': {
    '7d': [
      { date: '2025-01-01', value: 90, label: 'Jan 1' },
      { date: '2025-01-02', value: 93, label: 'Jan 2' },
      { date: '2025-01-03', value: 88, label: 'Jan 3' },
      { date: '2025-01-04', value: 95, label: 'Jan 4' },
      { date: '2025-01-05', value: 92, label: 'Jan 5' },
      { date: '2025-01-06', value: 91, label: 'Jan 6' },
      { date: '2025-01-07', value: 94, label: 'Jan 7' },
    ],
    '30d': [
      { date: '2024-12-08', value: 88, label: 'Dec 8' },
      { date: '2024-12-15', value: 89, label: 'Dec 15' },
      { date: '2024-12-22', value: 91, label: 'Dec 22' },
      { date: '2024-12-29', value: 90, label: 'Dec 29' },
      { date: '2025-01-05', value: 92, label: 'Jan 5' },
    ],
  },
  '3': {
    '7d': [
      { date: '2025-01-01', value: 78, label: 'Jan 1' },
      { date: '2025-01-02', value: 82, label: 'Jan 2' },
      { date: '2025-01-03', value: 75, label: 'Jan 3' },
      { date: '2025-01-04', value: 85, label: 'Jan 4' },
      { date: '2025-01-05', value: 81, label: 'Jan 5' },
      { date: '2025-01-06', value: 79, label: 'Jan 6' },
      { date: '2025-01-07', value: 83, label: 'Jan 7' },
    ],
    '30d': [
      { date: '2024-12-08', value: 76, label: 'Dec 8' },
      { date: '2024-12-15', value: 78, label: 'Dec 15' },
      { date: '2024-12-22', value: 80, label: 'Dec 22' },
      { date: '2024-12-29', value: 79, label: 'Dec 29' },
      { date: '2025-01-05', value: 81, label: 'Jan 5' },
    ],
  },
};

export default function AccuracyChart({ childId, period }: AccuracyChartProps) {
  const data = mockAccuracyData[childId]?.[period] || [];

  const formatTooltipValue = (value: number) => {
    return `${value}%`;
  };

  const averageAccuracy = data.length > 0 
    ? Math.round(data.reduce((sum, point) => sum + point.value, 0) / data.length)
    : 0;

  const accuracyTrend = data.length >= 2 
    ? data[data.length - 1].value - data[0].value
    : 0;

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return '#10b981'; // green
    if (accuracy >= 80) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Accuracy Tracking</h3>
        <div className="text-sm text-gray-600">
          Avg: <span 
            className="font-semibold"
            style={{ color: getAccuracyColor(averageAccuracy) }}
          >
            {averageAccuracy}%
          </span>
          {accuracyTrend !== 0 && (
            <span className={`ml-2 ${accuracyTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {accuracyTrend > 0 ? '↗' : '↘'} {Math.abs(Math.round(accuracyTrend))}%
            </span>
          )}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="label" 
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
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value) => [formatTooltipValue(value as number), 'Accuracy']}
              labelStyle={{ color: '#374151' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {data.length === 0 && (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p className="text-lg font-medium">No accuracy data</p>
            <p className="text-sm">Accuracy tracking will appear here once activities are completed.</p>
          </div>
        </div>
      )}

      {/* Accuracy Indicators */}
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span>&lt;80%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <span>80-89%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>90%+</span>
        </div>
      </div>
    </motion.div>
  );
}