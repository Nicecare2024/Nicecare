import { useState } from 'react';

export default function CustomerForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    submissionDate: new Date().toISOString().slice(0, 10),
    expectedDate: '',
    status: 'Select',
    notes: '',
  });
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const today = new Date().toISOString().slice(0, 10);

    // Validate submission date is not in the future
    if (formData.submissionDate > today) {
      setError('Submission Date cannot be a future date');
      return;
    }

    // Validate expected date is not before submission date
    if (formData.expectedDate && formData.expectedDate < formData.submissionDate) {
      setError('Expected Date cannot be earlier than Submission Date');
      return;
    }

    // Validate status is selected
    if (formData.status === 'Select') {
      setError('Please select a valid status');
      return;
    }

    onSubmit(formData);

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      submissionDate: new Date().toISOString().slice(0, 10),
      expectedDate: '',
      status: 'Select',
      notes: '',
    });
  }

  function handleReset() {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      submissionDate: new Date().toISOString().slice(0, 10),
      expectedDate: '',
      status: 'Select',
      notes: '',
    });
    setError('');
  }

  return (
    <section className="card">
      <h3>New Customer Submission</h3>

      <form onSubmit={handleSubmit}>
        <div className="row two">
          <div>
            <label className="label">Name</label>
            <input
              name="name"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              name="email"
              type="email"
              className="input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row two">
          <div>
            <label className="label">Phone</label>
            <input
              name="phone"
              className="input"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Address</label>
            <input
              name="address"
              className="input"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row three">
          <div>
            <label className="label">Submission Date</label>
            <input
              name="submissionDate"
              type="date"
              className="input"
              value={formData.submissionDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              name="status"
              className="select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Select">Select</option>
              <option value="Submitted">Submitted</option>
              <option value="In Queue">In Queue</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Deliverable">Deliverable</option>
            </select>
          </div>
          <div>
            <label className="label">Expected Date</label>
            <input
              name="expectedDate"
              type="date"
              className="input"
              value={formData.expectedDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea
            name="notes"
            className="textarea"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional notes here..."
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? '⏳ Adding...' : '➕ Add Customer'}
          </button>
          <button type="button" className="btn-outline" onClick={handleReset}>
            🗑️ Clear
          </button>
        </div>
      </form>
    </section>
  );
}
