import { useState, useMemo } from 'react';

const STATUS_OPTIONS = ['Select', 'Submitted', 'In Queue', 'In Progress', 'Completed', 'Deliverable'];

export default function CustomerTable({ customers, onUpdateStatus, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;

    const term = searchTerm.toLowerCase();
    return customers.filter((customer) => {
      return (
        customer.name?.toLowerCase().includes(term) ||
        customer.phone?.toLowerCase().includes(term) ||
        customer.email?.toLowerCase().includes(term)
      );
    });
  }, [customers, searchTerm]);

  function handleExport() {
    const headers = ['Name', 'Email', 'Phone', 'Address', 'Submission Date', 'Expected Date', 'Status', 'Notes'];
    const rows = filteredCustomers.map((c) => {
      return [
        c.name || '',
        c.email || '',
        c.phone || '',
        c.address || '',
        c.submissionDate || '',
        c.expectedDate || '',
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

  if (customers.length === 0) {
    return (
      <section className="card">
        <h3>All Submissions</h3>
        <div className="empty">No records yet. Add your first customer!</div>
      </section>
    );
  }

  return (
    <section className="card">
      <h3>All Submissions</h3>

      <div className="search-bar">
        <input
          className="input"
          placeholder="🔍 Search by Name, Phone or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn" onClick={handleExport}>
          📊 Export to CSV
        </button>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="empty">No matching records found</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>
                    {customer.phone || '-'}
                    <br />
                    {customer.email || '-'}
                  </td>
                  <td>
                    {customer.submissionDate}
                    <br />
                    {customer.expectedDate || '-'}
                  </td>
                  <td>
                    <select
                      className="inline-select"
                      value={customer.status}
                      onChange={(e) => onUpdateStatus(customer.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{customer.notes || '-'}</td>
                  <td>
                    <button
                      className="btn-outline btn-danger"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
