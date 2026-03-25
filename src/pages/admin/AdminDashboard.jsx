import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { wirelessDb, wirelessAuth } from '../../config/firebaseWireless';
import Papa from 'papaparse';
import EditRequestModal from '../../components/admin/EditRequestModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';

const PIPELINE_STATUSES = [
  { value: 'new',         label: 'New',          bg: 'rgba(14,165,233,0.15)',  color: '#0ea5e9'  },
  { value: 'contacted',   label: 'Contacted',    bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b'  },
  { value: 'scheduled',   label: 'Scheduled',    bg: 'rgba(139,92,246,0.15)',  color: '#8b5cf6'  },
  { value: 'closed_won',  label: 'Closed Won',   bg: 'rgba(16,185,129,0.15)', color: '#10b981'  },
  { value: 'closed_lost', label: 'Closed Lost',  bg: 'rgba(239,68,68,0.15)',  color: '#ef4444'  },
];

function getPipelineMeta(status) {
  return PIPELINE_STATUSES.find(s => s.value === status) || PIPELINE_STATUSES[0];
}

function getSourceMeta(req) {
  if (req.source === 'Audit Funnel') return { label: 'Audit Lead', bg: 'rgba(0,212,170,0.12)', color: '#00d4aa', dot: '#00d4aa' };
  if (req.status === 'complete' || req.status === 'step2_complete') return { label: 'Waitlist — Complete', bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981' };
  if (req.status === 'step1_complete' || req.source === 'WirelessPOS Landing Page') return { label: 'Waitlist — Step 1', bg: 'rgba(14,165,233,0.12)', color: '#0ea5e9', dot: '#0ea5e9' };
  return { label: req.source || 'Unknown', bg: 'rgba(100,116,139,0.1)', color: '#64748b', dot: '#94a3b8' };
}

// Inline pipeline select in table rows — fully custom, no native popup
function PipelineSelect({ value, onChange, dark }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const meta = getPipelineMeta(value);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const bg     = dark ? '#1a2332' : 'white';
  const border = dark ? 'rgba(255,255,255,0.12)' : '#e2e8f0';
  const text   = dark ? 'white' : '#0d1117';
  const hover  = dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9';
  const shadow = dark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 20px rgba(0,0,0,0.12)';

  return (
    <div ref={ref} className="relative inline-block">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
        style={{ background: meta.bg, color: meta.color }}>
        {meta.label}
        <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 rounded-xl overflow-hidden"
          style={{ background: bg, border: `1px solid ${border}`, boxShadow: shadow, minWidth: 140, left: 0 }}>
          {PIPELINE_STATUSES.map(s => (
            <button key={s.value} type="button"
              onClick={() => { onChange(s.value); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap"
              style={{
                background: s.value === value ? (dark ? 'rgba(0,212,170,0.1)' : 'rgba(0,212,170,0.08)') : 'transparent',
                color: s.value === value ? '#00d4aa' : text,
              }}
              onMouseEnter={e => { if (s.value !== value) e.currentTarget.style.background = hover; }}
              onMouseLeave={e => { if (s.value !== value) e.currentTarget.style.background = 'transparent'; }}>
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Fully custom dropdown — no native select popup, works in dark mode
function CustomDropdown({ value, onChange, options, dark, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const bg    = dark ? '#1a2332' : 'white';
  const border= dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  const text  = dark ? 'white' : '#0d1117';
  const hover = dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9';
  const shadow= dark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.12)';

  return (
    <div ref={ref} className="relative" style={{ minWidth: 160 }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm outline-none"
        style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#f8fafc', border: `1px solid ${border}`, color: text }}>
        <span>{selected?.label || placeholder}</span>
        <svg className="w-4 h-4 flex-shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl overflow-hidden"
          style={{ background: bg, border: `1px solid ${border}`, boxShadow: shadow, minWidth: '100%' }}>
          {options.map(opt => (
            <button key={opt.value} type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm transition-colors"
              style={{
                background: opt.value === value ? (dark ? 'rgba(0,212,170,0.1)' : 'rgba(0,212,170,0.08)') : 'transparent',
                color: opt.value === value ? '#00d4aa' : text,
              }}
              onMouseEnter={e => { if (opt.value !== value) e.currentTarget.style.background = hover; }}
              onMouseLeave={e => { if (opt.value !== value) e.currentTarget.style.background = 'transparent'; }}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


function theme(dark) {
  return dark ? {
    bg:         '#0d1117',
    surface:    'rgba(255,255,255,0.04)',
    border:     'rgba(255,255,255,0.08)',
    headerBg:   'rgba(255,255,255,0.03)',
    text:       'white',
    textMuted:  'rgba(255,255,255,0.4)',
    textSub:    'rgba(255,255,255,0.6)',
    inputBg:    'rgba(255,255,255,0.06)',
    inputBorder:'rgba(255,255,255,0.1)',
    rowHover:   'rgba(255,255,255,0.02)',
    thColor:    'rgba(255,255,255,0.35)',
    rowBorder:  'rgba(255,255,255,0.04)',
  } : {
    bg:         '#f1f5f9',
    surface:    'white',
    border:     '#e2e8f0',
    headerBg:   'white',
    text:       '#0d1117',
    textMuted:  '#94a3b8',
    textSub:    '#64748b',
    inputBg:    '#f8fafc',
    inputBorder:'#e2e8f0',
    rowHover:   '#f8fafc',
    thColor:    '#94a3b8',
    rowBorder:  '#f1f5f9',
  };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [deletingRequest, setDeletingRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [pipelineFilter, setPipelineFilter] = useState('all');
  const [dark, setDark] = useState(true);

  const t = theme(dark);

  useEffect(() => {
    const q = query(collection(wirelessDb, 'demoRequests'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q,
      snap => {
        setRequests(snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() || new Date() })));
        setIsLoading(false);
      },
      err => { console.error(err); setError('Failed to load requests.'); setIsLoading(false); }
    );
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(wirelessAuth);
    sessionStorage.removeItem('wirelessAdminAuth');
    sessionStorage.removeItem('wirelessAdminEmail');
    navigate('/admin/login');
  };

  const handleUpdateRequest = async (id, data) => {
    await updateDoc(doc(wirelessDb, 'demoRequests', id), { ...data, updatedAt: new Date() });
    setEditingRequest(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingRequest) return;
    await deleteDoc(doc(wirelessDb, 'demoRequests', deletingRequest.id));
    setDeletingRequest(null);
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(requests.map(r => ({
      // Identity
      'First Name':       r.firstName || '',
      'Last Name':        r.lastName || '',
      'Email':            r.email || '',
      'Phone':            r.phone || '',
      // Business
      'Company':          r.company || '',
      'Location':         r.location || '',
      'Store Count':      r.storeCount || '',
      // Lead meta
      'Source':           getSourceMeta(r).label,
      'Pipeline':         getPipelineMeta(r.pipelineStatus || 'new').label,
      'Date':             r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
      // Waitlist-specific fields
      'Monthly Revenue':  r.monthlyRevenue || '',
      'POS System':       r.posSystem || '',
      'Current System':   r.currentSystem || '',
      'Timeframe':        r.timeframe || '',
      'Top Problems':     r.topProblems || '',
      'Message':          r.message || '',
      'Google Profile':   r.googleProfileLink || '',
      // Audit funnel-specific fields
      'Audit Score':      r.auditScore ? `${r.auditScore}/11` : '',
      'Audit Level':      r.auditLevel || '',
      'Services':         Array.isArray(r.services) ? r.services.join(', ') : (r.services || ''),
      'Challenges':       Array.isArray(r.challenges) ? r.challenges.join(', ') : (r.challenges || ''),
      'Inventory Turnover': r.inventoryTurnover || '',
      'Pricing Strategy': r.pricingStrategy || '',
      'Employee Tracking': r.employeeTracking || '',
      'Employees':        r.employees || '',
    })));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filtered = requests.filter(r => {
    const sm = searchTerm.toLowerCase();
    const matchSearch = !sm || [r.firstName, r.lastName, r.email, r.company].some(v => v?.toLowerCase().includes(sm));
    const matchSource = sourceFilter === 'all' || getSourceMeta(r).label === sourceFilter;
    const matchPipeline = pipelineFilter === 'all' || (r.pipelineStatus || 'new') === pipelineFilter;
    return matchSearch && matchSource && matchPipeline;
  });

  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [searchTerm, sourceFilter, pipelineFilter]);

  const auditLeads = requests.filter(r => r.source === 'Audit Funnel').length;
  const waitlistLeads = requests.filter(r => r.source !== 'Audit Funnel').length;
  const newLeads = requests.filter(r => !r.pipelineStatus || r.pipelineStatus === 'new').length;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const inputStyle = { background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text };
  const surfaceStyle = { background: t.surface, border: `1px solid ${t.border}` };

  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.text, transition: 'background 0.2s, color 0.2s' }}>
      {/* Header */}
      <div style={{ background: t.headerBg, borderBottom: `1px solid ${t.border}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#00d4aa,#0ea5e9)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold" style={{ color: t.text }}>WirelessPOS Admin</h1>
              <p className="text-xs" style={{ color: t.textMuted }}>Lead Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark/Light toggle */}
            <button onClick={() => setDark(d => !d)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.textSub }}>
              {dark ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
                  </svg>
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                  </svg>
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            <button onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.textSub }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Leads',       value: requests.length, color: '#00d4aa' },
            { label: 'Audit Leads',       value: auditLeads,      color: '#0ea5e9' },
            { label: 'Waitlist Leads',    value: waitlistLeads,   color: '#8b5cf6' },
            { label: 'New / Uncontacted', value: newLeads,        color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5" style={surfaceStyle}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: t.textMuted }}>{s.label}</p>
              <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="rounded-2xl p-4 mb-6" style={surfaceStyle}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <svg className="w-4 h-4 absolute left-3 top-3" style={{ color: t.textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input type="text" placeholder="Search name, email, company..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}/>
              </div>
              <CustomDropdown dark={dark} value={sourceFilter} onChange={setSourceFilter} placeholder="All Sources"
                options={[
                  { value: 'all', label: 'All Sources' },
                  { value: 'Audit Lead', label: 'Audit Lead' },
                  { value: 'Waitlist — Step 1', label: 'Waitlist — Step 1' },
                  { value: 'Waitlist — Complete', label: 'Waitlist — Complete' },
                ]}/>
              <CustomDropdown dark={dark} value={pipelineFilter} onChange={setPipelineFilter} placeholder="All Pipeline"
                options={[
                  { value: 'all', label: 'All Pipeline' },
                  ...PIPELINE_STATUSES.map(s => ({ value: s.value, label: s.label })),
                ]}/>
              <button onClick={handleExportCSV} disabled={!requests.length}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 hover:opacity-90 transition-all whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg,#00d4aa,#0ea5e9)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Export CSV
              </button>
            </div>
          </div>
          <div className="mt-3 pt-3 flex gap-5 text-xs" style={{ borderTop: `1px solid ${t.border}`, color: t.textMuted }}>
            <span>Total: <span style={{ color: t.text, fontWeight: 600 }}>{requests.length}</span></span>
            <span>Showing: <span style={{ color: t.text, fontWeight: 600 }}>{filtered.length}</span></span>
            {totalPages > 1 && <span>Page <span style={{ color: t.text, fontWeight: 600 }}>{page}/{totalPages}</span></span>}
          </div>
        </div>

        {/* Table — desktop / Cards — mobile */}
        {isLoading ? (
          <div className="rounded-2xl p-16 text-center" style={surfaceStyle}>
            <svg className="w-6 h-6 animate-spin mx-auto mb-3" style={{ color: '#00d4aa' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <p className="text-sm" style={{ color: t.textMuted }}>Loading leads...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl p-12 text-center" style={{ ...surfaceStyle, borderColor: 'rgba(239,68,68,0.3)' }}>
            <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={surfaceStyle}>
            <p className="text-sm" style={{ color: t.textMuted }}>No leads found</p>
          </div>
        ) : (
          <>
            {/* Mobile cards (< md) */}
            <div className="md:hidden flex flex-col gap-3">
              {paginated.map(req => {
                const sm = getSourceMeta(req);
                return (
                  <div key={req.id} className="rounded-2xl p-4" style={surfaceStyle}>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="text-sm font-bold" style={{ color: t.text }}>{req.firstName} {req.lastName}</p>
                        <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>{req.email}</p>
                        {req.phone && (
                          <a href={`tel:${req.phone}`} className="text-xs mt-0.5 flex items-center gap-1"
                            style={{ color: '#00d4aa' }}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                            {req.phone}
                          </a>
                        )}
                        {req.company && <p className="text-xs mt-0.5" style={{ color: t.textSub }}>{req.company}</p>}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => setEditingRequest(req)} className="p-1.5 rounded-lg"
                          style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa' }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button onClick={() => setDeletingRequest(req)} className="p-1.5 rounded-lg"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    {/* Footer row — fixed layout, no ml-auto */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                        style={{ background: sm.bg, color: sm.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: sm.dot }}/>
                        {sm.label}
                      </span>
                      <div className="flex-shrink-0">
                        <PipelineSelect dark={dark} value={req.pipelineStatus || 'new'}
                          onChange={async val => {
                            await updateDoc(doc(wirelessDb,'demoRequests',req.id),{pipelineStatus:val,updatedAt:new Date()});
                          }}/>
                      </div>
                      {req.auditScore && (
                        <span className="text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0"
                          style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa' }}>
                          {req.auditScore}/11
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-2" style={{ color: t.textMuted }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Desktop table (>= md) */}
            <div className="hidden md:block rounded-2xl overflow-hidden" style={surfaceStyle}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${t.border}`, background: dark ? 'rgba(255,255,255,0.02)' : '#f8fafc' }}>
                      {['Name','Email','Company','Source','Pipeline','Audit Score','Date','Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                          style={{ color: t.thColor }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map(req => {
                      const sm = getSourceMeta(req);
                      return (
                        <tr key={req.id} style={{ borderBottom: `1px solid ${t.rowBorder}`, transition: 'background 0.1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = t.rowHover}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap" style={{ color: t.text }}>
                            {req.firstName} {req.lastName}
                          </td>
                          <td className="px-4 py-3 text-sm" style={{ color: t.textSub }}>{req.email}</td>
                          <td className="px-4 py-3 text-sm" style={{ color: t.text }}>{req.company || '—'}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                              style={{ background: sm.bg, color: sm.color }}>
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sm.dot }}/>
                              {sm.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <PipelineSelect dark={dark} value={req.pipelineStatus || 'new'}
                              onChange={async val => {
                                await updateDoc(doc(wirelessDb,'demoRequests',req.id),{pipelineStatus:val,updatedAt:new Date()});
                              }}/>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {req.auditScore
                              ? <span className="font-bold" style={{ color: '#00d4aa' }}>{req.auditScore}/11</span>
                              : <span style={{ color: t.textMuted }}>—</span>}
                          </td>
                          <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: t.textMuted }}>
                            {new Date(req.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setEditingRequest(req)} className="p-1.5 rounded-lg transition-all"
                                style={{ color: t.textMuted }}
                                onMouseEnter={e => { e.currentTarget.style.background='rgba(0,212,170,0.1)'; e.currentTarget.style.color='#00d4aa'; }}
                                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=t.textMuted; }}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                              </button>
                              <button onClick={() => setDeletingRequest(req)} className="p-1.5 rounded-lg transition-all"
                                style={{ color: t.textMuted }}
                                onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#ef4444'; }}
                                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=t.textMuted; }}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-xs" style={{ color: t.textMuted }}>
              Page <span style={{ color: t.text, fontWeight: 600 }}>{page}</span> of <span style={{ color: t.text, fontWeight: 600 }}>{totalPages}</span>
              <span className="ml-2">({filtered.length} total)</span>
            </p>
            <div className="flex items-center gap-1">
              {/* Prev */}
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-30"
                style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.textSub }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/>
                </svg>
                <span className="hidden sm:inline">Prev</span>
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce((acc, n, idx, arr) => {
                  if (idx > 0 && n - arr[idx - 1] > 1) acc.push('...');
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) =>
                  n === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-xs" style={{ color: t.textMuted }}>…</span>
                  ) : (
                    <button key={n} onClick={() => setPage(n)}
                      className="w-8 h-8 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: n === page ? 'linear-gradient(135deg,#00d4aa,#0ea5e9)' : t.surface,
                        border: `1px solid ${n === page ? 'transparent' : t.border}`,
                        color: n === page ? 'white' : t.textSub,
                      }}>
                      {n}
                    </button>
                  )
                )}

              {/* Next */}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-30"
                style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.textSub }}>
                <span className="hidden sm:inline">Next</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {editingRequest && <EditRequestModal request={editingRequest} onClose={() => setEditingRequest(null)} onSave={handleUpdateRequest}/>}
      {deletingRequest && <DeleteConfirmModal request={deletingRequest} onClose={() => setDeletingRequest(null)} onConfirm={handleConfirmDelete}/>}
    </div>
  );
}
