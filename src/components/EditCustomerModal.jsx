import { useState, useEffect } from 'react';

// Constants for dropdown options (same as CustomerForm)
const STATUS_OPTIONS = [
  'Select',
  'Submitted',
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

const DEVICE_TYPES = ['Phone', 'Tablet', 'Laptop', 'Wearable', 'Other'];
const BRANDS = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Motorola', 'LG', 'Other'];
const CARRIERS = ['AT&T', 'Verizon', 'T-Mobile', 'Sprint', 'Unlocked', 'Other'];
const CUSTOMER_TYPES = ['Walk-in', 'Online', 'Corporate', 'Warranty'];
const CONTACT_METHODS = ['Call', 'SMS', 'Email'];
const ISSUE_CATEGORIES = ['Screen', 'Battery', 'Charging Port', 'Camera', 'Software', 'Water Damage', 'Other'];
const REPAIR_TYPES = ['Repair', 'Diagnostic Only', 'Data Recovery'];
const PRIORITY_LEVELS = ['Normal', 'Urgent', 'Same-day'];
const PARTS_TYPES = ['OEM', 'Aftermarket'];

const FORM_MODE_KEY = 'customerFormMode';

export default function EditCustomerModal({ customer, onSave, onClose, loading }) {
  const [formMode, setFormMode] = useState(() => {
    return localStorage.getItem(FORM_MODE_KEY) || 'minimal';
  });
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    customerInfo: true,
    deviceInfo: true,
    repairDetails: true,
    costParts: true,
  });

  // Initialize form data from customer
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        submissionDate: customer.submissionDate || '',
        expectedDate: customer.expectedDate || '',
        status: customer.status || 'Select',
        notes: customer.notes || '',
        alternatePhone: customer.alternatePhone || '',
        customerType: customer.customerType || '',
        preferredContact: customer.preferredContact || '',
        deviceType: customer.deviceType || '',
        brand: customer.brand || '',
        model: customer.model || '',
        imei: customer.imei || '',
        carrier: customer.carrier || '',
        issueCategory: customer.issueCategory || '',
        issueDescription: customer.issueDescription || '',
        repairType: customer.repairType || '',
        priority: customer.priority || '',
        estimatedCost: customer.estimatedCost || '',
        advancePaid: customer.advancePaid || '',
        partsType: customer.partsType || '',
        deviceReceivedDate: customer.deviceReceivedDate || '',
        repairStartDate: customer.repairStartDate || '',
      });
    }
  }, [customer]);

  // Persist form mode preference
  useEffect(() => {
    localStorage.setItem(FORM_MODE_KEY, formMode);
  }, [formMode]);

  function toggleSection(section) {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setWarning('');
  }

  function validateIMEI(imei) {
    if (!imei) return true;
    return /^\d{15}$/.test(imei);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setWarning('');

    const today = new Date().toISOString().slice(0, 10);

    if (formData.submissionDate > today) {
      setError('Submission Date cannot be a future date');
      return;
    }

    if (formData.expectedDate && formData.expectedDate < formData.submissionDate) {
      setError('Expected Date cannot be earlier than Submission Date');
      return;
    }

    if (formData.status === 'Select') {
      setError('Please select a valid status');
      return;
    }

    if (formData.imei && !validateIMEI(formData.imei)) {
      setWarning('IMEI should be 15 digits. Proceeding anyway...');
    }

    onSave(formData);
  }

  // Close modal on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>✏️ Edit Customer Record</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Form Mode Toggle */}
        <div className="form-mode-toggle">
          <button
            type="button"
            className={`toggle-btn ${formMode === 'minimal' ? 'active' : ''}`}
            onClick={() => setFormMode('minimal')}
          >
            📱 Minimal
          </button>
          <button
            type="button"
            className={`toggle-btn ${formMode === 'detailed' ? 'active' : ''}`}
            onClick={() => setFormMode('detailed')}
          >
            💻 Detailed
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Basic Info - Always visible */}
          <div className="row two">
            <div>
              <label className="label">Name *</label>
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

          {/* Extended Customer Info - Detailed mode only */}
          {formMode === 'detailed' && (
            <div className="collapsible-section">
              <button
                type="button"
                className="section-header"
                onClick={() => toggleSection('customerInfo')}
              >
                <span>👤 Extended Customer Info</span>
                <span className="toggle-icon">{expandedSections.customerInfo ? '▼' : '▶'}</span>
              </button>
              {expandedSections.customerInfo && (
                <div className="section-content">
                  <div className="row three">
                    <div>
                      <label className="label">Alternate Phone</label>
                      <input
                        name="alternatePhone"
                        className="input"
                        value={formData.alternatePhone}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="label">Customer Type</label>
                      <select
                        name="customerType"
                        className="select"
                        value={formData.customerType}
                        onChange={handleChange}
                      >
                        <option value="">Select Type</option>
                        {CUSTOMER_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Preferred Contact</label>
                      <select
                        name="preferredContact"
                        className="select"
                        value={formData.preferredContact}
                        onChange={handleChange}
                      >
                        <option value="">Select Method</option>
                        {CONTACT_METHODS.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Device Information - Detailed mode only */}
          {formMode === 'detailed' && (
            <div className="collapsible-section">
              <button
                type="button"
                className="section-header"
                onClick={() => toggleSection('deviceInfo')}
              >
                <span>📱 Device Information</span>
                <span className="toggle-icon">{expandedSections.deviceInfo ? '▼' : '▶'}</span>
              </button>
              {expandedSections.deviceInfo && (
                <div className="section-content">
                  <div className="row three">
                    <div>
                      <label className="label">Device Type</label>
                      <select
                        name="deviceType"
                        className="select"
                        value={formData.deviceType}
                        onChange={handleChange}
                      >
                        <option value="">Select Type</option>
                        {DEVICE_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Brand</label>
                      <select
                        name="brand"
                        className="select"
                        value={formData.brand}
                        onChange={handleChange}
                      >
                        <option value="">Select Brand</option>
                        {BRANDS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Model</label>
                      <input
                        name="model"
                        className="input"
                        placeholder="e.g., iPhone 13 Pro"
                        value={formData.model}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row two">
                    <div>
                      <label className="label">IMEI / Serial Number</label>
                      <input
                        name="imei"
                        className="input"
                        placeholder="15-digit IMEI"
                        value={formData.imei}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="label">Carrier</label>
                      <select
                        name="carrier"
                        className="select"
                        value={formData.carrier}
                        onChange={handleChange}
                      >
                        <option value="">Select Carrier</option>
                        {CARRIERS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Repair Details - Detailed mode only */}
          {formMode === 'detailed' && (
            <div className="collapsible-section">
              <button
                type="button"
                className="section-header"
                onClick={() => toggleSection('repairDetails')}
              >
                <span>🔧 Repair Details</span>
                <span className="toggle-icon">{expandedSections.repairDetails ? '▼' : '▶'}</span>
              </button>
              {expandedSections.repairDetails && (
                <div className="section-content">
                  <div className="row three">
                    <div>
                      <label className="label">Issue Category</label>
                      <select
                        name="issueCategory"
                        className="select"
                        value={formData.issueCategory}
                        onChange={handleChange}
                      >
                        <option value="">Select Issue</option>
                        {ISSUE_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Repair Type</label>
                      <select
                        name="repairType"
                        className="select"
                        value={formData.repairType}
                        onChange={handleChange}
                      >
                        <option value="">Select Type</option>
                        {REPAIR_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Priority</label>
                      <select
                        name="priority"
                        className="select"
                        value={formData.priority}
                        onChange={handleChange}
                      >
                        <option value="">Normal</option>
                        {PRIORITY_LEVELS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Issue Description</label>
                    <textarea
                      name="issueDescription"
                      className="textarea"
                      value={formData.issueDescription}
                      onChange={handleChange}
                      placeholder="Describe the issue in detail..."
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cost & Parts - Detailed mode only */}
          {formMode === 'detailed' && (
            <div className="collapsible-section">
              <button
                type="button"
                className="section-header"
                onClick={() => toggleSection('costParts')}
              >
                <span>💰 Cost & Parts</span>
                <span className="toggle-icon">{expandedSections.costParts ? '▼' : '▶'}</span>
              </button>
              {expandedSections.costParts && (
                <div className="section-content">
                  <div className="row three">
                    <div>
                      <label className="label">Estimated Cost ($)</label>
                      <input
                        name="estimatedCost"
                        type="number"
                        className="input"
                        placeholder="0.00"
                        value={formData.estimatedCost}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="label">Advance Paid ($)</label>
                      <input
                        name="advancePaid"
                        type="number"
                        className="input"
                        placeholder="0.00"
                        value={formData.advancePaid}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="label">Parts Type</label>
                      <select
                        name="partsType"
                        className="select"
                        value={formData.partsType}
                        onChange={handleChange}
                      >
                        <option value="">Select Type</option>
                        {PARTS_TYPES.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dates & Status - Always visible */}
          <div className="row three">
            <div>
              <label className="label">Submission Date *</label>
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
              <label className="label">Status *</label>
              <select
                name="status"
                className="select"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
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

          {/* Additional Dates - Detailed mode only */}
          {formMode === 'detailed' && (
            <div className="row two">
              <div>
                <label className="label">Device Received Date</label>
                <input
                  name="deviceReceivedDate"
                  type="date"
                  className="input"
                  value={formData.deviceReceivedDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="label">Repair Start Date</label>
                <input
                  name="repairStartDate"
                  type="date"
                  className="input"
                  value={formData.repairStartDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

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

          {warning && <div className="warning-message">⚠️ {warning}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
