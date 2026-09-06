import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Mail, Phone, Building, Calendar, Key } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '700px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
          Portal User Profile
        </h1>
        <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '2px' }}>
          Active session identity and registered university account details.
        </p>
      </div>

      <div className="portal-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            fontWeight: '800'
          }}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>
              {user?.faculty?.name || user?.student?.name || user?.username}
            </h2>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#eff6ff',
              color: '#1d4ed8',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: '700',
              marginTop: '4px'
            }}>
              <Shield style={{ width: '12px', height: '12px' }} />
              <span>ROLE: {user?.role?.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b' }}>Username</span>
            <span style={{ fontWeight: '700', color: '#0f172a' }}>{user?.username}</span>
          </div>

          {user?.student && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Roll Number</span>
                <span style={{ fontWeight: '700', color: '#1e3a8a' }}>{user.student.roll_number}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Department</span>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>{user.student.department}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Semester & Section</span>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>Sem {user.student.semester} • Sec {user.student.section}</span>
              </div>
            </>
          )}

          {user?.faculty && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Designation</span>
                <span style={{ fontWeight: '700', color: '#1e3a8a' }}>{user.faculty.designation}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Department</span>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>{user.faculty.department}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Assigned Cabin</span>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>{user.faculty.cabin_room}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Email</span>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>{user.faculty.email}</span>
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ color: '#64748b' }}>Authentication Method</span>
            <span style={{ fontWeight: '600', color: '#059669' }}>Secure JWT Token (Session Active)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
