import { useState, useEffect, useMemo } from 'react';
import { useStores } from '../../hooks/useStores';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useEmployees } from '../../hooks/useEmployees';

export default function StoreManagement() {
  useEffect(() => {
    document.body.classList.add('edge-to-edge-page');
    return () => document.body.classList.remove('edge-to-edge-page');
  }, []);

  const { stores, loading, error, addStore, updateStore, deleteStore } = useStores();
  const { employees } = useEmployees();

  const employeeCountByStore = useMemo(() => {
    const counts = {};
    for (const emp of employees) {
      if (emp.assignedStoreId) {
        counts[emp.assignedStoreId] = (counts[emp.assignedStoreId] || 0) + 1;
      }
    }
    return counts;
  }, [employees]);
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  function resetForm() {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      manager: '',
    });
    setEditingStore(null);
    setShowForm(false);
    setFormError('');
  }

  function handleEdit(store) {
    setFormData({
      name: store.name || '',
      address: store.address || '',
      phone: store.phone || '',
      email: store.email || '',
      manager: store.manager || '',
    });
    setEditingStore(store);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Store name is required');
      return;
    }

    setSubmitting(true);

    try {
      if (editingStore) {
        await updateStore(editingStore.id, formData);
      } else {
        await addStore(formData);
      }
      resetForm();
    } catch (err) {
      setFormError(err.message || 'Failed to save store');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(storeId, storeName) {
    setDeleteConfirm({ id: storeId, name: storeName });
  }

  async function confirmDelete() {
    if (!deleteConfirm) return;

    try {
      await deleteStore(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete store: ' + err.message);
      setDeleteConfirm(null);
    }
  }

  return (
    <main className="p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in">
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Store"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-50">Store Management</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Manage your store locations</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700"
          onClick={() => setShowForm(!showForm)}
          title={showForm ? "Close form" : "Add new store"}
        >
          {showForm ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            '+ Add Store'
          )}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-5 shadow-card animate-fade-in-up">
          <h2 className="text-lg font-bold text-slate-900 dark:text-gray-50 mb-4">{editingStore ? 'Edit Store' : 'Add New Store'}</h2>

          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm mb-4">{formError}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">Store Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-slate-900 dark:text-gray-50 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Downtown Store"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-slate-900 dark:text-gray-50 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g., 123 Main St, City, State"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-slate-900 dark:text-gray-50 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., (555) 123-4567"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-slate-900 dark:text-gray-50 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., store@company.com"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">Store Manager</label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-slate-900 dark:text-gray-50 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  placeholder="e.g., John Smith"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all bg-blue-600 hover:bg-blue-700 text-white" disabled={submitting}>
                {submitting ? 'Saving...' : editingStore ? 'Update Store' : 'Add Store'}
              </button>
              <button type="button" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stores List */}
      <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-gray-50">Your Stores</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{stores.length} {stores.length === 1 ? 'Store' : 'Stores'} Found</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-400 dark:text-gray-500">Loading stores...</div>
        ) : error ? (
          <div className="flex items-center justify-center p-12 text-red-600 dark:text-red-400">{error}</div>
        ) : stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 dark:text-gray-500 space-y-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-300">No stores yet</h3>
            <p className="text-sm">Create your first store to get started</p>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all bg-blue-600 hover:bg-blue-700 text-white mt-2" onClick={() => setShowForm(true)}>
              + Add Store
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Store Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Manager</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Employees</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
                {stores.map((store) => (
                  <tr
                    key={store.id}
                    className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <strong className="text-slate-900 dark:text-gray-50">{store.name}</strong>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-slate-500 dark:text-gray-400">{store.address || '-'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-0.5">
                        {store.phone && <div className="text-slate-600 dark:text-gray-300 text-xs">{store.phone}</div>}
                        {store.email && <div className="text-blue-600 dark:text-blue-400 text-xs">{store.email}</div>}
                        {!store.phone && !store.email && <span className="text-slate-400 dark:text-gray-500">-</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-slate-600 dark:text-gray-300">{store.manager || '-'}</span>
                    </td>
                    <td className="text-center px-5 py-3">
                      <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{employeeCountByStore[store.id] || 0}</span>
                    </td>
                    <td className="text-center px-5 py-3">
                      <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">{store.productCount || 0}</span>
                    </td>
                    <td className="text-center px-5 py-3">
                      <div className="flex items-center gap-1 justify-center">
                        <button
                          className="p-2 rounded-lg text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          onClick={() => handleEdit(store)}
                          title="Edit"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="p-2 rounded-lg text-slate-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          onClick={() => handleDelete(store.id, store.name)}
                          title="Delete"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
