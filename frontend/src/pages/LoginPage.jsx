import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, User, LogIn, Sparkles, Building, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage = ({ addToast }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('student');
  const [password, setPassword] = useState('student123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      if (addToast) {
        addToast({
          type: 'success',
          title: 'Welcome!',
          message: `Logged in successfully as ${username}`
        });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #172554 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(30, 58, 138, 0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '1000px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Left Side: Branding & Info */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
          color: '#ffffff',
          padding: '44px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: '700',
              letterSpacing: '0.04em',
              marginBottom: '20px',
              backdropFilter: 'blur(8px)'
            }}>
              <GraduationCap style={{ width: '16px', height: '16px' }} />
              COLLEGE PORTAL ERP MODULE
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', lineHeight: '1.2', letterSpacing: '-0.02em', marginBottom: '12px' }}>
              Smart Faculty Location & Availability Tracker
            </h1>

            <p style={{ fontSize: '0.92rem', color: '#bfdbfe', lineHeight: '1.5', marginBottom: '24px' }}>
              Locate faculty members across campus blocks, view real-time availability status, compare against expected timetable schedules, and check building occupancy.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: '#e0e7ff' }}>
                <CheckCircle2 style={{ width: '18px', height: '18px', color: '#34d399' }} />
                <span>Manual faculty location & availability updates</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: '#e0e7ff' }}>
                <CheckCircle2 style={{ width: '18px', height: '18px', color: '#34d399' }} />
                <span>Timetable discrepancy alert detection</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: '#e0e7ff' }}>
                <CheckCircle2 style={{ width: '18px', height: '18px', color: '#34d399' }} />
                <span>Faculty location sharing & privacy protection</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: '#e0e7ff' }}>
                <CheckCircle2 style={{ width: '18px', height: '18px', color: '#34d399' }} />
                <span>Zero GPS / zero hardware requirement (Mini Project)</span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '0.78rem',
            color: '#bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Apex Institute of Technology</span>
            <span>Academic Year 2025–26</span>
          </div>
        </div>

        {/* Right Side: Login Form & Demo Credentials */}
        <div style={{ padding: '44px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
              Sign In to Portal
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '4px' }}>
              Select a demo profile or enter your university credentials.
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-username">
                Username / Email ID
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                  color: '#94a3b8'
                }} />
                <input
                  id="login-username"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                  color: '#94a3b8'
                }} />
                <input
                  id="login-password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn style={{ width: '18px', height: '18px' }} />
                  <span>Login to Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Presentation Demo Accounts Section */}
          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px dashed #cbd5e1'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🎯 1-CLICK DEMO ACCOUNTS
              </span>
              <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '600' }}>
                Click to Auto-fill
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {/* Student */}
              <button
                type="button"
                onClick={() => fillCredentials('student', 'student123')}
                style={{
                  background: username === 'student' ? '#eff6ff' : '#f8fafc',
                  border: username === 'student' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#1e3a8a' }}>
                  👨‍🎓 Student
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>student</div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>student123</div>
              </button>

              {/* Faculty */}
              <button
                type="button"
                onClick={() => fillCredentials('faculty', 'faculty123')}
                style={{
                  background: username === 'faculty' ? '#eff6ff' : '#f8fafc',
                  border: username === 'faculty' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#1e3a8a' }}>
                  👨‍🏫 Faculty
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>faculty</div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>faculty123</div>
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => fillCredentials('admin', 'admin123')}
                style={{
                  background: username === 'admin' ? '#eff6ff' : '#f8fafc',
                  border: username === 'admin' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#1e3a8a' }}>
                  🛡️ Admin
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>admin</div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>admin123</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
