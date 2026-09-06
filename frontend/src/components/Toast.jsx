import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '420px',
      width: '100%'
    }}>
      {toasts.map((toast) => {
        let bg = '#1e293b';
        let border = '#334155';
        let Icon = Info;
        let iconColor = '#38bdf8';

        if (toast.type === 'success') {
          bg = '#064e3b';
          border = '#059669';
          Icon = CheckCircle2;
          iconColor = '#34d399';
        } else if (toast.type === 'warning') {
          bg = '#78350f';
          border = '#d97706';
          Icon = AlertTriangle;
          iconColor = '#fbbf24';
        } else if (toast.type === 'error') {
          bg = '#7f1d1d';
          border = '#dc2626';
          Icon = XCircle;
          iconColor = '#f87171';
        }

        return (
          <div
            key={toast.id}
            style={{
              background: bg,
              border: `1px solid ${border}`,
              color: '#ffffff',
              padding: '12px 16px',
              borderRadius: '10px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <Icon style={{ width: '20px', height: '20px', color: iconColor, flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1, fontSize: '0.88rem', lineHeight: '1.4' }}>
              {toast.title && <div style={{ fontWeight: '600', marginBottom: '2px' }}>{toast.title}</div>}
              <div>{toast.message}</div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
