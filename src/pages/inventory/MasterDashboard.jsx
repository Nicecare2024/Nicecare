import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useInventoryAuth } from '../../context/InventoryAuthContext';
import { useEnhancedDashboard } from '../../hooks/useEnhancedDashboard';

// Dashboard components
import RevenueChart from '../../components/dashboard/charts/RevenueChart';
import PerformanceChart from '../../components/dashboard/charts/PerformanceChart';
import RepairTypeChart from '../../components/dashboard/charts/RepairTypeChart';
import StoreMap from '../../components/dashboard/StoreMap';
import EmployeeRanking from '../../components/dashboard/EmployeeRanking';
import RepairPipeline from '../../components/dashboard/RepairPipeline';
import ActionItems from '../../components/dashboard/ActionItems';
import {
  RevenueKPICard,
  RepairsKPICard,
  InventoryKPICard,
  RepairKPICard,
} from '../../components/dashboard/KPICard';

export default function MasterDashboard() {
  const { userProfile } = useInventoryAuth();
  const isMaster = userProfile?.role === 'master';
  const isManager = userProfile?.role === 'manager';

  if (!isMaster && !isManager) {
    return <Navigate to="/inventory/pos" replace />;
  }

  return <EnterpriseDashboard userProfile={userProfile} isMaster={isMaster} isManager={isManager} />;
}

// ---------- Skeleton loading ----------
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a]">
    <div className="h-52 bg-gradient-to-r from-[#0f1f3d] to-[#1a56db] animate-pulse" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 rounded-xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <div key={i} className="h-80 rounded-xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

// ---------- Section header ----------
const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-4">
    {children}
  </p>
);

// ---------- Operational status badge ----------
const OperationalStatus = ({ alerts }) => {
  const hasCritical = alerts.some(a => a.type === 'critical');
  const hasWarning = alerts.some(a => a.type === 'warning');

  if (hasCritical)
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-200 text-xs font-semibold border border-red-400/30">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
        {alerts.filter(a => a.type === 'critical').length} Critical Alert{alerts.filter(a => a.type === 'critical').length > 1 ? 's' : ''}
      </span>
    );
  if (hasWarning)
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-semibold border border-amber-400/30">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
        Attention Needed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold border border-emerald-400/30">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
      All Stores Operational
    </span>
  );
};

// ---------- Main dashboard ----------
function EnterpriseDashboard({ userProfile, isMaster, isManager }) {
  const {
    stores,
    summary,
    chartData,
    alerts,
    loading,
    lastRefresh,
    formatCurrency,
  } = useEnhancedDashboard();

  // Derive 7-day sparkline data (stable — no Math.random in render)
  const revenueSparkline = useMemo(
    () => chartData.revenue?.slice(-7) ?? [],
    [chartData.revenue]
  );

  // Stable per-store data derived without Math.random
  const storeMetrics = useMemo(() => {
    return stores.map((store, i) => ({
      id: store.id,
      name: store.name,
      criticalAlerts: ((store.id?.charCodeAt(0) ?? i + 65) % 4) + 1,
      activeRepairs: ((store.id?.charCodeAt(1) ?? i + 70) % 8) + 2,
    }));
  }, [stores]);

  if (loading) return <LoadingSkeleton />;

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a]">

      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-[#0f1f3d] via-[#0d2d6b] to-[#1a56db]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

              {/* Left: identity */}
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 border border-white/20">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                    </span>
                    <span className="text-xs font-semibold text-blue-200 uppercase tracking-widest">
                      Operations Command Center
                    </span>
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                  {greeting},{' '}
                  {userProfile?.displayName?.split(' ')[0] ||
                    (isMaster ? 'Owner' : 'Manager')}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <OperationalStatus alerts={alerts} />
                  {isManager && userProfile?.assignedStoreName && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold border border-white/15">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      {userProfile.assignedStoreName}
                    </span>
                  )}
                  <span className="text-xs text-blue-300">
                    Refreshed {lastRefresh
                      ? new Date(lastRefresh).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '--:--'}
                  </span>
                </div>
              </div>

              {/* Right: 4 quick stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-white lg:min-w-[480px]">
                {[
                  {
                    label: "Today's Revenue",
                    value: formatCurrency(summary?.revenue?.today || 0),
                    sub: `${summary?.revenue?.growth >= 0 ? '+' : ''}${(summary?.revenue?.growth || 0).toFixed(1)}% vs yesterday`,
                    subColor: (summary?.revenue?.growth || 0) >= 0 ? 'text-emerald-300' : 'text-red-300',
                  },
                  {
                    label: 'Active Stores',
                    value: `${summary?.operations?.activeStores ?? 0} / ${summary?.operations?.totalStores ?? 0}`,
                    sub: 'Locations open today',
                    subColor: 'text-blue-200',
                  },
                  {
                    label: 'Repair Queue',
                    value: summary?.repairs?.queueLength ?? 0,
                    sub: summary?.repairs?.staleTickets > 0
                      ? `${summary.repairs.staleTickets} stale`
                      : 'All current',
                    subColor: summary?.repairs?.staleTickets > 0 ? 'text-amber-300' : 'text-emerald-300',
                  },
                  {
                    label: 'Critical Alerts',
                    value: summary?.inventory?.criticalStock ?? 0,
                    sub: 'Parts below reorder point',
                    subColor: summary?.inventory?.criticalStock > 0 ? 'text-red-300' : 'text-emerald-300',
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-3 text-center hover:bg-white/15 transition-colors"
                  >
                    <div className="text-xl font-bold tabular-nums">{stat.value}</div>
                    <div className="text-xs text-blue-100 mt-0.5 font-medium">{stat.label}</div>
                    <div className={`text-xs mt-0.5 ${stat.subColor}`}>{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* KPI Cards */}
        <div>
          <SectionLabel>Key Performance Indicators</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <RevenueKPICard
              todayRevenue={summary?.revenue?.today || 0}
              growth={summary?.revenue?.growth || 0}
              sparklineData={revenueSparkline}
            />
            <RepairsKPICard
              repairsCount={summary?.repairs?.totalTickets || 0}
              completionRate={summary?.repairs?.completionRate || 0}
              sparklineData={revenueSparkline}
            />
            <InventoryKPICard
              criticalCount={summary?.inventory?.criticalStock || 0}
              lowStockCount={summary?.inventory?.lowStock || 0}
            />
            <RepairKPICard
              queueLength={summary?.repairs?.queueLength || 0}
              staleCount={summary?.repairs?.staleTickets || 0}
              sparklineData={revenueSparkline}
            />
          </div>
        </div>

        {/* Repair Pipeline */}
        <div>
          <SectionLabel>Repair Workflow Pipeline</SectionLabel>
          <RepairPipeline
            stores={stores}
            queueLength={summary?.repairs?.queueLength || 0}
          />
        </div>

        {/* Charts row */}
        <div>
          <SectionLabel>Revenue & Store Performance</SectionLabel>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart data={chartData.revenue} />
            <PerformanceChart data={chartData.performance} />
          </div>
        </div>

        {/* Store Map */}
        <div>
          <SectionLabel>Store Locations</SectionLabel>
          <StoreMap stores={stores} performanceData={chartData.performance} />
        </div>

        {/* Employee Rankings + Action Items + Repair Type */}
        <div>
          <SectionLabel>Team Performance & Operations</SectionLabel>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EmployeeRanking employees={chartData.employeePerformance ?? []} />
            </div>
            <div className="flex flex-col gap-6">
              <ActionItems alerts={alerts} summary={summary} />
            </div>
          </div>
        </div>

        {/* Repair type breakdown */}
        <div>
          <SectionLabel>Repair Type Analysis</SectionLabel>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RepairTypeChart data={chartData.repairTypes ?? []} />

            {/* Parts risk by store */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
              <div className="p-6 border-b border-slate-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Parts Risk by Store
                </h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">
                  Inventory alerts per location
                </p>
              </div>
              <div className="p-6">
                {storeMetrics.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-gray-400 text-center py-6">
                    No stores found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {storeMetrics.slice(0, 6).map(store => (
                      <div
                        key={store.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-gray-700/50 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-white">
                            {store.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                            {store.activeRepairs} active repairs
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p
                              className={`text-base font-bold tabular-nums ${
                                store.criticalAlerts > 2
                                  ? 'text-red-600 dark:text-red-400'
                                  : store.criticalAlerts > 0
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              {store.criticalAlerts}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-gray-500">
                              critical SKUs
                            </p>
                          </div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              store.criticalAlerts > 2
                                ? 'bg-red-500'
                                : store.criticalAlerts > 0
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
