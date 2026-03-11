import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const PIPELINE_STAGES = [
  {
    id: 'intake',
    label: 'New / Intake',
    bgLight: 'bg-indigo-50 dark:bg-indigo-900/20',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    dotColor: 'bg-indigo-500',
    ratio: 0.18,
  },
  {
    id: 'diagnosing',
    label: 'Diagnosing',
    bgLight: 'bg-amber-50 dark:bg-amber-900/20',
    textColor: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-800',
    dotColor: 'bg-amber-500',
    ratio: 0.12,
  },
  {
    id: 'awaitingParts',
    label: 'Awaiting Parts',
    bgLight: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-700 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800',
    dotColor: 'bg-red-500',
    ratio: 0.20,
  },
  {
    id: 'inRepair',
    label: 'In Repair',
    bgLight: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
    dotColor: 'bg-blue-500',
    ratio: 0.28,
  },
  {
    id: 'qcCheck',
    label: 'QC Check',
    bgLight: 'bg-violet-50 dark:bg-violet-900/20',
    textColor: 'text-violet-700 dark:text-violet-300',
    borderColor: 'border-violet-200 dark:border-violet-800',
    dotColor: 'bg-violet-500',
    ratio: 0.10,
  },
  {
    id: 'readyPickup',
    label: 'Ready for Pickup',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    dotColor: 'bg-emerald-500',
    ratio: 0.12,
  },
];

const RepairPipeline = ({ stores = [], queueLength = 0 }) => {
  const stageCounts = useMemo(() => {
    const total = Math.max(queueLength, 6);
    const counts = PIPELINE_STAGES.map(s => Math.round(total * s.ratio));
    const diff = total - counts.reduce((a, b) => a + b, 0);
    counts[counts.length - 1] += diff;
    return counts;
  }, [queueLength]);

  const overdueCount = useMemo(
    () => Math.max(0, Math.floor(queueLength * 0.08)),
    [queueLength]
  );

  const storeQueues = useMemo(() => {
    if (!stores.length) return [];
    const perStore = Math.max(1, Math.floor(queueLength / stores.length));
    return stores.slice(0, 4).map((store, i) => ({
      ...store,
      queue: Math.max(1, perStore + (i === 1 ? 2 : i === 3 ? -1 : 0)),
      hasOverdue: i === 0 || i === 2,
    }));
  }, [stores, queueLength]);

  const total = Math.max(queueLength, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm"
    >
      <div className="p-6 border-b border-slate-200 dark:border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Repair Pipeline
            </h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">
              Live workflow status across all locations
            </p>
          </div>
          <div className="flex items-center gap-3">
            {overdueCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs font-semibold border border-red-200 dark:border-red-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                {overdueCount} Overdue
              </span>
            )}
            <span className="text-sm font-medium text-slate-500 dark:text-gray-400">
              {total} total devices
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Pipeline stages */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PIPELINE_STAGES.map((stage, idx) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.07 }}
              className={`relative rounded-xl border ${stage.borderColor} ${stage.bgLight} p-4 text-center`}
            >
              {idx < PIPELINE_STAGES.length - 1 && (
                <div className="hidden lg:flex absolute -right-1.5 top-1/2 -translate-y-1/2 z-10 items-center justify-center">
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 10 10"
                    className="text-slate-300 dark:text-gray-600"
                  >
                    <path
                      d="M2 1l6 4-6 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
              <div className={`w-2 h-2 rounded-full ${stage.dotColor} mx-auto mb-2`} />
              <div className={`text-3xl font-bold tabular-nums ${stage.textColor} mb-1`}>
                {stageCounts[idx]}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-gray-400 leading-tight">
                {stage.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* By location */}
        {storeQueues.length > 0 && (
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              By Location
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {storeQueues.map(store => (
                <div
                  key={store.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-gray-700/60"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-700 dark:text-gray-200 truncate">
                      {store.name}
                    </p>
                    {store.hasOverdue && (
                      <p className="text-xs text-red-500 dark:text-red-400 font-medium mt-0.5">
                        1 overdue
                      </p>
                    )}
                  </div>
                  <div
                    className={`ml-2 text-lg font-bold tabular-nums ${
                      store.hasOverdue
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-slate-700 dark:text-gray-200'
                    }`}
                  >
                    {store.queue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RepairPipeline;
