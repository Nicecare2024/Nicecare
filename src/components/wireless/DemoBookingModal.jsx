import React, { useState } from 'react';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { wirelessDb } from '../../config/firebaseWireless';

const STEP1_INITIAL = { firstName: '', email: '', phone: '', company: '', storeCount: '' };
const STEP2_INITIAL = { monthlyRevenue: '', posSystem: '', topProblems: '', message: '' };

const DemoBookingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState(STEP1_INITIAL);
  const [step2Data, setStep2Data] = useState(STEP2_INITIAL);
  const [docId, setDocId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  const handleClose = () => {
    setStep(1);
    setStep1Data(STEP1_INITIAL);
    setStep2Data(STEP2_INITIAL);
    setDocId(null);
    setSubmitStatus(null);
    onClose();
  };

  const handleStep1Change = (e) => {
    const { name, value } = e.target;
    setStep1Data(prev => ({ ...prev, [name]: value }));
  };

  const handleStep2Change = (e) => {
    const { name, value } = e.target;
    setStep2Data(prev => ({ ...prev, [name]: value }));
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const ref = await addDoc(collection(wirelessDb, 'demoRequests'), {
        ...step1Data,
        source: 'WirelessPOS Landing Page',
        status: 'step1_complete',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setDocId(ref.id);
      setStep(2);
    } catch (err) {
      console.error('Step 1 submit error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (docId) {
        await updateDoc(doc(wirelessDb, 'demoRequests', docId), {
          ...step2Data,
          status: 'complete',
          updatedAt: serverTimestamp(),
        });
      }
      setSubmitStatus('success');
    } catch (err) {
      console.error('Step 2 submit error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipStep2 = () => setSubmitStatus('success');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-white p-4 sm:p-6 rounded-t-2xl" style={{ background: 'linear-gradient(135deg, #0d1117, #1a2332)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2].map(s => (
                  <div key={s} className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                      style={{ background: step >= s ? '#00d4aa' : 'rgba(255,255,255,0.15)', color: step >= s ? '#0d1117' : 'rgba(255,255,255,0.5)' }}>
                      {s}
                    </div>
                    {s < 2 && <div className="w-8 h-0.5 rounded" style={{ background: step > s ? '#00d4aa' : 'rgba(255,255,255,0.15)' }}></div>}
                  </div>
                ))}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">
                {submitStatus === 'success' ? "You're on the list!" : 'Join the WirelessPOS Waitlist'}
              </h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {submitStatus === 'success' ? "We'll be in touch soon." : 'Get early access + a free store profit audit.'}
              </p>
            </div>
            <button onClick={handleClose} className="text-white/60 hover:text-white transition-colors p-1 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Success state */}
          {submitStatus === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0,212,170,0.1)' }}>
                <svg className="w-8 h-8" fill="none" stroke="#00d4aa" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">You're on the waitlist!</h3>
              <p className="text-gray-500 text-sm mb-6">We'll reach out within 24 hours with your free store profit audit.</p>
              <button onClick={handleClose} className="px-6 py-2.5 rounded-lg font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)' }}>
                Close
              </button>
            </div>
          )}

          {/* Error state */}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 text-sm">
              Something went wrong. Please try again.
            </div>
          )}

          {/* Step 1 */}
          {!submitStatus && step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name *</label>
                  <input type="text" name="firstName" value={step1Data.firstName} onChange={handleStep1Change} required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-sm transition-colors"
                    placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Store Name *</label>
                  <input type="text" name="company" value={step1Data.company} onChange={handleStep1Change} required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-sm transition-colors"
                    placeholder="ABC Wireless" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <input type="email" name="email" value={step1Data.email} onChange={handleStep1Change} required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-sm transition-colors"
                  placeholder="john@wirelessstore.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                <input type="tel" name="phone" value={step1Data.phone} onChange={handleStep1Change} required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-sm transition-colors"
                  placeholder="(555) 123-4567" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Number of Locations <span className="text-gray-400 font-normal">(optional)</span></label>
                <select name="storeCount" value={step1Data.storeCount} onChange={handleStep1Change}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-sm transition-colors">
                  <option value="">Select...</option>
                  <option value="1">1 Store</option>
                  <option value="2-5">2–5 Stores</option>
                  <option value="6-10">6–10 Stores</option>
                  <option value="11-25">11–25 Stores</option>
                  <option value="25+">25+ Stores</option>
                </select>
              </div>
              <button type="submit" disabled={isSubmitting}
                className="w-full py-3 font-bold rounded-lg text-white text-sm transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)' }}>
                {isSubmitting ? 'Saving...' : 'Join the Waitlist →'}
              </button>
            </form>
          )}

          {/* Step 2 */}
          {!submitStatus && step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <p className="text-sm text-gray-500 mb-2">Help us personalize your free store profit audit. Takes 30 seconds.</p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Average Monthly Revenue</label>
                <select name="monthlyRevenue" value={step2Data.monthlyRevenue} onChange={handleStep2Change}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-sm transition-colors">
                  <option value="">Select range...</option>
                  <option value="<50k">Less than $50,000</option>
                  <option value="50k-100k">$50,000 – $100,000</option>
                  <option value="100k-250k">$100,000 – $250,000</option>
                  <option value="250k-500k">$250,000 – $500,000</option>
                  <option value="500k-1m">$500,000 – $1,000,000</option>
                  <option value="1m+">$1,000,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">POS System You Currently Use</label>
                <input type="text" name="posSystem" value={step2Data.posSystem} onChange={handleStep2Change}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-sm transition-colors"
                  placeholder="e.g., Square, Clover, or None" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Top Problems You're Facing</label>
                <textarea name="topProblems" value={step2Data.topProblems} onChange={handleStep2Change} rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-sm transition-colors resize-none"
                  placeholder="e.g., can't track margins, staff accountability, inventory chaos..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Anything else we should know?</label>
                <textarea name="message" value={step2Data.message} onChange={handleStep2Change} rows={2}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-sm transition-colors resize-none"
                  placeholder="Optional..." />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={handleSkipStep2}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Skip
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-2 px-6 py-2.5 font-bold rounded-lg text-white text-sm transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', flex: 2 }}>
                  {isSubmitting ? 'Saving...' : 'Complete My Profile'}
                </button>
              </div>
            </form>
          )}

          {!submitStatus && (
            <p className="text-xs text-gray-400 text-center mt-4">
              We respect your privacy. No spam, ever.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoBookingModal;
