import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInventoryAuth } from '../../context/InventoryAuthContext';
import { useEnhancedDashboard } from '../../hooks/useEnhancedDashboard';

// Enhanced Components
import RevenueChart from '../../components/dashboard/charts/RevenueChart';
import PerformanceChart from '../../components/dashboard/charts/PerformanceChart';
import StoreMap from '../../components/dashboard/StoreMap';
import EmployeeRanking from '../../components/dashboard/EmployeeRanking';
import { 
  RevenueKPICard, 
  SalesKPICard, 
  InventoryKPICard, 
  RepairKPICard 
} from '../../components/dashboard/KPICard';

export default function MasterDashboard() {
  const { userProfile } = useInventoryAuth();
  const isMaster = userProfile?.role === 'master';
  const isManager = userProfile?.role === 'manager';

  if (!isMaster && !isManager) {
    return <Navigate to="/inventory/pos" replace />;
  }

  return (
    <EnterpriseDashboard
      userProfile={userProfile}
      isMaster={isMaster}
      isManager={isManager}
    />
  );
}

function EnterpriseDashboard({ userProfile, isMaster, isManager }) {
  const {
    stores,
    summary,
    chartData,
    alerts,
    insights,
    loading,
    lastRefresh,
    formatCurrency,
    formatNumber
  } = useEnhancedDashboard();

  // Page header animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Enhanced Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900"
      >
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="text-white">
                <motion.h1 
                  className="text-3xl lg:text-4xl font-bold tracking-tight mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Enterprise Dashboard: Multi-Location Overview
                </motion.h1>
                <motion.p 
                  className="text-blue-100 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Monitor your performance and manage operations in real-time
                </motion.p>
                <motion.div 
                  className="flex items-center gap-4 mt-4 text-sm text-blue-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <span>Welcome back, {userProfile?.displayName || (isMaster ? 'Business Owner' : 'Store Manager')}</span>
                  <span>•</span>
                  <span>Last updated: {new Date(lastRefresh).toLocaleTimeString()}</span>
                  {isManager && userProfile?.assignedStoreName && (
                    <>
                      <span>•</span>
                      <span className="bg-white/20 px-2 py-1 rounded-full">
                        {userProfile.assignedStoreName}
                      </span>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Quick Stats in Header */}
              <motion.div 
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-white"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatCurrency(summary?.revenue?.today || 0)}
                  </div>
                  <div className="text-xs text-blue-100">Today's Revenue</div>
                  <div className="text-xs text-green-300">
                    +{summary?.revenue?.growth?.toFixed(1) || 0}% YoY
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatCurrency(summary?.revenue?.month || 0)}
                  </div>
                  <div className="text-xs text-blue-100">Total Gross Profit Today</div>
                  <div className="text-xs text-blue-200">+5%</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">19%</div>
                  <div className="text-xs text-blue-100">Payroll % Across Stores</div>
                  <div className="text-xs text-blue-200">Avg</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-300">
                    {summary?.inventory?.criticalStock || 0}
                  </div>
                  <div className="text-xs text-blue-100">Critical Alerts</div>
                  <div className="text-xs text-red-300">Action Required</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Dashboard Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
      >
        {/* Critical Alerts */}
        {alerts.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'critical' 
                    ? 'bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-400'
                    : alert.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20 dark:border-yellow-400'
                    : 'bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {alert.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-gray-400">
                      {alert.message}
                    </p>
                  </div>
                  <a
                    href={alert.href}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {alert.action}
                  </a>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* KPI Cards Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RevenueKPICard
            todayRevenue={summary?.revenue?.today || 0}
            growth={summary?.revenue?.growth || 0}
          />
          <SalesKPICard
            salesCount={summary?.operations?.totalStores || 0}
            growth={5.2}
          />
          <InventoryKPICard
            criticalCount={summary?.inventory?.criticalStock || 0}
            lowStockCount={summary?.inventory?.lowStock || 0}
          />
          <RepairKPICard
            queueLength={summary?.repairs?.queueLength || 0}
            staleCount={summary?.repairs?.staleTickets || 0}
          />
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div variants={itemVariants}>
            <RevenueChart data={chartData.revenue} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <PerformanceChart data={chartData.performance} />
          </motion.div>
        </div>

        {/* Store Map */}
        <motion.div variants={itemVariants}>
          <StoreMap 
            stores={stores} 
            performanceData={chartData.performance}
          />
        </motion.div>

        {/* Bottom Row - Employee Rankings and Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <EmployeeRanking employees={chartData.employeePerformance} />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            {/* Inventory Risk Alerts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
              <div className="p-6 border-b border-slate-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Inventory Risk Alerts by Store
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {stores.slice(0, 4).map((store, index) => (
                  <div key={store.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {store.name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-gray-400">
                        Active Repairs: {Math.floor(Math.random() * 10)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        {Math.floor(Math.random() * 5) + 1} Critical
                      </div>
                      <div className="text-xs text-slate-500 dark:text-gray-400">
                        Stock Alerts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Repair Queue Status */}
        <motion.div variants={itemVariants}>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Repair Queue Status Across Locations
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stores.slice(0, 4).map((store, index) => (
                  <div key={store.id} className="text-center p-4 bg-slate-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {Math.floor(Math.random() * 20) + 1}
                    </div>
                    <div className="text-sm font-medium text-slate-600 dark:text-gray-400 mb-1">
                      {store.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-gray-500">
                      Active Repairs: {Math.floor(Math.random() * 10)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}