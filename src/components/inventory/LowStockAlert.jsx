import { Link } from 'react-router-dom';

export default function LowStockAlert({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-4 mb-6">
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-semibold mb-3">
        <div className="text-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <h3 className="m-0 text-base">Low Stock Alert</h3>
          <p className="m-0 text-sm font-normal opacity-80">{products.length} product{products.length !== 1 ? 's' : ''} running low</p>
        </div>
        <Link to="/inventory/products" className="ml-auto text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline">
          View All
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {products.slice(0, 5).map((product) => (
          <div key={product.id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-[#0a0f1a] rounded-[20px] text-sm text-slate-900 dark:text-gray-50">
            <span className="font-medium">{product.name}</span>
            <span className="text-slate-400 dark:text-gray-500 text-xs">{product.sku || 'No SKU'}</span>
            <span className="font-semibold text-amber-600 dark:text-amber-500">
              {product.quantity} left
            </span>
          </div>
        ))}
        {products.length > 5 && (
          <div className="inline-flex items-center px-3 py-1.5 text-sm text-slate-400 dark:text-gray-500 italic">
            +{products.length - 5} more items
          </div>
        )}
      </div>
    </div>
  );
}
