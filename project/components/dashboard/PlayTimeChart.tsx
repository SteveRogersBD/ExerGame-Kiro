'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '@/types/dashboard';

interface PlayTimeChartProps {
  childId: string;
  period: '7d' | '30d';
}

// Mock chart data - in a real app, this would come from an API
const mockChartData: Record<string, Record<string, ChartDataPoint[]>> = {
  '1': {
    '7d': [
      { date: '2025-01-01', value: 35, label: 'Jan 1' },
      { date: '2025-01-02', value: 45, label: 'Jan 2' },
      { date: '2025-01-03', value: 20, label: 'Jan 3' },
      { date: '2025-01-04', value: 60, label: 'Jan 4' },
      { date: '2025-01-05', value: 50, label: 'Jan 5' },
      { date: '2025-01-06', value: 40, label: 'Jan 6' },
      { date: '2025-01-07', value: 65, label: 'Jan 7' },
    ],
    '30d': [
      { date: '2024-12-08', value: 42, label: 'Dec 8' },
      { date: '2024-12-15', value: 38, label: 'Dec 15' },
      { date: '2024-12-22', value: 55, label: 'Dec 22' },
      { date: '2024-12-29', value: 48, label: 'Dec 29' },
      { date: '2025-01-05', value: 52, label: 'Jan 5' },
    ],
  },
  '2': {
    '7d': [
      { date: '2025-01-01', value: 25, label: 'Jan 1' },
      { date: '2025-01-02', value: 30, label: 'Jan 2' },
      { date: '2025-01-03', value: 15, label: 'Jan 3' },
      { date: '2025-01-04', value: 40, label: 'Jan 4' },
      { date: '2025-01-05', value: 35, label: 'Jan 5' },
      { date: '2025-01-06', value: 30, label: 'Jan 6' },
      { date: '2025-01-07', value: 35, label: 'Jan 7' },
    ],
    '30d': [
      { date: '2024-12-08', value: 32, label: 'Dec 8' },
      { date: '2024-12-15', value: 28, label: 'Dec 15' },
      { date: '2024-12-22', value: 35, label: 'Dec 22' },
      { date: '2024-12-29', value: 30, label: 'Dec 29' },
      { date: '2025-01-05', value: 33, label: 'Jan 5' },
    ],
  },
  '3': {
    '7d': [
      { date: '2025-01-01', value: 55, label: 'Jan 1' },
      { date: '2025-01-02', value: 70, label: 'Jan 2' },
      { date: '2025-01-03', value: 45, label: 'Jan 3' },
      { date: '2025-01-04', value: 80, label: 'Jan 4' },
      { date: '2025-01-05', value: 65, label: 'Jan 5' },
      { date: '2025-01-06', value: 60, label: 'Jan 6' },
      { date: '2025-01-07', value: 75, label: 'Jan 7' },
    ],
    '30d': [
      { date: '2024-12-08', value: 58, label: 'Dec 8' },
      { date: '2024-12-15', value: 52, label: 'Dec 15' },
      { date: '2024-12-22', value: 68, label: 'Dec 22' },
      { date: '2024-12-29', value: 62, label: 'Dec 29' },
      { date: '2025-01-05', value: 67, label: 'Jan 5' },
    ],
  },
};

export default function PlayTimeChart({ childId, period }: PlayTimeChartProps) {
  const data = mockChartData[childId]?.[period] || [];

  const formatTooltipValue = (value: number) => {
    return `${value} minutes`;
  };

  const averagePlayTime = data.length > 0 
    ? Math.round(data.reduce((sum, point) => sum + point.value, 0) / data.length)
    : 0;

  const trend = data.length >= 2 
    ? data[data.length - 1].value - data[0].value
    : 0;

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Play Time Trends</h3>
        <div className="text-sm text-gray-600">
          Avg: {averagePlayTime}m
          {trend !== 0 && (
            <span className={`ml-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}m
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
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value) => [formatTooltipValue(value as number), 'Play Time']}
              labelStyle={{ color: '#374151' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {data.length === 0 && (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm">Play time data will appear here once activities are completed.</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}