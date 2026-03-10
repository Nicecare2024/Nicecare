import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Mock map component (replace with actual map library like Mapbox or Google Maps)
const StoreMap = ({ stores, performanceData, className = '' }) => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [hoveredStore, setHoveredStore] = useState(null);

  // Mock coordinates for demonstration (in real app, stores would have lat/lng)
  const mockCoordinates = {
    0: { x: 25, y: 30 }, // Store A
    1: { x: 60, y: 45 }, // Store B  
    2: { x: 40, y: 70 }, // Store C
    3: { x: 75, y: 25 }, // Store D
    4: { x: 15, y: 60 }, // Store E
  };

  const getStorePerformance = (storeId) => {
    return performanceData?.find(p => p.storeId === storeId) || {};
  };

  const getMarkerColor = (storeId) => {
    const performance = getStorePerformance(storeId);
    const efficiency = performance.efficiency || 0;
    
    if (efficiency >= 0.8) return '#10b981'; // Green - Excellent
    if (efficiency >= 0.6) return '#3b82f6'; // Blue - Good  
    if (efficiency >= 0.4) return '#f59e0b'; // Yellow - Average
    return '#ef4444'; // Red - Poor
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const StoreMarker = ({ store, index }) => {
    const coords = mockCoordinates[index] || { x: 50, y: 50 };
    const performance = getStorePerformance(store.id);
    const isSelected = selectedStore?.id === store.id;
    const isHovered = hoveredStore?.id === store.id;

    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
        onClick={() => setSelectedStore(store)}
        onMouseEnter={() => setHoveredStore(store)}
        onMouseLeave={() => setHoveredStore(null)}
      >
        {/* Store Marker */}
        <motion.div
          animate={{ 
            scale: isSelected || isHovered ? 1.2 : 1,
            boxShadow: isSelected || isHovered ? '0 8px 25px rgba(0,0,0,0.15)' : '0 4px 15px rgba(0,0,0,0.1)'
          }}
          className="relative"
        >
          <div
            className="w-6 h-6 rounded-full border-3 border-white shadow-lg flex items-center justify-center"
            style={{ backgroundColor: getMarkerColor(store.id) }}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          
          {/* Pulse animation for active stores */}
          {performance.employeeCount > 0 && (
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: getMarkerColor(store.id) }}
            />
          )}
        </motion.div>

        {/* Store Label */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-md border border-slate-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              {store.name}
            </p>
          </div>
        </div>

        {/* Hover Tooltip */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg p-3 min-w-48">
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                {store.name}
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-gray-400">Revenue:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(performance.revenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-gray-400">Employees:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {performance.employeeCount || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-gray-400">Efficiency:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {Math.round((performance.efficiency || 0) * 100)}%
                  </span>
                </div>
                {performance.repairQueue > 0 && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400">
                    <span>Repair Queue:</span>
                    <span className="font-semibold">{performance.repairQueue}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm ${className}`}
    >
      <div className="p-6 border-b border-slate-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Store Locations</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
              Interactive performance map
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-slate-600 dark:text-gray-400">High Performance</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-slate-600 dark:text-gray-400">Good Performance</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-slate-600 dark:text-gray-400">Average Performance</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-slate-600 dark:text-gray-400">Needs Attention</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Mock Map Background */}
        <div className="relative w-full h-80 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-lg overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Mock Geographic Features */}
          <div className="absolute inset-0">
            {/* Mock Roads */}
            <div className="absolute top-1/3 left-0 right-0 h-1 bg-slate-300 dark:bg-gray-500 opacity-60"></div>
            <div className="absolute top-2/3 left-0 right-0 h-1 bg-slate-300 dark:bg-gray-500 opacity-60"></div>
            <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-slate-300 dark:bg-gray-500 opacity-60"></div>
            <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-slate-300 dark:bg-gray-500 opacity-60"></div>
            
            {/* Mock Water/Parks */}
            <div className="absolute top-1/4 right-1/4 w-16 h-12 bg-blue-200 dark:bg-blue-800 rounded-full opacity-40"></div>
            <div className="absolute bottom-1/4 left-1/3 w-20 h-8 bg-green-200 dark:bg-green-800 rounded-lg opacity-40"></div>
          </div>

          {/* Store Markers */}
          {stores.map((store, index) => (
            <StoreMarker key={store.id} store={store} index={index} />
          ))}
        </div>

        {/* Selected Store Details */}
        {selectedStore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-slate-50 dark:bg-gray-700 rounded-lg border border-slate-200 dark:border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedStore.name}
              </h4>
              <button
                onClick={() => setSelectedStore(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(() => {
                const performance = getStorePerformance(selectedStore.id);
                return (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(performance.revenue)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {performance.employeeCount || 0}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">Employees</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {Math.round((performance.efficiency || 0) * 100)}%
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">Efficiency</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {performance.repairQueue || 0}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">Repair Queue</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StoreMap;