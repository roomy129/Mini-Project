import React, { useState, useEffect } from 'react';
import { Search, Users, UserCheck, Clock, MapPin, AlertTriangle, ArrowRight, Sparkles, Building, Calendar } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';

export const StudentDashboard = ({ onNavigate, onSelectFaculty }) => {
  const [metrics, setMetrics] = useState({ total: 0, available: 0, busy: 0, not_available: 0 });
  const [facultyList, setFacultyList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getFacultyList();
      setFacultyList(data.faculty || []);
      setMetrics(data.metrics || { total: 0, available: 0, busy: 0, not_available: 0 });
    } catch (err) {
      console.error("Error loading faculty dashboard data:", err);
      setError(err.message || 'Failed to load live faculty data from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onNavigate('find_faculty', { search: searchQuery, department: selectedDept });
  };

  // Recent faculty updates from real API data
  const recentFaculty = [...facultyList]
    .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
    .slice(0, 4);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
        borderRadius: '16px',
        padding: '32px 28px',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.25)'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '750px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.18)',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: '700',
            marginBottom: '12px'
          }}>
            <Sparkles style={{ width: '14px', height: '14px', color: '#93c5fd' }} />
            FACULTY LOCATION & AVAILABILITY PORTAL
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Where is your Professor right now?
          </h1>

          <p style={{ fontSize: '0.92rem', color: '#dbeafe', lineHeight: '1.5', marginBottom: '20px' }}>
            Quickly find professors across college blocks, check whether they are Available or Busy, compare against timetable schedules, and save travel time between buildings.
          </p>

          {/* Big Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{
            display: 'flex',
            background: '#ffffff',
            borderRadius: '12px',
            padding: '6px',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              padding: '0 12px',
              gap: '10px'
            }}>
              <Search style={{ width: '20px', height: '20px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search by faculty name, e.g. Dr. Arun Kumar or CSE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.95rem',
                  color: '#0f172a'
                }}
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{
                border: 'none',
                background: '#f1f5f9',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '0.84rem',
                color: '#334155',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Departments</option>
              <option value="Computer Science and Engineering">CSE Dept</option>
              <option value="Electronics and Communication">ECE Dept</option>
              <option value="Electrical and Electronics">EEE Dept</option>
            </select>

            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '10px 22px', borderRadius: '8px', fontSize: '0.9rem' }}
            >
              Find Faculty
            </button>
          </form>
        </div>
      </div>

      {/* Metrics Dashboard Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {/* Available Card */}
        <div className="portal-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#64748b' }}>AVAILABLE FACULTY</span>
            <span style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669'
            }}>
              <UserCheck style={{ width: '18px', height: '18px' }} />
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#047857', marginTop: '10px' }}>
            {metrics.available}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#059669', fontWeight: '600', marginTop: '4px' }}>
            Ready for consultation & doubts
          </div>
        </div>

        {/* Busy Card */}
        <div className="portal-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#64748b' }}>BUSY FACULTY</span>
            <span style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#fffbeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d97706'
            }}>
              <Clock style={{ width: '18px', height: '18px' }} />
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#b45309', marginTop: '10px' }}>
            {metrics.busy}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#b45309', fontWeight: '600', marginTop: '4px' }}>
            In lecture, lab or meeting
          </div>
        </div>

        {/* Not Available Card */}
        <div className="portal-card" style={{ padding: '20px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#64748b' }}>NOT AVAILABLE</span>
            <span style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626'
            }}>
              <AlertTriangle style={{ width: '18px', height: '18px' }} />
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#b91c1c', marginTop: '10px' }}>
            {metrics.not_available}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#b91c1c', fontWeight: '600', marginTop: '4px' }}>
            On leave or off campus
          </div>
        </div>

        {/* Total Faculty Card */}
        <div className="portal-card" style={{ padding: '20px', borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#64748b' }}>TRACKED FACULTY</span>
            <span style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb'
            }}>
              <Users style={{ width: '18px', height: '18px' }} />
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e3a8a', marginTop: '10px' }}>
            {metrics.total}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#2563eb', fontWeight: '600', marginTop: '4px' }}>
            Across 6 academic buildings
          </div>
        </div>
      </div>

      {/* Main Section: Recently Updated Faculty Locations */}
      <div className="portal-card" style={{ padding: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
              Recently Updated Faculty Locations
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Live manual updates submitted by professors across campus.
            </p>
          </div>

          <button
            onClick={() => onNavigate('find_faculty')}
            className="btn-outline-primary"
          >
            <span>View All Faculty ({metrics.total})</span>
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </button>
        </div>

        {/* Error State Banner */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '14px 18px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle style={{ width: '18px', height: '18px', color: '#dc2626', flexShrink: 0 }} />
              <span style={{ fontSize: '0.86rem', fontWeight: '600' }}>{error}</span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="btn-secondary"
              style={{ padding: '5px 12px', fontSize: '0.78rem' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid #cbd5e1',
              borderTopColor: '#2563eb',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 10px'
            }} />
            <span style={{ fontSize: '0.86rem' }}>Fetching live faculty records from API...</span>
          </div>
        )}

        {/* Grid of Faculty Cards */}
        {!loading && !error && recentFaculty.length === 0 && (
          <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '10px' }}>
            No faculty records available in the database.
          </div>
        )}

        {!loading && !error && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '16px'
          }}>
            {recentFaculty.map((f) => (
              <div
                key={f.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}
              >
                <div>
                  {/* Header with Name and Status */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                        {f.name}
                      </h4>
                      <p style={{ fontSize: '0.76rem', color: '#64748b' }}>
                        {f.designation} • {f.department}
                      </p>
                    </div>
                    <StatusBadge status={f.status} sharingEnabled={f.sharing_enabled} size="sm" />
                  </div>

                  {/* Location Info */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    marginTop: '10px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e3a8a', fontWeight: '700', marginBottom: '4px' }}>
                      <MapPin style={{ width: '14px', height: '14px', color: '#2563eb' }} />
                      <span>Current Location:</span>
                    </div>
                    <div style={{ color: '#334155', fontWeight: '600' }}>
                      {f.building_name ? (
                        f.sharing_enabled ? (
                          <span>{f.building_name} → {f.floor_display} → Room {f.room_display}</span>
                        ) : (
                          <span>{f.building_name} <span style={{ color: '#64748b', fontStyle: 'italic' }}>(Room hidden by faculty)</span></span>
                        )
                      ) : (
                        <span style={{ color: '#94a3b8' }}>Location not updated yet</span>
                      )}
                    </div>
                  </div>

                  {/* Timetable Discrepancy Alert */}
                  {f.location_differs && (
                    <div className="diff-alert-banner">
                      <AlertTriangle style={{ width: '16px', height: '16px', color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ display: 'block' }}>⚠ Location differs from timetable</strong>
                        <span style={{ fontSize: '0.76rem' }}>
                          Expected: {f.expected_location?.location_display}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Updated: {f.updated_at ? new Date(f.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                  </span>

                  <button
                    onClick={() => onSelectFaculty(f.id)}
                    className="btn-secondary"
                    style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
