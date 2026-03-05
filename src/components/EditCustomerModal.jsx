import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

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

export default function EditCustomerModal({ customer, onSave, onClose, loading, inline = false }) {
  const [formMode, setFormMode] = useState(() => {
    return localStorage.getItem(FORM_MODE_KEY) || 'minimal';
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    submissionDate: '',
    expectedDate: '',
    status: 'Select',
    notes: '',
    alternatePhone: '',
    customerType: '',
    preferredContact: '',
    deviceType: '',
    brand: '',
    model: '',
    imei: '',
    carrier: '',
    issueCategory: '',
    issueDescription: '',
    repairType: '',
    priority: '',
    estimatedCost: '',
    advancePaid: '',
    partsType: '',
    deviceReceivedDate: '',
    repairStartDate: '',
    technicalStaffName: '',
  });
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    customerInfo: true,
    deviceInfo: true,
    repairDetails: true,
    costParts: true,
  });

  useEffect(() => {
    if (customer) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing state from prop
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
        technicalStaffName: customer.technicalStaffName || '',
      });
    }
  }, [customer]);

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
      setError('IMEI must be exactly 15 digits');
      return;
    }

    onSave(formData);
  }

  useEffect(() => {
    if (inline) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, inline]);

  useEffect(() => {
    if (inline && !isFullscreen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [inline, isFullscreen]);

  useEffect(() => {
    if (!inline || !isFullscreen) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inline, isFullscreen]);

  const inputClasses = "w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-slate-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";
  const labelClasses = "block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1";

  const formContent = (
    <>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${formMode === 'minimal' ? 'bg-blue-600 text-white border border-blue-600 dark:bg-blue-500 dark:border-blue-500' : 'border border-slate-300 dark:border-gray-600 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700'}`}
          onClick={() => setFormMode('minimal')}
        >
          📱 Minimal
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${formMode === 'detailed' ? 'bg-blue-600 text-white border border-blue-600 dark:bg-blue-500 dark:border-blue-500' : 'border border-slate-300 dark:border-gray-600 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700'}`}
          onClick={() => setFormMode('detailed')}
        >
          💻 Detailed
        </button>
      </div>

      <form onSubmit={handleSubmit} id="edit-customer-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClasses} htmlFor="edit-name">Name *</label>
              <input
                id="edit-name"
                name="name"
                className={inputClasses}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className={labelClasses} htmlFor="edit-email">Email</label>
              <input
                id="edit-email"
                name="email"
                type="email"
                className={inputClasses}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClasses} htmlFor="edit-phone">Phone</label>
              <input
                id="edit-phone"
                name="phone"
                className={inputClasses}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className={labelClasses} htmlFor="edit-address">Address</label>
              <input
                id="edit-address"
                name="address"
                className={inputClasses}
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          {formMode === 'detailed' && (
            <div className="border border-slate-200 dark:border-gray-700 rounded-lg mb-4 overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 text-sm font-medium text-slate-700 dark:text-gray-300 transition-colors"
                onClick={() => toggleSection('customerInfo')}
              >
                <span>👤 Extended Customer Info</span>
                <span className="text-slate-400 dark:text-gray-500">{expandedSections.customerInfo ? '▼' : '▶'}</span>
              </button>
              {expandedSections.customerInfo && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className={labelClasses} htmlFor="edit-alternatePhone">Alternate Phone</label>
                      <input
                        id="edit-alternatePhone"
                        name="alternatePhone"
                        className={inputClasses}
                        value={formData.alternatePhone}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className={labelClasses} htmlFor="edit-customerType">Customer Type</label>
                      <select
                        id="edit-customerType"
                        name="customerType"
                        className={inputClasses}
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
                      <label className={labelClasses} htmlFor="edit-preferredContact">Preferred Contact</label>
                      <select
                        id="edit-preferredContact"
                        name="preferredContact"
                        className={inputClasses}
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

          {formMode === 'detailed' && (
            <div className="border border-slate-200 dark:border-gray-700 rounded-lg mb-4 overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 text-sm font-medium text-slate-700 dark:text-gray-300 transition-colors"
                onClick={() => toggleSection('deviceInfo')}
              >
                <span>📱 Device Information</span>
                <span className="text-slate-400 dark:text-gray-500">{expandedSections.deviceInfo ? '▼' : '▶'}</span>
              </button>
              {expandedSections.deviceInfo && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className={labelClasses} htmlFor="edit-deviceType">Device Type</label>
                      <select
                        id="edit-deviceType"
                        name="deviceType"
                        className={inputClasses}
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
                      <label className={labelClasses} htmlFor="edit-brand">Brand</label>
                      <select
                        id="edit-brand"
                        name="brand"
                        className={inputClasses}
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
                      <label className={labelClasses} htmlFor="edit-model">Model</label>
                      <input
                        id="edit-model"
                        name="model"
                        className={inputClasses}
                        placeholder="e.g., iPhone 13 Pro"
                        value={formData.model}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={labelClasses} htmlFor="edit-imei">IMEI / Serial Number</label>
                      <input
                        id="edit-imei"
                        name="imei"
                        className={inputClasses}
                        placeholder="15-digit IMEI"
                        value={formData.imei}
                        onChange={handleChange}
                        maxLength={15}
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className={labelClasses} htmlFor="edit-carrier">Carrier</label>
                      <select
                        id="edit-carrier"
                        name="carrier"
                        className={inputClasses}
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

          {formMode === 'detailed' && (
            <div className="border border-slate-200 dark:border-gray-700 rounded-lg mb-4 overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 text-sm font-medium text-slate-700 dark:text-gray-300 transition-colors"
                onClick={() => toggleSection('repairDetails')}
              >
                <span>🔧 Repair Details</span>
                <span className="text-slate-400 dark:text-gray-500">{expandedSections.repairDetails ? '▼' : '▶'}</span>
              </button>
              {expandedSections.repairDetails && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className={labelClasses} htmlFor="edit-issueCategory">Issue Category</label>
                      <select
                        id="edit-issueCategory"
                        name="issueCategory"
                        className={inputClasses}
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
                      <label className={labelClasses} htmlFor="edit-repairType">Repair Type</label>
                      <select
                        id="edit-repairType"
                        name="repairType"
                        className={inputClasses}
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
                      <label className={labelClasses} htmlFor="edit-priority">Priority</label>
                      <select
                        id="edit-priority"
                        name="priority"
                        className={inputClasses}
                        value={formData.priority}
                        onChange={handleChange}
                      >
                        <option value="">Select Priority</option>
                        {PRIORITY_LEVELS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className={labelClasses} htmlFor="edit-issueDescription">Issue Description</label>
                    <textarea
                      id="edit-issueDescription"
                      name="issueDescription"
                      className={`${inputClasses} min-h-[80px] resize-y`}
                      value={formData.issueDescription}
                      onChange={handleChange}
                      placeholder="Describe the issue in detail..."
                    />
                  </div>
                  <div>
                    <label className={labelClasses} htmlFor="edit-technicalStaffName">Technical Staff Name</label>
                    <input
                      id="edit-technicalStaffName"
                      name="technicalStaffName"
                      className={inputClasses}
                      value={formData.technicalStaffName}
                      onChange={handleChange}
                      placeholder="Name of assigned technician"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {formMode === 'detailed' && (
            <div className="border border-slate-200 dark:border-gray-700 rounded-lg mb-4 overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 text-sm font-medium text-slate-700 dark:text-gray-300 transition-colors"
                onClick={() => toggleSection('costParts')}
              >
                <span>💰 Cost & Parts</span>
                <span className="text-slate-400 dark:text-gray-500">{expandedSections.costParts ? '▼' : '▶'}</span>
              </button>
              {expandedSections.costParts && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className={labelClasses} htmlFor="edit-estimatedCost">Estimated Cost ($)</label>
                      <input
                        id="edit-estimatedCost"
                        name="estimatedCost"
                        type="number"
                        className={inputClasses}
                        placeholder="0.00"
                        value={formData.estimatedCost}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className={labelClasses} htmlFor="edit-advancePaid">Advance Paid ($)</label>
                      <input
                        id="edit-advancePaid"
                        name="advancePaid"
                        type="number"
                        className={inputClasses}
                        placeholder="0.00"
                        value={formData.advancePaid}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className={labelClasses} htmlFor="edit-partsType">Parts Type</label>
                      <select
                        id="edit-partsType"
                        name="partsType"
                        className={inputClasses}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={labelClasses} htmlFor="edit-submissionDate">Submission Date *</label>
              <input
                id="edit-submissionDate"
                name="submissionDate"
                type="date"
                className={inputClasses}
                value={formData.submissionDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className={labelClasses} htmlFor="edit-status">Status *</label>
              <select
                id="edit-status"
                name="status"
                className={inputClasses}
                value={formData.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses} htmlFor="edit-expectedDate">Expected Date</label>
              <input
                id="edit-expectedDate"
                name="expectedDate"
                type="date"
                className={inputClasses}
                value={formData.expectedDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {formMode === 'detailed' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClasses} htmlFor="edit-deviceReceivedDate">Device Received Date by Technical Staff</label>
                <input
                  id="edit-deviceReceivedDate"
                  name="deviceReceivedDate"
                  type="date"
                  className={inputClasses}
                  value={formData.deviceReceivedDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className={labelClasses} htmlFor="edit-repairStartDate">Repair Start Date</label>
                <input
                  id="edit-repairStartDate"
                  name="repairStartDate"
                  type="date"
                  className={inputClasses}
                  value={formData.repairStartDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className={labelClasses} htmlFor="edit-notes">Notes</label>
            <textarea
              id="edit-notes"
              name="notes"
              className={`${inputClasses} min-h-[80px] resize-y`}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes here..."
            />
          </div>

          {warning && <div className="text-amber-600 dark:text-amber-400 text-sm mt-2">⚠️ {warning}</div>}
          {error && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</div>}

          {!inline && (
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-gray-700">
              <button
                type="button"
                className="px-4 py-2 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 font-medium transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}
        </form>
        {inline && (
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-gray-700">
            <button
              type="button"
              className="px-4 py-2 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 font-medium transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-customer-form"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
          </div>
        )}
    </>
  );

  if (inline) {
    const inlineContent = (
      <div className={`border border-slate-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto rounded-none' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-semibold text-slate-900 dark:text-gray-50">✏️ Edit Customer Record</h4>
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300 bg-transparent border-none cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? '⛶' : '⛶'}
            </button>
          </div>
        </div>
        {formContent}
      </div>
    );

    if (isFullscreen) {
      return createPortal(
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          {inlineContent}
        </div>,
        document.body
      );
    }

    return inlineContent;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50">✏️ Edit Customer Record</h3>
          <button
            className="text-2xl leading-none text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300 bg-transparent border-none cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {formContent}
      </div>
    </div>
  );
}
