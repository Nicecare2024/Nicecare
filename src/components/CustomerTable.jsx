import React, { useState, useMemo, useEffect } from 'react';
import EditCustomerModal from './EditCustomerModal';

const STATUS_OPTIONS = [
  'Select',
  'Device Received',
  'Under Diagnosis',
  'Waiting for Parts',
  'Repair in Progress',
  'Quality Check',
  'Ready for Pickup',
  'Delivered',
  'Cancelled',
  'Unrepairable',
];

const displayValue = (value) => {
  if (value === undefined || value === null || value === '') {
    return <span className="text-sm text-slate-400 dark:text-gray-600 italic">N/A</span>;
  }
  return <span className="text-sm text-slate-700 dark:text-gray-300">{value}</span>;
};

const formatCurrency = (value) => {
  if (!value) return <span className="text-sm text-slate-400 dark:text-gray-600 italic">N/A</span>;
  return <span className="text-sm text-slate-700 dark:text-gray-300">${parseFloat(value).toFixed(2)}</span>;
};

const getStatusBadgeClasses = (status) => {
  const base = 'inline-block px-2.5 py-1 rounded-full text-xs font-medium';
  const map = {
    'Device Received': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Under Diagnosis': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Waiting for Parts': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Repair in Progress': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    'Quality Check': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'Ready for Pickup': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Delivered': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Cancelled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'Unrepairable': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };
  return `${base} ${map[status] || 'bg-slate-100 text-slate-700 dark:bg-gray-700 dark:text-gray-300'}`;
};

const StatusBadge = ({ status }) => {
  return (
    <span className={getStatusBadgeClasses(status)}>
      {status}
    </span>
  );
};

export default function CustomerTable({ customers, onUpdateStatus, onUpdateCustomer, onDelete, updatingCustomer }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalCustomer, setModalCustomer] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;

    const term = searchTerm.toLowerCase();
    return customers.filter((customer) => {
      return (
        customer.name?.toLowerCase().includes(term) ||
        customer.phone?.toLowerCase().includes(term) ||
        customer.email?.toLowerCase().includes(term) ||
        customer.imei?.toLowerCase().includes(term) ||
        customer.model?.toLowerCase().includes(term)
      );
    });
  }, [customers, searchTerm]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
    if (currentPage > totalPages) {
      const t = setTimeout(() => setCurrentPage(totalPages), 0);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [filteredCustomers, currentPage]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  function toggleExpand(id) {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  function _hasDetailedData(customer) {
    return (
      customer.deviceType ||
      customer.brand ||
      customer.model ||
      customer.imei ||
      customer.issueCategory ||
      customer.estimatedCost ||
      customer.customerType
    );
  }

  function handleExport() {
    const headers = [
      'Name', 'Email', 'Phone', 'Address', 'Alternate Phone', 'Customer Type', 'Preferred Contact',
      'Device Type', 'Brand', 'Model', 'IMEI', 'Carrier',
      'Issue Category', 'Issue Description', 'Repair Type', 'Priority', 'Technical Staff Name',
      'Estimated Cost', 'Advance Paid', 'Parts Type',
      'Submission Date', 'Expected Date', 'Device Received Date by Technical Staff', 'Repair Start Date',
      'Status', 'Notes'
    ];
    const rows = filteredCustomers.map((c) => {
      return [
        c.name || '',
        c.email || '',
        c.phone || '',
        c.address || '',
        c.alternatePhone || '',
        c.customerType || '',
        c.preferredContact || '',
        c.deviceType || '',
        c.brand || '',
        c.model || '',
        c.imei || '',
        c.carrier || '',
        c.issueCategory || '',
        c.issueDescription || '',
        c.repairType || '',
        c.priority || '',
        c.technicalStaffName || '',
        c.estimatedCost || '',
        c.advancePaid || '',
        c.partsType || '',
        c.submissionDate || '',
        c.expectedDate || '',
        c.deviceReceivedDate || '',
        c.repairStartDate || '',
        c.status || '',
        c.notes || '',
      ].map((v) => (v.includes(',') || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v));
    });

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `submissions_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  }

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this record?')) {
      onDelete(id);
    }
  }

  function handleEdit(customer) {
    setModalCustomer(customer);
    setShowEditModal(true);
  }

  async function handleSaveEdit(formData) {
    try {
      await onUpdateCustomer(modalCustomer.id, formData);
      setShowEditModal(false);
      setModalCustomer(null);
    } catch (err) {
      console.error('Error saving customer:', err);
    }
  }

  function handleCancelEdit() {
    setShowEditModal(false);
    setModalCustomer(null);
  }

  if (customers.length === 0) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50 mb-4">Submitted Customer Details</h3>
        <div className="text-center text-slate-400 dark:text-gray-500 py-8">No records yet. Add your first customer!</div>
      </section>
    );
  }

  return (
    <>
    <section className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50 mb-4">Submitted Customer Details</h3>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-slate-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          placeholder="🔍 Search by Name, Phone or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 font-medium transition-colors whitespace-nowrap"
          onClick={handleExport}
        >
          📊 Export to CSV
        </button>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center text-slate-400 dark:text-gray-500 py-8">No matching records found</div>
      ) : (
        <>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-b border-slate-200 dark:border-gray-700 font-medium"></th>
                <th className="text-left px-4 py-3 bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-b border-slate-200 dark:border-gray-700 font-medium">Name</th>
                <th className="text-left px-4 py-3 bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-b border-slate-200 dark:border-gray-700 font-medium">Contact</th>
                <th className="text-left px-4 py-3 bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-b border-slate-200 dark:border-gray-700 font-medium">Dates</th>
                <th className="text-left px-4 py-3 bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-b border-slate-200 dark:border-gray-700 font-medium">Status</th>
                <th className="text-left px-4 py-3 bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-b border-slate-200 dark:border-gray-700 font-medium">Notes</th>
                <th className="text-left px-4 py-3 bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-b border-slate-200 dark:border-gray-700 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => (
                <React.Fragment key={customer.id}>
                  <tr className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 border-b border-slate-100 dark:border-gray-700/50">
                      <button
                        className="bg-transparent border-none cursor-pointer text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300 transition-colors"
                        onClick={() => toggleExpand(customer.id)}
                        title={expandedRows.has(customer.id) ? 'Collapse details' : 'Expand details'}
                      >
                        {expandedRows.has(customer.id) ? '▼' : '▶'}
                      </button>
                    </td>
                    <td className="px-4 py-3 border-b border-slate-100 dark:border-gray-700/50">
                      <span className="font-semibold text-slate-900 dark:text-gray-50">{customer.name}</span>
                      {customer.customerType && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">{customer.customerType}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 border-b border-slate-100 dark:border-gray-700/50">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-700 dark:text-gray-300">{customer.phone || '—'}</span>
                        <span className="text-slate-500 dark:text-gray-400 text-xs">{customer.email || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-slate-100 dark:border-gray-700/50">
                      <div className="text-sm">
                        <span className="text-slate-400 dark:text-gray-500 text-xs font-medium">In:</span> {customer.submissionDate}
                        <br />
                        <span className="text-slate-400 dark:text-gray-500 text-xs font-medium">Due:</span> {customer.expectedDate || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-slate-100 dark:border-gray-700/50">
                      {editingStatusId === customer.id ? (
                        <select
                          className="px-2 py-1 border border-slate-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-900 text-slate-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={customer.status}
                          onChange={(e) => {
                            onUpdateStatus(customer.id, e.target.value);
                            setEditingStatusId(null);
                          }}
                          onBlur={() => setEditingStatusId(null)}
                          autoFocus
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <button
                          className="bg-transparent border-none cursor-pointer"
                          onClick={() => setEditingStatusId(customer.id)}
                          title="Click to change status"
                        >
                          <StatusBadge status={customer.status} />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 border-b border-slate-100 dark:border-gray-700/50">
                      <span className="text-slate-500 dark:text-gray-400 text-sm max-w-[150px] truncate block">{customer.notes || '—'}</span>
                    </td>
                    <td className="px-4 py-3 border-b border-slate-100 dark:border-gray-700/50">
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1.5 text-sm border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 font-medium transition-colors"
                          onClick={() => handleEdit(customer)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="px-3 py-1.5 text-sm border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
                          onClick={() => handleDelete(customer.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(customer.id) && (
                    <tr className="bg-slate-50 dark:bg-gray-800/50">
                      <td colSpan="7">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                          <div>
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3 pb-2 border-b border-slate-200 dark:border-gray-700">👤 Customer Info</h4>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Customer Type</span>
                              {displayValue(customer.customerType)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Preferred Contact</span>
                              {displayValue(customer.preferredContact)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Alternate Phone</span>
                              {displayValue(customer.alternatePhone)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Address</span>
                              {displayValue(customer.address)}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3 pb-2 border-b border-slate-200 dark:border-gray-700">📱 Device Info</h4>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Device Type</span>
                              {displayValue(customer.deviceType)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Brand / Model</span>
                              {displayValue(customer.brand && customer.model ? `${customer.brand} ${customer.model}` : customer.brand || customer.model)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">IMEI / Serial</span>
                              {displayValue(customer.imei)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Carrier</span>
                              {displayValue(customer.carrier)}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3 pb-2 border-b border-slate-200 dark:border-gray-700">🔧 Repair Details</h4>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Issue Category</span>
                              {displayValue(customer.issueCategory)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Repair Type</span>
                              {displayValue(customer.repairType)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Priority</span>
                              {displayValue(customer.priority)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Issue Description</span>
                              {displayValue(customer.issueDescription)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Technical Staff</span>
                              {displayValue(customer.technicalStaffName)}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3 pb-2 border-b border-slate-200 dark:border-gray-700">💰 Cost & Parts</h4>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Estimated Cost</span>
                              {formatCurrency(customer.estimatedCost)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Advance Paid</span>
                              {formatCurrency(customer.advancePaid)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Balance Due</span>
                              {customer.estimatedCost ? (
                                <span className="text-sm text-slate-700 dark:text-gray-300">
                                  ${(parseFloat(customer.estimatedCost || 0) - parseFloat(customer.advancePaid || 0)).toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-sm text-slate-400 dark:text-gray-600 italic">N/A</span>
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Parts Type</span>
                              {displayValue(customer.partsType)}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3 pb-2 border-b border-slate-200 dark:border-gray-700">📅 Timeline</h4>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Submitted</span>
                              {displayValue(customer.submissionDate)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Device Received</span>
                              {displayValue(customer.deviceReceivedDate)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Repair Started</span>
                              {displayValue(customer.repairStartDate)}
                            </div>
                            <div className="flex flex-col gap-0.5 mb-2">
                              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Expected Completion</span>
                              {displayValue(customer.expectedDate)}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length > itemsPerPage && (
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-gray-700">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ◀ Prev
            </button>
            <span className="text-sm text-slate-600 dark:text-gray-400">
              Page {currentPage} of {Math.ceil(filteredCustomers.length / itemsPerPage)}
            </span>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage >= Math.ceil(filteredCustomers.length / itemsPerPage)}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next ▶
            </button>
          </div>
        )}
        </>
      )}
    </section>

      {showEditModal && modalCustomer && (
        <EditCustomerModal
          customer={modalCustomer}
          onSave={handleSaveEdit}
          onClose={handleCancelEdit}
          loading={updatingCustomer}
        />
      )}
    </>
    );
}
