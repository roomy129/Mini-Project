import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  CalendarDays,
  MapPin,
  User,
  Info,
  Users,
  Building,
  GraduationCap,
  Sparkles,
  Layers,
  Map
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const role = user?.role || 'student';

  const getMenuItems = () => {
    if (role === 'admin') {
      return [
        { id: 'admin_dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
        { id: 'admin_faculty_locations', label: 'Faculty Locations', icon: MapPin },
        { id: 'admin_manage_faculty', label: 'Manage Faculty', icon: Users },
        { id: 'admin_manage_students', label: 'Manage Students', icon: GraduationCap },
        { id: 'timetable', label: 'Timetable Schedule', icon: CalendarDays },
        { id: 'campus_map', label: 'Campus Map', icon: Map },
        { id: 'about', label: 'About Project', icon: Info },
        { id: 'profile', label: 'Admin Profile', icon: User },
      ];
    } else if (role === 'faculty') {
      return [
        { id: 'faculty_dashboard', label: 'Update My Location', icon: MapPin },
        { id: 'find_faculty', label: 'Find Faculty', icon: Search },
        { id: 'timetable', label: 'Timetable', icon: CalendarDays },
        { id: 'campus_map', label: 'Campus Map', icon: Map },
        { id: 'about', label: 'About Project', icon: Info },
        { id: 'profile', label: 'My Profile', icon: User },
      ];
    } else {
      // Student
      return [
        { id: 'student_dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'find_faculty', label: 'Find Faculty', icon: Search, badge: 'Main' },
        { id: 'timetable', label: 'Timetable', icon: CalendarDays },
        { id: 'campus_map', label: 'Campus Map', icon: Map },
        { id: 'about', label: 'About Project', icon: Info },
        { id: 'profile', label: 'Profile', icon: User },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside style={{
      width: '260px',
      background: '#ffffff',
      borderRight: '1px solid var(--border-color)',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 35,
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 16px',
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s ease',
      boxShadow: '2px 0 8px 0 rgba(0,0,0,0.02)'
    }} className="sidebar-container">
      {/* College Logo in Sidebar Header */}
      <div style={{
        padding: '0 8px 24px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#1e3a8a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Building style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#1e3a8a', lineHeight: '1.2' }}>
              CAMPUS ERP
            </h2>
            <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>
              Faculty Tracker v1.0
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <div style={{
          fontSize: '0.68rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#94a3b8',
          padding: '8px 12px 4px'
        }}>
          NAVIGATION
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#eff6ff' : 'transparent',
                color: isActive ? '#1d4ed8' : '#334155',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.88rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.background = '#f8fafc';
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon style={{
                  width: '18px',
                  height: '18px',
                  color: isActive ? '#2563eb' : '#64748b'
                }} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '0.68rem',
                  background: '#2563eb',
                  color: '#ffffff',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  fontWeight: '700'
                }}>
                  {item.badge}
                </span>
              )}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '6px',
                  bottom: '6px',
                  width: '4px',
                  borderRadius: '0 4px 4px 0',
                  background: '#2563eb'
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Role Pill Footer */}
      <div style={{
        marginTop: 'auto',
        padding: '14px',
        borderRadius: '10px',
        background: '#f8fafc',
        border: '1px solid var(--border-color)',
        fontSize: '0.78rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
          <span style={{ fontWeight: '700', color: '#0f172a' }}>Live System Active</span>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.72rem' }}>
          Manual updates & timetable sync enabled.
        </p>
      </div>
    </aside>
  );
};
