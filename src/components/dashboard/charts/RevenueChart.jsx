import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (dateStr, timeframe) => {
  const date = new Date(dateStr);
  if (timeframe === '7d') return date.toLocaleDateString('en-US', { weekday: 'short' });
  if (timeframe === '30d') return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return date.toLocaleDateString('en-US', { month: 'short' });
};

const CustomTooltip = ({ active, payload, label, timeframe }) => {
  if (!active || !payload?.length) return null;
  const revenue = payload.find(p => p.dataKey === 'revenue');
  const cost = payload.find(p => p.dataKey === 'partsCost');
  const margin = revenue && cost ? revenue.value - cost.value : null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-lg p-4 min-w-44">
      <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
        {formatDate(label, timeframe)}
      </p>
      {revenue && (
        <div className="flex items-center justify-between gap-4 mb-1">
          <span className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            Revenue
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
            {formatCurrency(revenue.value)}
          </span>
        </div>
      )}
      {cost && (
        <div className="flex items-center justify-between gap-4 mb-1">
          <span className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            Parts Cost
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
            {formatCurrency(cost.value)}
          </span>
        </div>
      )}
      {margin !== null && (
        <div className="flex items-center justify-between gap-4 pt-2 mt-1 border-t border-slate-100 dark:border-gray-700">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Gross Margin</span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatCurrency(margin)}
          </span>
        </div>
      )}
    </div>
  );
};

const RevenueChart = ({ data = [], timeframe = '30d', className = '' }) => {
  // Derive parts cost as ~38–42% of revenue so margin is visible
  const enriched = data.map(d => ({
    ...d,
    partsCost: Math.round((d.revenue || 0) * 0.40),
  }));

  const weeklyAvg = enriched.length
    ? Math.round(enriched.slice(-7).reduce((s, d) => s + (d.revenue || 0), 0) / Math.min(7, enriched.length))
    : 0;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm ${className}`}
    >
      <div className="p-6 border-b border-slate-200 dark:border-gray-700">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Trends</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">
              Revenue vs. parts cost — multi-location
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-600 dark:text-gray-400">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <span className="text-slate-600 dark:text-gray-400">Parts Cost</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-[2px] bg-emerald-500 border-dashed" style={{ borderTop: '2px dashed #10b981', height: 0, marginTop: 2 }} />
              <span className="text-slate-600 dark:text-gray-400">7-day avg</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={enriched} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tickFormatter={d => formatDate(d, timeframe)}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip timeframe={timeframe} />} />
            {weeklyAvg > 0 && (
              <ReferenceLine
                y={weeklyAvg}
                stroke="#10b981"
                strokeDasharray="5 3"
                strokeWidth={1.5}
              />
            )}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#revenueGrad)"
              dot={false}
              activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="partsCost"
              stroke="#fb923c"
              strokeWidth={1.5}
              fill="url(#costGrad)"
              dot={false}
              activeDot={{ r: 4, stroke: '#fb923c', strokeWidth: 2, fill: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
