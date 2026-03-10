import React from 'react';
import { motion } from 'framer-motion';

const EmployeeRanking = ({ employees, className = '' }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPerformanceBadge = (performance) => {
    if (performance >= 1.5) {
      return { label: 'Excellent', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
    } else if (performance >= 1.0) {
      return { label: 'Good', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
    } else if (performance >= 0.5) {
      return { label: 'Average', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' };
    } else {
      return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
    }
  };

  const getRankIcon = (index) => {
    if (index === 0) {
      return (
        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          1
        </div>
      );
    } else if (index === 1) {
      return (
        <div className="w-8 h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
          2
        </div>
      );
    } else if (index === 2) {
      return (
        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          3
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-slate-600 dark:text-gray-400 font-bold text-sm">
          {index + 1}
        </div>
      );
    }
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm ${className}`}
    >
      <div className="p-6 border-b border-slate-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Top Performing Employees
            </h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
              Across all store locations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-500 dark:text-gray-400">
              Ranked by revenue
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {employees.map((employee, index) => {
            const badge = getPerformanceBadge(employee.performance);
            
            return (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-gray-700/50 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
              >
                {/* Rank */}
                <div className="flex-shrink-0">
                  {getRankIcon(index)}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full ${getAvatarColor(employee.name)} flex items-center justify-center text-white font-semibold text-lg`}>
                    {employee.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Employee Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {employee.name}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400 truncate">
                    {employee.storeName || 'Corporate'}
                  </p>
                </div>

                {/* Performance Metrics */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCurrency(employee.revenue)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-gray-400">
                    {employee.salesCount} sales
                  </div>
                  <div className="text-xs text-slate-500 dark:text-gray-400">
                    {formatCurrency(employee.averageOrderValue)} avg
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="flex-shrink-0 w-16">
                  <div className="w-full bg-slate-200 dark:bg-gray-600 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(employee.performance * 50, 100)}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                    />
                  </div>
                  <div className="text-xs text-center text-slate-500 dark:text-gray-400 mt-1">
                    {(employee.performance * 100).toFixed(0)}%
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {employees.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-300 mb-2">
              No employee data available
            </h3>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Employee performance data will appear here once sales are recorded
            </p>
          </div>
        )}
      </div>

      {/* View All Link */}
      {employees.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-gray-700">
          <a
            href="/inventory/employees"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            View all employees
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default EmployeeRanking;