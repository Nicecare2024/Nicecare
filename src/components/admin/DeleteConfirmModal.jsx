import React from 'react';

const DeleteConfirmModal = ({ request, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
    <div className="w-full max-w-sm rounded-2xl p-6 text-center" style={{ background: '#0d1117', border: '1px solid rgba(239,68,68,0.25)' }}>
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.1)' }}>
        <svg className="w-7 h-7" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Delete Lead</h3>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Delete <span className="text-white font-semibold">{request.firstName} {request.lastName}</span> from {request.company}? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: 'rgba(239,68,68,0.8)' }}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirmModal;
