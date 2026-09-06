import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, CheckCircle2, Clock, AlertTriangle, Shield, ShieldOff, Sparkles, Building, Calendar, RefreshCw, Send, Check } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';

export const FacultyDashboard = ({ addToast }) => {
  const { user } = useAuth();
  const [facultyData, setFacultyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Form State
  const [building, setBuilding] = useState('CSE Block');
  const [floor, setFloor] = useState('2nd Floor');
  const [room, setRoom] = useState('204');
  const [status, setStatus] = useState('Available');
  const [sharingEnabled, setSharingEnabled] = useState(true);
  const [remarks, setRemarks] = useState('');

  // Available room options based on building
  const [availableRooms, setAvailableRooms] = useState(['G01', '101', '102', '201', '202', '203', '204', '205', '301', '302', '303', 'Staff Room']);

  const facultyId = user?.faculty?.id || 1; // Default to Dr. Arun Kumar (ID 1) if demo

  useEffect(() => {
    fetchFacultyProfile();
  }, [facultyId]);

  const fetchFacultyProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getFacultyDetails(facultyId, { day: 'Monday', time: '10:30' });
      const fac = data.faculty;
      setFacultyData(fac);
      if (fac) {
        setBuilding(fac.building_name || 'CSE Block');
        setFloor(fac.floor || '2nd Floor');
        setRoom(fac.room || '204');
        setStatus(fac.status || 'Available');
        setSharingEnabled(fac.sharing_enabled !== undefined ? Boolean(fac.sharing_enabled) : true);
        setRemarks(fac.remarks || '');
      }
    } catch (err) {
      console.error("Error loading faculty profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuildingChange = async (newBuilding) => {
    setBuilding(newBuilding);
    try {
      const roomsData = await api.getRooms({ building_name: newBuilding });
      if (roomsData.rooms && roomsData.rooms.length > 0) {
        const roomNumbers = [...new Set(roomsData.rooms.map(r => r.room_number))];
        setAvailableRooms(roomNumbers);
        if (!roomNumbers.includes(room)) {
          setRoom(roomNumbers[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateLocation = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await api.updateFacultyLocation(facultyId, {
        building,
        floor,
        room,
        status,
        sharing_enabled: sharingEnabled,
        remarks
      });

      setFacultyData(res.faculty);
      if (addToast) {
        addToast({
          type: 'success',
          title: 'Location Updated',
          message: 'Location updated successfully. Students can now see your new location.'
        });
      }
    } catch (err) {
      if (addToast) {
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: err.message
        });
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickPreset = async (presetBuilding, presetFloor, presetRoom, presetStatus, presetRemarks = '') => {
    setBuilding(presetBuilding);
    setFloor(presetFloor);
    setRoom(presetRoom);
    setStatus(presetStatus);
    setRemarks(presetRemarks);

    try {
      setUpdating(true);
      const res = await api.updateFacultyLocation(facultyId, {
        building: presetBuilding,
        floor: presetFloor,
        room: presetRoom,
        status: presetStatus,
        sharing_enabled: sharingEnabled,
        remarks: presetRemarks
      });
      setFacultyData(res.faculty);
      if (addToast) {
        addToast({
          type: 'success',
          title: 'Location Preset Applied',
          message: `Updated to: ${presetBuilding} Room ${presetRoom} (${presetStatus})`
        });
      }
    } catch (err) {
      if (addToast) {
        addToast({
          type: 'error',
          title: 'Preset Update Failed',
          message: err.message
        });
      }
    } finally {
      setUpdating(false);
    }
  };

  const togglePrivacy = async () => {
    const newSharing = !sharingEnabled;
    setSharingEnabled(newSharing);
    try {
      const res = await api.updateFacultyPrivacy(facultyId, newSharing);
      if (addToast) {
        addToast({
          type: 'warning',
          title: newSharing ? 'Privacy Disabled' : 'Privacy Protection Enabled',
          message: res.notice || (newSharing ? 'Exact room location is visible' : 'Exact room hidden from students')
        });
      }
      fetchFacultyProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !facultyData) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block', color: '#2563eb' }} />
        Loading your faculty portal...
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome & Status Overview Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        borderRadius: '16px',
        padding: '28px',
        color: '#ffffff',
        boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.3)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'center'
        }}>
          <div>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: '700',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '4px 10px',
              borderRadius: '9999px',
              letterSpacing: '0.04em'
            }}>
              FACULTY PORTAL
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '8px' }}>
              Welcome, {facultyData?.name || 'Dr. Arun Kumar'}
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#bfdbfe', marginTop: '2px' }}>
              {facultyData?.designation} • {facultyData?.department}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
              <StatusBadge status={facultyData?.status} sharingEnabled={facultyData?.sharing_enabled} />
              <span style={{ fontSize: '0.8rem', color: '#dbeafe' }}>
                Last Reported: <strong>{facultyData?.updated_at ? new Date(facultyData.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:35 AM'}</strong>
              </span>
            </div>
          </div>

          {/* Current Location Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '18px 20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: '#bfdbfe', letterSpacing: '0.05em' }}>
              CURRENT BROADCASTED LOCATION
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '6px' }}>
              {facultyData?.building_name}
            </div>
            <div style={{ fontSize: '0.92rem', color: '#e0e7ff', marginTop: '2px' }}>
              {facultyData?.floor} • Room {facultyData?.room}
            </div>
            <div style={{
              fontSize: '0.74rem',
              marginTop: '8px',
              color: facultyData?.sharing_enabled ? '#86efac' : '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '600'
            }}>
              {facultyData?.sharing_enabled ? (
                <>
                  <Shield style={{ width: '13px', height: '13px' }} />
                  <span>Public Room Location ON</span>
                </>
              ) : (
                <>
                  <ShieldOff style={{ width: '13px', height: '13px' }} />
                  <span>Privacy Mode Active (Exact room hidden from students)</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px'
      }}>
        {/* MAIN FEATURE: UPDATE MY LOCATION FORM */}
        <div className="portal-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin style={{ width: '22px', height: '22px', color: '#2563eb' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                UPDATE MY LOCATION
              </h2>
            </div>
            <span style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>
              Manual Update
            </span>
          </div>

          <form onSubmit={handleUpdateLocation}>
            {/* Building Dropdown */}
            <div className="form-group">
              <label className="form-label">
                Campus Building <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                className="form-select"
                value={building}
                onChange={(e) => handleBuildingChange(e.target.value)}
                required
              >
                <option value="CSE Block">CSE Block</option>
                <option value="ECE Block">ECE Block</option>
                <option value="EEE Block">EEE Block</option>
                <option value="Main Block">Main Block</option>
                <option value="Science Block">Science Block</option>
                <option value="Library Block">Library Block</option>
              </select>
            </div>

            {/* Floor Dropdown */}
            <div className="form-group">
              <label className="form-label">
                Floor <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                className="form-select"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                required
              >
                <option value="Ground Floor">Ground Floor</option>
                <option value="1st Floor">1st Floor</option>
                <option value="2nd Floor">2nd Floor</option>
                <option value="3rd Floor">3rd Floor</option>
              </select>
            </div>

            {/* Room Dropdown */}
            <div className="form-group">
              <label className="form-label">
                Room Number / Lab / Cabin <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  className="form-select"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  style={{ flex: 1 }}
                  required
                >
                  {availableRooms.map((r) => (
                    <option key={r} value={r}>Room {r}</option>
                  ))}
                  <option value="101">Room 101</option>
                  <option value="102">Room 102</option>
                  <option value="201">Room 201</option>
                  <option value="202">Room 202</option>
                  <option value="203">Room 203</option>
                  <option value="204">Room 204 (Cabin)</option>
                  <option value="205">Room 205 (Lab)</option>
                  <option value="301">Room 301</option>
                  <option value="302">Room 302</option>
                  <option value="Staff Room">Staff Room</option>
                  <option value="HOD Office">HOD Office</option>
                </select>
                <input
                  type="text"
                  placeholder="Or custom room..."
                  className="form-input"
                  style={{ flex: 1 }}
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>
            </div>

            {/* Availability Radio Buttons */}
            <div className="form-group">
              <label className="form-label">
                Availability Status <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                marginTop: '6px'
              }}>
                {/* Available */}
                <label style={{
                  border: status === 'Available' ? '2px solid #10b981' : '1px solid #e2e8f0',
                  background: status === 'Available' ? '#ecfdf5' : '#ffffff',
                  padding: '12px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s'
                }}>
                  <input
                    type="radio"
                    name="status"
                    value="Available"
                    checked={status === 'Available'}
                    onChange={() => setStatus('Available')}
                    style={{ accentColor: '#10b981' }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.86rem', color: '#047857' }}>
                      🟢 Available
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#059669' }}>Free for queries</div>
                  </div>
                </label>

                {/* Busy */}
                <label style={{
                  border: status === 'Busy' ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                  background: status === 'Busy' ? '#fffbeb' : '#ffffff',
                  padding: '12px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s'
                }}>
                  <input
                    type="radio"
                    name="status"
                    value="Busy"
                    checked={status === 'Busy'}
                    onChange={() => setStatus('Busy')}
                    style={{ accentColor: '#f59e0b' }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.86rem', color: '#b45309' }}>
                      🟡 Busy
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#d97706' }}>In class / meeting</div>
                  </div>
                </label>

                {/* Not Available */}
                <label style={{
                  border: status === 'Not Available' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                  background: status === 'Not Available' ? '#fef2f2' : '#ffffff',
                  padding: '12px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s'
                }}>
                  <input
                    type="radio"
                    name="status"
                    value="Not Available"
                    checked={status === 'Not Available'}
                    onChange={() => setStatus('Not Available')}
                    style={{ accentColor: '#ef4444' }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.86rem', color: '#b91c1c' }}>
                      🔴 Not Available
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#dc2626' }}>Off campus</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Location Sharing / Privacy Toggle */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '14px 16px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {sharingEnabled ? <Shield style={{ width: '16px', height: '16px', color: '#10b981' }} /> : <ShieldOff style={{ width: '16px', height: '16px', color: '#ef4444' }} />}
                  <span>Location Sharing & Privacy</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                  {sharingEnabled
                    ? "Students see full exact room (e.g. CSE Block → Room 204)"
                    : "Students see building only (Exact room masked for privacy)"}
                </div>
              </div>

              <button
                type="button"
                onClick={togglePrivacy}
                style={{
                  background: sharingEnabled ? '#10b981' : '#64748b',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{sharingEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Optional Remarks */}
            <div className="form-group">
              <label className="form-label">Note for Students (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. In cabin for student project reviews"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
              disabled={updating}
            >
              {updating ? (
                <span>Updating Database...</span>
              ) : (
                <>
                  <Send style={{ width: '16px', height: '16px' }} />
                  <span>[ UPDATE LOCATION ]</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Presets */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              QUICK STATUS PRESETS
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                onClick={() => handleQuickPreset('CSE Block', '2nd Floor', '204', 'Available', 'In Cabin 204')}
              >
                📍 Cabin 204 (Available)
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                onClick={() => handleQuickPreset('CSE Block', '2nd Floor', '205', 'Busy', 'Taking Lab Session')}
              >
                📍 Lab 205 (Busy)
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                onClick={() => handleQuickPreset('Main Block', '1st Floor', '101', 'Available', 'In Main Auditorium')}
              >
                📍 Main Block 101
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                onClick={() => handleQuickPreset('Main Block', 'Ground Floor', 'Campus', 'Not Available', 'Left Campus for the day')}
              >
                🚪 Left Campus
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Faculty Today's Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="portal-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Calendar style={{ width: '20px', height: '20px', color: '#2563eb' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                Today's Assigned Schedule (Monday)
              </h3>
            </div>

            {facultyData?.today_timetable && facultyData.today_timetable.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {facultyData.today_timetable.map((slot) => {
                  const isCurrent = slot.start_time <= '10:30' && slot.end_time > '10:30';
                  return (
                    <div
                      key={slot.id}
                      style={{
                        background: isCurrent ? '#eff6ff' : '#f8fafc',
                        border: isCurrent ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '12px 16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{
                          fontSize: '0.76rem',
                          fontWeight: '800',
                          color: isCurrent ? '#1d4ed8' : '#334155'
                        }}>
                          {slot.start_time} – {slot.end_time}
                        </span>
                        {isCurrent && (
                          <span style={{ fontSize: '0.68rem', background: '#2563eb', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                            ACTIVE NOW
                          </span>
                        )}
                      </div>

                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a', marginTop: '4px' }}>
                        {slot.subject_name}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                        Scheduled Room: <strong>{slot.building} - Room {slot.room}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                No scheduled classes today.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
