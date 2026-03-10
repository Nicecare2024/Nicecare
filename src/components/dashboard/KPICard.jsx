import React from 'react';
import { motion } from 'framer-motion';

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon, 
  color = 'blue',
  size = 'default',
  className = '',
  onClick 
}) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      trend: {
        up: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30',
        down: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
        neutral: 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-700'
      }
    },
    green: {
      bg: 'from-green-500 to-green-600',
      icon: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      trend: {
        up: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30',
        down: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
        neutral: 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-700'
      }
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      icon: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      trend: {
        up: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30',
        down: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
        neutral: 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-700'
      }
    },
    orange: {
      bg: 'from-orange-500 to-orange-600',
      icon: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      trend: {
        up: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30',
        down: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
        neutral: 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-700'
      }
    },
    red: {
      bg: 'from-red-500 to-red-600',
      icon: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      trend: {
        up: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30',
        down: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
        neutral: 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-700'
      }
    }
  };

  const sizeClasses = {
    small: 'p-4',
    default: 'p-6',
    large: 'p-8'
  };

  const getTrendIcon = () => {
    if (trend === 'up') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
          <polyline points="17 18 23 18 23 12"></polyline>
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    );
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
      className={`
        bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 
        shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden
        ${onClick ? 'cursor-pointer' : ''} ${className}
      `}
      onClick={onClick}
    >
      {/* Gradient Background Accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.bg} opacity-5 rounded-full transform translate-x-16 -translate-y-16`}></div>
      
      <div className={sizeClasses[size]}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {icon && (
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.icon}`}>
                  {icon}
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-gray-400 mb-1">
                  {title}
                </h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {value}
                </p>
              </div>
            </div>
            
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-gray-500 mb-3">
                {subtitle}
              </p>
            )}
            
            {trend && trendValue && (
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors.trend[trend]}`}>
                  {getTrendIcon()}
                  <span>{trendValue}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-gray-500">
                  vs last period
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Specialized KPI Cards
export const RevenueKPICard = ({ todayRevenue, growth, className }) => (
  <KPICard
    title="Today's Revenue"
    value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(todayRevenue)}
    trend={growth > 0 ? 'up' : growth < 0 ? 'down' : 'neutral'}
    trendValue={`${Math.abs(growth).toFixed(1)}%`}
    color="green"
    icon={
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    }
    className={className}
  />
);

export const SalesKPICard = ({ salesCount, growth, className }) => (
  <KPICard
    title="Total Sales"
    value={salesCount.toLocaleString()}
    subtitle="Transactions completed"
    trend={growth > 0 ? 'up' : growth < 0 ? 'down' : 'neutral'}
    trendValue={`${Math.abs(growth).toFixed(1)}%`}
    color="blue"
    icon={
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
    }
    className={className}
  />
);

export const InventoryKPICard = ({ criticalCount, lowStockCount, className }) => (
  <KPICard
    title="Inventory Alerts"
    value={criticalCount + lowStockCount}
    subtitle={`${criticalCount} critical, ${lowStockCount} low stock`}
    trend={criticalCount > 0 ? 'down' : 'neutral'}
    trendValue={criticalCount > 0 ? 'Action needed' : 'All good'}
    color={criticalCount > 0 ? 'red' : 'green'}
    icon={
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    }
    className={className}
  />
);

export const RepairKPICard = ({ queueLength, staleCount, className }) => (
  <KPICard
    title="Repair Queue"
    value={queueLength}
    subtitle={staleCount > 0 ? `${staleCount} stale tickets` : 'All tickets current'}
    trend={staleCount > 0 ? 'down' : 'neutral'}
    trendValue={staleCount > 0 ? 'Attention needed' : 'On track'}
    color={staleCount > 0 ? 'orange' : 'blue'}
    icon={
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
    }
    className={className}
  />
);

export default KPICard;