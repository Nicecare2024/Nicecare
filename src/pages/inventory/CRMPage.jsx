import { useState, useEffect } from 'react';
import CustomerForm from '../../components/CustomerForm';
import CustomerTable from '../../components/CustomerTable';
import { useCustomers } from '../../hooks/useCustomers';
import { useStores } from '../../hooks/useStores';
import { useInventoryAuth } from '../../context/InventoryAuthContext';

export default function CRMPage() {
  useEffect(() => {
    document.body.classList.add('edge-to-edge-page');
    return () => document.body.classList.remove('edge-to-edge-page');
  }, []);

  const { userProfile } = useInventoryAuth();
  const isMaster = userProfile?.role === 'master';

  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const { stores } = useStores();

  const {
    customers,
    loading,
    error,
    addingCustomer,
    addCustomer,
    updateCustomer,
    updateCustomerStatus,
    deleteCustomer,
  } = useCustomers(isMaster ? selectedStoreId : null);

  const [updatingCustomer, setUpdatingCustomer] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal]);

  async function handleAddCustomer(formData) {
    try {
      const payload = { ...formData };
      if (isMaster) {
        const storeId = selectedStoreId || (stores?.length ? stores[0].id : null);
        if (!storeId) {
          alert('Please create a store first (Stores page), or select a store to add customers.');
          return;
        }
        payload.storeId = storeId;
      }
      await addCustomer(payload);
      setShowAddModal(false);
    } catch (err) {
      alert(err.message || 'Failed to add customer. Please try again.');
    }
  }

  async function handleUpdateCustomer(customerId, formData) {
    setUpdatingCustomer(true);
    try {
      await updateCustomer(customerId, formData);
    } catch (err) {
      alert('Failed to update customer. Please try again.');
      throw err;
    } finally {
      setUpdatingCustomer(false);
    }
  }

  async function handleUpdateStatus(customerId, newStatus) {
    try {
      await updateCustomerStatus(customerId, newStatus);
    } catch (_err) {
      alert('Failed to update status. Please try again.');
    }
  }

  async function handleDeleteCustomer(customerId) {
    try {
      await deleteCustomer(customerId);
    } catch (_err) {
      alert('Failed to delete customer. Please try again.');
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-6 bg-slate-50 dark:bg-[#0a0f1a]">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      {isMaster && stores?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-4 shadow-sm mb-4 flex items-center">
          <label htmlFor="crm-store-filter" className="mr-2 text-sm font-medium text-slate-700 dark:text-gray-300">Store:</label>
          <select
            id="crm-store-filter"
            value={selectedStoreId || ''}
            onChange={(e) => setSelectedStoreId(e.target.value || null)}
            className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-slate-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All stores</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 font-medium transition-colors"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Create New Customer Details
        </button>
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50">➕ Add a New Customer Detail</h3>
              <button
                className="text-2xl leading-none text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300 bg-transparent border-none cursor-pointer"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <CustomerForm onSubmit={handleAddCustomer} loading={addingCustomer} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm text-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50 mb-4">Submitted Customer Details</h3>
          <div className="text-slate-500 dark:text-gray-400">Loading...</div>
        </div>
      ) : (
        <CustomerTable
          customers={customers}
          onUpdateStatus={handleUpdateStatus}
          onUpdateCustomer={handleUpdateCustomer}
          onDelete={handleDeleteCustomer}
          updatingCustomer={updatingCustomer}
        />
      )}
    </main>
  );
}
