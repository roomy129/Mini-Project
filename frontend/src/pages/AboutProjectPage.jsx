import React from 'react';
import { Info, CheckCircle2, AlertTriangle, Sparkles, Layers, Cpu, Database, Globe, Smartphone, ShieldCheck } from 'lucide-react';

export const AboutProjectPage = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px' }}>
      {/* Header */}
      <div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#eff6ff',
          color: '#1d4ed8',
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '0.74rem',
          fontWeight: '700',
          marginBottom: '8px'
        }}>
          <Info style={{ width: '14px', height: '14px' }} />
          ACADEMIC MINI PROJECT SPECIFICATION
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
          Smart Faculty Location & Availability Tracking System
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#64748b', marginTop: '4px' }}>
          College ERP portal module designed to streamline faculty discovery, communicate real-time availability, and reconcile manual reports with scheduled timetables.
        </p>
      </div>

      {/* Problem & Solution Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {/* Problem */}
        <div className="portal-card" style={{ padding: '24px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ background: '#fef2f2', color: '#dc2626', padding: '6px', borderRadius: '8px' }}>
              <AlertTriangle style={{ width: '18px', height: '18px' }} />
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
              The Problem
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.6' }}>
            In large college campuses, students frequently waste significant academic time searching for faculty members across multiple classrooms, computer labs, staff rooms, and departmental blocks for project reviews, doubt clarifications, and approvals.
          </p>
        </div>

        {/* Solution */}
        <div className="portal-card" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ background: '#ecfdf5', color: '#059669', padding: '6px', borderRadius: '8px' }}>
              <CheckCircle2 style={{ width: '18px', height: '18px' }} />
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
              The Solution
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.6' }}>
            A lightweight college portal module where faculty members can manually broadcast their current location and availability status with a single click. The system compares manual location against timetables to alert students of schedule deviations and respects faculty privacy.
          </p>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="portal-card" style={{ padding: '26px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles style={{ width: '20px', height: '20px', color: '#2563eb' }} />
          <span>Core System Features</span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          {[
            { title: 'Manual Location Updates', desc: 'Faculty select building, floor, and room with quick 1-click status presets.' },
            { title: 'Availability Status', desc: 'Real-time indicators for Available (🟢), Busy (🟡), and Not Available (🔴).' },
            { title: 'Student Faculty Search', desc: 'Fast filtering by faculty name, academic department, and campus building.' },
            { title: 'Timetable Discrepancy Detection', desc: 'Automatically compares live manual report against schedule and flags differences.' },
            { title: 'Location Privacy Protection', desc: 'Faculty can toggle sharing OFF to hide exact room while showing building presence.' },
            { title: 'Campus Schematic Map', desc: 'Pure HTML/CSS building block visualization with live occupant count.' },
            { title: 'Admin Master Management', desc: 'Complete CRUD administration for students, professors, timetables, and rooms.' },
            { title: 'Last Updated Timestamps', desc: 'Transparent relative time display so students know how recent the report is.' }
          ].map((item, idx) => (
            <div key={idx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#1e3a8a', marginBottom: '4px' }}>
                ✓ {item.title}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Project Architecture */}
      <div className="portal-card" style={{ padding: '26px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers style={{ width: '20px', height: '20px', color: '#2563eb' }} />
          <span>System Architecture & Technology Stack</span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          <div style={{ background: '#eff6ff', padding: '18px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontWeight: '800', color: '#1e40af', fontSize: '0.94rem' }}>Frontend</div>
            <div style={{ fontSize: '0.84rem', color: '#334155', marginTop: '6px' }}>
              React.js, Modern CSS Design System, Lucide Icons, Vite
            </div>
          </div>

          <div style={{ background: '#f0fdf4', padding: '18px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontWeight: '800', color: '#166534', fontSize: '0.94rem' }}>Backend</div>
            <div style={{ fontSize: '0.84rem', color: '#334155', marginTop: '6px' }}>
              Python Flask REST API, Werkzeug Password Hashing, JWT Auth
            </div>
          </div>

          <div style={{ background: '#faf5ff', padding: '18px', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
            <div style={{ fontWeight: '800', color: '#6b21a8', fontSize: '0.94rem' }}>Database</div>
            <div style={{ fontSize: '0.84rem', color: '#334155', marginTop: '6px' }}>
              Relational SQLite (Zero external cloud db dependencies)
            </div>
          </div>
        </div>
      </div>

      {/* Limitations Section */}
      <div className="portal-card" style={{ padding: '26px', borderLeft: '4px solid #f59e0b' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle style={{ width: '20px', height: '20px', color: '#d97706' }} />
          <span>System Limitations (Mini-Project Scope)</span>
        </h3>
        <ol style={{ paddingLeft: '20px', fontSize: '0.86rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li><strong>Manual Reporting Dependency:</strong> Faculty location accuracy relies on manual updates by staff.</li>
          <li><strong>No Continuous GPS Tracking:</strong> Designed intentionally without satellite GPS or invasive tracking.</li>
          <li><strong>No Automatic Indoor Positioning:</strong> Mini-project does not include IoT sensors or hardware beacons.</li>
          <li><strong>Potential Information Staleness:</strong> Data may become outdated if faculty forgets to update on departure.</li>
          <li><strong>Timetable Approximation:</strong> Timetable reflects scheduled classes which may change dynamically.</li>
          <li><strong>Network Dependency:</strong> Requires standard local college intranet or web connectivity.</li>
          <li><strong>Initial Administrative Setup:</strong> Requires room, building, and timetable configuration in database.</li>
        </ol>
      </div>

      {/* Future Enhancements */}
      <div className="portal-card" style={{ padding: '26px', borderLeft: '4px solid #8b5cf6' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Smartphone style={{ width: '20px', height: '20px', color: '#7c3aed' }} />
          <span>Future Enhancements (Post-Demo Roadmap)</span>
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {[
            '📱 Native Mobile App (Android / iOS)',
            '📡 Wi-Fi & BLE Beacon Indoor Positioning',
            '🤖 AI-based Availability Prediction Engine',
            '🔔 Push Notifications for Faculty Arrival',
            '🧭 Turn-by-Turn Indoor Campus Navigation',
            '📅 Google Calendar / Outlook Sync',
            '🔒 Biometric Room Access Integration'
          ].map((enh, i) => (
            <div key={i} style={{ background: '#f5f3ff', padding: '12px', borderRadius: '8px', fontSize: '0.84rem', color: '#5b21b6', fontWeight: '600' }}>
              {enh}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
