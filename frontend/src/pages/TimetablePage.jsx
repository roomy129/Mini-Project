import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search, Filter, BookOpen } from 'lucide-react';
import { api } from '../services/api';

export const TimetablePage = ({ onSelectFaculty }) => {
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    fetchTimetableData();
  }, [selectedDay, selectedFaculty]);

  const fetchTimetableData = async () => {
    try {
      setLoading(true);
      const [tData, fData] = await Promise.all([
        api.getTimetable({
          day: selectedDay === 'All' ? null : selectedDay,
          faculty_id: selectedFaculty === 'All' ? null : selectedFaculty
        }),
        api.getFacultyList()
      ]);
      setTimetable(tData.timetable || []);
      setFacultyList(fData.faculty || []);
    } catch (err) {
      console.error("Error loading timetable:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
          College Timetable & Expected Location Schedule
        </h1>
        <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '2px' }}>
          Master academic schedule used by the system to calculate expected faculty locations during class hours.
        </p>
      </div>

      {/* Day Selector Pills */}
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        background: '#ffffff',
        padding: '10px 14px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b', marginRight: '8px' }}>
          Select Day:
        </span>
        {days.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                background: isSelected ? '#2563eb' : '#f1f5f9',
                color: isSelected ? '#ffffff' : '#334155',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: isSelected ? '700' : '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {day}
            </button>
          );
        })}
        <button
          onClick={() => setSelectedDay('All')}
          style={{
            background: selectedDay === 'All' ? '#2563eb' : '#f1f5f9',
            color: selectedDay === 'All' ? '#ffffff' : '#334155',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: selectedDay === 'All' ? '700' : '600',
            cursor: 'pointer'
          }}
        >
          All Days
        </button>

        {/* Faculty Filter */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>
            Faculty:
          </span>
          <select
            className="form-select"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            style={{ width: '220px', padding: '6px 10px', fontSize: '0.82rem' }}
          >
            <option value="All">All Professors</option>
            {facultyList.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timetable Table Card */}
      <div className="portal-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
            Academic Sessions ({selectedDay})
          </h3>
          <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
            Current Demo Reference Time: 10:30 AM
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading schedule...</div>
        ) : timetable.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '10px' }}>
            No timetable entries found for the selected filter.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 14px' }}>Day & Time Slot</th>
                  <th style={{ padding: '12px 14px' }}>Faculty Member</th>
                  <th style={{ padding: '12px 14px' }}>Subject & Course</th>
                  <th style={{ padding: '12px 14px' }}>Expected Location</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((row) => {
                  const isCurrent = selectedDay === 'Monday' && row.start_time <= '10:30' && row.end_time > '10:30';
                  return (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: isCurrent ? '#eff6ff' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: '800', color: '#1e3a8a' }}>
                          {row.day_of_week}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: isCurrent ? '#2563eb' : '#64748b', fontWeight: '600' }}>
                          {row.start_time} – {row.end_time}
                        </div>
                      </td>

                      <td style={{ padding: '14px' }}>
                        <div
                          style={{ fontWeight: '700', color: '#0f172a', cursor: onSelectFaculty ? 'pointer' : 'default' }}
                          onClick={() => onSelectFaculty && onSelectFaculty(row.faculty_id)}
                        >
                          {row.faculty_name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          {row.department}
                        </div>
                      </td>

                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: '700', color: '#334155' }}>
                          {row.subject_name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          {row.subject_code || 'Free Period'}
                        </div>
                      </td>

                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: '800', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin style={{ width: '15px', height: '15px', color: '#2563eb' }} />
                          <span>{row.building} → Room {row.room}</span>
                        </div>
                      </td>

                      <td style={{ padding: '14px' }}>
                        {isCurrent ? (
                          <span style={{
                            background: '#dbeafe',
                            color: '#1d4ed8',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            border: '1px solid #93c5fd'
                          }}>
                            ● ACTIVE PERIOD
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.76rem' }}>
                            Scheduled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
