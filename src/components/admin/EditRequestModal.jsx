import React, { useState } from 'react';

const PIPELINE_STATUSES = [
  { value: 'new',         label: 'New'          },
  { value: 'contacted',   label: 'Contacted'    },
  { value: 'scheduled',   label: 'Scheduled'    },
  { value: 'closed_won',  label: 'Closed Won'   },
  { value: 'closed_lost', label: 'Closed Lost'  },
];

const ic = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all";
const icStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' };
const lc = "block text-xs font-semibold uppercase tracking-wider mb-1.5";
const lcStyle = { color: 'rgba(255,255,255,0.4)' };

const EditRequestModal = ({ request, onClose, onSave }) => {
  const [form, setForm] = useState({
    firstName:       request.firstName || '',
    lastName:        request.lastName || '',
    email:           request.email || '',
    phone:           request.phone || '',
    company:         request.company || '',
    storeCount:      request.storeCount || '',
    location:        request.location || '',
    monthlyRevenue:  request.monthlyRevenue || '',
    posSystem:       request.posSystem || '',
    currentSystem:   request.currentSystem || '',
    timeframe:       request.timeframe || '',
    topProblems:     request.topProblems || '',
    message:         request.message || '',
    pipelineStatus:  request.pipelineStatus || 'new',
  });
  const [saving, setSaving] = useState(false);

  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(request.id, form); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: '90vh', background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between flex-shrink-0" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <h2 className="text-lg font-bold text-white">Edit Lead</h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{request.firstName} {request.lastName} · {request.company}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Pipeline status */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)' }}>
            <label className={lc} style={{ color: '#00d4aa' }}>Pipeline Status</label>
            <select name="pipelineStatus" value={form.pipelineStatus} onChange={set}
              className={ic} style={icStyle}>
              {PIPELINE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>Contact Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lc} style={lcStyle}>First Name</label><input name="firstName" value={form.firstName} onChange={set} className={ic} style={icStyle}/></div>
              <div><label className={lc} style={lcStyle}>Last Name</label><input name="lastName" value={form.lastName} onChange={set} className={ic} style={icStyle}/></div>
              <div><label className={lc} style={lcStyle}>Email</label><input type="email" name="email" value={form.email} onChange={set} className={ic} style={icStyle}/></div>
              <div><label className={lc} style={lcStyle}>Phone</label><input name="phone" value={form.phone} onChange={set} className={ic} style={icStyle}/></div>
            </div>
          </div>

          {/* Business */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>Business Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lc} style={lcStyle}>Company</label><input name="company" value={form.company} onChange={set} className={ic} style={icStyle}/></div>
              <div><label className={lc} style={lcStyle}>Location</label><input name="location" value={form.location} onChange={set} className={ic} style={icStyle}/></div>
              <div><label className={lc} style={lcStyle}>Store Count</label><input name="storeCount" value={form.storeCount} onChange={set} className={ic} style={icStyle}/></div>
              <div><label className={lc} style={lcStyle}>Monthly Revenue</label><input name="monthlyRevenue" value={form.monthlyRevenue} onChange={set} className={ic} style={icStyle}/></div>
              <div><label className={lc} style={lcStyle}>POS System</label><input name="posSystem" value={form.posSystem} onChange={set} className={ic} style={icStyle}/></div>
              <div><label className={lc} style={lcStyle}>Timeframe</label><input name="timeframe" value={form.timeframe} onChange={set} className={ic} style={icStyle}/></div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>Notes</p>
            <div className="space-y-3">
              <div><label className={lc} style={lcStyle}>Top Problems</label>
                <textarea name="topProblems" value={form.topProblems} onChange={set} rows={2} className={ic + " resize-none"} style={icStyle}/>
              </div>
              <div><label className={lc} style={lcStyle}>Additional Message</label>
                <textarea name="message" value={form.message} onChange={set} rows={2} className={ic + " resize-none"} style={icStyle}/>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#00d4aa,#0ea5e9)', flex: 2 }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRequestModal;
