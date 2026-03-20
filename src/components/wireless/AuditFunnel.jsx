import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { wirelessDb } from '../../config/firebaseWireless';

const SERVICES = ['Phone Repairs', 'Accessories Sales', 'Activations', 'Bill Payments', 'Unlocks', 'Device Sales'];
const CHALLENGES = [
  { label: 'Inventory issues', score: 2 },
  { label: 'Low profit margins', score: 4 },
  { label: 'Employees not selling enough', score: 3 },
  { label: 'No clear reporting', score: 3 },
  { label: 'Pricing uncertainty', score: 4 },
  { label: 'Disconnected systems', score: 2 },
];

function calcScore(data) {
  let s = 0;
  const inv = { Fast: 0, Moderate: 1, Slow: 3, "Don't track": 4 };
  const price = { 'Cost + margin': 0, Competitors: 1, Guesswork: 3, 'Not consistent': 4 };
  const emp = { Yes: 0, Sometimes: 2, No: 4 };
  s += inv[data.inventoryTurnover] ?? 0;
  s += price[data.pricingStrategy] ?? 0;
  s += emp[data.employeeTracking] ?? 0;
  s += CHALLENGES.find(c => c.label === data.biggestChallenge)?.score ?? 0;
  return s;
}

function getReport(score, data) {
  if (score <= 5) return {
    level: 'Healthy Store',
    color: '#00d4aa',
    summary: 'Your store has solid fundamentals. With WirelessCEO, you can optimize margins and scale faster.',
    findings: ['Your pricing strategy is working', 'Inventory is moving well', 'Staff performance is tracked'],
    opportunity: 'Stores like yours typically unlock 10–15% more profit with AI-driven pricing and upsell automation.',
  };
  if (score <= 10) return {
    level: 'Growth Opportunities',
    color: '#0ea5e9',
    summary: 'Your store is running but leaving money on the table. Several areas can be optimized for higher margins.',
    findings: [
      data.pricingStrategy !== 'Cost + margin' ? 'Pricing is not optimized — you may be undercharging' : null,
      data.inventoryTurnover === 'Moderate' ? 'Inventory is moving but aging stock may be costing you' : null,
      data.employeeTracking !== 'Yes' ? 'Employee performance gaps are likely going unnoticed' : null,
    ].filter(Boolean),
    opportunity: 'Stores at this stage typically see 15–20% profit improvement within 90 days of using WirelessCEO.',
  };
  if (score <= 20) return {
    level: 'Profit Leakage Detected',
    color: '#f59e0b',
    summary: 'Your store has significant profit leaks. Without visibility into margins and performance, you\'re losing thousands monthly.',
    findings: [
      data.inventoryTurnover === 'Slow' || data.inventoryTurnover === "Don't track" ? '⚠ Inventory is aging or untracked — dead stock is costing you' : null,
      data.pricingStrategy === 'Guesswork' || data.pricingStrategy === 'Not consistent' ? '⚠ Inconsistent pricing is eroding your margins daily' : null,
      data.employeeTracking === 'No' ? '⚠ No employee tracking means underperformers go unnoticed' : null,
      `⚠ ${data.biggestChallenge} is your #1 challenge — this needs immediate attention`,
    ].filter(Boolean),
    opportunity: 'Stores with this profile typically recover 20–30% in lost profit within 60 days of implementing WirelessCEO.',
  };
  return {
    level: 'Critical Inefficiencies',
    color: '#ef4444',
    summary: 'Your store is operating reactively. Multiple systems are broken and profit is leaking from every direction.',
    findings: [
      '🚨 Inventory is untracked — you have no visibility into what\'s selling or aging',
      '🚨 Pricing is inconsistent — you\'re likely undercharging on repairs',
      '🚨 No employee accountability — revenue per employee is unknown',
      `🚨 ${data.biggestChallenge} is critically impacting your bottom line`,
    ],
    opportunity: 'Stores in this situation typically see 25–35% profit improvement in the first 90 days with WirelessPOS + WirelessCEO.',
  };
}

const inputCls = "w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-sm bg-gray-50 focus:bg-white outline-none transition-colors";
const labelCls = "block text-sm font-semibold text-gray-700 mb-1.5";

const AuditFunnel = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    storeName: '', monthlyRevenue: '', employees: '',
    services: [],
    biggestChallenge: '',
    inventoryTurnover: '', pricingStrategy: '', employeeTracking: '',
    name: '', email: '', phone: '',
  });
  const [report, setReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));
  const toggleService = (s) => setData(prev => ({
    ...prev,
    services: prev.services.includes(s) ? prev.services.filter(x => x !== s) : [...prev.services, s],
  }));

  const handleSubmit = async () => {
    setSubmitting(true);
    const score = calcScore(data);
    const r = getReport(score, data);
    setReport({ ...r, score });
    try {
      await addDoc(collection(wirelessDb, 'auditSubmissions'), {
        ...data,
        score,
        reportLevel: r.level,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Audit save error:', e);
    } finally {
      setSubmitting(false);
      setStep(6);
    }
  };

  const handleClose = () => {
    setStep(1);
    setData({ storeName: '', monthlyRevenue: '', employees: '', services: [], biggestChallenge: '', inventoryTurnover: '', pricingStrategy: '', employeeTracking: '', name: '', email: '', phone: '' });
    setReport(null);
    onClose();
  };

  if (!isOpen) return null;

  const totalSteps = 5;
  const progress = Math.round((Math.min(step, totalSteps) / totalSteps) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl flex flex-col" style={{ maxHeight: '92vh' }}>

        {/* Drag handle mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="px-5 pt-4 pb-5 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0d1117, #1a2332)' }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#00d4aa' }}>Store Profit Diagnostic</p>
              <h2 className="text-lg font-bold text-white">
                {step === 6 ? 'Your Audit Results' : 'Free Store Profit Audit'}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {step === 6 ? 'Personalized for your store' : `Step ${Math.min(step, totalSteps)} of ${totalSteps}`}
              </p>
            </div>
            <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {step < 6 && (
            <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #00d4aa, #0ea5e9)' }} />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-5">

          {/* Step 1 — Store Basics */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Store Name *</label>
                <input type="text" value={data.storeName} onChange={e => set('storeName', e.target.value)}
                  className={inputCls} placeholder="ABC Wireless" />
              </div>
              <div>
                <label className={labelCls}>Monthly Revenue</label>
                <div className="grid grid-cols-1 gap-2">
                  {['Under $10K', '$10K–$25K', '$25K–$50K', '$50K–$100K', '$100K+'].map(opt => (
                    <button key={opt} type="button" onClick={() => set('monthlyRevenue', opt)}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all"
                      style={{ borderColor: data.monthlyRevenue === opt ? '#00d4aa' : '#e2e8f0', background: data.monthlyRevenue === opt ? 'rgba(0,212,170,0.06)' : '#f8fafc', color: data.monthlyRevenue === opt ? '#00a88a' : '#374151' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Number of Employees</label>
                <div className="grid grid-cols-2 gap-2">
                  {['1–2', '3–5', '6–10', '10+'].map(opt => (
                    <button key={opt} type="button" onClick={() => set('employees', opt)}
                      className="px-4 py-3 rounded-xl text-sm font-medium border transition-all"
                      style={{ borderColor: data.employees === opt ? '#00d4aa' : '#e2e8f0', background: data.employees === opt ? 'rgba(0,212,170,0.06)' : '#f8fafc', color: data.employees === opt ? '#00a88a' : '#374151' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(2)} disabled={!data.storeName}
                className="w-full py-3.5 font-bold rounded-xl text-white text-sm disabled:opacity-40 mt-2"
                style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)' }}>
                Next →
              </button>
            </div>
          )}

          {/* Step 2 — Operations */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Top Services (select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {SERVICES.map(s => (
                    <button key={s} type="button" onClick={() => toggleService(s)}
                      className="px-3 py-3 rounded-xl text-sm font-medium border transition-all text-left"
                      style={{ borderColor: data.services.includes(s) ? '#00d4aa' : '#e2e8f0', background: data.services.includes(s) ? 'rgba(0,212,170,0.06)' : '#f8fafc', color: data.services.includes(s) ? '#00a88a' : '#374151' }}>
                      {data.services.includes(s) ? '✓ ' : ''}{s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50">← Back</button>
                <button onClick={() => setStep(3)} disabled={data.services.length === 0}
                  className="flex-2 py-3 font-bold rounded-xl text-white text-sm disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', flex: 2 }}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Pain Points */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Biggest Challenge Right Now</label>
                <div className="flex flex-col gap-2">
                  {CHALLENGES.map(c => (
                    <button key={c.label} type="button" onClick={() => set('biggestChallenge', c.label)}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all"
                      style={{ borderColor: data.biggestChallenge === c.label ? '#00d4aa' : '#e2e8f0', background: data.biggestChallenge === c.label ? 'rgba(0,212,170,0.06)' : '#f8fafc', color: data.biggestChallenge === c.label ? '#00a88a' : '#374151' }}>
                      {data.biggestChallenge === c.label ? '✓ ' : ''}{c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50">← Back</button>
                <button onClick={() => setStep(4)} disabled={!data.biggestChallenge}
                  className="flex-2 py-3 font-bold rounded-xl text-white text-sm disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', flex: 2 }}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — Performance Signals */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Inventory Turnover</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Fast', 'Moderate', 'Slow (30+ days)', "Don't track"].map(opt => (
                    <button key={opt} type="button" onClick={() => set('inventoryTurnover', opt)}
                      className="px-3 py-3 rounded-xl text-sm font-medium border transition-all"
                      style={{ borderColor: data.inventoryTurnover === opt ? '#00d4aa' : '#e2e8f0', background: data.inventoryTurnover === opt ? 'rgba(0,212,170,0.06)' : '#f8fafc', color: data.inventoryTurnover === opt ? '#00a88a' : '#374151' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Pricing Strategy</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Competitors', 'Guesswork', 'Cost + margin', 'Not consistent'].map(opt => (
                    <button key={opt} type="button" onClick={() => set('pricingStrategy', opt)}
                      className="px-3 py-3 rounded-xl text-sm font-medium border transition-all"
                      style={{ borderColor: data.pricingStrategy === opt ? '#00d4aa' : '#e2e8f0', background: data.pricingStrategy === opt ? 'rgba(0,212,170,0.06)' : '#f8fafc', color: data.pricingStrategy === opt ? '#00a88a' : '#374151' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Do You Track Employee Performance?</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Yes', 'Sometimes', 'No'].map(opt => (
                    <button key={opt} type="button" onClick={() => set('employeeTracking', opt)}
                      className="px-3 py-3 rounded-xl text-sm font-medium border transition-all"
                      style={{ borderColor: data.employeeTracking === opt ? '#00d4aa' : '#e2e8f0', background: data.employeeTracking === opt ? 'rgba(0,212,170,0.06)' : '#f8fafc', color: data.employeeTracking === opt ? '#00a88a' : '#374151' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(3)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50">← Back</button>
                <button onClick={() => setStep(5)} disabled={!data.inventoryTurnover || !data.pricingStrategy || !data.employeeTracking}
                  className="flex-2 py-3 font-bold rounded-xl text-white text-sm disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', flex: 2 }}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 5 — Contact */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Almost done — where should we send your audit results?</p>
              <div>
                <label className={labelCls}>Your Name *</label>
                <input type="text" value={data.name} onChange={e => set('name', e.target.value)} className={inputCls} placeholder="John Smith" />
              </div>
              <div>
                <label className={labelCls}>Email Address *</label>
                <input type="email" value={data.email} onChange={e => set('email', e.target.value)} className={inputCls} placeholder="john@wirelessstore.com" />
              </div>
              <div>
                <label className={labelCls}>Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="tel" value={data.phone} onChange={e => set('phone', e.target.value)} className={inputCls} placeholder="(555) 123-4567" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(4)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50">← Back</button>
                <button onClick={handleSubmit} disabled={!data.name || !data.email || submitting}
                  className="flex-2 py-3 font-bold rounded-xl text-white text-sm disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', flex: 2 }}>
                  {submitting ? 'Analyzing...' : 'Get My Audit Results →'}
                </button>
              </div>
            </div>
          )}

          {/* Step 6 — Report */}
          {step === 6 && report && (
            <div className="space-y-5">
              {/* Score badge */}
              <div className="rounded-2xl p-5 text-center" style={{ background: `${report.color}10`, border: `2px solid ${report.color}30` }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: report.color }}>Your Store Audit Results</p>
                <h3 className="text-2xl font-black mb-1" style={{ color: '#0d1117' }}>{report.level}</h3>
                <p className="text-xs" style={{ color: '#64748b' }}>Score: {report.score} / 16</p>
              </div>

              {/* Summary */}
              <div className="rounded-xl p-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{report.summary}</p>
              </div>

              {/* Key findings */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Key Findings</p>
                <div className="flex flex-col gap-2">
                  {report.findings.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm px-3 py-2.5 rounded-xl"
                      style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', color: '#374151' }}>
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunity */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#00d4aa' }}>Opportunity</p>
                <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{report.opportunity}</p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 pt-1">
                <button className="w-full py-3.5 font-bold rounded-xl text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)' }}>
                  📞 Book a Founder Call
                </button>
                <button onClick={handleClose} className="w-full py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50">
                  Join Early Access Instead
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditFunnel;
