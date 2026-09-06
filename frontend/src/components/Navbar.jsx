import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, User, LogOut, ShieldCheck, MapPin, Building2, Bell } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, quickDemoLogin } = useAuth();

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'faculty': return 'Faculty Portal';
      case 'admin': return 'Administrator';
      default: return 'Student Portal';
    }
  };

  const getUserDisplayName = () => {
    if (!user) return 'Guest User';
    if (user.role === 'faculty' && user.faculty) return user.faculty.name;
    if (user.role === 'student' && user.student) return user.student.name;
    if (user.username === 'admin') return 'System Administrator';
    return user.username;
  };

  return (
    <header style={{
      height: '68px',
      background: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
    }}>
      {/* Brand & Module Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onToggleSidebar}
          className="md:hidden"
          style={{
            background: 'none',
            border: 'none',
            padding: '6px',
            cursor: 'pointer',
            color: '#334155'
          }}
        >
          <svg style={{ width: '22px', height: '22px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
          }}>
            <GraduationCap style={{ width: '24px', height: '24px' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
                APEX COLLEGE PORTAL
              </span>
              <span style={{
                fontSize: '0.7rem',
                background: '#eff6ff',
                color: '#1d4ed8',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontWeight: '700',
                border: '1px solid #bfdbfe'
              }}>
                MODULE DEMO
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '500' }}>
              Smart Faculty Location & Availability Tracker
            </div>
          </div>
        </div>
      </div>

      {/* User Actions & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Switch Role Quick Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600', padding: '0 6px' }}>
            Switch:
          </span>
          <button
            onClick={() => quickDemoLogin('student')}
            style={{
              background: user?.role === 'student' ? '#2563eb' : 'transparent',
              color: user?.role === 'student' ? '#ffffff' : '#475569',
              border: 'none',
              padding: '3px 8px',
              borderRadius: '5px',
              fontSize: '0.74rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Student
          </button>
          <button
            onClick={() => quickDemoLogin('faculty')}
            style={{
              background: user?.role === 'faculty' ? '#2563eb' : 'transparent',
              color: user?.role === 'faculty' ? '#ffffff' : '#475569',
              border: 'none',
              padding: '3px 8px',
              borderRadius: '5px',
              fontSize: '0.74rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Faculty
          </button>
          <button
            onClick={() => quickDemoLogin('admin')}
            style={{
              background: user?.role === 'admin' ? '#2563eb' : 'transparent',
              color: user?.role === 'admin' ? '#ffffff' : '#475569',
              border: 'none',
              padding: '3px 8px',
              borderRadius: '5px',
              fontSize: '0.74rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Admin
          </button>
        </div>

        {/* User Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: user?.role === 'admin' ? '#fef3c7' : user?.role === 'faculty' ? '#eff6ff' : '#ecfdf5',
            color: user?.role === 'admin' ? '#b45309' : user?.role === 'faculty' ? '#1d4ed8' : '#047857',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.9rem'
          }}>
            {getUserDisplayName().charAt(0)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a', lineHeight: '1.2' }}>
              {getUserDisplayName()}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>
              {getRoleDisplayName(user?.role)}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign out of portal"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: '#dc2626',
            fontSize: '0.82rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#fef2f2';
            e.currentTarget.style.borderColor = '#fecaca';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          <LogOut style={{ width: '15px', height: '15px' }} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
