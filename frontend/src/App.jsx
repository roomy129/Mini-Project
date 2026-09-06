import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { FindFacultyPage } from './pages/FindFacultyPage';
import { FacultyDetailsPage } from './pages/FacultyDetailsPage';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { TimetablePage } from './pages/TimetablePage';
import { CampusMapPage } from './pages/CampusMapPage';
import { AboutProjectPage } from './pages/AboutProjectPage';
import { ProfilePage } from './pages/ProfilePage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DemoModeBar } from './components/DemoModeBar';
import { ToastContainer } from './components/Toast';

export function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('student_dashboard');
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [facultyFilterParams, setFacultyFilterParams] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [toasts, setToasts] = useState([]);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);

  // Set default tab on user change or login
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        setActiveTab('admin_dashboard');
      } else if (user.role === 'faculty') {
        setActiveTab('faculty_dashboard');
      } else {
        setActiveTab('student_dashboard');
      }
    }
  }, [user?.role]);

  const addToast = ({ type = 'info', title = '', message = '' }) => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigate = (tabId, params = {}) => {
    if (params) setFacultyFilterParams(params);
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFaculty = (facultyId) => {
    setSelectedFacultyId(facultyId);
    setActiveTab('faculty_details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerDataRefresh = () => {
    setDataRefreshKey((k) => k + 1);
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#94a3b8' }}>
            Loading Smart Faculty Tracker...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginPage addToast={addToast} />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Presentation Demo Mode Top Bar */}
        <DemoModeBar onActionComplete={triggerDataRefresh} addToast={addToast} />

        {/* Sticky Portal Navbar */}
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Dynamic Page Container */}
        <main className="page-container" key={dataRefreshKey}>
          {/* Student Views */}
          {activeTab === 'student_dashboard' && (
            <StudentDashboard
              onNavigate={handleNavigate}
              onSelectFaculty={handleSelectFaculty}
            />
          )}

          {activeTab === 'find_faculty' && (
            <FindFacultyPage
              initialFilters={facultyFilterParams}
              onSelectFaculty={handleSelectFaculty}
              addToast={addToast}
            />
          )}

          {activeTab === 'faculty_details' && (
            <FacultyDetailsPage
              facultyId={selectedFacultyId || 1}
              onBack={() => handleNavigate(user.role === 'faculty' ? 'faculty_dashboard' : 'find_faculty')}
              addToast={addToast}
            />
          )}

          {/* Faculty Views */}
          {activeTab === 'faculty_dashboard' && (
            <FacultyDashboard addToast={addToast} />
          )}

          {/* Admin Views */}
          {activeTab === 'admin_dashboard' && (
            <AdminDashboard initialTab="overview" addToast={addToast} />
          )}

          {activeTab === 'admin_faculty_locations' && (
            <AdminDashboard initialTab="overview" addToast={addToast} />
          )}

          {activeTab === 'admin_manage_faculty' && (
            <AdminDashboard initialTab="faculty" addToast={addToast} />
          )}

          {activeTab === 'admin_manage_students' && (
            <AdminDashboard initialTab="students" addToast={addToast} />
          )}

          {/* Shared Views */}
          {activeTab === 'timetable' && (
            <TimetablePage onSelectFaculty={handleSelectFaculty} />
          )}

          {activeTab === 'campus_map' && (
            <CampusMapPage onSelectFaculty={handleSelectFaculty} />
          )}

          {activeTab === 'about' && (
            <AboutProjectPage />
          )}

          {activeTab === 'profile' && (
            <ProfilePage />
          )}
        </main>
      </div>

      {/* Floating Global Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
