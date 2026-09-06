import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, MapPin, Calendar, Mail, Phone, Building, AlertTriangle, ShieldCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { CampusMap } from '../components/CampusMap';
import { api } from '../services/api';

export const FacultyDetailsPage = ({ facultyId, onBack, addToast }) => {
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFacultyDetail();
  }, [facultyId]);

  const fetchFacultyDetail = async () => {
    try {
      setLoading(true);
      const data = await api.getFacultyDetails(facultyId, { day: 'Monday', time: '10:30' });
      setFaculty(data.faculty);
    } catch (err) {
      console.error("Error loading faculty details:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFacultyDetail();
    if (addToast) {
      addToast({
        type: 'success',
        title: 'Location Refreshed',
        message: `Fetched latest location data for ${faculty?.name || 'faculty'}`
      });
    }
  };

  if (loading && !faculty) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block', color: '#2563eb' }} />
        Loading faculty profile & schedule...
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="portal-card" style={{ padding: '40px', textAlign: 'center' }}>
        <h3>Faculty Member Not Found</h3>
        <button onClick={onBack} className="btn-secondary" style={{ marginTop: '16px' }}>
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back Button & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={onBack}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          <span>Back to Faculty Directory</span>
        </button>

        <button
          onClick={handleRefresh}
          className="btn-primary"
          disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw style={{ width: '16px', height: '16px', animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          <span>Refresh Location</span>
        </button>
      </div>

      {/* Faculty Profile Hero Card */}
      <div className="portal-card" style={{ padding: '28px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          {/* Left: Bio info */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: '800',
              flexShrink: 0,
              boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)'
            }}>
              {faculty.name.replace('Dr. ', '').replace('Prof. ', '').charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
                  {faculty.name}
                </h1>
                <StatusBadge status={faculty.status} sharingEnabled={faculty.sharing_enabled} />
              </div>
              <div style={{ fontSize: '0.92rem', color: '#2563eb', fontWeight: '700', marginTop: '2px' }}>
                {faculty.designation}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '2px' }}>
                Department of {faculty.department}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', flexWrap: 'wrap', fontSize: '0.8rem', color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Mail style={{ width: '14px', height: '14px', color: '#64748b' }} /> {faculty.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Phone style={{ width: '14px', height: '14px', color: '#64748b' }} /> {faculty.phone}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Building style={{ width: '14px', height: '14px', color: '#64748b' }} /> Cabin: {faculty.cabin_room}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Current Live Location Highlight Box */}
          <div style={{
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', textTransform: 'uppercase', color: '#1e3a8a', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin style={{ width: '15px', height: '15px', color: '#2563eb' }} />
                CURRENT / LAST KNOWN LOCATION
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Updated: {faculty.updated_at ? new Date(faculty.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
              </span>
            </div>

            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
              {faculty.building_name ? (
                faculty.sharing_enabled ? (
                  <span>{faculty.building_name} → {faculty.floor_display} → Room {faculty.room_display}</span>
                ) : (
                  <div>
                    <span>📍 {faculty.building_name}</span>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>
                      Exact room location restricted by faculty.
                    </div>
                  </div>
                )
              ) : (
                <span style={{ color: '#94a3b8' }}>Location not updated yet</span>
              )}
            </div>

            {faculty.remarks && (
              <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '6px', fontStyle: 'italic' }}>
                "{faculty.remarks}"
              </div>
            )}
          </div>
        </div>

        {/* Timetable Discrepancy Note */}
        {faculty.location_differs && (
          <div className="diff-alert-banner" style={{ marginTop: '20px' }}>
            <AlertTriangle style={{ width: '20px', height: '20px', color: '#d97706', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '800', fontSize: '0.86rem', color: '#92400e' }}>
                ⚠ Location differs from timetable.
              </div>
              <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: '2px' }}>
                {faculty.difference_reason}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#78350f', marginTop: '4px' }}>
                Expected timetable location at this hour: <strong>{faculty.expected_location?.location_display}</strong> ({faculty.expected_location?.time_slot})
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Today's Timetable & Schedule Section */}
      <div className="portal-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Calendar style={{ width: '20px', height: '20px', color: '#2563eb' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
            Today's Scheduled Timetable (Monday)
          </h3>
        </div>

        {faculty.today_timetable && faculty.today_timetable.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faculty.today_timetable.map((slot) => {
              const isCurrentPeriod = slot.start_time <= '10:30' && slot.end_time > '10:30';
              return (
                <div
                  key={slot.id}
                  style={{
                    background: isCurrentPeriod ? '#eff6ff' : '#ffffff',
                    border: isCurrentPeriod ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      background: isCurrentPeriod ? '#2563eb' : '#f1f5f9',
                      color: isCurrentPeriod ? '#ffffff' : '#334155',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '0.85rem'
                    }}>
                      {slot.start_time} – {slot.end_time}
                    </div>

                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.94rem', color: '#0f172a' }}>
                        {slot.subject_name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Code: {slot.subject_code || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#1e3a8a' }}>
                        {slot.building}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Room {slot.room}
                      </div>
                    </div>

                    {isCurrentPeriod && (
                      <span style={{
                        background: '#dbeafe',
                        color: '#1d4ed8',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        border: '1px solid #93c5fd'
                      }}>
                        CURRENT ACTIVE PERIOD
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '10px' }}>
            No scheduled timetable entries found for today.
          </div>
        )}
      </div>

      {/* Interactive Visual Campus Map with Faculty Building Highlighted */}
      <CampusMap
        highlightedBuilding={faculty.building_name}
        highlightedFacultyName={faculty.name}
      />
    </div>
  );
};
