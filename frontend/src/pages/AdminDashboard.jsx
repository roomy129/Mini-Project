import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Building, MapPin, Calendar, Plus, Trash2, Edit2, CheckCircle2, AlertTriangle, RefreshCw, Shield, Search } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { api } from '../services/api';

export const AdminDashboard = ({ initialTab = 'overview', addToast }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [stats, setStats] = useState(null);
  const [facultyLocations, setFacultyLocations] = useState([]);
  const [students, setStudents] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddTimetableOpen, setIsAddTimetableOpen] = useState(false);

  // Faculty Form
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    email: '',
    department: 'Computer Science and Engineering',
    designation: 'Assistant Professor',
    phone: '',
    cabin_room: '',
    username: '',
    password: 'faculty123'
  });

  // Student Form
  const [studentForm, setStudentForm] = useState({
    name: '',
    roll_number: '',
    department: 'Computer Science and Engineering',
    semester: 6,
    section: 'A',
    email: '',
    password: 'student123'
  });

  // Timetable Form
  const [timetableForm, setTimetableForm] = useState({
    faculty_id: '',
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '10:00',
    subject_code: '',
    subject_name: '',
    building: 'CSE Block',
    room: '204'
  });

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [statsData, facLocsData, studentsData, timetableData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminFacultyLocations(),
        api.getStudents(),
        api.getTimetable()
      ]);
      setStats(statsData.stats);
      setFacultyLocations(facLocsData.faculty_locations || []);
      setStudents(studentsData.students || []);
      setTimetable(timetableData.timetable || []);
      if (facLocsData.faculty_locations?.length > 0 && !timetableForm.faculty_id) {
        setTimetableForm(prev => ({ ...prev, faculty_id: facLocsData.faculty_locations[0].id }));
      }
    } catch (err) {
      console.error("Error loading admin dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    try {
      await api.createFaculty(facultyForm);
      setIsAddFacultyOpen(false);
      setFacultyForm({
        name: '',
        email: '',
        department: 'Computer Science and Engineering',
        designation: 'Assistant Professor',
        phone: '',
        cabin_room: '',
        username: '',
        password: 'faculty123'
      });
      if (addToast) {
        addToast({
          type: 'success',
          title: 'Faculty Added',
          message: `Created faculty profile for ${facultyForm.name}`
        });
      }
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteFaculty = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.deleteFaculty(id);
      if (addToast) {
        addToast({
          type: 'success',
          title: 'Faculty Deleted',
          message: `Deleted record for ${name}`
        });
      }
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      await api.createStudent(studentForm);
      setIsAddStudentOpen(false);
      setStudentForm({
        name: '',
        roll_number: '',
        department: 'Computer Science and Engineering',
        semester: 6,
        section: 'A',
        email: '',
        password: 'student123'
      });
      if (addToast) {
        addToast({
          type: 'success',
          title: 'Student Enrolled',
          message: `Added student ${studentForm.name} (${studentForm.roll_number})`
        });
      }
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Delete student record for ${name}?`)) return;
    try {
      await api.deleteStudent(id);
      if (addToast) {
        addToast({
          type: 'success',
          title: 'Student Removed',
          message: `Deleted record for ${name}`
        });
      }
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateTimetable = async (e) => {
    e.preventDefault();
    try {
      await api.addTimetableEntry(timetableForm);
      setIsAddTimetableOpen(false);
      if (addToast) {
        addToast({
          type: 'success',
          title: 'Timetable Slot Added',
          message: `Added schedule for ${timetableForm.subject_name}`
        });
      }
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTimetable = async (id) => {
    if (!window.confirm('Delete this timetable entry?')) return;
    try {
      await api.deleteTimetableEntry(id);
      if (addToast) {
        addToast({
          type: 'success',
          title: 'Timetable Slot Deleted',
          message: 'Schedule entry removed.'
        });
      }
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Admin Title & Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
            College Administration Dashboard
          </h1>
          <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
            System overview, faculty live locations matrix, and portal master data management.
          </p>
        </div>

        <button
          onClick={loadAllAdminData}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw style={{ width: '15px', height: '15px' }} />
          <span>Refresh All Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div className="portal-card" style={{ padding: '18px', borderLeft: '4px solid #2563eb' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>TOTAL FACULTY</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e3a8a', marginTop: '6px' }}>
            {stats?.total_faculty || 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#2563eb', marginTop: '2px' }}>Registered professors</div>
        </div>

        <div className="portal-card" style={{ padding: '18px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>AVAILABLE NOW</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#047857', marginTop: '6px' }}>
            {stats?.available_faculty || 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '2px' }}>In office or labs</div>
        </div>

        <div className="portal-card" style={{ padding: '18px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>BUSY FACULTY</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#b45309', marginTop: '6px' }}>
            {stats?.busy_faculty || 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#d97706', marginTop: '2px' }}>In class / practicals</div>
        </div>

        <div className="portal-card" style={{ padding: '18px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>ENROLLED STUDENTS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#6d28d9', marginTop: '6px' }}>
            {stats?.total_students || 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#7c3aed', marginTop: '2px' }}>Active student portals</div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '2px', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'overview' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'overview' ? '#1d4ed8' : '#64748b',
            fontWeight: activeTab === 'overview' ? '800' : '600',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          📍 Faculty Location Matrix
        </button>

        <button
          onClick={() => setActiveTab('faculty')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'faculty' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'faculty' ? '#1d4ed8' : '#64748b',
            fontWeight: activeTab === 'faculty' ? '800' : '600',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          👥 Manage Faculty ({facultyLocations.length})
        </button>

        <button
          onClick={() => setActiveTab('students')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'students' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'students' ? '#1d4ed8' : '#64748b',
            fontWeight: activeTab === 'students' ? '800' : '600',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          👨‍🎓 Manage Students ({students.length})
        </button>

        <button
          onClick={() => setActiveTab('timetable')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'timetable' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'timetable' ? '#1d4ed8' : '#64748b',
            fontWeight: activeTab === 'timetable' ? '800' : '600',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          📅 Timetable Management ({timetable.length})
        </button>
      </div>

      {/* TAB 1: FACULTY LOCATION MATRIX */}
      {activeTab === 'overview' && (
        <div className="portal-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
              Real-time Faculty Location Matrix
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Showing live reported status for all {facultyLocations.length} staff
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 14px' }}>Faculty Name</th>
                  <th style={{ padding: '12px 14px' }}>Department</th>
                  <th style={{ padding: '12px 14px' }}>Current Location</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px' }}>Sharing</th>
                  <th style={{ padding: '12px 14px' }}>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {facultyLocations.map((f) => (
                  <tr key={f.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                      {f.name}
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '400' }}>
                        {f.designation}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>
                      {f.department}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#1e3a8a' }}>
                      {f.building_name} → {f.floor} → Room {f.room}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <StatusBadge status={f.status} sharingEnabled={true} size="sm" />
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {f.sharing_enabled !== 0 ? (
                        <span style={{ color: '#059669', fontSize: '0.76rem', fontWeight: '700' }}>● Public</span>
                      ) : (
                        <span style={{ color: '#dc2626', fontSize: '0.76rem', fontWeight: '700' }}>🔒 Restricted</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#64748b' }}>
                      {f.updated_at ? new Date(f.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:35 AM'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE FACULTY */}
      {activeTab === 'faculty' && (
        <div className="portal-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
              Faculty Directory
            </h3>
            <button
              onClick={() => setIsAddFacultyOpen(true)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              <span>Add New Faculty</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 14px' }}>Name & Designation</th>
                  <th style={{ padding: '12px 14px' }}>Email & Phone</th>
                  <th style={{ padding: '12px 14px' }}>Department</th>
                  <th style={{ padding: '12px 14px' }}>Cabin</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {facultyLocations.map((f) => (
                  <tr key={f.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{f.name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#2563eb' }}>{f.designation}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#475569' }}>
                      <div>{f.email}</div>
                      <div>{f.phone}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>
                      {f.department}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>
                      {f.cabin_room}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteFaculty(f.id, f.name)}
                        style={{
                          background: '#fee2e2',
                          border: 'none',
                          color: '#dc2626',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          fontWeight: '600'
                        }}
                      >
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE STUDENTS */}
      {activeTab === 'students' && (
        <div className="portal-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
              Enrolled Students
            </h3>
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              <span>Register Student</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 14px' }}>Roll Number</th>
                  <th style={{ padding: '12px 14px' }}>Student Name</th>
                  <th style={{ padding: '12px 14px' }}>Department</th>
                  <th style={{ padding: '12px 14px' }}>Semester / Sec</th>
                  <th style={{ padding: '12px 14px' }}>Email</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#1e3a8a' }}>
                      {s.roll_number}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                      {s.name}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>
                      {s.department}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>
                      Sem {s.semester} • Sec {s.section}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>
                      {s.email || 'N/A'}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteStudent(s.id, s.name)}
                        style={{
                          background: '#fee2e2',
                          border: 'none',
                          color: '#dc2626',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MANAGE TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="portal-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
              Timetable Entries
            </h3>
            <button
              onClick={() => setIsAddTimetableOpen(true)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              <span>Add Timetable Slot</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 14px' }}>Faculty</th>
                  <th style={{ padding: '12px 14px' }}>Day & Time</th>
                  <th style={{ padding: '12px 14px' }}>Subject</th>
                  <th style={{ padding: '12px 14px' }}>Building & Room</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                      {t.faculty_name}
                      <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '400' }}>{t.department}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontWeight: '700', color: '#1e3a8a' }}>{t.day_of_week}</span>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{t.start_time} – {t.end_time}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#334155' }}>
                      {t.subject_name} ({t.subject_code})
                    </td>
                    <td style={{ padding: '12px 14px', color: '#2563eb', fontWeight: '600' }}>
                      {t.building} - Room {t.room}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteTimetable(t.id)}
                        style={{
                          background: '#fee2e2',
                          border: 'none',
                          color: '#dc2626',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD FACULTY */}
      <Modal
        isOpen={isAddFacultyOpen}
        onClose={() => setIsAddFacultyOpen(false)}
        title="Add New Faculty Member"
        subtitle="Create faculty record and login credentials"
      >
        <form onSubmit={handleCreateFaculty}>
          <div className="form-group">
            <label className="form-label">Full Name with Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. Ramesh Gupta"
              value={facultyForm.name}
              onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                className="form-select"
                value={facultyForm.department}
                onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })}
              >
                <option value="Computer Science and Engineering">Computer Science & Engg</option>
                <option value="Electronics and Communication">Electronics & Communication</option>
                <option value="Electrical and Electronics">Electrical & Electronics</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Designation *</label>
              <select
                className="form-select"
                value={facultyForm.designation}
                onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
              >
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Professor">Professor</option>
                <option value="Professor & HOD">Professor & HOD</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="ramesh@college.edu"
                value={facultyForm.email}
                onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="+91 98765 43210"
                value={facultyForm.phone}
                onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Default Cabin / Office Room</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CSE Block - 204"
              value={facultyForm.cabin_room}
              onChange={(e) => setFacultyForm({ ...facultyForm, cabin_room: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px', padding: '12px' }}>
            Create Faculty Record
          </button>
        </form>
      </Modal>

      {/* MODAL: ADD STUDENT */}
      <Modal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        title="Register New Student"
        subtitle="Enroll student in college database"
      >
        <form onSubmit={handleCreateStudent}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Ananya Patel"
              value={studentForm.name}
              onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Roll Number *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 21CS099"
                value={studentForm.roll_number}
                onChange={(e) => setStudentForm({ ...studentForm, roll_number: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                className="form-select"
                value={studentForm.department}
                onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
              >
                <option value="Computer Science and Engineering">Computer Science & Engg</option>
                <option value="Electronics and Communication">Electronics & Communication</option>
                <option value="Electrical and Electronics">Electrical & Electronics</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Semester</label>
              <select
                className="form-select"
                value={studentForm.semester}
                onChange={(e) => setStudentForm({ ...studentForm, semester: Number(e.target.value) })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Section</label>
              <input
                type="text"
                className="form-input"
                placeholder="A / B / C"
                value={studentForm.section}
                onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px', padding: '12px' }}>
            Register Student
          </button>
        </form>
      </Modal>

      {/* MODAL: ADD TIMETABLE */}
      <Modal
        isOpen={isAddTimetableOpen}
        onClose={() => setIsAddTimetableOpen(false)}
        title="Add Timetable Slot"
        subtitle="Assign a class/lab schedule to a faculty member"
      >
        <form onSubmit={handleCreateTimetable}>
          <div className="form-group">
            <label className="form-label">Assign to Faculty *</label>
            <select
              className="form-select"
              value={timetableForm.faculty_id}
              onChange={(e) => setTimetableForm({ ...timetableForm, faculty_id: e.target.value })}
              required
            >
              {facultyLocations.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Day of Week *</label>
              <select
                className="form-select"
                value={timetableForm.day_of_week}
                onChange={(e) => setTimetableForm({ ...timetableForm, day_of_week: e.target.value })}
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Subject Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Distributed Systems"
                value={timetableForm.subject_name}
                onChange={(e) => setTimetableForm({ ...timetableForm, subject_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Start Time *</label>
              <input
                type="time"
                className="form-input"
                value={timetableForm.start_time}
                onChange={(e) => setTimetableForm({ ...timetableForm, start_time: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Time *</label>
              <input
                type="time"
                className="form-input"
                value={timetableForm.end_time}
                onChange={(e) => setTimetableForm({ ...timetableForm, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Scheduled Building *</label>
              <select
                className="form-select"
                value={timetableForm.building}
                onChange={(e) => setTimetableForm({ ...timetableForm, building: e.target.value })}
              >
                <option value="CSE Block">CSE Block</option>
                <option value="ECE Block">ECE Block</option>
                <option value="EEE Block">EEE Block</option>
                <option value="Main Block">Main Block</option>
                <option value="Science Block">Science Block</option>
                <option value="Library Block">Library Block</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Room Number *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 204 or Lab 1"
                value={timetableForm.room}
                onChange={(e) => setTimetableForm({ ...timetableForm, room: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px', padding: '12px' }}>
            Save Timetable Slot
          </button>
        </form>
      </Modal>
    </div>
  );
};
