import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

const FALLBACK_DATA = [
  { name: 'Screen Repair', value: 38, count: 38, color: '#3b82f6' },
  { name: 'Battery Replace', value: 25, count: 25, color: '#10b981' },
  { name: 'Water Damage', value: 14, count: 14, color: '#f59e0b' },
  { name: 'Board Repair', value: 11, count: 11, color: '#8b5cf6' },
  { name: 'Charging Port', value: 8, count: 8, color: '#06b6d4' },
  { name: 'Other', value: 4, count: 4, color: '#94a3b8' },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, count } = payload[0].payload || payload[0];
  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg px-3 py-2">
      <p className="text-sm font-bold text-slate-900 dark:text-white">{name}</p>
      <p className="text-xs text-slate-500 dark:text-gray-400">
        {value}% of active repairs{typeof count === 'number' ? ` · ${count} jobs` : ''}
      </p>
    </div>
  );
};

const RepairTypeChart = ({ data = [] }) => {
  const hasData = Array.isArray(data) && data.length > 0;
  const chartData = hasData ? data : FALLBACK_DATA;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm"
    >
      <div className="p-6 border-b border-slate-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Repair Type Breakdown
        </h3>
        <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">
          Distribution of active repair jobs by type
        </p>
      </div>
      <div className="p-4">
        {hasData ? (
          <ResponsiveContainer width="100%" height={272}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="44%"
                innerRadius={56}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, i) => (
                  <Cell key={entry.name || i} fill={entry.color || FALLBACK_DATA[i % FALLBACK_DATA.length].color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
                formatter={(value) => (
                  <span className="text-slate-600 dark:text-gray-400">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-sm font-medium text-slate-700 dark:text-gray-200 mb-1">
              No repair data yet
            </p>
            <p className="text-xs text-slate-500 dark:text-gray-400 max-w-xs">
              Once you create repair tickets in your POS, this chart will show the distribution by repair type.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RepairTypeChart;
