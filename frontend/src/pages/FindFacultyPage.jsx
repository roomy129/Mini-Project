import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Clock, AlertTriangle, ShieldCheck, ShieldAlert, Filter, RefreshCw, Eye, User, Sparkles } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';

export const FindFacultyPage = ({ initialFilters = {}, onSelectFaculty, addToast }) => {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState(initialFilters.search || '');
  const [department, setDepartment] = useState(initialFilters.department || 'All');
  const [building, setBuilding] = useState('All');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFaculty();
  }, [search, department, building, status]);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const data = await api.getFacultyList({
        search,
        department,
        building,
        status,
        day: 'Monday',
        time: '10:30'
      });
      setFaculty(data.faculty || []);
    } catch (err) {
      console.error("Error fetching faculty directory:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFaculty();
    if (addToast) {
      addToast({
        type: 'success',
        title: 'Refreshed',
        message: 'Faculty locations and statuses refreshed.'
      });
    }
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffSecs = Math.floor((now - date) / 1000);
    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)} minutes ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
            Find Faculty Directory & Live Tracking
          </h1>
          <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '2px' }}>
            Real-time manual location updates with timetable schedule discrepancy alerts.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="btn-secondary"
          disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw style={{ width: '15px', height: '15px', animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Live Status'}</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="portal-card" style={{ padding: '18px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {/* Search Input */}
          <div style={{ gridColumn: 'span 1', minWidth: '220px' }}>
            <label className="form-label">Search Faculty</label>
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: '#94a3b8'
              }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '34px', fontSize: '0.85rem' }}
                placeholder="Search name, designation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label className="form-label">Department</label>
            <select
              className="form-select"
              style={{ fontSize: '0.85rem' }}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Computer Science and Engineering">Computer Science & Engg</option>
              <option value="Electronics and Communication">Electronics & Communication</option>
              <option value="Electrical and Electronics">Electrical & Electronics</option>
            </select>
          </div>

          {/* Building Filter */}
          <div>
            <label className="form-label">Campus Building</label>
            <select
              className="form-select"
              style={{ fontSize: '0.85rem' }}
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
            >
              <option value="All">All Campus Blocks</option>
              <option value="CSE Block">CSE Block</option>
              <option value="ECE Block">ECE Block</option>
              <option value="EEE Block">EEE Block</option>
              <option value="Main Block">Main Block</option>
              <option value="Science Block">Science Block</option>
              <option value="Library Block">Library Block</option>
            </select>
          </div>

          {/* Availability Status Filter */}
          <div>
            <label className="form-label">Availability Status</label>
            <select
              className="form-select"
              style={{ fontSize: '0.85rem' }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">🟢 Available Only</option>
              <option value="Busy">🟡 Busy Only</option>
              <option value="Not Available">🔴 Not Available Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: '600' }}>
          Showing {faculty.length} faculty members
        </span>
        <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
          Active Period: Monday, 10:30 AM (Demo Sync)
        </span>
      </div>

      {/* Faculty Cards Grid */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          <RefreshCw style={{ width: '28px', height: '28px', animation: 'spin 1s linear infinite', margin: '0 auto 10px', display: 'block', color: '#2563eb' }} />
          Loading faculty locations...
        </div>
      ) : faculty.length === 0 ? (
        <div className="portal-card" style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
          <User style={{ width: '40px', height: '40px', color: '#cbd5e1', margin: '0 auto 12px', display: 'block' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#334155' }}>No faculty found</h3>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '4px' }}>
            Try adjusting your search query or department filters.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '20px'
        }}>
          {faculty.map((f) => (
            <div
              key={f.id}
              className="portal-card"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: f.location_differs ? '1px solid #fde68a' : '1px solid var(--border-color)',
                position: 'relative'
              }}
            >
              <div>
                {/* Faculty Card Top */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                      color: '#1e40af',
                      fontWeight: '800',
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #bfdbfe',
                      flexShrink: 0
                    }}>
                      {f.name.replace('Dr. ', '').replace('Prof. ', '').charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                        {f.name}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: '600' }}>
                        {f.designation}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {f.department}
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={f.status} sharingEnabled={f.sharing_enabled} />
                </div>

                {/* CURRENT / LAST UPDATED LOCATION CONTAINER */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginTop: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: '#1e3a8a', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin style={{ width: '13px', height: '13px', color: '#2563eb' }} />
                      CURRENT / LAST REPORTED LOCATION
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      🕒 {getRelativeTime(f.updated_at)}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>
                    {f.building_name ? (
                      f.sharing_enabled ? (
                        <span>{f.building_name} → {f.floor_display} → Room {f.room_display}</span>
                      ) : (
                        <div>
                          <span style={{ color: '#0f172a' }}>📍 {f.building_name}</span>
                          <div style={{
                            fontSize: '0.76rem',
                            color: '#64748b',
                            fontWeight: '500',
                            marginTop: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <ShieldAlert style={{ width: '13px', height: '13px', color: '#94a3b8' }} />
                            <span>Location sharing restricted by faculty (Room masked)</span>
                          </div>
                        </div>
                      )
                    ) : (
                      <span style={{ color: '#94a3b8' }}>Location not reported</span>
                    )}
                  </div>
                </div>

                {/* EXPECTED LOCATION FROM TIMETABLE CONTAINER */}
                <div style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginTop: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: '#1d4ed8', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar style={{ width: '13px', height: '13px', color: '#1d4ed8' }} />
                      EXPECTED LOCATION FROM TIMETABLE
                    </span>
                    {f.expected_location?.time_slot && (
                      <span style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: '600' }}>
                        {f.expected_location.time_slot}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#1e3a8a' }}>
                    {f.expected_location?.has_schedule ? (
                      <span>
                        {f.expected_location.building} → Room {f.expected_location.room}
                        <span style={{ fontSize: '0.78rem', fontWeight: '500', color: '#3b82f6', marginLeft: '6px' }}>
                          ({f.expected_location.subject_name})
                        </span>
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '500' }}>
                        {f.expected_location?.location_display || 'No class scheduled at this hour'}
                      </span>
                    )}
                  </div>
                </div>

                {/* TIMETABLE DIFFERENCE WARNING */}
                {f.location_differs && (
                  <div className="diff-alert-banner">
                    <AlertTriangle style={{ width: '18px', height: '18px', color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#92400e' }}>
                        ⚠ Location differs from timetable.
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#b45309', marginTop: '2px' }}>
                        {f.difference_reason || 'Possible reason: Faculty may have moved or timetable may not reflect current activity.'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer with Details Button */}
              <div style={{
                marginTop: '18px',
                paddingTop: '14px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Cabin: {f.cabin_room || 'N/A'}
                </span>

                <button
                  onClick={() => onSelectFaculty(f.id)}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <Eye style={{ width: '14px', height: '14px' }} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
