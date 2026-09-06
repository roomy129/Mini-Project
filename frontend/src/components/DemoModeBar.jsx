import React, { useState } from 'react';
import { PlayCircle, Shield, ShieldOff, RotateCcw, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../services/api';

export const DemoModeBar = ({ onActionComplete, addToast }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);

  const handleDemoPreset = async (actionKey, label) => {
    try {
      setLoadingAction(actionKey);
      const res = await api.runDemoPreset(actionKey);
      if (addToast) {
        addToast({
          type: 'success',
          title: '🎬 Demo Triggered',
          message: res.message || `Executed: ${label}`
        });
      }
      if (onActionComplete) onActionComplete();
    } catch (err) {
      if (addToast) {
        addToast({
          type: 'error',
          title: 'Demo Action Failed',
          message: err.message
        });
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm("Reset all demo data back to default state?")) return;
    try {
      setLoadingAction('reset');
      const res = await api.resetDemoData();
      if (addToast) {
        addToast({
          type: 'success',
          title: 'Database Reset',
          message: res.message || 'Database restored to initial state.'
        });
      }
      if (onActionComplete) onActionComplete();
    } catch (err) {
      if (addToast) {
        addToast({
          type: 'error',
          title: 'Reset Failed',
          message: err.message
        });
      }
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(90deg, #1e1b4b 0%, #1e3a8a 50%, #0f172a 100%)',
      color: '#ffffff',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: isOpen ? '10px 24px' : '6px 24px',
      fontSize: '0.84rem',
      position: 'relative',
      zIndex: 40,
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1440px',
        margin: '0 auto',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'rgba(238, 242, 255, 0.15)',
            padding: '4px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: '700',
            letterSpacing: '0.03em',
            color: '#93c5fd'
          }}>
            <Sparkles style={{ width: '15px', height: '15px', color: '#60a5fa' }} />
            <span>🎬 DEMO MODE</span>
          </div>
          <span style={{ color: '#cbd5e1', fontSize: '0.78rem' }} className="hidden sm:inline">
            Quick 1-click test actions for Dr. Arun Kumar:
          </span>
        </div>

        {/* Toggle Collapse */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#93c5fd',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.76rem',
            marginLeft: 'auto'
          }}
        >
          {isOpen ? <>Hide Presets <ChevronUp style={{ width: '14px', height: '14px' }} /></> : <>Show Presets <ChevronDown style={{ width: '14px', height: '14px' }} /></>}
        </button>

        {/* Action Buttons */}
        {isOpen && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            width: '100%',
            paddingTop: '6px'
          }}>
            <button
              onClick={() => handleDemoPreset('preset_1', 'CSE 204 Available')}
              disabled={loadingAction !== null}
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#a7f3d0',
                padding: '5px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'background 0.15s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.35)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }}></span>
              1. CSE 204 (Available)
            </button>

            <button
              onClick={() => handleDemoPreset('preset_2', 'CSE 205 Busy')}
              disabled={loadingAction !== null}
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fde68a',
                padding: '5px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'background 0.15s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.35)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)'}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24' }}></span>
              2. CSE 205 (Busy)
            </button>

            <button
              onClick={() => handleDemoPreset('preset_3', 'Main 101 Available')}
              disabled={loadingAction !== null}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: '#bfdbfe',
                padding: '5px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'background 0.15s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.35)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa' }}></span>
              3. Main Block 101
            </button>

            <button
              onClick={() => handleDemoPreset('privacy_off', 'Turn Privacy OFF')}
              disabled={loadingAction !== null}
              style={{
                background: 'rgba(148, 163, 184, 0.2)',
                border: '1px solid rgba(148, 163, 184, 0.4)',
                color: '#e2e8f0',
                padding: '5px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'background 0.15s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(148, 163, 184, 0.35)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(148, 163, 184, 0.2)'}
            >
              <ShieldOff style={{ width: '13px', height: '13px', color: '#f87171' }} />
              4. Privacy OFF (Hide Room)
            </button>

            <button
              onClick={() => handleDemoPreset('privacy_on', 'Turn Privacy ON')}
              disabled={loadingAction !== null}
              style={{
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#bae6fd',
                padding: '5px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'background 0.15s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.35)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)'}
            >
              <Shield style={{ width: '13px', height: '13px', color: '#38bdf8' }} />
              5. Privacy ON (Show Room)
            </button>

            <button
              onClick={handleResetData}
              disabled={loadingAction !== null}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                padding: '5px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                marginLeft: 'auto',
                transition: 'background 0.15s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.35)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            >
              <RotateCcw style={{ width: '13px', height: '13px' }} />
              6. Reset Demo Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
