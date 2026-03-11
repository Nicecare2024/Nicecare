import { useState, useEffect, useMemo } from 'react';
import { useStores } from './useStores';
import { useEmployees } from './useEmployees';
import { useProducts } from './useProducts';
import { useSales } from './useSales';
import { useCustomers } from './useCustomers';
// import { useServiceTickets } from './useServiceTickets'; // TODO: Add when service tickets feature is merged
import AnalyticsEngine from '../services/analyticsEngine';

const EMPTY_TICKETS = [];

/**
 * Enhanced Dashboard Hook
 * Provides comprehensive analytics and KPIs for enterprise dashboard
 */
export const useEnhancedDashboard = () => {
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [lastRefresh, setLastRefresh] = useState(null);

  // Core data hooks
  const { stores, loading: storesLoading } = useStores();
  const { employees, loading: employeesLoading } = useEmployees();
  const { products, loading: productsLoading } = useProducts();
  const { sales, loading: salesLoading } = useSales();
  const { customers, loading: customersLoading } = useCustomers();
  // const { tickets, loading: ticketsLoading } = useServiceTickets(); // TODO: Add when service tickets feature is merged
  const tickets = EMPTY_TICKETS; // Fallback empty array
  const ticketsLoading = false;

  // Loading state
  const loading =
    storesLoading ||
    employeesLoading ||
    productsLoading ||
    salesLoading ||
    customersLoading ||
    ticketsLoading;

  // Analytics Engine Instance
  const analyticsEngine = useMemo(() => {
    if (loading) return null;
    return new AnalyticsEngine(stores, employees, products, sales, tickets);
  }, [stores, employees, products, sales, tickets, loading]);

  // Comprehensive KPIs
  const kpis = useMemo(() => {
    if (!analyticsEngine) return null;
    return analyticsEngine.calculateKPIs();
  }, [analyticsEngine]);

  // Real-time refresh mechanism
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(Date.now());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Chart data preparation
  const chartData = useMemo(() => {
    if (!kpis) {
      return {
        revenue: [],
        performance: [],
        trends: [],
        employeePerformance: [],
        repairTypes: [],
      };
    }

    const repairTypeCounts = {};

    customers.forEach((customer) => {
      const type = (customer.repairType || '').trim();
      if (!type) return;

      const status = customer.status || '';
      if (['Delivered', 'Cancelled', 'Unrepairable'].includes(status)) return;

      repairTypeCounts[type] = (repairTypeCounts[type] || 0) + 1;
    });

    const totalRepairs = Object.values(repairTypeCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    const palette = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#94a3b8'];

    const repairTypes = Object.entries(repairTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count], index) => ({
        name,
        value: totalRepairs ? Math.round((count / totalRepairs) * 100) : 0,
        count,
        color: palette[index % palette.length],
      }));

    return {
      revenue: kpis.trends.dailyTrends.slice(-30), // Last 30 days
      performance: kpis.performance.stores,
      trends: kpis.trends.weeklyTrends,
      employeePerformance: kpis.employees.topPerformers,
      repairTypes,
    };
  }, [kpis, customers]);

  // Critical alerts
  const alerts = useMemo(() => {
    if (!kpis) return [];

    const criticalAlerts = [];

    // Inventory alerts
    if (kpis.inventory.criticalStockCount > 0) {
      criticalAlerts.push({
        id: 'critical-stock',
        type: 'critical',
        title: 'Critical Stock Levels',
        message: `${kpis.inventory.criticalStockCount} products are critically low`,
        action: 'View Inventory',
        href: '/inventory/products',
      });
    }

    // Stale repair tickets
    if (kpis.repairs.staleTickets > 0) {
      criticalAlerts.push({
        id: 'stale-repairs',
        type: 'warning',
        title: 'Stale Repair Tickets',
        message: `${kpis.repairs.staleTickets} tickets need attention`,
        action: 'View Tickets',
        href: '/inventory/service-tickets',
      });
    }

    // Underperforming stores
    if (kpis.performance.underPerforming.length > 0) {
      criticalAlerts.push({
        id: 'underperforming-stores',
        type: 'info',
        title: 'Store Performance',
        message: `${kpis.performance.underPerforming.length} stores need attention`,
        action: 'View Stores',
        href: '/inventory/stores',
      });
    }

    return criticalAlerts;
  }, [kpis]);

  // Summary metrics for quick overview
  const summary = useMemo(() => {
    if (!kpis) return null;

    return {
      revenue: {
        today: kpis.revenue.today,
        growth: kpis.revenue.todayGrowth,
        week: kpis.revenue.week,
        month: kpis.revenue.month,
      },
      operations: {
        totalStores: kpis.performance.totalStores,
        activeStores: kpis.performance.activeStores,
        totalEmployees: kpis.employees.total,
        activeEmployees: kpis.employees.active,
      },
      inventory: {
        totalProducts: kpis.inventory.totalProducts,
        lowStock: kpis.inventory.lowStockCount,
        criticalStock: kpis.inventory.criticalStockCount,
        totalValue: kpis.inventory.totalInventoryValue,
      },
      repairs: {
        totalTickets: kpis.repairs.totalTickets,
        queueLength: Object.values(kpis.repairs.repairQueueByStore).reduce((sum, store) => sum + store.queue, 0),
        staleTickets: kpis.repairs.staleTickets,
        completionRate: kpis.repairs.completionRate,
      },
    };
  }, [kpis]);

  // Performance insights
  const insights = useMemo(() => {
    if (!kpis) return [];

    const insights = [];

    // Revenue insights
    if (kpis.revenue.todayGrowth > 10) {
      insights.push({
        type: 'positive',
        title: 'Strong Revenue Growth',
        description: `Today's revenue is ${kpis.revenue.todayGrowth.toFixed(1)}% higher than yesterday`,
      });
    } else if (kpis.revenue.todayGrowth < -10) {
      insights.push({
        type: 'negative',
        title: 'Revenue Decline',
        description: `Today's revenue is ${Math.abs(kpis.revenue.todayGrowth).toFixed(1)}% lower than yesterday`,
      });
    }

    // Inventory insights
    if (kpis.inventory.accessoryAttachRate > 50) {
      insights.push({
        type: 'positive',
        title: 'High Accessory Sales',
        description: `${kpis.inventory.accessoryAttachRate.toFixed(1)}% of sales include accessories`,
      });
    }

    // Employee insights
    if (kpis.employees.averagePerformance > 1.2) {
      insights.push({
        type: 'positive',
        title: 'Team Performance',
        description: 'Employee performance is above average across all locations',
      });
    }

    return insights;
  }, [kpis]);

  return {
    // Data
    stores,
    employees,
    products,
    sales,
    customers,
    tickets,

    // Analytics
    kpis,
    summary,
    chartData,
    alerts,
    insights,

    // State
    loading,
    lastRefresh,

    // Controls
    refreshInterval,
    setRefreshInterval,

    // Utilities
    formatCurrency: (value) => new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0),

    formatNumber: (value) => new Intl.NumberFormat('en-US').format(value || 0),

    formatPercentage: (value) => `${(value || 0).toFixed(1)}%`,
  };
};

export default useEnhancedDashboard;